import React, { useState, useEffect, useMemo } from 'react';
import { 
  MessageCircle, 
  X, 
  Send, 
  Copy, 
  Check, 
  ExternalLink, 
  Sparkles, 
  Zap, 
  ShieldCheck, 
  Clock, 
  ChevronRight,
  ChevronDown,
  Building2,
  Truck,
  HelpCircle,
  Percent,
  CheckCircle2,
  Layers
} from 'lucide-react';
import { ProductModel } from '../types';
import { useStore } from '../context/StoreContext';
import { formatNaira, QUICK_CHAT_TEMPLATES, QuickChatTemplate, buildWhatsAppDeepLink } from '../utils/formatters';

export const QuickChatWidget: React.FC = () => {
  const { 
    products, 
    currentProductView, 
    setCurrentProductView, 
    isQuickChatOpen, 
    setIsQuickChatOpen, 
    quickChatProduct 
  } = useStore();

  // Selected product in the chat: defaults to quickChatProduct or currentProductView
  const activeProduct: ProductModel = useMemo(() => {
    return quickChatProduct || currentProductView || products[0];
  }, [quickChatProduct, currentProductView, products]);

  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('paysmall');
  const [customMessage, setCustomMessage] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const [showProductDropdown, setShowProductDropdown] = useState<boolean>(false);

  // Update customMessage whenever activeProduct or selectedTemplateId changes
  useEffect(() => {
    if (!activeProduct) return;
    const template = QUICK_CHAT_TEMPLATES.find((t) => t.id === selectedTemplateId) || QUICK_CHAT_TEMPLATES[0];
    setCustomMessage(template.generateText(activeProduct));
  }, [activeProduct, selectedTemplateId]);

  const handleCopy = () => {
    navigator.clipboard.writeText(customMessage);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleOpenWhatsApp = () => {
    const link = buildWhatsAppDeepLink(customMessage);
    window.open(link, '_blank', 'noopener,noreferrer');
  };

  const appendSnippet = (snippet: string) => {
    setCustomMessage((prev) => `${prev.trim()}\n\n${snippet}`);
  };

  return (
    <>
      {/* Floating Trigger Capsule */}
      {!isQuickChatOpen && (
        <div className="fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-40 flex flex-col items-end gap-2 group">
          
          {/* Context Banner Pill: indicates the currently viewed product */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/90 text-white text-xs backdrop-blur-md shadow-lg border border-slate-700/80 transition-all transform translate-y-1 group-hover:translate-y-0 opacity-90 group-hover:opacity-100">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-slate-300">Sales Online:</span>
            <span className="font-semibold text-emerald-300 truncate max-w-[140px]">
              {activeProduct?.name || 'EverFlow Desk'}
            </span>
          </div>

          {/* Main Quick Chat Button */}
          <button
            id="quick-chat-floating-btn"
            onClick={() => setIsQuickChatOpen(true)}
            className="relative px-4 py-3 sm:py-3.5 sm:px-5 rounded-2xl bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white shadow-xl shadow-emerald-700/30 hover:shadow-emerald-600/50 border border-emerald-400/40 flex items-center gap-3 transition-all duration-300 transform active:scale-95 cursor-pointer"
            title={`Quick Chat via WhatsApp regarding ${activeProduct?.name}`}
          >
            {/* Pulsing beacon glow */}
            <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75" />
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-400" />
            </span>

            <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
              <MessageCircle className="w-5 h-5 text-white fill-white/20" />
            </div>

            <div className="text-left leading-tight">
              <div className="flex items-center gap-1.5">
                <span className="text-xs sm:text-sm font-black tracking-wide font-heading">Quick Chat</span>
                <span className="hidden sm:inline-block px-1.5 py-0.5 rounded bg-emerald-950/60 text-emerald-200 text-[9px] font-mono font-bold">
                  2m reply
                </span>
              </div>
              <div className="text-[10px] sm:text-[11px] text-emerald-100 font-medium">
                WhatsApp Sales Support
              </div>
            </div>
          </button>
        </div>
      )}

      {/* Quick Chat Interactive Modal / Drawer Popover */}
      {isQuickChatOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
          
          {/* Backdrop Click */}
          <div 
            className="absolute inset-0"
            onClick={() => setIsQuickChatOpen(false)} 
          />

          <div 
            id="quick-chat-modal"
            className="relative w-full max-w-xl max-h-[92vh] sm:max-h-[85vh] bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden text-left z-10"
          >
            
            {/* Header */}
            <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 text-white flex items-center justify-between border-b border-slate-700/50">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center">
                    <MessageCircle className="w-5 h-5 text-emerald-400 fill-emerald-400/20" />
                  </div>
                  <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 border-2 border-slate-900 animate-pulse" />
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold font-heading text-white">
                      EverFlow Quick Sales Chat
                    </h3>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-mono font-bold">
                      WhatsApp Live
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 flex items-center gap-2 mt-0.5">
                    <Clock className="w-3 h-3 text-emerald-400" />
                    <span>Real-time technical desk • Typically replies in 2 mins</span>
                  </p>
                </div>
              </div>

              <button
                id="quick-chat-close-btn"
                onClick={() => setIsQuickChatOpen(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Scrollable Body */}
            <div className="p-4 sm:p-5 overflow-y-auto space-y-4 text-xs sm:text-sm text-slate-700">
              
              {/* Product View Context Pill & Switcher */}
              <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200 flex flex-col gap-2 relative">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold text-emerald-800 tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-3 h-3 text-emerald-600" />
                    Currently Inquiring About:
                  </span>
                  
                  {/* Model Switcher Trigger */}
                  <div className="relative">
                    <button
                      onClick={() => setShowProductDropdown(!showProductDropdown)}
                      className="text-[11px] font-bold text-emerald-800 hover:text-emerald-950 flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-emerald-100/70 transition-colors cursor-pointer"
                    >
                      <span>Switch Model</span>
                      <ChevronDown className="w-3 h-3" />
                    </button>

                    {showProductDropdown && (
                      <div className="absolute right-0 top-full mt-1 w-64 bg-white rounded-xl shadow-xl border border-slate-200 p-1.5 z-30 space-y-1">
                        <div className="text-[10px] text-slate-600 uppercase font-bold px-2 py-1">
                          Select Generator Model:
                        </div>
                        {products.map((p) => (
                          <button
                            key={p.id}
                            onClick={() => {
                              setCurrentProductView(p);
                              setShowProductDropdown(false);
                            }}
                            className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-between transition-colors ${
                              p.id === activeProduct.id
                                ? 'bg-emerald-600 text-white'
                                : 'text-slate-800 hover:bg-slate-100'
                            }`}
                          >
                            <span className="truncate">{p.name}</span>
                            <span className="font-mono text-[10px] opacity-80">{p.kva}kVA</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-xl overflow-hidden bg-slate-100 border border-emerald-200 shrink-0">
                    <img
                      src={activeProduct.image}
                      alt={activeProduct.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-slate-900 text-sm sm:text-base font-heading truncate">
                        {activeProduct.name}
                      </h4>
                      <span className="px-1.5 py-0.5 rounded bg-emerald-200/80 text-emerald-900 font-mono text-[10px] font-bold">
                        {activeProduct.kva} kVA
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-slate-600 mt-0.5 font-mono">
                      <span>Outright: <strong className="text-slate-900">{formatNaira(activeProduct.outrightPrice)}</strong></span>
                      <span>•</span>
                      <span>From <strong className="text-emerald-700">{formatNaira(activeProduct.monthlyFrom)}/mo</strong></span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Template Selector Section */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Select Inquiry Template:</span>
                  </label>
                  <span className="text-[11px] text-slate-500 font-medium">Click to populate</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {QUICK_CHAT_TEMPLATES.map((tmpl) => {
                    const isSelected = tmpl.id === selectedTemplateId;
                    return (
                      <button
                        key={tmpl.id}
                        id={`chat-template-${tmpl.id}`}
                        onClick={() => setSelectedTemplateId(tmpl.id)}
                        className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-emerald-50 border-emerald-500 ring-1 ring-emerald-500 shadow-xs'
                            : 'bg-slate-50 hover:bg-slate-100 border-slate-200'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-1 mb-1">
                          <span className={`text-xs font-bold truncate ${isSelected ? 'text-emerald-900' : 'text-slate-800'}`}>
                            {tmpl.label}
                          </span>
                          <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded font-bold ${
                            isSelected ? 'bg-emerald-200 text-emerald-900' : 'bg-slate-200 text-slate-600'
                          }`}>
                            {tmpl.badge}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 line-clamp-1 leading-snug">
                          {tmpl.description}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Quick Append Snippet Buttons */}
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-[10px] text-slate-500 font-bold uppercase">Quick Add:</span>
                <button
                  type="button"
                  onClick={() => appendSnippet('📍 My Location: Lekki Phase 1, Lagos.')}
                  className="px-2 py-0.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] transition-colors cursor-pointer"
                >
                  + Lekki, Lagos
                </button>
                <button
                  type="button"
                  onClick={() => appendSnippet('📍 My Location: Maitama / Wuse, Abuja.')}
                  className="px-2 py-0.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] transition-colors cursor-pointer"
                >
                  + Abuja
                </button>
                <button
                  type="button"
                  onClick={() => appendSnippet('⚡ Appliances: 3 Inverter ACs, 1 Deep Freezer, 1 Water Pump.')}
                  className="px-2 py-0.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] transition-colors cursor-pointer"
                >
                  + 3 ACs & Pump Load
                </button>
              </div>

              {/* Message Editor Preview */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <label htmlFor="quick-chat-message-textarea" className="font-bold text-slate-700 uppercase tracking-wider">
                    WhatsApp Message Preview:
                  </label>
                  <span className="text-slate-600 text-[11px] font-mono">
                    Ready to send to +234 812 345 6789
                  </span>
                </div>

                <div className="relative">
                  <textarea
                    id="quick-chat-message-textarea"
                    rows={6}
                    value={customMessage}
                    onChange={(e) => setCustomMessage(e.target.value)}
                    className="w-full p-3 text-xs sm:text-sm font-mono bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:bg-white text-slate-800 leading-relaxed outline-none transition-all resize-none shadow-inner"
                    placeholder="Type or customize your inquiry here..."
                  />
                  
                  <button
                    onClick={handleCopy}
                    className="absolute bottom-2.5 right-2.5 px-2.5 py-1 rounded-lg bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 text-[11px] font-semibold flex items-center gap-1 shadow-xs transition-colors cursor-pointer"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-700">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-slate-500" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Security & Reliability Notes */}
              <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600">
                <div className="flex items-center gap-1.5 p-2 rounded-lg bg-slate-50 border border-slate-200/80">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Verified EverFlow Engineering Support</span>
                </div>
                <div className="flex items-center gap-1.5 p-2 rounded-lg bg-slate-50 border border-slate-200/80">
                  <Clock className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Immediate human response</span>
                </div>
              </div>

            </div>

            {/* Footer Actions */}
            <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center gap-3">
              <button
                id="quick-chat-submit-whatsapp-btn"
                onClick={handleOpenWhatsApp}
                className="w-full sm:flex-1 py-3 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm tracking-wide shadow-lg shadow-emerald-600/30 hover:shadow-emerald-500/40 flex items-center justify-center gap-2 transition-all cursor-pointer transform active:scale-98"
              >
                <MessageCircle className="w-5 h-5 text-white fill-white/20" />
                <span>Open WhatsApp Quick Chat</span>
                <ExternalLink className="w-4 h-4 text-emerald-200" />
              </button>

              <button
                onClick={() => setIsQuickChatOpen(false)}
                className="w-full sm:w-auto py-3 px-4 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
              >
                Continue Browsing
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
};
