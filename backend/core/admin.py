from django.contrib import admin
from .models import (
    SliderSlide,
    AboutInfo,
    Notice,
    News,
    Club,
    AdmissionGuide,
    AdmissionInquiry,
    GalleryItem,
    StaffMember,
    SyllabusItem,
    Publication,
    OnlineApplication,
    ApplicationDocument,
    AdmissionSettings,
    InterviewSlot,
    ApplicationDraft,
)

admin.site.site_header = "St. Joseph International School, Narinda - Administration"
admin.site.site_title = "SJIS Admin Portal"
admin.site.index_title = "School Content & Admissions Management"


@admin.register(SliderSlide)
class SliderSlideAdmin(admin.ModelAdmin):
    list_display = ('title', 'badge', 'order', 'is_active', 'created_at')
    list_editable = ('order', 'is_active')
    search_fields = ('title', 'subtitle', 'badge')
    list_filter = ('is_active',)


@admin.register(AboutInfo)
class AboutInfoAdmin(admin.ModelAdmin):
    list_display = ('title', 'principal_name', 'principal_title', 'updated_at')
    fieldsets = (
        ('Basic Information', {
            'fields': ('title', 'tagline', 'history', 'mission', 'vision')
        }),
        ('Head of Institution / Leadership', {
            'fields': ('principal_name', 'principal_title', 'head_role_badge', 'principal_image_url', 'principal_message')
        }),
        ('Homepage Welcome Section Customization', {
            'fields': ('welcome_tag', 'welcome_title', 'heritage_years', 'heritage_label', 'pillars', 'primary_button_text', 'primary_button_url', 'secondary_button_text', 'secondary_button_url')
        }),
        ('Institutional Stats & Extras', {
            'fields': ('stats', 'core_values', 'facilities', 'emergency_alert')
        }),
    )


@admin.register(Notice)
class NoticeAdmin(admin.ModelAdmin):
    list_display = ('title', 'category', 'publish_date', 'is_pinned', 'is_active', 'views_count')
    list_editable = ('is_pinned', 'is_active')
    list_filter = ('category', 'is_pinned', 'is_active', 'publish_date')
    search_fields = ('title', 'content')
    prepopulated_fields = {'slug': ('title',)}


@admin.register(News)
class NewsAdmin(admin.ModelAdmin):
    list_display = ('title', 'category', 'publish_date', 'is_featured', 'is_active', 'views_count')
    list_editable = ('is_featured', 'is_active')
    list_filter = ('category', 'is_featured', 'is_active', 'publish_date')
    search_fields = ('title', 'summary', 'content')
    prepopulated_fields = {'slug': ('title',)}


@admin.register(Club)
class ClubAdmin(admin.ModelAdmin):
    list_display = ('name', 'category', 'moderator_name', 'order', 'is_active')
    list_editable = ('order', 'is_active')
    list_filter = ('category', 'is_active')
    search_fields = ('name', 'description', 'motto', 'moderator_name')
    prepopulated_fields = {'slug': ('name',)}


@admin.register(AdmissionGuide)
class AdmissionGuideAdmin(admin.ModelAdmin):
    list_display = ('academic_year', 'title', 'is_open', 'updated_at')
    list_editable = ('is_open',)


@admin.register(AdmissionInquiry)
class AdmissionInquiryAdmin(admin.ModelAdmin):
    list_display = ('student_name', 'grade_applying', 'parent_name', 'phone', 'email', 'status', 'created_at')
    list_filter = ('status', 'grade_applying', 'created_at')
    search_fields = ('student_name', 'parent_name', 'phone', 'email')
    readonly_fields = ('created_at',)


@admin.register(GalleryItem)
class GalleryItemAdmin(admin.ModelAdmin):
    list_display = ('title', 'category', 'media_type', 'is_featured', 'order', 'event_date')
    list_editable = ('is_featured', 'order')
    list_filter = ('category', 'media_type', 'is_featured')
    search_fields = ('title', 'caption')


