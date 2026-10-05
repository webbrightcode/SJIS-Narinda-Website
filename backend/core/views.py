from django.conf import settings
from django.contrib.auth import authenticate
from django.shortcuts import get_object_or_404
from django.db import models
from rest_framework import viewsets, generics, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.authtoken.models import Token
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
from .serializers import (
    SliderSlideSerializer,
    AboutInfoSerializer,
    NoticeSerializer,
    ClubSerializer,
    AdmissionGuideSerializer,
    AdmissionInquirySerializer,
    GalleryItemSerializer,
    SiteSettingsSerializer,
    TestimonialSerializer,
    FAQSerializer,
    StaffMemberSerializer,
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
        # Sanitize optional URL fields to prevent validation errors on placeholders or missing protocol
        for url_field in ['facebook_url', 'instagram_url', 'youtube_url', 'map_embed_url', 'map_link']:
            if url_field in data and isinstance(data[url_field], str):
                val = data[url_field].strip()
                if val.endswith('…') or val.endswith('...') or val in ['https://', 'http://', '']:
                    data[url_field] = ''
                elif val and not val.startswith(('http://', 'https://')):
                    data[url_field] = f'https://{val}'

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
        clubs = Club.objects.filter(is_active=True).order_by('order')[:6]
        gallery = GalleryItem.objects.filter(is_featured=True).order_by('order')[:8]
        if not gallery.exists():
            gallery = GalleryItem.objects.all().order_by('order')[:8]

        return Response({
            "slides": SliderSlideSerializer(slides, many=True).data,
            "about": about_data,
            "notices": NoticeSerializer(notices, many=True).data,
            "clubs": ClubSerializer(clubs, many=True).data,
            "gallery": GalleryItemSerializer(gallery, many=True).data,
            "settings": SiteSettingsSerializer(get_site_settings()).data,
            "testimonials": TestimonialSerializer(
                Testimonial.objects.filter(is_active=True).order_by('order'), many=True
            ).data,
        })


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
        allowed_extensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.svg', '.pdf']
        if ext not in allowed_extensions:
            return Response(
                {'error': f'Unsupported file type {ext}. Allowed: {", ".join(allowed_extensions)}'},
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



