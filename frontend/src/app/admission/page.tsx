'use client';

import React, { useState, useEffect } from 'react';
import {
  GraduationCap,
  Sparkles,
  Calendar,
  CheckCircle2,
  FileText,
  DollarSign,
  Send,
  AlertCircle,
  HelpCircle,
  Clock,
  ArrowRight,
} from 'lucide-react';
import { AdmissionGuide } from '@/lib/types';
import { getAdmissionGuide, submitAdmissionInquiry } from '@/lib/api';
import { FALLBACK_ADMISSION } from '@/lib/fallback-data';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { AdmissionFAQ } from '@/components/sections/AdmissionFAQ';
import { ScrollReveal } from '@/components/ui/ScrollReveal';

export default function AdmissionPage() {
  const [guide, setGuide] = useState<AdmissionGuide>(FALLBACK_ADMISSION);
  const [formData, setFormData] = useState({
    student_name: '',
    parent_name: '',
    email: '',
    phone: '',
    grade_applying: 'Grade 1',
    previous_school: '',
    message: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    success?: boolean;
    message?: string;
  } | null>(null);

  useEffect(() => {
    async function loadData() {
      const data = await getAdmissionGuide();
      setGuide(data);
    }
    loadData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitStatus(null);

    const result = await submitAdmissionInquiry(formData);
    setSubmitStatus(result);
    setSubmitting(false);

    if (result.success) {
      setFormData({
        student_name: '',
        parent_name: '',
        email: '',
        phone: '',
        grade_applying: 'Grade 1',
        previous_school: '',
        message: '',
      });
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Header Banner */}
      <section className="relative py-24 bg-[#00183F] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Badge variant="gold">Academic Session {guide?.academic_year || '2026-2027'}</Badge>
          <h1 className="mt-4 text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white">
            Admissions Portal
          </h1>
          <p className="mt-4 text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Begin your child&apos;s transformative journey at St. Joseph International School, Narinda. Review criteria, fee details, and apply online.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <a
              href="https://portal.narinda.sjis.edu.bd/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 border border-amber-400/40 text-amber-300 text-xs font-bold transition-all shadow-sm group"
            >
              <GraduationCap className="w-4 h-4 text-[#D4AF37]" />
              <span>Already Enrolled? Student & Parent Portal Login</span>
              <ArrowRight className="w-3.5 h-3.5 opacity-80 group-hover:translate-x-0.5 transition-transform" />
            </a>
          </div>
        </div>
      </section>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-20">
        {/* Important Dates Bar */}
        {guide?.important_dates && guide.important_dates.length > 0 && (
          <ScrollReveal direction="up" distance={20} duration={600}>
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm">
              <h3 className="text-lg font-bold text-[#00183F] mb-6 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-[#C8102E]" />
                Key Admission Dates (Session {guide.academic_year})
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                {guide.important_dates.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col justify-between"
                  >
                    <span className="text-xs text-slate-500 font-medium">{item.event}</span>
                    <span className="text-sm font-bold text-[#00183F] mt-2 text-[#C8102E]">
                      {item.date}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>
        )}

        {/* 1. Admission Roadmap (5 Steps) */}
        <section>
          <ScrollReveal direction="up" distance={20} duration={600}>
            <SectionHeading
              badge="Simple Step-by-Step"
              title="Admission Procedure"
              subtitle="A transparent, merit-based selection journey designed for prospective students and parents."
            />
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            {guide?.application_steps?.map((step, idx) => (
              <ScrollReveal
                key={step.step}
                direction="up"
                distance={20}
                delay={idx * 80}
                duration={550}
                className="h-full"
              >
                <div
                  className="h-full bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm relative flex flex-col justify-between"
                >
                  <div>
                    <div className="w-10 h-10 rounded-xl bg-[#00183F] text-[#D4AF37] font-black text-lg flex items-center justify-center mb-4 shadow-md">
                      0{step.step}
                    </div>
                    <h4 className="text-base font-bold text-[#00183F] mb-2 leading-snug">
                      {step.title}
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </section>

        {/* 2. Eligibility Criteria */}
        <section id="curriculum">
          <ScrollReveal direction="up" distance={20} duration={600}>
            <SectionHeading
              badge="Academic Requirements"
              title="Eligibility & Age Criteria"
              subtitle="Guidelines for prospective applicants across early childhood, primary, middle, and Cambridge sections."
            />
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {guide?.eligibility?.map((item, idx) => (
              <ScrollReveal
                key={idx}
                direction="up"
                distance={20}
                delay={idx * 70}
                duration={550}
                className="h-full"
              >
                <div
                  className="h-full bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3"
                >
                  <div className="text-xs font-bold uppercase tracking-wider text-[#C8102E]">
                    {item.level}
                  </div>
                  <div className="p-2.5 rounded-lg bg-amber-50 text-amber-900 border border-amber-200 text-xs font-semibold">
                    Age: {item.age_bracket}
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {item.criteria}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </section>

        {/* 3. Tuition & Fee Schedule */}
        <section id="fees">
          <ScrollReveal direction="up" distance={20} duration={600}>
            <SectionHeading
              badge="Fee Schedule 2026-2027"
              title="Transparent Tuition & Fees"
              subtitle="Detailed breakdown of one-time admission, session charges, and monthly tuition."
            />
          </ScrollReveal>

          <ScrollReveal direction="up" distance={25} delay={100} duration={650}>
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
              {/* Desktop Table View */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-600">
                  <thead className="bg-[#00183F] text-white text-xs uppercase tracking-wider">
                    <tr>
                      <th scope="col" className="px-6 py-4">Academic Level</th>
                      <th scope="col" className="px-6 py-4">One-Time Admission Fee</th>
                      <th scope="col" className="px-6 py-4">Monthly Tuition</th>
                      <th scope="col" className="px-6 py-4">Annual Session Charge</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {guide?.fee_structure?.map((fee, idx) => (
                      <tr key={idx} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4 font-bold text-[#00183F]">{fee.section}</td>
                        <td className="px-6 py-4 text-[#C8102E] font-semibold">{fee.admission_fee}</td>
                        <td className="px-6 py-4 font-semibold text-slate-800">{fee.monthly_tuition}</td>
                        <td className="px-6 py-4 text-slate-600">{fee.annual_session_charge}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Card View (Optimized for Phones) */}
              <div className="block md:hidden divide-y divide-slate-100">
                {guide?.fee_structure?.map((fee, idx) => (
                  <div key={idx} className="p-4 sm:p-5 space-y-3 bg-white">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-bold text-sm text-[#00183F]">{fee.section}</span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-900 border border-amber-200">
                        2026-27
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 pt-1 text-xs">
                      <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                        <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-semibold">Monthly Tuition</span>
                        <span className="text-sm font-extrabold text-slate-900 mt-0.5 block">{fee.monthly_tuition}</span>
                      </div>
                      <div className="p-3 rounded-xl bg-rose-50/60 border border-rose-100">
                        <span className="text-[10px] text-rose-800 uppercase tracking-wider block font-semibold">Admission Fee</span>
                        <span className="text-sm font-extrabold text-[#C8102E] mt-0.5 block">{fee.admission_fee}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-xs px-1 text-slate-600">
                      <span>Annual Session Charge:</span>
                      <span className="font-bold text-slate-800">{fee.annual_session_charge}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-4 bg-slate-50 border-t border-slate-200 text-xs text-slate-500 text-center">
                * Note: Examination fees for Cambridge Assessment International Education (CAIE) O/A Levels are payable separately as per British Council directives.
              </div>
            </div>
          </ScrollReveal>
        </section>

        {/* 4. Required Documents Checklist */}
        <section>
          <ScrollReveal direction="up" distance={25} duration={650}>
            <div className="bg-amber-50/70 border border-amber-200/80 rounded-3xl p-8 sm:p-10">
              <h3 className="text-xl font-black text-[#00183F] mb-4 flex items-center gap-2">
                <FileText className="w-6 h-6 text-[#D4AF37]" />
                Required Documentation Checklist
              </h3>
              <p className="text-slate-600 text-sm mb-6">
                Please prepare the following certified documents before your entrance evaluation:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {guide?.required_documents?.map((doc, idx) => (
                  <div key={idx} className="flex items-start gap-3 text-sm text-slate-800">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{doc}</span>
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>
        </section>

        {/* 5. Online Admission Inquiry / Application Form */}
        <section id="apply">
          <ScrollReveal direction="up" distance={30} duration={700}>
            <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 shadow-xl">
              <div className="max-w-3xl mx-auto">
            <div className="text-center mb-8">
              <Badge variant="crimson">Admissions Desk</Badge>
              <h3 className="text-3xl font-extrabold text-[#00183F] mt-2">
                Online Admission Inquiry & Registration
              </h3>
              <p className="text-slate-600 text-sm mt-2">
                Submit this preliminary application form. Our admissions officer will contact you within 24-48 hours.
              </p>
            </div>

            {submitStatus && (
              <div
                className={`p-4 rounded-2xl mb-6 flex items-start gap-3 text-sm font-medium ${
                  submitStatus.success
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                    : 'bg-rose-50 text-rose-800 border border-rose-200'
                }`}
              >
                {submitStatus.success ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                )}
                <span>{submitStatus.message}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                    Student&apos;s Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    autoComplete="name"
                    placeholder="e.g. Rayan Ahmed"
                    value={formData.student_name}
                    onChange={(e) =>
                      setFormData({ ...formData, student_name: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#00183F] text-sm text-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                    Parent / Guardian Name *
                  </label>
                  <input
                    type="text"
                    required
                    autoComplete="name"
                    placeholder="e.g. Dr. Kazi Ahmed"
                    value={formData.parent_name}
                    onChange={(e) =>
                      setFormData({ ...formData, parent_name: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#00183F] text-sm text-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                    Guardian Email Address *
                  </label>
                  <input
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    required
                    placeholder="parent@example.com"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#00183F] text-sm text-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                    Contact Phone Number *
                  </label>
                  <input
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    required
                    placeholder="+880 1711-XXXXXX"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#00183F] text-sm text-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                    Grade Applying For *
                  </label>
                  <select
                    value={formData.grade_applying}
                    onChange={(e) =>
                      setFormData({ ...formData, grade_applying: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#00183F] text-sm text-slate-800 bg-white"
                  >
                    <option value="Playgroup">Playgroup (Age 3.5+)</option>
                    <option value="Nursery">Nursery (Age 4.5+)</option>
                    <option value="Kindergarten">Kindergarten</option>
                    <option value="Grade 1">Grade 1 (Primary)</option>
                    <option value="Grade 2">Grade 2</option>
                    <option value="Grade 3">Grade 3</option>
                    <option value="Grade 4">Grade 4</option>
                    <option value="Grade 5">Grade 5</option>
                    <option value="Grade 6">Grade 6 (Junior Section)</option>
                    <option value="Grade 7">Grade 7</option>
                    <option value="Grade 8">Grade 8</option>
                    <option value="Grade 9">Grade 9 (Cambridge IGCSE)</option>
                    <option value="Grade 11">Grade 11 (Cambridge A-Level)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                    Previous School (If any)
                  </label>
                  <input
                    type="text"
                    placeholder="School name & city"
                    value={formData.previous_school}
                    onChange={(e) =>
                      setFormData({ ...formData, previous_school: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#00183F] text-sm text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  Additional Queries or Notes
                </label>
                <textarea
                  rows={3}
                  placeholder="Mention any questions regarding syllabus, co-curriculars, or transportation..."
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#00183F] text-sm text-slate-800"
                />
              </div>

              <div className="pt-2">
                <Button
                  type="submit"
                  disabled={submitting}
                  variant="secondary"
                  size="lg"
                  className="w-full py-4 text-center justify-center font-bold"
                  icon={<Send className="w-5 h-5 text-white" />}
                >
                  {submitting ? 'Submitting Application...' : 'Submit Admission Inquiry'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </ScrollReveal>
    </section>

        {/* 6. Frequently Asked Questions Accordion */}
        <ScrollReveal direction="up" distance={25} duration={600}>
          <AdmissionFAQ />
        </ScrollReveal>
      </div>
    </div>
  );
}
