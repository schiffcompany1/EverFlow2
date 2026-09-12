import React from 'react';
import { 
  Zap, 
  MapPin, 
  Phone, 
  Mail, 
  ShieldCheck, 
  Clock, 
  ExternalLink,
  Lock,
  ArrowUpRight,
  ShieldAlert,
  Settings,
  Gift,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const Footer: React.FC = () => {
  const { products, setView, openReferralModal } = useStore();
  return (
    <footer className="bg-slate-50 border-t border-slate-200 text-slate-600 text-left pt-16 pb-28 sm:pb-20 relative">
      {/* Floating 'Refer a Friend' Badge in the Footer */}
      <div className="sticky top-auto bottom-6 z-20 flex justify-center sm:justify-end px-4 sm:px-8 mb-6 pointer-events-none">
        <button
          id="floating-refer-badge"
          onClick={openReferralModal}
          className="pointer-events-auto group relative flex items-center gap-3.5 px-5 py-3 rounded-full bg-slate-900/95 hover:bg-slate-900 text-white shadow-2xl shadow-emerald-900/40 border-2 border-emerald-500/50 hover:border-emerald-400 backdrop-blur-xl transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
        >
          {/* Pulsing Gift Icon with Emerald Ring */}
          <div className="relative shrink-0">
            <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 border border-emerald-400/40 group-hover:bg-emerald-500 group-hover:text-slate-950 transition-colors">
              <Gift className="w-4 h-4" />
            </div>
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-400" />
          </div>

          {/* Text labels */}
          <div className="text-left pr-1">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-black text-white tracking-wide font-heading">
                Refer a Friend
              </span>
              <span className="text-[10px] uppercase font-black tracking-wider px-1.5 py-0.5 rounded bg-emerald-500 text-slate-950 shadow-xs">
                Earn ₦150k
              </span>
            </div>
            <div className="text-[11px] text-slate-300 font-medium">
              Give 5% off • Instant Cash Payout
            </div>
          </div>

          <ArrowRight className="w-4 h-4 text-emerald-400 group-hover:translate-x-1 transition-transform shrink-0" />
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-200">
          
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-600 p-0.5 flex items-center justify-center">
                <div className="w-full h-full rounded-[10px] bg-white flex items-center justify-center">
                  <Zap className="w-4 h-4 text-emerald-600 fill-emerald-600" />
                </div>
              </div>
              <span className="text-xl font-bold text-slate-900 font-heading">
                EverFlow <span className="text-emerald-700">Energy</span>
              </span>
            </div>

            <p className="text-sm text-slate-600 max-w-sm leading-relaxed">
              Nigeria’s pioneering clean-energy technology company. 
              Engineering fuel-free, zero-solar, 0 dB silent quantum power generators 
              backed by flexible Pay-Small-Small financing.
            </p>

            <div className="flex items-center gap-3 text-xs text-slate-500 pt-2">
              <span className="px-2.5 py-1 rounded bg-white border border-slate-200 text-emerald-700 font-mono shadow-xs">
                SON REG: NG/EF-2026/884
              </span>
              <span className="px-2.5 py-1 rounded bg-white border border-slate-200 text-emerald-700 font-mono shadow-xs">
                CE CERTIFIED
              </span>
            </div>
          </div>

          {/* Quick Models */}
          <div className="space-y-3">
            <div className="text-xs uppercase font-bold text-slate-900 tracking-wider">
              EverFlow Generators
            </div>
            <ul className="space-y-2 text-sm">
              {products.map((m) => (
                <li key={m.id}>
                  <a 
                    href="#models" 
                    className="hover:text-emerald-700 transition-colors flex items-center justify-between"
                  >
                    <span>{m.name}</span>
                    <span className="text-xs text-slate-500 font-mono">{m.kva} kVA</span>
                  </a>
                </li>
              ))}
              <li>
                <a href="#sizer" className="text-emerald-700 hover:text-emerald-800 transition-colors text-xs font-semibold flex items-center gap-1">
                  <span>Custom Load Sizing</span>
                  <ArrowUpRight className="w-3 h-3" />
                </a>
              </li>
            </ul>
          </div>

          {/* Showroom Locations */}
          <div className="space-y-3">
            <div className="text-xs uppercase font-bold text-slate-900 tracking-wider">
              Nigerian Showrooms
            </div>
            <div className="space-y-3 text-xs text-slate-600">
              <div>
                <div className="text-slate-900 font-semibold flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                  Lagos Flagship Experience Hub:
                </div>
                <p className="mt-0.5 pl-5">Plot 14B, Adeola Odeku Street, Victoria Island, Lagos.</p>
              </div>

              <div>
                <div className="text-slate-900 font-semibold flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                  Abuja Executive Suite:
                </div>
                <p className="mt-0.5 pl-5">Constitution Avenue, Central Business District (CBD), Abuja FCT.</p>
              </div>
            </div>
          </div>

          {/* Contact & Hours */}
          <div className="space-y-3">
            <div className="text-xs uppercase font-bold text-slate-900 tracking-wider">
              Client Support 24/7
            </div>
            <div className="space-y-2 text-xs text-slate-600">
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-slate-900 font-mono font-semibold">+234 (0) 800-EVERFLOW</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-slate-900">concierge@everflowenergy.ng</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>Showroom: Mon – Sat (8am – 7pm)</span>
              </div>
              <div className="pt-2 text-[11px] text-emerald-800 font-medium">
                ⚡ 24/7 Priority Emergency Dispatch
              </div>
            </div>
          </div>

        </div>

        {/* Bottom copyright & disclaimer */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © {new Date().getFullYear()} EverFlow Energy Technologies Ltd. All rights reserved. Registered with CAC Nigeria.
          </div>
          <div className="flex flex-wrap items-center gap-5">
            <span className="hover:text-slate-800 cursor-pointer">Warranty Policy</span>
            <span className="hover:text-slate-800 cursor-pointer">Pay-Small-Small Terms</span>
            <span className="hover:text-slate-800 cursor-pointer">Privacy Protocol</span>
            <button
              onClick={() => setView('admin')}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-200/80 hover:bg-slate-300 text-slate-700 hover:text-slate-900 font-semibold transition-colors cursor-pointer"
            >
              <Settings className="w-3.5 h-3.5 text-slate-600" />
              <span>Admin Console</span>
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
