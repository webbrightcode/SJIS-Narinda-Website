from rest_framework import serializers
from .models import (
    SliderSlide,
    AboutInfo,
    Notice,
    News,
    Club,
    AdmissionGuide,
    AdmissionInquiry,
    GalleryItem,
    SiteSettings,
    Testimonial,
    FAQ,
    StaffMember,
    SyllabusItem,
    Publication,
    OnlineApplication,
    ApplicationDocument,
    AdmissionSettings,
    InterviewSlot,
)


class SliderSlideSerializer(serializers.ModelSerializer):
    class Meta:
        model = SliderSlide
        fields = '__all__'


class AboutInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = AboutInfo
        fields = '__all__'

    def to_representation(self, instance):
        data = super().to_representation(instance)
        title = data.get('principal_title') or ''
        if not title or 'principal' in title.lower() or 'head of school' in title.lower():
            data['principal_title'] = 'Administrator'
        image_url = data.get('principal_image_url') or ''
        if not image_url or 'unsplash.com' in image_url:
            head = StaffMember.objects.filter(is_featured=True, role_type='admin').first()
            if head and head.image_url and 'unsplash.com' not in head.image_url:
                data['principal_image_url'] = head.image_url
            else:
                data['principal_image_url'] = '/administrator-roktim.webp'
        if not data.get('history_image_url'):
            data['history_image_url'] = 'https://images.unsplash.com/photo-1546422904-90eab23c3d7e?q=80&w=1200&auto=format&fit=crop'
        return data


class NoticeSerializer(serializers.ModelSerializer):
    category_display = serializers.CharField(source='get_category_display', read_only=True)

    class Meta:
        model = Notice
        fields = '__all__'

    def to_representation(self, instance):
        data = super().to_representation(instance)
        url = data.get('attachment_url')
        if url and ('w3.org' in url or 'dummy.pdf' in url):
            data['attachment_url'] = '/circulars/sjis-official-circular.pdf'
        return data


class NewsSerializer(serializers.ModelSerializer):
    category_display = serializers.CharField(source='get_category_display', read_only=True)

    class Meta:
        model = News
        fields = '__all__'
        extra_kwargs = {'slug': {'required': False}}

    def to_representation(self, instance):
        data = super().to_representation(instance)
        if not data.get('summary'):
            plain = ' '.join((instance.content or '').split())
            data['summary'] = plain if len(plain) <= 180 else plain[:180].rstrip() + '…'
        return data


class ClubSerializer(serializers.ModelSerializer):
    category_display = serializers.SerializerMethodField()

    class Meta:
        model = Club
        fields = '__all__'

    def get_category_display(self, obj):
        return obj.category or ''


class AdmissionGuideSerializer(serializers.ModelSerializer):
    class Meta:
        model = AdmissionGuide
        fields = '__all__'


class AdmissionInquirySerializer(serializers.ModelSerializer):
    class Meta:
        model = AdmissionInquiry
        fields = '__all__'
        read_only_fields = ['created_at']


class GalleryItemSerializer(serializers.ModelSerializer):
    category_display = serializers.SerializerMethodField()

    class Meta:
        model = GalleryItem
        fields = '__all__'

    def get_category_display(self, obj):
        return obj.category or ''


class SiteSettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = SiteSettings
        fields = '__all__'


class TestimonialSerializer(serializers.ModelSerializer):
    class Meta:
        model = Testimonial
        fields = '__all__'


class FAQSerializer(serializers.ModelSerializer):
    class Meta:
        model = FAQ
        fields = '__all__'


class StaffMemberSerializer(serializers.ModelSerializer):
    role_type_display = serializers.CharField(source='get_role_type_display', read_only=True)

    class Meta:
        model = StaffMember
        fields = '__all__'


