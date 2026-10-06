from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0018_alter_club_category_alter_galleryitem_category'),
    ]

    operations = [
        migrations.AddField(
            model_name='aboutinfo',
            name='about_badge',
            field=models.CharField(blank=True, default='Institutional Heritage', max_length=150),
        ),
        migrations.AddField(
            model_name='aboutinfo',
            name='about_title',
            field=models.CharField(blank=True, default='About St. Joseph Narinda', max_length=255),
        ),
        migrations.AddField(
            model_name='aboutinfo',
            name='history_badge',
            field=models.CharField(blank=True, default='Tradition of Distinction', max_length=150),
        ),
        migrations.AddField(
            model_name='aboutinfo',
            name='history_title',
            field=models.CharField(blank=True, default='Our Illustrious Holy Cross Heritage', max_length=255),
        ),
        migrations.AddField(
            model_name='aboutinfo',
            name='history_image_url',
            field=models.TextField(blank=True, default='https://images.unsplash.com/photo-1546422904-90eab23c3d7e?q=80&w=1200&auto=format&fit=crop'),
        ),
        migrations.AddField(
            model_name='aboutinfo',
            name='history_sub_title',
            field=models.CharField(blank=True, default='The Congregation of Holy Cross', max_length=255),
        ),
        migrations.AddField(
            model_name='aboutinfo',
            name='history_sub_desc',
            field=models.TextField(blank=True, default='Founded by Blessed Father Basil Moreau, the Congregation of Holy Cross views education as the art of helping young people achieve their full potential. At St. Joseph Narinda, this vision is alive every day.'),
        ),
        migrations.AddField(
            model_name='aboutinfo',
            name='mission_title',
            field=models.CharField(blank=True, default='Our Sacred Mission', max_length=255),
        ),
        migrations.AddField(
            model_name='aboutinfo',
            name='vision_title',
            field=models.CharField(blank=True, default='Our Vision for Tomorrow', max_length=255),
        ),
        migrations.AddField(
            model_name='aboutinfo',
            name='message_badge',
            field=models.CharField(blank=True, default='Message From the Administrator', max_length=150),
        ),
        migrations.AddField(
            model_name='aboutinfo',
            name='message_headline',
            field=models.CharField(blank=True, default='"Awakening Minds, Shaping Future Stewards"', max_length=255),
        ),
        migrations.AddField(
            model_name='aboutinfo',
            name='values_badge',
            field=models.CharField(blank=True, default='Guiding Principles', max_length=150),
        ),
        migrations.AddField(
            model_name='aboutinfo',
            name='values_title',
            field=models.CharField(blank=True, default='Our Four Pillars of Character', max_length=255),
        ),
        migrations.AddField(
            model_name='aboutinfo',
            name='values_subtitle',
            field=models.CharField(blank=True, default='The cornerstone virtues instilled into every Josephite from early childhood to graduation.', max_length=500),
        ),
    ]
