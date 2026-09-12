import React, { useState, useMemo } from 'react';
import { 
  Zap, 
  Wind, 
  Snowflake, 
  Droplets, 
  Tv, 
  Lightbulb, 
  Laptop, 
  Flame, 
  Shirt, 
  Plus, 
  Minus, 
  RotateCcw, 
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Sliders,
  Sparkles,
  Activity,
  Gauge
} from 'lucide-react';
import { APPLIANCE_LIST } from '../data/products';
import { ProductModel } from '../types';
import { formatNaira } from '../utils/formatters';
import { useStore } from '../context/StoreContext';

interface EnergySizerProps {
  onSelectRecommendedModel: (model: ProductModel) => void;
}

export const EnergySizer: React.FC<EnergySizerProps> = ({ onSelectRecommendedModel }) => {
  const { products } = useStore();
  // Map of applianceId -> quantity
  const [quantities, setQuantities] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {};
    APPLIANCE_LIST.forEach((app) => {
      initial[app.id] = app.defaultQty;
    });
    return initial;
  });

  const [activeChangedId, setActiveChangedId] = useState<string | null>(null);

  const updateQuantity = (id: string, delta: number) => {
    setActiveChangedId(id);
    setQuantities((prev) => {
      const current = prev[id] || 0;
      const next = Math.max(0, current + delta);
      return { ...prev, [id]: next };
    });
    setTimeout(() => {
      setActiveChangedId(null);
    }, 400);
  };

  const applyPreset = (presetType: 'flat' | 'duplex' | 'office' | 'zero') => {
    const updated: Record<string, number> = {};
    APPLIANCE_LIST.forEach((app) => {
      updated[app.id] = 0;
    });

    if (presetType === 'flat') {
      updated['inverter-ac-1'] = 1;
      updated['fridge'] = 1;
      updated['home-lighting'] = 1;
      updated['tv-sound'] = 1;
      updated['workstation'] = 1;
    } else if (presetType === 'duplex') {
      updated['inverter-ac-1'] = 2;
      updated['inverter-ac-2'] = 1;
      updated['fridge'] = 1;
      updated['deep-freezer'] = 1;
      updated['water-pump'] = 1;
      updated['home-lighting'] = 1;
      updated['tv-sound'] = 1;
      updated['workstation'] = 1;
      updated['microwave'] = 1;
    } else if (presetType === 'office') {
      updated['inverter-ac-1'] = 3;
      updated['inverter-ac-2'] = 2;
      updated['fridge'] = 1;
      updated['workstation'] = 2;
      updated['home-lighting'] = 2;
      updated['water-pump'] = 1;
    }

    setQuantities(updated);
  };

  const resetQuantities = () => {
    applyPreset('zero');
  };

  // Calculations
  const { totalRunningWatts, totalSurgeWatts, recommendedModel } = useMemo(() => {
    let running = 0;
    let surge = 0;

    APPLIANCE_LIST.forEach((app) => {
      const count = quantities[app.id] || 0;
      running += app.runningWatts * count;
      surge += app.surgeWatts * count;
    });

    // Add 25% safety margin standard in power engineering
    const requiredContinuousWatts = running * 1.25;

    // Pick best model
    let match = products[0] || {
      id: 'custom',
      name: 'EverFlow Custom Commercial Setup',
      tagline: 'High load configuration',
      kva: Math.round(requiredContinuousWatts / 800),
      continuousWatts: requiredContinuousWatts,
      surgeWatts: surge,
      outrightPrice: 10000000,
      monthlyFrom: 500000,
      category: 'commercial',
      dimensions: 'Custom',
      weightKg: 100,
      soundDba: 0,
      voltage: '400V 3-Phase',
      frequency: '50.0 Hz',
      warrantyYears: 3,
      recommendedFor: ['Heavy Load Facility'],
      image: '/src/assets/images/everflow_generator_1788498968530.jpg'
    };

    for (const m of products) {
      if (m.continuousWatts >= requiredContinuousWatts) {
        match = m;
        break;
      }
      match = m; // fallback to largest if exceeded
    }

    return {
      totalRunningWatts: running,
      totalSurgeWatts: surge,
      recommendedModel: match
    };
  }, [quantities, products]);

  // Telemetry metrics
  const utilizationPct = recommendedModel.continuousWatts > 0 
    ? Math.min(100, Math.round((totalRunningWatts / recommendedModel.continuousWatts) * 100))
    : 0;

  const surgeTolerancePct = recommendedModel.surgeWatts > 0
    ? Math.min(100, Math.round((totalSurgeWatts / recommendedModel.surgeWatts) * 100))
    : 0;

  const renderIcon = (name: string) => {
    switch (name) {
      case 'Wind':
        return <Wind className="w-5 h-5 text-emerald-600" />;
      case 'Snowflake':
      case 'Refrigerator':
        return <Snowflake className="w-5 h-5 text-emerald-600" />;
      case 'Droplets':
        return <Droplets className="w-5 h-5 text-emerald-600" />;
      case 'Tv':
        return <Tv className="w-5 h-5 text-emerald-600" />;
      case 'Lightbulb':
        return <Lightbulb className="w-5 h-5 text-amber-500" />;
      case 'Laptop':
        return <Laptop className="w-5 h-5 text-emerald-600" />;
      case 'Flame':
        return <Flame className="w-5 h-5 text-orange-500" />;
      case 'Shirt':
        return <Shirt className="w-5 h-5 text-emerald-600" />;
      default:
        return <Zap className="w-5 h-5 text-emerald-600" />;
    }
  };

  return (
    <section id="sizer" className="py-20 border-b border-emerald-100 relative bg-white">
      {/* Ambient background glow */}
      <div className="absolute top-1/2 left-10 w-96 h-96 bg-emerald-500/5 rounded-full blur-[140px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold uppercase tracking-wider">
            <Zap className="w-3.5 h-3.5 text-emerald-600" />
            <span>Interactive Load Profiler</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 font-heading tracking-tight">
            Calculate Your Exact kVA Requirements
          </h2>

          <p className="text-base sm:text-lg text-slate-600">
            Tap or adjust the appliances you plan to run simultaneously. Watch live progress telemetry 
            dynamically size your optimal EverFlow clean generator with zero guesswork.
          </p>
        </div>

        {/* Quick Load Presets Bar */}
        <div className="flex items-center justify-between flex-wrap gap-3 mb-8 p-3 rounded-2xl bg-slate-50 border border-slate-200">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-wider">
            <Sliders className="w-4 h-4 text-emerald-600" />
            <span>Quick Presets:</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => applyPreset('flat')}
              className="px-3 py-1.5 rounded-xl bg-white hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 border border-slate-200 hover:border-emerald-300 text-xs font-semibold transition-all cursor-pointer shadow-xs active:scale-95"
            >
              🏡 2–3 Bed Flat
            </button>
            <button
              onClick={() => applyPreset('duplex')}
              className="px-3 py-1.5 rounded-xl bg-white hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 border border-slate-200 hover:border-emerald-300 text-xs font-semibold transition-all cursor-pointer shadow-xs active:scale-95"
            >
              🏰 Executive Duplex
            </button>
            <button
              onClick={() => applyPreset('office')}
              className="px-3 py-1.5 rounded-xl bg-white hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 border border-slate-200 hover:border-emerald-300 text-xs font-semibold transition-all cursor-pointer shadow-xs active:scale-95"
            >
              🏢 Tech Office / Clinic
            </button>
            <button
              onClick={resetQuantities}
              className="px-2.5 py-1.5 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-200/60 text-xs flex items-center gap-1 transition-all cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          </div>
        </div>

        {/* Two-Column Interactive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Appliance Tapper Grid */}
          <div className="lg:col-span-8 space-y-6 text-left">
            
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Select Your Active Household / Office Appliances:
              </span>
              <span className="text-xs text-slate-500 font-mono">
                {(Object.values(quantities) as number[]).reduce((a, b) => a + b, 0)} appliances running
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {APPLIANCE_LIST.map((app) => {
                const count = quantities[app.id] || 0;
                const isActive = count > 0;
                const isJustChanged = activeChangedId === app.id;
                const itemRunning = app.runningWatts * count;
                // Contribution percentage to total running load
                const loadContributionPct = totalRunningWatts > 0 ? (itemRunning / totalRunningWatts) * 100 : 0;

                return (
                  <div
                    key={app.id}
                    className={`p-4 rounded-2xl border transition-all duration-300 relative overflow-hidden flex flex-col justify-between ${
                      isActive
                        ? 'bg-emerald-50/70 border-emerald-400 shadow-sm ring-1 ring-emerald-500/20'
                        : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                    } ${isJustChanged ? 'scale-[1.02] ring-2 ring-emerald-500 shadow-md' : ''}`}
                  >
                    {/* Top Row: Icon + Name + Steppers */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-3 min-w-0 pr-2">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-transform ${
                          isActive ? 'bg-emerald-100 border border-emerald-300 scale-105' : 'bg-white border border-slate-200'
                        }`}>
                          {renderIcon(app.iconName)}
                        </div>
                        <div className="min-w-0">
                          <div className="text-sm font-bold text-slate-900 truncate">{app.name}</div>
                          <div className="text-[11px] text-slate-500 font-mono">
                            {app.runningWatts}W run • {app.surgeWatts}W surge
                          </div>
                        </div>
                      </div>

                      {/* Stepper buttons with tactile feedback */}
                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          onClick={() => updateQuantity(app.id, -1)}
                          disabled={count === 0}
                          className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all duration-150 cursor-pointer ${
                            count === 0
                              ? 'bg-slate-100 text-slate-300 border border-slate-200 cursor-not-allowed'
                              : 'bg-white text-slate-800 hover:bg-slate-100 border border-slate-300 active:scale-90 hover:scale-105 shadow-xs'
                          }`}
                          aria-label="Decrease"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>

                        <span className={`w-6 text-center font-mono font-bold text-sm transition-colors ${
                          isActive ? 'text-emerald-800' : 'text-slate-400'
                        }`}>
                          {count}
                        </span>

                        <button
                          onClick={() => updateQuantity(app.id, 1)}
                          className="w-7 h-7 rounded-lg bg-emerald-600 text-white hover:bg-emerald-500 active:scale-90 hover:scale-105 font-bold flex items-center justify-center transition-all duration-150 cursor-pointer shadow-xs"
                          aria-label="Increase"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Subtle Animated Progress Bar on appliance usage */}
                    <div className="mt-3 pt-2.5 border-t border-slate-200/70">
                      <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono mb-1">
                        <span>
                          {isActive ? `${itemRunning.toLocaleString()}W active` : 'Off'}
                        </span>
                        <span>
                          {isActive ? `${loadContributionPct.toFixed(0)}% of load` : '0%'}
                        </span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-200/80 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ease-out ${
                            isActive
                              ? 'bg-gradient-to-r from-emerald-500 to-teal-500'
                              : 'bg-transparent'
                          }`}
                          style={{
                            width: `${Math.min(100, loadContributionPct)}%`
                          }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

          </div>

          {/* Right Column: Live Load Telemetry & Model Recommendation */}
          <div className="lg:col-span-4 sticky top-28 space-y-6">
            
            <div className="rounded-3xl bg-white border-2 border-emerald-200 p-6 sm:p-7 text-left space-y-6 shadow-xl shadow-emerald-500/10 transition-all">
              
              {/* Telemetry Header */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="text-xs uppercase font-bold text-slate-500 tracking-wider">
                  Live Load Telemetry
                </div>
                <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-mono font-semibold">
                  <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                  REAL-TIME SIZING
                </div>
              </div>

              {/* Running Watts & Surge Watts Counters */}
              <div className="space-y-3.5">
                
                {/* Total Running Load Box with tactile animated progress bar */}
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500 uppercase font-medium">Total Running Load:</span>
                    <span className="font-mono text-xs font-bold text-slate-700">
                      {((totalRunningWatts) / 1000).toFixed(2)} kW
                    </span>
                  </div>

                  <div className="text-2xl font-black text-slate-900 font-mono">
                    {totalRunningWatts.toLocaleString()} <span className="text-xs font-normal text-slate-500">Watts</span>
                  </div>

                  {/* Generator Load Capacity Meter */}
                  <div className="space-y-1 pt-1">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-500">Continuous Capacity:</span>
                      <span className={`font-mono font-bold ${
                        utilizationPct > 85 ? 'text-amber-600' : 'text-emerald-700'
                      }`}>
                        {utilizationPct}% utilized
                      </span>
                    </div>

                    <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden p-0.5 border border-slate-200">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ease-out shadow-xs ${
                          utilizationPct > 85
                            ? 'bg-gradient-to-r from-amber-500 to-orange-500'
                            : utilizationPct > 60
                            ? 'bg-gradient-to-r from-emerald-500 to-teal-500'
                            : 'bg-gradient-to-r from-emerald-600 to-emerald-400'
                        }`}
                        style={{ width: `${Math.max(4, utilizationPct)}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between text-[9px] text-slate-400 font-mono">
                      <span>0W</span>
                      <span className="text-emerald-700 font-semibold">Optimal Zone (60–80%)</span>
                      <span>{recommendedModel.continuousWatts.toLocaleString()}W</span>
                    </div>
                  </div>
                </div>

                {/* Peak Surge Induction with Progress Meter */}
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500 uppercase font-medium">Peak Surge Induction:</span>
                    <span className="font-mono text-xs font-bold text-emerald-700">
                      {((totalSurgeWatts) / 1000).toFixed(2)} kW
                    </span>
                  </div>

                  <div className="text-2xl font-black text-emerald-700 font-mono">
                    {totalSurgeWatts.toLocaleString()} <span className="text-xs font-normal text-slate-500">Watts</span>
                  </div>

                  {/* Surge Headroom Bar */}
                  <div className="space-y-1 pt-1">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-500">Instant Inrush Headroom:</span>
                      <span className="font-mono font-semibold text-slate-700">
                        {surgeTolerancePct}% of max surge
                      </span>
                    </div>

                    <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-teal-400 to-cyan-500 transition-all duration-500 ease-out"
                        style={{ width: `${Math.max(4, surgeTolerancePct)}%` }}
                      />
                    </div>

                    <div className="text-[10px] text-slate-500 font-mono text-right">
                      +{(recommendedModel.surgeWatts - totalSurgeWatts).toLocaleString()}W safe reserve
                    </div>
                  </div>
                </div>

              </div>

              {/* Recommended Generator Box */}
              <div className="p-5 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-3 transition-all">
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase font-bold text-emerald-800 tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Recommended Match</span>
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-600 text-white text-[11px] font-black shadow-xs">
                    {recommendedModel.kva} kVA
                  </span>
                </div>

                <div className="text-xl font-bold text-slate-900 font-heading">
                  {recommendedModel.name}
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  Safely powers all your active appliances with a 25% safety buffer. 
                  Continuous 24/7 duty with 0 dB silent acoustic output.
                </p>

                <div className="pt-2 border-t border-emerald-200 flex items-center justify-between text-xs">
                  <span className="text-slate-600">Outright:</span>
                  <span className="text-slate-900 font-bold font-mono">{formatNaira(recommendedModel.outrightPrice)}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-emerald-800 font-semibold">Pay-Small-Small:</span>
                  <span className="text-emerald-700 font-bold font-mono">From {formatNaira(recommendedModel.monthlyFrom)}/mo</span>
                </div>
              </div>

              {/* Action Button */}
              <button
                id="apply-recommended-model-btn"
                onClick={() => onSelectRecommendedModel(recommendedModel)}
                className="w-full py-4 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-sm tracking-wide shadow-lg shadow-emerald-600/25 transition-all flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.02] active:scale-98"
              >
                <span>Select {recommendedModel.name}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
};

