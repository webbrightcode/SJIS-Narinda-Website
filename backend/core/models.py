from django.db import models
from django.utils.text import slugify


class SliderSlide(models.Model):
    title = models.CharField(max_length=255)
    subtitle = models.CharField(max_length=255, blank=True)
    badge = models.CharField(max_length=100, blank=True, default="Welcome to SJIS")
    image_url = models.TextField(blank=True, default="")
    video_url = models.TextField(blank=True, default="")
    cta_text = models.CharField(max_length=100, default="Apply For Admission")
    cta_link = models.CharField(max_length=255, default="/admission")
    secondary_cta_text = models.CharField(max_length=100, blank=True, default="Explore Campus")
    secondary_cta_link = models.CharField(max_length=255, blank=True, default="/about")
    order = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['order', '-created_at']

    def __str__(self):
        return self.title


class AboutInfo(models.Model):
    title = models.CharField(max_length=255, default="St. Joseph International School, Narinda")
    tagline = models.CharField(max_length=255, default="Fostering Academic Excellence & Moral Integrity")
    history = models.TextField(blank=True)
    mission = models.TextField(blank=True)
    vision = models.TextField(blank=True)
    principal_name = models.CharField(max_length=255, blank=True, default="Brother Roktim Chiran, CSC")
    principal_title = models.CharField(max_length=255, blank=True, default="Administrator")
    principal_message = models.TextField(blank=True)
    principal_image_url = models.TextField(blank=True, default="")
    head_role_badge = models.CharField(max_length=150, blank=True, default="Head of Institution")
    welcome_tag = models.CharField(max_length=255, blank=True, default="WELCOME TO ST. JOSEPH NARINDA")
    welcome_title = models.CharField(max_length=255, blank=True, default="Educating Hearts & Minds for Generations.")
    heritage_years = models.CharField(max_length=50, blank=True, default="70+")
    heritage_label = models.CharField(max_length=150, blank=True, default="Years of Heritage")
    pillars = models.JSONField(
        default=list,
        blank=True,
        help_text="List of strings e.g. ['Cambridge Assessment International Education (CAIE)', ...]"
    )
    primary_button_text = models.CharField(max_length=100, blank=True, default="Read Full School History")
    primary_button_url = models.CharField(max_length=255, blank=True, default="/about")
    secondary_button_text = models.CharField(max_length=100, blank=True, default="Admission Information")
    secondary_button_url = models.CharField(max_length=255, blank=True, default="/admission")
    stats = models.JSONField(default=dict, blank=True, help_text="e.g. {'students': '3,000+', 'teachers': '140+', 'clubs': '25+', 'success_rate': '100%'}")
    emergency_alert = models.JSONField(default=dict, blank=True, help_text="Emergency banner e.g. {'is_active': False, 'message': '', 'type': 'urgent', 'link_text': '', 'link_url': ''}")
    core_values = models.JSONField(default=list, blank=True, help_text="List of objects: [{'title': 'Faith', 'desc': '...'}]")
    facilities = models.JSONField(default=list, blank=True, help_text="List of facilities: [{'name': '...', 'desc': '...'}]")
    facilities_badge = models.CharField(max_length=150, blank=True, default="Modern Infrastructure")
    facilities_title = models.CharField(max_length=255, blank=True, default="World-Class Campus Facilities")
    facilities_subtitle = models.CharField(
        max_length=500,
        blank=True,
        default="Providing our students with inspiring physical and digital learning environments."
    )
    facilities_cta_text = models.CharField(max_length=150, blank=True, default="Apply For Admission 2026-2027")
    facilities_cta_link = models.CharField(max_length=255, blank=True, default="/admission")

    # Dedicated About Page Dynamic Fields
    about_badge = models.CharField(max_length=150, blank=True, default="Institutional Heritage")
    about_title = models.CharField(max_length=255, blank=True, default="About St. Joseph Narinda")
    history_badge = models.CharField(max_length=150, blank=True, default="Tradition of Distinction")
    history_title = models.CharField(max_length=255, blank=True, default="Our Illustrious Holy Cross Heritage")
    history_image_url = models.TextField(
        blank=True,
        default="https://images.unsplash.com/photo-1546422904-90eab23c3d7e?q=80&w=1200&auto=format&fit=crop"
    )
    history_sub_title = models.CharField(max_length=255, blank=True, default="The Congregation of Holy Cross")
    history_sub_desc = models.TextField(
        blank=True,
        default="Founded by Blessed Father Basil Moreau, the Congregation of Holy Cross views education as the art of helping young people achieve their full potential. At St. Joseph Narinda, this vision is alive every day."
    )
    mission_title = models.CharField(max_length=255, blank=True, default="Our Sacred Mission")
    vision_title = models.CharField(max_length=255, blank=True, default="Our Vision for Tomorrow")
    message_badge = models.CharField(max_length=150, blank=True, default="Message From the Administrator")
    message_headline = models.CharField(max_length=255, blank=True, default='"Awakening Minds, Shaping Future Stewards"')
    values_badge = models.CharField(max_length=150, blank=True, default="Guiding Principles")
    values_title = models.CharField(max_length=255, blank=True, default="Our Four Pillars of Character")
    values_subtitle = models.CharField(
        max_length=500,
        blank=True,
        default="The cornerstone virtues instilled into every Josephite from early childhood to graduation."
    )
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name_plural = "About Us Information"

    def __str__(self):
        return self.title


class Notice(models.Model):
    CATEGORY_CHOICES = [
        ('academic', 'Academic'),
        ('admission', 'Admission'),
        ('events', 'Events & Celebrations'),
        ('exams', 'Examinations'),
        ('holidays', 'Holidays & Closures'),
        ('general', 'General Notice'),
    ]

    title = models.CharField(max_length=300)
    slug = models.SlugField(max_length=350, unique=True, blank=True)
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES, default='general')
    content = models.TextField()
    attachment_url = models.TextField(blank=True, default="")
    publish_date = models.DateField()
    is_pinned = models.BooleanField(default=False, help_text="Pin to top of notice board")
    is_active = models.BooleanField(default=True)
    views_count = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-is_pinned', '-publish_date', '-created_at']

    def save(self, *args, **kwargs):
        if not self.slug:
            base_slug = slugify(self.title)
            slug = base_slug
            counter = 1
            while Notice.objects.filter(slug=slug).exclude(pk=self.pk).exists():
                slug = f"{base_slug}-{counter}"
                counter += 1
            self.slug = slug
        super().save(*args, **kwargs)

    def __str__(self):
        return f"[{self.get_category_display()}] {self.title}"


