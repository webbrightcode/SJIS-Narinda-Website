'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  CheckCircle2,
  XCircle,
  AlertCircle,
  CreditCard,
  Printer,
  Sparkles,
  ArrowRight,
  RefreshCw,
  Phone,
  FileCheck2,
  Clock,
  Loader2,
  Lock,
  Download,
} from 'lucide-react';
import { trackApplicationStatus, initiatePayment } from '@/lib/api';
import type { ApplicationStatusResult } from '@/lib/types';
import { PrintableApplicationForm } from '@/components/admission/PrintableApplicationForm';
import { printDocumentElement } from '@/lib/printUtils';
import { downloadElementAsPdf } from '@/lib/pdfUtils';

function PaymentResultInner() {
  const searchParams = useSearchParams();
  const rawStatus = (searchParams.get('status') || 'pending').toLowerCase();
  const appId = (searchParams.get('id') || searchParams.get('app_id') || '').toUpperCase();
  const phone = (searchParams.get('phone') || '').trim();
  const tranId = searchParams.get('tran_id') || '';

  const [loading, setLoading] = useState(Boolean(appId));
  const [appData, setAppData] = useState<ApplicationStatusResult | null>(null);
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [retrying, setRetrying] = useState(false);
  const [retryError, setRetryError] = useState<string | null>(null);
  const [generatingPdf, setGeneratingPdf] = useState(false);

  const isSuccess = rawStatus === 'success' || appData?.payment_status === 'completed';
  const isCancelled = rawStatus === 'cancel' || rawStatus === 'cancelled';
  const isFailed = rawStatus === 'fail' || rawStatus === 'failed';

  const handleDownloadPdf = async () => {
    if (!appData?.form_no) return;
    setGeneratingPdf(true);
    try {
      const filename = `SJIS-AdmitCard-${appData.form_no || appData.application_id}.pdf`;
      const ok = await downloadElementAsPdf('direct-payment-result-admit-card', filename, {
        pageSize: 'A4',
        scale: 2.5,
      });
      if (!ok) {
        setShowPrintModal(true);
      }
    } catch (e) {
      console.error(e);
      setShowPrintModal(true);
    } finally {
      setGeneratingPdf(false);
    }
  };

  useEffect(() => {
    async function loadApp() {
      if (!appId) {
        setLoading(false);
        return;
      }
      try {
        const res = await trackApplicationStatus(appId, true, phone);
        if (res.success && res.data) {
          setAppData(res.data);
        }
      } catch (err) {
        console.warn('Could not load application after payment:', err);
      } finally {
        setLoading(false);
      }
    }
    loadApp();
  }, [appId, phone]);

  const handleRetryPayment = async () => {
    if (!appId) return;
    setRetrying(true);
    setRetryError(null);
    try {
      const res = await initiatePayment(appId);
      if (res.redirect_url) {
        window.location.href = res.redirect_url;
      } else if (res.message) {
        alert(res.message);
      } else {
        setRetryError(res.error || 'Payment gateway could not be initiated.');
      }
    } catch {
      setRetryError('Network error connecting to payment gateway.');
    } finally {
      setRetrying(false);
    }
  };

  const formData: any = appData?.application || {
    student_first_name: appData?.student_first_name || appData?.student_name?.split(' ')[0] || '',
    student_last_name: appData?.student_last_name || appData?.student_name?.split(' ').slice(1).join(' ') || '',
    student_photo_url: appData?.student_photo_url || '',
    grade_applying: appData?.grade_applying || '',
    academic_year: appData?.academic_year || '2026-2027',
    date_of_birth: '',
    gender: 'male',
    religion: 'Islam',
    nationality: 'Bangladeshi',
    present_address: '32 Shah Shaheb Lane, Narinda, Dhaka 1100',
    contact_phone: '',
    form_no: appData?.form_no,
    interview_date: appData?.interview_date,
    interview_time: appData?.interview_time,
  };

  return (
    <div className="max-w-2xl w-full mx-auto p-4 sm:p-6 py-12">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden text-center p-6 sm:p-10 space-y-6">
        {/* Status Icon */}
        <div className="flex justify-center">
          {isSuccess ? (
            <div className="w-20 h-20 rounded-full bg-emerald-50 border-4 border-emerald-200 flex items-center justify-center text-emerald-600 shadow-md">
              <CheckCircle2 className="w-10 h-10" />
            </div>
          ) : isCancelled ? (
            <div className="w-20 h-20 rounded-full bg-amber-50 border-4 border-amber-200 flex items-center justify-center text-amber-600 shadow-md">
              <Clock className="w-10 h-10" />
            </div>
          ) : (
            <div className="w-20 h-20 rounded-full bg-rose-50 border-4 border-rose-200 flex items-center justify-center text-rose-600 shadow-md">
              <XCircle className="w-10 h-10" />
            </div>
          )}
        </div>

        {/* Heading */}
        <div>
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-2 ${
              isSuccess
                ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                : isCancelled
                ? 'bg-amber-100 text-amber-800 border border-amber-200'
                : 'bg-rose-100 text-rose-800 border border-rose-200'
            }`}
          >
            {isSuccess ? <Sparkles className="w-3.5 h-3.5" /> : <AlertCircle className="w-3.5 h-3.5" />}
            {isSuccess
              ? 'Payment Confirmed'
              : isCancelled
              ? 'Payment Cancelled'
              : 'Payment Transaction Failed'}
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-[#00183F]">
            {isSuccess
              ? 'Application Fee Received!'
              : isCancelled
              ? 'Fee Payment Was Cancelled'
              : 'Unable to Process Payment'}
          </h1>
          <p className="text-slate-600 text-xs sm:text-sm mt-2 max-w-lg mx-auto leading-relaxed">
            {isSuccess
              ? 'Your admission fee payment has been confirmed by the payment gateway. Your physical form serial number and admit card have been generated.'
              : isCancelled
              ? 'You cancelled the transaction before completing payment. Your application details are safely saved; you can complete payment anytime.'
              : 'The transaction could not be authorized by your bank or payment provider. Please retry or visit our school accounts desk.'}
          </p>
        </div>

        {/* Application Reference Badge */}
        {appId && (
          <div className="bg-[#00183F] text-white rounded-2xl p-5 shadow-xl text-center space-y-2 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#D4AF37]/10 rounded-full blur-2xl pointer-events-none" />
            <p className="text-[10px] text-slate-300 uppercase tracking-widest font-semibold">
              Application Reference ID
            </p>
            <p className="font-mono text-2xl font-black text-[#D4AF37] tracking-wider">{appId}</p>

            {appData?.form_no ? (
              <div className="pt-2 text-xs text-slate-200 border-t border-white/10 flex items-center justify-center gap-2">
                <span>Official Form Serial:</span>
                <strong className="text-white font-mono font-bold text-sm bg-white/10 px-2 py-0.5 rounded">
                  {appData.form_no}
                </strong>
              </div>
            ) : null}

            {(tranId || appData?.payment_transaction_id) && (
              <p className="text-[11px] text-slate-400 font-mono">
                Txn Ref: {tranId || appData?.payment_transaction_id}
              </p>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-3 pt-2">
          {isSuccess && appData?.form_no ? (
            <div className="space-y-2.5">
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={handleDownloadPdf}
                  disabled={generatingPdf}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-700 hover:to-teal-800 text-white font-black text-sm shadow-lg shadow-emerald-700/25 active:scale-[0.98] transition-all cursor-pointer disabled:opacity-60"
                >
                  {generatingPdf ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-white" />
                      <span>Generating Admit Card PDF...</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4 text-emerald-200" />
                      <span>Download Admit Card (PDF)</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setShowPrintModal(true)}
                  className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-white border border-slate-300 hover:bg-slate-50 text-slate-800 font-bold text-xs sm:text-sm shadow-xs transition-all cursor-pointer"
                >
                  <Printer className="w-4 h-4 text-slate-500" />
                  <span>Full Form</span>
                </button>

                <Link
                  href={`/admission/status?id=${appId}${phone || appData?.application?.contact_phone ? `&phone=${encodeURIComponent(phone || appData?.application?.contact_phone || '')}` : ''}`}
                  className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-[#00183F] text-amber-300 font-bold text-xs sm:text-sm hover:bg-[#002257] transition-all shadow-md cursor-pointer"
                >
                  <FileCheck2 className="w-4 h-4" />
                  <span>Track Status</span>
                </Link>
              </div>

              <p className="text-[11px] text-center text-slate-500">
                💡 Tap <strong>Download Admit Card (PDF)</strong> on your mobile phone to save the official PDF directly to your device.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {retryError && (
                <p className="text-xs text-rose-700 font-bold bg-rose-50 border border-rose-200 rounded-lg p-2 max-w-md mx-auto">
                  {retryError}
                </p>
              )}
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  type="button"
                  disabled={retrying}
                  onClick={handleRetryPayment}
                  className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-black text-sm shadow-lg shadow-emerald-700/25 active:scale-[0.98] transition-all cursor-pointer disabled:opacity-50"
                >
                  {retrying ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Opening Gateway...</span>
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-4 h-4" />
                      <span>Retry Online Payment</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                <Link
                  href={`/admission/status?id=${appId}${phone || appData?.application?.contact_phone ? `&phone=${encodeURIComponent(phone || appData?.application?.contact_phone || '')}` : ''}`}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl border border-slate-300 bg-white text-slate-700 font-bold text-sm hover:bg-slate-50 transition-all cursor-pointer"
                >
                  <span>View Status</span>
                </Link>
              </div>
            </div>
          )}

          <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
            <Link href="/" className="hover:text-[#00183F] font-semibold">
              ← Return to School Homepage
            </Link>
            <a href="tel:+8801746866393" className="inline-flex items-center gap-1.5 hover:text-[#00183F] font-semibold">
              <Phone className="w-3.5 h-3.5 text-amber-600" />
              Admissions Desk: +880 1746-866393
            </a>
          </div>
        </div>
      </div>

      {/* Print & PDF Modal */}
      {showPrintModal && appData?.form_no && (
        <div className="fixed inset-0 z-50 bg-slate-900/85 backdrop-blur-sm overflow-y-auto p-3 sm:p-6 flex flex-col items-center">
          <div className="sticky top-2 z-10 w-full max-w-[210mm] bg-[#00183F] text-white rounded-2xl p-4 shadow-2xl flex flex-wrap items-center justify-between gap-3 border border-amber-400/30 mb-4">
            <div className="flex items-center gap-3">
              <Printer className="w-5 h-5 text-[#D4AF37] shrink-0" />
              <div>
                <h3 className="text-sm font-bold text-white">Official Application Print & PDF Generator</h3>
                <p className="text-[11px] text-slate-300">
                  Select <strong>"Save as PDF"</strong> to save to your device.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <button
                type="button"
                onClick={() => {
                  downloadElementAsPdf(
                    'physical-admission-document',
                    `SJIS-ApplicationForm-${appData.form_no || appData.application_id}.pdf`,
                    { pageSize: appData.print_page_size || 'A4', scale: 2.5 }
                  );
                }}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Download PDF</span>
              </button>
              <button
                type="button"
                onClick={() =>
                  printDocumentElement(
                    'physical-admission-document',
                    'St. Joseph International School - Official Document',
                    appData.print_page_size || 'A4'
                  )
                }
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#D4AF37] hover:bg-[#c59f2e] text-[#00183F] font-black text-xs sm:text-sm shadow-md transition-all cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Print</span>
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

          <div className="w-full max-w-[210mm] bg-white rounded-xl shadow-2xl overflow-hidden border border-slate-300 mb-8">
            <PrintableApplicationForm
              form={formData}
              applicationId={appData.application_id}
              formNo={appData.form_no}
              submittedAt={appData.submitted_at}
              pageSize={appData.print_page_size || 'Legal'}
              documentChecklist={appData.document_checklist || []}
              reportingInstructions={appData.reporting_instructions || ''}
              paymentStatus={appData.payment_status}
              paymentTransactionId={appData.payment_transaction_id}
              interviewSlot={appData.interview_slot}
              admissionTestDate={(appData as any).admission_test_date || (appData as any).entrance_exam_date}
              admissionTestTime={(appData as any).admission_test_time || (appData as any).interview_time}
            />
          </div>
        </div>
      )}

      {/* Off-screen direct Admit Card render target (rendered only when payment is confirmed) */}
      {isSuccess && appData?.form_no && (
        <div
          id="direct-payment-admit-card-container"
          style={{
            position: 'fixed',
            left: '-9999px',
            top: '0',
            width: '210mm',
            background: '#ffffff',
            zIndex: -50,
          }}
          aria-hidden="true"
        >
          <div id="direct-payment-result-admit-card">
            <PrintableApplicationForm
              form={formData}
              applicationId={appData.application_id}
              formNo={appData.form_no}
              submittedAt={appData.submitted_at}
              admitCardOnly={true}
              defaultYellowPaper={false}
              pageSize="A4"
              documentChecklist={appData.document_checklist || []}
              reportingInstructions={appData.reporting_instructions || ''}
              paymentStatus={appData.payment_status}
              paymentTransactionId={appData.payment_transaction_id}
              interviewSlot={appData.interview_slot}
              admissionTestDate={(appData as any).admission_test_date || (appData as any).entrance_exam_date}
              admissionTestTime={(appData as any).admission_test_time || (appData as any).interview_time}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default function PaymentResultPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <Suspense
        fallback={
          <div className="flex items-center justify-center p-12">
            <Loader2 className="w-8 h-8 animate-spin text-[#00183F]" />
          </div>
        }
      >
        <PaymentResultInner />
      </Suspense>
    </div>
  );
}
