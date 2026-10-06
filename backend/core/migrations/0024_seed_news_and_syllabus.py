from django.db import migrations


def seed_news_and_syllabus(apps, schema_editor):
    News = apps.get_model('core', 'News')
    SyllabusItem = apps.get_model('core', 'SyllabusItem')

    if News.objects.count() == 0:
        News.objects.create(
            title="Scintilla 2026: Young Innovators Take Centre Stage at the Annual Science Carnival",
            slug="scintilla-2026-young-innovators-take-centre-stage",
            category="events",
            summary="Robotics, olympiads and project displays filled the campus as students from across Dhaka competed at our annual science festival.",
            content="St. Joseph Science & Robotics Club welcomed participants from schools across Dhaka for the Annual Science & Technology Festival, 'Scintilla 2026'.\n\nThroughout the day students presented working prototypes, competed in the Science Olympiad and battled it out in the Robo-Soccer arena. Judges praised the creativity and teamwork on display.\n\nThe festival closed with an awards ceremony led by the Administrator, Brother Roktim Chiran, CSC.",
            image_url="https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=1600&auto=format&fit=crop",
            gallery_images=[
                "https://images.unsplash.com/photo-1532094349884-543bc11b234d?q=80&w=1200&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1580582932707-520aed937b7b?q=80&w=1200&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?q=80&w=1200&auto=format&fit=crop",
            ],
            publish_date="2026-09-29",
            is_featured=True,
            is_active=True,
            views_count=2150,
        )

        News.objects.create(
            title="Annual Sports Day: A Celebration of Spirit, Strength and Sportsmanship",
            slug="annual-sports-day-a-celebration-of-spirit-strength-and-sportsmanship",
            category="sports",
            summary="Over 600 students competed in track events, relay races and the much-loved house march-past.",
            content="The Josephite community gathered at the campus ground for the Annual Sports Day, where over 600 students competed in track events, relay races and the much-loved house march-past.\n\nThe day opened with the lighting of the torch and the pledge of fair play, and ended with a spirited prize-giving ceremony.",
            image_url="https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=1600&auto=format&fit=crop",
            gallery_images=[
                "https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?q=80&w=1200&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=1200&auto=format&fit=crop",
            ],
            publish_date="2026-09-20",
            is_featured=False,
            is_active=True,
            views_count=870,
        )

        News.objects.create(
            title="Cultural Festival 2026 Lights Up the Campus with Music, Dance and Art",
            slug="cultural-festival-2026-lights-up-the-campus",
            category="cultural",
            summary="Choirs, traditional dance, drama and an exhibition of original artwork filled the auditorium.",
            content="Our campus was alive with sound and color for the Annual Cultural Festival. Students from junior and senior sections staged classical Bengali dramas, musical ensembles and contemporary choreography.\n\nAn accompanying visual arts exhibition featured oil paintings, calligraphy and clay models by student artists from across the campus.",
            image_url="https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=1600&auto=format&fit=crop",
            gallery_images=[
                "https://images.unsplash.com/photo-1460723237483-7a6dc9d0b212?q=80&w=1200&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?q=80&w=1200&auto=format&fit=crop",
            ],
            publish_date="2026-09-12",
            is_featured=False,
            is_active=True,
            views_count=640,
        )

    if SyllabusItem.objects.count() == 0:
        syllabus_data = [
            {
                "title": "Playgroup Academic Syllabus & Activity Curriculum Booklet",
                "slug": "playgroup-academic-syllabus-booklet",
                "grade": "Playgroup",
                "subject": "All Subjects (Consolidated)",
                "subjects_included": "English Readiness, Early Numeracy, Rhymes & Storytelling, Motor Skills, General Awareness, Creative Expression",
                "academic_year": "2026-2027",
                "curriculum_section": "cambridge_primary",
                "file_url": "/circulars/sjis-official-circular.pdf",
                "file_size": "1.4 MB • 24 Pages",
                "description": "Complete grade syllabus booklet containing all subjects, sensory motor development guidelines, phonics introduction, interactive rhymes, and monthly learning milestones for Playgroup students.",
                "version": "v2026.1",
                "term": "Full Academic Session",
                "order": 1,
            },
            {
                "title": "Grade 1 Cambridge Primary Academic Syllabus Booklet",
                "slug": "grade-1-cambridge-primary-syllabus-booklet",
                "grade": "Grade 1",
                "subject": "All Subjects (Consolidated)",
                "subjects_included": "Cambridge Primary English, Mathematics, Primary Science, Bengali Language, Global Perspectives, ICT & Computing, Art & Craft",
                "academic_year": "2026-2027",
                "curriculum_section": "cambridge_primary",
                "file_url": "/circulars/sjis-official-circular.pdf",
                "file_size": "2.4 MB • 42 Pages",
                "description": "All-in-one official Grade 1 syllabus packet detailing Cambridge Primary learning objectives, prescribed textbooks, weekly breakdown, and terminal examination frameworks across all subjects.",
                "version": "v2026.1",
                "term": "Full Academic Session",
                "order": 4,
            },
            {
                "title": "Grade 5 Cambridge Primary Checkpoint Syllabus Booklet",
                "slug": "grade-5-cambridge-primary-checkpoint-syllabus-booklet",
                "grade": "Grade 5",
                "subject": "All Subjects (Consolidated)",
                "subjects_included": "Cambridge Primary English Checkpoint, Mathematics Checkpoint, Science Checkpoint, Bengali, Bangladesh Studies, ICT",
                "academic_year": "2026-2027",
                "curriculum_section": "cambridge_primary",
                "file_url": "/circulars/sjis-official-circular.pdf",
                "file_size": "3.1 MB • 54 Pages",
                "description": "Comprehensive Grade 5 syllabus booklet containing all subjects and preparation guidelines for the official Cambridge Primary Checkpoint examinations.",
                "version": "v2026.1",
                "term": "Full Academic Session",
                "order": 8,
            },
            {
                "title": "Grade 8 Cambridge Lower Secondary Checkpoint Syllabus Booklet",
                "slug": "grade-8-cambridge-lower-secondary-checkpoint-syllabus-booklet",
                "grade": "Grade 8",
                "subject": "All Subjects (Consolidated)",
                "subjects_included": "Cambridge Checkpoint English (1111), Mathematics (1112), Science (1113), Bengali, Bangladesh Studies, Computing",
                "academic_year": "2026-2027",
                "curriculum_section": "cambridge_lower_sec",
                "file_url": "/circulars/sjis-official-circular.pdf",
                "file_size": "3.8 MB • 68 Pages",
                "description": "Complete Grade 8 curriculum guide featuring all subjects, Cambridge Lower Secondary Checkpoint revision blueprints, and IGCSE pathway preparation.",
                "version": "v2026.1",
                "term": "Full Academic Session",
                "order": 11,
            },
            {
                "title": "Grade 9 (Cambridge IGCSE) Comprehensive Academic Syllabus Booklet",
                "slug": "grade-9-cambridge-igcse-syllabus-booklet",
                "grade": "Grade 9 (IGCSE)",
                "subject": "All Subjects (Consolidated)",
                "subjects_included": "IGCSE English Language (0500), Mathematics (0580), Physics (0625), Chemistry (0620), Biology (0610), Economics (0455), Accounting (0452), Computer Science (0478), Bengali (0518)",
                "academic_year": "2026-2027",
                "curriculum_section": "cambridge_igcse",
                "file_url": "/circulars/sjis-official-circular.pdf",
                "file_size": "4.5 MB • 86 Pages",
                "description": "The definitive Grade 9 IGCSE booklet bringing together all Cambridge subject specifications, textbook editions, coursework timelines, and diagnostic test patterns in a single volume.",
                "version": "v2026.1",
                "term": "Full Academic Session",
                "order": 12,
            },
            {
                "title": "Grade 11 (Cambridge International AS Level) Academic Syllabus Booklet",
                "slug": "grade-11-cambridge-as-level-syllabus-booklet",
                "grade": "Grade 11 (AS Level)",
                "subject": "All Subjects (Consolidated)",
                "subjects_included": "Pure Mathematics (9709), Physics (9702), Chemistry (9701), Biology (9700), Economics (9708), Business Studies (9609), Computer Science (9618)",
                "academic_year": "2026-2027",
                "curriculum_section": "gce_alevel",
                "file_url": "/circulars/sjis-official-circular.pdf",
                "file_size": "5.2 MB • 104 Pages",
                "description": "Consolidated AS Level academic guide containing all Cambridge advanced subjects, practical laboratory assessments, and university entrance foundation modules.",
                "version": "v2026.1",
                "term": "Full Academic Session",
                "order": 14,
            },
        ]
        for s in syllabus_data:
            SyllabusItem.objects.create(
                is_active=True,
                download_count=150,
                **s
            )


def reverse_func(apps, schema_editor):
    pass


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0023_grade_wise_syllabus'),
    ]

    operations = [
        migrations.RunPython(seed_news_and_syllabus, reverse_func),
    ]
