import React, { useState } from 'react';
import { 
  Truck, 
  Clock, 
  MapPin, 
  Flame, 
  ShieldCheck, 
  Zap, 
  CheckCircle2, 
  Info, 
  ChevronDown, 
  CalendarDays,
  AlertTriangle,
  PackageCheck
} from 'lucide-react';
import { ProductModel } from '../types';
import { 
  calculateDeliveryEstimate, 
  DELIVERY_REGIONS, 
  DeliveryEstimateResult 
} from '../utils/deliveryEstimator';
import { useStore } from '../context/StoreContext';

interface ProductDeliveryEstimatorProps {
  model: ProductModel;
  compact?: boolean;
}

export const ProductDeliveryEstimator: React.FC<ProductDeliveryEstimatorProps> = ({ 
  model, 
  compact = false 
}) => {
  const { selectedDeliveryRegion, setSelectedDeliveryRegion } = useStore();
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showRegionDropdown, setShowRegionDropdown] = useState(false);

  const estimate: DeliveryEstimateResult = calculateDeliveryEstimate(
    model, 
    selectedDeliveryRegion
  );

  return (
    <>
      <div 
        id={`delivery-estimator-${model.id}`}
        className="rounded-2xl bg-gradient-to-br from-slate-50 to-emerald-50/40 border border-slate-200/90 hover:border-emerald-300 p-3.5 sm:p-4 text-left space-y-3 transition-all duration-200 shadow-xs"
      >
        {/* Demand Level & Real-time Scarcity Bar */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5">
              {estimate.demandTier === 'extreme_surge' ? (
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500" />
                </span>
              ) : (
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500" />
                </span>
              )}

              <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${estimate.demandBadgeBg} flex items-center gap-1`}>
                {estimate.demandTier === 'extreme_surge' && <Flame className="w-3 h-3 text-rose-600 fill-rose-600/20" />}
                {estimate.demandTier === 'high_demand' && <Zap className="w-3 h-3 text-amber-600 fill-amber-600/20" />}
                {estimate.demandTier === 'moderate' && <CheckCircle2 className="w-3 h-3 text-emerald-600" />}
                <span>{estimate.demandBadge}</span>
              </span>
            </div>

            {/* Quick Destination Switcher */}
            <div className="relative">
              <button
                type="button"
                id={`region-switcher-btn-${model.id}`}
                onClick={() => setShowRegionDropdown(!showRegionDropdown)}
                className="text-[11px] font-bold text-slate-700 hover:text-emerald-700 flex items-center gap-1 px-2 py-0.5 rounded-lg bg-white border border-slate-200/80 hover:border-emerald-300 transition-colors cursor-pointer shadow-2xs"
                title="Change delivery destination"
              >
                <MapPin className="w-3 h-3 text-emerald-600" />
                <span className="truncate max-w-[85px]">{estimate.region.shortName}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {showRegionDropdown && (
                <div className="absolute right-0 top-full mt-1.5 w-60 bg-white rounded-xl shadow-xl border border-slate-200 p-1.5 z-30 text-xs space-y-1 animate-in fade-in zoom-in-95">
                  <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-600 border-b border-slate-100">
                    Select Delivery Destination:
                  </div>
                  {DELIVERY_REGIONS.map((reg) => (
                    <button
                      key={reg.id}
                      onClick={() => {
                        setSelectedDeliveryRegion(reg.id);
                        setShowRegionDropdown(false);
                      }}
                      className={`w-full text-left px-2.5 py-1.5 rounded-lg font-medium flex items-center justify-between transition-colors ${
                        selectedDeliveryRegion === reg.id
                          ? 'bg-emerald-600 text-white font-bold'
                          : 'text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <span className="truncate">{reg.shortName}</span>
                      <span className="text-[10px] opacity-75 font-mono">
                        {reg.transitOffsetDays === 0 ? 'Same/Next Day' : `+${reg.transitOffsetDays}d transit`}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Allocation Demand Progress Bar */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-[10px] text-slate-500">
              <span className="truncate font-medium">{estimate.demandDescription}</span>
              <span className="font-mono font-bold text-slate-700 shrink-0">{estimate.batchCapacityPercent}% Allocated</span>
            </div>
            <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all duration-500 ${
                  estimate.demandTier === 'extreme_surge'
                    ? 'bg-rose-500'
                    : estimate.demandTier === 'high_demand'
                    ? 'bg-amber-500'
                    : 'bg-emerald-500'
                }`}
                style={{ width: `${estimate.batchCapacityPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Dynamic Delivery Date & Time Window */}
        <div className="p-2.5 sm:p-3 rounded-xl bg-white border border-emerald-100/90 space-y-2 shadow-2xs">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-start gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-100/80 border border-emerald-200 flex items-center justify-center text-emerald-800 shrink-0 mt-0.5">
                <Truck className="w-4 h-4" />
              </div>

              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-slate-700">
                    Estimated Delivery Arrival:
                  </span>
                  {estimate.isSameDayPossible && (
                    <span className="px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 text-[9px] font-bold">
                      Express
                    </span>
                  )}
                </div>

                {/* The Calculated Calendar Date Range */}
                <div className="text-sm sm:text-base font-bold text-slate-900 font-heading flex items-center gap-1.5">
                  <CalendarDays className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="text-emerald-950 font-black">{estimate.estimatedRangeFormatted}</span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowDetailsModal(true)}
              className="text-[10px] text-emerald-700 hover:text-emerald-900 font-bold underline flex items-center gap-0.5 shrink-0 mt-1 cursor-pointer"
            >
              <span>Details</span>
              <Info className="w-3 h-3" />
            </button>
          </div>

          {/* Cutoff Countdown & Hub Dispatch Line */}
          <div className="flex flex-wrap items-center justify-between gap-x-2 gap-y-1 pt-1.5 border-t border-slate-100 text-[11px] text-slate-600">
            <div className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>
                Order within <strong className="text-slate-900 font-mono font-bold">{estimate.cutoffCountdown.text}</strong> for earliest dispatch
              </span>
            </div>

            <div className="text-[10px] text-slate-600 font-medium">
              Via <span className="font-semibold text-slate-700">{estimate.hubName}</span>
            </div>
          </div>
        </div>

        {/* ATS Quality & Engineer Handover Badge */}
        <div className="flex items-center justify-between text-[11px] text-slate-600 font-medium px-0.5">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>Pre-delivery ATS bench test & zero-dB acoustic check included</span>
          </div>

          <span className="text-[10px] font-bold text-emerald-700 uppercase">
            {estimate.region.freeDeliveryEligible ? 'Free Transit' : 'Standard Freight'}
          </span>
        </div>
      </div>

      {/* Logistics & Delivery Breakdown Modal */}
      {showDetailsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div 
            className="absolute inset-0" 
            onClick={() => setShowDetailsModal(false)} 
          />

          <div 
            id={`delivery-details-modal-${model.id}`}
            className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 p-6 sm:p-7 text-left space-y-5 z-10 max-h-[90vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700">
                  <PackageCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-slate-900 font-heading">
                    EverFlow White-Glove Delivery
                  </h4>
                  <p className="text-xs text-slate-500">
                    {model.name} • {estimate.region.name}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowDetailsModal(false)}
                className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Live Demand Status Overview */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase font-bold text-slate-500">Current Factory Queue</span>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-md ${estimate.demandBadgeBg}`}>
                  {estimate.demandBadge}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-2.5 rounded-xl bg-white border border-slate-200">
                  <span className="text-[10px] text-slate-500 block uppercase">Estimated Arrival</span>
                  <span className="text-sm font-bold text-emerald-900 font-heading">
                    {estimate.estimatedRangeFormatted}
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-white border border-slate-200">
                  <span className="text-[10px] text-slate-500 block uppercase">Fulfillment Hub</span>
                  <span className="text-xs font-bold text-slate-800 truncate block">
                    {estimate.hubName}
                  </span>
                </div>
              </div>

              <div className="text-xs text-slate-600 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-emerald-600" />
                <span>
                  Order within <strong className="text-slate-900">{estimate.cutoffCountdown.text}</strong> to lock your position in this dispatch batch.
                </span>
              </div>
            </div>

            {/* 3-Step Logistics Protocol */}
            <div className="space-y-3">
              <h5 className="text-xs uppercase font-bold text-slate-700 tracking-wider">
                3-Step Certified Delivery Protocol:
              </h5>

              <div className="space-y-2.5">
                <div className="flex items-start gap-3 p-3 rounded-xl bg-white border border-slate-200">
                  <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                    1
                  </div>
                  <div>
                    <h6 className="text-xs font-bold text-slate-900">Acoustic & ATS Bench Testing (Day 1)</h6>
                    <p className="text-[11px] text-slate-600 mt-0.5">
                      Every EverFlow unit undergoes continuous 100% full-load resonance calibration and automated transfer switch (ATS) reaction time bench-testing before leaving our hub.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-xl bg-white border border-slate-200">
                  <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                    2
                  </div>
                  <div>
                    <h6 className="text-xs font-bold text-slate-900">Shock-Absorbent Pallet Transit</h6>
                    <p className="text-[11px] text-slate-600 mt-0.5">
                      Transported via cushioned, climate-secure transit vehicles to ensure solid-state components arrive in pristine, factory-sealed condition.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-xl bg-white border border-slate-200">
                  <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                    3
                  </div>
                  <div>
                    <h6 className="text-xs font-bold text-slate-900">Engineer On-Site Handover & Decibel Verification</h6>
                    <p className="text-[11px] text-slate-600 mt-0.5">
                      Our certified electrical engineers assist with uncrating, ATS breaker interconnection, and verify 0.0 dB sound level on-site at your home or premises.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Close / Got it button */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => setShowDetailsModal(false)}
                className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider transition-all cursor-pointer shadow-md"
              >
                Close Delivery Specifications
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
