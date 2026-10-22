'use client';

import React, { useState } from 'react';
import type { OnlineApplicationFormData } from '@/lib/types';
import { Scissors, Check, Printer, FileText } from 'lucide-react';
import { printDocumentElement } from '@/lib/printUtils';

export interface PrintableApplicationFormProps {
  form: OnlineApplicationFormData;
  applicationId?: string;
  formNo?: string;
  submittedAt?: string;
  documents?: Array<{
    doc_type: string;
    file_url: string;
    original_filename?: string;
    file_size?: string;
  }>;
  /** Whether to render only the Admit Card portion */
  admitCardOnly?: boolean;
  /** Whether to render with the official canary yellow paper theme */
  defaultYellowPaper?: boolean;
  /** Dynamic paper page size */
  pageSize?: 'A4' | 'Legal';
  /** Document checklist of what to bring on interview day */
  documentChecklist?: Array<{ item: string; required?: boolean }>;
  /** Additional reporting instructions */
  reportingInstructions?: string;
  /** Payment status */
  paymentStatus?: string;
  /** Payment transaction ID */
  paymentTransactionId?: string;
  /** Interview slot details */
  interviewSlot?: {
    id?: number;
    date: string;
    start_time: string;
    end_time?: string;
    label?: string;
    reporting_venue?: string;
  } | null;
}

