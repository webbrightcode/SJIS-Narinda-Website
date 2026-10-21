'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  Search, CheckCircle2, Clock, XCircle, AlertCircle, FileCheck2,
  GraduationCap, CalendarDays, Shield, RefreshCw, ArrowRight, Loader2,
} from 'lucide-react';
import { trackApplicationStatus } from '@/lib/api';
import type { ApplicationStatusResult, ApplicationStatus } from '@/lib/types';

const STATUS_CONFIG: Record<ApplicationStatus, {
  color: string; bg: string; border: string; icon: React.ReactNode; label: string; step: number;
}> = {
  draft:              { color: 'text-slate-600',  bg: 'bg-slate-50',   border: 'border-slate-200',  icon: <Clock className="w-5 h-5" />,        label: 'Draft',              step: 0 },
  submitted:          { color: 'text-blue-700',   bg: 'bg-blue-50',    border: 'border-blue-200',   icon: <FileCheck2 className="w-5 h-5" />,    label: 'Submitted',          step: 1 },
  under_review:       { color: 'text-indigo-700', bg: 'bg-indigo-50',  border: 'border-indigo-200', icon: <Search className="w-5 h-5" />,        label: 'Under Review',       step: 2 },
  shortlisted:        { color: 'text-amber-700',  bg: 'bg-amber-50',   border: 'border-amber-200',  icon: <GraduationCap className="w-5 h-5" />, label: 'Shortlisted',        step: 3 },
  interview_scheduled:{ color: 'text-purple-700', bg: 'bg-purple-50',  border: 'border-purple-200', icon: <CalendarDays className="w-5 h-5" />,  label: 'Interview Scheduled',step: 3 },
  documents_required: { color: 'text-orange-700', bg: 'bg-orange-50',  border: 'border-orange-200', icon: <AlertCircle className="w-5 h-5" />,   label: 'Documents Required', step: 2 },
  approved:           { color: 'text-emerald-700',bg: 'bg-emerald-50', border: 'border-emerald-200',icon: <CheckCircle2 className="w-5 h-5" />,  label: 'Approved',           step: 4 },
  enrolled:           { color: 'text-emerald-800',bg: 'bg-emerald-100',border: 'border-emerald-300',icon: <Shield className="w-5 h-5" />,        label: 'Enrolled',           step: 5 },
  waitlisted:         { color: 'text-yellow-700', bg: 'bg-yellow-50',  border: 'border-yellow-200', icon: <Clock className="w-5 h-5" />,         label: 'Waitlisted',         step: 2 },
  rejected:           { color: 'text-rose-700',   bg: 'bg-rose-50',    border: 'border-rose-200',   icon: <XCircle className="w-5 h-5" />,       label: 'Not Selected',       step: 0 },
  withdrawn:          { color: 'text-slate-600',  bg: 'bg-slate-50',   border: 'border-slate-200',  icon: <XCircle className="w-5 h-5" />,       label: 'Withdrawn',          step: 0 },
};

const PIPELINE_STEPS = [
  { label: 'Submitted', step: 1 },
  { label: 'Under Review', step: 2 },
  { label: 'Shortlisted / Interview', step: 3 },
  { label: 'Approved', step: 4 },
  { label: 'Enrolled', step: 5 },
];

