from django.db import migrations
from django.utils.text import slugify


def seed_publications(apps, schema_editor):
    Publication = apps.get_model('core', 'Publication')

    publications = [
        {
            'title': 'The Josephite Chronicle - Annual School Magazine 2025–2026',
            'publication_type': 'magazine',
            'edition': 'Annual Edition 2025–2026 (Vol. XV)',
            'academic_year': '2025-2026',
            'cover_image_url': 'https://images.unsplash.com/photo-1544717305-2782549b5136?q=80&w=800&auto=format&fit=crop',
            'pdf_url': '/sample-magazines/sjis-annual-magazine-2025-2026.pdf',
            'file_size': '14.8 MB PDF',
            'pages_count': 68,
            'description': 'The official flagship annual publication of St. Joseph International School, Narinda. Showcasing creative essays, student poetry, campus artwork, championship victories, and administrator reflections across the academic year.',
            'editor_name': 'Brother Roktim Chiran, CSC & Student Editorial Board',
            'is_featured': True,
            'order': 1,
            'views_count': 342,
            'download_count': 128,
        },
        {
            'title': 'SJIS Graduation & Milestones Yearbook 2024–2025',
            'publication_type': 'yearbook',
            'edition': 'Class of 2025 Commemorative Yearbook',
            'academic_year': '2024-2025',
            'cover_image_url': 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=800&auto=format&fit=crop',
            'pdf_url': '/sample-magazines/sjis-annual-magazine-2025-2026.pdf',
            'file_size': '18.4 MB PDF',
            'pages_count': 84,
            'description': 'Celebrating the achievements, valedictorian addresses, cohort class portraits, club memories, and graduation ceremonies of our outgoing batch.',
            'editor_name': 'Yearbook Committee & Faculty Advisors',
            'is_featured': True,
            'order': 2,
            'views_count': 512,
            'download_count': 219,
        },
        {
            'title': 'The Narinda Beacon - Autumn Term Gazette',
            'publication_type': 'newsletter',
            'edition': 'Autumn Term 2025 (Issue 2)',
            'academic_year': '2025-2026',
            'cover_image_url': 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?q=80&w=800&auto=format&fit=crop',
            'pdf_url': '/sample-magazines/sjis-annual-magazine-2025-2026.pdf',
            'file_size': '6.2 MB PDF',
            'pages_count': 24,
            'description': 'Quarterly newsletter detailing STEM fair accolades, sports day championships, debate tournaments, and upcoming academic checkpoints.',
            'editor_name': 'Department of English & Co-Curricular Guilds',
            'is_featured': False,
            'order': 3,
            'views_count': 185,
            'download_count': 64,
        },
        {
            'title': 'SJIS Academic Prospectus & Cambridge Pathway Guide',
            'publication_type': 'prospectus',
            'edition': 'Admissions 2026–2027 Information Brochure',
            'academic_year': '2026-2027',
            'cover_image_url': 'https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=800&auto=format&fit=crop',
            'pdf_url': '/sample-magazines/sjis-annual-magazine-2025-2026.pdf',
            'file_size': '8.5 MB PDF',
            'pages_count': 32,
            'description': 'Comprehensive guide to Cambridge Early Years, Primary, Lower Secondary, IGCSE and International A Level learning pathways at SJIS Narinda.',
            'editor_name': 'Admissions Office & Academic Council',
            'is_featured': True,
            'order': 4,
            'views_count': 420,
            'download_count': 310,
        },
    ]

    for item in publications:
        slug = slugify(f"{item['title']}-{item['academic_year']}")
        Publication.objects.get_or_create(
            slug=slug,
            defaults={**item, 'slug': slug, 'is_active': True}
        )


def noop(apps, schema_editor):
    pass


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0025_publication'),
    ]

    operations = [
        migrations.RunPython(seed_publications, noop),
    ]
