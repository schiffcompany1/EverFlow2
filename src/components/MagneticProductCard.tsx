import React, { useState, useRef, useCallback } from 'react';
import { 
  VolumeX, 
  Sparkles, 
  Check, 
  ChevronRight, 
  MessageCircle,
  Zap
} from 'lucide-react';
import { ProductModel } from '../types';
import { formatNaira } from '../utils/formatters';
import { ProductDeliveryEstimator } from './ProductDeliveryEstimator';

interface MagneticProductCardProps {
  model: ProductModel;
  onSelectModel: (model: ProductModel, mode: 'outright' | 'paysmall') => void;
  onOpenCalculatorWithModel: (model: ProductModel) => void;
  setCurrentProductView: (model: ProductModel) => void;
  openQuickChat: (model: ProductModel) => void;
}

export const MagneticProductCard: React.FC<MagneticProductCardProps> = ({
  model,
  onSelectModel,
  onOpenCalculatorWithModel,
  setCurrentProductView,
  openQuickChat,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  
  // Magnetic offset values
  const [offset, setOffset] = useState({ x: 0, y: 0, rawX: 0, rawY: 0 });
  const [isHovered, setIsHovered] = useState(false);

  // Smooth mouse movement tracking
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    
    // Normalized position relative to center: range -1 to 1
    const halfW = rect.width / 2;
    const halfH = rect.height / 2;
    const normX = (e.clientX - (rect.left + halfW)) / halfW;
    const normY = (e.clientY - (rect.top + halfH)) / halfH;
    
    setOffset({
      x: Math.max(-1, Math.min(1, normX)),
      y: Math.max(-1, Math.min(1, normY)),
      rawX: e.clientX - rect.left,
      rawY: e.clientY - rect.top,
    });
  }, []);

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    setOffset({ x: 0, y: 0, rawX: 0, rawY: 0 });
  }, []);

  // Subtle magnetic translations:
  // Card tilts slightly (up to 2.5 degrees)
  const tiltRotateX = isHovered ? -offset.y * 2.5 : 0;
  const tiltRotateY = isHovered ? offset.x * 2.5 : 0;

  // Content body magnetically shifts toward the cursor (subtle 8px shift)
  const contentShiftX = isHovered ? offset.x * 8 : 0;
  const contentShiftY = isHovered ? offset.y * 8 : 0;

  // Image layer parallax shift (subtle 5px shift)
  const imageShiftX = isHovered ? offset.x * 5 : 0;
  const imageShiftY = isHovered ? offset.y * 5 : 0;

  return (
    <div
      ref={cardRef}
      id={`product-card-${model.id}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        perspective: '1200px',
        transformStyle: 'preserve-3d',
      }}
      className="group relative rounded-3xl bg-white border border-slate-200 hover:border-emerald-300 p-6 sm:p-8 flex flex-col justify-between shadow-lg shadow-slate-200/50 hover:shadow-2xl hover:shadow-emerald-500/15 transition-shadow duration-500 overflow-hidden"
    >
      {/* Specular ambient sheen that follows cursor position */}
      {isHovered && (
        <div
          className="pointer-events-none absolute inset-0 z-10 transition-opacity duration-300 opacity-100 rounded-3xl"
          style={{
            background: `radial-gradient(500px circle at ${offset.rawX}px ${offset.rawY}px, rgba(16, 185, 129, 0.08), transparent 75%)`,
          }}
        />
      )}

      {/* Outer Card Tilt & Inner Content Magnetic Follow Wrapper */}
      <div
        style={{
          transform: `perspective(1000px) rotateX(${tiltRotateX}deg) rotateY(${tiltRotateY}deg) translate3d(${contentShiftX}px, ${contentShiftY}px, 0px)`,
          transition: isHovered 
            ? 'transform 0.12s cubic-bezier(0.2, 0, 0.2, 1)' 
            : 'transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1)',
          transformStyle: 'preserve-3d',
        }}
        className="flex flex-col justify-between h-full relative z-20"
      >
        {/* Top Meta & Specs Section */}
        <div>
          {/* Top Meta Header */}
          <div className="flex items-center justify-between gap-2 mb-4">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 font-mono text-xs font-bold flex items-center gap-1">
                <Zap className="w-3 h-3 text-emerald-600" />
                <span>{model.kva} kVA</span>
              </span>
              {model.badge && (
                <span className="px-3 py-1 rounded-full bg-emerald-100/80 border border-emerald-300 text-emerald-900 text-xs font-semibold">
                  {model.badge}
                </span>
              )}
            </div>
            
            <div className="flex items-center gap-1 text-slate-600 text-xs font-medium">
              <VolumeX className="w-4 h-4 text-emerald-600" />
              <span>0 dB Silent</span>
            </div>
          </div>

          {/* Model Title & Tagline */}
          <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 font-heading tracking-tight group-hover:text-emerald-700 transition-colors text-left">
            {model.name}
          </h3>
          <p className="text-sm text-slate-600 mt-1 mb-6 text-left">
            {model.tagline}
          </p>

          {/* Product 3D Glass Render Showcase with Magnetic Parallax */}
          <div 
            className="relative aspect-[16/9] rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 mb-6 flex items-center justify-center p-2"
          >
            <img
              src={model.image}
              alt={model.name}
              style={{
                transform: `translate3d(${imageShiftX}px, ${imageShiftY}px, 0px) scale(${isHovered ? 1.05 : 1})`,
                transition: isHovered 
                  ? 'transform 0.15s cubic-bezier(0.2, 0, 0.2, 1)' 
                  : 'transform 0.6s cubic-bezier(0.2, 0.8, 0.2, 1)',
              }}
              className="w-full h-full object-cover rounded-xl will-change-transform"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent pointer-events-none" />
            
            {/* Highlight pill: Pay-Small-Small badge */}
            <div 
              style={{
                transform: `translate3d(${contentShiftX * 0.5}px, ${contentShiftY * 0.5}px, 0px)`,
                transition: isHovered ? 'transform 0.15s ease-out' : 'transform 0.5s ease-out',
              }}
              className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl border border-emerald-200 shadow-md text-left"
            >
              <div className="text-[10px] uppercase font-bold text-emerald-800">Pay-Small-Small Option:</div>
              <div className="text-slate-900 text-xs font-mono font-bold">From {formatNaira(model.monthlyFrom)} / mo</div>
            </div>

            <div 
              style={{
                transform: `translate3d(${contentShiftX * 0.5}px, ${contentShiftY * 0.5}px, 0px)`,
                transition: isHovered ? 'transform 0.15s ease-out' : 'transform 0.5s ease-out',
              }}
              className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-lg border border-slate-200 text-slate-700 text-[11px] font-mono"
            >
              {model.warrantyYears}-Year Warranty
            </div>
          </div>

          {/* Spec Pills Bar */}
          <div className="grid grid-cols-2 gap-2 mb-6 text-left">
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
              <div className="text-[10px] text-slate-500 uppercase font-mono">Continuous Power</div>
              <div className="text-sm font-bold text-slate-900 font-mono">{(model.continuousWatts / 1000).toFixed(1)} kW</div>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
              <div className="text-[10px] text-slate-500 uppercase font-mono">Surge Peak Load</div>
              <div className="text-sm font-bold text-emerald-700 font-mono">{(model.surgeWatts / 1000).toFixed(1)} kW</div>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
              <div className="text-[10px] text-slate-500 uppercase font-mono">Sound Level</div>
              <div className="text-sm font-bold text-emerald-700 font-mono">0 dB (Silent)</div>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
              <div className="text-[10px] text-slate-500 uppercase font-mono">Transfer Switch</div>
              <div className="text-sm font-bold text-slate-900 font-mono">&lt; 8ms Seamless ATS</div>
            </div>
          </div>

          {/* Recommended Loads Checklist */}
          <div className="space-y-1.5 mb-6 text-left">
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Recommended Capability:
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
              {model.recommendedFor.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2 text-xs text-slate-700">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span className="truncate">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Dynamic Delivery Date Estimator Based On Current Demand Levels */}
          <div className="mb-6">
            <ProductDeliveryEstimator model={model} />
          </div>
        </div>

        {/* Pricing & Dual Action Buttons */}
        <div className="pt-4 border-t border-slate-200 space-y-4">
          <div className="flex items-baseline justify-between text-left">
            <div>
              <span className="text-[11px] text-slate-500 uppercase font-bold tracking-wider">Outright Price:</span>
              <div className="text-2xl sm:text-3xl font-black text-slate-900 font-heading">
                {formatNaira(model.outrightPrice)}
              </div>
            </div>

            <div className="text-right">
              <span className="text-[11px] text-emerald-700 uppercase font-bold tracking-wider">Installment From:</span>
              <div className="text-lg font-bold text-emerald-700 font-mono">
                {formatNaira(model.monthlyFrom)}<span className="text-xs text-slate-500">/mo</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              id={`btn-paysmall-${model.id}`}
              onClick={() => {
                setCurrentProductView(model);
                onOpenCalculatorWithModel(model);
                const el = document.getElementById('calculator');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-1.5 cursor-pointer hover:scale-[1.02] active:scale-98"
            >
              <Sparkles className="w-4 h-4 text-white" />
              <span>Start Pay-Small-Small</span>
            </button>

            <button
              id={`btn-outright-${model.id}`}
              onClick={() => {
                setCurrentProductView(model);
                onSelectModel(model, 'outright');
              }}
              className="py-3 px-4 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-800 font-bold text-xs uppercase tracking-wider border border-slate-300 hover:border-emerald-500 transition-all flex items-center justify-center gap-1.5 cursor-pointer hover:scale-[1.02] active:scale-98"
            >
              <span>Buy Outright</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Direct WhatsApp Quick Chat for this specific machine */}
          <button
            id={`btn-quickchat-${model.id}`}
            onClick={() => {
              setCurrentProductView(model);
              openQuickChat(model);
            }}
            className="w-full py-2.5 px-4 rounded-xl bg-emerald-50 hover:bg-emerald-100/90 text-emerald-800 hover:text-emerald-950 border border-emerald-300/80 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer group/chat"
          >
            <MessageCircle className="w-4 h-4 text-emerald-600 group-hover/chat:scale-110 transition-transform" />
            <span>Quick Chat about {model.name} (WhatsApp)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
