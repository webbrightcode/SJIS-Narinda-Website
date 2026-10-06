from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0017_add_facilities_section_fields'),
    ]

    operations = [
        migrations.AlterField(
            model_name='club',
            name='category',
            field=models.CharField(
                blank=True,
                default='',
                help_text='Optional category or theme tag',
                max_length=100
            ),
        ),
        migrations.AlterField(
            model_name='galleryitem',
            name='category',
            field=models.CharField(
                blank=True,
                default='',
                help_text='Optional category tag',
                max_length=100
            ),
        ),
    ]
