'use client';

import React, { useState } from 'react';
import type { OnlineApplicationFormData } from '@/lib/types';
import { Scissors, Printer, FileText } from 'lucide-react';
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
  const [selectedPageSize, setSelectedPageSize] = useState<'A4' | 'Legal'>(pageSize);

  // Compute Clean Form No (e.g. 026110)
  const displayId = applicationId || form.form_no || 'SJIS-2026-DRAFT';
  const displayFormNo =
    formNo ||
    form.form_no ||
    (paymentStatus === 'completed' || paymentStatus === 'not_required'
      ? (() => {
          if (applicationId) {
            const parts = applicationId.split('-');
            const lastPart = parts[parts.length - 1];
            if (!isNaN(Number(lastPart))) {
              return String(lastPart).padStart(6, '0');
            }
          }
          return '026110';
        })()
      : 'PENDING PAYMENT');

  // Candidate Full Name (Block Letters)
  const candidateFullName = (
    `${form.student_first_name || ''} ${form.student_last_name || ''}`.trim() || 'CANDIDATE NAME'
  ).toUpperCase();

  // Son / Daughter of (Father's & Mother's names)
  const sonDaughterOf = (() => {
    const father = form.father_name?.trim();
    const mother = form.mother_name?.trim();
    if (father && mother) return `${father} & ${mother}`;
    if (father) return father;
    if (mother) return mother;
    return '................................................................................';
  })();

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
  const displaySubmissionDate =
    form.submission_deadline ||
    (submittedAt
      ? (() => {
          const d = new Date(submittedAt);
          const day = String(d.getDate()).padStart(2, '0');
          const month = String(d.getMonth() + 1).padStart(2, '0');
          const year = d.getFullYear();
          return `${day}.${month}.${year}`;
        })()
      : '28.06.2026');

  // Interview Date & Time
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

  // Capitalize Religion
  const displayReligion = form.religion
    ? form.religion.charAt(0).toUpperCase() + form.religion.slice(1)
    : 'Islam';

  // Paper styling class (clean white)
  const paperClass = 'bg-white text-black border-slate-300';

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

          {/* Print button */}
          <button
            type="button"
            onClick={() =>
              printDocumentElement(
                'physical-admission-document',
                'St. Joseph International School - Official Document',
                selectedPageSize
              )
            }
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-[#D4AF37] hover:bg-[#c59f2e] text-[#00183F] font-black transition-all cursor-pointer shadow-sm"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print / Save PDF ({selectedPageSize})</span>
          </button>
        </div>
      </div>

      <style>{`
        @media print {
          @page {
            size: ${selectedPageSize === 'Legal' ? '216mm 356mm portrait' : 'A4 portrait'};
            margin: ${selectedPageSize === 'Legal' ? '5mm 7mm 5mm 7mm' : '4mm 6mm 4mm 6mm'};
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
            height: ${selectedPageSize === 'Legal' ? '342mm' : '285mm'} !important;
            max-height: ${selectedPageSize === 'Legal' ? '342mm' : '285mm'} !important;
            margin: 0 auto !important;
            padding: 2mm 3mm !important;
            box-shadow: none !important;
            border: none !important;
            background: #ffffff !important;
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
        className={`${paperClass} transition-colors p-4 sm:p-6 max-w-[210mm] mx-auto text-[10px] sm:text-[10.5px] leading-tight rounded-xl shadow-lg border print:border-none print:shadow-none print:p-0 print:m-0`}
        style={{ fontFamily: 'Georgia, "Times New Roman", Cambria, serif' }}
      >
        {/* ══════════════════════════════════════════════════════════════════
            PART 1 · APPLICATION FOR ADMISSION TEST (TOP HALF)
           ══════════════════════════════════════════════════════════════════ */}
        {!admitCardOnly && (
          <section className="admission-application-part pb-1 flex-1 flex flex-col justify-between">
            {/* Header Block: Crest + Title + Address + Photo Frame */}
            <div>
              <div className="flex items-start justify-between gap-2 sm:gap-3">
                {/* Crest Logo */}
                <div className="w-14 h-14 sm:w-16 sm:h-16 shrink-0 flex items-center justify-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/sjis-crest-logo.png"
                    alt="SJIS Crest"
                    className="w-14 h-14 sm:w-16 sm:h-16 object-contain"
                    onError={(e) => {
                      e.currentTarget.src = '/sjis-logo.png';
                    }}
                  />
                </div>

                {/* Central Title & Address */}
                <div className="flex-1 text-center px-1">
                  <h1 className="text-sm sm:text-base font-bold tracking-tight text-black uppercase leading-tight">
                    APPLICATION FOR ADMISSION TEST
                  </h1>
                  <h2 className="text-xs sm:text-[12.5px] font-bold text-black mt-0.5 leading-tight">
                    St. Joseph International School (Narinda Campus)
                  </h2>
                  <p className="text-[9.5px] sm:text-[10.5px] text-black font-normal leading-tight">
                    32 Shah Shaheb Lane, Narinda, Dhaka 1100
                  </p>
                </div>

                {/* Top-Right Candidate Photograph Frame */}
                <div className="w-20 h-26 sm:w-22 sm:h-28 border border-black bg-white shrink-0 overflow-hidden flex flex-col items-center justify-center p-1 text-center">
                  {form.student_photo_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={form.student_photo_url}
                      alt="Candidate"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-[7px] sm:text-[7.5px] font-bold uppercase tracking-tight text-black leading-tight space-y-0.5">
                      <div>ATTACH A</div>
                      <div>RECENT</div>
                      <div>PASSPORT SIZE</div>
                      <div>PHOTOGRAPH</div>
                      <div>WITH GLUE</div>
                    </div>
                  )}
                </div>
              </div>

              {/* Form No. on Left */}
              <div className="flex items-baseline gap-1.5 mt-[-10px] sm:mt-[-12px] mb-1">
                <span className="text-xs font-semibold text-black whitespace-nowrap">
                  Form No..
                </span>
                <span className="font-mono text-sm sm:text-base font-bold text-black px-1 min-w-[130px] border-b border-dotted border-black inline-block">
                  {displayFormNo}
                </span>
                <span className="font-mono text-[9px] text-slate-500 ml-1 no-print">
                  ({displayId})
                </span>
              </div>

              {/* Instruction Banner */}
              <div className="text-center my-0.5 pb-0.5">
                <p className="text-[10px] sm:text-[10.5px] font-bold uppercase tracking-wide text-black">
                  (PLEASE USE BLOCK LETTERS TO FILL UP THE FORM)
                </p>
              </div>
            </div>

            {/* ── Form Fields 1 to 11 (Verbatim Match to Physical Form) ── */}
            <div className="space-y-1 sm:space-y-1.5 text-[10px] sm:text-[10.5px] text-black leading-snug">
              {/* Field 1: Full name */}
              <div className="flex items-baseline gap-1">
                <span className="font-semibold whitespace-nowrap">
                  1. Full name of candidate (cannot be changed):
                </span>
                <span className="flex-1 font-bold uppercase px-2 border-b border-dotted border-black min-h-[16px]">
                  {candidateFullName}
                </span>
              </div>

              {/* Field 2: Date of Birth & Religion */}
              <div>
                <div className="flex items-baseline gap-1.5">
                  <span className="font-semibold whitespace-nowrap">
                    2. Authentic Date of Birth (cannot be changed)
                  </span>
                  <span className="font-bold px-2 border-b border-dotted border-black min-w-[120px] sm:min-w-[140px] text-center">
                    {formattedDob || '—'}
                  </span>
                  <span className="font-semibold whitespace-nowrap ml-2">Religion:</span>
                  <span className="flex-1 font-bold px-2 border-b border-dotted border-black min-h-[16px]">
                    {displayReligion}
                  </span>
                </div>
                <div className="text-[8.5px] sm:text-[9px] text-black font-normal mt-[-1px]">
                  (As per Govt/Church birth certificate)
                </div>
              </div>

              {/* Field 3: Father's Name & Occupation */}
              <div className="flex items-baseline gap-1.5">
                <span className="font-semibold whitespace-nowrap">3. Father's Name</span>
                <span className="flex-1 font-bold px-2 border-b border-dotted border-black min-h-[16px]">
                  {form.father_name || '—'}
                </span>
                <span className="font-semibold whitespace-nowrap ml-2">Occupation:</span>
                <span className="w-1/3 sm:w-2/5 font-bold px-2 border-b border-dotted border-black min-h-[16px]">
                  {form.father_profession || '—'}
                </span>
              </div>

              {/* Field 4: Mother's Name & Occupation */}
              <div className="flex items-baseline gap-1.5">
                <span className="font-semibold whitespace-nowrap">4. Mother's Name</span>
                <span className="flex-1 font-bold px-2 border-b border-dotted border-black min-h-[16px]">
                  {form.mother_name || '—'}
                </span>
                <span className="font-semibold whitespace-nowrap ml-2">Occupation:</span>
                <span className="w-1/3 sm:w-2/5 font-bold px-2 border-b border-dotted border-black min-h-[16px]">
                  {form.mother_profession || '—'}
                </span>
              </div>

              {/* Field 5: Present Address */}
              <div className="flex items-baseline gap-1">
                <span className="font-semibold whitespace-nowrap">5. Present Address</span>
                <span className="flex-1 font-normal px-2 border-b border-dotted border-black min-h-[16px]">
                  {form.present_address || '—'}
                </span>
              </div>

              {/* Field 6: Contact Number (Father & Mother) */}
              <div className="flex items-baseline gap-1.5">
                <span className="font-semibold whitespace-nowrap">
                  6. Contact Number (Father)
                </span>
                <span className="flex-1 font-bold px-2 border-b border-dotted border-black min-h-[16px]">
                  {form.father_phone || form.contact_phone || '—'}
                </span>
                <span className="font-semibold whitespace-nowrap ml-2">(Mother)</span>
                <span className="flex-1 font-bold px-2 border-b border-dotted border-black min-h-[16px]">
                  {form.mother_phone || '—'}
                </span>
              </div>

              {/* Field 7: Class/Grade applying */}
              <div className="flex items-baseline gap-1">
                <span className="font-semibold whitespace-nowrap">
                  7. Class/Grade for which application is being made
                </span>
                <span className="flex-1 font-bold text-xs sm:text-[13px] px-2 border-b border-dotted border-black min-h-[16px]">
                  {form.grade_applying || '—'}
                </span>
              </div>

              {/* Field 8: Gender & Field 9: Student living with (Single Line) */}
              <div className="flex flex-wrap items-center justify-between gap-y-1">
                {/* Field 8 */}
                <div className="flex items-center gap-1.5">
                  <span className="font-semibold">8. Gender:</span>
                  <span className="ml-1">Male</span>
                  <span className="w-3.5 h-3.5 border border-black inline-flex items-center justify-center font-bold text-[9px] bg-white/60">
                    {form.gender?.toLowerCase() === 'male' ? '✓' : ''}
                  </span>
                  <span className="ml-2">Female</span>
                  <span className="w-3.5 h-3.5 border border-black inline-flex items-center justify-center font-bold text-[9px] bg-white/60">
                    {form.gender?.toLowerCase() === 'female' ? '✓' : ''}
                  </span>
                </div>

                {/* Field 9 */}
                <div className="flex items-center gap-1.5">
                  <span className="font-semibold">9. Student living with</span>
                  <span className="w-3.5 h-3.5 border border-black inline-flex items-center justify-center font-bold text-[9px] bg-white/60 ml-1">
                    {form.student_living_with === 'parents' ? '✓' : ''}
                  </span>
                  <span>Parents</span>
                  <span className="w-3.5 h-3.5 border border-black inline-flex items-center justify-center font-bold text-[9px] bg-white/60 ml-1">
                    {form.student_living_with === 'father' ? '✓' : ''}
                  </span>
                  <span>Father</span>
                  <span className="w-3.5 h-3.5 border border-black inline-flex items-center justify-center font-bold text-[9px] bg-white/60 ml-1">
                    {form.student_living_with === 'mother' ? '✓' : ''}
                  </span>
                  <span>Mother</span>
                  <span className="w-3.5 h-3.5 border border-black inline-flex items-center justify-center font-bold text-[9px] bg-white/60 ml-1">
                    {form.student_living_with === 'other' ? '✓' : ''}
                  </span>
                  <span>Other</span>
                </div>
              </div>

              {/* Field 10: School & Class currently studying */}
              <div className="flex items-baseline gap-1">
                <span className="font-semibold whitespace-nowrap">
                  10. School & Class in which the candidate is studying this year:
                </span>
                <span className="flex-1 font-normal px-2 border-b border-dotted border-black min-h-[16px]">
                  {form.current_school_and_class || form.previous_school_name || 'None / First Admission'}
                </span>
              </div>

              {/* Field 11: Sibling Information */}
              <div className="flex items-baseline gap-1.5">
                <span className="font-semibold whitespace-nowrap">
                  11. If any sibling studying in this school Name:
                </span>
                <span className="flex-1 font-normal px-2 border-b border-dotted border-black min-h-[16px]">
                  {form.sibling_name || (form.sibling_at_sjis ? form.sibling_name_class : '—')}
                </span>
                <span className="font-semibold whitespace-nowrap ml-1">Class:</span>
                <span className="w-12 sm:w-16 font-normal px-1 border-b border-dotted border-black min-h-[16px] text-center">
                  {form.sibling_class || '—'}
                </span>
                <span className="font-semibold whitespace-nowrap ml-1">Section:</span>
                <span className="w-12 sm:w-16 font-normal px-1 border-b border-dotted border-black min-h-[16px] text-center">
                  {form.sibling_section || '—'}
                </span>
                <span className="font-semibold whitespace-nowrap ml-1">Roll:</span>
                <span className="w-12 sm:w-16 font-normal px-1 border-b border-dotted border-black min-h-[16px] text-center">
                  {form.sibling_roll || '—'}
                </span>
              </div>
            </div>

            {/* ── Submission Deadline, Declaration, Office Use & Signature ── */}
            <div className="mt-1.5 space-y-1 text-[9.5px] sm:text-[10px] text-black">
              {/* Submission Date */}
              <div className="flex items-baseline gap-1">
                <span className="font-bold">The candidate must submit this form on</span>
                <span className="font-bold px-2 border-b border-dotted border-black min-w-[160px] text-center">
                  {displaySubmissionDate}
                </span>
              </div>

              {/* Undertaking Declaration */}
              <p className="font-bold text-justify leading-snug">
                I hereby declare that all of the above information is correct and authentic. I will not request for any change of these information in future.
              </p>

              {/* Received by & Signature Row */}
              <div className="grid grid-cols-2 gap-6 pt-2 pb-0.5">
                <div className="space-y-1">
                  <div className="flex items-baseline gap-1">
                    <span className="whitespace-nowrap">Received by:</span>
                    <span className="flex-1 border-b border-dotted border-black px-1 font-medium">
                      {form.received_by || ''}
                    </span>
                    <span className="whitespace-nowrap ml-1">Date:</span>
                    <span className="w-20 border-b border-dotted border-black px-1 text-center font-medium">
                      {displaySubmissionDate}
                    </span>
                  </div>

                  <div className="flex items-baseline gap-1 pt-0.5">
                    <span className="whitespace-nowrap">For Office Use:</span>
                    <span className="flex-1 border-b border-dotted border-black px-1 font-medium">
                      {/* For Office Use blank line */}
                    </span>
                  </div>

                  <div className="flex items-baseline gap-1">
                    <span className="whitespace-nowrap">Date of interview:</span>
                    <span className="flex-1 border-b border-dotted border-black px-1 font-bold">
                      {displayInterviewDate}
                    </span>
                  </div>

                  <div className="flex items-baseline gap-1">
                    <span className="whitespace-nowrap">Time:</span>
                    <span className="flex-1 border-b border-dotted border-black px-1 font-bold">
                      {displayInterviewTime}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col justify-start items-end pt-2">
                  <div className="w-44 sm:w-52 border-b border-dotted border-black mb-1" />
                  <span className="font-normal text-[9px] sm:text-[9.5px] text-right">
                    Signature of Parent/Guardian
                  </span>
                </div>
              </div>

              {/* Two Bottom Business Card Boxes */}
              <div className="grid grid-cols-2 gap-3 pt-0.5">
                <div className="border border-black p-1.5 h-13 sm:h-14 flex flex-col justify-between text-[8.5px] sm:text-[9px] bg-white/40">
                  <span className="font-bold block leading-tight">
                    Office address & Tel No (Father)
                  </span>
                  {form.father_office_address ? (
                    <span className="text-[8px] sm:text-[8.5px] line-clamp-2 leading-tight">
                      {form.father_office_address}
                    </span>
                  ) : (
                    <div className="flex-1 flex items-center justify-center text-black/60 italic text-[8px]">
                      Attach Business Card
                    </div>
                  )}
                </div>

                <div className="border border-black p-1.5 h-13 sm:h-14 flex flex-col justify-between text-[8.5px] sm:text-[9px] bg-white/40">
                  <span className="font-bold block leading-tight">
                    Office address & Tel No (Mother)
                  </span>
                  {form.mother_office_address ? (
                    <span className="text-[8px] sm:text-[8.5px] line-clamp-2 leading-tight">
                      {form.mother_office_address}
                    </span>
                  ) : (
                    <div className="flex-1 flex items-center justify-center text-black/60 italic text-[8px]">
                      Attach Business Card
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ══════════════════════════════════════════════════════════════════
            PERFORATED TEAR-OFF LINE
           ══════════════════════════════════════════════════════════════════ */}
        {!admitCardOnly && (
          <div className="relative my-2 sm:my-2.5 border-t border-dotted border-black">
            <div className="absolute -top-2 left-3 px-2 bg-inherit text-[8px] sm:text-[8.5px] font-bold uppercase tracking-wider flex items-center gap-1.5 text-black">
              <Scissors className="w-2.5 h-2.5" />
              <span>Tear-off / Cut along this line</span>
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════════
            PART 2 · ADMIT CARD (EXACT VERBATIM MATCH TO PHYSICAL SLIP)
           ══════════════════════════════════════════════════════════════════ */}
        <section className="admit-card-part pt-0.5">
          {/* Header Block: Crest + Title + Address + Form No on left/center; Photo Box on right */}
          <div className="grid grid-cols-[auto_1fr_auto] gap-2 sm:gap-3 items-start mb-1.5">
            {/* Crest */}
            <div className="w-13 h-13 sm:w-15 sm:h-15 shrink-0 flex items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/sjis-crest-logo.png"
                alt="SJIS Crest"
                className="w-13 h-13 sm:w-15 sm:h-15 object-contain"
                onError={(e) => {
                  e.currentTarget.src = '/sjis-logo.png';
                }}
              />
            </div>

            {/* Center Title + School Address + Form No */}
            <div className="flex flex-col justify-between h-full text-center px-1">
              <div>
                <h3 className="text-sm sm:text-base font-bold text-black uppercase tracking-normal leading-tight">
                  ADMIT CARD
                </h3>
                <h4 className="text-xs sm:text-[12px] font-bold text-black mt-0.5 leading-tight">
                  St. Joseph International School (Narinda Campus)
                </h4>
                <p className="text-[9.5px] sm:text-[10px] text-black font-normal leading-tight">
                  32 Shah Shaheb Lane, Narinda, Dhaka 1100
                </p>
              </div>

              {/* Form No.. (positioned under school address, to the left of photo box) */}
              <div className="flex items-baseline gap-1.5 mt-2 text-left">
                <span className="text-xs font-semibold text-black whitespace-nowrap">
                  Form No..
                </span>
                <span className="font-mono text-sm sm:text-base font-bold text-black px-1 min-w-[140px] border-b border-dotted border-black inline-block">
                  {displayFormNo}
                </span>
              </div>
            </div>

            {/* Right Photo Box */}
            <div className="w-20 h-26 sm:w-22 sm:h-28 border border-black bg-white shrink-0 overflow-hidden flex flex-col items-center justify-center p-1 text-center">
              {form.student_photo_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={form.student_photo_url}
                  alt="Candidate"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-[6.5px] sm:text-[7px] font-bold uppercase tracking-tight text-black leading-tight space-y-0.5">
                  <div>ATTACH A</div>
                  <div>RECENT</div>
                  <div>PASSPORT SIZE</div>
                  <div>PHOTOGRAPH</div>
                  <div>WITH GLUE</div>
                </div>
              )}
            </div>
          </div>

          {/* Candidate Details on Admit Card */}
          <div className="space-y-1 text-[10px] sm:text-[10.5px] text-black leading-snug">
            {/* Name */}
            <div className="flex items-baseline gap-1">
              <span className="font-semibold whitespace-nowrap">Name:</span>
              <span className="flex-1 font-bold uppercase px-2 border-b border-dotted border-black min-h-[16px]">
                {candidateFullName}
              </span>
            </div>

            {/* Son/Daughter of */}
            <div className="flex items-baseline gap-1">
              <span className="font-semibold whitespace-nowrap">Son/Daughter of:</span>
              <span className="flex-1 font-bold px-2 border-b border-dotted border-black min-h-[16px]">
                {sonDaughterOf}
              </span>
            </div>

            {/* Admission Test Details Sentence */}
            <p className="pt-0.5 leading-relaxed text-justify">
              <span>may face interview/write the admission test for class </span>
              <span className="font-bold border-b border-dotted border-black px-2 inline-block min-w-[90px] text-center">
                {form.grade_applying || '........................'}
              </span>
              <span> to be held on </span>
              <span className="font-bold border-b border-dotted border-black px-2 inline-block min-w-[100px] text-center">
                {displayInterviewDate || '....................'}
              </span>
              <span> at </span>
              <span className="font-bold border-b border-dotted border-black px-2 inline-block min-w-[65px] text-center">
                {displayInterviewTime || '.............'}
              </span>
              <span> the candidate should bring a ballpoint pen, ruler and admit card. Paper will be supplied by the School.</span>
            </p>

            {/* Principal Signature & Date Row */}
            <div className="flex items-end justify-between pt-4 sm:pt-5 pb-0.5">
              <div className="w-52 sm:w-60">
                <div className="border-b border-dotted border-black mb-1" />
                <span className="font-bold text-[10px] sm:text-[10.5px] block">
                  Principal
                </span>
              </div>

              <div className="flex items-baseline gap-1">
                <span className="font-semibold">Date:</span>
                <span className="font-bold border-b border-dotted border-black px-2 min-w-[90px] text-center inline-block">
                  {displaySubmissionDate || '........................'}
                </span>
              </div>
            </div>

            {/* N.B. (Important Rules Verbatim from Photo) */}
            <div className="pt-0.5 text-[9px] sm:text-[9.5px] leading-tight space-y-0.5">
              <span className="font-bold block">N.B:</span>
              <p>1. The candidate must bring this admit card with her/him at the time of the interview/ Admission Test.</p>
              <p>2. Scripts of admission test will not be returned or shown to the students or guardians.</p>
              <p>3. For providing incorrect information, a student will be considered disqualified.</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
