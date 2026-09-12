import React from 'react';
import { Star, ShieldCheck, MapPin, CheckCircle, TrendingDown, Quote } from 'lucide-react';
import { TESTIMONIALS } from '../data/products';

export const CustomerProof: React.FC = () => {
  return (
    <section className="py-20 border-b border-emerald-100 relative bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Verified Nigerian Installations</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 font-heading tracking-tight">
            Powering Nigeria’s Finest Homes & Estates
          </h2>

          <p className="text-base sm:text-lg text-slate-600">
            Hear from executive homeowners, medical directors, and tech founders who stopped burning millions on fuel.
          </p>
        </div>

        {/* Testimonials Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
          {TESTIMONIALS.map((t) => (
            <div
              key={t.id}
              className="p-7 rounded-3xl bg-white border border-slate-200 hover:border-emerald-300 transition-all duration-300 flex flex-col justify-between shadow-lg shadow-slate-200/50 relative group"
            >
              <div className="space-y-4">
                
                {/* Rating stars & verified badge */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  {t.verified && (
                    <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                      <CheckCircle className="w-3 h-3 text-emerald-600" />
                      <span>Verified Owner</span>
                    </div>
                  )}
                </div>

                {/* Quote text */}
                <p className="text-sm text-slate-700 leading-relaxed italic">
                  "{t.quote}"
                </p>
              </div>

              {/* Footer author info & savings badge */}
              <div className="pt-6 mt-6 border-t border-slate-100 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500">Monthly Fuel Kept:</span>
                  <span className="text-emerald-700 font-bold font-mono text-sm">
                    {t.monthlySavings}
                  </span>
                </div>

                <div>
                  <div className="text-base font-bold text-slate-900 font-heading">
                    {t.name}
                  </div>
                  <div className="text-xs text-slate-500">
                    {t.role}
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-slate-600 mt-1">
                    <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{t.location}</span>
                    <span className="text-slate-300">•</span>
                    <span className="text-emerald-700 font-semibold">{t.modelOwned}</span>
                  </div>
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