export function PrintableApplicationForm({
  form,
  applicationId,
  formNo,
  submittedAt,
  documents = [],
  admitCardOnly = false,
  defaultYellowPaper = false,
  pageSize = 'A4',
  documentChecklist = [],
  reportingInstructions = '',
  paymentStatus = '',
  paymentTransactionId = '',
  interviewSlot = null,
}: PrintableApplicationFormProps) {
  const [useYellowPaper, setUseYellowPaper] = useState(defaultYellowPaper);
  const [selectedPageSize, setSelectedPageSize] = useState<'A4' | 'Legal'>(pageSize);

  // Compute Clean Form No (like 026110)
  const displayId = applicationId || form.form_no || 'SJIS-2026-DRAFT';
  const displayFormNo =
    formNo ||
    form.form_no ||
    (() => {
      if (applicationId) {
        const parts = applicationId.split('-');
        const lastPart = parts[parts.length - 1];
        if (!isNaN(Number(lastPart))) {
          return String(lastPart).padStart(6, '0');
        }
      }
      return '026110';
    })();

  // Candidate Full Name (Block Letters)
  const candidateFullName = (
    `${form.student_first_name || ''} ${form.student_last_name || ''}`.trim() || 'CANDIDATE NAME'
  ).toUpperCase();

  // Format DOB (DD.MM.YYYY matching physical form e.g. 13.10.2022)
  const formattedDob = (() => {
    if (!form.date_of_birth) return '';
    try {
      const parts = form.date_of_birth.split('-');
      if (parts.length === 3) {
        return `${parts[2]}.${parts[1]}.${parts[0]}`;
      }
      const d = new Date(form.date_of_birth);
      const day = String(d.getDate()).padStart(2, '0');
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const year = d.getFullYear();
      return `${day}.${month}.${year}`;
    } catch {
      return form.date_of_birth;
    }
  })();

  // Submission Date (e.g. 28.06.2026 or from submittedAt)
  const displaySubmissionDate = form.submission_deadline ||
    (submittedAt
      ? (() => {
          const d = new Date(submittedAt);
          const day = String(d.getDate()).padStart(2, '0');
          const month = String(d.getMonth() + 1).padStart(2, '0');
          const year = d.getFullYear();
          return `${day}.${month}.${year}`;
        })()
      : '28.06.2026');

  // Interview Date & Time (from interview slot or form)
  const displayInterviewDate = interviewSlot?.date
    ? new Date(interviewSlot.date).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: '2-digit',
      })
    : form.interview_date
    ? new Date(form.interview_date).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: '2-digit',
      })
    : "7th March '26";

  const displayInterviewTime = interviewSlot?.start_time
    ? (interviewSlot.start_time.length === 8 ? interviewSlot.start_time.slice(0, 5) : interviewSlot.start_time)
    : (form.interview_time || '09:30 AM');

  const displayInterviewVenue = interviewSlot?.reporting_venue || 'Campus Auditorium, St. Joseph International School, 32 Shah Shaheb Lane, Narinda, Dhaka 1100';

  // Capitalize Religion
  const displayReligion = form.religion
    ? form.religion.charAt(0).toUpperCase() + form.religion.slice(1)
    : 'Islam';

  // Paper styling class
  const paperClass = useYellowPaper
    ? 'bg-[#fef9c3] text-[#1c1917] border-amber-300' // Physical Form Canary Yellow
    : 'bg-white text-slate-900 border-slate-300';

  return (
    <div className="printable-form-wrapper w-full">
      {/* On-screen Toolbar (Hidden during print) */}
      <div className="no-print mb-4 p-3 rounded-2xl bg-slate-900 text-white flex flex-wrap items-center justify-between gap-3 text-xs shadow-md">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-[#D4AF37]" />
          <span className="font-bold">
            Official Physical Form & Tear-off Admit Card Generator
          </span>
          {paymentStatus === 'completed' && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              ✓ Verified & Paid
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Page size toggle */}
          <div className="flex items-center gap-1 bg-white/10 rounded-lg p-0.5 border border-white/20">
            <button
              type="button"
              onClick={() => setSelectedPageSize('A4')}
              className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all cursor-pointer ${
                selectedPageSize === 'A4'
                  ? 'bg-[#D4AF37] text-[#00183F]'
                  : 'text-white hover:bg-white/10'
              }`}
            >
              A4
            </button>
            <button
              type="button"
              onClick={() => setSelectedPageSize('Legal')}
              className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all cursor-pointer ${
                selectedPageSize === 'Legal'
                  ? 'bg-[#D4AF37] text-[#00183F]'
                  : 'text-white hover:bg-white/10'
              }`}
            >
              Legal (F4)
            </button>
          </div>

          <button
            type="button"
            onClick={() => setUseYellowPaper(!useYellowPaper)}
            className={`px-3 py-1.5 rounded-lg font-bold border transition-all cursor-pointer ${
              useYellowPaper
                ? 'bg-amber-300 text-slate-900 border-amber-400'
                : 'bg-white/10 text-white border-white/20 hover:bg-white/20'
            }`}
          >
            {useYellowPaper ? '✓ Yellow Paper' : 'White Paper'}
          </button>

          <button
            type="button"
            onClick={() =>
              printDocumentElement(
                'physical-admission-document',
                'St. Joseph International School - Official Document',
                selectedPageSize
              )
            }
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-[#D4AF37] hover:bg-[#c59f2e] text-[#00183F] font-black transition-all cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print / Save PDF ({selectedPageSize})</span>
          </button>
        </div>
      </div>

      <style>{`
        @media print {
          @page {
            size: A4 portrait;
            margin: 5mm 7mm 5mm 7mm;
          }
          html, body {
            background: #ffffff !important;
            color: #000000 !important;
            margin: 0 !important;
            padding: 0 !important;
            width: 100% !important;
            height: 100% !important;
            overflow: visible !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            font-family: Georgia, "Times New Roman", Cambria, serif !important;
          }
          nav, header, footer, aside, .no-print, [role="navigation"], .site-header, .site-footer {
            display: none !important;
          }
          #physical-admission-document {
            display: flex !important;
            flex-direction: column !important;
            justify-content: space-between !important;
            box-sizing: border-box !important;
            visibility: visible !important;
            opacity: 1 !important;
            width: 100% !important;
            max-width: 100% !important;
            height: 285mm !important;
            max-height: 285mm !important;
            margin: 0 auto !important;
            padding: 2mm 3mm !important;
            box-shadow: none !important;
            border: none !important;
            background: ${useYellowPaper ? '#fef9c3 !important' : '#ffffff !important'};
            color: #000000 !important;
            page-break-inside: avoid !important;
            break-inside: avoid !important;
          }
          #physical-admission-document * {
            visibility: visible !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .admission-application-part {
            flex: 1 1 auto !important;
            display: flex !important;
            flex-direction: column !important;
            justify-content: space-between !important;
            padding-bottom: 2mm !important;
          }
          .admit-card-part {
            flex-shrink: 0 !important;
            margin-top: auto !important;
            break-inside: avoid !important;
            page-break-inside: avoid !important;
          }
        }
      `}</style>

      {/* Main Official Document Sheet */}
      <div
        id="physical-admission-document"
        className={`${paperClass} transition-colors font-sans p-5 sm:p-6 max-w-[210mm] mx-auto text-[10.5px] leading-normal rounded-xl shadow-lg border print:border-none print:shadow-none print:p-0 print:m-0`}
        style={{ fontFamily: 'Georgia, "Times New Roman", Cambria, serif' }}
      >
        {/* ══════════════════════════════════════════════════════════════════
            PART 1 · APPLICATION FOR ADMISSION TEST (PHYSICAL FORM TOP HALF)
           ══════════════════════════════════════════════════════════════════ */}
        {!admitCardOnly && (
          <section className="admission-application-part pb-2 flex-1 flex flex-col justify-between">
            {/* ── Official Header ────────────────────────────────────────── */}
            <div className="relative mb-2 pt-0.5">
              <div className="flex items-start justify-between gap-3">
                {/* School Logo Crest */}
                <div className="w-16 h-16 sm:w-18 sm:h-18 shrink-0 flex items-center justify-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/sjis-crest-logo.png"
                    alt="SJIS Crest"
                    className="w-16 h-16 sm:w-18 sm:h-18 object-contain drop-shadow-sm"
                    onError={(e) => {
                      e.currentTarget.src = '/sjis-logo.png';
                    }}
                  />
                </div>

                {/* Central Title & Official Narinda Address */}
                <div className="flex-1 text-center px-1">
                  <h1 className="text-base sm:text-lg font-black tracking-tight text-slate-900 uppercase">
                    APPLICATION FOR ADMISSION TEST
                  </h1>
                  <h2 className="text-xs sm:text-sm font-bold text-slate-800 mt-0.5">
                    St. Joseph International School (Narinda Campus)
                  </h2>
                  <p className="text-[10px] sm:text-[10.5px] text-slate-700 font-medium">
                    32 Shah Shaheb Lane, Narinda, Dhaka 1100
                  </p>
                </div>

                {/* Top-Right Candidate Photograph Frame */}
                <div className="w-22 h-28 sm:w-24 sm:h-30 border-2 border-slate-800 rounded-sm bg-white shrink-0 overflow-hidden flex flex-col items-center justify-center p-0.5 text-center shadow-xs">
                  {form.student_photo_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={form.student_photo_url}
                      alt="Candidate"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="p-1 space-y-0.5">
                      <span className="text-[8px] font-bold text-slate-500 uppercase block leading-tight">
                        Candidate Photograph
                      </span>
                      <span className="text-[7px] text-slate-400 block">
                        (Attach Passport Photo)
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Form No. on Left */}
              <div className="flex items-center gap-2 mt-[-10px] sm:mt-[-14px]">
                <span className="text-xs font-bold text-slate-800">Form No.</span>
                <span className="font-mono text-base sm:text-lg font-black tracking-widest text-red-600 border-b border-dotted border-slate-600 px-2 py-0">
                  {displayFormNo}
                </span>
                <span className="font-mono text-[9px] text-slate-400 ml-1">
                  ({displayId})
                </span>
              </div>

              {/* Instruction banner */}
              <div className="text-center mt-1.5 pb-0.5 border-b border-slate-800">
                <p className="text-[9.5px] sm:text-[10px] font-bold uppercase tracking-wider text-slate-800">
                  (PLEASE USE BLOCK LETTERS TO FILL UP THE FORM)
                </p>
              </div>
            </div>

            {/* ── Form Fields 1 to 11 (Exact Line-by-Line Match) ────────── */}
            <div className="space-y-1.5 sm:space-y-2 text-[10.5px] sm:text-[11px] text-slate-900 leading-snug">
              {/* Field 1: Full name */}
              <div className="flex items-baseline gap-1">
                <span className="font-semibold whitespace-nowrap">
                  1. Full name of candidate (cannot be changed):
                </span>
                <span className="flex-1 font-bold uppercase tracking-wider px-2 border-b border-dotted border-slate-700 min-h-[18px]">
                  {candidateFullName}
                </span>
              </div>

              {/* Field 2: Date of Birth & Religion */}
              <div className="flex items-baseline gap-2">
                <span className="font-semibold whitespace-nowrap">
                  2. Authentic Date of Birth (cannot be changed):
                </span>
                <span className="font-bold px-2 border-b border-dotted border-slate-700 min-w-[105px] text-center">
                  {formattedDob || '—'}
                </span>
                <span className="text-[8.5px] text-slate-600 italic whitespace-nowrap">
                  (As per birth cert.)
                </span>
                <span className="font-semibold whitespace-nowrap ml-1.5">Religion:</span>
                <span className="flex-1 font-bold px-2 border-b border-dotted border-slate-700 min-h-[18px]">
                  {displayReligion}
                </span>
              </div>

              {/* Field 3: Father's Name & Occupation */}
              <div className="flex items-baseline gap-2">
                <span className="font-semibold whitespace-nowrap">3. Father's Name:</span>
                <span className="flex-1 font-bold px-2 border-b border-dotted border-slate-700 min-h-[18px]">
                  {form.father_name || '—'}
                </span>
                <span className="font-semibold whitespace-nowrap ml-1.5">Occupation:</span>
                <span className="w-1/3 sm:w-2/5 font-bold px-2 border-b border-dotted border-slate-700 min-h-[18px]">
                  {form.father_profession || '—'}
                </span>
              </div>

              {/* Field 4: Mother's Name & Occupation */}
              <div className="flex items-baseline gap-2">
                <span className="font-semibold whitespace-nowrap">4. Mother's Name:</span>
                <span className="flex-1 font-bold px-2 border-b border-dotted border-slate-700 min-h-[18px]">
                  {form.mother_name || '—'}
                </span>
                <span className="font-semibold whitespace-nowrap ml-1.5">Occupation:</span>
                <span className="w-1/3 sm:w-2/5 font-bold px-2 border-b border-dotted border-slate-700 min-h-[18px]">
                  {form.mother_profession || '—'}
                </span>
              </div>

              {/* Field 5: Present Address */}
              <div className="flex items-baseline gap-1">
                <span className="font-semibold whitespace-nowrap">5. Present Address:</span>
                <span className="flex-1 font-medium px-2 border-b border-dotted border-slate-700 min-h-[18px]">
                  {form.present_address || '—'}
                </span>
              </div>

              {/* Field 6: Contact Number (Father & Mother) */}
              <div className="flex items-baseline gap-2">
                <span className="font-semibold whitespace-nowrap">
                  6. Contact Number (Father):
                </span>
                <span className="flex-1 font-mono font-bold px-2 border-b border-dotted border-slate-700 min-h-[18px]">
                  {form.father_phone || form.contact_phone || '—'}
                </span>
                <span className="font-semibold whitespace-nowrap ml-1.5">(Mother):</span>
                <span className="flex-1 font-mono font-bold px-2 border-b border-dotted border-slate-700 min-h-[18px]">
                  {form.mother_phone || '—'}
                </span>
              </div>

              {/* Field 7: Class/Grade applying */}
              <div className="flex items-baseline gap-1">
                <span className="font-semibold whitespace-nowrap">
                  7. Class/Grade for which application is being made:
                </span>
                <span className="flex-1 font-bold text-sm sm:text-base px-2 border-b border-dotted border-slate-700 min-h-[18px] text-[#00183F]">
                  {form.grade_applying}
                </span>
              </div>

              {/* Field 8: Gender & Field 9: Student living with */}
              <div className="flex flex-wrap items-center justify-between gap-y-1 pt-0.5">
                {/* Field 8: Gender */}
                <div className="flex items-center gap-2">
                  <span className="font-semibold">8. Gender:</span>
                  <label className="inline-flex items-center gap-1 cursor-pointer">
                    <span>Male</span>
                    <span className="w-4 h-4 border border-slate-700 flex items-center justify-center font-bold text-xs bg-white/70">
                      {form.gender?.toLowerCase() === 'male' ? '✓' : ''}
                    </span>
                  </label>
                  <label className="inline-flex items-center gap-1 cursor-pointer ml-2">
                    <span>Female</span>
                    <span className="w-4 h-4 border border-slate-700 flex items-center justify-center font-bold text-xs bg-white/70">
                      {form.gender?.toLowerCase() === 'female' ? '✓' : ''}
                    </span>
                  </label>
                </div>

                {/* Field 9: Student living with */}
                <div className="flex items-center gap-1.5">
                  <span className="font-semibold">9. Student living with:</span>
                  <label className="inline-flex items-center gap-1 cursor-pointer">
                    <span className="w-4 h-4 border border-slate-700 flex items-center justify-center font-bold text-xs bg-white/70">
                      {form.student_living_with === 'parents' ? '✓' : ''}
                    </span>
                    <span>Parents</span>
                  </label>
                  <label className="inline-flex items-center gap-1 cursor-pointer">
                    <span className="w-4 h-4 border border-slate-700 flex items-center justify-center font-bold text-xs bg-white/70">
                      {form.student_living_with === 'father' ? '✓' : ''}
                    </span>
                    <span>Father</span>
                  </label>
                  <label className="inline-flex items-center gap-1 cursor-pointer">
                    <span className="w-4 h-4 border border-slate-700 flex items-center justify-center font-bold text-xs bg-white/70">
                      {form.student_living_with === 'mother' ? '✓' : ''}
                    </span>
                    <span>Mother</span>
                  </label>
                  <label className="inline-flex items-center gap-1 cursor-pointer">
                    <span className="w-4 h-4 border border-slate-700 flex items-center justify-center font-bold text-xs bg-white/70">
                      {form.student_living_with === 'other' ? '✓' : ''}
                    </span>
                    <span>Other</span>
                  </label>
                </div>
              </div>

              {/* Field 10: School & Class currently studying */}
              <div className="flex items-baseline gap-1 pt-0.5">
                <span className="font-semibold whitespace-nowrap">
                  10. School & Class in which the candidate is studying this year:
                </span>
                <span className="flex-1 font-medium px-2 border-b border-dotted border-slate-700 min-h-[18px]">
                  {form.current_school_and_class ||
                    form.previous_school_name ||
                    'None / First Admission'}
                </span>
              </div>

              {/* Field 11: Sibling Information */}
              <div className="flex items-baseline gap-2 pt-0.5">
                <span className="font-semibold whitespace-nowrap">
                  11. If any sibling studying in this school Name:
                </span>
                <span className="flex-1 font-medium px-2 border-b border-dotted border-slate-700 min-h-[18px]">
                  {form.sibling_name ||
                    (form.sibling_at_sjis ? form.sibling_name_class : '—')}
                </span>
                <span className="font-semibold whitespace-nowrap">Class:</span>
                <span className="w-14 font-medium px-1 border-b border-dotted border-slate-700 min-h-[18px] text-center">
                  {form.sibling_class || '—'}
                </span>
                <span className="font-semibold whitespace-nowrap">Sec:</span>
                <span className="w-12 font-medium px-1 border-b border-dotted border-slate-700 min-h-[18px] text-center">
                  {form.sibling_section || '—'}
                </span>
                <span className="font-semibold whitespace-nowrap">Roll:</span>
                <span className="w-12 font-medium px-1 border-b border-dotted border-slate-700 min-h-[18px] text-center">
                  {form.sibling_roll || '—'}
                </span>
              </div>
            </div>

            {/* ── Submission Deadline & Legal Undertaking ───────────────── */}
            <div className="mt-2 pt-1.5 space-y-1.5 text-[10px]">
              <div className="flex items-baseline gap-1">
                <span className="font-bold">The candidate must submit this form on:</span>
                <span className="font-mono font-bold px-3 border-b border-dotted border-slate-700 min-w-[120px] text-center">
                  {displaySubmissionDate}
                </span>
              </div>

              <p className="font-semibold text-justify leading-snug">
                I hereby declare that all of the above information is correct and authentic. I
                will not request for any change of these information in future.
              </p>

              {/* Signatures */}
              <div className="grid grid-cols-2 gap-8 pt-4 pb-1">
                <div>
                  <div className="border-b border-slate-700 pb-1 min-h-[18px] flex items-end justify-between">
                    <span className="text-[9.5px]">Received by:</span>
                    <span className="font-bold text-[9.5px]">
                      {form.received_by || '____________________'}
                    </span>
                    <span className="text-[9.5px]">Date:</span>
                    <span className="font-bold text-[9.5px]">
                      {displaySubmissionDate}
                    </span>
                  </div>
                </div>
                <div>
                  <div className="border-b border-slate-700 pb-1 min-h-[18px] text-right">
                    <span className="font-bold text-[9.5px]">
                      Signature of Parent/Guardian
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* ── For Office Use Only ───────────────────────────────────── */}
            <div className="mt-1.5 pt-1 border-t border-slate-600 text-[9.5px]">
              <span className="font-bold block uppercase tracking-wider">For Office Use:</span>
              <div className="grid grid-cols-2 gap-4 mt-0.5">
                <div className="flex items-baseline gap-1">
                  <span>Date of interview:</span>
                  <span className="flex-1 font-bold px-2 border-b border-dotted border-slate-700">
                    {displayInterviewDate}
                  </span>
                </div>
                <div className="flex items-baseline gap-1">
                  <span>Time:</span>
                  <span className="flex-1 font-bold px-2 border-b border-dotted border-slate-700">
                    {displayInterviewTime}
                  </span>
                </div>
              </div>
            </div>

            {/* ── Bottom Business Card Boxes ────────────────────────────── */}
            <div className="mt-2 grid grid-cols-2 gap-3 text-[9px]">
              {/* Father Office Box */}
              <div className="border border-slate-600 rounded p-1.5 min-h-[52px] print:h-[54px] flex flex-col justify-between bg-white/40 shadow-2xs">
                <span className="font-bold block text-slate-800 leading-tight">
                  Office address & Tel No (Father)
                </span>
                {form.father_office_address ? (
                  <p className="text-[8.5px] text-slate-700 leading-tight">
                    {form.father_office_address}
                  </p>
                ) : (
                  <div className="flex-1 flex items-center justify-center text-slate-400 italic text-[8px]">
                    Attach Business Card
                  </div>
                )}
              </div>

              {/* Mother Office Box */}
              <div className="border border-slate-600 rounded p-1.5 min-h-[52px] print:h-[54px] flex flex-col justify-between bg-white/40 shadow-2xs">
                <span className="font-bold block text-slate-800 leading-tight">
                  Office address & Tel No (Mother)
                </span>
                {form.mother_office_address ? (
                  <p className="text-[8.5px] text-slate-700 leading-tight">
                    {form.mother_office_address}
                  </p>
                ) : (
                  <div className="flex-1 flex items-center justify-center text-slate-400 italic text-[8px]">
                    Attach Business Card
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

        {/* ══════════════════════════════════════════════════════════════════
            PART 2 · TEAR-OFF ADMIT CARD FOR ADMISSION TEST (CUT-OUT SLIP)
           ══════════════════════════════════════════════════════════════════ */}
        <section className="admit-card-part pt-2 mt-2 border-t-2 border-dashed border-slate-800 relative">
          {/* Perforated Cut-Line Notice */}
          <div className="flex items-center justify-between text-[8.5px] font-bold text-slate-600 uppercase tracking-widest mb-1.5 px-1">
            <span className="flex items-center gap-1.5 text-slate-800">
              <Scissors className="w-3.5 h-3.5" />
              Cut along this line after printing & preserve as Admit Card
            </span>
            <span className="font-mono text-red-600">SLIP NO: {displayFormNo}</span>
          </div>

          {/* Admit Card Outer Box */}
          <div className="border-2 border-slate-900 rounded-lg p-3 sm:p-3.5 bg-white text-slate-900 shadow-xs relative">
            <div className="flex items-start justify-between gap-3 border-b border-slate-400 pb-1.5 mb-1.5">
              {/* Crest Logo */}
              <div className="w-12 h-12 shrink-0 flex items-center justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/sjis-crest-logo.png"
                  alt="SJIS Crest"
                  className="w-12 h-12 object-contain"
                  onError={(e) => {
                    e.currentTarget.src = '/sjis-logo.png';
                  }}
                />
              </div>

              {/* Title Header */}
              <div className="flex-1 text-center">
                <h3 className="text-xs sm:text-sm font-black uppercase text-[#00183F] tracking-tight">
                  St. Joseph International School (Narinda Campus)
                </h3>
                <p className="text-[8.5px] text-slate-600">
                  32 Shah Shaheb Lane, Narinda, Dhaka 1100
                </p>
                <div className="mt-0.5">
                  <span className="inline-block px-3 py-0.5 rounded bg-[#00183F] text-[#D4AF37] text-[9.5px] sm:text-[10px] font-black uppercase tracking-wider">
                    ADMIT CARD FOR ADMISSION TEST
                  </span>
                </div>
              </div>

              {/* Candidate Admit Photo Box */}
              <div className="w-18 h-22 border-2 border-slate-700 rounded-xs bg-slate-50 shrink-0 overflow-hidden flex flex-col items-center justify-center p-0.5 text-center">
                {form.student_photo_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={form.student_photo_url}
                    alt="Candidate Photo"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-[7px] text-slate-400 font-bold uppercase leading-tight">
                    Candidate Photo
                  </span>
                )}
              </div>
            </div>

            {/* Candidate Details on Admit Card */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 text-[10px] sm:text-[10.5px] leading-snug">
              <div className="flex items-baseline gap-1">
                <span className="font-semibold whitespace-nowrap">Candidate Name:</span>
                <span className="font-bold uppercase tracking-wide flex-1 border-b border-dotted border-slate-500">
                  {candidateFullName}
                </span>
              </div>

              <div className="flex items-baseline gap-1">
                <span className="font-semibold whitespace-nowrap">Form / Roll No:</span>
                <span className="font-mono font-black text-red-600 flex-1 border-b border-dotted border-slate-500">
                  {displayFormNo}
                </span>
              </div>

              <div className="flex items-baseline gap-1">
                <span className="font-semibold whitespace-nowrap">Class / Grade Applied:</span>
                <span className="font-bold text-[#C8102E] flex-1 border-b border-dotted border-slate-500">
                  {form.grade_applying}
                </span>
              </div>

              <div className="flex items-baseline gap-1">
                <span className="font-semibold whitespace-nowrap">Curriculum Stream:</span>
                <span className="font-bold text-[#00183F] flex-1 border-b border-dotted border-slate-500">
                  Cambridge (English Medium)
                </span>
              </div>

              <div className="flex items-baseline gap-1">
                <span className="font-semibold whitespace-nowrap">Date of Admission Test:</span>
                <span className="font-bold text-slate-800 flex-1 border-b border-dotted border-slate-500">
                  {displayInterviewDate}
                </span>
              </div>

              <div className="flex items-baseline gap-1">
                <span className="font-semibold whitespace-nowrap">Reporting Time:</span>
                <span className="font-bold text-slate-800 flex-1 border-b border-dotted border-slate-500">
                  {displayInterviewTime}
                </span>
              </div>

              <div className="col-span-1 sm:col-span-2 flex items-baseline gap-1 pt-0.5">
                <span className="font-semibold whitespace-nowrap">Reporting Venue:</span>
                <span className="text-slate-800 flex-1 border-b border-dotted border-slate-500">
                  {displayInterviewVenue}
                </span>
              </div>
            </div>

            {/* Exam Day Instructions & Document Checklist */}
            <div className="mt-1.5 pt-1 border-t border-slate-200 text-[8.5px] text-slate-600 space-y-0.5 leading-tight">
              <span className="font-bold uppercase text-slate-800 block">
                Instructions for Candidate & Reporting:
              </span>
              <p>1. The candidate MUST bring this printed Admit Card to gain entrance to the examination room.</p>
              <p>2. Please arrive at least 15 minutes before the scheduled interview/exam time ({displayInterviewTime}).</p>
              <p>3. Bring appropriate pencil box and writing stationery. Calculators and mobile devices are strictly prohibited.</p>
              {documentChecklist && documentChecklist.length > 0 && (
                <p className="font-medium text-slate-800 pt-0.5">
                  <strong className="text-[#C8102E]">What to Bring / Documents: </strong>
                  {documentChecklist.map((c) => c.item + (c.required ? ' (Original)' : '')).join(' • ')}
                </p>
              )}
              {reportingInstructions && (
                <p className="text-slate-700 italic pt-0.5">
                  <strong>Reporting Note:</strong> {reportingInstructions}
                </p>
              )}
            </div>

            {/* Signature Rows on Admit Card */}
            <div className="grid grid-cols-2 gap-8 pt-4 pb-0.5 text-[9px] text-center">
              <div>
                <div className="border-b border-slate-700 mx-4 mb-0.5" />
                <span className="font-bold uppercase text-slate-700 block">
                  Candidate / Parent Signature
                </span>
              </div>
              <div>
                <div className="border-b border-slate-700 mx-4 mb-0.5" />
                <span className="font-bold uppercase text-slate-700 block">
                  Admissions Officer / Authorized Seal
                </span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
