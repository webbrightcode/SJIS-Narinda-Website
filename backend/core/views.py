import re
import uuid
from datetime import datetime, date
from urllib.parse import quote
from django.conf import settings
from django.contrib.auth import authenticate
from django.shortcuts import get_object_or_404, redirect
from django.db import models, transaction
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from rest_framework import viewsets, generics, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.authtoken.models import Token
from rest_framework.throttling import SimpleRateThrottle
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
    ApplicationAuditLog,
    AdmissionSettings,
    InterviewSlot,
    ApplicationDraft,
)
from .serializers import (
    SliderSlideSerializer,
    AboutInfoSerializer,
    NoticeSerializer,
    NewsSerializer,
    ClubSerializer,
    AdmissionGuideSerializer,
    AdmissionInquirySerializer,
    GalleryItemSerializer,
    SiteSettingsSerializer,
    TestimonialSerializer,
    FAQSerializer,
    StaffMemberSerializer,
    SyllabusItemSerializer,
    PublicationSerializer,
    OnlineApplicationSerializer,
    OnlineApplicationListSerializer,
    ApplicationDocumentSerializer,
    ApplicationAuditLogSerializer,
    AdmissionSettingsSerializer,
    AdmissionSettingsFullSerializer,
    InterviewSlotSerializer,
)


class AdminLoginView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        username = request.data.get('username', '').strip()
        password = request.data.get('password', '')

        if not username or not password:
            return Response(
                {"error": "Please provide both username and password."},
                status=status.HTTP_400_BAD_REQUEST
            )

        user = authenticate(username=username, password=password)
        if not user:
            return Response(
                {"error": "Invalid username or password."},
                status=status.HTTP_401_UNAUTHORIZED
            )

        token, _ = Token.objects.get_or_create(user=user)
        return Response({
            "token": token.key,
            "user": {
                "id": user.id,
                "username": user.username,
                "email": user.email,
                "is_staff": user.is_staff,
                "is_superuser": user.is_superuser,
            },
            "message": "Login successful"
        })


class AdminVerifyView(APIView):
    def get(self, request):
        if not request.user.is_authenticated:
            return Response({"authenticated": False}, status=status.HTTP_401_UNAUTHORIZED)
        return Response({
            "authenticated": True,
            "user": {
                "id": request.user.id,
                "username": request.user.username,
                "email": request.user.email,
                "is_staff": request.user.is_staff,
            }
        })


class DashboardStatsView(APIView):
    def get(self, request):
        total_slides = SliderSlide.objects.count()
        total_notices = Notice.objects.count()
        total_clubs = Club.objects.count()
        total_gallery = GalleryItem.objects.count()
        total_inquiries = AdmissionInquiry.objects.count()
        pending_inquiries = AdmissionInquiry.objects.filter(status='pending').count()
        recent_inquiries = AdmissionInquirySerializer(
            AdmissionInquiry.objects.all().order_by('-created_at')[:5],
            many=True
        ).data

        return Response({
            "stats": {
                "slides": total_slides,
                "notices": total_notices,
                "clubs": total_clubs,
                "gallery": total_gallery,
                "inquiries": total_inquiries,
                "pending_inquiries": pending_inquiries,
            },
            "recent_inquiries": recent_inquiries
        })


class SliderSlideViewSet(viewsets.ModelViewSet):
    queryset = SliderSlide.objects.all().order_by('order', '-created_at')
    serializer_class = SliderSlideSerializer
    pagination_class = None

    def get_queryset(self):
        # Allow filtering for active only on public frontend if requested
        active_only = self.request.query_params.get('active')
        if active_only and active_only.lower() in ['true', '1']:
            return SliderSlide.objects.filter(is_active=True).order_by('order', '-created_at')
        return SliderSlide.objects.all().order_by('order', '-created_at')


