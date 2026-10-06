from django.db import migrations


def update_administrator_details(apps, schema_editor):
    AboutInfo = apps.get_model('core', 'AboutInfo')
    StaffMember = apps.get_model('core', 'StaffMember')

    default_image = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=800&auto=format&fit=crop'
    head = StaffMember.objects.filter(is_featured=True, role_type='admin').first()
    image_to_use = head.image_url if (head and head.image_url) else default_image

    for about in AboutInfo.objects.all():
        about.principal_title = 'Administrator'
        if not about.principal_image_url or not about.principal_image_url.strip():
            about.principal_image_url = image_to_use
        about.save(update_fields=['principal_title', 'principal_image_url'])


def reverse_update(apps, schema_editor):
    pass


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0015_club_gallery_images'),
    ]

    operations = [
        migrations.RunPython(update_administrator_details, reverse_update),
    ]
