'use client';

import React, { useState, useRef } from 'react';
import {
  User, GraduationCap, Users, FileCheck2, ChevronRight, ChevronLeft,
  CheckCircle2, AlertCircle, Loader2, ArrowRight, Shield,
  BookOpen, Home, Phone, Mail,
} from 'lucide-react';
import { submitOnlineApplication } from '@/lib/api';
import type { OnlineApplicationFormData } from '@/lib/types';
import { ScrollReveal } from '@/components/ui/ScrollReveal';

const STEPS = [
  { id: 1, title: 'Student Information', icon: User, description: 'Personal details of the applicant' },
  { id: 2, title: 'Academic Background', icon: GraduationCap, description: 'Previous schooling & grade applying' },
  { id: 3, title: 'Parent / Guardian', icon: Users, description: 'Family & contact information' },
  { id: 4, title: 'Review & Submit', icon: FileCheck2, description: 'Declaration and final submission' },
];

const GRADES = [
  'Playgroup (Age 3.5+)', 'Nursery (Age 4.5+)', 'Kindergarten (Age 5.5+)',
  'Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5',
  'Grade 6 (Junior)', 'Grade 7', 'Grade 8',
  'Grade 9 (Cambridge IGCSE)', 'Grade 11 (Cambridge A-Level)',
];

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'Unknown'];
const CURRICULA = ['Cambridge International (CAIE)', 'National Curriculum (NCTB)', 'IB (International Baccalaureate)', 'Edexcel / Pearson', 'Other'];
const HOW_HEARD = ['Facebook / Social Media', 'Friend / Family Referral', 'School Alumni', 'Newspaper / Magazine', 'Google Search', 'Walk-in / Signage', 'Other'];
const DISTRICTS = ['Dhaka', 'Chittagong', 'Sylhet', 'Rajshahi', 'Khulna', 'Barishal', 'Mymensingh', 'Rangpur', 'Cumilla', 'Narayanganj', 'Gazipur', 'Other'];

const INITIAL_FORM: OnlineApplicationFormData = {
  student_first_name: '', student_last_name: '', student_name_bangla: '',
  date_of_birth: '', gender: 'male', religion: '', blood_group: 'Unknown',
  nationality: 'Bangladeshi', birth_certificate_no: '', passport_no: '',
  student_photo_url: '',
  grade_applying: 'Grade 1', section_preference: 'English Medium',
  previous_school_name: '', previous_school_city: '', previous_school_board: '',
  last_grade_result: '', last_grade_year: '', previous_curriculum: 'Cambridge International (CAIE)',
  extracurricular_interests: '', special_needs_or_conditions: '',
  father_name: '', father_profession: '', father_organization: '',
  father_qualification: '', father_phone: '', father_nid: '',
  mother_name: '', mother_profession: '', mother_organization: '',
  mother_qualification: '', mother_phone: '', mother_nid: '',
  guardian_relation: 'father', contact_email: '', contact_phone: '',
  emergency_contact_name: '', emergency_contact_phone: '', emergency_contact_relation: '',
  present_address: '', permanent_address: '', present_thana: '', present_district: 'Dhaka', present_zip: '',
  parent_declaration_accepted: false, sibling_at_sjis: false, sibling_name_class: '',
  how_did_you_hear: '', additional_notes: '', academic_year: '2026-2027',
};

function Field({ label, required, children, hint }: {
  label: string; required?: boolean; children: React.ReactNode; hint?: string;
}) {
  return (
    <div>
      <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
        {label} {required && <span className="text-[#C8102E]">*</span>}
      </label>
      {children}
      {hint && <p className="mt-1 text-[10px] text-slate-400">{hint}</p>}
    </div>
  );
}

const inputClass = "w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#00183F]/30 focus:border-[#00183F] text-sm text-slate-800 bg-white transition-all";
const selectClass = inputClass + " cursor-pointer";

