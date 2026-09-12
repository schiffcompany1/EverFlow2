import React, { useState } from 'react';
import { ChevronDown, HelpCircle, ShieldAlert, Sparkles, PhoneCall } from 'lucide-react';
import { FAQS } from '../data/products';

export const FAQSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleIndex = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section id="faqs" className="py-20 border-b border-emerald-100 relative bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center space-y-4 mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold uppercase tracking-wider">
            <HelpCircle className="w-3.5 h-3.5 text-emerald-600" />
            <span>Clear Answers</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 font-heading tracking-tight">
            Frequently Asked Questions
          </h2>

          <p className="text-base text-slate-600">
            Everything you need to know about EverFlow technology, Pay-Small-Small financing, and nationwide setup.
          </p>
        </div>

        {/* Accordion List */}
        <div className="space-y-4 text-left">
          {FAQS.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                  isOpen
                    ? 'bg-white border-2 border-emerald-300 shadow-md shadow-emerald-500/10'
                    : 'bg-slate-50 border border-slate-200 hover:border-slate-300'
                }`}
              >
                <button
                  onClick={() => toggleIndex(idx)}
                  className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 cursor-pointer focus:outline-none"
                >
                  <span className="text-base sm:text-lg font-bold text-slate-900 font-heading">
                    {faq.question}
                  </span>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-transform duration-300 ${
                    isOpen ? 'rotate-180 bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-500'
                  }`}>
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 pb-6 sm:px-6 sm:pb-6 text-slate-600 text-sm leading-relaxed border-t border-slate-100 pt-4 animate-in fade-in duration-200">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Bottom Contact Help Card */}
        <div className="mt-12 p-6 rounded-2xl bg-emerald-50 border border-emerald-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-left shadow-sm">
          <div>
            <div className="text-base font-bold text-slate-900 font-heading">
              Still have specific technical or load questions?
            </div>
            <div className="text-xs text-slate-600">
              Speak directly with an EverFlow Principal Power Systems Engineer in Lagos or Abuja.
            </div>
          </div>
          <a
            href="https://wa.me/2348123456789?text=Hello%20EverFlow!%20I%20have%20a%20technical%20question%20about%20your%20zero-fuel%20generators."
            target="_blank"
            rel="noreferrer"
            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 shrink-0 transition-all shadow-md shadow-emerald-600/20 cursor-pointer"
          >
            <PhoneCall className="w-4 h-4" />
            <span>Chat on WhatsApp</span>
          </a>
        </div>

      </div>
    </section>
  );
};
