import os

from django.apps import apps
from django.conf import settings
from django.core.management.base import BaseCommand
from django.db import models, transaction

from core.image_utils import (
    CONVERTIBLE_EXTENSIONS,
    data_url_to_webp_bytes,
    image_to_webp_bytes,
    webp_name,
)


class Command(BaseCommand):
    help = (
        "Convert existing JPG/PNG uploads and base64 data-URL images to WebP and "
        "update database references. Originals are kept unless --delete-originals is given."
    )

    def add_arguments(self, parser):
        parser.add_argument('--dry-run', action='store_true', help='Report only; change nothing.')
        parser.add_argument('--delete-originals', action='store_true',
                            help='Delete original files after their references were updated.')

    def handle(self, *args, **opts):
        dry = opts['dry_run']
        uploads_dir = os.path.join(settings.MEDIA_ROOT, 'uploads')
        media_url = settings.MEDIA_URL
        url_map = {}  # old media path (/media/uploads/x.png) -> new
        converted_files = 0

        # 1) Convert files on disk
        if os.path.isdir(uploads_dir):
            for name in sorted(os.listdir(uploads_dir)):
                stem, ext = os.path.splitext(name)
                if ext.lower() not in CONVERTIBLE_EXTENSIONS:
                    continue
                src = os.path.join(uploads_dir, name)
                dst_name = f"{stem}.webp"
                dst = os.path.join(uploads_dir, dst_name)
                try:
                    if not os.path.exists(dst) and not dry:
                        with open(src, 'rb') as fh:
                            data = image_to_webp_bytes(fh)
                        with open(dst, 'wb') as out:
                            out.write(data)
                    url_map[f"{media_url}uploads/{name}"] = f"{media_url}uploads/{dst_name}"
                    converted_files += 1
                except Exception as exc:  # unreadable image: leave untouched
                    self.stderr.write(f"Skipped {name}: {exc}")

        # 2) Update DB text fields (URL references + base64 data URLs)
        updated_rows = 0
        data_urls = 0
        with transaction.atomic():
            for model in apps.get_app_config('core').get_models():
                fields = [f for f in model._meta.get_fields()
                          if isinstance(f, (models.CharField, models.TextField)) and not f.primary_key]
                for obj in model.objects.all():
                    changed = []
                    for f in fields:
                        value = getattr(obj, f.name, None)
                        if not value or not isinstance(value, str):
                            continue
                        new_value = value
                        for old, new in url_map.items():
                            if old in new_value:
                                new_value = new_value.replace(old, new)
                        if new_value.startswith('data:image/'):
                            webp = data_url_to_webp_bytes(new_value)
                            if webp:
                                fname = webp_name(f"{model.__name__}_{f.name}")
                                if not dry:
                                    os.makedirs(uploads_dir, exist_ok=True)
                                    with open(os.path.join(uploads_dir, fname), 'wb') as out:
                                        out.write(webp)
                                new_value = f"{media_url}uploads/{fname}"
                                data_urls += 1
                        if new_value != value:
                            setattr(obj, f.name, new_value)
                            changed.append(f.name)
                    if changed:
                        updated_rows += 1
                        if not dry:
                            obj.save(update_fields=changed)
            if dry:
                transaction.set_rollback(True)

        if opts['delete_originals'] and not dry:
            for old in url_map:
                path = os.path.join(settings.MEDIA_ROOT, old[len(media_url):])
                if os.path.exists(path):
                    os.remove(path)

        prefix = '[dry-run] ' if dry else ''
        self.stdout.write(self.style.SUCCESS(
            f"{prefix}Files converted: {converted_files}, "
            f"base64 images converted: {data_urls}, DB rows updated: {updated_rows}"
        ))