class News(models.Model):
    """School news & event stories (photo-driven). Separate from official Notices."""
    CATEGORY_CHOICES = [
        ('events', 'Events & Celebrations'),
        ('academic', 'Academic Achievements'),
        ('sports', 'Sports'),
        ('cultural', 'Arts & Culture'),
        ('campus', 'Campus Life'),
        ('general', 'General News'),
    ]

    title = models.CharField(max_length=300)
    slug = models.SlugField(max_length=350, unique=True, blank=True)
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES, default='events')
    summary = models.CharField(max_length=400, blank=True, default="", help_text="Short teaser shown on cards (auto-generated from the story if empty)")
    content = models.TextField(help_text="Full story. Blank lines create new paragraphs.")
    image_url = models.TextField(blank=True, default="", help_text="Cover photo")
    gallery_images = models.JSONField(default=list, blank=True, help_text="List of additional photo URLs")
    publish_date = models.DateField()
    is_featured = models.BooleanField(default=False, help_text="Highlight as the lead story")
    is_active = models.BooleanField(default=True)
    views_count = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-is_featured', '-publish_date', '-created_at']
        verbose_name_plural = "News"

    def save(self, *args, **kwargs):
        if not self.slug:
            base_slug = slugify(self.title) or 'news'
            slug = base_slug
            counter = 1
            while News.objects.filter(slug=slug).exclude(pk=self.pk).exists():
                slug = f"{base_slug}-{counter}"
                counter += 1
            self.slug = slug
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title


class Club(models.Model):
    name = models.CharField(max_length=200)
    slug = models.SlugField(max_length=250, unique=True, blank=True)
    category = models.CharField(max_length=100, blank=True, default='', help_text="Optional category or theme tag")
    motto = models.CharField(max_length=255, blank=True)
    description = models.TextField()
    icon_name = models.CharField(max_length=50, default="Activity", help_text="Lucide icon name e.g. Cpu, Mic, Award, Compass")
    image_url = models.TextField(blank=True, default="")
    gallery_images = models.JSONField(default=list, blank=True, help_text="List of additional image URLs for the club gallery")
    moderator_name = models.CharField(max_length=200, blank=True)
    schedule = models.CharField(max_length=200, blank=True, default="Every Thursday, 2:30 PM - 4:00 PM")
    key_activities = models.JSONField(default=list, blank=True, help_text="List of activity strings")
    achievements = models.JSONField(default=list, blank=True, help_text="List of achievement strings")
    order = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ['order', 'name']

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name


class AdmissionGuide(models.Model):
    academic_year = models.CharField(max_length=50, default="2026-2027")
    title = models.CharField(max_length=255, default="Admissions Open for Academic Session 2026-2027")
    overview = models.TextField()
    is_open = models.BooleanField(default=True)
    eligibility = models.JSONField(default=list, blank=True, help_text="[{'grade': 'Playgroup', 'age': '3-4 years', 'criteria': '...'}]")
    application_steps = models.JSONField(default=list, blank=True, help_text="[{'step': 1, 'title': '...', 'description': '...'}]")
    required_documents = models.JSONField(default=list, blank=True)
    fee_structure = models.JSONField(default=list, blank=True, help_text="[{'grade': '...', 'admission_fee': '...', 'monthly_tuition': '...'}]")
    show_fees = models.BooleanField(default=True, help_text="If off, fee amounts are hidden from the public website and API (visible only to logged-in admins).")
    important_dates = models.JSONField(default=list, blank=True, help_text="[{'event': '...', 'date': '...'}]")
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Admission Guide - {self.academic_year}"


class AdmissionInquiry(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending Review'),
        ('contacted', 'Contacted / Interview Scheduled'),
        ('admitted', 'Admitted'),
        ('archived', 'Archived'),
    ]

    student_name = models.CharField(max_length=200)
    parent_name = models.CharField(max_length=200)
    email = models.EmailField()
    phone = models.CharField(max_length=30)
    grade_applying = models.CharField(max_length=100)
    previous_school = models.CharField(max_length=255, blank=True)
    date_of_birth = models.DateField(null=True, blank=True)
    message = models.TextField(blank=True)
    admin_notes = models.TextField(blank=True, default="", help_text="Internal staff notes")
    status = models.CharField(max_length=50, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.student_name} ({self.grade_applying}) - {self.parent_name}"


class GalleryItem(models.Model):
    title = models.CharField(max_length=255)
    category = models.CharField(max_length=100, blank=True, default='', help_text="Optional category tag")
    media_type = models.CharField(max_length=20, default='image', choices=[('image', 'Image'), ('video', 'Video')])
    image_url = models.TextField()
    video_url = models.TextField(blank=True, default="")
    caption = models.TextField(blank=True)
    event_date = models.DateField(null=True, blank=True)
    is_featured = models.BooleanField(default=False)
    order = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['order', '-created_at']

    def __str__(self):
        return self.title


DEFAULT_HIGHLIGHTS = [
    {"title": "Cambridge Curriculum", "desc": "International CAIE Standards", "icon": "Award"},
    {"title": "Holy Cross Tradition", "desc": "Holistic Moral & Intellectual Leadership", "icon": "Heart"},
    {"title": "24+ Clubs & Athletics", "desc": "Robotics, Debating, Science & Sports", "icon": "Trophy"},
]

DEFAULT_GRADES = [
    "Playgroup", "Nursery", "Kindergarten", "Grade I", "Grade II", "Grade III", "Grade IV",
    "Grade V", "Grade VI", "Grade VII", "Grade VIII", "Grade IX (O Level)", "Grade XI (A Level)",
]


