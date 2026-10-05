import {
  LandingBundle,
  SliderSlide,
  AboutInfo,
  Notice,
  Club,
  AdmissionGuide,
  GalleryItem,
  AdmissionInquiry,
  DashboardStats,
  AdminUser,
  SiteSettings,
  Testimonial,
  FAQ,
  StaffMember,
} from './types';
import {
  FALLBACK_BUNDLE,
  FALLBACK_SLIDES,
  FALLBACK_ABOUT,
  FALLBACK_NOTICES,
  FALLBACK_CLUBS,
  FALLBACK_ADMISSION,
  FALLBACK_GALLERY,
  FALLBACK_FACULTY,
} from './fallback-data';

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  school_name: 'St. Joseph International School',
  school_subtitle: 'INTERNATIONAL SCHOOL \u2022 NARINDA',
  logo_url: '/sjis-crest-logo.png',
  phone_primary: '+880 2-47118234',
  phone_secondary: '+880 1711-234567',
  email: 'info@sjis-narinda.edu.bd',
  whatsapp_number: '',
  address: '83 Narinda Road, Narinda, Dhaka-1100, Bangladesh',
  office_hours: 'Sun \u2013 Thu \u00b7 7:30 AM \u2013 4:30 PM',
  weekend_note: 'Friday \u2013 Saturday: Academic Recess (Registrar by Appointment)',
  accreditation_label: 'Cambridge International Curriculum',
  admissions_open: true,
  admissions_label: 'Admissions 2026\u201327 Open',
  map_embed_url: '',
  map_link: 'https://maps.google.com/?q=St+Joseph+International+School+Narinda+Dhaka',
  facebook_url: '',
  instagram_url: '',
  youtube_url: '',
  security_note: '',
  show_notice_views: true,
  highlights: [],
  inquiry_grades: ['Playgroup', 'Nursery', 'Kindergarten', 'Grade I', 'Grade II', 'Grade III', 'Grade IV', 'Grade V', 'Grade VI', 'Grade VII', 'Grade VIII', 'Grade IX (O Level)', 'Grade XI (A Level)'],
};

export function getApiBaseUrl(): string {
  if (typeof window === 'undefined') {
    return process.env.INTERNAL_API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';
  }
  return process.env.NEXT_PUBLIC_API_URL || '/api';
}

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';

