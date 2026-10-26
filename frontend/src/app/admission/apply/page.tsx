'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  User,
  GraduationCap,
  Users,
  FileCheck2,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ArrowRight,
  Shield,
  BookOpen,
  Home,
  Phone,
  Mail,
  Camera,
  UploadCloud,
  FileText,
  Trash2,
  Copy,
  Printer,
  Info,
  Sparkles,
  Calendar,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Edit3,
  Download,
  Lock,
  CreditCard,
  Clock,
  MapPin,
  Building2,
  BookmarkCheck,
  Save,
  Check,
  RotateCcw,
  Cloud,
  Smartphone,
  KeyRound,
  RefreshCw,
} from 'lucide-react';
import { BANGLADESH_DIVISIONS, findGeoByDistrict } from '@/lib/bangladeshGeoData';
import {
  submitOnlineApplication,
  uploadMediaFile,
  getAdmissionGuide,
  getAdmissionSettings,
  initiatePayment,
  saveDraftToCloud,
  retrieveDraftFromCloud,
  type SubmitApplicationResponse,
} from '@/lib/api';
import type { OnlineApplicationFormData, AdmissionGuide, AdmissionSettings } from '@/lib/types';
import { ScrollReveal } from '@/components/ui/ScrollReveal';
import { PrintableApplicationForm } from '@/components/admission/PrintableApplicationForm';
import { printDocumentElement } from '@/lib/printUtils';

const STEPS = [
  { id: 1, title: 'Student Information', icon: User, description: 'Personal details & candidate photograph' },
  { id: 2, title: 'Academic Background', icon: GraduationCap, description: 'Grade applying & Cambridge curriculum' },
  { id: 3, title: 'Parent / Guardian', icon: Users, description: 'Family, residential & contact particulars' },
  { id: 4, title: 'Document Uploads', icon: UploadCloud, description: 'Digital certificates, report cards & NIDs' },
  { id: 5, title: 'Review & Declaration', icon: FileCheck2, description: 'Verify all particulars & authentic declaration' },
];

const GRADES = [
  'Playgroup (Age 3.5+)',
  'Nursery (Age 4.5+)',
  'Kindergarten (Age 5.5+)',
  'Grade 1',
  'Grade 2',
  'Grade 3',
  'Grade 4',
  'Grade 5',
  'Grade 6 (Junior)',
  'Grade 7',
  'Grade 8',
  'Grade 9 (Cambridge IGCSE)',
  'Grade 11 (Cambridge A-Level)',
];

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'Unknown'];
const CURRICULA = [
  'Cambridge International (CAIE)',
  'National Curriculum (NCTB)',
  'IB (International Baccalaureate)',
  'Edexcel / Pearson',
  'Other',
];
const HOW_HEARD = [
  'Facebook / Social Media',
  'Friend / Family Referral',
  'School Alumni',
  'Newspaper / Magazine',
  'Google Search',
  'Walk-in / Signage',
  'Other',
];

interface UploadedDocItem {
  doc_type: string;
  label: string;
  file_url: string;
  original_filename: string;
  file_size: string;
}

const INITIAL_FORM: OnlineApplicationFormData = {
  form_no: '',
  student_first_name: '',
  student_last_name: '',
  student_name_bangla: '',
  date_of_birth: '',
  gender: 'male',
  religion: 'islam',
  blood_group: 'Unknown',
  nationality: 'Bangladeshi',
  birth_certificate_no: '',
  passport_no: '',
  student_photo_url: '',
  student_living_with: 'parents',
  grade_applying: 'Nursery',
  section_preference: 'English Medium (Cambridge)',
  current_school_and_class: '',
  previous_school_name: '',
  previous_school_city: '',
  previous_school_board: '',
  last_grade_result: '',
  last_grade_year: '',
  previous_curriculum: 'Cambridge International (CAIE)',
  extracurricular_interests: '',
  special_needs_or_conditions: '',
  father_name: '',
  father_profession: '',
  father_organization: '',
  father_qualification: '',
  father_phone: '',
  father_nid: '',
  father_office_address: '',
  mother_name: '',
  mother_profession: '',
  mother_organization: '',
  mother_qualification: '',
  mother_phone: '',
  mother_nid: '',
  mother_office_address: '',
  guardian_relation: 'father',
  contact_email: '',
  contact_phone: '',
  emergency_contact_name: '',
  emergency_contact_phone: '',
  emergency_contact_relation: '',
  present_address: '',
  permanent_address: '',
  present_thana: 'Sutrapur',
  present_district: 'Dhaka',
  present_zip: '1100',
  parent_declaration_accepted: false,
  sibling_at_sjis: false,
  sibling_name_class: '',
  sibling_name: '',
  sibling_class: '',
  sibling_section: '',
  sibling_roll: '',
  how_did_you_hear: '',
  additional_notes: '',
  academic_year: '2026-2027',
  submission_deadline: '28.06.2026',
};

function Field({
  label,
  required,
  children,
  hint,
  error,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
  hint?: string;
  error?: string;
}) {
  return (
    <div>
      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
        {label} {required && <span className="text-[#C8102E]">*</span>}
      </label>
      {children}
      {hint && !error && <p className="mt-1 text-[11px] text-slate-400">{hint}</p>}
      {error && <p className="mt-1 text-[11px] text-rose-600 font-semibold">{error}</p>}
    </div>
  );
}

const inputClass =
  'w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#00183F]/30 focus:border-[#00183F] text-base sm:text-sm text-slate-800 bg-white transition-all';
const selectClass = inputClass + ' cursor-pointer';

function getBdPhoneStatus(phone: string) {
  const digits = phone.replace(/\D/g, '');
  if (!digits) return null;
  if (digits.startsWith('8801') && digits.length === 13) {
    return { valid: true, text: 'Valid BD mobile (+8801...)' };
  }
  if (digits.startsWith('01') && digits.length === 11) {
    return { valid: true, text: 'Valid 11-digit BD mobile' };
  }
  if (digits.length === 11) {
    return { valid: true, text: '11 digits entered' };
  }
  return {
    valid: false,
    text: digits.length > 11 ? `${digits.length} digits (too long)` : `${digits.length}/11 digits`,
  };
}