class SiteSettings(models.Model):
    """Singleton: global contact, location, branding and widget settings."""
    school_name = models.CharField(max_length=255, default="St. Joseph International School")
    school_subtitle = models.CharField(max_length=255, default="INTERNATIONAL SCHOOL \u2022 NARINDA", blank=True)
    logo_url = models.TextField(blank=True, default="", help_text="Custom logo image URL or uploaded base64 data URL. If blank, official crest icon is used.")
    footer_bg_url = models.TextField(blank=True, default="", help_text="Custom parallax background image URL or uploaded data URL for the website footer. Recommended: 1920x1080px (16:9) landscape.")
    phone_primary = models.CharField(max_length=60, default="+880 1746-866393")
    phone_secondary = models.CharField(max_length=60, blank=True, default="")
    email = models.EmailField(default="sjisnarinda2021@gmail.com")
    whatsapp_number = models.CharField(max_length=30, blank=True, default="", help_text="Digits only with country code, e.g. 8801711234567")
    address = models.TextField(default="32 Shah Shaheb Lane, Narinda, Dhaka-1100, Bangladesh")
    office_hours = models.CharField(max_length=255, default="Sun \u2013 Thu \u00b7 08:00 AM \u2013 2:00 PM")
    weekend_note = models.CharField(max_length=255, blank=True, default="Friday \u2013 Saturday: Academic Recess (Registrar by Appointment)")
    accreditation_label = models.CharField(max_length=255, blank=True, default="Cambridge International Curriculum")
    admissions_open = models.BooleanField(default=True)
    admissions_label = models.CharField(max_length=120, default="Admissions 2026\u201327 Open")
    map_embed_url = models.URLField(max_length=2000, blank=True, default="")
    map_link = models.URLField(max_length=1000, blank=True, default="https://maps.google.com/?q=St+Joseph+International+School+Narinda+Dhaka")
    facebook_url = models.URLField(max_length=500, blank=True)
    instagram_url = models.URLField(max_length=500, blank=True)
    youtube_url = models.URLField(max_length=500, blank=True)
    security_note = models.CharField(max_length=255, blank=True, default="24/7 Security Controlled Entrance & Dedicated Visitor Registration Desk.")
    show_notice_views = models.BooleanField(default=True, help_text="Show viewers count on circular notices")
    highlights = models.JSONField(default=list, blank=True, help_text="[{'title','desc','icon'}] shown on the hero card")
    inquiry_grades = models.JSONField(default=list, blank=True, help_text="Grade options in quick inquiry form")
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name_plural = "Site Settings"

    def save(self, *args, **kwargs):
        if not self.highlights:
            self.highlights = DEFAULT_HIGHLIGHTS
        if not self.inquiry_grades:
            self.inquiry_grades = DEFAULT_GRADES
        super().save(*args, **kwargs)

    def __str__(self):
        return "Site Settings"


class Testimonial(models.Model):
    name = models.CharField(max_length=200)
    role = models.CharField(max_length=255, help_text="e.g. Parent of Class IX Student")
    badge = models.CharField(max_length=80, blank=True, default="Parent Voice")
    avatar_url = models.TextField(blank=True, default="")
    quote = models.TextField()
    rating = models.PositiveSmallIntegerField(default=5)
    order = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['order', '-created_at']

    def __str__(self):
        return self.name


class FAQ(models.Model):
    question = models.CharField(max_length=400)
    answer = models.TextField()
    category = models.CharField(max_length=80, blank=True, default="General")
    order = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ['order', 'id']
        verbose_name = "FAQ"

    def __str__(self):
        return self.question


class StaffMember(models.Model):
    ROLE_CHOICES = [
        ('admin', 'Administration Body & Leadership'),
        ('teacher', 'Academic Faculty & Teaching Staff'),
        ('office', 'Office & Administrative Staff'),
        ('staff', 'Support & Operations Staff'),
    ]

    name = models.CharField(max_length=200)
    role_type = models.CharField(max_length=40, choices=ROLE_CHOICES, default='teacher')
    designation = models.CharField(max_length=200, help_text="e.g. Senior Cambridge Physics Faculty or Vice Principal")
    department = models.CharField(max_length=150, blank=True, default="", help_text="e.g. Department of Science, Governing Council, IT & Systems")
    image_url = models.TextField(blank=True, default="", help_text="Image URL or base64 data URL")
    qualification = models.CharField(max_length=255, blank=True, help_text="e.g. M.Sc. in Physics (DU), Cambridge Certified")
    email = models.EmailField(blank=True, default="")
    phone = models.CharField(max_length=50, blank=True, default="")
    bio = models.TextField(blank=True, default="")
    order = models.PositiveIntegerField(default=0)
    is_featured = models.BooleanField(default=False, help_text="Feature in leadership showcase")
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['order', 'id']
        verbose_name = "Faculty & Staff Member"
        verbose_name_plural = "Faculty & Staff Members"

    def __str__(self):
        return f"{self.name} ({self.get_role_type_display()}) - {self.designation}"


class SyllabusItem(models.Model):
    SECTION_CHOICES = [
        ('cambridge_primary', 'Cambridge Primary (Playgroup - Grade 5)'),
        ('cambridge_lower_sec', 'Cambridge Lower Secondary (Grade 6 - 8)'),
        ('cambridge_igcse', 'Cambridge Upper Secondary / IGCSE (Grade 9 - 10)'),
        ('gce_alevel', 'Cambridge Advanced / A-Level (Grade 11 - 12)'),
        ('general', 'General Curriculum & Assessment Overview'),
    ]

    title = models.CharField(max_length=255, help_text="e.g. Grade 1 Annual Academic Syllabus & Curriculum Booklet")
    slug = models.SlugField(max_length=300, unique=True, blank=True)
    grade = models.CharField(max_length=100, help_text="e.g. Grade 1, Grade 9 (IGCSE), Playgroup")
    subject = models.CharField(max_length=150, blank=True, default="All Subjects", help_text="Optional subject or 'All Subjects'")
    subjects_included = models.TextField(blank=True, default="", help_text="e.g. English, Mathematics, Science, Bengali, ICT, Art & Craft")
    academic_year = models.CharField(max_length=50, default="2026-2027")
    curriculum_section = models.CharField(max_length=50, choices=SECTION_CHOICES, default='cambridge_primary')
    file_url = models.TextField(help_text="PDF file URL or /circulars/...")
    file_size = models.CharField(max_length=50, blank=True, default="PDF Document", help_text="e.g. 1.2 MB or 24 Pages")
    description = models.TextField(blank=True, default="", help_text="Syllabus overview, objectives and assessment structure")
    version = models.CharField(max_length=50, blank=True, default="v2026.1")
    term = models.CharField(max_length=100, blank=True, default="Full Academic Year", help_text="e.g. Full Academic Year, Term 1 & 2")
    order = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)
    download_count = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['order', 'grade', '-created_at']
        verbose_name = "Syllabus Item"
        verbose_name_plural = "Syllabus Items"

    def save(self, *args, **kwargs):
        if not self.slug:
            base_slug = slugify(f"{self.grade}-{self.academic_year}") or 'syllabus'
            slug = base_slug
            counter = 1
            while SyllabusItem.objects.filter(slug=slug).exclude(pk=self.pk).exists():
                slug = f"{base_slug}-{counter}"
                counter += 1
            self.slug = slug
        super().save(*args, **kwargs)

    def __str__(self):
        return f"[{self.grade}] {self.title} ({self.academic_year})"


