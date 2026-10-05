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


class NoticeSerializer(serializers.ModelSerializer):
    category_display = serializers.CharField(source='get_category_display', read_only=True)

    class Meta:
        model = Notice
        fields = '__all__'


class ClubSerializer(serializers.ModelSerializer):
    category_display = serializers.CharField(source='get_category_display', read_only=True)

    class Meta:
        model = Club
        fields = '__all__'


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
    category_display = serializers.CharField(source='get_category_display', read_only=True)

    class Meta:
        model = GalleryItem
        fields = '__all__'


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

