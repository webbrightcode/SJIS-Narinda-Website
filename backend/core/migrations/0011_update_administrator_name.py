from django.db import migrations


def update_administrator_name(apps, schema_editor):
    AboutInfo = apps.get_model('core', 'AboutInfo')
    for about in AboutInfo.objects.all():
        if not about.principal_name or 'Leo Pereira' in about.principal_name:
            about.principal_name = 'Brother Roktim Chiran, CSC'
            about.save(update_fields=['principal_name'])

    StaffMember = apps.get_model('core', 'StaffMember')
    for staff in StaffMember.objects.all():
        if 'Leo Pereira' in staff.name:
            staff.name = 'Brother Roktim Chiran, CSC'
            if staff.bio and 'Brother Leo' in staff.bio:
                staff.bio = staff.bio.replace('Brother Leo', 'Brother Roktim')
            staff.save()


def reverse_update(apps, schema_editor):
    pass


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0010_fix_w3_notice_attachments'),
    ]

    operations = [
        migrations.RunPython(update_administrator_name, reverse_update),
    ]