class Publication(models.Model):
    TYPE_CHOICES = [
        ('magazine', 'Annual School Magazine'),
        ('yearbook', 'Annual Yearbook & Milestones'),
        ('newsletter', 'Term Newsletter & Gazette'),
        ('prospectus', 'Academic Prospectus'),
        ('handbook', 'Student & Parent Handbook'),
    ]

    title = models.CharField(max_length=255, help_text="e.g. The Josephite Chronicle - Annual School Magazine")
    slug = models.SlugField(max_length=300, unique=True, blank=True)
    publication_type = models.CharField(max_length=50, choices=TYPE_CHOICES, default='magazine')
    edition = models.CharField(max_length=100, default="Annual Edition 2025-2026", help_text="e.g. Volume XIV, Issue 1")
    academic_year = models.CharField(max_length=50, default="2025-2026")
    cover_image_url = models.TextField(blank=True, default="", help_text="Cover photo preview URL")
    pdf_url = models.TextField(help_text="PDF file URL for the flipbook")
    file_size = models.CharField(max_length=50, blank=True, default="PDF Document")
    pages_count = models.PositiveIntegerField(default=0, help_text="Total number of pages")
    description = models.TextField(blank=True, default="", help_text="Foreword, editorial message, or description")
    editor_name = models.CharField(max_length=150, blank=True, default="SJIS Editorial Board")
    publish_date = models.DateField(null=True, blank=True)
    is_featured = models.BooleanField(default=False)
    order = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)
    views_count = models.PositiveIntegerField(default=0)
    download_count = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['order', '-publish_date', '-created_at']
        verbose_name = "School Publication"
        verbose_name_plural = "School Publications"

    def save(self, *args, **kwargs):
        if not self.slug:
            base_slug = slugify(f"{self.title}-{self.academic_year}") or 'publication'
            slug = base_slug
            counter = 1
            while Publication.objects.filter(slug=slug).exclude(pk=self.pk).exists():
                slug = f"{base_slug}-{counter}"
                counter += 1
            self.slug = slug
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.title} ({self.get_publication_type_display()} - {self.academic_year})"


import uuid as _uuid


# ── Admission Settings (Singleton) ───────────────────────────────────────────

DEFAULT_ADMISSION_GRADES = [
    'Playgroup (Age 3.5+)',
    'Nursery (Age 4.5+)',
    'Kindergarten (Age 5.5+)',
    'Grade 1',
    'Grade 2',
    'Grade 3',
    'Grade 4',
    'Grade 5',
    'Grade 6 (Junior)',
    'Grade 7',
    'Grade 8',
    'Grade 9 (Cambridge IGCSE)',
    'Grade 11 (Cambridge A-Level)',
]


class AdmissionSettings(models.Model):
    """Singleton model: all admission-cycle operational switches."""

    GATEWAY_CHOICES = [
        ('manual', 'Manual / Cash Payment'),
        ('sslcommerz', 'SSLCommerz'),
        ('bkash', 'bKash'),
        ('nagad', 'Nagad'),
    ]
    PAGE_SIZE_CHOICES = [
        ('A4', 'A4 (210 × 297 mm)'),
        ('Legal', 'Legal / F4 (216 × 356 mm)'),
    ]
    INTERVIEW_MODE_CHOICES = [
        ('slot_based', 'Slot-Based (auto-assign on submit/payment)'),
        ('manual', 'Manual (admin assigns per application)'),
    ]

    # ── Master Portal Control (Start / Stop Online Admission Form) ───────────
    admissions_open = models.BooleanField(
        default=True,
        help_text="Master on/off switch for online admission applications. When OFF, the apply form is closed and submissions are blocked."
    )
    admissions_closed_message = models.TextField(
        blank=True,
        default="Online admission applications for the current academic session are currently closed. For inquiries or special assistance, please contact our Admissions Desk at +880 1746-866393 or visit our campus office.",
        help_text="Custom announcement message displayed to applicants on the application page when admissions are closed."
    )

    # ── Classes & Grades (Field 7 on Apply Form) ──────────────────────────────
    available_grades = models.JSONField(
        default=list, blank=True,
        help_text="List of class/grade names open for admission applications (Field 7 on apply form)."
    )

    # ── Payment ────────────────────────────────────────────────────────────────
    payment_required = models.BooleanField(
        default=False,
        help_text="Master toggle. If OFF, applicants can submit and download form without any payment."
    )
    payment_gateway = models.CharField(
        max_length=30, choices=GATEWAY_CHOICES, default='manual',
        help_text="Payment gateway to use when payment is required."
    )
    application_fee = models.DecimalField(
        max_digits=10, decimal_places=2, default=500.00,
        help_text="Application fee amount in BDT."
    )
    payment_currency = models.CharField(max_length=10, default='BDT')

    # SSLCommerz credentials
    sslcommerz_store_id = models.CharField(max_length=200, blank=True, default='')
    sslcommerz_store_pass = models.CharField(max_length=200, blank=True, default='')
    sslcommerz_is_sandbox = models.BooleanField(default=True, help_text="Use SSLCommerz sandbox (test) mode.")

    # bKash credentials
    bkash_app_key = models.CharField(max_length=200, blank=True, default='')
    bkash_app_secret = models.CharField(max_length=200, blank=True, default='')
    bkash_username = models.CharField(max_length=200, blank=True, default='')
    bkash_password = models.CharField(max_length=200, blank=True, default='')
    bkash_is_sandbox = models.BooleanField(default=True)

    # Nagad credentials
    nagad_merchant_id = models.CharField(max_length=200, blank=True, default='')
    nagad_merchant_key = models.CharField(max_length=200, blank=True, default='')
    nagad_is_sandbox = models.BooleanField(default=True)

    # ── Print / Form ──────────────────────────────────────────────────────────
    print_page_size = models.CharField(
        max_length=10, choices=PAGE_SIZE_CHOICES, default='A4',
        help_text="Paper size for the printed admission form and admit card."
    )
    form_header_note = models.TextField(
        blank=True, default='',
        help_text="Optional note printed at the top of the form (e.g. special instructions, session notice)."
    )

    # ── Document Checklist ────────────────────────────────────────────────────
    document_checklist = models.JSONField(
        default=list, blank=True,
        help_text=(
            'List of items parents must bring on interview day. '
            'Format: [{"item": "Birth Certificate (Original)", "required": true}, ...]'
        )
    )
    reporting_instructions = models.TextField(
        blank=True, default='',
        help_text="Special instructions printed at the bottom of the admit card (e.g. reporting time, dress code, what to bring)."
    )

    # ── Interview Scheduling & Admit Card Date ────────────────────────────────
    interview_mode = models.CharField(
        max_length=20, choices=INTERVIEW_MODE_CHOICES, default='manual',
        help_text="How interview slots are assigned to applicants."
    )
    admission_test_date = models.CharField(
        max_length=100, blank=True, default="7th March '26",
        help_text="Default admission test / interview date printed on admit cards (e.g. 7th March '26 or 2026-03-07)."
    )
    admission_test_time = models.CharField(
        max_length=50, blank=True, default="09:30 AM",
        help_text="Default admission test / interview time printed on admit cards (e.g. 09:30 AM)."
    )
    admission_test_venue = models.CharField(
        max_length=255, blank=True, default="SJIS Narinda Campus",
        help_text="Default venue for admission test / interview."
    )

    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Admission Settings"
        verbose_name_plural = "Admission Settings"

    def save(self, *args, **kwargs):
        # Enforce singleton pattern
        self.__class__.objects.exclude(pk=self.pk).delete()
        super().save(*args, **kwargs)
        # Keep SiteSettings.admissions_open synchronized across the platform
        try:
            site_settings = SiteSettings.objects.first()
            if site_settings and site_settings.admissions_open != self.admissions_open:
                site_settings.admissions_open = self.admissions_open
                site_settings.save(update_fields=['admissions_open'])
        except Exception:
            pass

    @classmethod
    def get_settings(cls):
        obj, _ = cls.objects.get_or_create(pk=1)
        if not obj.available_grades:
            obj.available_grades = list(DEFAULT_ADMISSION_GRADES)
            obj.save(update_fields=['available_grades'])
        return obj

    def __str__(self):
        return "Admission Settings"


