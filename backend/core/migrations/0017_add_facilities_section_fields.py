from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0016_update_administrator_title_and_image'),
    ]

    operations = [
        migrations.AddField(
            model_name='aboutinfo',
            name='facilities_badge',
            field=models.CharField(blank=True, default='Modern Infrastructure', max_length=150),
        ),
        migrations.AddField(
            model_name='aboutinfo',
            name='facilities_title',
            field=models.CharField(blank=True, default='World-Class Campus Facilities', max_length=255),
        ),
        migrations.AddField(
            model_name='aboutinfo',
            name='facilities_subtitle',
            field=models.CharField(blank=True, default='Providing our students with inspiring physical and digital learning environments.', max_length=500),
        ),
        migrations.AddField(
            model_name='aboutinfo',
            name='facilities_cta_text',
            field=models.CharField(blank=True, default='Apply For Admission 2026-2027', max_length=150),
        ),
        migrations.AddField(
            model_name='aboutinfo',
            name='facilities_cta_link',
            field=models.CharField(blank=True, default='/admission', max_length=255),
        ),
    ]
