from django.db import migrations

def sanitize_notice_attachments(apps, schema_editor):
    Notice = apps.get_model('core', 'Notice')
    for notice in Notice.objects.all():
        if notice.attachment_url and ('w3.org' in notice.attachment_url or 'dummy.pdf' in notice.attachment_url):
            notice.attachment_url = '/circulars/sjis-official-circular.pdf'
            notice.save(update_fields=['attachment_url'])

def reverse_sanitize(apps, schema_editor):
    pass

class Migration(migrations.Migration):

    dependencies = [
        ('core', '0009_aboutinfo_head_role_badge_aboutinfo_heritage_label_and_more'),
    ]

    operations = [
        migrations.RunPython(sanitize_notice_attachments, reverse_sanitize),
    ]
