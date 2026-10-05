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


class Club(models.Model):
    CATEGORY_CHOICES = [
        ('stem', 'STEM & Innovation'),
        ('arts', 'Cultural & Fine Arts'),
        ('debate', 'Debate & Public Speaking'),
        ('sports', 'Sports & Athletics'),
        ('service', 'Leadership & Social Welfare'),
    ]

    name = models.CharField(max_length=200)
    slug = models.SlugField(max_length=250, unique=True, blank=True)
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES, default='stem')
    motto = models.CharField(max_length=255, blank=True)
    description = models.TextField()
    icon_name = models.CharField(max_length=50, default="Activity", help_text="Lucide icon name e.g. Cpu, Mic, Award, Compass")
    image_url = models.TextField(blank=True, default="")
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
    CATEGORY_CHOICES = [
        ('campus', 'Campus & Heritage'),
        ('academics', 'Academic & STEM Labs'),
        ('sports', 'Sports & Athletics'),
        ('cultural', 'Cultural & Performing Arts'),
        ('events', 'Annual Events & Celebrations'),
    ]

    title = models.CharField(max_length=255)
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES, default='campus')
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
        return f"[{self.get_category_display()}] {self.title}"


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
    phone_primary = models.CharField(max_length=60, default="+880 1746-866393")
    phone_secondary = models.CharField(max_length=60, blank=True, default="")
    email = models.EmailField(default="sjisnarinda2021@gmail.com")
    whatsapp_number = models.CharField(max_length=30, blank=True, default="", help_text="Digits only with country code, e.g. 8801711234567")
    address = models.TextField(default="32 Shah Shaheb Lane, Narinda, Dhaka-1100, Bangladesh")
    office_hours = models.CharField(max_length=255, default="Sun \u2013 Thu \u00b7 7:30 AM \u2013 4:30 PM")
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

