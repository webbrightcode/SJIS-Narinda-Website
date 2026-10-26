'use client';

import React, { useState } from 'react';
import type { OnlineApplicationFormData } from '@/lib/types';
import { Scissors, Printer, FileText, AlertTriangle, Info } from 'lucide-react';
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
  const [selectedPageSize, setSelectedPageSize] = useState<'A4' | 'Legal'>(pageSize || 'A4');

  // Compute Clean Form No (e.g. 026110)
  const displayId = applicationId || form.form_no || 'SJIS-2027-DRAFT';
  const displayFormNo =
    formNo ||
    form.form_no ||
    (paymentStatus === 'completed' || paymentStatus === 'not_required'
      ? (() => {
          if (applicationId) {
            const parts = applicationId.split('-');
            const lastPart = parts[parts.length - 1];
            if (!isNaN(Number(lastPart))) {
              const num = String(Number(lastPart));
              return `27${num.padStart(4, '0')}`;
            }
          }
          return '270001';
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
  const activePageSize = selectedPageSize || pageSize || 'A4';
  const isLegal = activePageSize === 'Legal';
  const pageCss = isLegal
    ? 'size: 216mm 356mm portrait; margin: 3mm 5mm 3mm 5mm;'
    : 'size: A4 portrait; margin: 3mm 5mm 3mm 5mm;'

  return (
    <div className="printable-form-wrapper w-full">
      {/* Paper Requirement Note Banner */}
      <div className="no-print mb-3 p-3.5 rounded-xl bg-amber-50 border-2 border-amber-300 text-amber-950 flex items-start gap-3 shadow-xs">
        <Info className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <span className="font-black text-amber-950 uppercase tracking-wide text-xs">
              Single-Page Admission Document Standard
            </span>
            <span className="px-2 py-0.5 bg-amber-200/90 text-amber-950 text-[10px] font-black rounded-md uppercase tracking-wider">
              1-Page Fit
            </span>
          </div>
          <p className="text-[11.5px] text-amber-900 leading-relaxed font-medium">
            This official St. Joseph International School document contains both the <strong>Application Form (Part 1)</strong> and the <strong>Admit Card (Part 2)</strong> formatted to strictly fit on a <strong>single continuous page</strong>. It is fully compatible with standard <strong>A4</strong> and <strong>Legal</strong> printers.
          </p>
        </div>
      </div>

      {/* On-screen Toolbar (Hidden during print) */}
      <div className="no-print mb-4 p-3 rounded-2xl bg-slate-900 text-white flex flex-wrap items-center justify-between gap-3 text-xs shadow-md">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-[#D4AF37]" />
          <span className="font-bold">
            Official Physical Form &amp; Admit Card
          </span>
          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/40">
            1-Page Sheet ({activePageSize})
          </span>
          {paymentStatus === 'completed' && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              ✓ Verified &amp; Paid
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Print button */}
          <button
            type="button"
            onClick={() =>
              printDocumentElement(
                'physical-admission-document',
                'St. Joseph International School - Official Document',
                activePageSize
              )
            }
            className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-[#D4AF37] hover:bg-[#c59f2e] text-[#00183F] font-black transition-all cursor-pointer shadow-sm text-xs"
          >
            <Printer className="w-4 h-4" />
            <span>Print Single-Page Form ({activePageSize})</span>
          </button>
        </div>
      </div>

      <style>{`
        @media print {
          @page {
            ${pageCss}
          }
          html, body {
            background: #ffffff !important;
            color: #000000 !important;
            margin: 0 !important;
            padding: 0 !important;
            width: 100% !important;
            height: 100% !important;
            max-height: 100% !important;
            overflow: hidden !important;
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
            height: 100% !important;
            max-height: 100% !important;
            margin: 0 auto !important;
            padding: 2mm 3.5mm !important;
            box-shadow: none !important;
            border: none !important;
            background: #ffffff !important;
            color: #000000 !important;
            page-break-after: avoid !important;
            break-after: avoid !important;
            page-break-inside: avoid !important;
            break-inside: avoid !important;
            overflow: hidden !important;
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
            justify-content: flex-start !important;
            gap: 1mm !important;
            padding-bottom: 0.5mm !important;
            page-break-inside: avoid !important;
            break-inside: avoid !important;
            page-break-after: avoid !important;
            break-after: avoid !important;
          }
          .admit-card-part {
            flex-shrink: 0 !important;
            margin-top: auto !important;
            page-break-inside: avoid !important;
            break-inside: avoid !important;
            page-break-after: avoid !important;
            break-after: avoid !important;
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
          <section className="admission-application-part pb-1 print:pb-0 flex-1 flex flex-col justify-start space-y-1 print:space-y-1">
            {/* Header Block: Crest + Title + Address + Form No on left/center; Photo Box on right */}
            <div className="grid grid-cols-[auto_1fr_auto] gap-2 sm:gap-3 print:gap-3 items-start mb-1 print:mb-0.5">
              {/* Crest Logo */}
              <div className="w-16 h-16 sm:w-20 sm:h-20 print:w-16 print:h-16 shrink-0 flex items-center justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/sjis-crest-logo.png"
                  alt="SJIS Crest"
                  className="w-16 h-16 sm:w-20 sm:h-20 print:w-16 print:h-16 object-contain"
                  onError={(e) => {
                    e.currentTarget.src = '/sjis-logo.png';
                  }}
                />
              </div>

              {/* Central Title, School Name, Address, Form No, and Instruction Banner */}
              <div className="flex flex-col justify-between h-full text-center px-1">
                <div>
                  <h1 className="text-sm sm:text-base print:text-[15px] font-bold tracking-tight text-black uppercase leading-tight">
                    APPLICATION FOR ADMISSION TEST
                  </h1>
                  <h2 className="text-xs sm:text-[12.5px] print:text-[12.5px] font-bold text-black mt-0.5 print:mt-0.5 leading-tight">
                    St. Joseph International School (Narinda Campus)
                  </h2>
                  <p className="text-[9.5px] sm:text-[10.5px] print:text-[10px] text-black font-normal leading-tight">
                    32 Shah Shaheb Lane, Narinda, Dhaka 1100
                  </p>
                </div>

                {/* Form No. Row */}
                <div className="flex items-baseline gap-1.5 mt-1 print:mt-1 text-left">
                  <span className="text-xs print:text-[11.5px] font-semibold text-black whitespace-nowrap">
                    Form No..
                  </span>
                  <span className="font-mono text-sm sm:text-base print:text-[15px] font-bold text-black px-1 min-w-[140px] print:min-w-[130px] border-b border-dotted border-black inline-block">
                    {displayFormNo}
                  </span>
                  <span className="font-mono text-[9px] text-slate-500 ml-1 no-print">
                    ({displayId})
                  </span>
                </div>

                {/* Instruction Banner */}
                <div className="text-center mt-0.5 print:mt-0.5">
                  <p className="text-[10px] sm:text-[10.5px] print:text-[9.5px] font-bold uppercase tracking-wide text-black">
                    (PLEASE USE BLOCK LETTERS TO FILL UP THE FORM)
                  </p>
                </div>
              </div>

              {/* Top-Right Candidate Photograph Frame */}
              <div className="w-20 h-26 sm:w-22 sm:h-28 print:w-20 print:h-26 border border-black bg-white shrink-0 overflow-hidden flex flex-col items-center justify-center p-1 text-center">
                {form.student_photo_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={form.student_photo_url}
                    alt="Candidate"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-[7px] sm:text-[7.5px] print:text-[7px] font-bold uppercase tracking-tight text-black leading-tight space-y-0.5">
                    <div>ATTACH A</div>
                    <div>RECENT</div>
                    <div>PASSPORT SIZE</div>
                    <div>PHOTOGRAPH</div>
                    <div>WITH GLUE</div>
                  </div>
                )}
              </div>
            </div>

            {/* ── Form Fields 1 to 11 (Verbatim Match to Physical Form) ── */}
            <div className="space-y-1 sm:space-y-1.5 print:space-y-1 text-[10px] sm:text-[10.5px] print:text-[10px] text-black leading-snug print:leading-normal">
              {/* Field 1: Full name */}
              <div className="flex items-baseline gap-1">
                <span className="font-semibold whitespace-nowrap">
                  1. Full name of candidate (cannot be changed):
                </span>
                <span className="flex-1 font-bold uppercase px-2 border-b border-dotted border-black min-h-[16px] print:min-h-[17px]">
                  {candidateFullName}
                </span>
              </div>

              {/* Field 2: Date of Birth & Religion */}
              <div>
                <div className="flex items-baseline gap-1.5">
                  <span className="font-semibold whitespace-nowrap">
                    2. Authentic Date of Birth (cannot be changed)
                  </span>
                  <span className="font-bold px-2 border-b border-dotted border-black min-w-[120px] sm:min-w-[140px] print:min-w-[120px] text-center">
                    {formattedDob || '—'}
                  </span>
                  <span className="font-semibold whitespace-nowrap ml-2">Religion:</span>
                  <span className="flex-1 font-bold px-2 border-b border-dotted border-black min-h-[16px] print:min-h-[17px]">
                    {displayReligion}
                  </span>
                </div>
                <div className="text-[8.5px] sm:text-[9px] print:text-[8px] text-black font-normal mt-[-1px]">
                  (As per Govt/Church birth certificate)
                </div>
              </div>

              {/* Field 3: Father's Name & Occupation */}
              <div className="flex items-baseline gap-1.5">
                <span className="font-semibold whitespace-nowrap">3. Father's Name</span>
                <span className="flex-1 font-bold px-2 border-b border-dotted border-black min-h-[16px] print:min-h-[17px]">
                  {form.father_name || '—'}
                </span>
                <span className="font-semibold whitespace-nowrap ml-2">Occupation:</span>
                <span className="w-1/3 sm:w-2/5 font-bold px-2 border-b border-dotted border-black min-h-[16px] print:min-h-[17px]">
                  {form.father_profession || '—'}
                </span>
              </div>

              {/* Field 4: Mother's Name & Occupation */}
              <div className="flex items-baseline gap-1.5">
                <span className="font-semibold whitespace-nowrap">4. Mother's Name</span>
                <span className="flex-1 font-bold px-2 border-b border-dotted border-black min-h-[16px] print:min-h-[17px]">
                  {form.mother_name || '—'}
                </span>
                <span className="font-semibold whitespace-nowrap ml-2">Occupation:</span>
                <span className="w-1/3 sm:w-2/5 font-bold px-2 border-b border-dotted border-black min-h-[16px] print:min-h-[17px]">
                  {form.mother_profession || '—'}
                </span>
              </div>

              {/* Field 5: Present Address */}
              <div className="flex items-baseline gap-1">
                <span className="font-semibold whitespace-nowrap">5. Present Address</span>
                <span className="flex-1 font-normal px-2 border-b border-dotted border-black min-h-[16px] print:min-h-[17px]">
                  {form.present_address || '—'}
                </span>
              </div>

              {/* Field 6: Contact Number (Father & Mother) */}
              <div className="flex items-baseline gap-1.5">
                <span className="font-semibold whitespace-nowrap">
                  6. Contact Number (Father)
                </span>
                <span className="flex-1 font-bold px-2 border-b border-dotted border-black min-h-[16px] print:min-h-[17px]">
                  {form.father_phone || form.contact_phone || '—'}
                </span>
                <span className="font-semibold whitespace-nowrap ml-2">(Mother)</span>
                <span className="flex-1 font-bold px-2 border-b border-dotted border-black min-h-[16px] print:min-h-[17px]">
                  {form.mother_phone || '—'}
                </span>
              </div>

              {/* Field 7: Class/Grade applying */}
              <div className="flex items-baseline gap-1">
                <span className="font-semibold whitespace-nowrap">
                  7. Class/Grade for which application is being made
                </span>
                <span className="flex-1 font-bold text-xs sm:text-[13px] print:text-[12px] px-2 border-b border-dotted border-black min-h-[16px] print:min-h-[17px]">
                  {form.grade_applying || '—'}
                </span>
              </div>

              {/* Field 8: Gender & Field 9: Student living with (Single Line) */}
              <div className="flex flex-wrap items-center justify-between gap-y-1">
                {/* Field 8 */}
                <div className="flex items-center gap-1.5">
                  <span className="font-semibold">8. Gender:</span>
                  <span className="ml-1">Male</span>
                  <span className="w-3.5 h-3.5 print:w-3.5 print:h-3.5 border border-black inline-flex items-center justify-center font-bold text-[9px] print:text-[9px] bg-white/60">
                    {form.gender?.toLowerCase() === 'male' ? '✓' : ''}
                  </span>
                  <span className="ml-2">Female</span>
                  <span className="w-3.5 h-3.5 print:w-3.5 print:h-3.5 border border-black inline-flex items-center justify-center font-bold text-[9px] print:text-[9px] bg-white/60">
                    {form.gender?.toLowerCase() === 'female' ? '✓' : ''}
                  </span>
                </div>

                {/* Field 9 */}
                <div className="flex items-center gap-1.5">
                  <span className="font-semibold">9. Student living with</span>
                  <span className="w-3.5 h-3.5 print:w-3.5 print:h-3.5 border border-black inline-flex items-center justify-center font-bold text-[9px] print:text-[9px] bg-white/60 ml-1">
                    {form.student_living_with === 'parents' ? '✓' : ''}
                  </span>
                  <span>Parents</span>
                  <span className="w-3.5 h-3.5 print:w-3.5 print:h-3.5 border border-black inline-flex items-center justify-center font-bold text-[9px] print:text-[9px] bg-white/60 ml-1">
                    {form.student_living_with === 'father' ? '✓' : ''}
                  </span>
                  <span>Father</span>
                  <span className="w-3.5 h-3.5 print:w-3.5 print:h-3.5 border border-black inline-flex items-center justify-center font-bold text-[9px] print:text-[9px] bg-white/60 ml-1">
                    {form.student_living_with === 'mother' ? '✓' : ''}
                  </span>
                  <span>Mother</span>
                  <span className="w-3.5 h-3.5 print:w-3.5 print:h-3.5 border border-black inline-flex items-center justify-center font-bold text-[9px] print:text-[9px] bg-white/60 ml-1">
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
                <span className="flex-1 font-normal px-2 border-b border-dotted border-black min-h-[16px] print:min-h-[17px]">
                  {form.current_school_and_class || form.previous_school_name || 'None / First Admission'}
                </span>
              </div>

              {/* Field 11: Sibling Information */}
              <div className="flex items-baseline gap-1.5">
                <span className="font-semibold whitespace-nowrap">
                  11. If any sibling studying in this school Name:
                </span>
                <span className="flex-1 font-normal px-2 border-b border-dotted border-black min-h-[16px] print:min-h-[17px]">
                  {form.sibling_name || (form.sibling_at_sjis ? form.sibling_name_class : '—')}
                </span>
                <span className="font-semibold whitespace-nowrap ml-1">Class:</span>
                <span className="w-12 sm:w-16 print:w-12 font-normal px-1 border-b border-dotted border-black min-h-[16px] print:min-h-[17px] text-center">
                  {form.sibling_class || '—'}
                </span>
                <span className="font-semibold whitespace-nowrap ml-1">Section:</span>
                <span className="w-12 sm:w-16 print:w-12 font-normal px-1 border-b border-dotted border-black min-h-[16px] print:min-h-[17px] text-center">
                  {form.sibling_section || '—'}
                </span>
                <span className="font-semibold whitespace-nowrap ml-1">Roll:</span>
                <span className="w-12 sm:w-16 print:w-12 font-normal px-1 border-b border-dotted border-black min-h-[16px] print:min-h-[17px] text-center">
                  {form.sibling_roll || '—'}
                </span>
              </div>
            </div>

            {/* ── Submission Deadline, Declaration, Office Use & Signature ── */}
            <div className="mt-2 print:mt-1.5 space-y-1 print:space-y-1 text-[9.5px] sm:text-[10px] print:text-[9.5px] text-black">
              {/* Submission Date */}
              <div className="flex items-baseline gap-1">
                <span className="font-bold">The candidate must submit this form on</span>
                <span className="font-bold px-2 border-b border-dotted border-black min-w-[160px] print:min-w-[130px] text-center">
                  {displaySubmissionDate}
                </span>
              </div>

              {/* Undertaking Declaration */}
              <p className="font-bold text-justify leading-snug print:leading-snug">
                I hereby declare that all of the above information is correct and authentic. I will not request for any change of these information in future.
              </p>

              {/* Received by & Signature Row */}
              <div className="grid grid-cols-2 gap-6 print:gap-5 pt-2 print:pt-1.5 pb-0.5 print:pb-0.5">
                <div className="space-y-1 print:space-y-0.5">
                  <div className="flex items-baseline gap-1">
                    <span className="whitespace-nowrap">Received by:</span>
                    <span className="flex-1 border-b border-dotted border-black px-1 font-medium">
                      {form.received_by || ''}
                    </span>
                    <span className="whitespace-nowrap ml-1">Date:</span>
                    <span className="w-20 print:w-18 border-b border-dotted border-black px-1 text-center font-medium">
                      {displaySubmissionDate}
                    </span>
                  </div>

                  <div className="flex items-baseline gap-1 pt-0.5 print:pt-0">
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

                <div className="flex flex-col justify-start items-end pt-3 print:pt-3">
                  <div className="w-44 sm:w-52 print:w-46 border-b border-dotted border-black mb-1.5" />
                  <span className="font-normal text-[9px] sm:text-[9.5px] print:text-[9px] text-right">
                    Signature of Parent/Guardian
                  </span>
                </div>
              </div>

              {/* Two Bottom Business Card Boxes */}
              <div className="grid grid-cols-2 gap-3 print:gap-3 pt-1.5 print:pt-1">
                <div className="border border-black p-2 print:p-2.5 h-18 sm:h-20 print:h-18 flex flex-col justify-between text-[8.5px] sm:text-[9.5px] print:text-[9px] bg-white/40">
                  <span className="font-bold block leading-tight text-[9px] sm:text-[10px] print:text-[9.5px]">
                    Office address &amp; Tel No (Father)
                  </span>
                  {form.father_office_address ? (
                    <span className="text-[8px] sm:text-[9px] print:text-[8.5px] line-clamp-3 leading-tight mt-1">
                      {form.father_office_address}
                    </span>
                  ) : (
                    <div className="flex-1 flex items-center justify-center text-black/60 italic text-[8.5px] sm:text-[9px] print:text-[8.5px]">
                      Attach Business Card
                    </div>
                  )}
                </div>

                <div className="border border-black p-2 print:p-2.5 h-18 sm:h-20 print:h-18 flex flex-col justify-between text-[8.5px] sm:text-[9.5px] print:text-[9px] bg-white/40">
                  <span className="font-bold block leading-tight text-[9px] sm:text-[10px] print:text-[9.5px]">
                    Office address &amp; Tel No (Mother)
                  </span>
                  {form.mother_office_address ? (
                    <span className="text-[8px] sm:text-[9px] print:text-[8.5px] line-clamp-3 leading-tight mt-1">
                      {form.mother_office_address}
                    </span>
                  ) : (
                    <div className="flex-1 flex items-center justify-center text-black/60 italic text-[8.5px] sm:text-[9px] print:text-[8.5px]">
                      Attach Business Card
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ══════════════════════════════════════════════════════════════════
            PERFORATED CUT LINE (With Scissors Icon)
           ══════════════════════════════════════════════════════════════════ */}
        {!admitCardOnly && (
          <div className="relative my-3 sm:my-3.5 print:my-2.5 border-t border-dotted border-black">
            <div className="absolute -top-2 left-1/2 -translate-x-1/2 px-2 bg-white text-black flex items-center">
              <Scissors className="w-3.5 h-3.5 text-black" />
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════════
            PART 2 · ADMIT CARD (EXACT VERBATIM MATCH TO PHYSICAL SLIP)
           ══════════════════════════════════════════════════════════════════ */}
        <section className="admit-card-part pt-0.5 print:pt-0.5">
          {/* Header Block: Crest + Title + Address + Form No on left/center; Photo Box on right */}
          <div className="grid grid-cols-[auto_1fr_auto] gap-2 sm:gap-3 print:gap-3 items-start mb-1.5 print:mb-1">
            {/* Crest */}
            <div className="w-15 h-15 sm:w-18 sm:h-18 print:w-15 print:h-15 shrink-0 flex items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/sjis-crest-logo.png"
                alt="SJIS Crest"
                className="w-15 h-15 sm:w-18 sm:h-18 print:w-15 print:h-15 object-contain"
                onError={(e) => {
                  e.currentTarget.src = '/sjis-logo.png';
                }}
              />
            </div>

            {/* Center Title + School Address + Form No */}
            <div className="flex flex-col justify-between h-full text-center px-1">
              <div>
                <h3 className="text-sm sm:text-base print:text-[15px] font-bold text-black uppercase tracking-normal leading-tight">
                  ADMIT CARD
                </h3>
                <h4 className="text-xs sm:text-[12px] print:text-[12px] font-bold text-black mt-0.5 print:mt-0.5 leading-tight">
                  St. Joseph International School (Narinda Campus)
                </h4>
                <p className="text-[9.5px] sm:text-[10px] print:text-[9.5px] text-black font-normal leading-tight">
                  32 Shah Shaheb Lane, Narinda, Dhaka 1100
                </p>
              </div>

              {/* Form No.. (positioned under school address, to the left of photo box) */}
              <div className="flex items-baseline gap-1.5 mt-2 print:mt-1 text-left">
                <span className="text-xs print:text-[11.5px] font-semibold text-black whitespace-nowrap">
                  Form No..
                </span>
                <span className="font-mono text-sm sm:text-base print:text-[14.5px] font-bold text-black px-1 min-w-[140px] print:min-w-[130px] border-b border-dotted border-black inline-block">
                  {displayFormNo}
                </span>
              </div>
            </div>

            {/* Right Photo Box */}
            <div className="w-20 h-26 sm:w-22 sm:h-28 print:w-20 print:h-26 border border-black bg-white shrink-0 overflow-hidden flex flex-col items-center justify-center p-1 text-center">
              {form.student_photo_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={form.student_photo_url}
                  alt="Candidate"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-[6.5px] sm:text-[7px] print:text-[7px] font-bold uppercase tracking-tight text-black leading-tight space-y-0.5">
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
          <div className="space-y-1.5 print:space-y-1 text-[10px] sm:text-[10.5px] print:text-[10px] text-black leading-snug print:leading-normal">
            {/* Name */}
            <div className="flex items-baseline gap-1">
              <span className="font-semibold whitespace-nowrap">Name:</span>
              <span className="flex-1 font-bold uppercase px-2 border-b border-dotted border-black min-h-[16px] print:min-h-[17px]">
                {candidateFullName}
              </span>
            </div>

            {/* Son/Daughter of */}
            <div className="flex items-baseline gap-1">
              <span className="font-semibold whitespace-nowrap">Son/Daughter of:</span>
              <span className="flex-1 font-bold px-2 border-b border-dotted border-black min-h-[16px] print:min-h-[17px]">
                {sonDaughterOf}
              </span>
            </div>

            {/* Admission Test Details Sentence */}
            <p className="pt-1 print:pt-0.5 leading-relaxed print:leading-normal text-justify">
              <span>may face interview/write the admission test for class </span>
              <span className="font-bold border-b border-dotted border-black px-2 inline-block min-w-[90px] print:min-w-[80px] text-center">
                {form.grade_applying || '........................'}
              </span>
              <span> to be held on </span>
              <span className="font-bold border-b border-dotted border-black px-2 inline-block min-w-[100px] print:min-w-[90px] text-center">
                {displayInterviewDate || '....................'}
              </span>
              <span> at </span>
              <span className="font-bold border-b border-dotted border-black px-2 inline-block min-w-[65px] print:min-w-[55px] text-center">
                {displayInterviewTime || '.............'}
              </span>
              <span> the candidate should bring a ballpoint pen, ruler and admit card. Paper will be supplied by the School.</span>
            </p>

            {/* Principal Signature & Date Row */}
            <div className="flex items-end justify-between pt-7 sm:pt-9 print:pt-7 pb-1 print:pb-1">
              <div className="w-52 sm:w-64 print:w-56">
                <div className="border-b border-dotted border-black mb-1.5" />
                <span className="font-bold text-[10px] sm:text-[10.5px] print:text-[10px] block">
                  Principal
                </span>
              </div>

              <div className="flex items-baseline gap-1 pb-0.5">
                <span className="font-semibold text-[10px] print:text-[10px]">Date:</span>
                <span className="font-bold border-b border-dotted border-black px-2 min-w-[95px] print:min-w-[85px] text-center inline-block">
                  {displaySubmissionDate || '........................'}
                </span>
              </div>
            </div>

            {/* N.B. (Important Rules Verbatim from Photo) */}
            <div className="pt-1 print:pt-0.5 text-[9px] sm:text-[9.5px] print:text-[8.5px] leading-tight space-y-0.5 print:space-y-0.5">
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
