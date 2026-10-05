'use client';

import React, { useState } from 'react';
import { Sparkles, X, Send, CheckCircle2, MessageSquareText } from 'lucide-react';
import { submitAdmissionInquiry } from '@/lib/api';
import { useSiteSettings } from '@/components/layout/SiteSettingsContext';

export const QuickInquiryFloating: React.FC = () => {
  const site = useSiteSettings();
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState({
    student_name: '',
    parent_name: '',
    email: '',
    phone: '',
    grade_applying: 'Playgroup',
    message: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const result = await submitAdmissionInquiry(formData);
      if (result.success) {
        setIsSuccess(true);
        setTimeout(() => {
          setIsSuccess(false);
          setIsOpen(false);
          setFormData({
            student_name: '',
            parent_name: '',
            email: '',
            phone: '',
            grade_applying: 'Playgroup',
            message: '',
          });
        }, 3000);
      } else {
        alert(result.message || 'Unable to send inquiry.');
      }
    } catch {
      alert(`Unable to send inquiry. Please call admissions directly on ${site.phone_primary}.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Floating Trigger Pill */}
      <div className="hidden sm:flex fixed bottom-20 lg:bottom-6 left-4 sm:left-6 z-30">
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2.5 px-4 py-3 rounded-full bg-gradient-to-r from-[#C8102E] to-[#A00B22] text-white font-bold text-xs sm:text-sm shadow-xl shadow-[#C8102E]/30 hover:shadow-2xl hover:shadow-[#C8102E]/40 hover:-translate-y-0.5 active:translate-y-0 transition-all border border-rose-400/30 group cursor-pointer"
        >
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-300 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-400"></span>
          </span>
          <MessageSquareText className="w-4 h-4 text-white group-hover:scale-110 transition-transform" />
          <span>Quick Admissions Inquiry</span>
        </button>
      </div>

      {/* Slide-over / Modal Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div
            className="w-full sm:max-w-md bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh] animate-in slide-in-from-bottom duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="px-6 py-5 bg-[#00183F] text-white flex items-center justify-between relative overflow-hidden">
              <div className="relative z-10">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#D4AF37]/25 text-amber-200 text-[10px] font-extrabold uppercase tracking-wider mb-1">
                  <Sparkles className="w-3 h-3 text-[#D4AF37]" />
                  <span>Admissions 2026-2027</span>
                </div>
                <h3 className="text-lg font-black text-white">Direct Registrar Inquiry</h3>
                <p className="text-xs text-slate-300">
                  Our admissions office will contact you within 24 hours.
                </p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="relative z-10 p-2 text-slate-300 hover:text-white rounded-full hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content Form or Success Screen */}
            <div className="p-6 overflow-y-auto">
              {isSuccess ? (
                <div className="py-8 text-center space-y-4">
                  <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h4 className="text-xl font-black text-[#00183F]">Inquiry Dispatched!</h4>
                  <p className="text-sm text-slate-600 max-w-xs mx-auto">
                    Thank you. The Admissions Registrar has received your inquiry for{' '}
                    <span className="font-bold text-[#00183F]">{formData.student_name}</span>.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Student Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Abrar Rahman"
                      value={formData.student_name}
                      onChange={(e) => setFormData({ ...formData, student_name: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-[#00183F] outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                        Grade Level *
                      </label>
                      <select
                        value={formData.grade_applying}
                        onChange={(e) =>
                          setFormData({ ...formData, grade_applying: e.target.value })
                        }
                        className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-[#00183F] outline-none bg-white font-medium"
                      >
                        {site.inquiry_grades.map((g) => (
                          <option key={g}>{g}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                        Phone (WhatsApp) *
                      </label>
                      <input
                        type="tel"
                        inputMode="tel"
                        autoComplete="tel"
                        required
                        placeholder="+880 17XX-XXXXXX"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-[#00183F] outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Parent / Guardian Name *
                    </label>
                    <input
                      type="text"
                      autoComplete="name"
                      required
                      placeholder="e.g. Dr. Mahmudul Hasan"
                      value={formData.parent_name}
                      onChange={(e) => setFormData({ ...formData, parent_name: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-[#00183F] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      inputMode="email"
                      autoComplete="email"
                      required
                      placeholder="parent@domain.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-[#00183F] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Specific Questions / Notes (Optional)
                    </label>
                    <textarea
                      rows={2}
                      placeholder="Inquire regarding admission criteria, curriculum, transport..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-[#00183F] outline-none resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#00183F] to-[#0A2540] hover:from-[#00122e] text-white font-bold text-sm shadow-md hover:shadow-lg flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
                  >
                    <Send className="w-4 h-4 text-[#D4AF37]" />
                    <span>{isSubmitting ? 'Transmitting...' : 'Submit Inquiry To Registrar'}</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
