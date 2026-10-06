from django.db import migrations


def ensure_administrator_photo(apps, schema_editor):
    AboutInfo = apps.get_model('core', 'AboutInfo')
    StaffMember = apps.get_model('core', 'StaffMember')

    official_photo = '/administrator-roktim.webp'

    # Update Brother Roktim in StaffMember if image is missing or Unsplash
    for staff in StaffMember.objects.filter(role_type='admin'):
        if 'roktim' in (staff.name or '').lower():
            if not staff.image_url or 'unsplash.com' in staff.image_url:
                staff.image_url = official_photo
                staff.save(update_fields=['image_url'])

    # Update AboutInfo if principal_image_url is missing or Unsplash
    for about in AboutInfo.objects.all():
        if not about.principal_image_url or 'unsplash.com' in about.principal_image_url:
            about.principal_image_url = official_photo
            about.save(update_fields=['principal_image_url'])


def reverse_func(apps, schema_editor):
    pass


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0019_add_about_page_fields'),
    ]

    operations = [
        migrations.RunPython(ensure_administrator_photo, reverse_func),
    ]
