import React, { useState, useEffect } from 'react';
import { 
  Zap, 
  VolumeX, 
  Flame, 
  SunDim, 
  ShieldCheck, 
  Sparkles, 
  ArrowRight, 
  Activity, 
  CheckCircle2, 
  Radio, 
  Play,
  RotateCw,
  MessageCircle
} from 'lucide-react';
import { ProductModel } from '../types';
import { formatNaira } from '../utils/formatters';
import { useStore } from '../context/StoreContext';

interface HeroProps {
  onOpenCalculator: (model?: ProductModel) => void;
  onOpenReservation: (model?: ProductModel) => void;
  defaultModel: ProductModel;
}

export const Hero: React.FC<HeroProps> = ({
  onOpenCalculator,
  onOpenReservation,
  defaultModel
}) => {
  const { openQuickChat, setCurrentProductView, products, setIsCustomerInquiryModalOpen } = useStore();
  const [selectedHeroModelId, setSelectedHeroModelId] = useState<string>(defaultModel.id);
  const [activeMode, setActiveMode] = useState<'eco' | 'peak' | 'boost'>('eco');
  const [sineOffset, setSineOffset] = useState(0);
  const [soundTestMode, setSoundTestMode] = useState<'silent' | 'generator'>('silent');
  const [soundTestActive, setSoundTestActive] = useState(false);

  // Active hero model from store products or fallback
  const heroModel = products.find((p) => p.id === selectedHeroModelId) || defaultModel;

  // Animated pure sine wave generator
  useEffect(() => {
    const interval = setInterval(() => {
      setSineOffset((prev) => (prev + 0.15) % (Math.PI * 2));
    }, 40);
    return () => clearInterval(interval);
  }, []);

  // Generate SVG sine path
  const generateSineWavePath = () => {
    const points: string[] = [];
    const width = 280;
    const height = 40;
    const midY = height / 2;
    const amplitude = activeMode === 'boost' ? 14 : activeMode === 'peak' ? 12 : 9;
    const frequency = 0.05;

    for (let x = 0; x <= width; x += 4) {
      const y = midY + Math.sin(x * frequency + sineOffset) * amplitude;
      points.push(`${x},${y}`);
    }
    return `M ${points.join(' L ')}`;
  };

  return (
    <section className="relative overflow-hidden pt-8 pb-16 lg:pt-14 lg:pb-24 border-b border-emerald-100">
      {/* Background ambient lighting effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] lg:w-[900px] lg:h-[700px] bg-gradient-to-tr from-emerald-500/10 via-green-500/5 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-10 left-10 w-96 h-96 bg-emerald-500/5 rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-green-500/5 rounded-full blur-[140px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Core Value Proposition */}
          <div className="lg:col-span-6 space-y-8 text-left">
            
            {/* High-status pill */}
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-emerald-50 border border-emerald-200 shadow-xs backdrop-blur-md">
              <span className="flex h-2.5 w-2.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-800">
                Quantum Solid-State Power Cell
              </span>
              <span className="text-emerald-300">|</span>
              <span className="text-xs font-semibold text-emerald-700">
                Pay-Small-Small from 20%
              </span>
            </div>

            {/* Main Headline */}
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.08] font-heading">
                Perpetual Power.{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-emerald-500 to-green-600">
                  Zero Fuel.
                </span>{' '}
                Zero Solar.{' '}
                <span className="text-emerald-800">Silent Execution.</span>
              </h1>
              
              <p className="text-lg sm:text-xl text-slate-600 font-normal leading-relaxed max-w-xl">
                Experience Nigeria’s first zero-noise, fuel-less power generators. 
                No petrol queues, no explosive diesel drums, no cloud-dependent solar roofs. 
                <span className="text-slate-900 font-semibold"> Plug in once, power forever.</span>
              </p>
            </div>

            {/* Core Triple Feature Badges */}
            <div className="grid grid-cols-3 gap-3 sm:gap-4 pt-1">
              <div className="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:border-emerald-300 hover:shadow-md transition-all">
                <div className="flex items-center gap-2 text-emerald-600 mb-1">
                  <VolumeX className="w-5 h-5" />
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Acoustics</span>
                </div>
                <div className="text-xl font-bold text-slate-900 font-heading">0.0 dB</div>
                <div className="text-[11px] text-emerald-700 font-semibold">100% Silent In-Bedroom</div>
              </div>

              <div className="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:border-emerald-300 hover:shadow-md transition-all">
                <div className="flex items-center gap-2 text-emerald-600 mb-1">
                  <Flame className="w-5 h-5 line-through opacity-80 text-rose-500" />
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Fuel Bill</span>
                </div>
                <div className="text-xl font-bold text-slate-900 font-heading">₦0.00</div>
                <div className="text-[11px] text-emerald-700 font-semibold">Zero PMS / AGO</div>
              </div>

              <div className="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:border-emerald-300 hover:shadow-md transition-all">
                <div className="flex items-center gap-2 text-emerald-600 mb-1">
                  <Activity className="w-5 h-5" />
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Duty Cycle</span>
                </div>
                <div className="text-xl font-bold text-slate-900 font-heading">24 / 7</div>
                <div className="text-[11px] text-emerald-700 font-semibold">Continuous Non-Stop</div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                id="hero-calculator-cta"
                onClick={() => onOpenCalculator(heroModel)}
                className="px-7 py-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-base tracking-wide shadow-lg shadow-emerald-600/20 hover:shadow-emerald-500/30 transition-all flex items-center justify-center gap-3 cursor-pointer group"
              >
                <Sparkles className="w-5 h-5 fill-white" />
                <span>Calculate Pay-Small-Small</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                id="hero-reserve-cta"
                onClick={() => onOpenReservation(heroModel)}
                className="px-6 py-4 rounded-xl bg-white hover:bg-slate-50 text-slate-900 font-bold text-base border border-slate-300 hover:border-emerald-500 shadow-xs transition-all flex items-center justify-center gap-2.5 cursor-pointer"
              >
                <Zap className="w-5 h-5 text-emerald-600" />
                <span>Lock 20% Deposit ({formatNaira(heroModel.outrightPrice * 0.2)})</span>
              </button>

              <button
                id="hero-quick-chat-cta"
                onClick={() => {
                  setCurrentProductView(heroModel);
                  openQuickChat(heroModel);
                }}
                className="w-full sm:w-auto px-5 py-4 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 hover:text-emerald-950 font-bold text-sm border border-emerald-300 shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer group/chat"
                title={`Quick Chat about ${heroModel.name} on WhatsApp`}
              >
                <MessageCircle className="w-5 h-5 text-emerald-600 fill-emerald-600/20 group-hover/chat:scale-110 transition-transform" />
                <span>WhatsApp</span>
              </button>
            </div>

            {/* Quick Live Customer Statistic */}
            <div className="pt-2 flex items-center justify-between flex-wrap gap-4 text-xs text-slate-600">
              <div className="flex items-center gap-3">
                <div className="flex -space-x-2">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 border-2 border-emerald-300 flex items-center justify-center text-[11px] font-bold text-emerald-800">FA</div>
                  <div className="w-8 h-8 rounded-full bg-emerald-200 border-2 border-emerald-400 flex items-center justify-center text-[11px] font-bold text-emerald-900">AB</div>
                  <div className="w-8 h-8 rounded-full bg-slate-200 border-2 border-slate-300 flex items-center justify-center text-[11px] font-bold text-slate-800">KN</div>
                </div>
                <div>
                  <span className="text-slate-900 font-semibold">1,480+ Nigerian homes & businesses</span> already powered with ₦0 fuel bills.
                </div>
              </div>

              <button
                onClick={() => setIsCustomerInquiryModalOpen(true)}
                className="text-emerald-700 hover:text-emerald-800 font-bold underline cursor-pointer"
              >
                Book Free Site Audit →
              </button>
            </div>

          </div>

          {/* Right Column: High-Tech Interactive Visual Generator Unit */}
          <div className="lg:col-span-6 relative">
            
            {/* Model Selector Bar above card */}
            <div className="flex items-center justify-between gap-1.5 mb-3 bg-slate-100/90 p-1 rounded-2xl border border-slate-200">
              {products.map((p) => {
                const isActive = p.id === selectedHeroModelId;
                return (
                  <button
                    key={p.id}
                    onClick={() => {
                      setSelectedHeroModelId(p.id);
                      setCurrentProductView(p);
                    }}
                    className={`flex-1 py-2 px-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer truncate ${
                      isActive 
                        ? 'bg-white text-emerald-900 shadow-sm border border-emerald-300 font-black' 
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <span>{p.kva} kVA</span>
                    <span className="hidden sm:inline text-[10px] text-slate-400 font-normal ml-1">({p.name.replace('EverFlow ', '')})</span>
                  </button>
                );
              })}
            </div>

            {/* Glowing card container */}
            <div className="relative rounded-3xl bg-white border border-slate-200 p-5 sm:p-7 backdrop-blur-2xl shadow-xl shadow-slate-200/70 group">
              
              {/* Top Glass HUD Bar */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_#10B981]" />
                  <span className="font-mono text-emerald-800 font-bold uppercase tracking-wider text-[11px]">
                    EVERFLOW {heroModel.name.toUpperCase()} ({heroModel.kva} kVA)
                  </span>
                </div>
                <div className="flex items-center gap-1.5 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 font-mono text-emerald-800 text-[11px] font-bold">
                  <span>SURGE:</span>
                  <span className="text-emerald-600 font-extrabold">{(heroModel.surgeWatts / 1000).toFixed(1)} kW</span>
                </div>
              </div>

              {/* Central Machine Showcase with Floating Badges */}
              <div className="relative my-6 rounded-2xl overflow-hidden bg-gradient-to-b from-slate-50 to-slate-100 border border-slate-200 p-4">
                
                {/* Product Image */}
                <div className="relative aspect-[16/10] w-full rounded-xl overflow-hidden flex items-center justify-center bg-slate-100">
                  <img
                    src={heroModel.image}
                    alt={heroModel.name}
                    className="w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-700"
                  />
                  
                  {/* Subtle vignette overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent opacity-60" />
                  
                  {/* Neon Core Glow Ring in center */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-36 h-36 rounded-full border border-emerald-500/40 animate-ping opacity-35" />
                    <div className="w-48 h-48 rounded-full border border-green-500/30 animate-pulse opacity-40" />
                  </div>

                  {/* Floating HUD Badge 1: 0 dB Silent */}
                  <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl border border-emerald-200 text-left shadow-md">
                    <div className="flex items-center gap-1.5 text-emerald-700 text-[11px] font-bold">
                      <VolumeX className="w-3.5 h-3.5" />
                      <span>NO ENGINE NOISE</span>
                    </div>
                    <div className="text-slate-900 text-xs font-mono font-extrabold">0.0 dB Verified</div>
                  </div>

                  {/* Floating HUD Badge 2: Fuel Consumption */}
                  <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl border border-emerald-200 text-right shadow-md">
                    <div className="flex items-center justify-end gap-1.5 text-emerald-700 text-[11px] font-bold">
                      <SunDim className="w-3.5 h-3.5" />
                      <span>NO SUNLIGHT REQ.</span>
                    </div>
                    <div className="text-slate-900 text-xs font-mono font-extrabold">100% Weather Immune</div>
                  </div>

                  {/* Floating HUD Badge 3: Cost Efficiency */}
                  <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-emerald-300 text-left shadow-md">
                    <div className="text-[10px] uppercase font-bold text-slate-500">Fuel Expenditure</div>
                    <div className="text-emerald-700 text-sm font-black font-heading">₦0 / Litre Forever</div>
                  </div>

                  {/* Floating HUD Badge 4: Pay-Small-Small */}
                  <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-emerald-300 text-right shadow-md">
                    <div className="text-[10px] uppercase font-bold text-slate-500">Flexible Installments</div>
                    <div className="text-emerald-700 text-sm font-black font-heading">From ₦{heroModel.monthlyFrom.toLocaleString()}/mo</div>
                  </div>
                </div>

                {/* Machine Mode Selector HUD */}
                <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between gap-2">
                  <div className="text-xs text-slate-600 font-semibold">
                    Operational Mode:
                  </div>
                  <div className="flex items-center gap-1 bg-slate-200/70 p-1 rounded-xl">
                    <button
                      onClick={() => setActiveMode('eco')}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        activeMode === 'eco'
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'text-slate-700 hover:text-slate-900'
                      }`}
                    >
                      Eco Steady
                    </button>
                    <button
                      onClick={() => setActiveMode('peak')}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        activeMode === 'peak'
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'text-slate-700 hover:text-slate-900'
                      }`}
                    >
                      Peak Load
                    </button>
                    <button
                      onClick={() => setActiveMode('boost')}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        activeMode === 'boost'
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'text-slate-700 hover:text-slate-900'
                      }`}
                    >
                      Surge Boost
                    </button>
                  </div>
                </div>

                {/* Oscillogram Wave & Live Telemetry Output */}
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 bg-white p-3.5 rounded-xl border border-slate-200">
                  <div>
                    <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1">
                      <span className="font-mono font-bold">50.0 Hz PURE SINE WAVE</span>
                      <span className="text-emerald-700 font-bold">THD &lt; 1.2%</span>
                    </div>
                    <div className="h-10 w-full overflow-hidden flex items-center bg-slate-50 rounded border border-emerald-200 px-1">
                      <svg className="w-full h-8 stroke-emerald-600 fill-none" preserveAspectRatio="none">
                        <path d={generateSineWavePath()} strokeWidth="2.5" />
                      </svg>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-left font-mono">
                    <div className="p-2 rounded bg-slate-50 border border-slate-200">
                      <div className="text-[10px] text-slate-500 uppercase">Output Voltage</div>
                      <div className="text-xs font-bold text-slate-900">230.2 V AC</div>
                    </div>
                    <div className="p-2 rounded bg-slate-50 border border-slate-200">
                      <div className="text-[10px] text-slate-500 uppercase">Core Temp</div>
                      <div className="text-xs font-bold text-emerald-700">22.4 °C Cold</div>
                    </div>
                    <div className="p-2 rounded bg-slate-50 border border-slate-200">
                      <div className="text-[10px] text-slate-500 uppercase">Transfer Speed</div>
                      <div className="text-xs font-bold text-emerald-700">&lt; 8 ms (Zero Lag)</div>
                    </div>
                    <div className="p-2 rounded bg-slate-50 border border-slate-200">
                      <div className="text-[10px] text-slate-500 uppercase">Continuous</div>
                      <div className="text-xs font-bold text-slate-900">{(heroModel.continuousWatts / 1000).toFixed(1)} kW</div>
                    </div>
                  </div>
                </div>

              </div>

              {/* Bottom Interactive Sound Check Demo */}
              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center gap-2 text-xs text-slate-600">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                  <span>Acoustic Sensor: <strong>Zero Vibration Detected</strong></span>
                </div>
                
                <button
                  onClick={() => setSoundTestActive(!soundTestActive)}
                  className="text-xs font-bold text-emerald-800 hover:text-emerald-900 flex items-center gap-1.5 cursor-pointer bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200 hover:bg-emerald-100 transition-colors"
                >
                  <Radio className="w-3.5 h-3.5 animate-pulse text-emerald-600" />
                  <span>{soundTestActive ? 'Close Sound Comparison' : 'Acoustic Test: 0 dB vs 98 dB'}</span>
                </button>
              </div>

              {soundTestActive && (
                <div className="mt-3 p-4 rounded-2xl bg-slate-50 border border-emerald-300 text-left space-y-3 animate-in fade-in duration-300 shadow-sm">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-slate-800 font-heading">Interactive Noise Chamber Simulator</span>
                    <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200">
                      <button
                        onClick={() => setSoundTestMode('silent')}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          soundTestMode === 'silent'
                            ? 'bg-emerald-600 text-white shadow-xs'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        EverFlow (0.0 dB)
                      </button>
                      <button
                        onClick={() => setSoundTestMode('generator')}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          soundTestMode === 'generator'
                            ? 'bg-rose-600 text-white shadow-xs'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        Diesel Genset (98.5 dB)
                      </button>
                    </div>
                  </div>

                  {soundTestMode === 'silent' ? (
                    <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-black text-xs">
                          0 dB
                        </div>
                        <div>
                          <div className="text-xs font-bold text-emerald-950">Absolute Whisper Silence</div>
                          <div className="text-[11px] text-emerald-800">Can be placed directly inside your bedroom, nursery, or office. Zero hum.</div>
                        </div>
                      </div>
                      <span className="text-[10px] font-mono font-extrabold uppercase bg-emerald-200 text-emerald-900 px-2 py-1 rounded-md">
                        ESTATE LEGAL
                      </span>
                    </div>
                  ) : (
                    <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center font-black text-xs">
                          98 dB
                        </div>
                        <div>
                          <div className="text-xs font-bold text-rose-950">Deafening Diesel Clatter + Toxic Fumes</div>
                          <div className="text-[11px] text-rose-800">Causes insomnia, migraine, and estate HOA noise fines. Vibrates whole building.</div>
                        </div>
                      </div>
                      <span className="text-[10px] font-mono font-extrabold uppercase bg-rose-200 text-rose-900 px-2 py-1 rounded-md">
                        NOISE POLLUTION
                      </span>
                    </div>
                  )}
                </div>
              )}

            </div>
          </div>

        </div>

        {/* High-Impact Trust Bar Ticker */}
        <div className="mt-16 pt-8 border-t border-slate-200">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            
            <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:border-emerald-300 transition-colors">
              <div className="w-11 h-11 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 shrink-0">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div className="text-left">
                <div className="text-sm font-bold text-slate-900 font-heading">100% Zero-Carbon</div>
                <div className="text-xs text-slate-500">Zero fumes, CO & toxic exhaust</div>
              </div>
            </div>

            <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:border-emerald-300 transition-colors">
              <div className="w-11 h-11 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 shrink-0">
                <SunDim className="w-6 h-6" />
              </div>
              <div className="text-left">
                <div className="text-sm font-bold text-slate-900 font-heading">No Solar Panels Needed</div>
                <div className="text-xs text-slate-500">No roof drilling or battery aging</div>
              </div>
            </div>

            <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:border-emerald-300 transition-colors">
              <div className="w-11 h-11 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 shrink-0">
                <Sparkles className="w-6 h-6" />
              </div>
              <div className="text-left">
                <div className="text-sm font-bold text-slate-900 font-heading">Pay-Small-Small Ready</div>
                <div className="text-xs text-slate-500">From 20% down, up to 12 months</div>
              </div>
            </div>

            <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs hover:border-emerald-300 transition-colors">
              <div className="w-11 h-11 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div className="text-left">
                <div className="text-sm font-bold text-slate-900 font-heading">2 to 5-Year Full Warranty</div>
                <div className="text-xs text-slate-500">Nationwide engineering service</div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
