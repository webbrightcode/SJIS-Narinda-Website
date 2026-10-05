from django.contrib import admin
from .models import (
    SliderSlide,
    AboutInfo,
    Notice,
    Club,
    AdmissionGuide,
    AdmissionInquiry,
    GalleryItem,
    StaffMember,
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
    list_display = ('title', 'principal_name', 'updated_at')


@admin.register(Notice)
class NoticeAdmin(admin.ModelAdmin):
    list_display = ('title', 'category', 'publish_date', 'is_pinned', 'is_active', 'views_count')
    list_editable = ('is_pinned', 'is_active')
    list_filter = ('category', 'is_pinned', 'is_active', 'publish_date')
    search_fields = ('title', 'content')
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

