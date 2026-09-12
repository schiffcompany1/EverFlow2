import React from 'react';
import { Zap, MessageCircle, Sparkles } from 'lucide-react';
import { ProductModel } from '../types';
import { useStore } from '../context/StoreContext';

interface MobileActionBarProps {
  onOpenReservation: () => void;
  selectedModel: ProductModel;
}

export const MobileActionBar: React.FC<MobileActionBarProps> = ({
  onOpenReservation,
  selectedModel
}) => {
  const { openQuickChat } = useStore();

  return (
    <div className="fixed bottom-0 inset-x-0 z-40 sm:hidden bg-slate-950/95 backdrop-blur-2xl border-t border-emerald-500/30 p-3 px-4 shadow-[0_-10px_30px_rgba(0,0,0,0.8)]">
      <div className="flex items-center gap-2.5">
        
        {/* Instant WhatsApp Quick Chat Action with templates */}
        <button
          id="mobile-bar-whatsapp-btn"
          onClick={() => openQuickChat(selectedModel)}
          className="flex-1 py-3 px-3 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 font-bold text-xs flex items-center justify-center gap-1.5 active:scale-95 transition-transform cursor-pointer"
        >
          <MessageCircle className="w-4 h-4 text-emerald-400 fill-emerald-400/20" />
          <span className="truncate">Quick Chat (WhatsApp)</span>
        </button>

        {/* Reserve Model Button */}
        <button
          id="mobile-bar-reserve-btn"
          onClick={onOpenReservation}
          className="flex-1 py-3 px-3 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 font-black text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-500/30 active:scale-95 transition-transform cursor-pointer"
        >
          <Zap className="w-4 h-4 fill-slate-950" />
          <span className="truncate">Reserve Model</span>
        </button>

      </div>
    </div>
  );
};
