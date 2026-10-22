'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  Search, CheckCircle2, Clock, XCircle, AlertCircle, FileCheck2,
  GraduationCap, CalendarDays, Shield, RefreshCw, ArrowRight, Loader2, Printer,
  Lock, CreditCard, ExternalLink,
} from 'lucide-react';
import { trackApplicationStatus, initiatePayment } from '@/lib/api';
import type { ApplicationStatusResult, ApplicationStatus } from '@/lib/types';
import { PrintableApplicationForm } from '@/components/admission/PrintableApplicationForm';
import { printDocumentElement } from '@/lib/printUtils';

const STATUS_CONFIG: Record<ApplicationStatus, {
  color: string; bg: string; border: string; icon: React.ReactNode; label: string; step: number;
}> = {
  payment_pending:    { color: 'text-amber-800',  bg: 'bg-amber-50',   border: 'border-amber-300',  icon: <Clock className="w-5 h-5 text-amber-600" />,        label: 'Payment Pending',    step: 0 },
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
  const [printModalMode, setPrintModalMode] = useState<'admit_card' | 'full_form' | null>(null);
  const [paying, setPaying] = useState(false);
  const [payError, setPayError] = useState<string | null>(null);

  // Payment gating checks
  const isPaymentRequired = data.payment_required !== false;
  const isPaid = data.payment_status === 'completed' || data.payment_status === 'not_required' || !isPaymentRequired;
  const canDownload = isPaid && Boolean(data.form_no);

  const handlePayNow = async () => {
    setPaying(true);
    setPayError(null);
    try {
      const res = await initiatePayment(data.application_id);
      if (res.redirect_url) {
        window.location.href = res.redirect_url;
      } else if (res.gateway === 'manual') {
        alert(
          `Payment Gateway is set to Manual Mode by school administration.\n\nFee Amount: ${data.payment_currency || 'BDT'} ${data.payment_amount || data.application_fee || '1,000'}\n\nPlease submit payment at the Admissions Accounts Counter (32 Shah Shaheb Lane, Narinda) with reference ID: ${data.application_id}.`
        );
      } else if (res.error) {
        setPayError(res.error);
      } else {
        setPayError('Unable to initialize payment gateway. Please try again.');
      }
    } catch {
      setPayError('Network error connecting to payment gateway.');
    } finally {
      setPaying(false);
    }
  };

  // Fallback form data if full object not attached
  const formData: any = data.application || {
    student_first_name: data.student_first_name || data.student_name.split(' ')[0] || '',
    student_last_name: data.student_last_name || data.student_name.split(' ').slice(1).join(' ') || '',
    student_photo_url: data.student_photo_url || '',
    grade_applying: data.grade_applying,
    academic_year: data.academic_year,
    date_of_birth: '',
    gender: 'male',
    religion: 'Islam',
    nationality: 'Bangladeshi',
    present_address: '32 Shah Shaheb Lane, Narinda, Dhaka 1100',
    contact_phone: '',
    father_phone: '',
    mother_phone: '',
    student_living_with: 'parents',
    form_no: data.form_no,
    interview_date: data.interview_date,
    interview_time: data.interview_time,
  };

  return (
    <>
      <div className={`space-y-5 animate-fade-in ${printModalMode ? 'print:hidden' : ''}`}>
        {/* Application ID Header */}
      <div className="bg-[#00183F] rounded-2xl p-5 text-center relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#D4AF37]/10 rounded-full blur-2xl pointer-events-none" />
        <p className="text-[10px] text-slate-400 uppercase tracking-widest mb-1">
          Official Registration Reference
        </p>
        <p className="text-xl font-black text-[#D4AF37] tracking-wider">{data.application_id}</p>
        <div className="flex items-center justify-center gap-2 mt-1">
          <span className="text-xs text-slate-300">
            Physical Form Serial:{' '}
            {canDownload && data.form_no ? (
              <strong className="text-white font-mono">{data.form_no}</strong>
            ) : (
              <span className="text-amber-400 font-semibold italic text-[11px]">
                Pending Online Payment
              </span>
            )}
          </span>
          <span className="text-slate-500">•</span>
          <span className="text-xs text-slate-400">Session: {data.academic_year}</span>
        </div>
      </div>

      {/* Payment Required Warning Banner if not completed */}
      {!isPaid && (
        <div className="bg-gradient-to-r from-amber-500/10 via-amber-500/20 to-amber-500/10 border-2 border-amber-400/80 rounded-2xl p-5 text-center space-y-3 shadow-sm">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-amber-100 text-amber-800 shadow-xs">
            <Lock className="w-6 h-6 text-amber-700" />
          </div>
          <div>
            <h3 className="text-base font-black text-[#00183F]">
              Admission Form & Admit Card Locked
            </h3>
            <p className="text-xs text-slate-700 mt-1 max-w-lg mx-auto leading-relaxed">
              In accordance with admissions policy, an official Form Serial Number and Candidate Admit Card will only be generated once the application processing fee of{' '}
              <strong className="text-amber-900 font-bold">
                {data.payment_currency || 'BDT'} {data.payment_amount || data.application_fee || '1,000'}
              </strong>{' '}
              has been completed online.
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
                  <span>Connecting to Gateway...</span>
                </>
              ) : (
                <>
                  <CreditCard className="w-4 h-4" />
                  <span>
                    Pay Fee Online Now ({data.payment_currency || 'BDT'} {data.payment_amount || data.application_fee || '1,000'})
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Student Info */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white border border-slate-100 rounded-xl p-3">
          <div className="text-[10px] text-slate-400 uppercase tracking-wide font-semibold mb-0.5">Student Name</div>
          <div className="text-sm font-bold text-[#00183F] uppercase">{data.student_name}</div>
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
      {!['rejected', 'withdrawn', 'draft', 'payment_pending'].includes(data.status) && (
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
      {(data.entrance_exam_date || data.interview_date || data.interview_slot || data.documents_verified) && isPaid && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 space-y-3">
          <p className="text-xs font-bold text-amber-900 uppercase tracking-wide flex items-center gap-2">
            <CalendarDays className="w-4 h-4 text-amber-700" /> Entrance Examination & Interview Details
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <div className="text-amber-700 font-semibold mb-0.5">Date of Interview / Assessment</div>
              <div className="font-black text-amber-900">
                {data.interview_slot?.date
                  ? new Date(data.interview_slot.date).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
                  : data.interview_date
                  ? new Date(data.interview_date).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
                  : data.entrance_exam_date
                  ? new Date(data.entrance_exam_date).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
                  : "Scheduled (See Admit Card)"}
              </div>
            </div>
            <div>
              <div className="text-amber-700 font-semibold mb-0.5">Reporting Time & Venue</div>
              <div className="font-black text-amber-900">
                {(data.interview_slot?.start_time ? data.interview_slot.start_time.slice(0, 5) : null) || data.interview_time || '09:30 AM'} • {data.interview_slot?.reporting_venue || data.entrance_exam_venue || '32 Shah Shaheb Lane, Narinda, Dhaka 1100'}
              </div>
            </div>
          </div>
          {data.documents_verified && (
            <div className="flex items-center gap-2 text-xs text-emerald-700 font-semibold pt-1 border-t border-amber-200">
              <CheckCircle2 className="w-4 h-4" /> Documents verified by admissions board.
            </div>
          )}
        </div>
      )}

      {/* Primary Action Buttons: Admit Card & Full Form */}
      {canDownload ? (
        <div className="flex flex-col sm:flex-row gap-3 pt-1 print:hidden">
          <button
            type="button"
            onClick={() => setPrintModalMode('admit_card')}
            className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-[#00183F] hover:bg-[#002257] text-[#D4AF37] font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Print Candidate Admit Card</span>
          </button>

          <button
            type="button"
            onClick={() => setPrintModalMode('full_form')}
            className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-white border border-slate-300 hover:bg-slate-50 text-slate-800 font-bold text-xs sm:text-sm shadow-xs transition-all cursor-pointer"
          >
            <Printer className="w-4 h-4 text-slate-500" />
            <span>Print Full Form + Tear-Off Admit Card</span>
          </button>
        </div>
      ) : (
        <div className="print:hidden">
          <div className="p-3 rounded-xl bg-slate-100 border border-slate-200 text-center text-xs text-slate-500 font-semibold flex items-center justify-center gap-2">
            <Lock className="w-4 h-4 text-slate-400" />
            <span>Form & Admit Card downloads are disabled until payment is confirmed.</span>
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-3 print:hidden">
        <a
          href="/admission"
          className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50 transition-colors"
        >
          Back to Admissions
        </a>
        <a
          href="tel:+8801746866393"
          className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50 transition-colors"
        >
          Contact Admissions Desk <ArrowRight className="w-3.5 h-3.5" />
        </a>
      </div>
      </div>

      {/* Print & PDF Modal */}
      {printModalMode && (
        <div className="fixed inset-0 z-50 bg-slate-900/85 backdrop-blur-sm overflow-y-auto p-3 sm:p-6 flex flex-col items-center print-modal-backdrop print:static print:inset-auto print:z-auto print:bg-transparent print:p-0 print:m-0 print:overflow-visible print:block print:w-full">
          {/* Action Toolbar (Screen Only) */}
          <div className="print:hidden sticky top-2 z-10 w-full max-w-[210mm] bg-[#00183F] text-white rounded-2xl p-4 shadow-2xl flex flex-wrap items-center justify-between gap-3 border border-amber-400/30 mb-4">
            <div className="flex items-center gap-3">
              <Printer className="w-5 h-5 text-[#D4AF37] shrink-0" />
              <div>
                <h3 className="text-sm font-bold text-white">
                  {printModalMode === 'admit_card' ? 'Official Candidate Admit Card' : 'Official Admission Form with Tear-Off Admit Card'}
                </h3>
                <p className="text-[11px] text-slate-300">
                  Select <strong>"Save as PDF"</strong> or print directly on {data.print_page_size || 'A4'} paper.
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
                    data.print_page_size || 'A4'
                  )
                }
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#D4AF37] hover:bg-[#c59f2e] text-[#00183F] font-black text-xs sm:text-sm shadow-md transition-all cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Print / Save PDF</span>
              </button>
              <button
                type="button"
                onClick={() => setPrintModalMode(null)}
                className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs sm:text-sm transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>

          <div className="w-full max-w-[210mm] bg-white rounded-xl shadow-2xl overflow-hidden border border-slate-300 mb-8 print:max-w-none print:w-full print:border-none print:shadow-none print:m-0 print:p-0 print:rounded-none">
            <PrintableApplicationForm
              form={formData}
              applicationId={data.application_id}
              formNo={data.form_no}
              submittedAt={data.submitted_at}
              admitCardOnly={printModalMode === 'admit_card'}
              defaultYellowPaper={false}
              pageSize={data.print_page_size || 'A4'}
              documentChecklist={data.document_checklist || []}
              reportingInstructions={data.reporting_instructions || ''}
              paymentStatus={data.payment_status}
              paymentTransactionId={data.payment_transaction_id}
              interviewSlot={data.interview_slot}
            />
          </div>
        </div>
      )}
    </>
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
    const res = await trackApplicationStatus(trimmed, true);
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
    <div className="max-w-lg w-full print:max-w-none print:w-full">
      {/* Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-lg p-6 mb-5 print:hidden">
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
        <div className="flex items-start gap-3 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-sm mb-5 print:hidden">
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
          className="mt-4 w-full flex items-center justify-center gap-2 py-2.5 text-xs text-slate-500 hover:text-[#00183F] transition-colors font-semibold print:hidden"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Refresh Status
        </button>
      )}
    </div>
  );
}

export default function ApplicationStatusPage() {
  return (
    <div className="bg-slate-50 min-h-screen print:bg-white print:min-h-0">
      <section className="relative py-16 bg-[#00183F] text-white print:hidden">
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

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 flex flex-col lg:flex-row gap-8 items-start print:p-0 print:m-0 print:max-w-none print:w-full print:block">
        <Suspense fallback={
          <div className="flex-1 flex items-center justify-center py-16 print:hidden">
            <Loader2 className="w-8 h-8 animate-spin text-[#00183F]" />
          </div>
        }>
          <StatusCheckerInner />
        </Suspense>

        {/* Side Info Panel */}
        <div className="lg:w-80 space-y-4 flex-shrink-0 print:hidden">
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