# ── Interview Slot ───────────────────────────────────────────────────────────

class InterviewSlot(models.Model):
    """A schedulable interview/assessment slot with a fixed capacity."""

    date = models.DateField(help_text="Date of interview / assessment.")
    start_time = models.TimeField(help_text="Slot start time.")
    end_time = models.TimeField(help_text="Slot end time.")
    label = models.CharField(
        max_length=150, blank=True, default='',
        help_text="e.g. Morning Batch – 9:00 AM. Auto-generated if blank."
    )
    grade_filter = models.CharField(
        max_length=200, blank=True, default='',
        help_text="Restrict slot to a specific grade (e.g. 'Nursery'). Leave blank for all grades."
    )
    venue = models.CharField(
        max_length=300, blank=True,
        default='32 Shah Shaheb Lane, Narinda, Dhaka-1100',
        help_text="Venue / room for this slot."
    )
    capacity = models.PositiveIntegerField(
        default=30,
        help_text="Maximum number of applicants allowed in this slot."
    )
    booked_count = models.PositiveIntegerField(
        default=0, help_text="Number of applicants assigned to this slot."
    )
    is_active = models.BooleanField(default=True)
    notes = models.TextField(blank=True, default='')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['date', 'start_time']
        verbose_name = "Interview Slot"
        verbose_name_plural = "Interview Slots"

    @property
    def is_full(self):
        return self.booked_count >= self.capacity

    @property
    def available_seats(self):
        return max(0, self.capacity - self.booked_count)

    @property
    def display_label(self):
        if self.label:
            return self.label
        time_str = self.start_time.strftime('%I:%M %p').lstrip('0') if self.start_time else ''
        return f"{self.date.strftime('%d %b %Y')} – {time_str}"

    def __str__(self):
        return self.display_label


class FormSerialCounter(models.Model):
    """
    Automatic Form Serial Counter Lock.
    Guarantees thread-safe, strictly increasing, collision-proof form numbers
    under concurrent online payments, gateway IPNs, and bulk admin operations.
    """
    prefix = models.CharField(max_length=10, unique=True, default="27", help_text="e.g. 27 for academic session 2027")
    last_serial = models.PositiveIntegerField(default=270000, help_text="Last issued integer serial")
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Form Serial Counter"
        verbose_name_plural = "Form Serial Counters"

    def __str__(self):
        return f"FormSerialCounter [{self.prefix}] -> #{self.last_serial}"

    @classmethod
    def get_next_serial(cls, prefix="27"):
        """
        Atomically increments and returns the next form serial string.
        Uses SELECT ... FOR UPDATE to hold an exclusive database row lock.
        """
        from django.db import transaction
        with transaction.atomic():
            counter, _ = cls.objects.select_for_update().get_or_create(
                prefix=prefix,
                defaults={'last_serial': int(f"{prefix}0000")}
            )

            # Sync counter with existing database records if any are higher
            existing_serials = []
            for fn in OnlineApplication.objects.filter(form_no__startswith=prefix).values_list('form_no', flat=True):
                try:
                    num = int(fn)
                    if num >= int(f"{prefix}0001") and len(fn.strip()) == 6:
                        existing_serials.append(num)
                except (ValueError, TypeError):
                    pass

            if existing_serials:
                max_existing = max(existing_serials)
                if max_existing > counter.last_serial:
                    counter.last_serial = max_existing

            counter.last_serial += 1
            counter.save(update_fields=['last_serial', 'updated_at'])
            return str(counter.last_serial)


class ApplicationIdCounter(models.Model):
    """
    Atomic Application ID Counter Lock (SJIS-{year}-{seq:05d}).
    Prevents race collisions under simultaneous submissions.
    """
    year = models.PositiveIntegerField(unique=True)
    last_seq = models.PositiveIntegerField(default=0)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Application ID Counter"
        verbose_name_plural = "Application ID Counters"

    def __str__(self):
        return f"ApplicationIdCounter [{self.year}] -> #{self.last_seq}"

    @classmethod
    def get_next_id(cls, year=None):
        import datetime
        from django.db import transaction
        if not year:
            year = datetime.date.today().year

        with transaction.atomic():
            counter, _ = cls.objects.select_for_update().get_or_create(
                year=year,
                defaults={'last_seq': 0}
            )

            existing_seqs = []
            for app_id in OnlineApplication.objects.filter(application_id__startswith=f"SJIS-{year}-").values_list('application_id', flat=True):
                try:
                    seq = int(app_id.split('-')[-1])
                    existing_seqs.append(seq)
                except (ValueError, IndexError):
                    pass

            if existing_seqs:
                max_existing = max(existing_seqs)
                if max_existing > counter.last_seq:
                    counter.last_seq = max_existing

            counter.last_seq += 1
            counter.save(update_fields=['last_seq', 'updated_at'])
            return f"SJIS-{year}-{counter.last_seq:05d}"