@admin.register(StaffMember)
class StaffMemberAdmin(admin.ModelAdmin):
    list_display = ('name', 'role_type', 'designation', 'department', 'order', 'is_featured', 'is_active')
    list_editable = ('order', 'is_featured', 'is_active')
    list_filter = ('role_type', 'department', 'is_featured', 'is_active')
    search_fields = ('name', 'designation', 'department', 'qualification', 'bio')


@admin.register(SyllabusItem)
class SyllabusItemAdmin(admin.ModelAdmin):
    list_display = ('title', 'grade', 'subject', 'academic_year', 'curriculum_section', 'order', 'is_active', 'download_count')
    list_editable = ('order', 'is_active')
    list_filter = ('curriculum_section', 'academic_year', 'grade', 'is_active')
    search_fields = ('title', 'subject', 'grade', 'description')
    prepopulated_fields = {'slug': ('title',)}


@admin.register(Publication)
class PublicationAdmin(admin.ModelAdmin):
    list_display = ('title', 'publication_type', 'edition', 'academic_year', 'order', 'is_featured', 'is_active', 'views_count', 'download_count')
    list_editable = ('order', 'is_featured', 'is_active')
    list_filter = ('publication_type', 'academic_year', 'is_featured', 'is_active')
    search_fields = ('title', 'edition', 'description', 'editor_name')
    prepopulated_fields = {'slug': ('title',)}



class ApplicationDocumentInline(admin.TabularInline):
    model = ApplicationDocument
    extra = 0
    fields = ('doc_type', 'file_url', 'original_filename', 'file_size', 'verified', 'verified_by', 'uploaded_at')
    readonly_fields = ('uploaded_at',)


@admin.register(OnlineApplication)
class OnlineApplicationAdmin(admin.ModelAdmin):
    list_display = (
        'application_id', 'form_no', 'student_full_name_display', 'gender', 'grade_applying',
        'academic_year', 'payment_status', 'status', 'interview_slot', 'documents_verified', 'created_at',
    )
    list_filter = ('status', 'payment_status', 'grade_applying', 'academic_year', 'gender', 'documents_verified', 'interview_slot')
    search_fields = (
        'application_id', 'form_no', 'student_first_name', 'student_last_name',
        'contact_email', 'contact_phone', 'father_name', 'mother_name', 'payment_transaction_id',
    )
    readonly_fields = ('application_id', 'created_at', 'updated_at', 'submitted_at')
    inlines = [ApplicationDocumentInline]
    list_per_page = 30
    date_hierarchy = 'created_at'

    fieldsets = (
        ('Application Reference', {
            'fields': ('application_id', 'form_no', 'academic_year', 'status', 'current_step',
                       'submitted_at', 'created_at', 'updated_at')
        }),
        ('Payment Details', {
            'fields': ('payment_status', 'payment_amount', 'payment_transaction_id',
                       'payment_gateway_ref', 'payment_completed_at')
        }),
        ('Student Information', {
            'fields': (
                'student_first_name', 'student_last_name', 'student_name_bangla',
                'date_of_birth', 'gender', 'religion', 'blood_group',
                'nationality', 'birth_certificate_no', 'passport_no', 'student_photo_url',
                'student_living_with',
            )
        }),
        ('Academic Background', {
            'fields': (
                'grade_applying', 'section_preference', 'current_school_and_class',
                'previous_school_name', 'previous_school_city', 'previous_school_board',
                'last_grade_result', 'last_grade_year', 'previous_curriculum',
                'extracurricular_interests', 'special_needs_or_conditions',
            )
        }),
        ("Father Information", {
            'fields': (
                'father_name', 'father_profession', 'father_organization',
                'father_qualification', 'father_phone', 'father_nid', 'father_office_address',
            ),
            'classes': ('collapse',),
        }),
        ("Mother Information", {
            'fields': (
                'mother_name', 'mother_profession', 'mother_organization',
                'mother_qualification', 'mother_phone', 'mother_nid', 'mother_office_address',
            ),
            'classes': ('collapse',),
        }),
        ('Contact and Address', {
            'fields': (
                'guardian_relation', 'contact_email', 'contact_phone',
                'emergency_contact_name', 'emergency_contact_phone', 'emergency_contact_relation',
                'present_address', 'present_thana', 'present_district', 'present_zip',
                'permanent_address',
            )
        }),
        ('Declaration and Extras', {
            'fields': (
                'parent_declaration_accepted', 'sibling_at_sjis', 'sibling_name_class',
                'sibling_name', 'sibling_class', 'sibling_section', 'sibling_roll',
                'how_did_you_hear', 'additional_notes',
            )
        }),
        ('Admin and Evaluation', {
            'fields': (
                'interview_slot', 'interview_date', 'interview_time',
                'entrance_exam_date', 'entrance_exam_venue', 'entrance_exam_score',
                'offer_letter_sent', 'documents_verified', 'admin_notes',
            )
        }),
    )

    def student_full_name_display(self, obj):
        return obj.student_full_name
    student_full_name_display.short_description = 'Student Name'


