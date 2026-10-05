import sys
from django.core.management.base import BaseCommand
from django.core.management import call_command
from core.models import SliderSlide, AboutInfo, StaffMember, Notice, Club, GalleryItem


class Command(BaseCommand):
    help = "Initializes production database with superuser, institutional data, and faculty if empty"

    def add_arguments(self, parser):
        parser.add_argument(
            '--force',
            action='store_true',
            help='Force re-seeding even if data already exists in the database',
        )

    def handle(self, *args, **options):
        force = options.get('force', False)
        self.stdout.write("Running production database initialization check...")

        # 1. Setup Admin Superuser (never resets password on normal boot)
        call_command('setup_admin')

        # 2. Check existing institutional content
        has_existing_content = (
            SliderSlide.objects.exists()
            or AboutInfo.objects.exists()
            or Notice.objects.exists()
            or Club.objects.exists()
            or GalleryItem.objects.exists()
        )
        has_faculty = StaffMember.objects.exists()

        if not has_existing_content or force:
            if force:
                self.stdout.write(self.style.WARNING("Force flag active: Re-seeding baseline institutional data..."))
                call_command('seed_data', clean=True)
            else:
                self.stdout.write("Fresh database detected: Seeding baseline institutional data...")
                call_command('seed_data')
        else:
            self.stdout.write(self.style.SUCCESS("Existing institutional data detected. Preserving database and skipping re-seed."))

        # 3. Seed faculty if empty
        if not has_faculty or force:
            self.stdout.write("Seeding faculty and administration members...")
            try:
                from seed_faculty import MEMBERS
                if force:
                    StaffMember.objects.all().delete()
                created_count = 0
                for data in MEMBERS:
                    _, created = StaffMember.objects.get_or_create(
                        name=data['name'],
                        designation=data['designation'],
                        defaults=data
                    )
                    if created:
                        created_count += 1
                self.stdout.write(self.style.SUCCESS(f"Verified faculty/staff records ({created_count} created)."))
            except Exception as e:
                self.stdout.write(self.style.WARNING(f"Faculty seeding notice: {e}"))
        else:
            self.stdout.write(self.style.SUCCESS("Faculty and staff records already present. Preserving live directory."))

        self.stdout.write(self.style.SUCCESS("Production database initialization complete!"))