class OnlineApplication(models.Model):
    """Full online admission application (multi-step form)."""

    STATUS_CHOICES = [
        ('draft', 'Draft (Incomplete)'),
        ('payment_pending', 'Payment Pending'),
        ('submitted', 'Submitted – Pending Review'),
        ('under_review', 'Under Review'),
        ('shortlisted', 'Shortlisted – Entrance Exam Scheduled'),
        ('interview_scheduled', 'Interview Scheduled'),
        ('documents_required', 'Additional Documents Required'),
        ('approved', 'Approved – Admission Offered'),
        ('enrolled', 'Enrolled / Confirmed'),
        ('waitlisted', 'Waitlisted'),
        ('rejected', 'Not Selected'),
        ('withdrawn', 'Withdrawn by Applicant'),
    ]

    PAYMENT_STATUS_CHOICES = [
        ('not_required', 'Not Required'),
        ('pending', 'Payment Pending'),
        ('completed', 'Payment Completed'),
        ('failed', 'Payment Failed'),
        ('refunded', 'Refunded'),
    ]

    GENDER_CHOICES = [
        ('male', 'Male'),
        ('female', 'Female'),
        ('other', 'Other / Prefer not to say'),
    ]

    RELIGION_CHOICES = [
        ('islam', 'Islam'),
        ('christianity', 'Christianity'),
        ('hinduism', 'Hinduism'),
        ('buddhism', 'Buddhism'),
        ('other', 'Other'),
    ]

    BLOOD_GROUP_CHOICES = [
        ('A+', 'A+'), ('A-', 'A-'),
        ('B+', 'B+'), ('B-', 'B-'),
        ('AB+', 'AB+'), ('AB-', 'AB-'),
        ('O+', 'O+'), ('O-', 'O-'),
        ('unknown', 'Unknown'),
    ]

    GUARDIAN_RELATION_CHOICES = [
        ('father', 'Father'),
        ('mother', 'Mother'),
        ('guardian', 'Legal Guardian'),
        ('other', 'Other Relative'),
    ]

    LIVING_WITH_CHOICES = [
        ('parents', 'Parents'),
        ('father', 'Father'),
        ('mother', 'Mother'),
        ('other', 'Other'),
    ]

    # ── Unique Application Reference ──────────────────────────────────────────
    application_id = models.CharField(
        max_length=20, unique=True, blank=True,
        help_text="Auto-generated e.g. SJIS-2026-00042"
    )
    form_no = models.CharField(
        max_length=30, blank=True, default="",
        help_text="Physical form serial number e.g. 026110. Only assigned after payment (or if payment not required)."
    )
    academic_year = models.CharField(max_length=20, default="2026-2027")
    status = models.CharField(max_length=30, choices=STATUS_CHOICES, default='submitted')
    current_step = models.PositiveSmallIntegerField(default=4, help_text="Last completed step (1-4)")

    # ── Payment Tracking ──────────────────────────────────────────────────────
    payment_status = models.CharField(
        max_length=20, choices=PAYMENT_STATUS_CHOICES, default='not_required',
        help_text="Payment status for this application."
    )
    payment_transaction_id = models.CharField(
        max_length=255, blank=True, default='',
        help_text="Gateway transaction / tran_id reference."
    )
    payment_amount = models.DecimalField(
        max_digits=10, decimal_places=2, null=True, blank=True,
        help_text="Amount paid in BDT."
    )
    payment_gateway_ref = models.CharField(
        max_length=500, blank=True, default='',
        help_text="Full gateway response reference string."
    )
    payment_completed_at = models.DateTimeField(
        null=True, blank=True,
        help_text="Timestamp when payment was confirmed."
    )

    # ── Interview Slot ────────────────────────────────────────────────────────
    interview_slot = models.ForeignKey(
        'InterviewSlot',
        null=True, blank=True,
        on_delete=models.SET_NULL,
        related_name='bookings',
        help_text="Assigned interview slot."
    )

    # ── STEP 1 · Student Information ─────────────────────────────────────────
    student_first_name = models.CharField(max_length=100)
    student_last_name = models.CharField(max_length=100)
    student_name_bangla = models.CharField(max_length=200, blank=True, default="")
    date_of_birth = models.DateField()
    gender = models.CharField(max_length=20, choices=GENDER_CHOICES)
    religion = models.CharField(max_length=20, choices=RELIGION_CHOICES, blank=True, default="")
    blood_group = models.CharField(max_length=10, choices=BLOOD_GROUP_CHOICES, default='unknown')
    nationality = models.CharField(max_length=80, default="Bangladeshi")
    birth_certificate_no = models.CharField(max_length=100, blank=True, default="")
    passport_no = models.CharField(max_length=50, blank=True, default="")
    student_photo_url = models.TextField(blank=True, default="")
    student_living_with = models.CharField(
        max_length=20, choices=LIVING_WITH_CHOICES, default='parents',
        help_text="Student living with: Parents, Father, Mother, Other (Field 9 of physical form)"
    )

    # ── STEP 2 · Academic Background ─────────────────────────────────────────
    grade_applying = models.CharField(max_length=80)
    section_preference = models.CharField(max_length=60, blank=True, default="English Medium (Cambridge)",
        help_text="Exclusively English Medium (Cambridge Curriculum)")
    current_school_and_class = models.CharField(
        max_length=255, blank=True, default="",
        help_text="School & Class in which candidate is studying this year (Field 10 of physical form)"
    )
    previous_school_name = models.CharField(max_length=255, blank=True, default="")
    previous_school_city = models.CharField(max_length=120, blank=True, default="")
    previous_school_board = models.CharField(max_length=120, blank=True, default="",
        help_text="e.g. Dhaka Board, CAIE, NCTB")
    last_grade_result = models.CharField(max_length=100, blank=True, default="",
        help_text="e.g. GPA 5.00 / A* / 95%")
    last_grade_year = models.CharField(max_length=20, blank=True, default="")
    previous_curriculum = models.CharField(max_length=100, blank=True, default="",
        help_text="e.g. Cambridge, National Curriculum, IB")
    extracurricular_interests = models.TextField(blank=True, default="",
        help_text="Clubs, sports, arts, competitions, etc.")
    special_needs_or_conditions = models.TextField(blank=True, default="",
        help_text="Any medical / learning conditions the school should know about")

    # ── STEP 3 · Parent / Guardian Information ───────────────────────────────
    # Father
    father_name = models.CharField(max_length=200, blank=True, default="")
    father_profession = models.CharField(max_length=150, blank=True, default="", help_text="Occupation")
    father_organization = models.CharField(max_length=200, blank=True, default="")
    father_qualification = models.CharField(max_length=150, blank=True, default="")
    father_phone = models.CharField(max_length=30, blank=True, default="", help_text="Contact Number (Father)")
    father_nid = models.CharField(max_length=50, blank=True, default="")
    father_office_address = models.TextField(
        blank=True, default="",
        help_text="Office address & Tel No (Father) [Attach Business Card]"
    )

    # Mother
    mother_name = models.CharField(max_length=200, blank=True, default="")
    mother_profession = models.CharField(max_length=150, blank=True, default="", help_text="Occupation")
    mother_organization = models.CharField(max_length=200, blank=True, default="")
    mother_qualification = models.CharField(max_length=150, blank=True, default="")
    mother_phone = models.CharField(max_length=30, blank=True, default="", help_text="Contact Number (Mother)")
    mother_nid = models.CharField(max_length=50, blank=True, default="")
    mother_office_address = models.TextField(
        blank=True, default="",
        help_text="Office address & Tel No (Mother) [Attach Business Card]"
    )

    # Primary Guardian / Contact
    guardian_relation = models.CharField(max_length=20, choices=GUARDIAN_RELATION_CHOICES, default='father')
    contact_email = models.EmailField()
    contact_phone = models.CharField(max_length=30)
    emergency_contact_name = models.CharField(max_length=200, blank=True, default="")
    emergency_contact_phone = models.CharField(max_length=30, blank=True, default="")
    emergency_contact_relation = models.CharField(max_length=80, blank=True, default="")

    # Address
    present_address = models.TextField()
    permanent_address = models.TextField(blank=True, default="")
    present_thana = models.CharField(max_length=100, blank=True, default="")
    present_district = models.CharField(max_length=100, blank=True, default="")
    present_zip = models.CharField(max_length=20, blank=True, default="")

    # ── STEP 4 · Declaration & Sibling ───────────────────────────────────────
    parent_declaration_accepted = models.BooleanField(default=False)
    sibling_at_sjis = models.BooleanField(default=False,
        help_text="Does the student have a sibling currently enrolled at SJIS?")
    sibling_name_class = models.CharField(max_length=200, blank=True, default="")
    # Field 11 Sibling Structured Breakdown
    sibling_name = models.CharField(max_length=150, blank=True, default="", help_text="Sibling Name")
    sibling_class = models.CharField(max_length=50, blank=True, default="", help_text="Sibling Class")
    sibling_section = models.CharField(max_length=50, blank=True, default="", help_text="Sibling Section")
    sibling_roll = models.CharField(max_length=50, blank=True, default="", help_text="Sibling Roll")

    how_did_you_hear = models.CharField(max_length=150, blank=True, default="",
        help_text="e.g. Facebook, Friend, Newspaper, Alumni")
    additional_notes = models.TextField(blank=True, default="")

    # ── Physical Form & Office Use Metadata ──────────────────────────────────
    submission_deadline = models.CharField(
        max_length=50, blank=True, default="",
        help_text="The candidate must submit this form on (e.g. 28.06.2026)"
    )
    received_by = models.CharField(max_length=100, blank=True, default="", help_text="Staff: Received by")
    received_date = models.CharField(max_length=50, blank=True, default="")
    interview_time = models.CharField(max_length=50, blank=True, default="", help_text="Interview time e.g. 09:30 AM")

    # ── Admin / Internal ─────────────────────────────────────────────────────
    admin_notes = models.TextField(blank=True, default="")
    entrance_exam_date = models.DateField(null=True, blank=True)
    entrance_exam_venue = models.CharField(max_length=255, blank=True, default="")
    entrance_exam_score = models.CharField(max_length=50, blank=True, default="")
    interview_date = models.DateTimeField(null=True, blank=True)
    offer_letter_sent = models.BooleanField(default=False)
    documents_verified = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    submitted_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name = "Online Admission Application"
        verbose_name_plural = "Online Admission Applications"

    @classmethod
    def find_duplicate(cls, birth_certificate_no='', passport_no='', first_name='', last_name='', dob=None, phone='', academic_year='2026-2027'):
        """
        Duplicate Submission Guard:
        Searches for active duplicate application within the same academic cycle.
        Returns (existing_application, reason) or (None, None).
        """
        import re
        academic_year = academic_year or "2026-2027"
        qs = cls.objects.filter(academic_year=academic_year).exclude(status='withdrawn')

        # Rule 1: Birth Certificate match (min 6 digits)
        clean_birth_no = re.sub(r'[\s\-]', '', birth_certificate_no or '')
        if clean_birth_no and len(clean_birth_no) >= 6:
            for app in qs.exclude(birth_certificate_no=''):
                app_birth = re.sub(r'[\s\-]', '', app.birth_certificate_no or '')
                if app_birth and app_birth.lower() == clean_birth_no.lower():
                    return app, f"Birth Registration Number '{birth_certificate_no}' is already on file."

        # Rule 2: Passport match (min 6 chars)
        clean_passport = re.sub(r'[\s\-]', '', passport_no or '')
        if clean_passport and len(clean_passport) >= 6:
            for app in qs.exclude(passport_no=''):
                app_pass = re.sub(r'[\s\-]', '', app.passport_no or '')
                if app_pass and app_pass.lower() == clean_passport.lower():
                    return app, f"Passport Number '{passport_no}' is already registered."

        # Rule 3: First Name + Last Name + Date of Birth + Contact Phone
        if first_name and last_name and dob and phone:
            clean_phone = re.sub(r'[^\d]', '', phone)
            name_match_qs = qs.filter(
                student_first_name__iexact=first_name.strip(),
                student_last_name__iexact=last_name.strip(),
                date_of_birth=dob
            )
            for app in name_match_qs:
                app_phone = re.sub(r'[^\d]', '', app.contact_phone or '')
                if clean_phone and (clean_phone == app_phone or (len(clean_phone) >= 10 and clean_phone[-10:] == app_phone[-10:])):
                    return app, f"Student '{first_name} {last_name}' with the same date of birth and guardian phone is already registered."

        return None, None

    def save(self, *args, **kwargs):
        # Atomic Application ID generation with lock
        if not self.application_id:
            self.application_id = ApplicationIdCounter.get_next_id()

        # Automatic Form Serial Counter Lock
        # Prefix 27 = Academic Year 2027. Assigned ONLY when payment is completed or not required.
        if not self.form_no and self.payment_status in ('not_required', 'completed'):
            self.form_no = FormSerialCounter.get_next_serial(prefix="27")

        # Track if we are newly assigning an interview slot
        is_new_slot = False
        if not self.interview_slot_id and self.payment_status in ('not_required', 'completed'):
            try:
                settings = AdmissionSettings.get_settings()
                if settings.interview_mode == 'slot_based':
                    grade = (self.grade_applying or '').strip()
                    clean_grade = grade.split('(')[0].strip()
                    slot_qs = InterviewSlot.objects.filter(
                        is_active=True,
                        booked_count__lt=models.F('capacity')
                    ).order_by('date', 'start_time')
                    if clean_grade:
                        # Exact or word-boundary check to prevent 'Grade 1' matching 'Grade 11'
                        matched_slot = None
                        for s in slot_qs:
                            if not s.grade_filter:
                                continue
                            filters = [f.strip() for f in s.grade_filter.split(',') if f.strip()]
                            for f in filters:
                                f_clean = f.split('(')[0].strip()
                                if f_clean.lower() == clean_grade.lower() or f.lower() == grade.lower():
                                    matched_slot = s
                                    break
                            if matched_slot:
                                break
                        slot = matched_slot or slot_qs.filter(grade_filter='').first()
                    else:
                        slot = slot_qs.first()
                    if slot:
                        self.interview_slot = slot
                        is_new_slot = True
            except Exception:
                pass

        super().save(*args, **kwargs)

        # Increment slot booked_count only when newly auto-assigned
        if is_new_slot and self.interview_slot_id:
            InterviewSlot.objects.filter(
                pk=self.interview_slot_id
            ).update(booked_count=models.F('booked_count') + 1)

    def confirm_payment(self, transaction_id='', gateway_ref='', amount=None):
        """Call this when payment gateway confirms success."""
        import django.utils.timezone as tz
        self.payment_status = 'completed'
        self.payment_transaction_id = transaction_id or ''
        self.payment_gateway_ref = gateway_ref or ''
        if amount:
            self.payment_amount = amount
        self.payment_completed_at = tz.now()
        self.status = 'submitted'
        self.save()

    def log_activity(self, action, performed_by='System', details='', role='Admissions Staff', request=None):
        """Record an immutable staff activity / event audit log entry for this application."""
        ip = None
        user_name = performed_by
        user_role = role
        if request is not None:
            if hasattr(request, 'user') and request.user and request.user.is_authenticated:
                user_name = request.user.get_full_name() or request.user.username
                if request.user.is_superuser:
                    user_role = "Super Admin"
                elif request.user.is_staff:
                    user_role = "Admissions Staff"
            x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
            if x_forwarded_for:
                ip = x_forwarded_for.split(',')[0].strip()
            else:
                ip = request.META.get('REMOTE_ADDR')

        return ApplicationAuditLog.objects.create(
            application=self,
            action=action,
            performed_by=user_name or 'System Admin',
            performed_by_role=user_role,
            details=details,
            ip_address=ip
        )

    @property
    def student_full_name(self):
        return f"{self.student_first_name} {self.student_last_name}".strip()

    def __str__(self):
        return f"[{self.application_id}] {self.student_full_name} – {self.grade_applying} ({self.get_status_display()})"