class AboutInfoView(APIView):
    def get(self, request):
        about = AboutInfo.objects.first()
        if not about:
            about = AboutInfo.objects.create()
        serializer = AboutInfoSerializer(about)
        return Response(serializer.data)

    def put(self, request):
        about = AboutInfo.objects.first()
        if not about:
            about = AboutInfo.objects.create()
        serializer = AboutInfoSerializer(about, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def patch(self, request):
        return self.put(request)


class NoticeViewSet(viewsets.ModelViewSet):
    serializer_class = NoticeSerializer
    lookup_field = 'id'

    def get_queryset(self):
        queryset = Notice.objects.all()
        # For public view, check active
        active_only = self.request.query_params.get('active')
        if active_only and active_only.lower() in ['true', '1']:
            queryset = queryset.filter(is_active=True)

        category = self.request.query_params.get('category')
        pinned = self.request.query_params.get('pinned')
        search = self.request.query_params.get('search')

        if category and category != 'all':
            queryset = queryset.filter(category=category)
        if pinned is not None:
            is_pinned = pinned.lower() in ['true', '1']
            queryset = queryset.filter(is_pinned=is_pinned)
        if search:
            queryset = queryset.filter(title__icontains=search) | queryset.filter(content__icontains=search)

        return queryset.order_by('-is_pinned', '-publish_date', '-created_at')

    def get_object(self):
        lookup = self.kwargs.get('id')
        queryset = self.filter_queryset(self.get_queryset())
        if lookup and not str(lookup).isdigit():
            obj = get_object_or_404(queryset, slug=lookup)
            self.check_object_permissions(self.request, obj)
            return obj
        return super().get_object()

    @action(detail=True, methods=['post'], permission_classes=[permissions.AllowAny])
    def increment_view(self, request, id=None):
        notice = self.get_object()
        Notice.objects.filter(pk=notice.pk).update(views_count=models.F('views_count') + 1)
        notice.refresh_from_db()
        return Response({'views_count': notice.views_count})


class NewsViewSet(viewsets.ModelViewSet):
    serializer_class = NewsSerializer
    lookup_field = 'id'

    def get_queryset(self):
        queryset = News.objects.all()
        active_only = self.request.query_params.get('active')
        if active_only and active_only.lower() in ['true', '1']:
            queryset = queryset.filter(is_active=True)

        category = self.request.query_params.get('category')
        search = self.request.query_params.get('search')
        if category and category != 'all':
            queryset = queryset.filter(category=category)
        if search:
            queryset = queryset.filter(title__icontains=search) | queryset.filter(content__icontains=search)

        return queryset.order_by('-is_featured', '-publish_date', '-created_at')

    def get_object(self):
        lookup = self.kwargs.get('id')
        queryset = self.filter_queryset(self.get_queryset())
        if lookup and not str(lookup).isdigit():
            obj = get_object_or_404(queryset, slug=lookup)
            self.check_object_permissions(self.request, obj)
            return obj
        return super().get_object()

    @action(detail=True, methods=['post'], permission_classes=[permissions.AllowAny])
    def increment_view(self, request, id=None):
        story = self.get_object()
        News.objects.filter(pk=story.pk).update(views_count=models.F('views_count') + 1)
        story.refresh_from_db()
        return Response({'views_count': story.views_count})


class SyllabusItemViewSet(viewsets.ModelViewSet):
    serializer_class = SyllabusItemSerializer
    lookup_field = 'id'

    def get_queryset(self):
        queryset = SyllabusItem.objects.all()
        active_only = self.request.query_params.get('active')
        if active_only and active_only.lower() in ['true', '1']:
            queryset = queryset.filter(is_active=True)

        section = self.request.query_params.get('section')
        grade = self.request.query_params.get('grade')
        year = self.request.query_params.get('year')
        search = self.request.query_params.get('search')

        if section and section != 'all':
            queryset = queryset.filter(curriculum_section=section)
        if grade and grade != 'all':
            queryset = queryset.filter(grade__iexact=grade)
        if year and year != 'all':
            queryset = queryset.filter(academic_year=year)
        if search:
            queryset = (
                queryset.filter(title__icontains=search)
                | queryset.filter(subject__icontains=search)
                | queryset.filter(subjects_included__icontains=search)
                | queryset.filter(grade__icontains=search)
                | queryset.filter(description__icontains=search)
            )

        return queryset.order_by('order', 'grade', '-created_at')

    def get_object(self):
        lookup = self.kwargs.get('id')
        queryset = self.filter_queryset(self.get_queryset())
        if lookup and not str(lookup).isdigit():
            obj = get_object_or_404(queryset, slug=lookup)
            self.check_object_permissions(self.request, obj)
            return obj
        return super().get_object()

    @action(detail=True, methods=['post'], permission_classes=[permissions.AllowAny])
    def increment_download(self, request, id=None):
        item = self.get_object()
        SyllabusItem.objects.filter(pk=item.pk).update(download_count=models.F('download_count') + 1)
        item.refresh_from_db()
        return Response({'download_count': item.download_count})


class PublicationViewSet(viewsets.ModelViewSet):
    serializer_class = PublicationSerializer
    lookup_field = 'id'

    def get_queryset(self):
        queryset = Publication.objects.all()
        active_only = self.request.query_params.get('active')
        if active_only and active_only.lower() in ['true', '1']:
            queryset = queryset.filter(is_active=True)

        pub_type = self.request.query_params.get('type')
        year = self.request.query_params.get('year')
        search = self.request.query_params.get('search')

        if pub_type and pub_type != 'all':
            queryset = queryset.filter(publication_type=pub_type)
        if year and year != 'all':
            queryset = queryset.filter(academic_year=year)
        if search:
            queryset = (
                queryset.filter(title__icontains=search)
                | queryset.filter(edition__icontains=search)
                | queryset.filter(description__icontains=search)
                | queryset.filter(editor_name__icontains=search)
            )

        return queryset.order_by('order', '-publish_date', '-created_at')

    def get_object(self):
        lookup = self.kwargs.get('id')
        queryset = self.filter_queryset(self.get_queryset())
        if lookup and not str(lookup).isdigit():
            obj = get_object_or_404(queryset, slug=lookup)
            self.check_object_permissions(self.request, obj)
            return obj
        return super().get_object()

    @action(detail=True, methods=['post'], permission_classes=[permissions.AllowAny])
    def increment_view(self, request, id=None):
        item = self.get_object()
        Publication.objects.filter(pk=item.pk).update(views_count=models.F('views_count') + 1)
        item.refresh_from_db()
        return Response({'views_count': item.views_count})

    @action(detail=True, methods=['post'], permission_classes=[permissions.AllowAny])
    def increment_download(self, request, id=None):
        item = self.get_object()
        Publication.objects.filter(pk=item.pk).update(download_count=models.F('download_count') + 1)
        item.refresh_from_db()
        return Response({'download_count': item.download_count})


class ClubViewSet(viewsets.ModelViewSet):
    serializer_class = ClubSerializer
    lookup_field = 'id'

    def get_queryset(self):
        queryset = Club.objects.all()
        active_only = self.request.query_params.get('active')
        if active_only and active_only.lower() in ['true', '1']:
            queryset = queryset.filter(is_active=True)

        category = self.request.query_params.get('category')
        if category and category != 'all':
            queryset = queryset.filter(category=category)
        return queryset.order_by('order', 'name')

    def get_object(self):
        lookup = self.kwargs.get('id')
        queryset = self.filter_queryset(self.get_queryset())
        if lookup and not str(lookup).isdigit():
            obj = get_object_or_404(queryset, slug=lookup)
            self.check_object_permissions(self.request, obj)
            return obj
        return super().get_object()


class AdmissionGuideView(APIView):
    @staticmethod
    def _is_admin(request):
        """True only if the request carries a valid admin auth token."""
        from rest_framework.authentication import TokenAuthentication
        try:
            result = TokenAuthentication().authenticate(request)
        except Exception:
            return False
        return bool(result and result[0] and result[0].is_active)

    def get(self, request):
        guide = AdmissionGuide.objects.first()
        if not guide:
            guide = AdmissionGuide.objects.create()
        data = AdmissionGuideSerializer(guide).data
        if not guide.show_fees and not self._is_admin(request):
            # Fee amounts never leave the server for public visitors.
            data['fee_structure'] = []
        return Response(data)

    def put(self, request):
        guide = AdmissionGuide.objects.first()
        if not guide:
            guide = AdmissionGuide.objects.create()
        serializer = AdmissionGuideSerializer(guide, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def patch(self, request):
        return self.put(request)


class AdmissionInquiryViewSet(viewsets.ModelViewSet):
    queryset = AdmissionInquiry.objects.all().order_by('-created_at')
    serializer_class = AdmissionInquirySerializer

    def get_queryset(self):
        queryset = AdmissionInquiry.objects.all().order_by('-created_at')
        status_param = self.request.query_params.get('status')
        search = self.request.query_params.get('search')

        if status_param and status_param != 'all':
            queryset = queryset.filter(status=status_param)
        if search:
            queryset = queryset.filter(student_name__icontains=search) | queryset.filter(parent_name__icontains=search) | queryset.filter(phone__icontains=search)

        return queryset


class GalleryItemViewSet(viewsets.ModelViewSet):
    serializer_class = GalleryItemSerializer
    queryset = GalleryItem.objects.all().order_by('order', '-created_at')

    def get_queryset(self):
        queryset = GalleryItem.objects.all()
        category = self.request.query_params.get('category')
        featured = self.request.query_params.get('featured')

        if category and category != 'all':
            queryset = queryset.filter(category=category)
        if featured is not None:
            is_feat = featured.lower() in ['true', '1']
            queryset = queryset.filter(is_featured=is_feat)

        return queryset.order_by('order', '-created_at')


def get_site_settings():
    obj = SiteSettings.objects.first()
    if not obj:
        obj = SiteSettings.objects.create()
    return obj


class SiteSettingsView(APIView):
    def get(self, request):
        return Response(SiteSettingsSerializer(get_site_settings()).data)

    def put(self, request):
        data = request.data.copy() if hasattr(request.data, 'copy') else dict(request.data)
        # Sanitize optional URL fields to prevent validation errors on placeholders, iframes, or missing protocol
        for url_field in ['facebook_url', 'instagram_url', 'youtube_url', 'map_embed_url', 'map_link']:
            if url_field in data and isinstance(data[url_field], str):
                val = data[url_field].strip()
                if url_field == 'map_embed_url' and val:
                    # Automatically extract src if full <iframe> snippet or src="..." was submitted
                    iframe_match = re.search(r'src=["\']([^"\']+)["\']', val, re.IGNORECASE)
                    if iframe_match:
                        val = iframe_match.group(1).strip()
                    val = val.strip('"`\'<> ')
                    # Convert standard search map URLs to embed format if output=embed is missing
                    if 'maps.google.com' in val and '/embed' not in val and 'q=' in val:
                        if 'output=embed' not in val:
                            val = f"{val}&output=embed" if '?' in val else f"{val}?output=embed"
                elif url_field == 'map_link' and val:
                    val = val.strip('"`\'<> ')

                if val.endswith('…') or val.endswith('...') or val in ['https://', 'http://', '']:
                    data[url_field] = ''
                elif val and not val.startswith(('http://', 'https://')):
                    data[url_field] = f'https://{val}'
                else:
                    data[url_field] = val

        serializer = SiteSettingsSerializer(get_site_settings(), data=data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def patch(self, request):
        return self.put(request)


class TestimonialViewSet(viewsets.ModelViewSet):
    serializer_class = TestimonialSerializer
    pagination_class = None

    def get_queryset(self):
        qs = Testimonial.objects.all()
        if (self.request.query_params.get('active') or '').lower() in ['true', '1']:
            qs = qs.filter(is_active=True)
        return qs.order_by('order', '-created_at')


class FAQViewSet(viewsets.ModelViewSet):
    serializer_class = FAQSerializer
    pagination_class = None

    def get_queryset(self):
        qs = FAQ.objects.all()
        if (self.request.query_params.get('active') or '').lower() in ['true', '1']:
            qs = qs.filter(is_active=True)
        return qs.order_by('order', 'id')


class StaffMemberViewSet(viewsets.ModelViewSet):
    serializer_class = StaffMemberSerializer
    pagination_class = None

    def get_queryset(self):
        qs = StaffMember.objects.all()
        if (self.request.query_params.get('active') or '').lower() in ['true', '1']:
            qs = qs.filter(is_active=True)
        role_type = self.request.query_params.get('role_type')
        if role_type and role_type != 'all':
            qs = qs.filter(role_type=role_type)
        department = self.request.query_params.get('department')
        if department and department != 'all':
            qs = qs.filter(department=department)
        search = self.request.query_params.get('search')
        if search:
            qs = qs.filter(
                models.Q(name__icontains=search) |
                models.Q(designation__icontains=search) |
                models.Q(department__icontains=search) |
                models.Q(qualification__icontains=search)
            )
        return qs.order_by('order', 'id')


class LandingPageBundleView(APIView):
    def get(self, request):
        slides = SliderSlide.objects.filter(is_active=True).order_by('order')[:6]
        about = AboutInfo.objects.first()
        about_data = None
        if about:
            about_data = AboutInfoSerializer(about).data
            if not about_data.get('pillars'):
                about_data['pillars'] = [
                    'Cambridge Assessment International Education (CAIE)',
                    'Dedicated Congregation of Holy Cross Mentorship',
                    'Comprehensive STEM & Robotics Laboratories',
                    'Champion Debating & Co-Curricular Guilds',
                ]
            if not about_data.get('principal_title'):
                about_data['principal_title'] = 'Administrator'
            if not about_data.get('head_role_badge'):
                about_data['head_role_badge'] = 'Head of Institution'
            if not about_data.get('welcome_tag'):
                about_data['welcome_tag'] = 'WELCOME TO ST. JOSEPH NARINDA'
            if not about_data.get('welcome_title'):
                about_data['welcome_title'] = 'Educating Hearts & Minds for Generations.'
            if not about_data.get('heritage_years'):
                about_data['heritage_years'] = '70+'
            if not about_data.get('heritage_label'):
                about_data['heritage_label'] = 'Years of Heritage'

        notices = Notice.objects.filter(is_active=True).order_by('-is_pinned', '-publish_date')[:6]
        news = News.objects.filter(is_active=True).order_by('-is_featured', '-publish_date')[:3]
        clubs = Club.objects.filter(is_active=True).order_by('order')[:6]
        gallery = GalleryItem.objects.filter(is_featured=True).order_by('order')[:8]
        if not gallery.exists():
            gallery = GalleryItem.objects.all().order_by('order')[:8]

        response = Response({
            "slides": SliderSlideSerializer(slides, many=True).data,
            "about": about_data,
            "notices": NoticeSerializer(notices, many=True).data,
            "news": NewsSerializer(news, many=True).data,
            "clubs": ClubSerializer(clubs, many=True).data,
            "gallery": GalleryItemSerializer(gallery, many=True).data,
            "settings": SiteSettingsSerializer(get_site_settings()).data,
            "testimonials": TestimonialSerializer(
                Testimonial.objects.filter(is_active=True).order_by('order'), many=True
            ).data,
        })
        response['Cache-Control'] = 'public, s-maxage=60, stale-while-revalidate=120'
        return response


class SystemDiagnosticsView(APIView):
    def get(self, request):
        import django, platform
        from django.db import connection
        db_engine = connection.settings_dict.get('ENGINE', 'unknown')
        return Response({
            "system": {
                "django_version": django.get_version(),
                "python_version": platform.python_version(),
                "platform": platform.platform(),
                "db_engine": "PostgreSQL" if "postgresql" in db_engine else "SQLite",
                "db_name": str(connection.settings_dict.get('NAME', 'sjis_db')),
                "status": "Healthy & Operational",
            },
            "counts": {
                "slides": SliderSlide.objects.count(),
                "notices": Notice.objects.count(),
                "clubs": Club.objects.count(),
                "gallery": GalleryItem.objects.count(),
                "inquiries": AdmissionInquiry.objects.count(),
            }
        })


class DataExportBackupView(APIView):
    def get(self, request):
        return Response({
            "exported_at": django.utils.timezone.now().isoformat() if hasattr(django, 'utils') else "",
            "institution": "St. Joseph International School, Narinda",
            "slides": SliderSlideSerializer(SliderSlide.objects.all(), many=True).data,
            "notices": NoticeSerializer(Notice.objects.all(), many=True).data,
            "clubs": ClubSerializer(Club.objects.all(), many=True).data,
            "gallery": GalleryItemSerializer(GalleryItem.objects.all(), many=True).data,
            "inquiries": AdmissionInquirySerializer(AdmissionInquiry.objects.all(), many=True).data,
            "about": AboutInfoSerializer(AboutInfo.objects.first()).data if AboutInfo.objects.exists() else None,
            "admission_guide": AdmissionGuideSerializer(AdmissionGuide.objects.first()).data if AdmissionGuide.objects.exists() else None,
            "site_settings": SiteSettingsSerializer(get_site_settings()).data,
            "testimonials": TestimonialSerializer(Testimonial.objects.all(), many=True).data,
            "faqs": FAQSerializer(FAQ.objects.all(), many=True).data,
            "publications": PublicationSerializer(Publication.objects.all(), many=True).data,
        })


class DataRestoreView(APIView):
    def post(self, request):
        data = request.data
        if not isinstance(data, dict):
            return Response({"error": "Invalid backup payload format."}, status=status.HTTP_400_BAD_REQUEST)
        
        counts = {"restored_slides": 0, "restored_notices": 0, "restored_clubs": 0, "restored_gallery": 0}
        
        if "slides" in data and isinstance(data["slides"], list):
            for item in data["slides"]:
                slide_id = item.get("id")
                fields = {k: v for k, v in item.items() if k not in ['id', 'created_at']}
                if slide_id and SliderSlide.objects.filter(id=slide_id).exists():
                    SliderSlide.objects.filter(id=slide_id).update(**fields)
                else:
                    SliderSlide.objects.create(**fields)
                counts["restored_slides"] += 1
                
        if "notices" in data and isinstance(data["notices"], list):
            for item in data["notices"]:
                n_id = item.get("id")
                fields = {k: v for k, v in item.items() if k not in ['id', 'created_at', 'category_display']}
                if n_id and Notice.objects.filter(id=n_id).exists():
                    Notice.objects.filter(id=n_id).update(**fields)
                else:
                    Notice.objects.create(**fields)
                counts["restored_notices"] += 1

        if "clubs" in data and isinstance(data["clubs"], list):
            for item in data["clubs"]:
                c_id = item.get("id")
                fields = {k: v for k, v in item.items() if k not in ['id', 'created_at', 'category_display']}
                if c_id and Club.objects.filter(id=c_id).exists():
                    Club.objects.filter(id=c_id).update(**fields)
                else:
                    Club.objects.create(**fields)
                counts["restored_clubs"] += 1

        if "gallery" in data and isinstance(data["gallery"], list):
            for item in data["gallery"]:
                g_id = item.get("id")
                fields = {k: v for k, v in item.items() if k not in ['id', 'created_at', 'category_display']}
                if g_id and GalleryItem.objects.filter(id=g_id).exists():
                    GalleryItem.objects.filter(id=g_id).update(**fields)
                else:
                    GalleryItem.objects.create(**fields)
                counts["restored_gallery"] += 1

        if "about" in data and isinstance(data["about"], dict):
            about_data = {k: v for k, v in data["about"].items() if k not in ['id', 'updated_at']}
            about_obj = AboutInfo.objects.first()
            if about_obj:
                for k, v in about_data.items():
                    setattr(about_obj, k, v)
                about_obj.save()
            else:
                AboutInfo.objects.create(**about_data)
                
        if "admission_guide" in data and isinstance(data["admission_guide"], dict):
            guide_data = {k: v for k, v in data["admission_guide"].items() if k not in ['id', 'updated_at']}
            guide_obj = AdmissionGuide.objects.first()
            if guide_obj:
                for k, v in guide_data.items():
                    setattr(guide_obj, k, v)
                guide_obj.save()
            else:
                AdmissionGuide.objects.create(**guide_data)

        if "site_settings" in data and isinstance(data["site_settings"], dict):
            ss = get_site_settings()
            for k, v in data["site_settings"].items():
                if k not in ['id', 'updated_at'] and hasattr(ss, k):
                    setattr(ss, k, v)
            ss.save()

        for key, model in (("testimonials", Testimonial), ("faqs", FAQ)):
            if key in data and isinstance(data[key], list):
                for item in data[key]:
                    fields = {k: v for k, v in item.items() if k not in ['id', 'created_at']}
                    obj_id = item.get("id")
                    if obj_id and model.objects.filter(id=obj_id).exists():
                        model.objects.filter(id=obj_id).update(**fields)
                    else:
                        model.objects.create(**fields)

        return Response({
            "success": True,
            "message": "System data restore completed successfully.",
            "counts": counts
        })


class FileUploadView(APIView):
    """
    Direct file upload endpoint for administrator photos, sliders, notices, and documents.
    Saves directly to MEDIA_ROOT / uploads and returns public media URL.
    """
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request, format=None):
        import uuid
        import os
        from django.core.files.storage import default_storage

        file_obj = request.FILES.get('file') or request.FILES.get('image')
        if not file_obj:
            return Response({'error': 'No file uploaded'}, status=status.HTTP_400_BAD_REQUEST)

        ext = os.path.splitext(file_obj.name)[1].lower()
        allowed_extensions = ['.jpg', '.jpeg', '.png', '.webp', '.pdf']
        if ext not in allowed_extensions:
            return Response(
                {'error': f'Unsupported file type {ext}. Allowed: {", ".join(allowed_extensions)}'},
                status=status.HTTP_400_BAD_REQUEST
            )

        max_size = 200 * 1024 * 1024  # 200 MB limit
        if file_obj.size > max_size:
            size_mb = file_obj.size / (1024 * 1024)
            return Response(
                {'error': f'File exceeds the 200 MB maximum size limit ({size_mb:.1f} MB). Please compress the PDF before uploading.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        from django.core.files.base import ContentFile
        from .image_utils import CONVERTIBLE_EXTENSIONS, image_to_webp_bytes, webp_name

        safe_name = "".join(c for c in file_obj.name if c.isalnum() or c in "._-")
        filename = f"{uuid.uuid4().hex[:10]}_{safe_name}"
        content = file_obj
        display_name = file_obj.name
        size = file_obj.size

        # Convert raster images to optimised WebP (SVG/GIF/WebP/PDF stored as-is).
        if ext in CONVERTIBLE_EXTENSIONS:
            try:
                webp_bytes = image_to_webp_bytes(file_obj)
                filename = webp_name(file_obj.name)
                content = ContentFile(webp_bytes)
                display_name = filename
                size = len(webp_bytes)
            except Exception:
                file_obj.seek(0)  # unreadable image: keep the original upload

        save_path = os.path.join('uploads', filename)
        actual_path = default_storage.save(save_path, content)
        file_url = f"{settings.MEDIA_URL}{actual_path}"

        return Response({
            'url': file_url,
            'name': display_name,
            'size': size,
        }, status=status.HTTP_201_CREATED)


# ══════════════════════════════════════════════════════════════════════════════
# Online Admission Application System
# ══════════════════════════════════════════════════════════════════════════════

class OnlineApplicationViewSet(viewsets.ModelViewSet):
    """
    Public: POST (create application).
    Authenticated admins: GET list, GET detail, PATCH/PUT update, DELETE.
    """

    def get_permissions(self):
        if self.action in ('create', 'check_duplicate'):
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated()]

    def get_serializer_class(self):
        if self.action == 'list':
            return OnlineApplicationListSerializer
        return OnlineApplicationSerializer

    def get_queryset(self):
        qs = OnlineApplication.objects.all()
        status_filter = self.request.query_params.get('status')
        grade = self.request.query_params.get('grade')
        year = self.request.query_params.get('year')
        q = self.request.query_params.get('q')
        if status_filter:
            qs = qs.filter(status=status_filter)
        if grade:
            qs = qs.filter(grade_applying__icontains=grade)
        if year:
            qs = qs.filter(academic_year=year)
        if q:
            qs = qs.filter(
                models.Q(student_first_name__icontains=q) |
                models.Q(student_last_name__icontains=q) |
                models.Q(application_id__icontains=q) |
                models.Q(contact_email__icontains=q) |
                models.Q(contact_phone__icontains=q)
            )
        return qs

    def create(self, request, *args, **kwargs):
        """Public endpoint: submit a full application with optional documents."""
        import django.utils.timezone as tz
        data = request.data.copy() if hasattr(request.data, 'copy') else dict(request.data)
        documents_data = data.pop('documents', []) if isinstance(data, dict) else []

        # Determine if payment is required
        adm_settings = AdmissionSettings.get_settings()
        payment_required = adm_settings.payment_required
        academic_year = data.get('academic_year') or adm_settings.academic_year or '2026-2027'

        # Duplicate Submission Guard
        duplicate, reason = OnlineApplication.find_duplicate(
            birth_certificate_no=data.get('birth_certificate_no', ''),
            passport_no=data.get('passport_no', ''),
            first_name=data.get('student_first_name', ''),
            last_name=data.get('student_last_name', ''),
            dob=data.get('date_of_birth'),
            phone=data.get('contact_phone', ''),
            academic_year=academic_year
        )
        if duplicate:
            return Response({
                'error': 'DUPLICATE_APPLICATION',
                'message': f"An admission application for {duplicate.student_full_name} is already registered for academic session {duplicate.academic_year}. {reason}",
                'existing_application_id': duplicate.application_id,
                'existing_status': duplicate.get_status_display(),
                'existing_form_no': duplicate.form_no or None,
                'submitted_at': duplicate.created_at.strftime('%d %b %Y') if duplicate.created_at else '',
                'track_url': f"/admission/status?id={duplicate.application_id}",
            }, status=status.HTTP_409_CONFLICT)

        serializer = OnlineApplicationSerializer(data=data)
        serializer.is_valid(raise_exception=True)

        if payment_required:
            # Save with payment_pending status — no form_no assigned yet
            instance = serializer.save(
                status='payment_pending',
                payment_status='pending',
                current_step=4,
                submitted_at=tz.now(),
            )
        else:
            # No payment required — form_no will be assigned immediately in save()
            instance = serializer.save(
                status='submitted',
                payment_status='not_required',
                current_step=4,
                submitted_at=tz.now(),
            )

        if isinstance(documents_data, list):
            for doc in documents_data:
                if isinstance(doc, dict) and doc.get('file_url'):
                    ApplicationDocument.objects.create(
                        application=instance,
                        doc_type=doc.get('doc_type', 'other'),
                        file_url=doc.get('file_url'),
                        original_filename=doc.get('original_filename', ''),
                        file_size=doc.get('file_size', ''),
                        uploaded_by='Applicant',
                        is_staff_upload=False,
                    )

        # Record initial audit entry
        instance.log_activity(
            action='application_created',
            performed_by='Applicant',
            role='Online Applicant',
            details=f"Application submitted online via public admission portal (Initial Status: {instance.get_status_display()}).",
            request=request
        )

        return Response(
            {
                'success': True,
                'message': 'Your application has been submitted successfully.',
                'application_id': instance.application_id,
                'id': instance.id,
                'payment_required': payment_required,
                'payment_status': instance.payment_status,
                'form_no': instance.form_no,
                'application_fee': str(adm_settings.application_fee),
                'payment_currency': adm_settings.payment_currency,
                'payment_gateway': adm_settings.payment_gateway,
            },
            status=status.HTTP_201_CREATED
        )

    @action(detail=True, methods=['patch'], url_path='change-status')
    def change_status(self, request, pk=None):
        """Admin: change application status, assign slots, confirm payment, and log staff audit trail."""
        app = self.get_object()
        old_status = app.status
        old_status_disp = app.get_status_display()
        old_pay_status = app.payment_status
        old_notes = app.admin_notes
        old_docs_verified = app.documents_verified
        old_offer_letter = app.offer_letter_sent

        new_status = request.data.get('status')
        notes = request.data.get('admin_notes')
        exam_date = request.data.get('entrance_exam_date')
        exam_venue = request.data.get('entrance_exam_venue')
        interview_dt = request.data.get('interview_date')
        interview_time = request.data.get('interview_time')
        offer_letter_sent = request.data.get('offer_letter_sent')
        docs_verified = request.data.get('documents_verified')
        slot_id = request.data.get('interview_slot')

        valid_statuses = [s[0] for s in OnlineApplication.STATUS_CHOICES]
        if new_status and new_status not in valid_statuses:
            return Response({'error': f'Invalid status: {new_status}'}, status=400)

        changes = []

        if new_status and new_status != old_status:
            app.status = new_status
            changes.append(f"Status changed from '{old_status_disp}' to '{app.get_status_display()}'")
        if notes is not None and notes != old_notes:
            app.admin_notes = notes
            changes.append("Updated internal staff notes")
        if exam_date is not None:
            app.entrance_exam_date = exam_date or None
        if exam_venue is not None:
            app.entrance_exam_venue = exam_venue
        if interview_dt is not None:
            app.interview_date = interview_dt or None
        if interview_time is not None:
            app.interview_time = interview_time
        if offer_letter_sent is not None and bool(offer_letter_sent) != old_offer_letter:
            app.offer_letter_sent = bool(offer_letter_sent)
            changes.append("Marked offer letter sent" if app.offer_letter_sent else "Unmarked offer letter sent")
        if docs_verified is not None and bool(docs_verified) != old_docs_verified:
            app.documents_verified = bool(docs_verified)
            changes.append("Marked all documents as verified" if app.documents_verified else "Unmarked documents verification")

        pay_status = request.data.get('payment_status')
        if pay_status:
            if pay_status == 'completed' and app.payment_status != 'completed':
                app.confirm_payment(
                    transaction_id=request.data.get('payment_transaction_id') or 'MANUAL',
                    gateway_ref='admin-change-status',
                )
                changes.append(f"Payment marked COMPLETED. Official Form Serial #{app.form_no} allocated.")
            elif pay_status != old_pay_status:
                app.payment_status = pay_status
                changes.append(f"Payment status updated to '{pay_status}'")

        if slot_id is not None:
            # Unlink old slot
            if app.interview_slot_id:
                InterviewSlot.objects.filter(pk=app.interview_slot_id).update(
                    booked_count=models.F('booked_count') - 1
                )
            if slot_id:
                try:
                    new_slot = InterviewSlot.objects.get(pk=slot_id)
                    app.interview_slot = new_slot
                    InterviewSlot.objects.filter(pk=slot_id).update(
                        booked_count=models.F('booked_count') + 1
                    )
                    changes.append(f"Assigned interview slot: {new_slot.display_label}")
                except InterviewSlot.DoesNotExist:
                    pass
            else:
                app.interview_slot = None
                changes.append("Unlinked interview slot")

        app.save()

        # Log Activity Audit Trail
        if changes:
            app.log_activity(
                action='status_changed' if (new_status and new_status != old_status) else 'details_updated',
                details="; ".join(changes),
                request=request
            )

        return Response(OnlineApplicationSerializer(app).data)

    @action(detail=False, methods=['post'], url_path='bulk-action')
    def bulk_action(self, request):
        """
        Admin Batch / Bulk Actions:
        - action_type: 'confirm_payment' | 'assign_slot' | 'change_status'
        - application_ids: [1, 2, 3...]
        - params: { slot_id, status, notes, transaction_id }
        """
        import django.utils.timezone as tz
        app_ids = request.data.get('application_ids', [])
        action_type = request.data.get('action_type')
        params = request.data.get('params', {}) or {}

        if not app_ids or not isinstance(app_ids, list):
            return Response({'error': 'application_ids must be a non-empty list of application IDs.'}, status=400)

        apps = list(OnlineApplication.objects.filter(id__in=app_ids))
        if not apps:
            return Response({'error': 'No matching applications found.'}, status=404)

        updated_ids = []
        errors = []

        with transaction.atomic():
            if action_type == 'confirm_payment':
                tran_prefix = params.get('transaction_id') or f"BULK-PAY-{tz.now().strftime('%Y%m%d')}"
                for app in apps:
                    if app.payment_status != 'completed':
                        app.confirm_payment(
                            transaction_id=f"{tran_prefix}-{app.id}",
                            gateway_ref='bulk-action-desk',
                        )
                        app.log_activity(
                            action='payment_confirmed',
                            details=f"Bulk payment confirmation executed. Official Form Serial #{app.form_no} assigned.",
                            request=request
                        )
                    updated_ids.append(app.id)

            elif action_type == 'assign_slot':
                slot_id = params.get('slot_id')
                if not slot_id:
                    return Response({'error': 'slot_id is required for assign_slot.'}, status=400)
                try:
                    slot = InterviewSlot.objects.get(pk=slot_id)
                except InterviewSlot.DoesNotExist:
                    return Response({'error': 'Interview slot not found.'}, status=404)

                for app in apps:
                    if app.interview_slot_id != slot.id:
                        if app.interview_slot_id:
                            InterviewSlot.objects.filter(pk=app.interview_slot_id).update(
                                booked_count=models.F('booked_count') - 1
                            )
                        app.interview_slot = slot
                        if slot.date:
                            app.entrance_exam_date = slot.date
                            import datetime as dt
                            app.interview_date = dt.datetime.combine(slot.date, slot.start_time or dt.time(9, 0))
                        if slot.start_time:
                            app.interview_time = slot.start_time.strftime('%I:%M %p').lstrip('0')
                        if slot.venue:
                            app.entrance_exam_venue = slot.venue
                        if app.status in ('payment_pending', 'submitted', 'under_review'):
                            app.status = 'shortlisted'
                        app.save()
                        InterviewSlot.objects.filter(pk=slot.id).update(
                            booked_count=models.F('booked_count') + 1
                        )
                        app.log_activity(
                            action='slot_assigned',
                            details=f"Bulk slot assignment: assigned to '{slot.display_label}' (Venue: {slot.venue or 'Campus'}). Status updated to '{app.get_status_display()}'.",
                            request=request
                        )
                    updated_ids.append(app.id)

            elif action_type == 'change_status':
                new_status = params.get('status')
                valid_statuses = [s[0] for s in OnlineApplication.STATUS_CHOICES]
                if new_status not in valid_statuses:
                    return Response({'error': f'Invalid status: {new_status}'}, status=400)
                notes = params.get('notes', '')
                for app in apps:
                    old_disp = app.get_status_display()
                    app.status = new_status
                    if notes:
                        app.admin_notes = f"{app.admin_notes}\n[Bulk Note {tz.now().strftime('%d/%m/%Y')}]: {notes}".strip()
                    app.save()
                    app.log_activity(
                        action='status_changed',
                        details=f"Bulk status update from '{old_disp}' to '{app.get_status_display()}'. Notes: {notes or 'N/A'}",
                        request=request
                    )
                    updated_ids.append(app.id)

            else:
                return Response({'error': f'Unsupported action_type: {action_type}'}, status=400)

        return Response({
            'success': True,
            'action_type': action_type,
            'updated_count': len(updated_ids),
            'updated_ids': updated_ids,
            'message': f"Successfully executed bulk {action_type} on {len(updated_ids)} applications."
        })

    @action(detail=True, methods=['post'], url_path='upload-document', parser_classes=[MultiPartParser, FormParser])
    def upload_document(self, request, pk=None):
        """
        Admin On-Behalf Document Upload:
        Admissions staff uploads paper scans / certificates on applicant's behalf.
        Accepts multipart file upload or file_url, doc_type, and notes.
        """
        import os
        from django.core.files.storage import default_storage
        from django.core.files.base import ContentFile
        from PIL import Image
        import io

        app = self.get_object()
        doc_type = request.data.get('doc_type', 'other')
        notes = request.data.get('notes', '')
        file_obj = request.FILES.get('file')
        file_url = request.data.get('file_url')

        staff_name = "Staff Admin"
        if request.user and request.user.is_authenticated:
            staff_name = request.user.get_full_name() or request.user.username

        if not file_obj and not file_url:
            return Response({'error': 'Please provide either a file upload or a file_url.'}, status=400)

        if file_obj:
            orig_name = file_obj.name
            size_kb = f"{round(file_obj.size / 1024, 1)} KB"
            ext = os.path.splitext(orig_name)[1].lower()
            safe_id = app.application_id or f"APP_{app.id}"
            filename = f"onbehalf_{safe_id}_{doc_type}_{uuid.uuid4().hex[:8]}{ext}"
            content = file_obj

            if ext in ('.jpg', '.jpeg', '.png') and Image:
                try:
                    img = Image.open(file_obj)
                    if img.mode in ('RGBA', 'LA'):
                        bg = Image.new('RGB', img.size, (255, 255, 255))
                        bg.paste(img, mask=img.split()[-1])
                        img = bg
                    out = io.BytesIO()
                    img.save(out, format='WEBP', quality=85, optimize=True)
                    webp_bytes = out.getvalue()
                    content = ContentFile(webp_bytes)
                    filename = f"onbehalf_{safe_id}_{doc_type}_{uuid.uuid4().hex[:8]}.webp"
                    size_kb = f"{round(len(webp_bytes) / 1024, 1)} KB"
                except Exception:
                    file_obj.seek(0)

            save_path = os.path.join('application_documents', filename)
            actual_path = default_storage.save(save_path, content)
            file_url = f"{settings.MEDIA_URL}{actual_path}"
        else:
            orig_name = request.data.get('original_filename') or f"{doc_type}_{uuid.uuid4().hex[:6]}"
            size_kb = request.data.get('file_size') or "External link"

        doc = ApplicationDocument.objects.create(
            application=app,
            doc_type=doc_type,
            file_url=file_url,
            original_filename=orig_name,
            file_size=size_kb,
            uploaded_by=f"Staff ({staff_name})",
            is_staff_upload=True,
            notes=notes or "Physical document verified at admissions desk",
            verified=True,
            verified_by=staff_name,
        )

        app.log_activity(
            action='document_uploaded',
            details=f"Document '{doc.get_doc_type_display()}' ({orig_name}) uploaded and verified on applicant's behalf. Notes: {notes or 'Physical paper verified in person'}.",
            request=request
        )

        docs = app.documents.all()
        return Response({
            'success': True,
            'message': f"Document '{doc.get_doc_type_display()}' uploaded and verified successfully.",
            'document': ApplicationDocumentSerializer(doc).data,
            'documents': ApplicationDocumentSerializer(docs, many=True).data,
        }, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=['delete'], url_path='documents/(?P<doc_id>[^/.]+)')
    def delete_document(self, request, pk=None, doc_id=None):
        """Staff removes an uploaded document from candidate profile."""
        app = self.get_object()
        doc = get_object_or_404(ApplicationDocument, pk=doc_id, application=app)
        doc_disp = doc.get_doc_type_display()
        doc_filename = doc.original_filename
        doc.delete()

        app.log_activity(
            action='document_deleted',
            details=f"Document '{doc_disp}' ({doc_filename}) deleted by staff.",
            request=request
        )

        return Response({
            'success': True,
            'message': f"Document '{doc_disp}' removed.",
            'documents': ApplicationDocumentSerializer(app.documents.all(), many=True).data,
        })

    @action(detail=True, methods=['patch'], url_path='verify-document/(?P<doc_id>[^/.]+)')
    def verify_document(self, request, pk=None, doc_id=None):
        """Toggle document verification status."""
        app = self.get_object()
        doc = get_object_or_404(ApplicationDocument, pk=doc_id, application=app)
        staff_name = request.user.get_full_name() or request.user.username if request.user.is_authenticated else "Staff"

        doc.verified = not doc.verified
        doc.verified_by = staff_name if doc.verified else ""
        doc.save()

        app.log_activity(
            action='document_verified' if doc.verified else 'document_unverified',
            details=f"Document '{doc.get_doc_type_display()}' ({doc.original_filename}) marked as {'VERIFIED' if doc.verified else 'UNVERIFIED'}.",
            request=request
        )

        return Response({
            'success': True,
            'document': ApplicationDocumentSerializer(doc).data,
            'documents': ApplicationDocumentSerializer(app.documents.all(), many=True).data,
        })

    @action(detail=True, methods=['get'], url_path='audit-trail')
    def audit_trail(self, request, pk=None):
        """Retrieve staff activity and event audit logs for this application."""
        app = self.get_object()
        logs = app.audit_logs.all()
        return Response(ApplicationAuditLogSerializer(logs, many=True).data)

    @action(detail=False, methods=['post'], url_path='check-duplicate', permission_classes=[permissions.AllowAny])
    def check_duplicate(self, request):
        """
        Public pre-submission check:
        Informs parents early if an application is already registered for this child.
        """
        birth_no = request.data.get('birth_certificate_no', '')
        passport_no = request.data.get('passport_no', '')
        first_name = request.data.get('student_first_name', '')
        last_name = request.data.get('student_last_name', '')
        dob = request.data.get('date_of_birth')
        phone = request.data.get('contact_phone', '')
        year = request.data.get('academic_year') or '2026-2027'

        duplicate, reason = OnlineApplication.find_duplicate(
            birth_certificate_no=birth_no,
            passport_no=passport_no,
            first_name=first_name,
            last_name=last_name,
            dob=dob,
            phone=phone,
            academic_year=year
        )
        if duplicate:
            return Response({
                'is_duplicate': True,
                'existing_application_id': duplicate.application_id,
                'existing_status': duplicate.get_status_display(),
                'existing_form_no': duplicate.form_no or None,
                'candidate_name': duplicate.student_full_name,
                'reason': reason,
                'track_url': f"/admission/status?id={duplicate.application_id}",
            })
        return Response({'is_duplicate': False})

    @action(detail=False, methods=['get'], url_path='stats')
    def stats(self, request):
        """Admin: aggregate counts by status."""
        from django.db.models import Count
        total = OnlineApplication.objects.count()
        by_status = list(
            OnlineApplication.objects.values('status').annotate(count=Count('id'))
        )
        by_grade = list(
            OnlineApplication.objects.values('grade_applying').annotate(count=Count('id')).order_by('-count')[:10]
        )
        payment_pending = OnlineApplication.objects.filter(payment_status='pending').count()
        payment_completed = OnlineApplication.objects.filter(payment_status='completed').count()
        return Response({
            'total': total,
            'by_status': by_status,
            'by_grade': by_grade,
            'payment_pending': payment_pending,
            'payment_completed': payment_completed,
        })


# ══════════════════════════════════════════════════════════════════════════════
# Admission Settings
# ══════════════════════════════════════════════════════════════════════════════

class AdmissionSettingsView(APIView):
    """
    GET  → public: returns safe settings (no secrets).
    PUT  → admin only: update all admission settings.
    """

    def get_permissions(self):
        if self.request.method == 'GET':
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated()]

    def get(self, request):
        obj = AdmissionSettings.get_settings()
        ser = AdmissionSettingsSerializer(obj)
        return Response(ser.data)

    def put(self, request):
        obj = AdmissionSettings.get_settings()
        ser = AdmissionSettingsFullSerializer(obj, data=request.data, partial=True)
        ser.is_valid(raise_exception=True)
        ser.save()
        return Response(AdmissionSettingsFullSerializer(obj).data)

    def patch(self, request):
        return self.put(request)


# ══════════════════════════════════════════════════════════════════════════════
# Interview Slot Management
# ══════════════════════════════════════════════════════════════════════════════

class InterviewSlotViewSet(viewsets.ModelViewSet):
    """
    GET list  → public (shows date, time, capacity, available seats).
    Create / update / delete → admin only.
    """
    serializer_class = InterviewSlotSerializer

    def get_permissions(self):
        if self.action in ('list', 'retrieve'):
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated()]

    def get_queryset(self):
        qs = InterviewSlot.objects.all()
        date_filter = self.request.query_params.get('date')
        grade_filter = self.request.query_params.get('grade')
        active_only = self.request.query_params.get('active', '1')
        if active_only != '0':
            qs = qs.filter(is_active=True)
        if date_filter:
            qs = qs.filter(date=date_filter)
        if grade_filter:
            qs = qs.filter(
                models.Q(grade_filter='') | models.Q(grade_filter__icontains=grade_filter)
            )
        return qs

    @action(detail=False, methods=['post'], url_path='bulk-create',
            permission_classes=[permissions.IsAuthenticated])
    def bulk_create(self, request):
        """Admin: create multiple slots at once.
        Payload: {slots: [{date, start_time, end_time, label, grade_filter, venue, capacity}, ...]}
        """
        slots_data = request.data.get('slots', [])
        if not isinstance(slots_data, list) or not slots_data:
            return Response({'error': 'Provide a list of slot objects under "slots".'}, status=400)
        created = []
        for slot_data in slots_data:
            ser = InterviewSlotSerializer(data=slot_data)
            if ser.is_valid():
                obj = ser.save()
                created.append(InterviewSlotSerializer(obj).data)
        return Response({'created': len(created), 'slots': created}, status=201)

    @action(detail=False, methods=['delete'], url_path='bulk-clear',
            permission_classes=[permissions.IsAuthenticated])
    def bulk_clear(self, request):
        """Admin: delete ALL slots for a given date."""
        date_val = request.data.get('date')
        if not date_val:
            return Response({'error': 'Provide "date" (YYYY-MM-DD).'}, status=400)
        count, _ = InterviewSlot.objects.filter(date=date_val).delete()
        return Response({'deleted': count})

    @action(detail=True, methods=['get'], url_path='candidates',
            permission_classes=[permissions.IsAuthenticated])
    def candidates(self, request, pk=None):
        """Admin: list all student applications assigned to this interview slot."""
        slot = self.get_object()
        applicants = slot.bookings.all().order_by('form_no', 'id')
        ser = OnlineApplicationListSerializer(applicants, many=True)
        return Response({
            'slot_id': slot.id,
            'slot_label': slot.label or slot.display_label,
            'date': slot.date,
            'start_time': slot.start_time,
            'end_time': slot.end_time,
            'venue': slot.venue,
            'capacity': slot.capacity,
            'booked_count': slot.booked_count,
            'candidates': ser.data,
        })


# ══════════════════════════════════════════════════════════════════════════════
# Payment Gateway
# ══════════════════════════════════════════════════════════════════════════════

class PaymentInitiateView(APIView):
    """
    POST /api/payment/initiate/
    Body: {application_id: "SJIS-2026-00042"}
    Returns gateway redirect URL (SSLCommerz) or payment info (bKash/Nagad).
    """
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        app_id = (request.data.get('application_id') or '').strip().upper()
        if not app_id:
            return Response({'error': 'application_id is required.'}, status=400)

        try:
            app = OnlineApplication.objects.get(application_id=app_id)
        except OnlineApplication.DoesNotExist:
            return Response({'error': 'Application not found.'}, status=404)

        if app.payment_status == 'completed':
            return Response({'error': 'Payment already completed for this application.'}, status=400)

        adm_settings = AdmissionSettings.get_settings()
        if not adm_settings.payment_required:
            return Response({'error': 'Online payment is not enabled for this session.'}, status=400)

        gateway = adm_settings.payment_gateway
        amount = float(adm_settings.application_fee)

        if gateway == 'sslcommerz':
            return self._initiate_sslcommerz(request, app, adm_settings, amount)
        elif gateway in ('bkash', 'nagad'):
            return Response({
                'gateway': gateway,
                'amount': amount,
                'currency': adm_settings.payment_currency,
                'application_id': app_id,
                'message': f'{gateway.upper()} direct gateway processing is being prepared. Please complete payment at the accounts counter quoting your Application ID.',
            })
        else:  # manual
            return Response({
                'gateway': 'manual',
                'amount': amount,
                'currency': adm_settings.payment_currency,
                'application_id': app_id,
                'message': 'Please visit the school admissions office to complete your application fee payment.',
            })

    def _initiate_sslcommerz(self, request, app, adm_settings, amount):
        """Build SSLCommerz payment session."""
        try:
            import os
            frontend_url = os.getenv('FRONTEND_URL', '').rstrip('/')
            if not frontend_url:
                scheme = request.scheme
                host = request.get_host()
                frontend_url = f"{scheme}://{host}"

            tran_id = f"{app.application_id}-{uuid.uuid4().hex[:8].upper()}"

            post_data = {
                'store_id': adm_settings.sslcommerz_store_id,
                'store_passwd': adm_settings.sslcommerz_store_pass,
                'total_amount': amount,
                'currency': adm_settings.payment_currency,
                'tran_id': tran_id,
                'success_url': f"{frontend_url}/api/payment/callback/?status=success&app_id={app.application_id}",
                'fail_url': f"{frontend_url}/api/payment/callback/?status=fail&app_id={app.application_id}",
                'cancel_url': f"{frontend_url}/api/payment/callback/?status=cancel&app_id={app.application_id}",
                'ipn_url': f"{frontend_url}/api/payment/ipn/",
                'cus_name': app.student_full_name,
                'cus_email': app.contact_email or 'noreply@sjisnarinda.edu.bd',
                'cus_phone': app.contact_phone or '01700000000',
                'cus_add1': app.present_address or '32 Shah Shaheb Lane, Narinda, Dhaka',
                'cus_city': 'Dhaka',
                'cus_country': 'Bangladesh',
                'product_name': f'Admission Application Fee – {app.application_id}',
                'product_category': 'School Admission',
                'product_profile': 'general',
                'shipping_method': 'NO',
                'num_of_item': 1,
                'weight_of_items': 0,
                'amount_of_delivery_charge': 0,
            }

            import urllib.request, urllib.parse, json as _json
            ssl_domain = (
                'sandbox.sslcommerz.com'
                if adm_settings.sslcommerz_is_sandbox
                else 'securepay.sslcommerz.com'
            )
            ssl_url = f"https://{ssl_domain}/gwprocess/v4/api.php"
            encoded = urllib.parse.urlencode(post_data).encode('utf-8')
            req = urllib.request.Request(ssl_url, data=encoded, method='POST')
            req.add_header('Content-Type', 'application/x-www-form-urlencoded')
            with urllib.request.urlopen(req, timeout=15) as resp:
                result = _json.loads(resp.read().decode('utf-8'))

            if result.get('status') == 'SUCCESS':
                app.payment_transaction_id = tran_id
                app.payment_gateway_ref = result.get('sessionkey', '')
                app.save(update_fields=['payment_transaction_id', 'payment_gateway_ref'])
                return Response({
                    'gateway': 'sslcommerz',
                    'redirect_url': result.get('GatewayPageURL'),
                    'session_key': result.get('sessionkey'),
                    'tran_id': tran_id,
                    'amount': amount,
                })
            else:
                return Response({
                    'error': result.get('failedreason', 'SSLCommerz session creation failed. Check gateway credentials.'),
                }, status=502)
        except Exception as exc:
            return Response({'error': f'Payment gateway error: {str(exc)}'}, status=502)


@method_decorator(csrf_exempt, name='dispatch')
class PaymentCallbackView(APIView):
    """
    Handles both browser redirects (GET / POST) and IPN notifications (POST)
    from SSLCommerz.
    """
    authentication_classes = []
    permission_classes = [permissions.AllowAny]

    def _process_payment(self, request, is_ipn=False):
        params = {}
        if request.query_params:
            params.update(request.query_params.dict())
        if hasattr(request, 'data') and isinstance(request.data, dict):
            params.update(request.data)
        if hasattr(request, 'POST') and request.POST:
            params.update(request.POST.dict())

        pay_status = (params.get('status') or '').lower()
        tran_id = params.get('tran_id', '')
        val_id = params.get('val_id', '')
        amount = params.get('amount', 0)
        app_id = (params.get('app_id') or '').upper()

        if not app_id and tran_id:
            app_id = '-'.join(tran_id.split('-')[:3]).upper()

        try:
            app = OnlineApplication.objects.get(application_id=app_id)
        except OnlineApplication.DoesNotExist:
            if is_ipn:
                return Response({'status': 'INVALID', 'reason': 'Application not found.'}, status=200)
            return redirect('/admission/payment/result?status=error&reason=notfound')

        adm_settings = AdmissionSettings.get_settings()

        # Validate with SSLCommerz API if val_id is provided and credentials exist
        verified = False
        if val_id and adm_settings.sslcommerz_store_id and adm_settings.sslcommerz_store_pass:
            try:
                import urllib.request, json as _json
                ssl_domain = (
                    'sandbox.sslcommerz.com'
                    if adm_settings.sslcommerz_is_sandbox
                    else 'securepay.sslcommerz.com'
                )
                val_url = (
                    f"https://{ssl_domain}/validator/api/validationserverAPI.php?"
                    f"val_id={val_id}&store_id={adm_settings.sslcommerz_store_id}&"
                    f"store_passwd={adm_settings.sslcommerz_store_pass}&v=1&format=json"
                )
                req = urllib.request.Request(val_url)
                with urllib.request.urlopen(req, timeout=10) as resp:
                    val_res = _json.loads(resp.read().decode('utf-8'))
                    if val_res.get('status') in ('VALID', 'VALIDATED'):
                        verified = True
                        if not amount:
                            amount = val_res.get('amount', 0)
            except Exception:
                if adm_settings.sslcommerz_is_sandbox:
                    verified = (pay_status in ('valid', 'validated', 'success'))
        else:
            verified = (pay_status in ('valid', 'validated', 'success'))

        phone_param = quote(app.contact_phone or app.father_phone or app.mother_phone or '')
        phone_qs = f'&phone={phone_param}' if phone_param else ''

        if verified:
            app.confirm_payment(
                transaction_id=tran_id or app.payment_transaction_id or 'SSL-CONFIRMED',
                gateway_ref=val_id or '',
                amount=amount if amount else None,
            )
            if is_ipn:
                return Response({'status': 'VALID', 'message': 'Payment confirmed.'}, status=200)
            return redirect(f'/admission/payment/result?status=success&id={app.application_id}&tran_id={tran_id or app.payment_transaction_id}{phone_qs}')
        elif pay_status in ('cancel', 'cancelled'):
            app.payment_status = 'pending'
            app.save(update_fields=['payment_status'])
            if is_ipn:
                return Response({'status': 'CANCELLED'}, status=200)
            return redirect(f'/admission/payment/result?status=cancelled&id={app.application_id}{phone_qs}')
        else:
            app.payment_status = 'failed'
            app.save(update_fields=['payment_status'])
            if is_ipn:
                return Response({'status': 'FAILED'}, status=200)
            return redirect(f'/admission/payment/result?status=failed&id={app.application_id}{phone_qs}')

    def get(self, request):
        return self._process_payment(request, is_ipn=False)

    def post(self, request):
        is_ipn = request.path.rstrip('/').endswith('/ipn')
        return self._process_payment(request, is_ipn=is_ipn)


class PaymentManualConfirmView(APIView):
    """
    Admin: manually mark an application as paid.
    POST /api/payment/manual-confirm/
    Body: {application_id, transaction_id, amount}
    """
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        app_id = (request.data.get('application_id') or '').strip().upper()
        try:
            app = OnlineApplication.objects.get(application_id=app_id)
        except OnlineApplication.DoesNotExist:
            return Response({'error': 'Application not found.'}, status=404)

        app.confirm_payment(
            transaction_id=request.data.get('transaction_id', 'MANUAL'),
            gateway_ref='manual-confirmation',
            amount=request.data.get('amount'),
        )
        return Response({
            'success': True,
            'message': f'Payment manually confirmed for {app_id}.',
            'form_no': app.form_no,
        })


class ApplicationTrackRateThrottle(SimpleRateThrottle):
    scope = 'application_track'
    rate = '20/minute'

    def get_cache_key(self, request, view):
        if request.user and request.user.is_authenticated:
            return None  # Authenticated staff/admins are not rate-limited
        ident = request.META.get('HTTP_X_FORWARDED_FOR')
        if ident:
            ident = ident.split(',')[0].strip()
        else:
            ident = request.META.get('REMOTE_ADDR')
        return self.cache_format % {
            'scope': self.scope,
            'ident': ident or 'anon'
        }


class ApplicationStatusLookupView(APIView):
    """
    Public: GET /api/applications/track/?id=SJIS-2026-00001&phone=01711XXXXXX
            OR /api/applications/track/?id=SJIS-2026-00001&dob=2018-05-14
    Dual-Factor Verification: Requires Application ID / Form Number AND
    (Guardian's registered phone OR Candidate's Date of Birth).
    Protects candidate PII from unauthorized guessing, scraping, and sequence enumeration.
    Rate-limited to 20 attempts/minute per IP.
    """
    permission_classes = [permissions.AllowAny]
    throttle_classes = [ApplicationTrackRateThrottle]

    def get(self, request):
        raw_key = (request.query_params.get('id') or request.query_params.get('form_no') or '').strip()
        phone_param = (request.query_params.get('phone') or '').strip()
        dob_param = (request.query_params.get('dob') or request.query_params.get('date_of_birth') or '').strip()

        if not raw_key:
            return Response(
                {'error': 'Please provide your Application ID (e.g. SJIS-2026-00001) or Form Number.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        is_staff = bool(request.user and request.user.is_authenticated)

        # Either Phone OR Date of Birth is required for public applicants to verify identity
        if not is_staff and not phone_param and not dob_param:
            return Response(
                {
                    'error': 'For student privacy, please provide either the registered guardian mobile number or student date of birth.',
                    'requires_verification': True
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        # Find application by application_id OR form_no
        app = None
        key_upper = raw_key.upper()
        try:
            app = OnlineApplication.objects.get(application_id=key_upper)
        except OnlineApplication.DoesNotExist:
            pass

        if not app:
            try:
                app = OnlineApplication.objects.filter(form_no__iexact=raw_key).first()
            except Exception:
                pass

        # Unified generic error to prevent user enumeration
        GENERIC_NOT_FOUND = {
            'error': 'No matching application found for this Application Reference and credential combination. Please verify your details or contact the admissions office.'
        }

        if not app:
            return Response(GENERIC_NOT_FOUND, status=status.HTTP_404_NOT_FOUND)

        # Verify identity: Phone OR Date of Birth
        if not is_staff:
            verified = False

            # 1. Verify Phone if provided
            if phone_param:
                clean_input = re.sub(r'\D', '', phone_param)
                if len(clean_input) >= 6:
                    applicant_phones = [
                        re.sub(r'\D', '', getattr(app, f) or '')
                        for f in ('contact_phone', 'father_phone', 'mother_phone')
                    ]
                    for ap in applicant_phones:
                        if not ap or len(ap) < 6:
                            continue
                        match_len = min(len(clean_input), len(ap), 8)
                        if clean_input.endswith(ap[-match_len:]) or ap.endswith(clean_input[-match_len:]):
                            verified = True
                            break
                        if len(clean_input) >= 10 and len(ap) >= 10 and clean_input[-10:] == ap[-10:]:
                            verified = True
                            break

            # 2. Verify Date of Birth if provided and not yet verified
            if not verified and dob_param and app.date_of_birth:
                parsed_dob = None
                clean_dob_str = dob_param.strip()
                for fmt in ('%Y-%m-%d', '%d/%m/%Y', '%d-%m-%Y', '%d.%m.%Y', '%m/%d/%Y', '%Y/%m/%d'):
                    try:
                        parsed_dob = datetime.strptime(clean_dob_str, fmt).date()
                        break
                    except (ValueError, TypeError):
                        continue
                if not parsed_dob:
                    digits = re.sub(r'\D', '', clean_dob_str)
                    if len(digits) == 8:
                        for fmt in ('%Y%m%d', '%d%m%Y', '%m%d%Y'):
                            try:
                                parsed_dob = datetime.strptime(digits, fmt).date()
                                break
                            except (ValueError, TypeError):
                                continue

                if parsed_dob and parsed_dob == app.date_of_birth:
                    verified = True

            if not verified:
                return Response(GENERIC_NOT_FOUND, status=status.HTTP_404_NOT_FOUND)

        STATUS_MESSAGES = {
            'payment_pending': 'Application details recorded. Online payment is pending. Please complete your fee payment to generate your official form number and download your admit card.',
            'submitted': 'Your application has been received and is awaiting review by our admissions team.',
            'under_review': 'Our admissions team is currently reviewing your application.',
            'shortlisted': 'Congratulations! You have been shortlisted. Please check with admissions for entrance exam details.',
            'interview_scheduled': 'An interview has been scheduled. Please check below for the scheduled date, time, and venue.',
            'documents_required': 'Additional documents are required. Please contact the admissions office.',
            'approved': 'Congratulations! Your child has been offered admission. Please contact us to confirm enrollment.',
            'enrolled': 'Enrollment confirmed. Welcome to St. Joseph International School, Narinda!',
            'waitlisted': 'Your application has been placed on the waitlist. We will notify you of any updates.',
            'rejected': 'We regret that your application was not selected for the current session.',
            'withdrawn': 'This application has been marked as withdrawn.',
            'draft': 'Your application is still in draft. Please complete the form.',
        }

        adm_settings = AdmissionSettings.get_settings()

        slot_data = None
        if app.interview_slot:
            slot_data = {
                'id': app.interview_slot.id,
                'date': str(app.interview_slot.date),
                'start_time': str(app.interview_slot.start_time),
                'end_time': str(app.interview_slot.end_time),
                'label': app.interview_slot.label,
                'reporting_venue': app.interview_slot.venue or 'Campus Auditorium, St. Joseph International School, 32 Shah Shaheb Lane, Narinda, Dhaka 1100',
            }

        app_serialized = OnlineApplicationSerializer(app).data
        if not is_staff:
            # Mask confidential internal admin notes for public parents
            app_serialized.pop('admin_notes', None)

        can_download = (
            app.status not in ('draft', 'payment_pending') or
            app.payment_status == 'completed'
        ) and bool(app.form_no)

        res_data = {
            'application_id': app.application_id,
            'form_no': app.form_no or None,
            'student_name': app.student_full_name,
            'student_first_name': app.student_first_name,
            'student_last_name': app.student_last_name,
            'student_photo_url': app.student_photo_url,
            'grade_applying': app.grade_applying,
            'academic_year': app.academic_year,
            'status': app.status,
            'status_display': app.get_status_display(),
            'status_message': STATUS_MESSAGES.get(app.status, ''),
            'submitted_at': app.submitted_at,
            'entrance_exam_date': app.entrance_exam_date,
            'entrance_exam_venue': app.entrance_exam_venue if app.entrance_exam_date else None,
            'interview_date': app.interview_date or (str(app.interview_slot.date) if app.interview_slot else None),
            'interview_time': app.interview_time or (str(app.interview_slot.start_time) if app.interview_slot else None),
            'documents_verified': app.documents_verified,
            'payment_status': app.payment_status,
            'payment_required': adm_settings.payment_required,
            'payment_amount': str(app.payment_amount) if app.payment_amount else str(adm_settings.application_fee),
            'payment_transaction_id': app.payment_transaction_id,
            'payment_gateway': adm_settings.payment_gateway,
            'payment_currency': adm_settings.payment_currency,
            'print_page_size': adm_settings.print_page_size,
            'document_checklist': adm_settings.document_checklist,
            'reporting_instructions': adm_settings.reporting_instructions,
            'admission_test_date': adm_settings.admission_test_date,
            'admission_test_time': adm_settings.admission_test_time,
            'admission_test_venue': adm_settings.admission_test_venue,
            'interview_slot': slot_data,
            'can_download_admit_card': can_download,
            'verified_session': True,
            'application': app_serialized,
        }

        return Response(res_data)


class ApplicationDocumentViewSet(viewsets.ModelViewSet):
    serializer_class = ApplicationDocumentSerializer

    def get_permissions(self):
        if self.action in ('create', 'check_duplicate'):
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated()]

    def get_queryset(self):
        # Only authenticated staff can browse all applicant documents
        if self.request.user and self.request.user.is_authenticated:
            app_id = self.request.query_params.get('application')
            qs = ApplicationDocument.objects.all()
            if app_id:
                qs = qs.filter(application_id=app_id)
            return qs
        return ApplicationDocument.objects.none()

    @action(detail=True, methods=['patch'], url_path='verify', permission_classes=[permissions.IsAuthenticated])
    def verify_document(self, request, pk=None):
        """Admin: mark a document as verified."""
        doc = self.get_object()
        doc.verified = request.data.get('verified', True)
        doc.verified_by = request.user.username
        doc.save()
        return Response(ApplicationDocumentSerializer(doc).data)


# ─────────────────────────────────────────────────────────────────────────────
# APPLICATION DRAFT — Cloud Save & Resume API Views
# ─────────────────────────────────────────────────────────────────────────────

class DraftSaveView(APIView):
    """
    POST /api/draft/save/
    Body: { phone, draft_data, documents, current_step, candidate_name, grade_applying, draft_key? }

    - If draft_key is supplied AND matches phone → update that draft.
    - Otherwise → create a new draft and return a fresh draft_key (PIN).
    Returns: { draft_key, expires_at, updated_at }
    """
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        import datetime as dt
        phone        = (request.data.get('phone') or '').strip()
        draft_data   = request.data.get('draft_data') or {}
        documents    = request.data.get('documents') or []
        current_step = int(request.data.get('current_step') or 1)
        cname        = (request.data.get('candidate_name') or '').strip()[:200]
        grade        = (request.data.get('grade_applying') or '').strip()[:80]
        draft_key    = (request.data.get('draft_key') or '').strip().upper()

        if not phone:
            return Response({'error': 'Phone number is required.'}, status=400)

        # Try to find existing draft to update
        draft = None
        if draft_key:
            try:
                draft = ApplicationDraft.objects.get(draft_key=draft_key, phone=phone)
            except ApplicationDraft.DoesNotExist:
                pass  # will create a new one

        if draft is None:
            draft = ApplicationDraft(phone=phone)

        draft.draft_data    = draft_data
        draft.documents     = documents
        draft.current_step  = current_step
        draft.candidate_name = cname
        draft.grade_applying = grade
        draft.save()

        return Response({
            'draft_key':   draft.draft_key,
            'expires_at':  draft.expires_at.isoformat() if draft.expires_at else None,
            'updated_at':  draft.updated_at.isoformat(),
        })


class DraftRetrieveView(APIView):
    """
    POST /api/draft/retrieve/
    Body: { phone, draft_key }

    Returns the saved draft data so the user can resume on any device.
    Returns: { draft_key, draft_data, documents, current_step, candidate_name, grade_applying, updated_at }
    """
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        import datetime as dt
        phone     = (request.data.get('phone') or '').strip()
        draft_key = (request.data.get('draft_key') or '').strip().upper()

        if not phone or not draft_key:
            return Response({'error': 'Both phone and draft code are required.'}, status=400)

        try:
            draft = ApplicationDraft.objects.get(draft_key=draft_key, phone=phone)
        except ApplicationDraft.DoesNotExist:
            return Response({'error': 'No draft found with that code and phone number. Please check and try again.'}, status=404)

        # Check expiry
        if draft.expires_at:
            now = dt.datetime.now(dt.timezone.utc)
            if draft.expires_at < now:
                draft.delete()
                return Response({'error': 'This draft has expired (drafts are kept for 30 days). Please start a new application.'}, status=410)

        return Response({
            'draft_key':      draft.draft_key,
            'draft_data':     draft.draft_data,
            'documents':      draft.documents,
            'current_step':   draft.current_step,
            'candidate_name': draft.candidate_name,
            'grade_applying': draft.grade_applying,
            'updated_at':     draft.updated_at.isoformat(),
            'expires_at':     draft.expires_at.isoformat() if draft.expires_at else None,
        })
