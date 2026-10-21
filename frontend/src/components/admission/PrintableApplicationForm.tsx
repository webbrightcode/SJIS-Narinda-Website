'use client';

import React from 'react';
import type { OnlineApplicationFormData } from '@/lib/types';
import { Check, Shield, Calendar, MapPin, Phone, Mail, Award } from 'lucide-react';

export interface PrintableApplicationFormProps {
  form: OnlineApplicationFormData;
  applicationId?: string;
  submittedAt?: string;
  documents?: Array<{
    doc_type: string;
    file_url: string;
    original_filename?: string;
    file_size?: string;
  }>;
}

export function PrintableApplicationForm({
  form,
  applicationId,
  submittedAt,
  documents = [],
}: PrintableApplicationFormProps) {
  const displayId = applicationId || 'SJIS-2026-DRAFT';
  const displayDate = submittedAt
    ? new Date(submittedAt).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      })
    : new Date().toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      });

  const displayTime = submittedAt
    ? new Date(submittedAt).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
      })
    : new Date().toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
      });

  // Calculate age as of January of academic year
  let ageString = '—';
  if (form.date_of_birth) {
    try {
      const birth = new Date(form.date_of_birth);
      const targetYear = parseInt(form.academic_year?.split('-')[0] || '2026', 10);
      const targetDate = new Date(targetYear, 0, 1);
      const diffMs = targetDate.getTime() - birth.getTime();
      if (diffMs > 0) {
        const diffYears = diffMs / (1000 * 60 * 60 * 24 * 365.25);
        const years = Math.floor(diffYears);
        const months = Math.floor((diffYears - years) * 12);
        ageString = `${years} yrs ${months} mos`;
      }
    } catch {
      ageString = '—';
    }
  }

  const docTypesUploaded = new Set(documents.map((d) => d.doc_type));

  return (
    <div
      id="printable-admission-form"
      className="bg-white text-slate-900 font-sans p-6 sm:p-8 max-w-[210mm] mx-auto text-xs leading-normal"
    >
      <style jsx global>{`
        @media print {
          html, body {
            background: #fff !important;
            margin: 0 !important;
            padding: 0 !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          /* Hide standard web page content */
          body > *:not(#print-root) {
            display: none !important;
          }
          /* Or if inside normal page tree, show printable root */
          .no-print {
            display: none !important;
          }
          .print-only-block {
            display: block !important;
          }
          #printable-admission-form {
            display: block !important;
            position: absolute !important;
            top: 0 !important;
            left: 0 !important;
            width: 100% !important;
            max-width: 100% !important;
            padding: 8mm 10mm !important;
            margin: 0 !important;
            box-shadow: none !important;
            border: none !important;
            background: #fff !important;
          }
          @page {
            size: A4 portrait;
            margin: 8mm 10mm 8mm 10mm;
          }
          .page-break-before {
            page-break-before: always;
          }
        }
      `}</style>

      {/* ══════════════════════════════════════════════════════════════════
          1. INSTITUTIONAL HEADER & ACCREDITATION
         ══════════════════════════════════════════════════════════════════ */}
      <div className="border-b-2 border-[#00183F] pb-3 mb-4">
        <div className="flex items-center justify-between gap-4">
          {/* School Crest Logo */}
          <div className="w-20 h-20 shrink-0 flex items-center justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/sjis-crest-logo.png"
              alt="SJIS Crest"
              className="w-20 h-20 object-contain"
              onError={(e) => {
                // Fallback to placeholder if crest logo not found
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>

          {/* School Title & Affiliation */}
          <div className="flex-1 text-center space-y-0.5">
            <h1 className="text-xl sm:text-2xl font-black text-[#00183F] tracking-tight uppercase font-serif">
              St. Joseph International School
            </h1>
            <div className="text-[11px] font-bold text-[#C8102E] tracking-widest uppercase">
              Narinda Campus • Dhaka, Bangladesh
            </div>
            <div className="text-[10px] font-semibold text-slate-700">
              Curriculum: Cambridge Assessment International Education (CAIE) • English Medium
            </div>
            <div className="text-[9px] text-slate-500">
              42/1, Court House Street, Narinda, Dhaka-1100 • Tel: +880 1746-866393 • Email: sjisnarinda2021@gmail.com
            </div>
          </div>

          {/* Reference & Barcode Box */}
          <div className="border-2 border-[#00183F] rounded-lg p-2 text-center shrink-0 w-36 bg-slate-50">
            <span className="text-[8px] font-black uppercase text-slate-500 tracking-wider block">
              Application Ref ID
            </span>
            <span className="font-mono text-xs font-black text-[#00183F] tracking-wide block">
              {displayId}
            </span>
            <span className="text-[8px] font-semibold text-slate-600 block mt-0.5">
              Session: {form.academic_year || '2026-2027'}
            </span>
            <span className="text-[8px] text-slate-500 block">
              {displayDate} • {displayTime}
            </span>
          </div>
        </div>

        {/* Official Banner Title */}
        <div className="mt-2.5 pt-1.5 border-t border-slate-200 text-center">
          <span className="inline-block px-4 py-0.5 rounded bg-[#00183F] text-[#D4AF37] font-black text-[11px] uppercase tracking-wider">
            Official Online Admission Application Form
          </span>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════
          2. CANDIDATE PROFILE & PHOTOGRAPH
         ══════════════════════════════════════════════════════════════════ */}
      <div className="flex gap-4 mb-3 items-stretch">
        <div className="flex-1 space-y-2">
          {/* Program Applied Row */}
          <div className="bg-slate-100 border border-slate-300 rounded p-2 flex items-center justify-between text-xs">
            <div>
              <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wide block">
                Class / Grade Applied For:
              </span>
              <span className="text-sm font-black text-[#C8102E]">{form.grade_applying}</span>
            </div>
            <div className="text-right">
              <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wide block">
                Curriculum Stream:
              </span>
              <span className="text-xs font-bold text-[#00183F]">
                Cambridge CAIE (English Medium)
              </span>
            </div>
          </div>

          {/* Candidate Names */}
          <table className="w-full border-collapse border border-slate-300 text-xs">
            <tbody>
              <tr className="border-b border-slate-300">
                <td className="w-36 bg-slate-100 font-bold p-1.5 text-slate-700 text-[10px] uppercase border-r border-slate-300">
                  Full Name (English)
                </td>
                <td className="p-1.5 font-black text-[#00183F] text-xs uppercase tracking-wide">
                  {form.student_first_name} {form.student_last_name}
                </td>
              </tr>
              {form.student_name_bangla && (
                <tr className="border-b border-slate-300">
                  <td className="bg-slate-100 font-bold p-1.5 text-slate-700 text-[10px] uppercase border-r border-slate-300">
                    Full Name (বাংলায়)
                  </td>
                  <td className="p-1.5 font-bold text-slate-800 text-xs">
                    {form.student_name_bangla}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Candidate Passport Photo Frame */}
        <div className="w-28 h-36 border-2 border-dashed border-slate-400 rounded bg-slate-50 flex flex-col items-center justify-center p-1 text-center shrink-0 overflow-hidden">
          {form.student_photo_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={form.student_photo_url}
              alt="Candidate"
              className="w-full h-full object-cover rounded"
            />
          ) : (
            <div className="space-y-1 p-2">
              <span className="text-[8px] font-bold text-slate-500 uppercase block leading-tight">
                Candidate Passport Photo
              </span>
              <span className="text-[7px] text-slate-400 block">
                Affix recent photograph with white background
              </span>
            </div>
          )}
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════
          3. SECTION A: CANDIDATE PERSONAL PARTICULARS
         ══════════════════════════════════════════════════════════════════ */}
      <div className="mb-3">
        <div className="bg-[#00183F] text-white px-2 py-1 font-bold text-[10px] uppercase tracking-wider mb-1 flex items-center justify-between">
          <span>Section A: Candidate Personal Particulars</span>
          <span className="text-[9px] text-[#D4AF37]">Official School Records</span>
        </div>
        <table className="w-full border-collapse border border-slate-300 text-[10px]">
          <tbody>
            <tr className="border-b border-slate-300">
              <td className="w-28 bg-slate-100 font-bold p-1.5 text-slate-700 border-r border-slate-300">
                Date of Birth
              </td>
              <td className="p-1.5 font-bold text-slate-900 border-r border-slate-300">
                {form.date_of_birth || '—'}
              </td>
              <td className="w-24 bg-slate-100 font-bold p-1.5 text-slate-700 border-r border-slate-300">
                Age (as of Jan 1)
              </td>
              <td className="p-1.5 font-bold text-slate-900 border-r border-slate-300">
                {ageString}
              </td>
              <td className="w-20 bg-slate-100 font-bold p-1.5 text-slate-700 border-r border-slate-300">
                Gender
              </td>
              <td className="p-1.5 font-bold text-slate-900 capitalize">{form.gender}</td>
            </tr>
            <tr className="border-b border-slate-300">
              <td className="bg-slate-100 font-bold p-1.5 text-slate-700 border-r border-slate-300">
                Religion
              </td>
              <td className="p-1.5 text-slate-900 border-r border-slate-300 font-semibold">
                {form.religion || '—'}
              </td>
              <td className="bg-slate-100 font-bold p-1.5 text-slate-700 border-r border-slate-300">
                Blood Group
              </td>
              <td className="p-1.5 text-slate-900 border-r border-slate-300 font-bold text-[#C8102E]">
                {form.blood_group || '—'}
              </td>
              <td className="bg-slate-100 font-bold p-1.5 text-slate-700 border-r border-slate-300">
                Nationality
              </td>
              <td className="p-1.5 text-slate-900 font-semibold">{form.nationality}</td>
            </tr>
            <tr className="border-b border-slate-300">
              <td className="bg-slate-100 font-bold p-1.5 text-slate-700 border-r border-slate-300">
                Birth Registration No
              </td>
              <td colSpan={2} className="p-1.5 font-mono font-bold text-slate-900 border-r border-slate-300">
                {form.birth_certificate_no || '—'}
              </td>
              <td className="bg-slate-100 font-bold p-1.5 text-slate-700 border-r border-slate-300">
                Passport No (if any)
              </td>
              <td colSpan={2} className="p-1.5 font-mono font-bold text-slate-900">
                {form.passport_no || 'N/A'}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* ══════════════════════════════════════════════════════════════════
          4. SECTION B: ACADEMIC BACKGROUND
         ══════════════════════════════════════════════════════════════════ */}
      <div className="mb-3">
        <div className="bg-[#00183F] text-white px-2 py-1 font-bold text-[10px] uppercase tracking-wider mb-1 flex items-center justify-between">
          <span>Section B: Previous Academic History</span>
          <span className="text-[9px] text-[#D4AF37]">Candidate Educational Records</span>
        </div>
        <table className="w-full border-collapse border border-slate-300 text-[10px]">
          <tbody>
            <tr className="border-b border-slate-300">
              <td className="w-36 bg-slate-100 font-bold p-1.5 text-slate-700 border-r border-slate-300">
                Previous School Name
              </td>
              <td colSpan={3} className="p-1.5 font-bold text-slate-900 border-r border-slate-300">
                {form.previous_school_name || 'None / Direct Admission'}
              </td>
              <td className="w-24 bg-slate-100 font-bold p-1.5 text-slate-700 border-r border-slate-300">
                School City
              </td>
              <td className="p-1.5 text-slate-900 font-semibold">
                {form.previous_school_city || '—'}
              </td>
            </tr>
            <tr className="border-b border-slate-300">
              <td className="bg-slate-100 font-bold p-1.5 text-slate-700 border-r border-slate-300">
                Previous Curriculum
              </td>
              <td className="p-1.5 text-slate-900 border-r border-slate-300">
                {form.previous_curriculum || '—'}
              </td>
              <td className="w-28 bg-slate-100 font-bold p-1.5 text-slate-700 border-r border-slate-300">
                Last Grade Result
              </td>
              <td className="p-1.5 text-slate-900 border-r border-slate-300 font-semibold">
                {form.last_grade_result || '—'}
              </td>
              <td className="bg-slate-100 font-bold p-1.5 text-slate-700 border-r border-slate-300">
                Passing Year
              </td>
              <td className="p-1.5 text-slate-900">{form.last_grade_year || '—'}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* ══════════════════════════════════════════════════════════════════
          5. SECTION C: PARENTS & GUARDIAN PARTICULARS
         ══════════════════════════════════════════════════════════════════ */}
      <div className="mb-3">
        <div className="bg-[#00183F] text-white px-2 py-1 font-bold text-[10px] uppercase tracking-wider mb-1 flex items-center justify-between">
          <span>Section C: Parents & Legal Guardian Particulars</span>
          <span className="text-[9px] text-[#D4AF37]">Official Contact Details</span>
        </div>
        <table className="w-full border-collapse border border-slate-300 text-[10px]">
          <tbody>
            <tr className="border-b border-slate-300 bg-slate-50 font-bold text-slate-700 text-[9px] uppercase">
              <td className="p-1.5 border-r border-slate-300 w-28">Particulars</td>
              <td className="p-1.5 border-r border-slate-300 w-1/2">Father's Information</td>
              <td className="p-1.5 w-1/2">Mother's Information</td>
            </tr>
            <tr className="border-b border-slate-300">
              <td className="bg-slate-100 font-bold p-1.5 text-slate-700 border-r border-slate-300">
                Full Name
              </td>
              <td className="p-1.5 font-bold text-slate-900 border-r border-slate-300">
                {form.father_name || '—'}
              </td>
              <td className="p-1.5 font-bold text-slate-900">{form.mother_name || '—'}</td>
            </tr>
            <tr className="border-b border-slate-300">
              <td className="bg-slate-100 font-bold p-1.5 text-slate-700 border-r border-slate-300">
                Profession / Designation
              </td>
              <td className="p-1.5 text-slate-900 border-r border-slate-300">
                {form.father_profession || '—'}
              </td>
              <td className="p-1.5 text-slate-900">{form.mother_profession || '—'}</td>
            </tr>
            <tr className="border-b border-slate-300">
              <td className="bg-slate-100 font-bold p-1.5 text-slate-700 border-r border-slate-300">
                Organization / Employer
              </td>
              <td className="p-1.5 text-slate-900 border-r border-slate-300">
                {form.father_organization || '—'}
              </td>
              <td className="p-1.5 text-slate-900">{form.mother_organization || '—'}</td>
            </tr>
            <tr className="border-b border-slate-300">
              <td className="bg-slate-100 font-bold p-1.5 text-slate-700 border-r border-slate-300">
                Mobile Phone Number
              </td>
              <td className="p-1.5 font-mono font-bold text-slate-900 border-r border-slate-300">
                {form.father_phone || '—'}
              </td>
              <td className="p-1.5 font-mono font-bold text-slate-900">{form.mother_phone || '—'}</td>
            </tr>
            <tr className="border-b border-slate-300">
              <td className="bg-slate-100 font-bold p-1.5 text-slate-700 border-r border-slate-300">
                National ID (NID)
              </td>
              <td className="p-1.5 font-mono text-slate-800 border-r border-slate-300">
                {form.father_nid || '—'}
              </td>
              <td className="p-1.5 font-mono text-slate-800">{form.mother_nid || '—'}</td>
            </tr>
            <tr className="border-b border-slate-300">
              <td className="bg-slate-100 font-bold p-1.5 text-slate-700 border-r border-slate-300">
                Primary Contact
              </td>
              <td colSpan={2} className="p-1.5 font-bold text-[#00183F]">
                Phone: <span className="font-mono">{form.contact_phone}</span> • Email:{' '}
                <span className="font-mono text-slate-700">{form.contact_email}</span>
                {form.emergency_contact_phone && (
                  <span>
                    {' '}
                    • Emergency: <span className="font-mono">{form.emergency_contact_phone}</span>
                  </span>
                )}
              </td>
            </tr>
            <tr className="border-b border-slate-300">
              <td className="bg-slate-100 font-bold p-1.5 text-slate-700 border-r border-slate-300">
                Present Address
              </td>
              <td colSpan={2} className="p-1.5 text-slate-800">
                {form.present_address || '—'}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* ══════════════════════════════════════════════════════════════════
          6. SECTION D: DOCUMENTS SUBMISSION CHECKLIST
         ══════════════════════════════════════════════════════════════════ */}
      <div className="mb-3">
        <div className="bg-[#00183F] text-white px-2 py-1 font-bold text-[10px] uppercase tracking-wider mb-1 flex items-center justify-between">
          <span>Section D: Digital Documents Verification Status</span>
          <span className="text-[9px] text-[#D4AF37]">Admissions Desk Audit</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[10px] border border-slate-300 rounded p-2 bg-slate-50">
          <div className="flex items-center gap-1.5">
            <span
              className={`w-3.5 h-3.5 rounded border flex items-center justify-center text-[9px] font-black ${
                form.student_photo_url ? 'bg-emerald-600 text-white border-emerald-700' : 'border-slate-400'
              }`}
            >
              {form.student_photo_url ? '✓' : ''}
            </span>
            <span className="font-semibold text-slate-800">Candidate Photo</span>
          </div>

          <div className="flex items-center gap-1.5">
            <span
              className={`w-3.5 h-3.5 rounded border flex items-center justify-center text-[9px] font-black ${
                docTypesUploaded.has('birth_certificate')
                  ? 'bg-emerald-600 text-white border-emerald-700'
                  : 'border-slate-400'
              }`}
            >
              {docTypesUploaded.has('birth_certificate') ? '✓' : ''}
            </span>
            <span className="font-semibold text-slate-800">Birth Certificate</span>
          </div>

          <div className="flex items-center gap-1.5">
            <span
              className={`w-3.5 h-3.5 rounded border flex items-center justify-center text-[9px] font-black ${
                docTypesUploaded.has('previous_report_card')
                  ? 'bg-emerald-600 text-white border-emerald-700'
                  : 'border-slate-400'
              }`}
            >
              {docTypesUploaded.has('previous_report_card') ? '✓' : ''}
            </span>
            <span className="font-semibold text-slate-800">Report Card / TC</span>
          </div>

          <div className="flex items-center gap-1.5">
            <span
              className={`w-3.5 h-3.5 rounded border flex items-center justify-center text-[9px] font-black ${
                docTypesUploaded.has('parent_nid')
                  ? 'bg-emerald-600 text-white border-emerald-700'
                  : 'border-slate-400'
              }`}
            >
              {docTypesUploaded.has('parent_nid') ? '✓' : ''}
            </span>
            <span className="font-semibold text-slate-800">Parent NID / Passport</span>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════
          7. SECTION E: PARENTAL UNDERTAKING & DECLARATION
         ══════════════════════════════════════════════════════════════════ */}
      <div className="mb-4 border border-slate-300 rounded p-2.5 bg-slate-50 text-[9px] leading-tight text-slate-700 space-y-1.5">
        <div className="font-bold text-slate-900 uppercase tracking-wider text-[10px] flex items-center justify-between border-b border-slate-200 pb-1">
          <span>Section E: Parent / Guardian Undertaking & Authenticity Declaration</span>
          <span className="text-emerald-700 font-black">✓ Digitally Signed</span>
        </div>
        <p className="italic">
          I/We hereby solemnly affirm that the particulars, statements, and documents submitted in this application are 100% genuine, correct, and complete to the best of my/our knowledge. I/We understand that willful concealment or misrepresentation shall lead to immediate forfeiture of admission. I/We undertake to abide by the rules, Cambridge CAIE curriculum regulations, and code of conduct of St. Joseph International School, Narinda.
        </p>
        <div className="pt-3 grid grid-cols-3 gap-4 text-center text-[10px]">
          <div className="border-t border-slate-400 pt-1">
            <span className="font-bold block text-slate-800">
              {form.father_name || form.mother_name || 'Parent / Guardian'}
            </span>
            <span className="text-[8px] text-slate-500 uppercase block">Digital Signatory</span>
          </div>
          <div className="border-t border-slate-400 pt-1">
            <span className="font-mono font-bold block text-slate-800">{displayDate}</span>
            <span className="text-[8px] text-slate-500 uppercase block">Submission Date</span>
          </div>
          <div className="border-t border-slate-400 pt-1">
            <span className="font-bold block text-slate-800">Candidate Signature</span>
            <span className="text-[8px] text-slate-500 uppercase block">(For Grade 6 & Above)</span>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════
          8. SECTION F: FOR OFFICE USE ONLY (SCRUTINY & VERIFICATION)
         ══════════════════════════════════════════════════════════════════ */}
      <div className="border-2 border-slate-800 rounded p-2.5 text-[10px] bg-white mb-4">
        <div className="font-black text-[#00183F] uppercase tracking-wider text-[10px] border-b border-slate-300 pb-1 mb-2 flex items-center justify-between">
          <span>For Admissions Office Scrutiny & Assessment Authorization Only</span>
          <span className="font-mono text-slate-500 text-[9px]">DOC-REF: {displayId}</span>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-3 text-[9px]">
          <div>
            <span className="font-bold block text-slate-700">Document Verification:</span>
            <div className="flex gap-2 pt-0.5">
              <span>[ ] Approved</span>
              <span>[ ] Pending</span>
              <span>[ ] Rejected</span>
            </div>
          </div>
          <div>
            <span className="font-bold block text-slate-700">Entrance Test Category:</span>
            <span className="text-slate-600 block">Written Assessment & Oral Interview</span>
          </div>
          <div>
            <span className="font-bold block text-slate-700">Recommended Grade:</span>
            <span className="text-slate-600 block">__________________________</span>
          </div>
        </div>

        <div className="pt-3 border-t border-slate-200 grid grid-cols-2 gap-8 text-center text-[9px]">
          <div>
            <div className="h-6 border-b border-slate-400 mx-6 mb-1" />
            <span className="font-bold text-slate-800 uppercase block">Scrutinized By (Admissions Officer)</span>
            <span className="text-[8px] text-slate-400">Signature & Date</span>
          </div>
          <div>
            <div className="h-6 border-b border-slate-400 mx-6 mb-1" />
            <span className="font-bold text-slate-800 uppercase block">Head of School / Principal</span>
            <span className="text-[8px] text-slate-400">Official Seal & Signature</span>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════
          9. TEAR-OFF CANDIDATE ENTRANCE EXAM ADMIT SLIP
         ══════════════════════════════════════════════════════════════════ */}
      <div className="border-t-2 border-dashed border-slate-400 pt-3 mt-4">
        <div className="flex items-center justify-between text-[9px] text-slate-400 mb-2 uppercase tracking-widest">
          <span>✂ Cut / Detach Along Dashed Line on Examination Day</span>
          <span>Entrance Examination Admit Slip</span>
        </div>

        <div className="border-2 border-[#00183F] rounded-lg p-3 bg-slate-50 flex items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-[#00183F] text-[#D4AF37] font-black text-[9px] uppercase tracking-wider">
                Candidate Admit Card
              </span>
              <span className="font-bold text-slate-800 text-xs">
                {form.student_first_name} {form.student_last_name}
              </span>
            </div>
            <div className="text-[10px] text-slate-600 space-x-3">
              <span>
                <strong>Application ID:</strong>{' '}
                <span className="font-mono font-bold text-[#00183F]">{displayId}</span>
              </span>
              <span>•</span>
              <span>
                <strong>Grade:</strong> <span className="font-bold text-[#C8102E]">{form.grade_applying}</span>
              </span>
              <span>•</span>
              <span>
                <strong>Session:</strong> {form.academic_year}
              </span>
            </div>
            <div className="text-[9px] text-slate-500">
              <strong>Reporting Venue:</strong> Main Academic Building, St. Joseph International School, 42/1 Court House Street, Narinda, Dhaka.
            </div>
          </div>

          <div className="w-16 h-20 border border-slate-300 rounded bg-white shrink-0 overflow-hidden flex items-center justify-center text-center p-1">
            {form.student_photo_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={form.student_photo_url}
                alt="Admit Photo"
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-[7px] text-slate-400 font-bold uppercase">Affix Photo</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