class ApplicationDocument(models.Model):
    """Documents uploaded as part of an OnlineApplication."""

    DOC_TYPE_CHOICES = [
        ('birth_certificate', 'Birth Certificate'),
        ('previous_report_card', 'Previous School Report Card / Marksheet'),
        ('transfer_certificate', 'Transfer Certificate (TC)'),
        ('student_photo', 'Student Passport-size Photo'),
        ('parent_nid', 'Parent / Guardian NID'),
        ('father_nid', 'Father National ID (NID)'),
        ('mother_nid', 'Mother National ID (NID)'),
        ('immunization_record', 'Immunization / Health Record'),
        ('recommendation_letter', 'Recommendation Letter'),
        ('medical_report', 'Medical / Special Needs Record'),
        ('other', 'Other Supporting Document'),
    ]

    application = models.ForeignKey(
        OnlineApplication,
        on_delete=models.CASCADE,
        related_name='documents'
    )
    doc_type = models.CharField(max_length=50, choices=DOC_TYPE_CHOICES)
    file_url = models.TextField(help_text="Uploaded file URL")
    original_filename = models.CharField(max_length=255, blank=True, default="")
    file_size = models.CharField(max_length=50, blank=True, default="")
    uploaded_by = models.CharField(max_length=150, blank=True, default="Applicant")
    is_staff_upload = models.BooleanField(default=False, help_text="True if uploaded on applicant's behalf by staff at admissions desk")
    notes = models.TextField(blank=True, default="", help_text="Staff or verification notes")
    verified = models.BooleanField(default=False)
    verified_by = models.CharField(max_length=100, blank=True, default="")
    uploaded_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['doc_type']
        verbose_name = "Application Document"
        verbose_name_plural = "Application Documents"

    def __str__(self):
        return f"{self.get_doc_type_display()} for {self.application.application_id}"


