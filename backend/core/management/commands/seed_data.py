import datetime
from django.core.management.base import BaseCommand
from core.models import (
    SliderSlide,
    AboutInfo,
    Notice,
    Club,
    AdmissionGuide,
    GalleryItem
)


class Command(BaseCommand):
    help = "Seeds comprehensive initial data for St. Joseph International School, Narinda"

    def add_arguments(self, parser):
        parser.add_argument(
            '--clean',
            action='store_true',
            help='Wipe existing records before re-seeding',
        )

    def handle(self, *args, **options):
        clean = options.get('clean', False)
        self.stdout.write("Checking SJIS Narinda baseline data...")

        # 1. Slider Slides
        if clean:
            SliderSlide.objects.all().delete()
        slides_data = [
            {
                "title": "Nurturing Excellence, Inspiring Leadership",
                "subtitle": "A premier Holy Cross institution dedicated to intellectual rigor and holistic character building in Narinda.",
                "badge": "Excellence in Education",
                "image_url": "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=1920&auto=format&fit=crop",
                "cta_text": "Apply For 2026-27",
                "cta_link": "/admission",
                "secondary_cta_text": "Discover SJIS",
                "secondary_cta_link": "/about",
                "order": 1,
            },
            {
                "title": "World-Class STEM & Cambridge Curriculum",
                "subtitle": "State-of-the-art physics, chemistry, robotics and computer labs empowering the next generation of innovators.",
                "badge": "Holistic Academics",
                "image_url": "https://images.unsplash.com/photo-1571260899304-425eee4c7efc?q=80&w=1920&auto=format&fit=crop",
                "cta_text": "Explore Curriculum",
                "cta_link": "/about",
                "secondary_cta_text": "View Science Clubs",
                "secondary_cta_link": "/clubs",
                "order": 2,
            },
            {
                "title": "Championing Arts, Sports & Character Formation",
                "subtitle": "Over 24 student-led clubs, championship athletic teams, and vibrant cultural societies fostering well-rounded leaders.",
                "badge": "Vibrant Student Life",
                "image_url": "https://images.unsplash.com/photo-1511629091441-ee46146481b6?q=80&w=1920&auto=format&fit=crop",
                "cta_text": "Explore Clubs & Sports",
                "cta_link": "/clubs",
                "secondary_cta_text": "View Campus Life",
                "secondary_cta_link": "/gallery",
                "order": 3,
            },
            {
                "title": "Admissions Open for Academic Session 2026-2027",
                "subtitle": "Join a legacy of outstanding academic distinction. Limited seats available for Playgroup to Grade XI.",
                "badge": "Now Enrolling",
                "image_url": "https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=1920&auto=format&fit=crop",
                "cta_text": "Apply Online Now",
                "cta_link": "/admission",
                "secondary_cta_text": "Admission Criteria",
                "secondary_cta_link": "/admission",
                "order": 4,
            },
        ]
        if clean or not SliderSlide.objects.exists():
            for data in slides_data:
                SliderSlide.objects.create(**data)
            self.stdout.write(self.style.SUCCESS(f"Created {len(slides_data)} Hero Slides."))
        else:
            self.stdout.write("Hero slides already present, skipping.")

        # 2. About Info
        if clean:
            AboutInfo.objects.all().delete()
        if clean or not AboutInfo.objects.exists():
            AboutInfo.objects.create(
            title="St. Joseph International School, Narinda",
            tagline="Fostering Academic Excellence & Moral Integrity",
            history=(
                "St. Joseph International School, Narinda is an esteemed Holy Cross institution with decades "
                "of illustrious educational heritage in Old Dhaka. Founded by the Congregation of Holy Cross, "
                "the school has consistently stood as a beacon of academic rigor, moral rectitude, and community service. "
                "Over generations, Josephites have gone on to lead in science, diplomacy, arts, civil service, "
                "and corporate leadership worldwide."
            ),
            mission=(
                "To educate hearts and minds through rigorous intellectual training, strong moral compass, "
                "creative inquiry, and empathetic leadership, fostering global citizens grounded in discipline and compassion."
            ),
            vision=(
                "To be the preeminent educational institution recognized globally for academic supremacy, "
                "innovative learning ecosystems, and steadfast ethical stewardship."
            ),
            principal_name="Brother Roktim Chiran, CSC",
            principal_title="Administrator",
            head_role_badge="Head of Institution",
            welcome_tag="WELCOME TO ST. JOSEPH NARINDA",
            welcome_title="Educating Hearts & Minds for Generations.",
            heritage_years="70+",
            heritage_label="Years of Heritage",
            pillars=[
                "Cambridge Assessment International Education (CAIE)",
                "Dedicated Congregation of Holy Cross Mentorship",
                "Comprehensive STEM & Robotics Laboratories",
                "Champion Debating & Co-Curricular Guilds",
            ],
            primary_button_text="Read Full School History",
            primary_button_url="/about",
            secondary_button_text="Admission Information",
            secondary_button_url="/admission",
            principal_message=(
                "Welcome to St. Joseph International School, Narinda. For over seven decades, our sacred mission has "
                "been to awaken intellectual curiosity and sculpt human character. We believe that true education does not "
                "merely prepare a child for examinations, but prepares them for life. Here at SJIS Narinda, our students are "
                "encouraged to question fearlessly, serve selflessly, and strive relentlessly for excellence. We warmly invite "
                "you to become part of our inspiring Josephite fraternity."
            ),
            principal_image_url="/administrator-roktim.webp",
            stats={
                "students": "500+",
                "faculty": "60+",
                "clubs": "15+",
                "pass_rate": "100%",
                "campus_acres": "4.5 Acres",
                "national_awards": "85+"
            },
            core_values=[
                {
                    "title": "Faith & Moral Integrity",
                    "desc": "Cultivating honesty, spiritual grounding, and conscientious decision-making in every sphere of life.",
                    "icon": "ShieldCheck"
                },
                {
                    "title": "Intellectual Rigor",
                    "desc": "Empowering independent critical inquiry, innovative problem-solving, and continuous academic mastery.",
                    "icon": "BookOpen"
                },
                {
                    "title": "Inclusive Community",
                    "desc": "Fostering mutual respect, cultural celebration, and genuine empathy across our diverse student body.",
                    "icon": "Users"
                },
                {
                    "title": "Service & Stewardship",
                    "desc": "Instilling an enduring commitment to social justice, environmental care, and uplifting humanity.",
                    "icon": "HeartHandshake"
                }
            ],
            facilities=[
                {
                    "name": "Advanced STEM & Robotics Complex",
                    "desc": "Equipped with 3D printers, IoT kits, and specialized physics, chemistry, and biology laboratories.",
                    "icon": "Cpu"
                },
                {
                    "name": "Central Digital Library & Research Hall",
                    "desc": "Over 25,000 catalogued volumes, international peer-reviewed journals, and high-speed research terminals.",
                    "icon": "BookMarked"
                },
                {
                    "name": "Grand Auditorium & Performing Arts Theater",
                    "desc": "Acoustically engineered 1,200-seat multi-purpose auditorium for debates, dramatics, and musical galas.",
                    "icon": "Music"
                },
                {
                    "name": "FIFA-Standard Sports Complex & Gymnasium",
                    "desc": "All-weather turf for football and cricket, basketball courts, badminton arena, and indoor table tennis halls.",
                    "icon": "Trophy"
                }
            ]
            )
            self.stdout.write(self.style.SUCCESS("Created About Us profile and institutional data."))
        else:
            self.stdout.write("About Us profile already present, skipping.")

        # 3. Notices
        if clean:
            Notice.objects.all().delete()
        today = datetime.date.today()
        notices_data = [
            {
                "title": "Admissions for Academic Year 2026-2027: Online Application Window Open",
                "category": "admission",
                "content": (
                    "The online application portal for admission into Playgroup, Nursery, Grade I, and Grade VI "
                    "for the academic session 2026-2027 is now officially open. Prospective parents and guardians "
                    "are requested to review the eligibility criteria and submit applications before November 15, 2026."
                ),
                "attachment_url": "/circulars/sjis-official-circular.pdf",
                "publish_date": today,
                "is_pinned": True,
                "views_count": 1420
            },
            {
                "title": "Schedule for Cambridge International IGCSE & O-Level Mock Examinations",
                "category": "exams",
                "content": (
                    "The timetable for the upcoming Cambridge IGCSE and GCE O-Level preparatory mock examinations "
                    "has been published. Students are advised to collect their admit cards from the academic coordinator "
                    "and review the examination hall protocols."
                ),
                "attachment_url": "/circulars/sjis-official-circular.pdf",
                "publish_date": today - datetime.timedelta(days=2),
                "is_pinned": True,
                "views_count": 980
            },
            {
                "title": "Annual Science & Technology Festival 'Scintilla 2026' Announced",
                "category": "events",
                "content": (
                    "St. Joseph Science & Robotics Club proudly announces the 18th National Science Carnival 'Scintilla 2026'. "
                    "Participating institutions will compete in Project Display, Olympiads, Hackathons, and Robo-Soccer. "
                    "Registration opens on October 10."
                ),
                "attachment_url": "/circulars/sjis-official-circular.pdf",
                "publish_date": today - datetime.timedelta(days=5),
                "is_pinned": True,
                "views_count": 2150
            },
            {
                "title": "Autumn Recess & School Resumption Guidelines",
                "category": "holidays",
                "content": (
                    "The school campus will remain closed for the Autumn Vacation from October 18 to October 25, 2026. "
                    "Regular academic classes for all shifts will resume on Monday, October 26 at 7:45 AM sharp."
                ),
                "attachment_url": "",
                "publish_date": today - datetime.timedelta(days=7),
                "is_pinned": False,
                "views_count": 640
            },
            {
                "title": "Mandatory Parent-Teacher Conference (PTC) for Junior & Senior Sections",
                "category": "academic",
                "content": (
                    "The Term 1 Parent-Teacher Conference will take place on Saturday, October 12, 2026. Parents are requested "
                    "to meet subject teachers according to the designated time slots distributed via student diaries."
                ),
                "attachment_url": "",
                "publish_date": today - datetime.timedelta(days=10),
                "is_pinned": False,
                "views_count": 1120
            },
            {
                "title": "Inter-House Annual Athletics Championship 2026 Selection Trials",
                "category": "events",
                "content": (
                    "House masters announce preliminary trials for 100m, 400m, high jump, long jump, and relay races. "
                    "All registered student athletes must assemble on the main school ground in proper PE uniforms."
                ),
                "attachment_url": "",
                "publish_date": today - datetime.timedelta(days=14),
                "is_pinned": False,
                "views_count": 890
            }
        ]
        if clean or not Notice.objects.exists():
            for data in notices_data:
                Notice.objects.create(**data)
            self.stdout.write(self.style.SUCCESS(f"Created {len(notices_data)} Notices."))
        else:
            self.stdout.write("Notices already present, skipping.")

        # 4. Clubs
        if clean:
            Club.objects.all().delete()
        clubs_data = [
            {
                "name": "Josephite Science & Robotics Club (JSRC)",
                "category": "stem",
                "motto": "Curiosity Unveils Tomorrow",
                "description": (
                    "One of Bangladesh's premier school-level STEM hubs. JSRC fosters hands-on inquiry in robotics, "
                    "IoT automation, astro-physics, drone engineering, and environmental technologies through national competitions."
                ),
                "icon_name": "Cpu",
                "image_url": "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=1200&auto=format&fit=crop",
                "moderator_name": "Mr. Tahsin Rahman (Senior Physics Faculty)",
                "schedule": "Tuesdays & Thursdays, 3:30 PM - 5:00 PM",
                "key_activities": [
                    "Hands-on Arduino & Raspberry Pi workshops",
                    "Annual 'Scintilla' National Science Festival",
                    "Astronomy night sky observations",
                    "Competitive Robo-Wars and maze-solver leagues"
                ],
                "achievements": [
                    "Champion - National Robotech Carnival 2025",
                    "Global finalist - First Lego League Asia-Pacific",
                    "Best Innovation Award - BUET Tech Fest"
                ],
                "order": 1,
            },
            {
                "name": "St. Joseph Debating Society (SJDS)",
                "category": "debate",
                "motto": "Veritas et Eloquentia (Truth & Eloquence)",
                "description": (
                    "Renowned across South Asia for producing articulate thinkers, parliamentarians, and legal scholars. "
                    "SJDS trains students in British Parliamentary, Asian Parliamentary, and traditional debating formats."
                ),
                "icon_name": "Mic",
                "image_url": "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?q=80&w=1200&auto=format&fit=crop",
                "moderator_name": "Ms. Farhana Haque (Department of English)",
                "schedule": "Wednesdays, 3:00 PM - 5:00 PM",
                "key_activities": [
                    "Weekly mock parliamentary debates",
                    "Public speaking and extempore masterclasses",
                    "Inter-House Josephite Debating Championship",
                    "International delegations to Harvard & Oxford Model UN"
                ],
                "achievements": [
                    "Undefeated Champions - National English Debate Championship 2025",
                    "Best Delegation - Dhaka University Model UN",
                    "Winner - BTV National School Debating Series"
                ],
                "order": 2,
            },
            {
                "name": "Josephite Cultural & Performing Arts Club",
                "category": "arts",
                "motto": "Harmony in Heritage and Expression",
                "description": (
                    "Celebrating the rich cultural tapestry of Bengal and world literature. The club organizes classical and contemporary "
                    "music ensembles, theatrical plays, traditional dance forms, and annual Rabindra-Nazrul tributes."
                ),
                "icon_name": "Music",
                "image_url": "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=1200&auto=format&fit=crop",
                "moderator_name": "Mr. Anupam Sen (Fine Arts Director)",
                "schedule": "Mondays, 3:30 PM - 4:45 PM",
                "key_activities": [
                    "Annual Drama Production & Shakespearean Play",
                    "Orchestra and choral music workshops",
                    "Pahela Baishakh Cultural Carnival",
                    "Inter-school vocal and instrument contests"
                ],
                "achievements": [
                    "1st Place - Shilpakala National Youth Drama Fest",
                    "Gold Trophy - National Inter-School Choral Championship"
                ],
                "order": 3,
            },
            {
                "name": "St. Joseph ICT & Coding Society",
                "category": "stem",
                "motto": "Code. Build. Transform.",
                "description": (
                    "Empowering students with 21st-century computational thinking, web development, algorithms, artificial intelligence, "
                    "and competitive programming in Python, C++, and JavaScript."
                ),
                "icon_name": "Terminal",
                "image_url": "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=1200&auto=format&fit=crop",
                "moderator_name": "Engr. Salman Kabir (Computer Science Lead)",
                "schedule": "Fridays, 9:00 AM - 11:30 AM",
                "key_activities": [
                    "Competitive programming rounds on Codeforces/LeetCode",
                    "Web & Fullstack app development bootcamps",
                    "Cybersecurity and ethical hacking fundamentals",
                    "School portal maintenance and tech mentorship"
                ],
                "achievements": [
                    "Gold Medalists - National Olympiad in Informatics (NOI)",
                    "1st Place - HackDhaka Youth Hackathon 2025"
                ],
                "order": 4,
            },
            {
                "name": "Josephite Sports & Athletics Guild",
                "category": "sports",
                "motto": "Strength, Discipline, Honor",
                "description": (
                    "Instilling sportsmanship and physical resilience. From inter-school football, cricket, and basketball tournaments "
                    "to table tennis and athletics, the guild trains champions."
                ),
                "icon_name": "Trophy",
                "image_url": "https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=1200&auto=format&fit=crop",
                "moderator_name": "Coach Rafiqul Islam (Physical Education Director)",
                "schedule": "Everyday After School, 4:00 PM - 6:00 PM",
                "key_activities": [
                    "Intra-School Premier League Football & Cricket",
                    "Inter-School Basketball Invitational Tournament",
                    "Athletics conditioning & sprint coaching",
                    "Annual Sports Day Extravaganza"
                ],
                "achievements": [
                    "Dhaka Divisional School Football Champions (3 consecutive years)",
                    "Runners-up - National Inter-School Cricket Cup"
                ],
                "order": 5,
            },
            {
                "name": "Josephite Eco & Social Welfare Guild",
                "category": "service",
                "motto": "Serving Mankind, Healing the Earth",
                "description": (
                    "Living the Holy Cross ethos of selfless service. Students spearhead tree plantation drives, flood relief distributions, "
                    "community health campaigns, and campus green audits."
                ),
                "icon_name": "HeartHandshake",
                "image_url": "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=1200&auto=format&fit=crop",
                "moderator_name": "Brother Joy Gomez, CSC",
                "schedule": "Alternate Saturdays, 10:00 AM - 12:30 PM",
                "key_activities": [
                    "Old Dhaka Urban Greening & Clean Campus Initiatives",
                    "Annual Winter Clothes & Relief Drive",
                    "Free tutoring for underprivileged children in Narinda",
                    "Plastic-Free School Campaign & Composting"
                ],
                "achievements": [
                    "Eco-School Green Flag Award 2025",
                    "Community Impact Certificate from Holy Cross Congregation"
                ],
                "order": 6,
            }
        ]
        if clean or not Club.objects.exists():
            for data in clubs_data:
                Club.objects.create(**data)
            self.stdout.write(self.style.SUCCESS(f"Created {len(clubs_data)} Student Clubs."))
        else:
            self.stdout.write("Student clubs already present, skipping.")

        # 5. Admission Guide
        if clean:
            AdmissionGuide.objects.all().delete()
        if clean or not AdmissionGuide.objects.exists():
            AdmissionGuide.objects.create(
            academic_year="2026-2027",
            title="Admissions for Academic Session 2026-2027",
            overview=(
                "St. Joseph International School, Narinda invites applications from passionate, diligent learners "
                "for the 2026-2027 academic session. We offer a holistic educational journey blending the acclaimed "
                "Cambridge Assessment International Education (CAIE) curriculum with our time-honored Josephite values."
            ),
            is_open=True,
            eligibility=[
                {
                    "level": "Early Childhood (Playgroup & Nursery)",
                    "age_bracket": "3.5 to 4.5 Years as of January 1, 2026",
                    "criteria": "Friendly interactive session assessing basic communication, motor skills, and social readiness."
                },
                {
                    "level": "Primary School (Grades 1 to 5)",
                    "age_bracket": "6 to 10 Years",
                    "criteria": "Written evaluation in English, Mathematics, and General Awareness, followed by a family interaction."
                },
                {
                    "level": "Middle & Secondary (Grades 6 to 9)",
                    "age_bracket": "11 to 15 Years",
                    "criteria": "Rigorous entrance test in English, Advanced Math, and Science with academic transcripts from previous school."
                },
                {
                    "level": "Cambridge O-Levels & A-Levels",
                    "age_bracket": "15+ Years",
                    "criteria": "Outstanding academic record, minimum grades in checkpoint or IGCSE exams, and subject counseling."
                }
            ],
            application_steps=[
                {
                    "step": 1,
                    "title": "Online Application Submission",
                    "description": "Fill out the interactive admission inquiry form with candidate details, parent information, and target grade."
                },
                {
                    "step": 2,
                    "title": "Document Verification & Fee Payment",
                    "description": "Upload scanned copies of birth certificate, previous school report cards, and pay the nominal test processing fee."
                },
                {
                    "step": 3,
                    "title": "Assessment Test & Interactive Session",
                    "description": "Candidates participate in age-appropriate diagnostic evaluations measuring aptitude and conceptual clarity."
                },
                {
                    "step": 4,
                    "title": "Parent & Student Dialogue",
                    "description": "Informal meeting with the Headmaster and academic council to ensure shared educational goals."
                },
                {
                    "step": 5,
                    "title": "Offer Letter & Admission Confirmation",
                    "description": "Successful applicants receive admission confirmation and welcome packs with uniform and orientation guides."
                }
            ],
            required_documents=[
                "Attested copy of Child's Digital Birth Registration Certificate",
                "Previous 2 academic years' certified report cards and transfer certificate",
                "4 recent passport-size photographs of the student in white background",
                "National ID (NID) or Passport copy of Father, Mother, or Legal Guardian",
                "Medical fitness certificate and immunization records"
            ],
            fee_structure=[
                {
                    "section": "Early Childhood (Playgroup - KG)",
                    "admission_fee": "BDT 45,000 (One-time)",
                    "monthly_tuition": "BDT 7,500",
                    "annual_session_charge": "BDT 15,000"
                },
                {
                    "section": "Primary Section (Grade 1 - 5)",
                    "admission_fee": "BDT 55,000 (One-time)",
                    "monthly_tuition": "BDT 9,000",
                    "annual_session_charge": "BDT 18,000"
                },
                {
                    "section": "Junior Section (Grade 6 - 8)",
                    "admission_fee": "BDT 65,000 (One-time)",
                    "monthly_tuition": "BDT 11,500",
                    "annual_session_charge": "BDT 22,000"
                },
                {
                    "section": "Cambridge IGCSE & O-Levels (Grade 9 - 10)",
                    "admission_fee": "BDT 75,000 (One-time)",
                    "monthly_tuition": "BDT 14,000",
                    "annual_session_charge": "BDT 25,000"
                },
                {
                    "section": "Advanced Level (Grade 11 - 12)",
                    "admission_fee": "BDT 85,000 (One-time)",
                    "monthly_tuition": "BDT 16,500",
                    "annual_session_charge": "BDT 28,000"
                }
            ],
            important_dates=[
                {"event": "Online Application Begins", "date": "October 1, 2026"},
                {"event": "Application Submission Deadline", "date": "November 20, 2026"},
                {"event": "Entrance Assessment Dates", "date": "November 28 - 30, 2026"},
                {"event": "Publication of Merit List", "date": "December 8, 2026"},
                {"event": "Orientation & Session Commencement", "date": "January 10, 2027"}
            ]
            )
            self.stdout.write(self.style.SUCCESS("Created comprehensive Admission Guide."))
        else:
            self.stdout.write("Admission Guide already present, skipping.")

        # 6. Gallery Items
        if clean:
            GalleryItem.objects.all().delete()
        gallery_data = [
            {
                "title": "Historic Narinda Campus Quadrangle",
                "category": "campus",
                "media_type": "image",
                "image_url": "https://images.unsplash.com/photo-1546422904-90eab23c3d7e?q=80&w=1200&auto=format&fit=crop",
                "caption": "The serene, red-brick heritage architecture and lush green lawns of St. Joseph Narinda campus.",
                "is_featured": True,
                "order": 1,
            },
            {
                "title": "Students in Modern Robotics & STEM Lab",
                "category": "academics",
                "media_type": "image",
                "image_url": "https://images.unsplash.com/photo-1577896851231-70ef18881754?q=80&w=1200&auto=format&fit=crop",
                "caption": "Junior scientists collaborating on autonomous robotic prototypes and AI sensors.",
                "is_featured": True,
                "order": 2,
            },
            {
                "title": "Annual Inter-House Football Championship",
                "category": "sports",
                "media_type": "image",
                "image_url": "https://images.unsplash.com/photo-1511629091441-ee46146481b6?q=80&w=1200&auto=format&fit=crop",
                "caption": "Electric atmosphere during the final showdown of the Inter-House Football League.",
                "is_featured": True,
                "order": 3,
            },
            {
                "title": "Annual Cultural Gala & Musical Performance",
                "category": "cultural",
                "media_type": "image",
                "image_url": "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=1200&auto=format&fit=crop",
                "caption": "Students performing traditional Bengali classical melodies in the grand auditorium.",
                "is_featured": True,
                "order": 4,
            },
            {
                "title": "Interactive Smart Classroom Learning",
                "category": "academics",
                "media_type": "image",
                "image_url": "https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=1200&auto=format&fit=crop",
                "caption": "Digital smart-board integrated pedagogy bringing complex concepts to life.",
                "is_featured": True,
                "order": 5,
            },
            {
                "title": "Pahela Baishakh Bangla New Year Festivities",
                "category": "cultural",
                "media_type": "image",
                "image_url": "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?q=80&w=1200&auto=format&fit=crop",
                "caption": "Color, joy, and traditional celebration welcoming the Bengali New Year at Narinda.",
                "is_featured": True,
                "order": 6,
            },
            {
                "title": "National Science Carnival 'Scintilla' Project Exhibition",
                "category": "events",
                "media_type": "image",
                "image_url": "https://images.unsplash.com/photo-1571260899304-425eee4c7efc?q=80&w=1200&auto=format&fit=crop",
                "caption": "Over 500 projects displayed by young innovators from schools across the nation.",
                "is_featured": False,
                "order": 7,
            },
            {
                "title": "Central Library & Digital Archives Hall",
                "category": "campus",
                "media_type": "image",
                "image_url": "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?q=80&w=1200&auto=format&fit=crop",
                "caption": "A peaceful sanctuary housing over 25,000 books, journals, and digital research bays.",
                "is_featured": False,
                "order": 8,
            },
            {
                "title": "Annual Athletic Meet Track & Field Events",
                "category": "sports",
                "media_type": "image",
                "image_url": "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?q=80&w=1200&auto=format&fit=crop",
                "caption": "Athletes competing in 100-meter dash and relay events on sports day.",
                "is_featured": False,
                "order": 9,
            },
            {
                "title": "Graduation & Valedictory Ceremony",
                "category": "events",
                "media_type": "image",
                "image_url": "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=1200&auto=format&fit=crop",
                "caption": "Celebrating the graduating batch stepping out to conquer global horizons.",
                "is_featured": False,
                "order": 10,
            }
        ]
        if clean or not GalleryItem.objects.exists():
            for data in gallery_data:
                GalleryItem.objects.create(**data)
            self.stdout.write(self.style.SUCCESS(f"Created {len(gallery_data)} Gallery Items."))
        else:
            self.stdout.write("Gallery items already present, skipping.")

        self.stdout.write(self.style.SUCCESS("All SJIS Narinda initial data seeded successfully!"))