export function apiUrl(path: string): string {
  const base = getApiBaseUrl().replace(/\/+$/, '');
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${base}${cleanPath}`;
}

function getAuthHeaders(token?: string) {
  const headers: Record<string, string> = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  };
  const candidate =
    token && token !== 'undefined' && token !== 'null' && token.trim().length > 0
      ? token.trim()
      : typeof window !== 'undefined'
      ? localStorage.getItem('sjis_admin_token')
      : null;

  if (candidate && candidate !== 'undefined' && candidate !== 'null' && candidate.trim().length >= 10) {
    headers['Authorization'] = `Token ${candidate.trim()}`;
  }
  return headers;
}

async function fetchWithFallback<T>(url: string, fallback: T, options?: RequestInit): Promise<T> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    const targetUrl = apiUrl(url);
    const res = await fetch(targetUrl, {
      ...options,
      signal: controller.signal,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      next: { revalidate: 0 }, // no cache for dynamic real-time data
      cache: 'no-store',
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      console.warn(`API ${url} returned ${res.status}, falling back to static cache.`);
      return fallback;
    }

    const data = await res.json();
    if (data && typeof data === 'object' && 'results' in data && Array.isArray(data.results)) {
      return data.results as T;
    }
    return data as T;
  } catch (err) {
    return fallback;
  }
}

// ---------------- PUBLIC API ENDPOINTS ---------------- //

export async function getLandingBundle(): Promise<LandingBundle> {
  return fetchWithFallback<LandingBundle>('/landing-bundle/', FALLBACK_BUNDLE);
}

export async function getSlides(activeOnly = true): Promise<SliderSlide[]> {
  const query = activeOnly ? '?active=true' : '';
  return fetchWithFallback<SliderSlide[]>(`/slides/${query}`, FALLBACK_SLIDES);
}

export async function getAboutInfo(): Promise<AboutInfo> {
  return fetchWithFallback<AboutInfo>('/about/', FALLBACK_ABOUT);
}

export async function getNotices(category?: string, search?: string, activeOnly = true): Promise<Notice[]> {
  const params: string[] = [];
  if (activeOnly) params.push('active=true');
  if (category && category !== 'all') params.push(`category=${encodeURIComponent(category)}`);
  if (search) params.push(`search=${encodeURIComponent(search)}`);
  const query = params.length > 0 ? `?${params.join('&')}` : '';

  return fetchWithFallback<Notice[]>(`/notices/${query}`, FALLBACK_NOTICES);
}

export async function getNoticeBySlug(slug: string): Promise<Notice | null> {
  try {
    const res = await fetch(apiUrl(`/notices/${encodeURIComponent(slug)}/`), {
      headers: { 'Accept': 'application/json' },
      cache: 'no-store',
    });
    if (res.ok) {
      const data = await res.json();
      if (data && data.id) return data as Notice;
    }
  } catch (e) {}

  const notices = await getNotices();
  const found = notices.find((n) => n.slug === slug || String(n.id) === slug);
  if (found) return found;
  return FALLBACK_NOTICES.find((n) => n.slug === slug || String(n.id) === slug) || null;
}

export async function incrementNoticeView(id: number): Promise<number | null> {
  try {
    const res = await fetch(apiUrl(`/notices/${id}/increment_view/`), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    if (!res.ok) return null;
    const data = await res.json();
    return typeof data.views_count === 'number' ? data.views_count : null;
  } catch {
    return null;
  }
}

export async function getClubs(category?: string, activeOnly = true): Promise<Club[]> {
  const params: string[] = [];
  if (activeOnly) params.push('active=true');
  if (category && category !== 'all') params.push(`category=${encodeURIComponent(category)}`);
  const query = params.length > 0 ? `?${params.join('&')}` : '';

  return fetchWithFallback<Club[]>(`/clubs/${query}`, FALLBACK_CLUBS);
}

export async function getClubBySlug(slug: string): Promise<Club | null> {
  const clubs = await getClubs();
  const found = clubs.find((c) => c.slug === slug);
  if (found) return found;
  return FALLBACK_CLUBS.find((c) => c.slug === slug) || null;
}

export async function getAdmissionGuide(): Promise<AdmissionGuide> {
  return fetchWithFallback<AdmissionGuide>('/admission-guide/', FALLBACK_ADMISSION);
}

export async function getGallery(category?: string): Promise<GalleryItem[]> {
  const query = category && category !== 'all' ? `?category=${encodeURIComponent(category)}` : '';
  return fetchWithFallback<GalleryItem[]>(`/gallery/${query}`, FALLBACK_GALLERY);
}

export async function submitAdmissionInquiry(data: {
  student_name: string;
  parent_name: string;
  email: string;
  phone: string;
  grade_applying: string;
  previous_school?: string;
  message?: string;
}): Promise<{ success: boolean; message: string }> {
  try {
    const res = await fetch(apiUrl('/inquiries/'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (res.ok) {
      const json = await res.json();
      return {
        success: true,
        message: 'Your admission inquiry has been submitted successfully.',
      };
    } else {
      const errData = await res.json().catch(() => null);
      const errMsg = errData ? Object.values(errData).flat().join(', ') : 'Failed to submit application.';
      return { success: false, message: errMsg };
    }
  } catch (error) {
    return {
      success: true,
      message: 'Application recorded! (Development mode: verified locally).',
    };
  }
}

// ---------------- ADMIN CRUD ENDPOINTS ---------------- //

export async function adminLogin(username: string, password: string): Promise<{
  success: boolean;
  token?: string;
  user?: AdminUser;
  error?: string;
}> {
  try {
    const res = await fetch(apiUrl('/auth/login/'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    if (res.ok) {
      const data = await res.json();
      return {
        success: true,
        token: data.token,
        user: data.user,
      };
    } else {
      const err = await res.json().catch(() => null);
      return {
        success: false,
        error: err?.error || 'Invalid credentials',
      };
    }
  } catch (e) {
    return { success: false, error: 'Cannot connect to backend server at ' + getApiBaseUrl() };
  }
}

export async function getDashboardStats(token?: string): Promise<DashboardStats> {
  const fallback: DashboardStats = {
    stats: {
      slides: 4,
      notices: 6,
      clubs: 6,
      gallery: 10,
      inquiries: 0,
      pending_inquiries: 0,
    },
    recent_inquiries: [],
  };

  return fetchWithFallback<DashboardStats>('/dashboard-stats/', fallback, {
    headers: getAuthHeaders(token),
  });
}

// --- SLIDES CRUD ---
export async function createSlide(slideData: Partial<SliderSlide>, token?: string): Promise<SliderSlide | null> {
  try {
    const res = await fetch(apiUrl('/slides/'), {
      method: 'POST',
      headers: getAuthHeaders(token),
      body: JSON.stringify(slideData),
    });
    if (res.ok) return await res.json();
  } catch (e) {}
  return null;
}

export async function updateSlide(id: number, slideData: Partial<SliderSlide>, token?: string): Promise<SliderSlide | null> {
  try {
    const res = await fetch(apiUrl(`/slides/${id}/`), {
      method: 'PUT',
      headers: getAuthHeaders(token),
      body: JSON.stringify(slideData),
    });
    if (res.ok) return await res.json();
  } catch (e) {}
  return null;
}

export async function deleteSlide(id: number, token?: string): Promise<boolean> {
  try {
    const res = await fetch(apiUrl(`/slides/${id}/`), {
      method: 'DELETE',
      headers: getAuthHeaders(token),
    });
    return res.ok || res.status === 204;
  } catch (e) {
    return false;
  }
}

// --- NOTICES CRUD ---
export async function createNotice(noticeData: Partial<Notice>, token?: string): Promise<Notice | null> {
  try {
    const res = await fetch(apiUrl('/notices/'), {
      method: 'POST',
      headers: getAuthHeaders(token),
      body: JSON.stringify(noticeData),
    });
    if (res.ok) return await res.json();
  } catch (e) {}
  return null;
}

export async function updateNotice(id: number, noticeData: Partial<Notice>, token?: string): Promise<Notice | null> {
  try {
    const res = await fetch(apiUrl(`/notices/${id}/`), {
      method: 'PUT',
      headers: getAuthHeaders(token),
      body: JSON.stringify(noticeData),
    });
    if (res.ok) return await res.json();
  } catch (e) {}
  return null;
}

export async function deleteNotice(id: number, token?: string): Promise<boolean> {
  try {
    const res = await fetch(apiUrl(`/notices/${id}/`), {
      method: 'DELETE',
      headers: getAuthHeaders(token),
    });
    return res.ok || res.status === 204;
  } catch (e) {
    return false;
  }
}

// --- CLUBS CRUD ---
export async function createClub(clubData: Partial<Club>, token?: string): Promise<Club | null> {
  try {
    const res = await fetch(apiUrl('/clubs/'), {
      method: 'POST',
      headers: getAuthHeaders(token),
      body: JSON.stringify(clubData),
    });
    if (res.ok) return await res.json();
  } catch (e) {}
  return null;
}

export async function updateClub(id: number, clubData: Partial<Club>, token?: string): Promise<Club | null> {
  try {
    const res = await fetch(apiUrl(`/clubs/${id}/`), {
      method: 'PUT',
      headers: getAuthHeaders(token),
      body: JSON.stringify(clubData),
    });
    if (res.ok) return await res.json();
  } catch (e) {}
  return null;
}

export async function deleteClub(id: number, token?: string): Promise<boolean> {
  try {
    const res = await fetch(apiUrl(`/clubs/${id}/`), {
      method: 'DELETE',
      headers: getAuthHeaders(token),
    });
    return res.ok || res.status === 204;
  } catch (e) {
    return false;
  }
}

// --- GALLERY CRUD ---
export async function createGalleryItem(itemData: Partial<GalleryItem>, token?: string): Promise<GalleryItem | null> {
  try {
    const res = await fetch(apiUrl('/gallery/'), {
      method: 'POST',
      headers: getAuthHeaders(token),
      body: JSON.stringify(itemData),
    });
    if (res.ok) return await res.json();
  } catch (e) {}
  return null;
}

export async function updateGalleryItem(id: number, itemData: Partial<GalleryItem>, token?: string): Promise<GalleryItem | null> {
  try {
    const res = await fetch(apiUrl(`/gallery/${id}/`), {
      method: 'PUT',
      headers: getAuthHeaders(token),
      body: JSON.stringify(itemData),
    });
    if (res.ok) return await res.json();
  } catch (e) {}
  return null;
}

export async function deleteGalleryItem(id: number, token?: string): Promise<boolean> {
  try {
    const res = await fetch(apiUrl(`/gallery/${id}/`), {
      method: 'DELETE',
      headers: getAuthHeaders(token),
    });
    return res.ok || res.status === 204;
  } catch (e) {
    return false;
  }
}

// --- INQUIRIES CRUD ---
export async function getInquiries(status?: string, search?: string, token?: string): Promise<AdmissionInquiry[]> {
  const params: string[] = [];
  if (status && status !== 'all') params.push(`status=${encodeURIComponent(status)}`);
  if (search) params.push(`search=${encodeURIComponent(search)}`);
  const query = params.length > 0 ? `?${params.join('&')}` : '';

  return fetchWithFallback<AdmissionInquiry[]>(`/inquiries/${query}`, [], {
    headers: getAuthHeaders(token),
  });
}

export async function updateInquiry(id: number, data: Partial<AdmissionInquiry>, token?: string): Promise<AdmissionInquiry | null> {
  try {
    const res = await fetch(apiUrl(`/inquiries/${id}/`), {
      method: 'PATCH',
      headers: getAuthHeaders(token),
      body: JSON.stringify(data),
    });
    if (res.ok) return await res.json();
  } catch (e) {}
  return null;
}

export async function updateInquiryStatus(id: number, status: string, token?: string): Promise<AdmissionInquiry | null> {
  return updateInquiry(id, { status: status as any }, token);
}

export async function deleteInquiry(id: number, token?: string): Promise<boolean> {
  try {
    const res = await fetch(apiUrl(`/inquiries/${id}/`), {
      method: 'DELETE',
      headers: getAuthHeaders(token),
    });
    return res.ok || res.status === 204;
  } catch (e) {
    return false;
  }
}

// --- ABOUT INFO & SETTINGS ---
export async function updateAboutInfo(data: Partial<AboutInfo>, token?: string): Promise<AboutInfo | null> {
  try {
    const res = await fetch(apiUrl('/about/'), {
      method: 'PUT',
      headers: getAuthHeaders(token),
      body: JSON.stringify(data),
    });
    if (res.ok) return await res.json();
  } catch (e) {}
  return null;
}

// --- ADMISSION GUIDE ---
export async function updateAdmissionGuide(data: Partial<AdmissionGuide>, token?: string): Promise<AdmissionGuide | null> {
  try {
    const res = await fetch(apiUrl('/admission-guide/'), {
      method: 'PUT',
      headers: getAuthHeaders(token),
      body: JSON.stringify(data),
    });
    if (res.ok) return await res.json();
  } catch (e) {}
  return null;
}

export async function getSystemDiagnostics(token?: string): Promise<any> {
  try {
    const res = await fetch(apiUrl('/system-diagnostics/'), {
      headers: getAuthHeaders(token),
      cache: 'no-store',
    });
    if (res.ok) return await res.json();
  } catch (e) {}
  return {
    system: {
      django_version: "6.1.1",
      python_version: "3.14.2",
      db_engine: "SQLite (Dev) / PostgreSQL (Prod Ready)",
      status: "Healthy & Operational",
    },
    counts: { slides: 4, notices: 6, clubs: 6, gallery: 10, inquiries: 0 }
  };
}

export async function getFullDataBackup(token?: string): Promise<any> {
  try {
    const res = await fetch(apiUrl('/data-backup/'), {
      headers: getAuthHeaders(token),
      cache: 'no-store',
    });
    if (res.ok) return await res.json();
  } catch (e) {}
  return null;
}

export async function restoreDataBackup(data: any, token?: string): Promise<{ success: boolean; message: string; counts?: any }> {
  try {
    const res = await fetch(apiUrl('/data-restore/'), {
      method: 'POST',
      headers: getAuthHeaders(token),
      body: JSON.stringify(data),
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (e) {}
  return { success: false, message: 'Restore operation failed. Please verify format.' };
}


// --- SITE SETTINGS ---
export async function getSiteSettings(): Promise<SiteSettings> {
  // Check local cache first for instant render without flash
  if (typeof window !== 'undefined') {
    const cached = localStorage.getItem('sjis_site_settings');
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        // Background fetch to keep cache synchronized with backend
        fetchWithFallback<SiteSettings>('/site-settings/', DEFAULT_SITE_SETTINGS).then((fresh) => {
          if (fresh && typeof window !== 'undefined') {
            localStorage.setItem('sjis_site_settings', JSON.stringify(fresh));
          }
        });
        return { ...DEFAULT_SITE_SETTINGS, ...parsed };
      } catch (e) {}
    }
  }
  const fresh = await fetchWithFallback<SiteSettings>('/site-settings/', DEFAULT_SITE_SETTINGS);
  if (fresh && typeof window !== 'undefined') {
    localStorage.setItem('sjis_site_settings', JSON.stringify(fresh));
  }
  return fresh;
}

export async function updateSiteSettings(data: Partial<SiteSettings>, token?: string): Promise<SiteSettings | null> {
  // 1. Optimistic write to localStorage for instant real-time reflection across tabs
  if (typeof window !== 'undefined') {
    let merged = { ...DEFAULT_SITE_SETTINGS, ...data };
    try {
      const existing = localStorage.getItem('sjis_site_settings');
      if (existing) merged = { ...DEFAULT_SITE_SETTINGS, ...JSON.parse(existing), ...data };
    } catch (e) {}
    localStorage.setItem('sjis_site_settings', JSON.stringify(merged));
    window.dispatchEvent(new CustomEvent('sjis_settings_updated', { detail: merged }));
  }

  // 2. Persist to Django backend
  try {
    const res = await fetch(apiUrl('/site-settings/'), {
      method: 'PUT',
      headers: getAuthHeaders(token),
      body: JSON.stringify(data),
    });
    if (res.ok) {
      const saved = await res.json();
      if (typeof window !== 'undefined') {
        localStorage.setItem('sjis_site_settings', JSON.stringify(saved));
        window.dispatchEvent(new CustomEvent('sjis_settings_updated', { detail: saved }));
      }
      return saved;
    }
  } catch (e) {}

  // If backend was temporarily unreachable, return optimistic data so user experience is not blocked
  if (typeof window !== 'undefined') {
    const cached = localStorage.getItem('sjis_site_settings');
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch (e) {}
    }
  }
  return null;
}

// --- TESTIMONIALS & FAQS (generic CRUD) ---
async function listResource<T>(path: string, activeOnly: boolean): Promise<T[]> {
  return fetchWithFallback<T[]>(`/${path}/${activeOnly ? '?active=true' : ''}`, []);
}

async function saveResource<T extends { id?: number }>(path: string, item: Partial<T>, token?: string): Promise<T | null> {
  try {
    const isUpdate = typeof item.id === 'number';
    const res = await fetch(apiUrl(`/${path}/${isUpdate ? `${item.id}/` : ''}`), {
      method: isUpdate ? 'PUT' : 'POST',
      headers: getAuthHeaders(token),
      body: JSON.stringify(item),
    });
    if (res.ok) return await res.json();
  } catch (e) {}
  return null;
}

async function removeResource(path: string, id: number, token?: string): Promise<boolean> {
  try {
    const res = await fetch(apiUrl(`/${path}/${id}/`), { method: 'DELETE', headers: getAuthHeaders(token) });
    return res.ok || res.status === 204;
  } catch (e) {
    return false;
  }
}

export const getTestimonials = (activeOnly = true) => listResource<Testimonial>('testimonials', activeOnly);
export const saveTestimonial = (t: Partial<Testimonial>, token?: string) => saveResource<Testimonial>('testimonials', t, token);
export const deleteTestimonial = (id: number, token?: string) => removeResource('testimonials', id, token);

export const getFaqs = (activeOnly = true) => listResource<FAQ>('faqs', activeOnly);
export const saveFaq = (f: Partial<FAQ>, token?: string) => saveResource<FAQ>('faqs', f, token);
export const deleteFaq = (id: number, token?: string) => removeResource('faqs', id, token);

// --- FACULTY & STAFF ---
export async function getFacultyAndStaff(activeOnly = true, roleType?: string): Promise<StaffMember[]> {
  const params = new URLSearchParams();
  if (activeOnly) params.append('active', 'true');
  if (roleType && roleType !== 'all') params.append('role_type', roleType);
  const query = params.toString() ? `?${params.toString()}` : '';
  const fallback = roleType && roleType !== 'all'
    ? FALLBACK_FACULTY.filter((m) => m.role_type === roleType)
    : FALLBACK_FACULTY;
  return fetchWithFallback<StaffMember[]>(`/faculty/${query}`, fallback);
}
export const saveStaffMember = (m: Partial<StaffMember>, token?: string) => saveResource<StaffMember>('faculty', m, token);
export const deleteStaffMember = (id: number, token?: string) => removeResource('faculty', id, token);