function StatusResult({ data }: { data: ApplicationStatusResult }) {
  const cfg = STATUS_CONFIG[data.status] ?? STATUS_CONFIG['submitted'];
  const currentStep = cfg.step;

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Application ID Header */}
      <div className="bg-[#00183F] rounded-2xl p-5 text-center">
        <p className="text-[10px] text-slate-400 uppercase tracking-widest mb-1">Application Reference</p>
        <p className="text-xl font-black text-[#D4AF37] tracking-wider">{data.application_id}</p>
        <p className="text-xs text-slate-400 mt-1">Academic Year: {data.academic_year}</p>
      </div>

      {/* Student Info */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white border border-slate-100 rounded-xl p-3">
          <div className="text-[10px] text-slate-400 uppercase tracking-wide font-semibold mb-0.5">Student Name</div>
          <div className="text-sm font-bold text-[#00183F]">{data.student_name}</div>
        </div>
        <div className="bg-white border border-slate-100 rounded-xl p-3">
          <div className="text-[10px] text-slate-400 uppercase tracking-wide font-semibold mb-0.5">Grade Applying</div>
          <div className="text-sm font-bold text-[#00183F]">{data.grade_applying}</div>
        </div>
        {data.submitted_at && (
          <div className="bg-white border border-slate-100 rounded-xl p-3">
            <div className="text-[10px] text-slate-400 uppercase tracking-wide font-semibold mb-0.5">Submitted On</div>
            <div className="text-sm font-bold text-[#00183F]">
              {new Date(data.submitted_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
            </div>
          </div>
        )}
        <div className={`rounded-xl p-3 border ${cfg.bg} ${cfg.border}`}>
          <div className="text-[10px] text-slate-500 uppercase tracking-wide font-semibold mb-0.5">Current Status</div>
          <div className={`text-sm font-black flex items-center gap-1.5 ${cfg.color}`}>
            {cfg.icon} {cfg.label}
          </div>
        </div>
      </div>

      {/* Status Pipeline */}
      {!['rejected', 'withdrawn', 'draft'].includes(data.status) && (
        <div className="bg-white border border-slate-100 rounded-2xl p-5">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">Application Progress</p>
          <div className="flex items-start justify-between gap-1">
            {PIPELINE_STEPS.map((ps, i) => {
              const done = currentStep > ps.step;
              const active = currentStep === ps.step;
              return (
                <React.Fragment key={ps.step}>
                  <div className="flex flex-col items-center gap-1 flex-shrink-0 min-w-0">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black border-2 transition-all ${done ? 'bg-emerald-500 border-emerald-500 text-white' : active ? 'bg-[#00183F] border-[#00183F] text-[#D4AF37] scale-110' : 'bg-white border-slate-200 text-slate-400'}`}>
                      {done ? <CheckCircle2 className="w-3.5 h-3.5" /> : ps.step}
                    </div>
                    <span className={`text-[8px] sm:text-[9px] font-semibold text-center leading-tight ${active ? 'text-[#00183F]' : done ? 'text-emerald-600' : 'text-slate-400'}`}>
                      {ps.label}
                    </span>
                  </div>
                  {i < PIPELINE_STEPS.length - 1 && (
                    <div className="flex-1 h-0.5 mt-3.5">
                      <div className={`h-full rounded transition-all ${currentStep > ps.step ? 'bg-emerald-400' : 'bg-slate-100'}`} />
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>
      )}

      {/* Status Message */}
      <div className={`rounded-2xl p-5 border ${cfg.bg} ${cfg.border}`}>
        <div className={`flex items-center gap-2 mb-2 ${cfg.color}`}>
          {cfg.icon}
          <span className="text-sm font-black">{cfg.label}</span>
        </div>
        <p className={`text-xs leading-relaxed ${cfg.color}`}>{data.status_message}</p>
      </div>

      {/* Exam / Interview Details */}
      {(data.entrance_exam_date || data.documents_verified) && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 space-y-3">
          <p className="text-xs font-bold text-amber-900 uppercase tracking-wide flex items-center gap-2">
            <CalendarDays className="w-4 h-4" /> Examination Details
          </p>
          {data.entrance_exam_date && (
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <div className="text-amber-700 font-semibold mb-0.5">Exam Date</div>
                <div className="font-black text-amber-900">
                  {new Date(data.entrance_exam_date).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                </div>
              </div>
              {data.entrance_exam_venue && (
                <div>
                  <div className="text-amber-700 font-semibold mb-0.5">Venue</div>
                  <div className="font-black text-amber-900">{data.entrance_exam_venue}</div>
                </div>
              )}
            </div>
          )}
          {data.documents_verified && (
            <div className="flex items-center gap-2 text-xs text-emerald-700 font-semibold">
              <CheckCircle2 className="w-4 h-4" /> Documents have been verified by the admissions office.
            </div>
          )}
        </div>
      )}

      {/* CTA */}
      <div className="flex flex-col sm:flex-row gap-3">
        <a href="/admission"
          className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-slate-200 text-slate-700 text-sm font-semibold hover:bg-slate-50 transition-colors">
          Back to Admissions
        </a>
        {data.status === 'submitted' || data.status === 'under_review' ? (
          <a href="tel:+8801746866393"
            className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#00183F] text-white text-sm font-bold hover:bg-[#C8102E] transition-colors">
            Contact Admissions Office <ArrowRight className="w-4 h-4" />
          </a>
        ) : null}
      </div>
    </div>
  );
}

function StatusCheckerInner() {
  const searchParams = useSearchParams();
  const [appId, setAppId] = useState(searchParams.get('id') || '');
  const [inputId, setInputId] = useState(searchParams.get('id') || '');
  const [loading, setLoading] = useState(false);
  const [statusData, setStatusData] = useState<ApplicationStatusResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCheck = async (idToCheck = appId) => {
    const trimmed = idToCheck.trim().toUpperCase();
    if (!trimmed) { setError('Please enter your Application ID.'); return; }
    setLoading(true);
    setError(null);
    setStatusData(null);
    const res = await trackApplicationStatus(trimmed);
    setLoading(false);
    if (res.success && res.data) {
      setStatusData(res.data);
    } else {
      setError(res.error || 'Application not found. Please verify your Application ID.');
    }
  };

  useEffect(() => {
    const id = searchParams.get('id');
    if (id) {
      setAppId(id);
      setInputId(id);
      handleCheck(id);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="max-w-lg w-full">
      {/* Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-lg p-6 mb-5">
        <h2 className="text-base font-black text-[#00183F] mb-4">Enter Your Application ID</h2>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              id="application-id-input"
              value={inputId}
              onChange={e => setInputId(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleCheck(inputId)}
              placeholder="e.g. SJIS-2026-00001"
              className="w-full pl-9 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#00183F]/30 focus:border-[#00183F] text-sm font-mono text-slate-800 uppercase tracking-wider"
            />
          </div>
          <button
            id="check-status-btn"
            onClick={() => { setAppId(inputId); handleCheck(inputId); }}
            disabled={loading}
            className="px-5 py-3 rounded-xl bg-[#00183F] text-white text-sm font-bold hover:bg-[#C8102E] disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
            {loading ? '' : 'Check'}
          </button>
        </div>
        <p className="text-[10px] text-slate-400 mt-2 text-center">
          Your Application ID was provided in your confirmation after submission (format: SJIS-YYYY-NNNNN)
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-start gap-3 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-sm mb-5">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold">Application Not Found</p>
            <p className="text-xs mt-0.5">{error}</p>
          </div>
        </div>
      )}

      {/* Results */}
      {statusData && <StatusResult data={statusData} />}

      {/* Refresh */}
      {statusData && (
        <button
          onClick={() => handleCheck(appId)}
          className="mt-4 w-full flex items-center justify-center gap-2 py-2.5 text-xs text-slate-500 hover:text-[#00183F] transition-colors font-semibold"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Refresh Status
        </button>
      )}
    </div>
  );
}

export default function ApplicationStatusPage() {
  return (
    <div className="bg-slate-50 min-h-screen">
      <section className="relative py-16 bg-[#00183F] text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D4AF37]/20 text-[#D4AF37] text-xs font-bold tracking-widest uppercase mb-3 border border-[#D4AF37]/30">
            <Search className="w-3.5 h-3.5" /> Application Status Tracker
          </span>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight">Track Your Application</h1>
          <p className="mt-3 text-slate-300 text-sm max-w-xl mx-auto leading-relaxed">
            Enter your Application Reference ID to check the current status of your admission application.
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 flex flex-col lg:flex-row gap-8 items-start">
        <Suspense fallback={
          <div className="flex-1 flex items-center justify-center py-16">
            <Loader2 className="w-8 h-8 animate-spin text-[#00183F]" />
          </div>
        }>
          <StatusCheckerInner />
        </Suspense>

        {/* Side Info Panel */}
        <div className="lg:w-80 space-y-4 flex-shrink-0">
          <div className="bg-white rounded-2xl border border-slate-200 p-5">
            <h3 className="text-sm font-black text-[#00183F] mb-4">Admission Process Overview</h3>
            <div className="space-y-3">
              {[
                { step: '01', title: 'Online Application', desc: 'Submit the 4-step online application form' },
                { step: '02', title: 'Document Verification', desc: 'Admissions team reviews your submitted information' },
                { step: '03', title: 'Entrance Examination', desc: 'Shortlisted students are invited for written test' },
                { step: '04', title: 'Interview (if required)', desc: 'Interview with academic panel for senior grades' },
                { step: '05', title: 'Admission Offer', desc: 'Offer letter sent to successful candidates' },
                { step: '06', title: 'Enrollment & Fee Deposit', desc: 'Confirm enrollment and complete registration' },
              ].map(({ step, title, desc }) => (
                <div key={step} className="flex gap-3 text-xs">
                  <div className="w-7 h-7 rounded-full bg-[#00183F]/10 text-[#00183F] flex items-center justify-center font-black text-[10px] flex-shrink-0 mt-0.5">{step}</div>
                  <div>
                    <div className="font-bold text-slate-800">{title}</div>
                    <div className="text-slate-500">{desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
            <h3 className="text-xs font-black text-amber-900 uppercase tracking-wide mb-3">Need Assistance?</h3>
            <div className="space-y-2 text-xs text-amber-800">
              <p>Contact our Admissions Desk:</p>
              <a href="tel:+8801746866393" className="block font-bold text-amber-900 hover:underline">+880 1746-866393</a>
              <a href="mailto:sjisnarinda2021@gmail.com" className="block font-bold text-amber-900 hover:underline">sjisnarinda2021@gmail.com</a>
              <p className="text-amber-700 mt-2">Office Hours: Sun-Thu, 7:30 AM - 4:30 PM</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
