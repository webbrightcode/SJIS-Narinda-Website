from rest_framework import serializers
from .models import (
    SliderSlide,
    AboutInfo,
    Notice,
    Club,
    AdmissionGuide,
    AdmissionInquiry,
    GalleryItem,
    SiteSettings,
    Testimonial,
    FAQ,
    StaffMember,
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
        if not data.get('principal_image_url'):
            head = StaffMember.objects.filter(is_featured=True, role_type='admin').first()
            if head and head.image_url:
                data['principal_image_url'] = head.image_url
            else:
                data['principal_image_url'] = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=800&auto=format&fit=crop'
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