export default function OnlineApplicationPage() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<OnlineApplicationFormData>(INITIAL_FORM);
  const [guide, setGuide] = useState<AdmissionGuide | null>(null);
  const [showGuidelines, setShowGuidelines] = useState(false);
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<SubmitApplicationResponse | null>(null);
  const [admSettings, setAdmSettings] = useState<AdmissionSettings | null>(null);
  const [paying, setPaying] = useState(false);
  const [payError, setPayError] = useState<string | null>(null);
  const [stepError, setStepError] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState(false);
  const [draftRestored, setDraftRestored] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [lastSavedAt, setLastSavedAt] = useState<string | null>(null);
  const [draftSavedToast, setDraftSavedToast] = useState(false);

  // Cloud Draft State (cross-device save & resume)
  const [cloudDraftKey, setCloudDraftKey] = useState<string | null>(null);
  const [cloudDraftPhone, setCloudDraftPhone] = useState<string>('');
  const [cloudPhoneInput, setCloudPhoneInput] = useState<string>('');
  const [isSavingCloud, setIsSavingCloud] = useState(false);
  const [copiedDraftKey, setCopiedDraftKey] = useState(false);

  // Resume Modal State
  const [showResumeModal, setShowResumeModal] = useState(false);
  const [resumePhone, setResumePhone] = useState('');
  const [resumeCode, setResumeCode] = useState('');
  const [resumeLoading, setResumeLoading] = useState(false);
  const [resumeError, setResumeError] = useState<string | null>(null);
  // Bangladesh Hierarchical Address Cascading State (Division -> District -> Thana -> Street)
  const [selectedDivisionId, setSelectedDivisionId] = useState<string>('dhaka');
  const [selectedDistrictId, setSelectedDistrictId] = useState<string>('dhaka');
  const [selectedThana, setSelectedThana] = useState<string>('Sutrapur (Old Dhaka / Narinda / Gandaria vicinity)');
  const [isCustomThana, setIsCustomThana] = useState(false);
  const [customThanaText, setCustomThanaText] = useState('');
  const [streetAddress, setStreetAddress] = useState('');
  const [postalCode, setPostalCode] = useState('1100');
  const [sameAsPresentAddress, setSameAsPresentAddress] = useState(true);
  const [manualAddressOverride, setManualAddressOverride] = useState(false);

  // Student Photo Upload State
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [photoError, setPhotoError] = useState<string | null>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);

  // Document Uploads State
  const [documents, setDocuments] = useState<UploadedDocItem[]>([]);
  const [uploadingDocKey, setUploadingDocKey] = useState<string | null>(null);

  const topRef = useRef<HTMLDivElement>(null);

  // Active Division, District, and Thana lists
  const activeDivision = BANGLADESH_DIVISIONS.find((d) => d.id === selectedDivisionId) || BANGLADESH_DIVISIONS[0];
  const activeDistrictList = activeDivision?.districts || [];
  const activeDistrict = activeDistrictList.find((d) => d.id === selectedDistrictId) || activeDistrictList[0] || BANGLADESH_DIVISIONS[0].districts[0];
  const activeThanaList = activeDistrict?.thanas || [];

  // Address synchronizer into physical form field 5
  const syncAddress = (
    street: string,
    thanaVal: string,
    customT: boolean,
    customTVal: string,
    distName: string,
    zipVal: string,
    keepPermanent: boolean,
    manualOverride: boolean = manualAddressOverride
  ) => {
    const cleanThana = customT
      ? customTVal.trim()
      : (thanaVal.includes('(') ? thanaVal.split('(')[0].trim() : thanaVal.trim());

    if (!manualOverride) {
      const parts = [
        street.trim(),
        cleanThana,
        distName.trim() ? (zipVal.trim() ? `${distName.trim()} - ${zipVal.trim()}` : distName.trim()) : '',
      ].filter(Boolean);
      const synthesized = parts.join(', ');

      setForm((prev) => ({
        ...prev,
        present_address: synthesized,
        present_thana: cleanThana,
        present_district: distName.trim(),
        present_zip: zipVal.trim(),
        permanent_address: keepPermanent ? synthesized : prev.permanent_address,
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        present_thana: cleanThana,
        present_district: distName.trim(),
        present_zip: zipVal.trim(),
        permanent_address: keepPermanent ? prev.present_address : prev.permanent_address,
      }));
    }
  };

  const handleDivisionChange = (newDivId: string) => {
    setSelectedDivisionId(newDivId);
    const targetDiv = BANGLADESH_DIVISIONS.find((d) => d.id === newDivId);
    const firstDist = targetDiv?.districts[0];
    const newDistId = firstDist?.id || '';
    const newDistName = firstDist?.name || '';
    const firstThana = firstDist?.thanas[0] || '';
    const newZip = firstDist?.defaultPostalCode || '';

    setSelectedDistrictId(newDistId);
    setSelectedThana(firstThana);
    setIsCustomThana(false);
    setCustomThanaText('');
    setPostalCode(newZip);

    syncAddress(
      streetAddress,
      firstThana,
      false,
      '',
      newDistName,
      newZip,
      sameAsPresentAddress
    );
  };

  const handleDistrictChange = (newDistId: string) => {
    setSelectedDistrictId(newDistId);
    const targetDist = activeDistrictList.find((d) => d.id === newDistId);
    const newDistName = targetDist?.name || '';
    const firstThana = targetDist?.thanas[0] || '';
    const newZip = targetDist?.defaultPostalCode || '';

    setSelectedThana(firstThana);
    setIsCustomThana(false);
    setCustomThanaText('');
    setPostalCode(newZip);

    syncAddress(
      streetAddress,
      firstThana,
      false,
      '',
      newDistName,
      newZip,
      sameAsPresentAddress
    );
  };

  const handleThanaChange = (newThanaVal: string) => {
    if (newThanaVal === '__custom__') {
      setIsCustomThana(true);
      syncAddress(
        streetAddress,
        '',
        true,
        customThanaText,
        activeDistrict.name,
        postalCode,
        sameAsPresentAddress
      );
    } else {
      setIsCustomThana(false);
      setSelectedThana(newThanaVal);
      syncAddress(
        streetAddress,
        newThanaVal,
        false,
        '',
        activeDistrict.name,
        postalCode,
        sameAsPresentAddress
      );
    }
  };

  const handleCustomThanaTextChange = (text: string) => {
    setCustomThanaText(text);
    syncAddress(
      streetAddress,
      '',
      true,
      text,
      activeDistrict.name,
      postalCode,
      sameAsPresentAddress
    );
  };

  const handleStreetAddressChange = (text: string) => {
    setStreetAddress(text);
    syncAddress(
      text,
      selectedThana,
      isCustomThana,
      customThanaText,
      activeDistrict.name,
      postalCode,
      sameAsPresentAddress
    );
  };

  const handlePostalCodeChange = (code: string) => {
    setPostalCode(code);
    syncAddress(
      streetAddress,
      selectedThana,
      isCustomThana,
      customThanaText,
      activeDistrict.name,
      code,
      sameAsPresentAddress
    );
  };

  const handleSameAsPresentToggle = (checked: boolean) => {
    setSameAsPresentAddress(checked);
    if (checked) {
      set('permanent_address', form.present_address);
    }
  };

  // Shared draft loader (used by both local storage restoration and cloud code resumption)
  const applyDraftData = (
    parsed: Record<string, any>,
    docs: any[] = [],
    stepNum?: number,
    key?: string,
    phone?: string
  ) => {
    if (parsed && typeof parsed === 'object') {
      setForm((prev) => ({ ...prev, ...parsed }));
      if (parsed.present_district) {
        const geo = findGeoByDistrict(parsed.present_district);
        if (geo.division && geo.district) {
          setSelectedDivisionId(geo.division.id);
          setSelectedDistrictId(geo.district.id);
          if (parsed.present_thana) {
            const foundThana = geo.district.thanas.find(
              (t) =>
                t.toLowerCase() === parsed.present_thana.toLowerCase() ||
                t.toLowerCase().startsWith(parsed.present_thana.toLowerCase())
            );
            if (foundThana) {
              setSelectedThana(foundThana);
              setIsCustomThana(false);
            } else {
              setIsCustomThana(true);
              setCustomThanaText(parsed.present_thana);
            }
          }
        }
      }
      if (parsed.present_zip) {
        setPostalCode(parsed.present_zip);
      }
      if (parsed.present_address) {
        setStreetAddress(parsed.present_address);
      }
      if (
        parsed.permanent_address &&
        parsed.present_address &&
        parsed.permanent_address !== parsed.present_address
      ) {
        setSameAsPresentAddress(false);
      }
      if (parsed.student_first_name || parsed.contact_phone) {
        setDraftRestored(true);
      }
    }
    if (Array.isArray(docs) && docs.length > 0) {
      setDocuments(docs);
    }
    if (stepNum && stepNum >= 1 && stepNum <= STEPS.length) {
      setStep(stepNum);
    }
    if (key) {
      setCloudDraftKey(key);
      try {
        localStorage.setItem('sjis_apply_draft_key', key);
      } catch {}
    }
    if (phone) {
      setCloudDraftPhone(phone);
      try {
        localStorage.setItem('sjis_apply_draft_phone', phone);
      } catch {}
    }
  };

  // Restore saved draft from localStorage on mount
  useEffect(() => {
    try {
      const savedDraft = localStorage.getItem('sjis_apply_draft');
      const savedDocs = localStorage.getItem('sjis_apply_draft_docs');
      const savedTime = localStorage.getItem('sjis_apply_draft_time');
      const savedStep = localStorage.getItem('sjis_apply_draft_step');
      const savedKey  = localStorage.getItem('sjis_apply_draft_key');
      const savedPhone = localStorage.getItem('sjis_apply_draft_phone');

      if (savedTime) setLastSavedAt(savedTime);
      if (savedKey) setCloudDraftKey(savedKey);
      if (savedPhone) setCloudDraftPhone(savedPhone);

      const stepNum = savedStep && !isNaN(Number(savedStep)) ? Number(savedStep) : undefined;
      let parsed = null;
      let parsedDocs: any[] = [];

      if (savedDraft) {
        try { parsed = JSON.parse(savedDraft); } catch {}
      }
      if (savedDocs) {
        try { parsedDocs = JSON.parse(savedDocs); } catch {}
      }

      if (parsed) {
        applyDraftData(parsed, parsedDocs, stepNum, savedKey || undefined, savedPhone || undefined);
      }
    } catch (e) {
      console.warn('Could not restore draft:', e);
    }
  }, []);

  // Auto-save draft changes to localStorage
  useEffect(() => {
    if (result?.success) return;
    try {
      if (form.student_first_name || form.contact_phone || form.present_address || documents.length > 0) {
        localStorage.setItem('sjis_apply_draft', JSON.stringify(form));
        localStorage.setItem('sjis_apply_draft_docs', JSON.stringify(documents));
        const now = new Date();
        const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        localStorage.setItem('sjis_apply_draft_time', timeStr);
        localStorage.setItem('sjis_apply_draft_step', String(step));
        setLastSavedAt(timeStr);
      }
    } catch {
      // ignore localStorage quota errors
    }
  }, [form, documents, step, result]);

  // Save partial application to cloud to receive a shareable 6-digit Resume Code
  const performCloudSave = async (phoneToUse: string) => {
    const cleanPhone = phoneToUse.trim();
    if (!cleanPhone) return;
    setIsSavingCloud(true);
    try {
      const candidateName = form.student_first_name
        ? `${form.student_first_name} ${form.student_last_name}`.trim()
        : '';
      const res = await saveDraftToCloud({
        phone: cleanPhone,
        draft_data: form as unknown as Record<string, unknown>,
        documents: documents as unknown[],
        current_step: step,
        candidate_name: candidateName,
        grade_applying: form.grade_applying,
        draft_key: cloudDraftKey || undefined,
      });
      if (res.success && res.draft_key) {
        setCloudDraftKey(res.draft_key);
        setCloudDraftPhone(cleanPhone);
        if (!form.contact_phone?.trim()) {
          set('contact_phone', cleanPhone);
        }
        try {
          localStorage.setItem('sjis_apply_draft_key', res.draft_key);
          localStorage.setItem('sjis_apply_draft_phone', cleanPhone);
        } catch {}
      }
    } catch (e) {
      console.warn('Cloud draft save failed:', e);
    } finally {
      setIsSavingCloud(false);
    }
  };

  const saveDraftManually = () => {
    try {
      localStorage.setItem('sjis_apply_draft', JSON.stringify(form));
      localStorage.setItem('sjis_apply_draft_docs', JSON.stringify(documents));
      const now = new Date();
      const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      localStorage.setItem('sjis_apply_draft_time', timeStr);
      localStorage.setItem('sjis_apply_draft_step', String(step));
      setLastSavedAt(timeStr);
      setShowSaveModal(true);

      const candidatePhone =
        form.contact_phone?.trim() ||
        form.father_phone?.trim() ||
        form.mother_phone?.trim() ||
        cloudDraftPhone.trim();

      if (candidatePhone) {
        setCloudPhoneInput(candidatePhone);
        performCloudSave(candidatePhone);
      }
    } catch {
      // ignore
    }
  };

  // Resume draft from any other device using mobile number + 6-digit draft code
  const handleResumeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resumePhone.trim() || !resumeCode.trim()) {
      setResumeError('Please enter both your mobile number and draft code.');
      return;
    }
    setResumeLoading(true);
    setResumeError(null);
    try {
      const res = await retrieveDraftFromCloud(resumePhone.trim(), resumeCode.trim().toUpperCase());
      if (res.success && res.draft_data) {
        applyDraftData(
          res.draft_data,
          (res.documents as UploadedDocItem[]) || [],
          res.current_step,
          res.draft_key,
          resumePhone.trim()
        );
        const now = new Date();
        const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        setLastSavedAt(timeStr);
        try {
          localStorage.setItem('sjis_apply_draft', JSON.stringify(res.draft_data));
          if (res.documents) localStorage.setItem('sjis_apply_draft_docs', JSON.stringify(res.documents));
          localStorage.setItem('sjis_apply_draft_time', timeStr);
          if (res.current_step) localStorage.setItem('sjis_apply_draft_step', String(res.current_step));
        } catch {}
        setShowResumeModal(false);
        setDraftRestored(true);
        topRef.current?.scrollIntoView({ behavior: 'smooth' });
      } else {
        setResumeError(res.error || 'Draft not found. Please verify your mobile number and draft code.');
      }
    } catch {
      setResumeError('Network error. Please check your connection and try again.');
    } finally {
      setResumeLoading(false);
    }
  };

  const clearDraft = () => {
    try {
      localStorage.removeItem('sjis_apply_draft');
      localStorage.removeItem('sjis_apply_draft_docs');
      localStorage.removeItem('sjis_apply_draft_time');
      localStorage.removeItem('sjis_apply_draft_step');
      localStorage.removeItem('sjis_apply_draft_key');
      localStorage.removeItem('sjis_apply_draft_phone');
      setForm(INITIAL_FORM);
      setDocuments([]);
      setDraftRestored(false);
      setCloudDraftKey(null);
      setCloudDraftPhone('');
      setLastSavedAt(null);
      setStep(1);
    } catch {
      // ignore
    }
  };

  // Load backend admission guide & settings dynamically
  useEffect(() => {
    async function loadData() {
      try {
        const [guideData, settingsData] = await Promise.all([
          getAdmissionGuide().catch(() => null),
          getAdmissionSettings().catch(() => null),
        ]);
        if (guideData) {
          setGuide(guideData);
          if (guideData.academic_year) {
            setForm((prev) => ({ ...prev, academic_year: guideData.academic_year }));
          }
        }
        if (settingsData) {
          setAdmSettings(settingsData);
          if (settingsData.available_grades && settingsData.available_grades.length > 0) {
            setForm((prev) => {
              const list = settingsData.available_grades!;
              return list.includes(prev.grade_applying) ? prev : { ...prev, grade_applying: list[0] };
            });
          }
        }
      } catch (err) {
        console.warn('Could not load admission data:', err);
      }
    }
    loadData();
  }, []);

  const set = (field: keyof OnlineApplicationFormData, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setStepError(null);
  };

  const scrollTop = () => topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });

  // Handle Candidate Photo Upload
  const handlePhotoUpload = async (file: File) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setPhotoError('Please select a valid image file (JPG, PNG, WebP).');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setPhotoError('Image file must be smaller than 5 MB.');
      return;
    }
    setUploadingPhoto(true);
    setPhotoError(null);
    try {
      const res = await uploadMediaFile(file);
      if (res && res.url) {
        set('student_photo_url', res.url);
      } else {
        setPhotoError(res?.error || 'Failed to upload photograph. Please try again.');
      }
    } catch {
      setPhotoError('Network error uploading photograph.');
    } finally {
      setUploadingPhoto(false);
    }
  };

  // Handle Document Upload
  const handleDocUpload = async (docType: string, label: string, file: File) => {
    if (!file) return;
    if (file.size > 15 * 1024 * 1024) {
      alert('File must be smaller than 15 MB.');
      return;
    }
    setUploadingDocKey(docType);
    try {
      const res = await uploadMediaFile(file);
      if (res && res.url) {
        const sizeStr = `${(file.size / (1024 * 1024)).toFixed(2)} MB`;
        setDocuments((prev) => [
          ...prev.filter((d) => d.doc_type !== docType),
          {
            doc_type: docType,
            label,
            file_url: res.url,
            original_filename: file.name,
            file_size: sizeStr,
          },
        ]);
      } else {
        alert(res?.error || 'Document upload failed. Please try again.');
      }
    } catch {
      alert('Network error while uploading document.');
    } finally {
      setUploadingDocKey(null);
    }
  };

  const removeDoc = (docType: string) => {
    setDocuments((prev) => prev.filter((d) => d.doc_type !== docType));
  };

  // Step Validation
  const validateStep = (s: number): boolean => {
    setStepError(null);
    if (s === 1) {
      if (!form.student_first_name.trim()) {
        setStepError('Please enter candidate first name as in Birth Certificate.');
        return false;
      }
      if (!form.student_last_name.trim()) {
        setStepError('Please enter candidate last name / surname.');
        return false;
      }
      if (!form.date_of_birth) {
        setStepError('Please select candidate date of birth.');
        return false;
      }
      if (!form.student_photo_url) {
        setStepError('Please upload the candidate passport-size photograph before proceeding.');
        return false;
      }
    } else if (s === 2) {
      if (!form.grade_applying) {
        setStepError('Please select the grade applying for.');
        return false;
      }
    } else if (s === 3) {
      if (!form.contact_phone.trim()) {
        setStepError('Please enter primary contact phone number.');
        return false;
      }
      const digits = form.contact_phone.replace(/\D/g, '');
      if (digits.length < 10 || (digits.startsWith('01') && digits.length !== 11)) {
        setStepError('Please enter a valid 11-digit Bangladeshi mobile number (e.g. 01712345678) for Primary Contact.');
        return false;
      }
      if (!form.contact_email.trim()) {
        setStepError('Please enter guardian contact email address.');
        return false;
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(form.contact_email.trim())) {
        setStepError('Please enter a valid email address (e.g. guardian@example.com).');
        return false;
      }
      if (!form.present_address.trim() && !streetAddress.trim()) {
        setStepError('Please provide candidate present residential street address.');
        return false;
      }
      if (isCustomThana && !customThanaText.trim()) {
        setStepError('Please enter your Police Station / Thana name.');
        return false;
      }
      if (!sameAsPresentAddress && !form.permanent_address.trim()) {
        setStepError('Please enter candidate permanent address or check "Same as Present Address".');
        return false;
      }
    } else if (s === 5) {
      if (!form.parent_declaration_accepted) {
        setStepError('Please certify and confirm the authenticity consent declaration before submitting.');
        return false;
      }
    }
    return true;
  };

  const next = () => {
    if (validateStep(step)) {
      setStep((s) => Math.min(s + 1, STEPS.length));
      scrollTop();
    }
  };

  const prev = () => {
    setStepError(null);
    setStep((s) => Math.max(s - 1, 1));
    scrollTop();
  };

  const handleSubmit = async () => {
    if (!form.parent_declaration_accepted) {
      setStepError('Please certify and confirm the authenticity consent declaration before submitting.');
      return;
    }
    setSubmitting(true);
    setStepError(null);

    // Prepare payload including digital documents
    const payload = {
      ...form,
      documents: documents.map((d) => ({
        doc_type: d.doc_type,
        file_url: d.file_url,
        original_filename: d.original_filename,
        file_size: d.file_size,
      })),
    };

    const res = await submitOnlineApplication(payload);
    setResult(res);
    setSubmitting(false);
    if (res.success) {
      try {
        localStorage.removeItem('sjis_apply_draft');
        localStorage.removeItem('sjis_apply_draft_docs');
        localStorage.removeItem('sjis_apply_draft_time');
        localStorage.removeItem('sjis_apply_draft_step');
        localStorage.removeItem('sjis_apply_draft_key');
        localStorage.removeItem('sjis_apply_draft_phone');
      } catch {
        // ignore
      }
      scrollTop();
    }
  };

  const copyAppId = () => {
    if (result?.application_id) {
      navigator.clipboard.writeText(result.application_id);
      setCopiedId(true);
      setTimeout(() => setCopiedId(false), 2500);
    }
  };

  const handlePayNow = async () => {
    if (!result?.application_id) return;
    setPaying(true);
    setPayError(null);
    try {
      const res = await initiatePayment(result.application_id);
      if (res.redirect_url) {
        window.location.href = res.redirect_url;
      } else if (res.gateway === 'manual') {
        alert(
          `Payment Gateway is set to Manual Mode by school administration.\n\nFee Amount: ${result.payment_currency || 'BDT'} ${result.application_fee || '1,000'}\n\nPlease submit payment at the Admissions Accounts Counter (32 Shah Shaheb Lane, Narinda) quoting your Reference ID: ${result.application_id}.`
        );
      } else if (res.message) {
        alert(
          `${res.message}\n\nPlease present Reference ID: ${result.application_id} to the Accounts Counter for verification.`
        );
      } else if (res.error) {
        setPayError(res.error);
      } else {
        setPayError('Could not initialize payment gateway. Please try again.');
      }
    } catch {
      setPayError('Network error connecting to payment gateway.');
    } finally {
      setPaying(false);
    }
  };

  // SUCCESS CONFIRMATION VIEW
  if (result?.success) {
    const isPaymentRequired = result.payment_required === true;
    const isPaid = !isPaymentRequired || result.payment_status === 'completed';
    const canDownload = isPaid && Boolean(result.form_no);

    return (
      <>
        {/* Hidden Printable Container for Direct Browser Print Command */}
        {canDownload && (
          <div className="hidden print:block print:w-full print:m-0 print:p-0">
            <PrintableApplicationForm
              form={form}
              applicationId={result.application_id}
              formNo={result.form_no || undefined}
              documents={documents}
              pageSize={admSettings?.print_page_size || 'Legal'}
              documentChecklist={admSettings?.document_checklist || []}
              reportingInstructions={admSettings?.reporting_instructions || ''}
            />
          </div>
        )}

        {/* Screen View */}
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/40 to-slate-50 flex items-center justify-center p-4 py-12 print:hidden">
          <div className="max-w-2xl w-full bg-white rounded-3xl shadow-2xl border border-emerald-100 p-6 sm:p-12 text-center space-y-6">
            <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto shadow-md ${
              isPaid ? 'bg-emerald-50 border-4 border-emerald-200' : 'bg-amber-50 border-4 border-amber-200'
            }`}>
              {isPaid ? (
                <CheckCircle2 className="w-10 h-10 text-emerald-500" />
              ) : (
                <CreditCard className="w-10 h-10 text-amber-600" />
              )}
            </div>

            <div>
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-2 ${
                isPaid ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-900 border border-amber-200'
              }`}>
                {isPaid ? <Sparkles className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
                {isPaid ? 'Application Received & Verified' : 'Step 2: Complete Online Payment'}
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-[#00183F]">
                {isPaid ? 'Online Application Submitted Successfully!' : 'Application Registered — Payment Required'}
              </h1>
              <p className="text-slate-600 text-xs sm:text-sm mt-2 max-w-lg mx-auto leading-relaxed">
                Thank you for applying to <strong>St. Joseph International School, Narinda</strong> (Session{' '}
                {form.academic_year}). Your candidate particulars have been saved in our admissions registry.
              </p>
            </div>

            {result.application_id && (
              <div className="bg-[#00183F] text-white rounded-2xl p-6 shadow-xl relative overflow-hidden text-center space-y-2">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#D4AF37]/10 rounded-full blur-2xl pointer-events-none" />
                <p className="text-xs text-slate-300 uppercase tracking-widest font-semibold">
                  Official Application Reference ID
                </p>
                <div className="flex items-center justify-center gap-3">
                  <span className="font-mono text-2xl sm:text-3xl font-black text-[#D4AF37] tracking-wider">
                    {result.application_id}
                  </span>
                  <button
                    type="button"
                    onClick={copyAppId}
                    className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                    title="Copy Application ID"
                  >
                    {copiedId ? <CheckCircle2 className="w-5 h-5 text-emerald-400" /> : <Copy className="w-5 h-5" />}
                  </button>
                </div>
                {copiedId && (
                  <p className="text-[11px] text-emerald-300 font-bold animate-in fade-in">
                    Reference ID copied to clipboard!
                  </p>
                )}
                <div className="pt-1 text-[11px] text-slate-300 border-t border-white/10 mt-2 flex items-center justify-center gap-2">
                  <span>Physical Form Serial:</span>
                  {result.form_no ? (
                    <strong className="text-white font-mono font-bold">{result.form_no}</strong>
                  ) : (
                    <span className="text-amber-300 font-semibold italic">Assigned upon fee payment</span>
                  )}
                </div>
              </div>
            )}

            {/* Payment Banner when fee is required */}
            {!isPaid && (
              <div className="bg-gradient-to-r from-amber-500/10 via-amber-500/20 to-amber-500/10 border-2 border-amber-400 rounded-2xl p-5 text-center space-y-3">
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-amber-100 text-amber-800">
                  <Lock className="w-5 h-5 text-amber-700" />
                </div>
                <div>
                  <h3 className="text-base font-black text-[#00183F]">
                    Complete Application Fee Payment
                  </h3>
                  <p className="text-xs text-slate-700 mt-1 max-w-lg mx-auto leading-relaxed">
                    Per admissions board regulations, an official physical form serial number and printable Candidate Admit Card are issued immediately after paying the application processing fee of{' '}
                    <strong className="text-amber-900 font-bold">
                      {result.payment_currency || 'BDT'} {result.application_fee || '1,000'}
                    </strong>.
                  </p>
                </div>

                {payError && (
                  <p className="text-xs text-rose-700 font-bold bg-rose-50 border border-rose-200 rounded-lg p-2 max-w-md mx-auto">
                    {payError}
                  </p>
                )}

                <div>
                  <button
                    type="button"
                    disabled={paying}
                    onClick={handlePayNow}
                    className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-black text-sm shadow-lg shadow-emerald-700/25 active:scale-[0.98] transition-all cursor-pointer disabled:opacity-50"
                  >
                    {paying ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Opening Payment Gateway...</span>
                      </>
                    ) : (
                      <>
                        <CreditCard className="w-4 h-4" />
                        <span>
                          Pay Fee Online Now ({result.payment_currency || 'BDT'} {result.application_fee || '1,000'})
                        </span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Next Steps Checklist */}
            <div className="bg-amber-50/80 border border-amber-200 rounded-2xl p-5 text-left space-y-3">
              <p className="text-xs font-black text-amber-900 uppercase tracking-wide flex items-center gap-2">
                <Info className="w-4 h-4 text-amber-600" /> What Happens Next?
              </p>
              <ul className="text-xs text-amber-900 space-y-2">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <span>
                    <strong>Document Verification:</strong> Our admissions board will verify submitted documents within 2-4 business days.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <span>
                    <strong>Assessment & Interview:</strong> You will be notified via SMS/email regarding the date and time of the candidate assessment.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <span>
                    <strong>Entrance Admit Card:</strong>{' '}
                    {canDownload
                      ? 'You can download and print your official Candidate Admit Card immediately.'
                      : 'Candidate Admit Card will unlock once application fee is completed.'}
                  </span>
                </li>
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              {canDownload ? (
                <button
                  type="button"
                  onClick={() => setShowPrintModal(true)}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-bold text-sm shadow-lg shadow-emerald-700/25 active:scale-[0.98] transition-all cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Download / Print Completed Form (PDF)</span>
                </button>
              ) : (
                <button
                  type="button"
                  disabled
                  className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-slate-100 border border-slate-300 text-slate-400 font-bold text-sm cursor-not-allowed opacity-75"
                  title="Form & Admit Card downloads unlock upon fee payment"
                >
                  <Lock className="w-4 h-4" />
                  <span>Download Form (Locked Until Payment)</span>
                </button>
              )}

              <a
                href={`/admission/status?id=${result.application_id}&phone=${encodeURIComponent(form.contact_phone)}`}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#00183F] text-amber-300 font-bold text-sm hover:bg-[#002257] transition-all shadow-md cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                <span>Track Status</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        {/* Print & PDF Interactive Modal (Screen Only) */}
        {showPrintModal && canDownload && (
          <div className="fixed inset-0 z-50 bg-slate-900/85 backdrop-blur-sm overflow-y-auto p-3 sm:p-6 flex flex-col items-center print-modal-backdrop print:static print:inset-auto print:z-auto print:bg-transparent print:p-0 print:m-0 print:overflow-visible print:block print:w-full">
            {/* Action Bar */}
            <div className="print:hidden sticky top-2 z-10 w-full max-w-[210mm] bg-[#00183F] text-white rounded-2xl p-4 shadow-2xl flex flex-wrap items-center justify-between gap-3 border border-amber-400/30 mb-4">
              <div className="flex items-center gap-3">
                <Printer className="w-5 h-5 text-[#D4AF37] shrink-0" />
                <div>
                  <h3 className="text-sm font-bold text-white">Official Application Print & PDF Generator</h3>
                  <p className="text-[11px] text-slate-300">
                    To download as PDF, choose <strong>"Save as PDF"</strong> in your print destination.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() =>
                    printDocumentElement(
                      'physical-admission-document',
                      'St. Joseph International School - Official Document',
                      admSettings?.print_page_size || 'A4'
                    )
                  }
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#D4AF37] hover:bg-[#c59f2e] text-[#00183F] font-black text-xs sm:text-sm shadow-md transition-all cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Print / Save as PDF ({admSettings?.print_page_size || 'A4'})</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowPrintModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs sm:text-sm transition-colors cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>

            {/* Sheet Container */}
            <div className="w-full max-w-[210mm] bg-white rounded-xl shadow-2xl overflow-hidden border border-slate-300 mb-8 print:max-w-none print:w-full print:border-none print:shadow-none print:m-0 print:p-0 print:rounded-none">
              <PrintableApplicationForm
                form={form}
                applicationId={result.application_id}
                formNo={result.form_no || undefined}
                documents={documents}
                pageSize={admSettings?.print_page_size || 'Legal'}
                documentChecklist={admSettings?.document_checklist || []}
                reportingInstructions={admSettings?.reporting_instructions || ''}
              />
            </div>
          </div>
        )}
      </>
    );
  }

  return (
    <>
      <div className="bg-slate-50 min-h-screen print:hidden" ref={topRef}>
      {/* Top Hero Banner */}
      <section className="relative py-14 sm:py-20 bg-[#00183F] text-white overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 text-center space-y-3">
          <div className="flex flex-wrap items-center justify-center gap-2">
            <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#D4AF37]/20 text-[#D4AF37] text-xs font-bold tracking-widest uppercase border border-[#D4AF37]/30">
              <GraduationCap className="w-3.5 h-3.5" /> Academic Session {form.academic_year}
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-xs font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              English Medium (Cambridge)
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white">
            Online Admission Application
          </h1>

          <p className="mt-2 text-slate-300 text-xs sm:text-sm lg:text-base max-w-2xl mx-auto leading-relaxed">
            St. Joseph International School, Narinda • Cambridge Assessment International Education (CAIE) curriculum for Playgroup through Grade 11.
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-4 text-xs text-slate-300">
            <span className="inline-flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-emerald-400" /> Secure SSL Portal
            </span>
            <span>•</span>
            <span className="inline-flex items-center gap-1.5">
              <FileCheck2 className="w-3.5 h-3.5 text-amber-400" /> Digital Document Verification
            </span>
            <span>•</span>
            <button
              type="button"
              onClick={() => setShowGuidelines(!showGuidelines)}
              className="inline-flex items-center gap-1 text-amber-300 hover:text-white font-bold underline cursor-pointer"
            >
              <span>{showGuidelines ? 'Hide' : 'View'} Admission Criteria & Age Limits</span>
              {showGuidelines ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
            <span>•</span>
            <button
              type="button"
              onClick={() => {
                setResumeError(null);
                setShowResumeModal(true);
              }}
              className="inline-flex items-center gap-1.5 text-amber-200 hover:text-white font-bold bg-amber-400/15 hover:bg-amber-400/25 px-3 py-1 rounded-full border border-amber-400/40 transition-all cursor-pointer shadow-xs"
            >
              <KeyRound className="w-3.5 h-3.5 text-amber-300" />
              <span>Resume Saved Application</span>
            </button>
          </div>
        </div>
      </section>

      {/* Collapsible Admission Guidelines & Age Bracket Drawer */}
      {showGuidelines && (
        <div className="bg-[#00122e] border-b border-[#D4AF37]/30 text-white animate-in slide-in-from-top duration-300 py-6 px-4">
          <div className="max-w-4xl mx-auto space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <h3 className="text-sm font-bold text-[#D4AF37] uppercase tracking-wider flex items-center gap-2">
                <BookOpen className="w-4 h-4" /> Cambridge Curriculum Age Criteria & Guidelines
              </h3>
              <button
                onClick={() => setShowGuidelines(false)}
                className="text-xs text-slate-400 hover:text-white cursor-pointer"
              >
                Close ✕
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                <span className="text-[#D4AF37] font-bold block">Playgroup</span>
                <span className="text-slate-300">Age: 3.5+ Years</span>
              </div>
              <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                <span className="text-[#D4AF37] font-bold block">Nursery</span>
                <span className="text-slate-300">Age: 4.5+ Years</span>
              </div>
              <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                <span className="text-[#D4AF37] font-bold block">Kindergarten</span>
                <span className="text-slate-300">Age: 5.5+ Years</span>
              </div>
              <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                <span className="text-[#D4AF37] font-bold block">Grade 1</span>
                <span className="text-slate-300">Age: 6.0+ Years</span>
              </div>
            </div>

            <p className="text-[11px] text-slate-300 leading-relaxed">
              * Candidate ages are calculated as of January of the academic session. Applicants for Grade 2 and above will be assessed based on previous academic transcripts and an English & Mathematics entrance evaluation.
            </p>
          </div>
        </div>
      )}

      {/* Main Form Container */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Draft Restored Banner */}
        {draftRestored && (
          <div className="mb-6 p-4.5 rounded-2xl bg-gradient-to-r from-amber-50 via-orange-50 to-amber-50 border border-amber-300/90 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-amber-950 shadow-sm animate-in fade-in">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-amber-200/80 flex items-center justify-center shrink-0 text-amber-800">
                <BookmarkCheck className="w-4 h-4" />
              </div>
              <div>
                <p className="font-bold text-amber-900 text-sm flex items-center gap-2">
                  <span>Welcome back! Incomplete Draft Restored</span>
                  {cloudDraftKey && (
                    <span className="bg-amber-200 text-amber-950 font-mono font-black px-2 py-0.5 rounded text-[10px] border border-amber-300">
                      Code: {cloudDraftKey}
                    </span>
                  )}
                </p>
                <p className="text-amber-800/90 text-xs mt-0.5">
                  We found your previous progress for{' '}
                  <strong className="text-amber-950">
                    {form.student_first_name ? `${form.student_first_name} ${form.student_last_name}`.trim() : 'Candidate Application'}
                  </strong>
                  {form.grade_applying ? ` (${form.grade_applying})` : ''}{lastSavedAt ? ` • Last saved at ${lastSavedAt}` : ''}.
                  You can safely continue right from where you left off.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
              <button
                type="button"
                onClick={() => setDraftRestored(false)}
                className="px-3.5 py-1.5 rounded-lg bg-amber-200 hover:bg-amber-300 text-amber-950 font-bold text-[11px] transition-colors cursor-pointer"
              >
                Continue Application
              </button>
              <button
                type="button"
                onClick={clearDraft}
                className="px-3 py-1.5 rounded-lg bg-white/80 hover:bg-white text-slate-600 hover:text-red-700 font-semibold text-[11px] transition-colors border border-amber-200 cursor-pointer"
              >
                Clear & Start Over
              </button>
            </div>
          </div>
        )}

        {/* Top Progress & Auto-Save Status Header */}
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2 text-slate-500">
            <span className="font-bold text-[#00183F] uppercase tracking-wider text-[11px]">
              Step {step} of {STEPS.length}:
            </span>
            <span className="font-semibold text-slate-700">{STEPS[step - 1]?.title}</span>
          </div>

          <div className="flex items-center gap-2.5">
            {lastSavedAt ? (
              <span className="inline-flex items-center gap-1.5 text-[11px] text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200/70 font-medium">
                <Check className="w-3 h-3 text-emerald-600" />
                <span>Auto-saved at {lastSavedAt}</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-[11px] text-slate-400">
                <Clock className="w-3 h-3" /> Auto-saves as you type
              </span>
            )}
            <button
              type="button"
              onClick={() => {
                setResumeError(null);
                setShowResumeModal(true);
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-bold text-[11px] transition-colors shadow-2xs cursor-pointer"
              title="Resume an application started on another device with your Draft Code"
            >
              <KeyRound className="w-3.5 h-3.5 text-slate-600" />
              <span>Resume with Code</span>
            </button>
            <button
              type="button"
              onClick={saveDraftManually}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg border border-amber-300 bg-amber-50 hover:bg-amber-100 text-amber-900 font-bold text-[11px] transition-colors shadow-2xs cursor-pointer"
              title="Save draft and safely exit or continue later"
            >
              <BookmarkCheck className="w-3.5 h-3.5 text-amber-700" />
              <span>Save & Exit</span>
            </button>
          </div>
        </div>

        {/* Responsive Step Progress Bar */}
        <div className="w-full mb-8">
          <div className="flex items-center justify-between gap-1 sm:gap-2">
            {STEPS.map((s, i) => {
              const done = step > s.id;
              const active = step === s.id;
              const Icon = s.icon;
              return (
                <React.Fragment key={s.id}>
                  <div className="flex flex-col items-center gap-1.5 flex-1 min-w-0">
                    <button
                      type="button"
                      onClick={() => {
                        if (done) setStep(s.id);
                      }}
                      className={`w-9 h-9 sm:w-11 sm:h-11 rounded-full flex items-center justify-center border-2 transition-all duration-300 shrink-0 ${
                        done
                          ? 'bg-emerald-500 border-emerald-500 text-white cursor-pointer hover:bg-emerald-600'
                          : active
                          ? 'bg-[#00183F] border-[#00183F] text-[#D4AF37] shadow-lg scale-105 ring-4 ring-amber-400/20'
                          : 'bg-white border-slate-200 text-slate-400'
                      }`}
                    >
                      {done ? <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5" /> : <Icon className="w-4 h-4 sm:w-5 sm:h-5" />}
                    </button>
                    <span
                      className={`text-[10px] sm:text-xs font-bold tracking-tight text-center truncate max-w-full ${
                        active ? 'text-[#00183F]' : done ? 'text-emerald-700' : 'text-slate-400'
                      }`}
                    >
                      {s.title}
                    </span>
                  </div>
                  {i < STEPS.length - 1 && (
                    <div className="w-6 sm:w-12 h-0.5 mt-[-20px] shrink-0">
                      <div
                        className={`h-full transition-all duration-500 rounded ${
                          step > s.id ? 'bg-emerald-400' : 'bg-slate-200'
                        }`}
                      />
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </div>

          {/* Mobile active step notice */}
          <div className="mt-3 text-center sm:hidden">
            <span className="text-xs font-bold text-[#00183F]">
              Step {step} of {STEPS.length}: {STEPS[step - 1].title}
            </span>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
          {/* Step Header */}
          <div className="bg-gradient-to-r from-[#00183F] to-[#071F48] px-6 sm:px-10 py-5 flex items-center justify-between gap-4 text-white">
            <div className="flex items-center gap-3">
              {React.createElement(STEPS[step - 1].icon, { className: 'w-6 h-6 text-[#D4AF37]' })}
              <div>
                <span className="text-[10px] text-slate-300 font-bold uppercase tracking-widest block">
                  Step {step} of {STEPS.length}
                </span>
                <h2 className="text-base sm:text-lg font-black text-white">{STEPS[step - 1].title}</h2>
              </div>
            </div>
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-white/10 text-amber-300 border border-white/10 hidden sm:inline-block">
              {STEPS[step - 1].description}
            </span>
          </div>

          {/* Form Content */}
          <div className="px-6 sm:px-10 py-8">
            {/* Validation Alert */}
            {stepError && (
              <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 flex items-start gap-3 text-xs text-rose-800 animate-in fade-in duration-200">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">Required Information Missing</p>
                  <p className="mt-0.5 text-rose-700">{stepError}</p>
                </div>
              </div>
            )}

            {/* ══════════════════════════════════════════════════════════════════
                STEP 1 · STUDENT INFORMATION & PHOTO UPLOAD
               ══════════════════════════════════════════════════════════════════ */}
            {step === 1 && (
              <ScrollReveal direction="up" distance={15} duration={400}>
                <div className="space-y-8">
                  {/* Instructions Callout */}
                  <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200 flex items-start gap-3 text-xs text-blue-900 leading-relaxed">
                    <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                    <div>
                      <strong>Important Instructions:</strong> Candidate name and date of birth must match the official Birth Certificate exactly. All fields marked <span className="text-[#C8102E] font-bold">*</span> are mandatory.
                    </div>
                  </div>

                  {/* ── Student Photo Upload Area ─────────────────────────── */}
                  <div className="p-6 rounded-2xl bg-slate-50 border-2 border-dashed border-slate-300 hover:border-[#00183F]/50 transition-all">
                    <div className="flex flex-col sm:flex-row items-center gap-6">
                      {/* Photo Preview Frame */}
                      <div className="relative w-32 h-40 sm:w-36 sm:h-44 rounded-2xl border-2 border-slate-300 bg-white shadow-md overflow-hidden flex items-center justify-center shrink-0 group">
                        {form.student_photo_url ? (
                          <img
                            src={form.student_photo_url}
                            alt="Student Passport Photo"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="flex flex-col items-center justify-center text-slate-400 text-center p-3">
                            <Camera className="w-8 h-8 mb-1.5 text-slate-300" />
                            <span className="text-[10px] font-bold leading-tight">Passport Photo 4:5</span>
                          </div>
                        )}

                        {uploadingPhoto && (
                          <div className="absolute inset-0 bg-[#00183F]/80 backdrop-blur-xs flex flex-col items-center justify-center text-white p-2 text-center">
                            <Loader2 className="w-6 h-6 animate-spin text-[#D4AF37] mb-1" />
                            <span className="text-[10px] font-bold">Uploading...</span>
                          </div>
                        )}
                      </div>

                      {/* Photo Upload Controls & Guidelines */}
                      <div className="space-y-3 text-center sm:text-left flex-1 min-w-0">
                        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                          <label className="text-xs font-bold uppercase tracking-wider text-slate-800">
                            Candidate Passport-Size Photograph <span className="text-[#C8102E]">*</span>
                          </label>
                          {form.student_photo_url ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Photo Attached
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 text-[10px] font-bold">
                              Required
                            </span>
                          )}
                        </div>

                        <p className="text-xs text-slate-600 leading-relaxed">
                          Upload a recent colored passport photograph (taken within the last 3 months). The face should be clearly visible with a formal white or plain light background. This photo will be printed on the candidate's official Entrance Admit Card.
                        </p>

                        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5 pt-1">
                          <input
                            type="file"
                            ref={photoInputRef}
                            accept="image/png, image/jpeg, image/jpg, image/webp"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handlePhotoUpload(file);
                            }}
                          />

                          <button
                            type="button"
                            onClick={() => photoInputRef.current?.click()}
                            disabled={uploadingPhoto}
                            className="px-4 py-2 rounded-xl bg-[#00183F] hover:bg-[#002257] text-white text-xs font-bold transition-all shadow-sm flex items-center gap-2 cursor-pointer"
                          >
                            <UploadCloud className="w-4 h-4 text-[#D4AF37]" />
                            <span>{form.student_photo_url ? 'Change Photograph' : 'Upload Candidate Photo'}</span>
                          </button>

                          {form.student_photo_url && (
                            <button
                              type="button"
                              onClick={() => set('student_photo_url', '')}
                              className="px-3 py-2 rounded-xl border border-slate-200 text-slate-600 hover:text-rose-600 hover:bg-rose-50 text-xs font-semibold transition-colors cursor-pointer"
                            >
                              Remove
                            </button>
                          )}
                        </div>

                        {photoError && (
                          <p className="text-xs text-rose-600 font-semibold">{photoError}</p>
                        )}

                        <p className="text-[10px] text-slate-400">
                          Supported formats: JPG, JPEG, PNG, WebP • Maximum file size: 5 MB
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* ── Student Names ─────────────────────────────────────── */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <Field
                      label="Candidate First & Middle Name (English Block Letters)"
                      required
                      hint="1. Full name of candidate (cannot be changed once registered)"
                    >
                      <input
                        type="text"
                        className={inputClass + ' uppercase tracking-wide font-medium'}
                        value={form.student_first_name}
                        placeholder="e.g. MOLIERE RAHMAN"
                        onChange={(e) => set('student_first_name', e.target.value.toUpperCase())}
                      />
                    </Field>
                    <Field
                      label="Candidate Last Name / Surname (English Block Letters)"
                      required
                      hint="As per Govt/Church Birth Certificate"
                    >
                      <input
                        type="text"
                        className={inputClass + ' uppercase tracking-wide font-medium'}
                        value={form.student_last_name}
                        placeholder="e.g. GRAMSCI"
                        onChange={(e) => set('student_last_name', e.target.value.toUpperCase())}
                      />
                    </Field>
                  </div>


                  {/* ── DOB, Gender, Living With, Blood Group ───────────────── */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                    <Field
                      label="Authentic Date of Birth"
                      required
                      hint="2. Cannot be changed (As per Govt/Church birth certificate)"
                    >
                      <input
                        type="date"
                        className={inputClass}
                        value={form.date_of_birth}
                        onChange={(e) => set('date_of_birth', e.target.value)}
                      />
                    </Field>

                    <Field label="8. Gender" required>
                      <select
                        className={selectClass}
                        value={form.gender}
                        onChange={(e) => set('gender', e.target.value as 'male' | 'female' | 'other')}
                      >
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other / Prefer not to say</option>
                      </select>
                    </Field>

                    <Field label="Blood Group">
                      <select
                        className={selectClass}
                        value={form.blood_group}
                        onChange={(e) => set('blood_group', e.target.value)}
                      >
                        {BLOOD_GROUPS.map((g) => (
                          <option key={g} value={g}>
                            {g}
                          </option>
                        ))}
                      </select>
                    </Field>
                  </div>

                  {/* ── Field 9: Student Living With ────────────────────────── */}
                  <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-800 mb-2">
                      9. Student Living With <span className="text-[#C8102E]">*</span>
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {[
                        { id: 'parents', label: 'Parents' },
                        { id: 'father', label: 'Father' },
                        { id: 'mother', label: 'Mother' },
                        { id: 'other', label: 'Other' },
                      ].map((item) => (
                        <label
                          key={item.id}
                          className={`flex items-center gap-2 p-3 rounded-xl border cursor-pointer text-xs font-bold transition-all ${
                            form.student_living_with === item.id
                              ? 'bg-[#00183F] text-[#D4AF37] border-[#00183F] shadow-sm'
                              : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          <input
                            type="radio"
                            name="student_living_with"
                            checked={form.student_living_with === item.id}
                            onChange={() => set('student_living_with', item.id as any)}
                            className="w-4 h-4 accent-[#D4AF37]"
                          />
                          <span>{item.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* ── Religion, Nationality ─────────────────────────────── */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <Field label="Religion" required hint="As written on physical form">
                      <select
                        className={selectClass}
                        value={form.religion}
                        onChange={(e) => set('religion', e.target.value)}
                      >
                        <option value="">Select Religion</option>
                        <option value="islam">Islam</option>
                        <option value="christianity">Christianity</option>
                        <option value="hinduism">Hinduism</option>
                        <option value="buddhism">Buddhism</option>
                        <option value="other">Other</option>
                      </select>
                    </Field>

                    <Field label="Nationality" required>
                      <input
                        type="text"
                        className={inputClass}
                        value={form.nationality}
                        onChange={(e) => set('nationality', e.target.value)}
                      />
                    </Field>
                  </div>

                  {/* ── Birth Certificate & Passport Numbers ────────────────── */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <Field label="Birth Certificate Number">
                      <input
                        type="text"
                        className={inputClass}
                        value={form.birth_certificate_no}
                        placeholder="e.g. 20181234567890123"
                        onChange={(e) => set('birth_certificate_no', e.target.value)}
                      />
                    </Field>

                    <Field label="Passport Number (if applicable)">
                      <input
                        type="text"
                        className={inputClass}
                        value={form.passport_no}
                        placeholder="e.g. A01234567"
                        onChange={(e) => set('passport_no', e.target.value)}
                      />
                    </Field>
                  </div>
                </div>
              </ScrollReveal>
            )}

            {/* ══════════════════════════════════════════════════════════════════
                STEP 2 · ACADEMIC BACKGROUND & CAMBRIDGE CURRICULUM
               ══════════════════════════════════════════════════════════════════ */}
            {step === 2 && (
              <ScrollReveal direction="up" distance={15} duration={400}>
                <div className="space-y-6">
                  {/* Grade Applying & Exclusive English Medium */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <Field label="7. Class/Grade for which application is being made" required>
                      <select
                        className={selectClass}
                        value={form.grade_applying}
                        onChange={(e) => set('grade_applying', e.target.value)}
                      >
                        {((admSettings?.available_grades && admSettings.available_grades.length > 0)
                          ? admSettings.available_grades
                          : GRADES
                        ).map((g) => (
                          <option key={g} value={g}>
                            {g}
                          </option>
                        ))}
                      </select>
                    </Field>

                    <Field
                      label="Curriculum & Medium of Instruction"
                      hint="SJIS operates exclusively under the Cambridge International Curriculum"
                    >
                      <div className="w-full px-4 py-2.5 rounded-xl border border-emerald-300 bg-emerald-50/70 flex items-center justify-between text-xs font-bold text-emerald-950">
                        <span className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                          English Medium (Cambridge International)
                        </span>
                        <span className="text-[10px] uppercase font-black tracking-wider px-2 py-0.5 rounded bg-emerald-200 text-emerald-900 border border-emerald-300/60">
                          CAIE Exclusive
                        </span>
                      </div>
                    </Field>
                  </div>

                  {/* Field 10 of Physical Form */}
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                    <Field
                      label="10. School & Class in which the candidate is studying this year"
                      hint="e.g. Shamrock South Park Intl. School - Nursery (or write 'None / First Admission')"
                    >
                      <input
                        type="text"
                        className={inputClass}
                        value={form.current_school_and_class || ''}
                        placeholder="e.g. Shamrock South park Intl. School, Nursery"
                        onChange={(e) => {
                          set('current_school_and_class', e.target.value);
                          if (!form.previous_school_name) {
                            set('previous_school_name', e.target.value);
                          }
                        }}
                      />
                    </Field>
                  </div>

                  {/* Previous School Info */}
                  <div className="border-t border-slate-100 pt-5 space-y-5">
                    <h3 className="text-sm font-bold text-[#00183F] flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-[#C8102E]" /> Detailed Previous Academic History (if applicable)
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <Field
                        label="Previous School Name"
                        hint="Leave blank if this is the student's first admission"
                      >
                        <input
                          type="text"
                          className={inputClass}
                          value={form.previous_school_name}
                          placeholder="e.g. Scholastica, Holy Cross, Sunbeams..."
                          onChange={(e) => set('previous_school_name', e.target.value)}
                        />
                      </Field>

                      <Field label="City / Location">
                        <input
                          type="text"
                          className={inputClass}
                          value={form.previous_school_city}
                          placeholder="e.g. Dhaka, Narinda, Wari..."
                          onChange={(e) => set('previous_school_city', e.target.value)}
                        />
                      </Field>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                      <Field label="Previous Board / Curriculum">
                        <select
                          className={selectClass}
                          value={form.previous_curriculum}
                          onChange={(e) => set('previous_curriculum', e.target.value)}
                        >
                          <option value="">Select Curriculum</option>
                          {CURRICULA.map((c) => (
                            <option key={c} value={c}>
                              {c}
                            </option>
                          ))}
                        </select>
                      </Field>

                      <Field label="Last Examination Result / GPA" hint="e.g. GPA 5.00, A*, 92%">
                        <input
                          type="text"
                          className={inputClass}
                          value={form.last_grade_result}
                          placeholder="e.g. GPA 5.00"
                          onChange={(e) => set('last_grade_result', e.target.value)}
                        />
                      </Field>

                      <Field label="Year of Last Examination">
                        <input
                          type="text"
                          className={inputClass}
                          value={form.last_grade_year}
                          placeholder="e.g. 2025"
                          onChange={(e) => set('last_grade_year', e.target.value)}
                        />
                      </Field>
                    </div>
                  </div>

                  {/* Co-curricular & Medical Notes */}
                  <div className="border-t border-slate-100 pt-5 space-y-4">
                    <Field
                      label="Extracurricular Talents & Interests"
                      hint="Sports, Debating, Robotics, Music, Art, Olympiads, Scouting..."
                    >
                      <textarea
                        rows={2}
                        className={inputClass}
                        value={form.extracurricular_interests}
                        placeholder="Mention any sports, clubs, musical instruments, or competitions the candidate enjoys..."
                        onChange={(e) => set('extracurricular_interests', e.target.value)}
                      />
                    </Field>

                    <Field
                      label="Special Medical or Learning Considerations"
                      hint="Allergies, chronic conditions, vision/hearing needs, or special learning requirements"
                    >
                      <textarea
                        rows={2}
                        className={inputClass}
                        value={form.special_needs_or_conditions}
                        placeholder="Please disclose any allergies, asthma, dietary restrictions or learning conditions the school medical team should know..."
                        onChange={(e) => set('special_needs_or_conditions', e.target.value)}
                      />
                    </Field>
                  </div>
                </div>
              </ScrollReveal>
            )}

            {/* ══════════════════════════════════════════════════════════════════
                STEP 3 · PARENT / GUARDIAN & CONTACT DETAILS
               ══════════════════════════════════════════════════════════════════ */}
            {step === 3 && (
              <ScrollReveal direction="up" distance={15} duration={400}>
                <div className="space-y-6">
                  {/* Father Details */}
                  <div className="bg-blue-50/40 border border-blue-100 rounded-2xl p-5 sm:p-6 space-y-4">
                    <h3 className="text-sm font-black text-[#00183F] uppercase tracking-wide flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-[#00183F]" /> 3. Father's Particulars & Contact
                      </span>
                      <span className="text-[10px] text-slate-500 font-bold">Physical Form #3 & #6</span>
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Field label="3. Father's Name" required>
                        <input
                          type="text"
                          className={inputClass}
                          value={form.father_name}
                          placeholder="e.g. Monjurur Rahman prince"
                          onChange={(e) => set('father_name', e.target.value)}
                        />
                      </Field>
                      <Field label="Occupation" required hint="e.g. Banking, Business, Service, Physician">
                        <input
                          type="text"
                          className={inputClass}
                          value={form.father_profession}
                          placeholder="e.g. Banking"
                          onChange={(e) => set('father_profession', e.target.value)}
                        />
                      </Field>
                      <Field
                        label="6. Contact Number (Father) (Optional)"
                        hint="Optional if same as primary contact or no separate phone"
                      >
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                          <input
                            type="tel"
                            className={inputClass + ' pl-9'}
                            value={form.father_phone}
                            placeholder="e.g. 01969284214 (Optional)"
                            onChange={(e) => set('father_phone', e.target.value)}
                          />
                        </div>
                      </Field>
                      <Field label="Organization / Employer (Optional)">
                        <input
                          type="text"
                          className={inputClass}
                          value={form.father_organization}
                          placeholder="e.g. Dutch-Bangla Bank, Private Firm..."
                          onChange={(e) => set('father_organization', e.target.value)}
                        />
                      </Field>
                      <div className="col-span-1 sm:col-span-2">
                        <Field
                          label="Office address & Tel No (Father)"
                          hint="Matches bottom box of physical form [Attach Business Card / Office Contact]"
                        >
                          <textarea
                            rows={2}
                            className={inputClass}
                            value={form.father_office_address || ''}
                            placeholder="e.g. Head Office, Motijheel C/A, Dhaka. Tel: +880 2-9568421"
                            onChange={(e) => set('father_office_address', e.target.value)}
                          />
                        </Field>
                      </div>
                    </div>
                  </div>

                  {/* Mother Details */}
                  <div className="bg-rose-50/40 border border-rose-100 rounded-2xl p-5 sm:p-6 space-y-4">
                    <h3 className="text-sm font-black text-[#00183F] uppercase tracking-wide flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-[#C8102E]" /> 4. Mother's Particulars & Contact
                      </span>
                      <span className="text-[10px] text-slate-500 font-bold">Physical Form #4 & #6</span>
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Field label="4. Mother's Name" required>
                        <input
                          type="text"
                          className={inputClass}
                          value={form.mother_name}
                          placeholder="e.g. Shamima Sultana"
                          onChange={(e) => set('mother_name', e.target.value)}
                        />
                      </Field>
                      <Field label="Occupation" required hint="e.g. Housewife, Teacher, Banker, Physician">
                        <input
                          type="text"
                          className={inputClass}
                          value={form.mother_profession}
                          placeholder="e.g. Housewife"
                          onChange={(e) => set('mother_profession', e.target.value)}
                        />
                      </Field>
                      <Field
                        label="6. Contact Number (Mother) (Optional)"
                        hint="Optional if same as primary contact or no separate phone"
                      >
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                          <input
                            type="tel"
                            className={inputClass + ' pl-9'}
                            value={form.mother_phone}
                            placeholder="e.g. 01782109162 (Optional)"
                            onChange={(e) => set('mother_phone', e.target.value)}
                          />
                        </div>
                      </Field>
                      <Field label="Organization / Employer (Optional)">
                        <input
                          type="text"
                          className={inputClass}
                          value={form.mother_organization}
                          placeholder="e.g. Institution / Organization Name..."
                          onChange={(e) => set('mother_organization', e.target.value)}
                        />
                      </Field>
                      <div className="col-span-1 sm:col-span-2">
                        <Field
                          label="Office address & Tel No (Mother)"
                          hint="Matches bottom box of physical form [Attach Business Card / Office Contact]"
                        >
                          <textarea
                            rows={2}
                            className={inputClass}
                            value={form.mother_office_address || ''}
                            placeholder="Office address & telephone number if employed (or leave blank if homemaker)..."
                            onChange={(e) => set('mother_office_address', e.target.value)}
                          />
                        </Field>
                      </div>
                    </div>
                  </div>

                  {/* Primary Guardian & Communication */}
                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 sm:p-6 space-y-4">
                    <h3 className="text-sm font-black text-[#00183F] uppercase tracking-wide flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-[#00183F]" /> Primary Guardian & Communication Details
                      </span>
                      <span className="text-[10px] text-slate-500 font-bold">Physical Form #6</span>
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <Field label="Primary Guardian" required>
                        <select
                          className={selectClass}
                          value={form.guardian_relation}
                          onChange={(e) =>
                            set('guardian_relation', e.target.value as 'father' | 'mother' | 'guardian' | 'other')
                          }
                        >
                          <option value="father">Father</option>
                          <option value="mother">Mother</option>
                          <option value="guardian">Legal Guardian</option>
                          <option value="other">Other Relative</option>
                        </select>
                      </Field>

                      <Field label="Primary Contact Phone" required hint="Will receive SMS updates & login credentials">
                        <div className="space-y-1.5">
                          {(form.father_phone?.trim() || form.mother_phone?.trim()) && (
                            <div className="flex flex-wrap items-center gap-1.5 text-[11px] pb-0.5">
                              <span className="text-slate-400 font-semibold">Quick Copy:</span>
                              {form.father_phone?.trim() && (
                                <button
                                  type="button"
                                  onClick={() => set('contact_phone', form.father_phone)}
                                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold border border-blue-200 transition-colors cursor-pointer"
                                  title="Copy Father's phone to Primary Contact"
                                >
                                  <span>⚡ Use Father's Phone</span>
                                </button>
                              )}
                              {form.mother_phone?.trim() && (
                                <button
                                  type="button"
                                  onClick={() => set('contact_phone', form.mother_phone)}
                                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold border border-rose-200 transition-colors cursor-pointer"
                                  title="Copy Mother's phone to Primary Contact"
                                >
                                  <span>⚡ Use Mother's Phone</span>
                                </button>
                              )}
                            </div>
                          )}
                          <div className="relative">
                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                              type="tel"
                              className={inputClass + ' pl-9'}
                              value={form.contact_phone}
                              placeholder="017XXXXXXXX (11 digits)"
                              onChange={(e) => set('contact_phone', e.target.value)}
                            />
                          </div>
                          {(() => {
                            const st = getBdPhoneStatus(form.contact_phone);
                            if (!st) return null;
                            return st.valid ? (
                              <p className="text-[11px] text-emerald-600 font-bold flex items-center gap-1">
                                <Check className="w-3.5 h-3.5" /> {st.text}
                              </p>
                            ) : (
                              <p className="text-[11px] text-amber-600 font-medium">
                                Format: {st.text} (BD mobile should be 11 digits e.g. 01712345678)
                              </p>
                            );
                          })()}
                        </div>
                      </Field>

                      <Field label="Primary Contact Email" required hint="Admit slip & offer letters sent here">
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                          <input
                            type="email"
                            className={inputClass + ' pl-9'}
                            value={form.contact_email}
                            placeholder="guardian@example.com"
                            onChange={(e) => set('contact_email', e.target.value)}
                          />
                        </div>
                      </Field>
                    </div>
                  </div>

                  {/* 5. Present Address - Cascading Bangladesh Administrative Hierarchy */}
                  <div className="bg-gradient-to-br from-slate-50 via-white to-sky-50/30 border border-slate-200 rounded-2xl p-5 sm:p-6 space-y-5 shadow-sm">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/80 pb-3">
                      <div>
                        <h3 className="text-sm font-black text-[#00183F] uppercase tracking-wide flex items-center gap-2">
                          <Home className="w-4 h-4 text-[#C8102E]" /> 5. Present Residential Address
                        </h3>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Cascading administrative selection: Division ➔ District ➔ Police Station (Thana) ➔ Street / House
                        </p>
                      </div>
                      <span className="self-start sm:self-center px-2.5 py-1 bg-[#00183F]/5 text-[#00183F] text-[10px] font-black uppercase rounded-lg tracking-wider border border-[#00183F]/10">
                        Physical Form Field #5
                      </span>
                    </div>

                    {/* Hierarchy Selectors: Division -> District -> Thana */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {/* Step A: Division */}
                      <Field label="1. Division" required hint="Select Administrative Division">
                        <div className="relative">
                          <select
                            className={selectClass + ' font-medium text-slate-800'}
                            value={selectedDivisionId}
                            onChange={(e) => handleDivisionChange(e.target.value)}
                          >
                            {BANGLADESH_DIVISIONS.map((div) => (
                              <option key={div.id} value={div.id}>
                                {div.name} Division
                              </option>
                            ))}
                          </select>
                        </div>
                      </Field>

                      {/* Step B: District */}
                      <Field label="2. District" required hint={`Filtered for ${activeDivision.name} (${activeDistrictList.length} districts)`}>
                        <div className="relative">
                          <select
                            className={selectClass + ' font-medium text-slate-800'}
                            value={selectedDistrictId}
                            onChange={(e) => handleDistrictChange(e.target.value)}
                          >
                            {activeDistrictList.map((dist) => (
                              <option key={dist.id} value={dist.id}>
                                {dist.name}
                              </option>
                            ))}
                          </select>
                        </div>
                      </Field>

                      {/* Step C: Police Station / Thana */}
                      <Field label="3. Police Station / Thana" required hint={`Filtered for ${activeDistrict.name} (${activeThanaList.length} thanas)`}>
                        <div className="relative">
                          <select
                            className={selectClass + ' font-medium text-slate-800'}
                            value={isCustomThana ? '__custom__' : selectedThana}
                            onChange={(e) => handleThanaChange(e.target.value)}
                          >
                            {activeThanaList.map((thana) => (
                              <option key={thana} value={thana}>
                                {thana}
                              </option>
                            ))}
                            <option value="__custom__">
                              ➕ Other / Custom Police Station...
                            </option>
                          </select>
                        </div>
                      </Field>
                    </div>

                    {/* Custom Thana input if selected */}
                    {isCustomThana && (
                      <div className="p-4 bg-amber-50/90 border border-amber-200 rounded-xl space-y-1 animate-in fade-in slide-in-from-top-1 duration-200">
                        <Field
                          label="Specify Police Station / Thana Name *"
                          hint="Type the official name of the Police Station (Thana / Upazila / Outpost)"
                        >
                          <input
                            type="text"
                            className={`${inputClass} bg-white font-medium text-slate-900 border-amber-300 focus:border-amber-500`}
                            value={customThanaText}
                            placeholder="e.g. Sutrapur / Narinda Police Box, Shyampur Outpost..."
                            onChange={(e) => handleCustomThanaTextChange(e.target.value)}
                            autoFocus
                          />
                        </Field>
                      </div>
                    )}

                    {/* Street Address & Postal Code */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="sm:col-span-2">
                        <Field
                          label="4. House / Flat / Holding No., Road / Lane, Area *"
                          required
                          hint="e.g. Holding #23, Road #4, Narinda or Flat 4B, 12 K.M. Das Lane, Tikatuli"
                        >
                          <div className="relative">
                            <input
                              type="text"
                              className={inputClass}
                              value={streetAddress}
                              placeholder="House / Holding No., Road / Lane, Moholla / Area..."
                              onChange={(e) => handleStreetAddressChange(e.target.value)}
                            />
                          </div>
                        </Field>
                      </div>

                      <div>
                        <Field label="Postal / ZIP Code" hint="Post Office code (e.g. 1100)">
                          <input
                            type="text"
                            className={inputClass}
                            value={postalCode}
                            placeholder="1100"
                            onChange={(e) => handlePostalCodeChange(e.target.value)}
                          />
                        </Field>
                      </div>
                    </div>

                    {/* Live Physical Form #5 Synthesis & Preview Box */}
                    <div className="rounded-xl border border-sky-200 bg-sky-50/60 p-4 space-y-2">
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-[#00183F]">
                          <MapPin className="w-3.5 h-3.5 text-[#C8102E]" />
                          <span>Physical Admission Form & Admit Card Line 5 Preview:</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            if (!manualAddressOverride) {
                              setManualAddressOverride(true);
                            } else {
                              setManualAddressOverride(false);
                              syncAddress(
                                streetAddress,
                                selectedThana,
                                isCustomThana,
                                customThanaText,
                                activeDistrict.name,
                                postalCode,
                                sameAsPresentAddress,
                                false
                              );
                            }
                          }}
                          className="text-[11px] font-bold text-[#00183F] hover:text-[#C8102E] underline underline-offset-2 flex items-center gap-1 cursor-pointer transition-colors"
                        >
                          {manualAddressOverride ? '↺ Reset to Auto-Generated' : '✏️ Fine-tune Final Text'}
                        </button>
                      </div>

                      {manualAddressOverride ? (
                        <div className="space-y-1">
                          <textarea
                            rows={2}
                            className={`${inputClass} bg-white text-xs font-medium`}
                            value={form.present_address}
                            onChange={(e) => {
                              const val = e.target.value;
                              set('present_address', val);
                              if (sameAsPresentAddress) {
                                set('permanent_address', val);
                              }
                            }}
                          />
                          <p className="text-[10px] text-amber-700 font-medium">
                            Manual edit mode enabled. This exact text will print directly on Field 5 of the physical form.
                          </p>
                        </div>
                      ) : (
                        <div className="bg-white rounded-lg px-3 py-2 border border-sky-100 shadow-inner">
                          <p className="text-xs font-mono font-medium text-slate-800 select-all">
                            <span className="font-bold text-[#00183F]">5. Present Address:</span>{' '}
                            {form.present_address ? (
                              <span>{form.present_address}</span>
                            ) : (
                              <span className="text-slate-400 italic">
                                [House / Road], {isCustomThana ? (customThanaText || 'Police Station') : (selectedThana.split('(')[0].trim())}, {activeDistrict.name} - {postalCode || '1100'}
                              </span>
                            )}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Permanent Address with 'Same as Present' convenience toggle */}
                    <div className="border-t border-slate-200/80 pt-4 space-y-3">
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="sameAsPresentAddress"
                          checked={sameAsPresentAddress}
                          onChange={(e) => handleSameAsPresentToggle(e.target.checked)}
                          className="w-4 h-4 rounded text-[#00183F] focus:ring-[#00183F] border-slate-300 cursor-pointer"
                        />
                        <label
                          htmlFor="sameAsPresentAddress"
                          className="text-xs font-bold text-slate-800 cursor-pointer select-none"
                        >
                          Permanent Address is identical to Present Address
                        </label>
                      </div>

                      {!sameAsPresentAddress && (
                        <div className="animate-in fade-in slide-in-from-top-1 duration-200">
                          <Field
                            label="Permanent Family Address *"
                            hint="Village / Holding, Post Office, Upazila / Thana, Home District"
                          >
                            <textarea
                              rows={2}
                              className={inputClass}
                              value={form.permanent_address}
                              placeholder="e.g. Village: Shantibag, Post: Sonargaon, Upazila: Sonargaon, District: Narayanganj"
                              onChange={(e) => set('permanent_address', e.target.value)}
                            />
                          </Field>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Emergency Contact */}
                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 sm:p-6 space-y-4">
                    <h3 className="text-sm font-black text-[#00183F] uppercase tracking-wide flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <Shield className="w-4 h-4 text-[#00183F]" /> Emergency Contact (Secondary)
                      </span>
                      <span className="text-[10px] text-slate-500 font-bold">Alternative Contact</span>
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <Field label="Emergency Contact Person">
                        <input
                          type="text"
                          className={inputClass}
                          value={form.emergency_contact_name}
                          placeholder="e.g. Uncle / Aunt Name"
                          onChange={(e) => set('emergency_contact_name', e.target.value)}
                        />
                      </Field>

                      <Field label="Emergency Contact Phone">
                        <input
                          type="tel"
                          className={inputClass}
                          value={form.emergency_contact_phone}
                          placeholder="+880 1XXX-XXXXXX"
                          onChange={(e) => set('emergency_contact_phone', e.target.value)}
                        />
                      </Field>

                      <Field label="Relation to Student">
                        <input
                          type="text"
                          className={inputClass}
                          value={form.emergency_contact_relation}
                          placeholder="e.g. Uncle, Grandparent"
                          onChange={(e) => set('emergency_contact_relation', e.target.value)}
                        />
                      </Field>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            )}

            {/* ══════════════════════════════════════════════════════════════════
                STEP 4 · DIGITAL DOCUMENTS & FINAL SUBMISSION
               ══════════════════════════════════════════════════════════════════ */}
            {step === 4 && (
              <ScrollReveal direction="up" distance={15} duration={400}>
                <div className="space-y-6">
                  {/* Digital Document Upload Center */}
                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 sm:p-6 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
                      <div>
                        <h3 className="text-sm font-black text-[#00183F] uppercase tracking-wide flex items-center gap-2">
                          <UploadCloud className="w-4 h-4 text-[#00183F]" /> Digital Document Upload Center
                        </h3>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Upload digital copies now for fast-track screening (PDF or Image, max 15MB each).
                        </p>
                      </div>
                      <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 self-start sm:self-auto">
                        {documents.length} Uploaded
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {[
                        {
                          type: 'birth_certificate',
                          title: 'Birth Registration Certificate',
                          desc: 'Official certified birth certificate',
                          required: true,
                        },
                        {
                          type: 'previous_report_card',
                          title: 'Last Academic Report Card',
                          desc: 'Latest grade transcript or report card',
                          required: false,
                        },
                        {
                          type: 'parent_nid',
                          title: "Father's or Mother's NID / Passport",
                          desc: 'Guardian national identity proof',
                          required: false,
                        },
                        {
                          type: 'immunization_record',
                          title: 'Immunization / Health Card',
                          desc: 'Vaccination chart or medical record',
                          required: false,
                        },
                      ].map((docItem) => {
                        const existing = documents.find((d) => d.doc_type === docItem.type);
                        const isUploading = uploadingDocKey === docItem.type;

                        return (
                          <div
                            key={docItem.type}
                            className={`p-4 rounded-xl border transition-all ${
                              existing
                                ? 'bg-emerald-50/70 border-emerald-200'
                                : 'bg-white border-slate-200 hover:border-slate-300'
                            }`}
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div className="min-w-0">
                                <span className="text-xs font-bold text-slate-800 block">
                                  {docItem.title} {docItem.required && <span className="text-rose-600">*</span>}
                                </span>
                                <span className="text-[10px] text-slate-500 block truncate">{docItem.desc}</span>
                              </div>
                              {existing ? (
                                <span className="p-1 rounded-full bg-emerald-100 text-emerald-700">
                                  <CheckCircle2 className="w-4 h-4" />
                                </span>
                              ) : (
                                <span className="text-[10px] font-semibold text-slate-400">
                                  {docItem.required ? 'Recommended' : 'Optional'}
                                </span>
                              )}
                            </div>

                            <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                              {existing ? (
                                <>
                                  <div className="flex items-center gap-1.5 min-w-0">
                                    <FileText className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                                    <span className="text-xs font-semibold text-slate-700 truncate max-w-[130px]">
                                      {existing.original_filename}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-2 shrink-0">
                                    <a
                                      href={existing.file_url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-[11px] font-bold text-[#00183F] hover:underline flex items-center gap-0.5"
                                    >
                                      <ExternalLink className="w-3 h-3" /> View
                                    </a>
                                    <button
                                      type="button"
                                      onClick={() => removeDoc(docItem.type)}
                                      className="text-slate-400 hover:text-rose-600 cursor-pointer"
                                      title="Remove"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                </>
                              ) : (
                                <label className="w-full">
                                  <input
                                    type="file"
                                    accept=".pdf, image/png, image/jpeg, image/jpg"
                                    className="hidden"
                                    onChange={(e) => {
                                      const file = e.target.files?.[0];
                                      if (file) handleDocUpload(docItem.type, docItem.title, file);
                                    }}
                                  />
                                  <span
                                    className={`w-full py-2 px-3 rounded-lg border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors flex items-center justify-center gap-1.5 cursor-pointer ${
                                      isUploading ? 'opacity-50 pointer-events-none' : ''
                                    }`}
                                  >
                                    {isUploading ? (
                                      <>
                                        <Loader2 className="w-3.5 h-3.5 animate-spin text-[#00183F]" />
                                        <span>Uploading...</span>
                                      </>
                                    ) : (
                                      <>
                                        <UploadCloud className="w-3.5 h-3.5 text-slate-500" />
                                        <span>Upload File</span>
                                      </>
                                    )}
                                  </span>
                                </label>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Sibling & Survey */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="space-y-3">
                      <label className="flex items-center gap-3 cursor-pointer p-3.5 rounded-xl border border-slate-200 hover:border-[#00183F]/30 transition-colors bg-white">
                        <input
                          type="checkbox"
                          checked={form.sibling_at_sjis}
                          onChange={(e) => set('sibling_at_sjis', e.target.checked)}
                          className="w-4 h-4 rounded accent-[#00183F] cursor-pointer"
                        />
                        <div>
                          <div className="text-xs font-bold text-slate-800">
                            11. Sibling studying in this school?
                          </div>
                          <div className="text-[11px] text-slate-500">
                            If any brother or sister is currently enrolled at St. Joseph Narinda
                          </div>
                        </div>
                      </label>
                      {form.sibling_at_sjis && (
                        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                          <p className="text-[11px] font-bold text-slate-700 uppercase tracking-wide">
                            11. Sibling School Information (Matches Physical Form)
                          </p>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                              <label className="text-[10px] font-bold text-slate-600 block mb-1">Sibling Name</label>
                              <input
                                type="text"
                                className={inputClass}
                                value={form.sibling_name || ''}
                                placeholder="Sibling full name"
                                onChange={(e) => {
                                  const val = e.target.value;
                                  set('sibling_name', val);
                                  set('sibling_name_class', `${val} (Class: ${form.sibling_class || ''}, Sec: ${form.sibling_section || ''}, Roll: ${form.sibling_roll || ''})`);
                                }}
                              />
                            </div>
                            <div>
                              <label className="text-[10px] font-bold text-slate-600 block mb-1">Class / Grade</label>
                              <input
                                type="text"
                                className={inputClass}
                                value={form.sibling_class || ''}
                                placeholder="e.g. Grade 4"
                                onChange={(e) => {
                                  const val = e.target.value;
                                  set('sibling_class', val);
                                  set('sibling_name_class', `${form.sibling_name || ''} (Class: ${val}, Sec: ${form.sibling_section || ''}, Roll: ${form.sibling_roll || ''})`);
                                }}
                              />
                            </div>
                            <div>
                              <label className="text-[10px] font-bold text-slate-600 block mb-1">Section</label>
                              <input
                                type="text"
                                className={inputClass}
                                value={form.sibling_section || ''}
                                placeholder="e.g. A / Lily"
                                onChange={(e) => {
                                  const val = e.target.value;
                                  set('sibling_section', val);
                                  set('sibling_name_class', `${form.sibling_name || ''} (Class: ${form.sibling_class || ''}, Sec: ${val}, Roll: ${form.sibling_roll || ''})`);
                                }}
                              />
                            </div>
                            <div>
                              <label className="text-[10px] font-bold text-slate-600 block mb-1">Roll / ID</label>
                              <input
                                type="text"
                                className={inputClass}
                                value={form.sibling_roll || ''}
                                placeholder="e.g. 14"
                                onChange={(e) => {
                                  const val = e.target.value;
                                  set('sibling_roll', val);
                                  set('sibling_name_class', `${form.sibling_name || ''} (Class: ${form.sibling_class || ''}, Sec: ${form.sibling_section || ''}, Roll: ${val})`);
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    <Field label="How Did You Hear About SJIS?">
                      <select
                        className={selectClass}
                        value={form.how_did_you_hear}
                        onChange={(e) => set('how_did_you_hear', e.target.value)}
                      >
                        <option value="">Select an option</option>
                        {HOW_HEARD.map((h) => (
                          <option key={h} value={h}>
                            {h}
                          </option>
                        ))}
                      </select>
                    </Field>
                  </div>

                  <Field label="Additional Inquiries / Special Notes">
                    <textarea
                      rows={2}
                      className={inputClass}
                      value={form.additional_notes}
                      placeholder="Any specific questions regarding curriculum, school transport routes, or co-curricular programs..."
                      onChange={(e) => set('additional_notes', e.target.value)}
                    />
                  </Field>

                  {/* Physical Documents to Bring on Exam Day */}
                  <div className="bg-amber-50/80 border border-amber-200 rounded-2xl p-5 text-xs text-amber-900 space-y-2">
                    <h4 className="font-bold uppercase tracking-wider flex items-center gap-1.5 text-amber-950">
                      <Calendar className="w-4 h-4 text-amber-700" /> Documents to Bring on Entrance Examination Day
                    </h4>
                    <p className="text-amber-800 text-[11px]">
                      Please present the following documents at the admissions desk on the scheduled test day:
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                      <div className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                        <span>Printed Candidate Admit Card (from this portal)</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                        <span>Original & photocopy of Birth Registration Certificate</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                        <span>Previous school report card / transcript (for Grade 1+)</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                        <span>2 recent passport-size photographs of candidate</span>
                      </div>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            )}

            {/* ══════════════════════════════════════════════════════════════════
                STEP 5 · COMPREHENSIVE REVIEW & AUTHENTIC DECLARATION
               ══════════════════════════════════════════════════════════════════ */}
            {step === 5 && (
              <ScrollReveal direction="up" distance={15} duration={400}>
                <div className="space-y-6">
                  {/* Review Notice Banner */}
                  <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                      <div>
                        <h3 className="text-xs sm:text-sm font-bold text-amber-950">
                          Please Carefully Review All Information Before Submitting
                        </h3>
                        <p className="text-[11px] sm:text-xs text-amber-800 mt-1 leading-relaxed">
                          Verify that all student details, grade applied, parent contact numbers, and uploaded documents are correct. You can click <strong>Edit</strong> on any section to make changes.
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowPrintModal(true)}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-amber-300 text-amber-900 font-bold text-xs hover:bg-amber-100 transition-colors shadow-sm shrink-0 cursor-pointer self-start sm:self-auto"
                    >
                      <Printer className="w-3.5 h-3.5 text-amber-700" />
                      <span>Print / PDF Preview</span>
                    </button>
                  </div>

                  {/* Candidate Quick Profile Card */}
                  <div className="bg-gradient-to-br from-[#00183F] to-[#0A2558] text-white rounded-2xl p-5 sm:p-6 shadow-md flex flex-col sm:flex-row items-center sm:items-start gap-5">
                    <div className="w-24 h-28 rounded-xl overflow-hidden bg-white/10 border-2 border-[#D4AF37] shrink-0 shadow flex items-center justify-center">
                      {form.student_photo_url ? (
                        <img
                          src={form.student_photo_url}
                          alt="Candidate"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <User className="w-10 h-10 text-white/40" />
                      )}
                    </div>
                    <div className="flex-1 text-center sm:text-left space-y-1">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#D4AF37] text-[#00183F] uppercase tracking-wider">
                            Candidate Profile
                          </span>
                          <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                            {form.academic_year} Session
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => { setStep(1); scrollTop(); }}
                          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/15 hover:bg-white/25 text-[#D4AF37] hover:text-white font-bold text-xs border border-white/20 transition-all cursor-pointer"
                        >
                          <Edit3 className="w-3.5 h-3.5" /> Edit Profile & Photo
                        </button>
                      </div>
                      <h3 className="text-xl sm:text-2xl font-black text-white">
                        {form.student_first_name} {form.student_last_name}
                      </h3>
                      <div className="pt-2 flex flex-wrap items-center justify-center sm:justify-start gap-x-4 gap-y-1 text-xs text-slate-300">
                        <span><strong>Applying For:</strong> <span className="text-[#D4AF37] font-bold">{form.grade_applying}</span></span>
                        <span>•</span>
                        <span><strong>Curriculum:</strong> Cambridge CAIE (English Medium)</span>
                        <span>•</span>
                        <span><strong>Gender:</strong> {form.gender}</span>
                      </div>
                    </div>
                  </div>

                  {/* Section 1: Student Personal Details */}
                  <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-3">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                      <h4 className="text-xs font-black text-[#00183F] uppercase tracking-wider flex items-center gap-2">
                        <User className="w-4 h-4 text-[#00183F]" /> 1. Student Particulars
                      </h4>
                      <button
                        type="button"
                        onClick={() => { setStep(1); scrollTop(); }}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#00183F]/5 hover:bg-[#00183F] text-[#00183F] hover:text-white font-bold text-xs border border-[#00183F]/15 transition-all cursor-pointer shadow-2xs"
                        title="Jump back to modify Candidate Particulars"
                      >
                        <Edit3 className="w-3.5 h-3.5" /> Edit Step 1
                      </button>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                      <div>
                        <span className="text-[10px] text-slate-400 block font-semibold">Date of Birth</span>
                        <span className="font-bold text-slate-800">{form.date_of_birth || '—'}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block font-semibold">Gender</span>
                        <span className="font-bold text-slate-800">{form.gender}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block font-semibold">Blood Group</span>
                        <span className="font-bold text-slate-800">{form.blood_group || '—'}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block font-semibold">Religion</span>
                        <span className="font-bold text-slate-800">{form.religion || '—'}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block font-semibold">Nationality</span>
                        <span className="font-bold text-slate-800">{form.nationality}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block font-semibold">Birth Certificate No</span>
                        <span className="font-bold text-slate-800 font-mono">{form.birth_certificate_no || '—'}</span>
                      </div>
                      <div className="col-span-2">
                        <span className="text-[10px] text-slate-400 block font-semibold">Passport Number</span>
                        <span className="font-bold text-slate-800 font-mono">{form.passport_no || 'N/A'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Section 2: Academic Background */}
                  <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-3">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                      <h4 className="text-xs font-black text-[#00183F] uppercase tracking-wider flex items-center gap-2">
                        <GraduationCap className="w-4 h-4 text-[#00183F]" /> 2. Academic Background
                      </h4>
                      <button
                        type="button"
                        onClick={() => { setStep(2); scrollTop(); }}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#00183F]/5 hover:bg-[#00183F] text-[#00183F] hover:text-white font-bold text-xs border border-[#00183F]/15 transition-all cursor-pointer shadow-2xs"
                        title="Jump back to modify Academic Background & Grade"
                      >
                        <Edit3 className="w-3.5 h-3.5" /> Edit Step 2
                      </button>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                      <div>
                        <span className="text-[10px] text-slate-400 block font-semibold">Grade Applying</span>
                        <span className="font-bold text-[#C8102E]">{form.grade_applying}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block font-semibold">Curriculum</span>
                        <span className="font-bold text-emerald-700">Cambridge CAIE</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block font-semibold">Academic Session</span>
                        <span className="font-bold text-slate-800">{form.academic_year}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block font-semibold">Previous Curriculum</span>
                        <span className="font-bold text-slate-800">{form.previous_curriculum || 'None / Fresh Admission'}</span>
                      </div>
                      <div className="col-span-2 sm:col-span-4">
                        <span className="text-[10px] text-slate-400 block font-semibold">Previous School Name</span>
                        <span className="font-bold text-slate-800">{form.previous_school_name || 'N/A'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Section 3: Parent & Contact Details */}
                  <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-3">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                      <h4 className="text-xs font-black text-[#00183F] uppercase tracking-wider flex items-center gap-2">
                        <Users className="w-4 h-4 text-[#00183F]" /> 3. Parent / Guardian Particulars
                      </h4>
                      <button
                        type="button"
                        onClick={() => { setStep(3); scrollTop(); }}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#00183F]/5 hover:bg-[#00183F] text-[#00183F] hover:text-white font-bold text-xs border border-[#00183F]/15 transition-all cursor-pointer shadow-2xs"
                        title="Jump back to modify Parent Details & Address"
                      >
                        <Edit3 className="w-3.5 h-3.5" /> Edit Step 3
                      </button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                      <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Father's Information</span>
                        <div className="font-bold text-slate-800">{form.father_name || '—'}</div>
                        <div className="text-slate-600">Mobile: {form.father_phone || '—'}</div>
                        <div className="text-slate-500 text-[11px]">Profession: {form.father_profession || '—'}</div>
                      </div>
                      <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Mother's Information</span>
                        <div className="font-bold text-slate-800">{form.mother_name || '—'}</div>
                        <div className="text-slate-600">Mobile: {form.mother_phone || '—'}</div>
                        <div className="text-slate-500 text-[11px]">Profession: {form.mother_profession || '—'}</div>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-1">
                      <div>
                        <span className="text-[10px] text-slate-400 block font-semibold">Primary Contact Phone</span>
                        <span className="font-bold text-[#00183F]">{form.contact_phone}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block font-semibold">Primary Email</span>
                        <span className="font-bold text-[#00183F] truncate block">{form.contact_email}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block font-semibold">Emergency Contact</span>
                        <span className="font-bold text-slate-800">{form.emergency_contact_phone || '—'}</span>
                      </div>
                      <div className="col-span-1 sm:col-span-3">
                        <span className="text-[10px] text-slate-400 block font-semibold">Present Residential Address</span>
                        <span className="text-slate-700">{form.present_address}</span>
                      </div>
                    </div>
                  </div>

                  {/* Section 4: Attached Documents */}
                  <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-3">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                      <h4 className="text-xs font-black text-[#00183F] uppercase tracking-wider flex items-center gap-2">
                        <UploadCloud className="w-4 h-4 text-[#00183F]" /> 4. Uploaded Digital Documents ({documents.length})
                      </h4>
                      <button
                        type="button"
                        onClick={() => { setStep(4); scrollTop(); }}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#00183F]/5 hover:bg-[#00183F] text-[#00183F] hover:text-white font-bold text-xs border border-[#00183F]/15 transition-all cursor-pointer shadow-2xs"
                        title="Jump back to modify Uploaded Documents"
                      >
                        <Edit3 className="w-3.5 h-3.5" /> Edit Step 4
                      </button>
                    </div>
                    {documents.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {documents.map((doc, idx) => (
                          <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2 min-w-0">
                              <FileText className="w-4 h-4 text-emerald-600 shrink-0" />
                              <div className="min-w-0">
                                <span className="text-xs font-bold text-slate-800 block truncate">
                                  {doc.original_filename || doc.doc_type}
                                </span>
                                <span className="text-[10px] text-slate-400 capitalize">{doc.doc_type.replace('_', ' ')} • {doc.file_size}</span>
                              </div>
                            </div>
                            <a
                              href={doc.file_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[11px] font-bold text-[#00183F] hover:underline flex items-center gap-1 shrink-0"
                            >
                              <ExternalLink className="w-3 h-3" /> View
                            </a>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-slate-400 italic">No optional documents uploaded. Physical documents must be presented on exam day.</p>
                    )}
                  </div>

                  {/* ── Official Legal Consent & Authenticity Undertaking ────── */}
                  <div className="bg-gradient-to-br from-slate-900 to-[#00183F] text-white rounded-3xl p-6 sm:p-8 shadow-xl space-y-4 border border-amber-400/30">
                    <div className="flex items-center gap-3 border-b border-white/10 pb-4">
                      <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/20 border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37] shrink-0">
                        <Shield className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-base sm:text-lg font-black text-[#D4AF37] tracking-tight">
                          Parent / Guardian Authenticity Undertaking & Consent
                        </h4>
                        <p className="text-xs text-slate-300">
                          Mandatory legal declaration for official school admission records
                        </p>
                      </div>
                    </div>

                    <div className="bg-white/5 border border-white/10 rounded-2xl p-4 sm:p-5 text-xs text-slate-200 leading-relaxed space-y-3">
                      <div className="p-3 rounded-xl bg-amber-400/10 border border-amber-400/30 text-amber-200 font-bold text-xs">
                        The candidate must submit this form on: <span className="text-[#D4AF37] font-black">{form.submission_deadline || '28.06.2026'}</span>
                      </div>
                      <p className="font-semibold text-white italic text-xs sm:text-sm border-l-2 border-[#D4AF37] pl-3 py-1">
                        "I hereby declare that all of the above information is correct and authentic. I will not request for any change of these information in future."
                      </p>
                      <ul className="list-disc pl-5 space-y-1 text-slate-300 text-[11px]">
                        <li>All candidate and parental details match official Church / Government records.</li>
                        <li>Willful concealment or misrepresentation will result in immediate cancellation.</li>
                        <li>Candidate will abide by St. Joseph International School (Narinda Campus) code of conduct.</li>
                      </ul>
                    </div>

                    {/* Affirmative Checkbox */}
                    <label className="flex items-start gap-3.5 cursor-pointer p-4 rounded-2xl bg-white/10 hover:bg-white/15 border-2 border-[#D4AF37]/40 hover:border-[#D4AF37] transition-all">
                      <input
                        type="checkbox"
                        checked={form.parent_declaration_accepted}
                        onChange={(e) => set('parent_declaration_accepted', e.target.checked)}
                        className="w-5 h-5 mt-0.5 rounded accent-[#D4AF37] cursor-pointer shrink-0"
                      />
                      <div className="space-y-0.5">
                        <span className="text-xs sm:text-sm font-black text-[#D4AF37] block">
                          I hereby declare that all of the above information is correct and authentic. I will not request for any change of these information in future. *
                        </span>
                        <span className="text-[11px] text-slate-300 block">
                          By checking this box, I electronically sign this admission application on behalf of the applicant family.
                        </span>
                      </div>
                    </label>

                    {/* Digital Signature Details */}
                    <div className="pt-2 flex flex-wrap items-center justify-between gap-3 text-[11px] text-slate-400 border-t border-white/10">
                      <span>
                        <strong>Signatory:</strong> {form.father_name || form.mother_name || 'Parent / Legal Guardian'}
                      </span>
                      <span>
                        <strong>Declaration Date:</strong> {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                      </span>
                      <span className="text-emerald-400 font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Ready for Verification
                      </span>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            )}

            {/* Step Navigation Actions */}
            <div className="mt-8 pt-6 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={prev}
                  disabled={step === 1}
                  className="inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs sm:text-sm font-semibold hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" /> Previous
                </button>

                <button
                  type="button"
                  onClick={saveDraftManually}
                  className="inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-2.5 rounded-xl border border-amber-300 bg-amber-50/80 hover:bg-amber-100 text-amber-950 text-xs sm:text-sm font-bold transition-all shadow-xs cursor-pointer active:scale-98"
                  title="Save current progress and safely resume later"
                >
                  <BookmarkCheck className="w-4 h-4 text-amber-700 shrink-0" />
                  <span>Save & Continue Later</span>
                </button>
              </div>

              <div className="hidden sm:flex items-center gap-1.5">
                {STEPS.map((s) => (
                  <div
                    key={s.id}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      step === s.id
                        ? 'bg-[#00183F] w-5'
                        : step > s.id
                        ? 'bg-emerald-400 w-2'
                        : 'bg-slate-200 w-2'
                    }`}
                  />
                ))}
              </div>

              {step < STEPS.length ? (
                <button
                  type="button"
                  onClick={next}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#00183F] text-white text-xs sm:text-sm font-bold hover:bg-[#002257] active:scale-[0.98] transition-all shadow-md cursor-pointer"
                >
                  <span>{step === STEPS.length - 1 ? 'Proceed to Review' : 'Continue'}</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="inline-flex items-center gap-2 px-7 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white text-xs sm:text-sm font-bold shadow-lg shadow-emerald-700/25 active:scale-[0.98] transition-all disabled:opacity-50 cursor-pointer"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-white" />
                      <span>Submitting Application...</span>
                    </>
                  ) : admSettings?.payment_required ? (
                    <>
                      <CreditCard className="w-4 h-4 text-emerald-200" />
                      <span>Confirm & Proceed to Payment ({admSettings.payment_currency || 'BDT'} {admSettings.application_fee || '1,000'})</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-200" />
                      <span>Confirm & Submit Application</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Support Help Desk Footer */}
        <div className="mt-8 text-center text-xs text-slate-500 space-y-1">
          <p>
            Need assistance with your online application? Admissions Helpdesk:{' '}
            <a href="tel:+8801746866393" className="font-bold text-[#00183F] hover:underline">
              +880 1746-866393
            </a>{' '}
            •{' '}
            <a href="mailto:sjisnarinda2021@gmail.com" className="font-bold text-[#00183F] hover:underline">
              sjisnarinda2021@gmail.com
            </a>
          </p>
          <p className="text-[11px] text-slate-400">
            Office Hours: Sunday – Thursday · 7:30 AM – 4:30 PM • 32 Shah Shaheb Lane, Narinda, Dhaka-1100
          </p>
        </div>
      </div>
    </div>

      {/* Draft Safely Saved Confirmation Modal */}
      {showSaveModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="bg-gradient-to-r from-[#00183F] via-[#002855] to-[#00183F] text-white p-6 text-center relative">
              <div className="w-14 h-14 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center mx-auto mb-3 shadow-inner">
                <BookmarkCheck className="w-7 h-7 text-emerald-300" />
              </div>
              <h3 className="text-lg font-bold">Progress Safely Saved!</h3>
              <p className="text-xs text-slate-300 mt-1">
                Your admission application draft is safely preserved.
              </p>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-4 text-slate-700 text-sm max-h-[80vh] overflow-y-auto">
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 space-y-2.5 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Candidate:</span>
                  <span className="font-bold text-[#00183F]">
                    {form.student_first_name
                      ? `${form.student_first_name} ${form.student_last_name}`.trim()
                      : 'Candidate Application Draft'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Grade Applying:</span>
                  <span className="font-semibold text-slate-800">{form.grade_applying || 'Not yet selected'}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Saved Step:</span>
                  <span className="font-semibold text-slate-800">
                    Step {step} of {STEPS.length} ({STEPS[step - 1]?.title})
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Saved Time:</span>
                  <span className="font-bold text-emerald-700">{lastSavedAt || 'Just now'}</span>
                </div>
              </div>

              {/* Cross-device Resume Code Box */}
              {cloudDraftKey ? (
                <div className="bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-300/80 rounded-2xl p-4 text-xs space-y-2.5 shadow-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-amber-900 uppercase tracking-wider text-[10px] flex items-center gap-1.5">
                      <Smartphone className="w-3.5 h-3.5 text-amber-700" /> Resume from Any Device
                    </span>
                    <span className="text-[10px] text-amber-700 bg-amber-200/60 font-semibold px-2 py-0.5 rounded-full">
                      Valid for 30 days
                    </span>
                  </div>

                  <div className="flex items-center justify-between bg-white rounded-xl p-3 border border-amber-200">
                    <div>
                      <div className="text-[10px] text-slate-400 uppercase font-semibold">Your Draft Code</div>
                      <div className="font-mono text-2xl font-black text-[#00183F] tracking-widest">
                        {cloudDraftKey}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        if (cloudDraftKey) {
                          navigator.clipboard.writeText(cloudDraftKey);
                          setCopiedDraftKey(true);
                          setTimeout(() => setCopiedDraftKey(false), 2000);
                        }
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-950 font-bold text-xs transition-colors cursor-pointer"
                    >
                      {copiedDraftKey ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="text-emerald-700">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 text-amber-800" />
                          <span>Copy Code</span>
                        </>
                      )}
                    </button>
                  </div>

                  {cloudDraftPhone && (
                    <p className="text-[11px] text-amber-900">
                      Linked to Mobile: <strong className="font-bold">{cloudDraftPhone}</strong>
                    </p>
                  )}

                  <p className="text-[11px] text-amber-800/90 leading-relaxed">
                    You can switch to another phone, tablet, or laptop anytime. Just visit the admissions page and enter your <strong>Mobile Number</strong> and <strong>Draft Code</strong> to continue right where you left off.
                  </p>
                </div>
              ) : (
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs space-y-2.5">
                  <p className="font-bold text-slate-700 flex items-center gap-1.5">
                    <Cloud className="w-4 h-4 text-slate-600" /> Want to resume on another phone or computer?
                  </p>
                  <p className="text-slate-500 text-[11px]">
                    Enter any mobile number (Father, Mother, or Guardian) to get a 6-digit Resume Code that lets you continue from any device:
                  </p>
                  <div className="space-y-1">
                    <div className="flex gap-2">
                      <input
                        type="tel"
                        value={cloudPhoneInput}
                        onChange={(e) => setCloudPhoneInput(e.target.value)}
                        placeholder="Mobile No (e.g. 01712345678)"
                        className="flex-1 px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-[#00183F] outline-none"
                      />
                      <button
                        type="button"
                        disabled={isSavingCloud || !cloudPhoneInput.trim()}
                        onClick={() => performCloudSave(cloudPhoneInput)}
                        className="px-3.5 py-2 rounded-xl bg-[#00183F] hover:bg-[#002855] text-white text-xs font-bold disabled:opacity-50 transition-colors cursor-pointer shrink-0 inline-flex items-center gap-1.5"
                      >
                        {isSavingCloud && <Loader2 className="w-3 h-3 animate-spin" />}
                        <span>Get Code</span>
                      </button>
                    </div>
                    {(() => {
                      const st = getBdPhoneStatus(cloudPhoneInput);
                      if (!st) return null;
                      return st.valid ? (
                        <p className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
                          <Check className="w-3 h-3" /> {st.text}
                        </p>
                      ) : (
                        <p className="text-[10px] text-amber-600 font-medium">
                          {st.text}
                        </p>
                      );
                    })()}
                  </div>
                </div>
              )}

              <div className="flex items-start gap-2.5 text-xs text-slate-600 bg-emerald-50 p-3 rounded-xl border border-emerald-200/70">
                <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  All your filled data, photo, and uploaded documents are safely preserved on this device.
                </span>
              </div>

              <div className="pt-2 flex flex-col gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowSaveModal(false)}
                  className="w-full py-3 rounded-xl bg-[#00183F] hover:bg-[#002855] text-white font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>Continue Editing Application</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
                <a
                  href="/"
                  className="w-full py-2.5 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 font-semibold text-xs sm:text-sm text-center transition-colors cursor-pointer"
                >
                  Exit to SJIS Homepage
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Resume Saved Application Modal */}
      {showResumeModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="bg-gradient-to-r from-[#00183F] via-[#002855] to-[#00183F] text-white p-6 text-center relative">
              <button
                type="button"
                onClick={() => setShowResumeModal(false)}
                className="absolute top-4 right-4 text-white/70 hover:text-white text-lg cursor-pointer"
              >
                ✕
              </button>
              <div className="w-14 h-14 rounded-full bg-amber-400/20 border-2 border-amber-300 flex items-center justify-center mx-auto mb-3 shadow-inner">
                <KeyRound className="w-7 h-7 text-[#D4AF37]" />
              </div>
              <h3 className="text-lg font-bold">Resume Saved Application</h3>
              <p className="text-xs text-slate-300 mt-1">
                Enter your mobile number and Draft Code to continue right where you left off.
              </p>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleResumeSubmit} className="p-6 space-y-4">
              {resumeError && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                  <span>{resumeError}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Mobile Number (Parent / Guardian) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    required
                    value={resumePhone}
                    onChange={(e) => setResumePhone(e.target.value)}
                    placeholder="e.g. 01712345678"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm focus:ring-2 focus:ring-[#00183F] outline-none"
                  />
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Enter the mobile number (Father, Mother, or Guardian) used when saving your application.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Draft Code <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    maxLength={8}
                    value={resumeCode}
                    onChange={(e) => setResumeCode(e.target.value.toUpperCase())}
                    placeholder="e.g. SJ4829"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 font-mono font-bold tracking-wider text-xs sm:text-sm uppercase focus:ring-2 focus:ring-[#00183F] outline-none"
                  />
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  The 6-character code (e.g. SJ4729) provided when you clicked "Save & Continue Later".
                </p>
              </div>

              <div className="pt-2 flex flex-col gap-2.5">
                <button
                  type="submit"
                  disabled={resumeLoading}
                  className="w-full py-3 rounded-xl bg-[#00183F] hover:bg-[#002855] text-white font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {resumeLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Retrieving Application...</span>
                    </>
                  ) : (
                    <>
                      <span>Find & Continue Application</span>
                      <ChevronRight className="w-4 h-4" />
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setShowResumeModal(false)}
                  className="w-full py-2.5 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 font-semibold text-xs sm:text-sm text-center transition-colors cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Print & PDF Interactive Modal (When Viewing on Screen) */}
      {showPrintModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/85 backdrop-blur-sm overflow-y-auto p-3 sm:p-6 flex flex-col items-center print-modal-backdrop print:static print:inset-auto print:z-auto print:bg-transparent print:p-0 print:m-0 print:overflow-visible print:block print:w-full">
          {/* Top Control Bar */}
          <div className="print:hidden sticky top-2 z-10 w-full max-w-[210mm] bg-[#00183F] text-white rounded-2xl p-4 shadow-2xl flex flex-wrap items-center justify-between gap-3 border border-amber-400/30 mb-4">
            <div className="flex items-center gap-3">
              <Printer className="w-5 h-5 text-[#D4AF37] shrink-0" />
              <div>
                <h3 className="text-sm font-bold text-white">Official Application Print & PDF Generator</h3>
                <p className="text-[11px] text-slate-300">
                  To download as PDF, choose <strong>"Save as PDF"</strong> in your print destination.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => printDocumentElement('physical-admission-document')}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#D4AF37] hover:bg-[#c59f2e] text-[#00183F] font-black text-xs sm:text-sm shadow-md transition-all cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Print / Save as PDF</span>
              </button>
              <button
                type="button"
                onClick={() => setShowPrintModal(false)}
                className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs sm:text-sm transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>

          {/* A4 Sheet Container */}
          <div className="w-full max-w-[210mm] bg-white rounded-xl shadow-2xl overflow-hidden border border-slate-300 mb-8 print:max-w-none print:w-full print:border-none print:shadow-none print:m-0 print:p-0 print:rounded-none">
            <PrintableApplicationForm
              form={form}
              applicationId={result?.application_id}
              documents={documents}
            />
          </div>
        </div>
      )}
    </>
  );
}