@admin.register(ApplicationDocument)
class ApplicationDocumentAdmin(admin.ModelAdmin):
    list_display = ('application', 'doc_type', 'original_filename', 'verified', 'verified_by', 'uploaded_at')
    list_filter = ('doc_type', 'verified')
    search_fields = ('application__application_id', 'application__student_first_name', 'original_filename')
    readonly_fields = ('uploaded_at',)


@admin.register(AdmissionSettings)
class AdmissionSettingsAdmin(admin.ModelAdmin):
    list_display = ('__str__', 'payment_required', 'payment_gateway', 'application_fee', 'print_page_size', 'interview_mode', 'updated_at')
    fieldsets = (
        ('Payment Toggle', {
            'fields': ('payment_required', 'payment_gateway', 'application_fee', 'payment_currency'),
            'description': 'Master payment switch. If OFF, users can submit and download forms without paying.',
        }),
        ('SSLCommerz Credentials', {
            'fields': ('sslcommerz_store_id', 'sslcommerz_store_pass', 'sslcommerz_is_sandbox'),
            'classes': ('collapse',),
        }),
        ('bKash Credentials', {
            'fields': ('bkash_app_key', 'bkash_app_secret', 'bkash_username', 'bkash_password', 'bkash_is_sandbox'),
            'classes': ('collapse',),
        }),
        ('Nagad Credentials', {
            'fields': ('nagad_merchant_id', 'nagad_merchant_key', 'nagad_is_sandbox'),
            'classes': ('collapse',),
        }),
        ('Admissible Classes & Grades (Online Form Option 7)', {
            'fields': ('available_grades',),
            'description': 'Classes/grades open for admission applications on the public website.',
        }),
        ('Print & Form Settings', {
            'fields': ('print_page_size', 'form_header_note'),
        }),
        ('Document Checklist (Printed on Admit Card)', {
            'fields': ('document_checklist', 'reporting_instructions'),
        }),
        ('Interview Scheduling', {
            'fields': ('interview_mode',),
        }),
    )


@admin.register(InterviewSlot)
class InterviewSlotAdmin(admin.ModelAdmin):
    list_display = ('display_label', 'date', 'start_time', 'end_time', 'grade_filter', 'capacity', 'booked_count', 'available_seats', 'is_active')
    list_editable = ('is_active', 'capacity')
    list_filter = ('date', 'is_active', 'grade_filter')
    search_fields = ('label', 'grade_filter', 'venue', 'notes')
    date_hierarchy = 'date'
    readonly_fields = ('booked_count', 'created_at')


@admin.register(ApplicationDraft)
class ApplicationDraftAdmin(admin.ModelAdmin):
    list_display = ('draft_key', 'phone', 'candidate_name', 'grade_applying', 'current_step', 'updated_at', 'expires_at')
    search_fields = ('draft_key', 'phone', 'candidate_name', 'grade_applying')
    list_filter = ('current_step', 'created_at', 'expires_at')
    readonly_fields = ('draft_key', 'created_at', 'updated_at')

