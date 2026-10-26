from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    SliderSlideViewSet,
    AboutInfoView,
    NoticeViewSet,
    NewsViewSet,
    ClubViewSet,
    AdmissionGuideView,
    AdmissionInquiryViewSet,
    GalleryItemViewSet,
    LandingPageBundleView,
    AdminLoginView,
    AdminVerifyView,
    DashboardStatsView,
    SystemDiagnosticsView,
    DataExportBackupView,
    DataRestoreView,
    SiteSettingsView,
    TestimonialViewSet,
    FAQViewSet,
    StaffMemberViewSet,
    SyllabusItemViewSet,
    PublicationViewSet,
    FileUploadView,
    OnlineApplicationViewSet,
    ApplicationDocumentViewSet,
    ApplicationStatusLookupView,
    AdmissionSettingsView,
    InterviewSlotViewSet,
    PaymentInitiateView,
    PaymentCallbackView,
    PaymentManualConfirmView,
    DraftSaveView,
    DraftRetrieveView,
)

router = DefaultRouter()
router.register(r'slides', SliderSlideViewSet, basename='slide')
router.register(r'notices', NoticeViewSet, basename='notice')
router.register(r'news', NewsViewSet, basename='news')
router.register(r'syllabus', SyllabusItemViewSet, basename='syllabus')
router.register(r'publications', PublicationViewSet, basename='publication')
router.register(r'clubs', ClubViewSet, basename='club')
router.register(r'gallery', GalleryItemViewSet, basename='gallery')
router.register(r'testimonials', TestimonialViewSet, basename='testimonial')
router.register(r'faqs', FAQViewSet, basename='faq')
router.register(r'faculty', StaffMemberViewSet, basename='faculty')
router.register(r'staff-members', StaffMemberViewSet, basename='staff-member')
router.register(r'inquiries', AdmissionInquiryViewSet, basename='inquiry')
router.register(r'applications', OnlineApplicationViewSet, basename='application')
router.register(r'app-documents', ApplicationDocumentViewSet, basename='app-document')
router.register(r'interview-slots', InterviewSlotViewSet, basename='interview-slot')

urlpatterns = [
    path('applications/track/', ApplicationStatusLookupView.as_view(), name='application-track'),
    path('', include(router.urls)),
    path('upload/', FileUploadView.as_view(), name='file-upload'),
    path('site-settings/', SiteSettingsView.as_view(), name='site-settings'),
    path('about/', AboutInfoView.as_view(), name='about-info'),
    path('admission-guide/', AdmissionGuideView.as_view(), name='admission-guide'),
    path('admission-settings/', AdmissionSettingsView.as_view(), name='admission-settings'),
    path('landing-bundle/', LandingPageBundleView.as_view(), name='landing-bundle'),
    path('dashboard-stats/', DashboardStatsView.as_view(), name='dashboard-stats'),
    path('system-diagnostics/', SystemDiagnosticsView.as_view(), name='system-diagnostics'),
    path('data-backup/', DataExportBackupView.as_view(), name='data-backup'),
    path('data-restore/', DataRestoreView.as_view(), name='data-restore'),
    path('auth/login/', AdminLoginView.as_view(), name='admin-login'),
    path('auth/me/', AdminVerifyView.as_view(), name='admin-verify'),
    # Payment Gateway
    path('payment/initiate/', PaymentInitiateView.as_view(), name='payment-initiate'),
    path('payment/callback/', PaymentCallbackView.as_view(), name='payment-callback'),
    path('payment/ipn/', PaymentCallbackView.as_view(), name='payment-ipn'),
    path('payment/manual-confirm/', PaymentManualConfirmView.as_view(), name='payment-manual-confirm'),
    # Draft: Cloud Save & Resume
    path('draft/save/', DraftSaveView.as_view(), name='draft-save'),
    path('draft/retrieve/', DraftRetrieveView.as_view(), name='draft-retrieve'),
]
