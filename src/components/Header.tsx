import React, { useState } from 'react';
import { Sparkles, Zap, Shield, Menu, X, ShoppingBag, ArrowUpRight, PhoneCall, Settings, MessageSquare, MessageCircle, Type, Check } from 'lucide-react';
import { ProductModel } from '../types';
import { useStore } from '../context/StoreContext';

interface HeaderProps {
  onOpenReservation: (model?: ProductModel) => void;
  selectedModel: ProductModel;
  cartCount: number;
}

const FONT_OPTIONS = [
  { id: 'cyber-tech', name: 'Cyber Tech', fontName: 'Outfit', desc: 'Modern Clean-Tech' },
  { id: 'aero-geometric', name: 'Aero Geometric', fontName: 'Sora', desc: 'Futuristic Precision' },
  { id: 'executive-bold', name: 'Executive Bold', fontName: 'Syne', desc: 'Heavy Display' },
] as const;

export const Header: React.FC<HeaderProps> = ({
  onOpenReservation,
  selectedModel,
  cartCount
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [fontDropdownOpen, setFontDropdownOpen] = useState(false);
  const { setView, orders, inquiries, setIsCustomerInquiryModalOpen, openQuickChat, fontStyle, setFontStyle } = useStore();

  const pendingOrdersCount = orders.filter((o) => o.status === 'pending_verification').length;
  const newInquiriesCount = inquiries.filter((i) => i.status === 'new').length;
  const adminAlertCount = pendingOrdersCount + newInquiriesCount;

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -80;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-2xl bg-white/90 border-b border-emerald-100 shadow-xs transition-all duration-300">
      {/* Top micro announcement bar */}
      <div className="bg-emerald-50 border-b border-emerald-100/80 py-1.5 px-4 text-xs font-medium text-emerald-800 text-center flex items-center justify-center gap-2 sm:gap-4 overflow-hidden">
        <span className="flex items-center gap-1.5 text-emerald-800 font-semibold tracking-wide uppercase text-[11px]">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
          🇳🇬 Nationwide Nigeria Priority Dispatch
        </span>
        <span className="hidden md:inline text-emerald-300">•</span>
        <span className="hidden md:inline text-slate-700">
          Lock in 2026 Price Shield with 20% Initial Deposit
        </span>
        <span className="hidden lg:inline text-emerald-300">•</span>
        <span className="hidden lg:flex items-center gap-1 text-emerald-700 font-semibold">
          <Shield className="w-3.5 h-3.5" /> SON & CE Certified Safe
        </span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <a 
          href="#" 
          className="flex items-center gap-3 group focus:outline-none"
          id="nav-brand-logo"
        >
          <div className="relative w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-500/20 via-green-500/10 to-transparent p-0.5 border border-emerald-500/30 group-hover:border-emerald-500 transition-colors shadow-sm shadow-emerald-500/10">
            <div className="w-full h-full rounded-[10px] bg-white flex items-center justify-center relative overflow-hidden">
              {/* Infinity loop neon glow */}
              <svg className="w-6 h-6 text-emerald-600 drop-shadow-[0_0_6px_rgba(16,185,129,0.4)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18.178 8c5.096 0 5.096 8 0 8-5.095 0-7.133-8-12.739-8-4.585 0-4.585 8 0 8 5.606 0 7.644-8 12.74-8z" />
              </svg>
              <div className="absolute inset-0 bg-emerald-500/5 animate-pulse pointer-events-none" />
            </div>
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 font-heading">
                EverFlow
              </span>
              <span className="text-xl sm:text-2xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-green-600 font-heading">
                Energy
              </span>
            </div>
            <span className="text-[10px] tracking-widest uppercase font-bold text-emerald-700 -mt-1">
              Zero Fuel • 0 dB Silent
            </span>
          </div>
        </a>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1 bg-slate-50 p-1.5 rounded-full border border-slate-200/80 shadow-xs backdrop-blur-xl">
          <button 
            onClick={() => scrollToSection('models')} 
            className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 rounded-full hover:bg-white transition-colors cursor-pointer"
            id="nav-link-models"
          >
            Models
          </button>
          <button 
            onClick={() => scrollToSection('calculator')} 
            className="px-4 py-2 text-sm font-semibold text-emerald-700 hover:text-emerald-800 rounded-full hover:bg-emerald-50 transition-colors flex items-center gap-1.5 cursor-pointer"
            id="nav-link-calculator"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Pay-Small-Small
          </button>
          <button 
            onClick={() => scrollToSection('sizer')} 
            className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 rounded-full hover:bg-white transition-colors cursor-pointer"
            id="nav-link-sizer"
          >
            Load Sizer
          </button>
          <button 
            onClick={() => scrollToSection('comparison')} 
            className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 rounded-full hover:bg-white transition-colors cursor-pointer"
            id="nav-link-comparison"
          >
            Comparison
          </button>
          <button 
            onClick={() => scrollToSection('technology')} 
            className="px-3.5 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 rounded-full hover:bg-white transition-colors cursor-pointer"
            id="nav-link-tech"
          >
            Technology
          </button>
          <button 
            onClick={() => scrollToSection('live-performance-telemetry')} 
            className="px-3 py-1.5 text-xs font-bold text-emerald-800 bg-emerald-100/70 hover:bg-emerald-200/80 rounded-full transition-all flex items-center gap-1.5 cursor-pointer"
            id="nav-link-telemetry"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-ping" />
            <span>Live Telemetry</span>
          </button>
          <button 
            onClick={() => scrollToSection('deployments-map')} 
            className="px-3.5 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 rounded-full hover:bg-white transition-colors cursor-pointer"
            id="nav-link-deployments"
          >
            Deployments
          </button>
          <button 
            onClick={() => scrollToSection('faqs')} 
            className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 rounded-full hover:bg-white transition-colors cursor-pointer"
            id="nav-link-faq"
          >
            FAQ
          </button>
          <button
            onClick={() => setIsCustomerInquiryModalOpen(true)}
            className="px-3.5 py-1.5 text-xs font-bold text-slate-700 hover:text-emerald-800 rounded-full hover:bg-white transition-colors flex items-center gap-1 cursor-pointer"
            id="nav-link-inquire"
          >
            <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
            <span>Inquire</span>
          </button>
        </nav>

        {/* Action CTAs */}
        <div className="flex items-center gap-2.5">
          {/* Font Style Switcher Dropdown */}
          <div className="relative">
            <button
              id="header-font-style-btn"
              onClick={() => setFontDropdownOpen(!fontDropdownOpen)}
              title="Change application typography style"
              className="px-2.5 sm:px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200/90 text-slate-700 hover:text-slate-900 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
            >
              <Type className="w-3.5 h-3.5 text-emerald-600" />
              <span className="hidden xl:inline">Font:</span>
              <span className="font-bold text-slate-900">
                {FONT_OPTIONS.find((f) => f.id === fontStyle)?.fontName || 'Outfit'}
              </span>
            </button>

            {fontDropdownOpen && (
              <>
                <div 
                  className="fixed inset-0 z-40" 
                  onClick={() => setFontDropdownOpen(false)} 
                />
                <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-white border border-slate-200 shadow-xl p-2 z-50 text-left space-y-1 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-3 py-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Typography Pairing
                  </div>
                  {FONT_OPTIONS.map((opt) => {
                    const isSelected = fontStyle === opt.id;
                    return (
                      <button
                        key={opt.id}
                        onClick={() => {
                          setFontStyle(opt.id);
                          setFontDropdownOpen(false);
                        }}
                        className={`w-full p-2.5 rounded-xl text-left flex items-center justify-between transition-colors cursor-pointer ${
                          isSelected 
                            ? 'bg-emerald-50 text-emerald-950 font-bold border border-emerald-200' 
                            : 'hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <div>
                          <div className="text-xs font-bold flex items-center gap-2">
                            <span>{opt.name}</span>
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 font-mono text-slate-600">
                              {opt.fontName}
                            </span>
                          </div>
                          <div className="text-[10px] text-slate-500 mt-0.5">{opt.desc}</div>
                        </div>
                        {isSelected && <Check className="w-4 h-4 text-emerald-600 shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </>
            )}
          </div>

          {/* WhatsApp Quick Chat Button */}
          <button
            id="header-quick-chat-btn"
            onClick={() => openQuickChat(selectedModel)}
            title={`Quick Chat on WhatsApp regarding ${selectedModel.name}`}
            className="px-3 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 hover:text-emerald-950 border border-emerald-300/80 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
          >
            <MessageCircle className="w-4 h-4 text-emerald-600 fill-emerald-600/20" />
            <span className="hidden md:inline">Quick Chat</span>
          </button>

          {/* Admin Panel Quick Access Button */}
          <button
            id="header-admin-btn"
            onClick={() => setView('admin')}
            title="Open EverFlow Admin Console"
            className="relative px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200/90 text-slate-700 hover:text-slate-900 text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-xs"
          >
            <Settings className="w-4 h-4 text-slate-600" />
            <span className="hidden sm:inline">Admin Panel</span>
            {adminAlertCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-emerald-600 text-white text-[10px] flex items-center justify-center font-bold animate-pulse">
                {adminAlertCount}
              </span>
            )}
          </button>

          {/* Active 0dB status pill */}
          <div className="hidden xl:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_#10B981]" />
            <span className="text-emerald-800 font-mono text-[11px] font-bold">0.0 dB ACTIVE</span>
          </div>

          {/* Reserve / Plan Drawer Button */}
          <button
            id="header-reserve-btn"
            onClick={() => onOpenReservation(selectedModel)}
            className="relative group px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm tracking-wide shadow-md shadow-emerald-600/20 hover:shadow-emerald-500/30 transition-all duration-300 flex items-center gap-2 cursor-pointer"
          >
            <Zap className="w-4 h-4 text-white fill-white" />
            <span className="hidden sm:inline">Reserve Model</span>
            <span className="sm:hidden">Reserve</span>
            {cartCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-white text-emerald-700 text-xs flex items-center justify-center font-black">
                {cartCount}
              </span>
            )}
          </button>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 hover:text-slate-900"
            aria-label="Toggle Menu"
            id="mobile-menu-btn"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white/98 backdrop-blur-2xl px-6 py-6 space-y-4 animate-in fade-in duration-200 shadow-xl">
          <div className="grid grid-cols-2 gap-2 text-sm font-medium">
            <button 
              onClick={() => scrollToSection('models')} 
              className="p-3 text-left rounded-xl bg-slate-50 border border-slate-200 text-slate-800 hover:bg-emerald-50/60"
            >
              ⚡ Models Catalog
            </button>
            <button 
              onClick={() => scrollToSection('calculator')} 
              className="p-3 text-left rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800 font-semibold"
            >
              💰 Pay-Small-Small
            </button>
            <button 
              onClick={() => scrollToSection('sizer')} 
              className="p-3 text-left rounded-xl bg-slate-50 border border-slate-200 text-slate-800 hover:bg-emerald-50/60"
            >
              🎛️ Load Sizing Tool
            </button>
            <button 
              onClick={() => scrollToSection('comparison')} 
              className="p-3 text-left rounded-xl bg-slate-50 border border-slate-200 text-slate-800 hover:bg-emerald-50/60"
            >
              ⚖️ EverFlow vs Petrol
            </button>
            <button 
              onClick={() => scrollToSection('technology')} 
              className="p-3 text-left rounded-xl bg-slate-50 border border-slate-200 text-slate-800 hover:bg-emerald-50/60"
            >
              🔬 How It Works
            </button>
            <button 
              onClick={() => scrollToSection('deployments-map')} 
              className="p-3 text-left rounded-xl bg-slate-50 border border-slate-200 text-slate-800 hover:bg-emerald-50/60"
            >
              🗺️ Nigerian Deployments Map
            </button>
            <button 
              onClick={() => scrollToSection('faqs')} 
              className="p-3 text-left rounded-xl bg-slate-50 border border-slate-200 text-slate-800 hover:bg-emerald-50/60"
            >
              ❓ FAQs & Warranty
            </button>
          </div>

          {/* Mobile Font Style Selector */}
          <div className="pt-2 border-t border-slate-200">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <Type className="w-3.5 h-3.5 text-emerald-600" />
              <span>Typography Style</span>
            </div>
            <div className="grid grid-cols-3 gap-1.5">
              {FONT_OPTIONS.map((opt) => {
                const isSelected = fontStyle === opt.id;
                return (
                  <button
                    key={opt.id}
                    onClick={() => setFontStyle(opt.id)}
                    className={`py-2 px-2 rounded-xl text-center text-xs transition-all ${
                      isSelected
                        ? 'bg-emerald-600 text-white font-bold shadow-sm'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    <div className="truncate">{opt.fontName}</div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="pt-2 border-t border-slate-200 flex flex-col gap-2.5">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                openQuickChat(selectedModel);
              }}
              className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm cursor-pointer"
            >
              <MessageCircle className="w-4 h-4 text-white fill-white/20" />
              <span>Quick Chat (WhatsApp Support)</span>
            </button>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                setIsCustomerInquiryModalOpen(true);
              }}
              className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold flex items-center justify-center gap-2 border border-slate-200"
            >
              <MessageSquare className="w-4 h-4 text-emerald-600" />
              <span>Inquire & Speak With An Engineer</span>
            </button>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                setView('admin');
              }}
              className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center justify-center gap-2"
            >
              <Settings className="w-4 h-4 text-emerald-400" />
              <span>Open Business Admin Panel</span>
              {adminAlertCount > 0 && (
                <span className="px-1.5 py-0.5 rounded-full bg-emerald-600 text-[10px]">
                  {adminAlertCount}
                </span>
              )}
            </button>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenReservation(selectedModel);
              }}
              className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-center flex items-center justify-center gap-2 shadow-md shadow-emerald-600/20"
            >
              <Zap className="w-4 h-4 fill-current" />
              Configure & Lock Down Payment
            </button>
          </div>
        </div>
      )}

    </header>
  );
};
