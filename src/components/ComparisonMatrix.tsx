import React, { useState } from 'react';
import { 
  Check, 
  X, 
  AlertTriangle, 
  VolumeX, 
  Flame, 
  Sun, 
  TrendingDown, 
  Zap, 
  Sparkles,
  Calculator
} from 'lucide-react';
import { COMPARISON_DATA } from '../data/products';
import { formatNaira } from '../utils/formatters';

export const ComparisonMatrix: React.FC = () => {
  // Fuel savings simulator state: Daily fuel spend in Naira
  const [dailyFuelSpend, setDailyFuelSpend] = useState<number>(18000); // ₦18k/day average Nigerian spend

  const yearlyFuelWasted = dailyFuelSpend * 365;
  const fiveYearFuelWasted = yearlyFuelWasted * 5;

  return (
    <section id="comparison" className="py-20 border-b border-emerald-100 relative bg-white">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-emerald-500/5 rounded-full blur-[160px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold uppercase tracking-wider">
            <Zap className="w-3.5 h-3.5 text-emerald-600" />
            <span>The Power Shift</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 font-heading tracking-tight">
            Why EverFlow Disrupts Everything
          </h2>

          <p className="text-base sm:text-lg text-slate-600">
            Compare EverFlow Energy directly against noisy petrol/diesel combustion generators 
            and weather-dependent solar inverter installations.
          </p>
        </div>

        {/* High-Contrast Comparison Matrix Table */}
        <div className="overflow-x-auto pb-4">
          <div className="min-w-[760px] rounded-3xl bg-white border border-slate-200 p-6 sm:p-8 shadow-xl shadow-slate-200/50">
            
            {/* Table Header */}
            <div className="grid grid-cols-12 gap-4 pb-6 border-b border-slate-200 text-left items-center">
              <div className="col-span-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                Evaluation Factor
              </div>
              
              {/* EverFlow (Hero Column) */}
              <div className="col-span-3 p-3 rounded-2xl bg-emerald-50 border border-emerald-300 text-center shadow-sm">
                <div className="flex items-center justify-center gap-1.5 text-emerald-800 text-xs font-bold uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                  <span>EverFlow Energy</span>
                </div>
                <div className="text-xs text-emerald-700 font-medium mt-0.5">Quantum Zero-Fuel</div>
              </div>

              {/* Petrol / Diesel */}
              <div className="col-span-2.5 sm:col-span-2.5 text-center p-2 rounded-xl bg-slate-100 border border-slate-200">
                <div className="text-xs font-bold text-slate-700 uppercase tracking-wider">Petrol / Diesel</div>
                <div className="text-[11px] text-slate-500">Lister / Mikano / Tigers</div>
              </div>

              {/* Solar Panels */}
              <div className="col-span-2.5 sm:col-span-2.5 text-center p-2 rounded-xl bg-slate-100 border border-slate-200">
                <div className="text-xs font-bold text-slate-700 uppercase tracking-wider">Solar Systems</div>
                <div className="text-[11px] text-slate-500">Roof Panels + Lithium</div>
              </div>
            </div>

            {/* Table Rows */}
            <div className="divide-y divide-slate-100 text-left text-sm">
              {COMPARISON_DATA.map((row, idx) => (
                <div key={idx} className="grid grid-cols-12 gap-4 py-4.5 items-center hover:bg-slate-50 transition-colors">
                  
                  {/* Factor Title */}
                  <div className="col-span-4 font-semibold text-slate-800 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 shrink-0" />
                    <span>{row.feature}</span>
                  </div>

                  {/* EverFlow Cell (Highlighted) */}
                  <div className="col-span-3 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 font-semibold text-xs text-center flex items-center justify-center gap-1.5">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{row.everflow}</span>
                  </div>

                  {/* Petrol Cell */}
                  <div className="col-span-2.5 text-xs text-slate-600 text-center flex items-center justify-center gap-1.5">
                    <X className="w-4 h-4 text-rose-500 shrink-0" />
                    <span>{row.petrol}</span>
                  </div>

                  {/* Solar Cell */}
                  <div className="col-span-2.5 text-xs text-slate-600 text-center flex items-center justify-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    <span>{row.solar}</span>
                  </div>

                </div>
              ))}
            </div>

          </div>
        </div>

        {/* Interactive Nigerian Fuel Waste vs Savings Simulator */}
        <div className="mt-16 rounded-3xl bg-slate-50 border border-slate-200 p-6 sm:p-10 text-left shadow-lg relative overflow-hidden">
          
          <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold uppercase tracking-wider">
                <Flame className="w-3.5 h-3.5 text-rose-600" />
                <span>The Petrol Trap Simulator</span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 font-heading">
                How Much Are You Burning on Fuel Right Now?
              </h3>

              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                With PMS petrol now above ₦1,050 – ₦1,200/L in Lagos and Abuja, traditional generators are draining 
                personal and business savings. EverFlow eliminates this completely.
              </p>

              {/* Slider Controller */}
              <div className="space-y-3 pt-2">
                <div className="flex justify-between items-baseline">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Your Current Daily Fuel Expense:
                  </label>
                  <span className="text-2xl font-black text-rose-600 font-mono">
                    {formatNaira(dailyFuelSpend)} <span className="text-xs text-slate-500 font-normal">/ day</span>
                  </span>
                </div>

                <input
                  type="range"
                  min="5000"
                  max="60000"
                  step="1000"
                  value={dailyFuelSpend}
                  onChange={(e) => setDailyFuelSpend(Number(e.target.value))}
                  className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-rose-600"
                />

                <div className="flex justify-between text-[11px] text-slate-500 font-mono">
                  <span>₦5,000 (Small Generator)</span>
                  <span>₦25,000 (Home Duplex)</span>
                  <span>₦60,000+ (Commercial)</span>
                </div>
              </div>
            </div>

            {/* Visual Output Card */}
            <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* 1 Year Savings */}
              <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-2 shadow-sm">
                <div className="text-xs uppercase font-bold text-slate-500 flex items-center justify-between">
                  <span>1-Year Cash Waste:</span>
                  <span className="text-rose-600 font-semibold">365 Days</span>
                </div>
                <div className="text-3xl sm:text-4xl font-black text-rose-600 font-heading">
                  {formatNaira(yearlyFuelWasted)}
                </div>
                <div className="text-xs text-slate-600 pt-1">
                  Money literally burned into toxic exhaust and noise pollution.
                </div>
              </div>

              {/* 5 Year Savings with EverFlow */}
              <div className="p-6 rounded-2xl bg-emerald-50 border-2 border-emerald-300 space-y-2 shadow-md shadow-emerald-500/10">
                <div className="text-xs uppercase font-bold text-emerald-800 flex items-center justify-between">
                  <span>5-Year EverFlow Savings:</span>
                  <span className="text-emerald-700 font-semibold">Protected</span>
                </div>
                <div className="text-3xl sm:text-4xl font-black text-emerald-800 font-heading">
                  {formatNaira(fiveYearFuelWasted)}
                </div>
                <div className="text-xs text-emerald-800 pt-1">
                  100% retained capital. Pays for your EverFlow unit multiple times over!
                </div>
              </div>

            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