function StepBar({ current }: { current: number }) {
  return (
    <div className="w-full mb-6">
      <div className="flex items-center justify-between gap-1 sm:gap-2">
        {STEPS.map((step, i) => {
          const done = current > step.id;
          const active = current === step.id;
          const Icon = step.icon;
          return (
            <React.Fragment key={step.id}>
              <div className="flex flex-col items-center gap-1 flex-shrink-0">
                <div className={`w-9 h-9 sm:w-11 sm:h-11 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${done ? 'bg-emerald-500 border-emerald-500 text-white' : active ? 'bg-[#00183F] border-[#00183F] text-[#D4AF37] shadow-lg scale-110' : 'bg-white border-slate-200 text-slate-400'}`}>
                  {done ? <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5" /> : <Icon className="w-4 h-4 sm:w-5 sm:h-5" />}
                </div>
                <span className={`text-[9px] sm:text-[10px] font-bold tracking-wide text-center hidden sm:block ${active ? 'text-[#00183F]' : done ? 'text-emerald-600' : 'text-slate-400'}`}>
                  {step.title.split(' ').slice(0, 2).join(' ')}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div className="flex-1 h-0.5 mt-[-14px] sm:mt-[-18px]">
                  <div className={`h-full transition-all duration-500 rounded ${current > step.id ? 'bg-emerald-400' : 'bg-slate-200'}`} />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}

export default function OnlineApplicationPage() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<OnlineApplicationFormData>(INITIAL_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{ success: boolean; application_id?: string; message: string } | null>(null);
  const topRef = useRef<HTMLDivElement>(null);

  const set = (field: keyof OnlineApplicationFormData, value: string | boolean) =>
    setForm(prev => ({ ...prev, [field]: value }));

  const scrollTop = () => topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });

  const next = () => { setStep(s => Math.min(s + 1, 4)); scrollTop(); };
  const prev = () => { setStep(s => Math.max(s - 1, 1)); scrollTop(); };

  const handleSubmit = async () => {
    if (!form.parent_declaration_accepted) return;
    setSubmitting(true);
    const res = await submitOnlineApplication(form);
    setResult(res);
    setSubmitting(false);
    if (res.success) scrollTop();
  };

  if (result?.success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
        <div className="max-w-xl w-full bg-white rounded-3xl shadow-2xl border border-emerald-100 p-8 sm:p-12 text-center">
          <div className="w-20 h-20 rounded-full bg-emerald-50 border-4 border-emerald-200 flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-emerald-500" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#00183F] mb-3">Application Submitted!</h1>
          <p className="text-slate-600 text-sm mb-6 leading-relaxed">
            Thank you for applying to <strong>St. Joseph International School, Narinda</strong>. Your application has been received.
          </p>
          {result.application_id && (
            <div className="bg-[#00183F] text-white rounded-2xl p-5 mb-6">
              <p className="text-xs text-slate-400 uppercase tracking-widest mb-1">Your Application Reference ID</p>
              <p className="text-2xl font-black text-[#D4AF37] tracking-wider">{result.application_id}</p>
              <p className="text-xs text-slate-400 mt-2">Save this ID to track your application status</p>
            </div>
          )}
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-left space-y-2 mb-6">
            <p className="text-xs font-bold text-amber-900 uppercase tracking-wide">What happens next?</p>
            <ul className="text-xs text-amber-800 space-y-1.5">
              {[
                'Our admissions team will review your application within 3-5 business days.',
                'You will be contacted via email/phone for entrance examination details.',
                'Carry original documents on the day of the entrance test.',
                'Use your Application ID to track status online anytime.',
              ].map((t, i) => (
                <li key={i} className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />{t}
                </li>
              ))}
            </ul>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <a href={`/admission/status?id=${result.application_id}`}
              className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#00183F] text-white text-sm font-bold hover:bg-[#C8102E] transition-colors">
              Track My Application <ArrowRight className="w-4 h-4" />
            </a>
            <a href="/admission"
              className="flex-1 inline-flex items-center justify-center px-5 py-3 rounded-xl border border-slate-200 text-slate-700 text-sm font-semibold hover:bg-slate-50 transition-colors">
              Back to Admissions
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen" ref={topRef}>
      <section className="relative py-16 bg-[#00183F] text-white overflow-hidden">
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 text-center">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D4AF37]/20 text-[#D4AF37] text-xs font-bold tracking-widest uppercase mb-3 border border-[#D4AF37]/30">
            <GraduationCap className="w-3.5 h-3.5" /> Online Admission Application 2026-2027
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight">Apply for Admission</h1>
          <p className="mt-3 text-slate-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Complete the four-step form below to submit your application for the{' '}
            <strong className="text-[#D4AF37]">2026-2027</strong> academic session at SJIS Narinda.
          </p>
          <div className="mt-4 flex items-center justify-center gap-2 text-xs text-slate-400">
            <Shield className="w-3.5 h-3.5 text-emerald-400" />
            <span>Your information is secure and confidential</span>
          </div>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
        <StepBar current={step} />

        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-[#00183F] to-[#001a4a] px-6 sm:px-10 py-5 flex items-center gap-4">
            {React.createElement(STEPS[step - 1].icon, { className: "w-7 h-7 text-[#D4AF37]" })}
            <div>
              <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-widest">Step {step} of 4</div>
              <div className="text-lg font-black text-white">{STEPS[step - 1].title}</div>
              <div className="text-xs text-slate-400">{STEPS[step - 1].description}</div>
            </div>
          </div>

          <div className="px-6 sm:px-10 py-8">

            {step === 1 && (
              <ScrollReveal direction="up" distance={15} duration={400}>
                <div className="space-y-6">
                  <p className="text-xs text-slate-500 bg-blue-50 border border-blue-100 rounded-xl p-3 leading-relaxed">
                    <strong>Note:</strong> All fields marked <span className="text-[#C8102E]">*</span> are mandatory. Student name must match Birth Certificate exactly.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <Field label="First Name (as in Birth Certificate)" required>
                      <input type="text" className={inputClass} value={form.student_first_name} placeholder="e.g. Rayan"
                        onChange={e => set('student_first_name', e.target.value)} />
                    </Field>
                    <Field label="Last Name / Surname" required>
                      <input type="text" className={inputClass} value={form.student_last_name} placeholder="e.g. Ahmed"
                        onChange={e => set('student_last_name', e.target.value)} />
                    </Field>
                  </div>
                  <Field label="Full Name in Bengali" hint="Optional - required for official school records">
                    <input type="text" className={inputClass} value={form.student_name_bangla} placeholder="রায়ান আহমেদ"
                      onChange={e => set('student_name_bangla', e.target.value)} />
                  </Field>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <Field label="Date of Birth" required>
                      <div className="relative">
                        <Mail className="hidden" />
                        <input type="date" className={inputClass} value={form.date_of_birth}
                          onChange={e => set('date_of_birth', e.target.value)} />
                      </div>
                    </Field>
                    <Field label="Gender" required>
                      <select className={selectClass} value={form.gender} onChange={e => set('gender', e.target.value as 'male' | 'female' | 'other')}>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other / Prefer not to say</option>
                      </select>
                    </Field>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                    <Field label="Religion">
                      <select className={selectClass} value={form.religion} onChange={e => set('religion', e.target.value)}>
                        <option value="">Select</option>
                        <option value="islam">Islam</option>
                        <option value="christianity">Christianity</option>
                        <option value="hinduism">Hinduism</option>
                        <option value="buddhism">Buddhism</option>
                        <option value="other">Other</option>
                      </select>
                    </Field>
                    <Field label="Blood Group">
                      <select className={selectClass} value={form.blood_group} onChange={e => set('blood_group', e.target.value)}>
                        {BLOOD_GROUPS.map(g => <option key={g} value={g}>{g}</option>)}
                      </select>
                    </Field>
                    <Field label="Nationality" required>
                      <input type="text" className={inputClass} value={form.nationality}
                        onChange={e => set('nationality', e.target.value)} />
                    </Field>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <Field label="Birth Certificate Number" hint="17-digit Bangladesh birth certificate number">
                      <input type="text" className={inputClass} value={form.birth_certificate_no} placeholder="19731234001234567"
                        onChange={e => set('birth_certificate_no', e.target.value)} />
                    </Field>
                    <Field label="Passport Number (if applicable)" hint="For foreign nationals or passport holders">
                      <input type="text" className={inputClass} value={form.passport_no} placeholder="e.g. BD1234567"
                        onChange={e => set('passport_no', e.target.value)} />
                    </Field>
                  </div>
                </div>
              </ScrollReveal>
            )}

            {step === 2 && (
              <ScrollReveal direction="up" distance={15} duration={400}>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <Field label="Grade Applying For" required>
                      <select className={selectClass} value={form.grade_applying} onChange={e => set('grade_applying', e.target.value)}>
                        {GRADES.map(g => <option key={g} value={g}>{g}</option>)}
                      </select>
                    </Field>
                    <Field label="Section / Medium Preference">
                      <select className={selectClass} value={form.section_preference} onChange={e => set('section_preference', e.target.value)}>
                        <option value="English Medium">English Medium (Cambridge)</option>
                        <option value="Bangla Medium">Bangla Medium (NCTB)</option>
                        <option value="No Preference">No Preference</option>
                      </select>
                    </Field>
                  </div>
                  <div className="border-t border-slate-100 pt-4">
                    <h3 className="text-sm font-bold text-[#00183F] mb-4 flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-[#C8102E]" /> Previous School Information
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <Field label="Previous School Name" hint="Leave blank if applying for Playgroup or Nursery">
                        <input type="text" className={inputClass} value={form.previous_school_name} placeholder="e.g. Holy Cross School"
                          onChange={e => set('previous_school_name', e.target.value)} />
                      </Field>
                      <Field label="City / Location">
                        <input type="text" className={inputClass} value={form.previous_school_city} placeholder="e.g. Dhaka"
                          onChange={e => set('previous_school_city', e.target.value)} />
                      </Field>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mt-5">
                      <Field label="Board / Curriculum">
                        <select className={selectClass} value={form.previous_curriculum} onChange={e => set('previous_curriculum', e.target.value)}>
                          <option value="">Select</option>
                          {CURRICULA.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                      </Field>
                      <Field label="Last Exam Result / GPA" hint="e.g. GPA 5.00 or A*">
                        <input type="text" className={inputClass} value={form.last_grade_result} placeholder="e.g. GPA 4.75"
                          onChange={e => set('last_grade_result', e.target.value)} />
                      </Field>
                      <Field label="Year of Last Examination">
                        <input type="text" className={inputClass} value={form.last_grade_year} placeholder="e.g. 2025"
                          onChange={e => set('last_grade_year', e.target.value)} />
                      </Field>
                    </div>
                  </div>
                  <div className="border-t border-slate-100 pt-4 space-y-5">
                    <h3 className="text-sm font-bold text-[#00183F] flex items-center gap-2">
                      <GraduationCap className="w-4 h-4 text-[#C8102E]" /> Co-curricular and Medical
                    </h3>
                    <Field label="Extracurricular Interests" hint="Sports, arts, science olympiad, debate, music, etc.">
                      <textarea rows={2} className={inputClass} value={form.extracurricular_interests}
                        placeholder="e.g. Football, Science Club, Piano, Chess..."
                        onChange={e => set('extracurricular_interests', e.target.value)} />
                    </Field>
                    <Field label="Special Medical / Learning Conditions" hint="Any condition the school should be aware of">
                      <textarea rows={2} className={inputClass} value={form.special_needs_or_conditions}
                        placeholder="e.g. Mild dyslexia, peanut allergy, asthma..."
                        onChange={e => set('special_needs_or_conditions', e.target.value)} />
                    </Field>
                  </div>
                </div>
              </ScrollReveal>
            )}

            {step === 3 && (
              <ScrollReveal direction="up" distance={15} duration={400}>
                <div className="space-y-7">
                  <div className="bg-blue-50/50 border border-blue-100 rounded-2xl p-5 sm:p-6 space-y-5">
                    <h3 className="text-sm font-black text-[#00183F] uppercase tracking-wide flex items-center gap-2">
                      <Users className="w-4 h-4 text-[#C8102E]" /> Father Information
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <Field label="Father Full Name">
                        <input type="text" className={inputClass} value={form.father_name} placeholder="e.g. Dr. Kamal Ahmed"
                          onChange={e => set('father_name', e.target.value)} />
                      </Field>
                      <Field label="Profession / Occupation">
                        <input type="text" className={inputClass} value={form.father_profession} placeholder="e.g. Physician, Engineer"
                          onChange={e => set('father_profession', e.target.value)} />
                      </Field>
                      <Field label="Organization / Employer">
                        <input type="text" className={inputClass} value={form.father_organization} placeholder="e.g. Dhaka Medical College"
                          onChange={e => set('father_organization', e.target.value)} />
                      </Field>
                      <Field label="Educational Qualification">
                        <input type="text" className={inputClass} value={form.father_qualification} placeholder="e.g. MBBS, M.D."
                          onChange={e => set('father_qualification', e.target.value)} />
                      </Field>
                      <Field label="Mobile Number">
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                          <input type="tel" className={inputClass + ' pl-9'} value={form.father_phone} placeholder="+880 17XX-XXXXXX"
                            onChange={e => set('father_phone', e.target.value)} />
                        </div>
                      </Field>
                      <Field label="NID Number" hint="National Identity Card number (optional)">
                        <input type="text" className={inputClass} value={form.father_nid} placeholder="e.g. 1234567890123"
                          onChange={e => set('father_nid', e.target.value)} />
                      </Field>
                    </div>
                  </div>

                  <div className="bg-rose-50/50 border border-rose-100 rounded-2xl p-5 sm:p-6 space-y-5">
                    <h3 className="text-sm font-black text-[#00183F] uppercase tracking-wide flex items-center gap-2">
                      <Users className="w-4 h-4 text-[#C8102E]" /> Mother Information
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <Field label="Mother Full Name">
                        <input type="text" className={inputClass} value={form.mother_name} placeholder="e.g. Mrs. Nasima Ahmed"
                          onChange={e => set('mother_name', e.target.value)} />
                      </Field>
                      <Field label="Profession / Occupation">
                        <input type="text" className={inputClass} value={form.mother_profession} placeholder="e.g. Teacher, Homemaker"
                          onChange={e => set('mother_profession', e.target.value)} />
                      </Field>
                      <Field label="Organization / Employer">
                        <input type="text" className={inputClass} value={form.mother_organization} placeholder="e.g. Viqarunnisa Noon School"
                          onChange={e => set('mother_organization', e.target.value)} />
                      </Field>
                      <Field label="Educational Qualification">
                        <input type="text" className={inputClass} value={form.mother_qualification} placeholder="e.g. M.A., B.Ed."
                          onChange={e => set('mother_qualification', e.target.value)} />
                      </Field>
                      <Field label="Mobile Number">
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                          <input type="tel" className={inputClass + ' pl-9'} value={form.mother_phone} placeholder="+880 18XX-XXXXXX"
                            onChange={e => set('mother_phone', e.target.value)} />
                        </div>
                      </Field>
                      <Field label="NID Number">
                        <input type="text" className={inputClass} value={form.mother_nid} placeholder="e.g. 1234567890123"
                          onChange={e => set('mother_nid', e.target.value)} />
                      </Field>
                    </div>
                  </div>

                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 sm:p-6 space-y-5">
                    <h3 className="text-sm font-black text-[#00183F] uppercase tracking-wide flex items-center gap-2">
                      <Home className="w-4 h-4 text-[#C8102E]" /> Primary Contact and Address
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                      <Field label="Primary Guardian" required>
                        <select className={selectClass} value={form.guardian_relation} onChange={e => set('guardian_relation', e.target.value as 'father' | 'mother' | 'guardian' | 'other')}>
                          <option value="father">Father</option>
                          <option value="mother">Mother</option>
                          <option value="guardian">Legal Guardian</option>
                          <option value="other">Other Relative</option>
                        </select>
                      </Field>
                      <Field label="Contact Email" required>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                          <input type="email" className={inputClass + ' pl-9'} value={form.contact_email} placeholder="parent@example.com"
                            onChange={e => set('contact_email', e.target.value)} />
                        </div>
                      </Field>
                      <Field label="Contact Phone" required>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                          <input type="tel" className={inputClass + ' pl-9'} value={form.contact_phone} placeholder="+880 17XX-XXXXXX"
                            onChange={e => set('contact_phone', e.target.value)} />
                        </div>
                      </Field>
                    </div>
                    <Field label="Present Address" required>
                      <textarea rows={2} className={inputClass} value={form.present_address}
                        placeholder="House/Flat no., Road, Area, Dhaka..."
                        onChange={e => set('present_address', e.target.value)} />
                    </Field>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                      <Field label="Thana / Upazila">
                        <input type="text" className={inputClass} value={form.present_thana} placeholder="e.g. Kotwali"
                          onChange={e => set('present_thana', e.target.value)} />
                      </Field>
                      <Field label="District">
                        <select className={selectClass} value={form.present_district} onChange={e => set('present_district', e.target.value)}>
                          {DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
                        </select>
                      </Field>
                      <Field label="Postal / ZIP Code">
                        <input type="text" className={inputClass} value={form.present_zip} placeholder="e.g. 1100"
                          onChange={e => set('present_zip', e.target.value)} />
                      </Field>
                    </div>
                    <Field label="Permanent Address" hint="Leave blank if same as present address">
                      <textarea rows={2} className={inputClass} value={form.permanent_address} placeholder="Permanent / village address..."
                        onChange={e => set('permanent_address', e.target.value)} />
                    </Field>
                    <div className="border-t border-slate-200 pt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <Field label="Emergency Contact Name">
                        <input type="text" className={inputClass} value={form.emergency_contact_name} placeholder="e.g. Uncle / Aunt"
                          onChange={e => set('emergency_contact_name', e.target.value)} />
                      </Field>
                      <Field label="Emergency Contact Phone">
                        <input type="tel" className={inputClass} value={form.emergency_contact_phone} placeholder="+880 1XXX-XXXXXX"
                          onChange={e => set('emergency_contact_phone', e.target.value)} />
                      </Field>
                      <Field label="Relation to Student">
                        <input type="text" className={inputClass} value={form.emergency_contact_relation} placeholder="e.g. Uncle, Grandparent"
                          onChange={e => set('emergency_contact_relation', e.target.value)} />
                      </Field>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            )}

            {step === 4 && (
              <ScrollReveal direction="up" distance={15} duration={400}>
                <div className="space-y-6">
                  <div className="bg-[#00183F]/5 border border-[#00183F]/10 rounded-2xl p-5 space-y-4">
                    <h3 className="text-sm font-black text-[#00183F] uppercase tracking-wide mb-3">Application Summary</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                      {[
                        { label: 'Student Name', value: `${form.student_first_name} ${form.student_last_name}`.trim() || '-' },
                        { label: 'Date of Birth', value: form.date_of_birth || '-' },
                        { label: 'Gender', value: form.gender ? form.gender.charAt(0).toUpperCase() + form.gender.slice(1) : '-' },
                        { label: 'Grade Applying', value: form.grade_applying || '-' },
                        { label: 'Section', value: form.section_preference || '-' },
                        { label: 'Academic Year', value: form.academic_year },
                        { label: 'Previous School', value: form.previous_school_name || 'Fresh Applicant' },
                        { label: 'Father', value: form.father_name || '-' },
                        { label: 'Mother', value: form.mother_name || '-' },
                        { label: 'Contact Email', value: form.contact_email || '-' },
                        { label: 'Contact Phone', value: form.contact_phone || '-' },
                        { label: 'District', value: form.present_district || '-' },
                      ].map(({ label, value }) => (
                        <div key={label} className="bg-white rounded-xl p-3 border border-slate-100">
                          <div className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold mb-0.5">{label}</div>
                          <div className="font-bold text-[#00183F] truncate text-xs">{value}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="space-y-3">
                      <label className="flex items-center gap-3 cursor-pointer p-3 rounded-xl border border-slate-200 hover:border-[#00183F]/30 transition-colors">
                        <input type="checkbox" checked={form.sibling_at_sjis}
                          onChange={e => set('sibling_at_sjis', e.target.checked)}
                          className="w-4 h-4 rounded accent-[#00183F]" />
                        <div>
                          <div className="text-sm font-semibold text-slate-800">Sibling at SJIS</div>
                          <div className="text-xs text-slate-500">Does this student have a sibling currently enrolled?</div>
                        </div>
                      </label>
                      {form.sibling_at_sjis && (
                        <input type="text" className={inputClass} value={form.sibling_name_class}
                          placeholder="Sibling name and class (e.g. Nadia Ahmed - Grade 7)"
                          onChange={e => set('sibling_name_class', e.target.value)} />
                      )}
                    </div>
                    <Field label="How Did You Hear About Us?">
                      <select className={selectClass} value={form.how_did_you_hear} onChange={e => set('how_did_you_hear', e.target.value)}>
                        <option value="">Select</option>
                        {HOW_HEARD.map(h => <option key={h} value={h}>{h}</option>)}
                      </select>
                    </Field>
                  </div>

                  <Field label="Additional Notes or Questions">
                    <textarea rows={3} className={inputClass} value={form.additional_notes}
                      placeholder="Any specific questions about curriculum, transport, co-curricular opportunities..."
                      onChange={e => set('additional_notes', e.target.value)} />
                  </Field>

                  <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
                    <h4 className="text-sm font-black text-amber-900 mb-3 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4" /> Documents Required at Entrance Examination
                    </h4>
                    <p className="text-xs text-amber-800 mb-3">Please bring originals + 2 photocopies of each on the day of the entrance test:</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {[
                        'Birth Certificate (Original)',
                        'Previous School Report Card / Marksheet (last 2 years)',
                        'Transfer Certificate (TC) from previous school',
                        '4 recent passport-size photographs',
                        "Father's and Mother's NID copies",
                        'Immunization Record / Health Card',
                        'Any achievement certificates or awards',
                      ].map((doc, i) => (
                        <div key={i} className="flex items-start gap-2 text-xs text-amber-900">
                          <CheckCircle2 className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />{doc}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5">
                    <h4 className="text-sm font-black text-[#00183F] mb-3 flex items-center gap-2">
                      <Shield className="w-4 h-4 text-[#C8102E]" /> Parent / Guardian Declaration
                    </h4>
                    <p className="text-xs text-slate-600 leading-relaxed mb-4">
                      I/We, the parent(s)/guardian(s) of the above-named student, hereby declare that the information provided in this application is accurate and complete to the best of my/our knowledge. I/We understand that providing false information may result in cancellation of the application or admission. I/We agree to abide by the rules, regulations, and code of conduct of St. Joseph International School, Narinda, and undertake to support the school educational mission and values.
                    </p>
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input type="checkbox" id="declaration"
                        checked={form.parent_declaration_accepted}
                        onChange={e => set('parent_declaration_accepted', e.target.checked)}
                        className="w-4 h-4 mt-0.5 rounded accent-[#00183F]" />
                      <span className="text-sm font-semibold text-slate-800">
                        I/We accept the above declaration and confirm all information is accurate. <span className="text-[#C8102E]">*</span>
                      </span>
                    </label>
                  </div>

                  {result && !result.success && (
                    <div className="flex items-start gap-3 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-sm">
                      <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-bold">Submission Failed</p>
                        <p className="text-xs mt-1">{result.message}</p>
                      </div>
                    </div>
                  )}
                </div>
              </ScrollReveal>
            )}

            <div className="mt-8 flex items-center justify-between gap-4">
              <button type="button" onClick={prev} disabled={step === 1}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-sm font-semibold hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
                <ChevronLeft className="w-4 h-4" /> Previous
              </button>

              <div className="flex items-center gap-1.5">
                {STEPS.map(s => (
                  <div key={s.id} className={`h-2 rounded-full transition-all duration-300 ${step === s.id ? 'bg-[#00183F] w-4' : step > s.id ? 'bg-emerald-400 w-2' : 'bg-slate-200 w-2'}`} />
                ))}
              </div>

              {step < 4 ? (
                <button type="button" onClick={next}
                  disabled={
                    (step === 1 && (!form.student_first_name || !form.student_last_name || !form.date_of_birth)) ||
                    (step === 3 && (!form.contact_email || !form.contact_phone || !form.present_address))
                  }
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#00183F] text-white text-sm font-bold hover:bg-[#C8102E] disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-md">
                  Continue <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button type="button" onClick={handleSubmit}
                  disabled={submitting || !form.parent_declaration_accepted}
                  className="inline-flex items-center gap-2 px-7 py-3 rounded-xl bg-[#C8102E] text-white text-sm font-bold hover:bg-[#a00d25] disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-md">
                  {submitting ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> Submitting...</>
                  ) : (
                    <><FileCheck2 className="w-4 h-4" /> Submit Application</>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>

        <p className="text-center text-xs text-slate-400 mt-6">
          Need help? Contact our Admissions Office at{' '}
          <a href="tel:+8801746866393" className="text-[#00183F] font-semibold hover:underline">+880 1746-866393</a>{' '}
          or email{' '}
          <a href="mailto:sjisnarinda2021@gmail.com" className="text-[#00183F] font-semibold hover:underline">sjisnarinda2021@gmail.com</a>
        </p>
      </div>
    </div>
  );
}