class ApplicationAuditLog(models.Model):
    """Staff Activity and Event Audit Trail for Admission Applications."""

    ACTION_CHOICES = [
        ('application_created', 'Application Created'),
        ('status_changed', 'Status Changed'),
        ('payment_confirmed', 'Payment Confirmed & Form Serial Issued'),
        ('payment_updated', 'Payment Details Updated'),
        ('slot_assigned', 'Interview / Test Slot Assigned'),
        ('slot_unlinked', 'Interview / Test Slot Unlinked'),
        ('document_uploaded', 'Document Uploaded (On-Behalf)'),
        ('document_verified', 'Document Verified'),
        ('document_unverified', 'Document Verification Revoked'),
        ('document_deleted', 'Document Removed'),
        ('note_added', 'Staff Note Added / Updated'),
        ('bulk_action', 'Bulk Action Executed'),
        ('details_updated', 'Candidate Details Updated'),
    ]

    application = models.ForeignKey(
        OnlineApplication,
        on_delete=models.CASCADE,
        related_name='audit_logs'
    )
    action = models.CharField(max_length=50, choices=ACTION_CHOICES)
    performed_by = models.CharField(max_length=150, default="System Admin")
    performed_by_role = models.CharField(max_length=100, blank=True, default="Admissions Staff")
    details = models.TextField(blank=True, default="")
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name = "Application Audit Log"
        verbose_name_plural = "Application Audit Logs"

    def __str__(self):
        return f"[{self.application.application_id}] {self.get_action_display()} by {self.performed_by}"


# ─────────────────────────────────────────────────────────────────────────────
# APPLICATION DRAFT  — Cloud Save & Resume from Any Device
# ─────────────────────────────────────────────────────────────────────────────

class ApplicationDraft(models.Model):
    """
    Stores a partial admission application draft so parents can safely resume
    from any device using their mobile number + a short PIN code.
    Drafts auto-expire after 30 days.
    """
    draft_key  = models.CharField(
        max_length=8, unique=True, db_index=True,
        help_text="Short code shown to the applicant e.g. SJ4729."
    )
    phone = models.CharField(
        max_length=30, db_index=True,
        help_text="Parent mobile number — used to verify ownership."
    )
    draft_data = models.JSONField(default=dict, blank=True)
    documents  = models.JSONField(default=list, blank=True)
    current_step = models.PositiveSmallIntegerField(default=1)
    candidate_name = models.CharField(max_length=200, blank=True, default='')
    grade_applying = models.CharField(max_length=80, blank=True, default='')
    created_at  = models.DateTimeField(auto_now_add=True)
    updated_at  = models.DateTimeField(auto_now=True)
    expires_at  = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ['-updated_at']
        verbose_name = "Application Draft (Cloud)"
        verbose_name_plural = "Application Drafts (Cloud)"

    def save(self, *args, **kwargs):
        import datetime as dt, random, string
        if not self.draft_key:
            while True:
                code = "SJ" + ''.join(random.choices(string.digits, k=4))
                if not ApplicationDraft.objects.filter(draft_key=code).exists():
                    self.draft_key = code
                    break
        if not self.expires_at:
            self.expires_at = dt.datetime.now(dt.timezone.utc) + dt.timedelta(days=30)
        super().save(*args, **kwargs)

    def __str__(self):
        return f"Draft {self.draft_key} — {self.candidate_name or 'Unknown'} ({self.phone})"
