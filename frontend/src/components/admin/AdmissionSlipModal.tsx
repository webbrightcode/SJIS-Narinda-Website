'use client';

import React from 'react';
import { Printer, X, GraduationCap, CheckSquare, Calendar, Phone, Mail, User, ShieldCheck } from 'lucide-react';
import { AdmissionInquiry } from '@/lib/types';
import { Button } from '@/components/ui/Button';

interface AdmissionSlipModalProps {
  inquiry: AdmissionInquiry | null;
  onClose: () => void;
}

export const AdmissionSlipModal: React.FC<AdmissionSlipModalProps> = ({ inquiry, onClose }) => {
  if (!inquiry) return null;

  const handlePrint = () => {
    window.print();
  };

  const regCode = `SJIS-ADM-2026-${String(inquiry.id).padStart(4, '0')}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs overflow-y-auto">
      <div className="w-full max-w-3xl bg-white rounded-3xl shadow-2xl overflow-hidden my-8 print:m-0 print:p-0 print:shadow-none print:max-w-none print:rounded-none">
        {/* Top Control Bar (Hidden during printing) */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2">
            <Printer className="w-5 h-5 text-[#D4AF37]" />
            <span className="font-bold text-sm">Official Candidate Registration Dossier</span>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="gold"
              size="sm"
              icon={<Printer className="w-4 h-4" />}
              onClick={handlePrint}
            >
              Print Registration Slip
            </Button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Official Slip Document */}
        <div className="p-8 sm:p-12 text-slate-800 space-y-6 print:p-8 bg-white" id="printable-slip">
          {/* Header with Holy Cross & SJIS Branding */}
          <div className="flex items-center justify-between border-b-2 border-[#00183F] pb-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-[#00183F] flex items-center justify-center text-[#D4AF37] shadow-md shrink-0">
                <GraduationCap className="w-10 h-10" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-black text-[#00183F] tracking-tight uppercase">
                  St. Joseph International School
                </h1>
                <p className="text-xs font-bold text-[#C8102E] tracking-wider uppercase">
                  Narinda Campus, Dhaka • Congregation of Holy Cross
                </p>
                <p className="text-[11px] text-slate-500">
                  Cambridge International Curriculum • EIIN: 132456
                </p>
              </div>
            </div>

            <div className="text-right shrink-0">
              <span className="inline-block px-3 py-1 rounded-md bg-slate-100 font-mono text-xs font-black text-[#00183F] border border-slate-300">
                {regCode}
              </span>
              <span className="block text-[10px] text-slate-400 mt-1 uppercase font-semibold">
                Admission Slip 2026-27
              </span>
            </div>
          </div>

          {/* Document Title Ribbon */}
          <div className="bg-[#00183F] text-white py-2 px-4 rounded-lg text-center font-bold text-xs uppercase tracking-widest">
            Admissions Screening & Registration Verification Slip
          </div>

          {/* Candidate Grid */}
          <div className="grid grid-cols-2 gap-4 text-xs border border-slate-200 rounded-2xl p-5 bg-slate-50/50">
            <div>
              <span className="text-slate-400 block font-semibold text-[10px] uppercase">Candidate Full Name</span>
              <span className="text-base font-black text-[#00183F] block mt-0.5">{inquiry.student_name}</span>
            </div>
            <div>
              <span className="text-slate-400 block font-semibold text-[10px] uppercase">Grade Applying For</span>
              <span className="text-base font-black text-[#C8102E] block mt-0.5">{inquiry.grade_applying}</span>
            </div>
            <div>
              <span className="text-slate-400 block font-semibold text-[10px] uppercase">Parent / Legal Guardian</span>
              <span className="text-sm font-bold text-slate-800 block mt-0.5">{inquiry.parent_name}</span>
            </div>
            <div>
              <span className="text-slate-400 block font-semibold text-[10px] uppercase">Previous Institution</span>
              <span className="text-sm font-semibold text-slate-700 block mt-0.5">
                {inquiry.previous_school || 'N/A (First Enrollment)'}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block font-semibold text-[10px] uppercase">Primary Contact Phone</span>
              <span className="text-sm font-mono font-bold text-slate-800 block mt-0.5">{inquiry.phone}</span>
            </div>
            <div>
              <span className="text-slate-400 block font-semibold text-[10px] uppercase">Registered Email</span>
              <span className="text-sm font-mono text-slate-700 block mt-0.5">{inquiry.email}</span>
            </div>
          </div>

          {/* Workflow & Application Status */}
          <div className="p-4 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
            <div>
              <span className="text-slate-400 text-[10px] uppercase font-bold block">Current Evaluation Status</span>
              <span className="font-black uppercase tracking-wider text-emerald-700 text-sm">
                ● {inquiry.status.toUpperCase()}
              </span>
            </div>
            <div className="text-right">
              <span className="text-slate-400 text-[10px] uppercase font-bold block">Application Lodged</span>
              <span className="font-semibold text-slate-700">{inquiry.created_at}</span>
            </div>
          </div>

          {/* Verification Checklist */}
          <div className="border border-slate-200 rounded-xl p-5 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#00183F] flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
              Document Verification & Assessment Checklist (For Office Use)
            </h4>
            <div className="grid grid-cols-2 gap-2.5 text-xs text-slate-700">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-slate-400 rounded-sm" />
                <span>Original Birth Registration Certificate</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-slate-400 rounded-sm" />
                <span>4 Copies of Passport-sized Photographs</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-slate-400 rounded-sm" />
                <span>Previous Academic Report Card / Transcript</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-slate-400 rounded-sm" />
                <span>Transfer Certificate (TC) & Clearance</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-slate-400 rounded-sm" />
                <span>Parent NID / Passport Photocopy</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-slate-400 rounded-sm" />
                <span>Oral Screening / Written Assessment</span>
              </div>
            </div>
          </div>

          {/* Signatures & Seal */}
          <div className="pt-10 grid grid-cols-2 gap-8 text-center text-xs">
            <div>
              <div className="border-t border-slate-400 pt-2 font-bold text-slate-800">
                Parent / Guardian Signature
              </div>
              <span className="text-[10px] text-slate-400">Date: ________________________</span>
            </div>
            <div>
              <div className="border-t border-[#00183F] pt-2 font-bold text-[#00183F]">
                Authorized Admissions Officer / Administrator
              </div>
              <span className="text-[10px] text-slate-400">Official Seal & Approval Stamp</span>
            </div>
          </div>

          {/* Footer Notice */}
          <div className="text-center text-[10px] text-slate-400 pt-4 border-t border-slate-200">
            This registration slip is a valid document of preliminary admission application at St. Joseph International School, Narinda. Please retain this slip during candidate interview sessions.
          </div>
        </div>
      </div>
    </div>
  );
};