class SyllabusItemSerializer(serializers.ModelSerializer):
    curriculum_section_display = serializers.CharField(source='get_curriculum_section_display', read_only=True)

    class Meta:
        model = SyllabusItem
        fields = '__all__'
        extra_kwargs = {'slug': {'required': False}}

    def to_representation(self, instance):
        data = super().to_representation(instance)
        url = data.get('file_url')
        if url and ('w3.org' in url or 'dummy.pdf' in url):
            data['file_url'] = '/circulars/sjis-official-circular.pdf'
        return data


class PublicationSerializer(serializers.ModelSerializer):
    publication_type_display = serializers.CharField(source='get_publication_type_display', read_only=True)

    class Meta:
        model = Publication
        fields = '__all__'
        extra_kwargs = {'slug': {'required': False}}


class ApplicationDocumentSerializer(serializers.ModelSerializer):
    doc_type_display = serializers.CharField(source='get_doc_type_display', read_only=True)

    class Meta:
        model = ApplicationDocument
        fields = '__all__'
        read_only_fields = ['uploaded_at']


class AdmissionSettingsSerializer(serializers.ModelSerializer):
    """Public-safe serializer that hides raw gateway credentials."""
    class Meta:
        model = AdmissionSettings
        # Expose everything EXCEPT raw credential secrets on the public endpoint
        exclude = [
            'sslcommerz_store_pass',
            'bkash_app_secret',
            'bkash_password',
            'nagad_merchant_key',
        ]


class AdmissionSettingsFullSerializer(serializers.ModelSerializer):
    """Full serializer for admin use (includes credentials)."""
    class Meta:
        model = AdmissionSettings
        fields = '__all__'


class InterviewSlotSerializer(serializers.ModelSerializer):
    display_label = serializers.CharField(read_only=True)
    is_full = serializers.BooleanField(read_only=True)
    available_seats = serializers.IntegerField(read_only=True)
    bookings_count = serializers.SerializerMethodField()

    class Meta:
        model = InterviewSlot
        fields = '__all__'

    def get_bookings_count(self, obj):
        return obj.bookings.count()


class OnlineApplicationSerializer(serializers.ModelSerializer):
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    gender_display = serializers.CharField(source='get_gender_display', read_only=True)
    guardian_relation_display = serializers.CharField(source='get_guardian_relation_display', read_only=True)
    payment_status_display = serializers.CharField(source='get_payment_status_display', read_only=True)
    student_full_name = serializers.CharField(read_only=True)
    documents = ApplicationDocumentSerializer(many=True, read_only=True)
    documents_count = serializers.SerializerMethodField()
    verified_docs_count = serializers.SerializerMethodField()
    interview_slot_detail = InterviewSlotSerializer(source='interview_slot', read_only=True)

    class Meta:
        model = OnlineApplication
        fields = '__all__'
        read_only_fields = ['application_id', 'created_at', 'updated_at']

    def get_documents_count(self, obj):
        return obj.documents.count()

    def get_verified_docs_count(self, obj):
        return obj.documents.filter(verified=True).count()


class OnlineApplicationListSerializer(serializers.ModelSerializer):
    """Lightweight serializer for list views (no nested docs)."""
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    payment_status_display = serializers.CharField(source='get_payment_status_display', read_only=True)
    student_full_name = serializers.CharField(read_only=True)
    documents_count = serializers.SerializerMethodField()

    class Meta:
        model = OnlineApplication
        fields = [
            'id', 'application_id', 'form_no', 'student_full_name', 'student_first_name',
            'student_last_name', 'gender', 'grade_applying', 'academic_year',
            'contact_email', 'contact_phone', 'student_living_with', 'current_school_and_class',
            'status', 'status_display', 'payment_status', 'payment_status_display',
            'payment_transaction_id', 'payment_completed_at',
            'documents_count', 'documents_verified',
            'interview_date', 'interview_time', 'interview_slot',
            'created_at', 'submitted_at',
        ]

    def get_documents_count(self, obj):
        return obj.documents.count()
