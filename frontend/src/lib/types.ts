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
  id?: string | number;
  name: string;
  desc: string;
  icon: string;
  image_url?: string;
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
  facilities_badge?: string;
  facilities_title?: string;
  facilities_subtitle?: string;
  facilities_cta_text?: string;
  facilities_cta_link?: string;
  about_badge?: string;
  about_title?: string;
  history_badge?: string;
  history_title?: string;
  history_image_url?: string;
  history_sub_title?: string;
  history_sub_desc?: string;
  mission_title?: string;
  vision_title?: string;
  message_badge?: string;
  message_headline?: string;
  values_badge?: string;
  values_title?: string;
  values_subtitle?: string;
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

export interface News {
  id: number;
  title: string;
  slug: string;
  category: 'events' | 'academic' | 'sports' | 'cultural' | 'campus' | 'general';
  category_display?: string;
  summary: string;
  content: string;
  image_url?: string;
  gallery_images?: string[];
  publish_date: string;
  is_featured: boolean;
  is_active: boolean;
  views_count: number;
}

export interface SyllabusItem {
  id: number;
  title: string;
  slug: string;
  grade: string;
  subject?: string;
  subjects_included?: string;
  academic_year: string;
  curriculum_section:
    | 'cambridge_primary'
    | 'cambridge_lower_sec'
    | 'cambridge_igcse'
    | 'gce_alevel'
    | 'general';
  curriculum_section_display?: string;
  file_url: string;
  file_size?: string;
  description?: string;
  version?: string;
  term?: string;
  order: number;
  is_active: boolean;
  download_count: number;
  created_at?: string;
  updated_at?: string;
}

export interface Publication {
  id: number;
  title: string;
  slug: string;
  publication_type: 'magazine' | 'yearbook' | 'newsletter' | 'prospectus' | 'handbook';
  publication_type_display?: string;
  edition: string;
  academic_year: string;
  cover_image_url: string;
  pdf_url: string;
  file_size?: string;
  pages_count: number;
  description: string;
  editor_name?: string;
  publish_date?: string;
  is_featured: boolean;
  order: number;
  is_active: boolean;
  views_count: number;
  download_count: number;
  created_at?: string;
  updated_at?: string;
}

export interface Club {
  id: number;
  name: string;
  slug: string;
  category?: string;
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
  category?: string;
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
  footer_bg_url?: string;
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
  news?: News[];
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


// ── Online Application System ─────────────────────────────────────────────────

export type ApplicationStatus =
  | 'draft'
  | 'submitted'
  | 'under_review'
  | 'shortlisted'
  | 'interview_scheduled'
  | 'documents_required'
  | 'approved'
  | 'enrolled'
  | 'waitlisted'
  | 'rejected'
  | 'withdrawn';

export interface OnlineApplicationFormData {
  // Step 1 – Student Info
  student_first_name: string;
  student_last_name: string;
  student_name_bangla: string;
  date_of_birth: string;
  gender: 'male' | 'female' | 'other';
  religion: string;
  blood_group: string;
  nationality: string;
  birth_certificate_no: string;
  passport_no: string;
  student_photo_url: string;

  // Step 2 – Academic Background
  grade_applying: string;
  section_preference: string;
  previous_school_name: string;
  previous_school_city: string;
  previous_school_board: string;
  last_grade_result: string;
  last_grade_year: string;
  previous_curriculum: string;
  extracurricular_interests: string;
  special_needs_or_conditions: string;

  // Step 3 – Parent / Guardian
  father_name: string;
  father_profession: string;
  father_organization: string;
  father_qualification: string;
  father_phone: string;
  father_nid: string;
  mother_name: string;
  mother_profession: string;
  mother_organization: string;
  mother_qualification: string;
  mother_phone: string;
  mother_nid: string;
  guardian_relation: 'father' | 'mother' | 'guardian' | 'other';
  contact_email: string;
  contact_phone: string;
  emergency_contact_name: string;
  emergency_contact_phone: string;
  emergency_contact_relation: string;
  present_address: string;
  permanent_address: string;
  present_thana: string;
  present_district: string;
  present_zip: string;

  // Step 4 – Declaration
  parent_declaration_accepted: boolean;
  sibling_at_sjis: boolean;
  sibling_name_class: string;
  how_did_you_hear: string;
  additional_notes: string;
  academic_year: string;
}

export interface OnlineApplication extends OnlineApplicationFormData {
  id: number;
  application_id: string;
  status: ApplicationStatus;
  status_display: string;
  student_full_name: string;
  documents_count: number;
  verified_docs_count: number;
  documents_verified: boolean;
  created_at: string;
  updated_at: string;
  submitted_at?: string;
  entrance_exam_date?: string;
  entrance_exam_venue?: string;
  interview_date?: string;
  admin_notes?: string;
  offer_letter_sent?: boolean;
  documents?: ApplicationDocument[];
}

export interface ApplicationDocument {
  id: number;
  application: number;
  doc_type: string;
  doc_type_display: string;
  file_url: string;
  original_filename: string;
  file_size: string;
  verified: boolean;
  verified_by: string;
  uploaded_at: string;
}

export interface ApplicationStatusResult {
  application_id: string;
  student_name: string;
  grade_applying: string;
  academic_year: string;
  status: ApplicationStatus;
  status_display: string;
  status_message: string;
  submitted_at?: string;
  entrance_exam_date?: string;
  entrance_exam_venue?: string;
  documents_verified: boolean;
}
