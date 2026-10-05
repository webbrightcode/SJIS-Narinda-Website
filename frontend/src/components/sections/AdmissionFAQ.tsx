'use client';

import React, { useState, useEffect } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { FAQ } from '@/lib/types';
import { getFaqs } from '@/lib/api';
import { SectionHeading } from '@/components/ui/SectionHeading';

export const AdmissionFAQ: React.FC = () => {
  const [FAQS, setFaqs] = useState<FAQ[]>([]);
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  useEffect(() => {
    getFaqs(true).then(setFaqs);
  }, []);

  if (FAQS.length === 0) return null;

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section className="py-20 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          badge="Admissions Q&A"
          title="Frequently Asked Questions"
          subtitle="Everything you need to know about the admissions timeline, eligibility, and assessment criteria."
        />

        <div className="mt-12 space-y-4">
          {FAQS.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                  isOpen
                    ? 'border-[#00183F] bg-slate-50/70 shadow-md'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggle(index)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left gap-4 cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <HelpCircle
                      className={`w-5 h-5 shrink-0 ${
                        isOpen ? 'text-[#C8102E]' : 'text-slate-400'
                      }`}
                    />
                    <span
                      className={`text-base font-bold tracking-tight ${
                        isOpen ? 'text-[#00183F]' : 'text-slate-800'
                      }`}
                    >
                      {faq.question}
                    </span>
                  </div>
                  <ChevronDown
                    className={`w-5 h-5 text-slate-500 shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-[#00183F]' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-6 pb-6 pt-1 text-sm text-slate-600 leading-relaxed border-t border-slate-200/50">
                    <p>{faq.answer}</p>
                    <span className="inline-block mt-3 text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-slate-200 text-slate-700">
                      Category: {faq.category}
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
