export interface SliderSlide {
  id: number;
  title: string;
  subtitle: string;
  badge: string;
  image_url: string;
  video_url?: string;
  cta_text: string;
  cta_link: string;
  secondary_cta_text?: string;
  secondary_cta_link?: string;
  order: number;
  is_active: boolean;
}

export interface CoreValue {
  title: string;
  desc: string;
  icon: string;
}

export interface Facility {
  name: string;
  desc: string;
  icon: string;
}

export interface EmergencyAlert {
  is_active: boolean;
  message: string;
  type: 'urgent' | 'warning' | 'info';
  link_text?: string;
  link_url?: string;
}

export interface AboutInfo {
  id?: number;
  title: string;
  tagline: string;
  history: string;
  mission: string;
  vision: string;
  principal_name: string;
  principal_title: string;
  principal_message: string;
  principal_image_url: string;
  head_role_badge?: string;
  welcome_tag?: string;
  welcome_title?: string;
  heritage_years?: string;
  heritage_label?: string;
  pillars?: string[];
  primary_button_text?: string;
  primary_button_url?: string;
  secondary_button_text?: string;
  secondary_button_url?: string;
  stats: Record<string, string>;
  emergency_alert?: EmergencyAlert;
  core_values: CoreValue[];
  facilities: Facility[];
}

export interface Notice {
  id: number;
  title: string;
  slug: string;
  category: 'academic' | 'admission' | 'events' | 'exams' | 'holidays' | 'general';
  category_display?: string;
  content: string;
  attachment_url?: string;
  publish_date: string;
  is_pinned: boolean;
  is_active: boolean;
  views_count: number;
}

export interface Club {
  id: number;
  name: string;
  slug: string;
  category: 'stem' | 'arts' | 'debate' | 'sports' | 'service';
  category_display?: string;
  motto: string;
  description: string;
  icon_name: string;
  image_url: string;
  moderator_name: string;
  schedule: string;
  key_activities: string[];
  achievements: string[];
  gallery_images?: string[];
  order: number;
  is_active: boolean;
}

export interface EligibilityItem {
  level: string;
  age_bracket: string;
  criteria: string;
}

export interface ApplicationStep {
  step: number;
  title: string;
  description: string;
}

export interface FeeItem {
  section: string;
  admission_fee: string;
  monthly_tuition: string;
  annual_session_charge: string;
}

export interface ImportantDate {
  event: string;
  date: string;
}

export interface AdmissionGuide {
  academic_year: string;
  title: string;
  overview: string;
  is_open: boolean;
  eligibility: EligibilityItem[];
  application_steps: ApplicationStep[];
  required_documents: string[];
  fee_structure: FeeItem[];
  show_fees?: boolean;
  important_dates: ImportantDate[];
}

export interface GalleryItem {
  id: number;
  title: string;
  category: 'campus' | 'academics' | 'sports' | 'cultural' | 'events';
  category_display?: string;
  media_type: 'image' | 'video';
  image_url: string;
  video_url?: string;
  caption: string;
  event_date?: string;
  is_featured: boolean;
  order: number;
}

export interface AdmissionInquiry {
  id: number;
  student_name: string;
  parent_name: string;
  email: string;
  phone: string;
  grade_applying: string;
  previous_school?: string;
  date_of_birth?: string;
  message?: string;
  admin_notes?: string;
  status: 'pending' | 'contacted' | 'admitted' | 'archived';
  created_at: string;
}

export interface AdminUser {
  id: number;
  username: string;
  email: string;
  is_staff: boolean;
  is_superuser?: boolean;
}

export interface DashboardStats {
  stats: {
    slides: number;
    notices: number;
    clubs: number;
    gallery: number;
    inquiries: number;
    pending_inquiries: number;
  };
  recent_inquiries: AdmissionInquiry[];
}

export interface HighlightItem {
  title: string;
  desc: string;
  icon: string;
}

export interface SiteSettings {
  id?: number;
  school_name: string;
  school_subtitle: string;
  logo_url?: string;
  phone_primary: string;
  phone_secondary: string;
  email: string;
  whatsapp_number: string;
  address: string;
  office_hours: string;
  weekend_note: string;
  accreditation_label: string;
  admissions_open: boolean;
  admissions_label: string;
  map_embed_url: string;
  map_link: string;
  facebook_url: string;
  instagram_url: string;
  youtube_url: string;
  security_note: string;
  show_notice_views?: boolean;
  highlights: HighlightItem[];
  inquiry_grades: string[];
}

export interface Testimonial {
  id: number;
  name: string;
  role: string;
  badge: string;
  avatar_url: string;
  quote: string;
  rating: number;
  order: number;
  is_active: boolean;
}

export interface FAQ {
  id: number;
  question: string;
  answer: string;
  category: string;
  order: number;
  is_active: boolean;
}

export interface LandingBundle {
  settings?: SiteSettings;
  testimonials?: Testimonial[];
  slides: SliderSlide[];
  about: AboutInfo | null;
  notices: Notice[];
  clubs: Club[];
  gallery: GalleryItem[];
}

export interface StaffMember {
  id: number;
  name: string;
  role_type: 'admin' | 'teacher' | 'office' | 'staff';
  role_type_display?: string;
  designation: string;
  department?: string;
  image_url: string;
  qualification: string;
  email?: string;
  phone?: string;
  bio?: string;
  order: number;
  is_featured: boolean;
  is_active: boolean;
  created_at?: string;
}


