import React, { useState, useEffect, useRef } from 'react';
import { 
  Zap, 
  Activity, 
  Flame, 
  VolumeX, 
  Volume2, 
  ShieldCheck, 
  Sparkles, 
  Clock, 
  TrendingDown, 
  Gauge, 
  Radio, 
  Play, 
  Pause, 
  RotateCcw, 
  Maximize2, 
  Minimize2, 
  X, 
  AlertTriangle, 
  CheckCircle2, 
  Layers, 
  ArrowUpRight,
  Sliders,
  DollarSign
} from 'lucide-react';
import { formatNaira } from '../utils/formatters';

interface LivePerformanceOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  isEmbedded?: boolean;
  onExpandOverlay?: () => void;
}

// Nigerian operational scenarios
interface ScenarioPreset {
  id: string;
  name: string;
  location: string;
  kva: number;
  dailyHours: number;
  appliances: string;
  description: string;
}

const PRESETS: ScenarioPreset[] = [
  {
    id: 'residential',
    name: '3-Bedroom Residence',
    location: 'Lekki Phase 1, Lagos',
    kva: 10,
    dailyHours: 14,
    appliances: '2 Inverter ACs, Double-Door Fridge, Water Booster Pump, Smart TVs & Starlink',
    description: 'Replacing standard 10kVA diesel generator running 14 hours during daily grid blackouts.'
  },
  {
    id: 'commercial',
    name: 'Supermarket & Bakery',
    location: 'Wuse II, Abuja',
    kva: 25,
    dailyHours: 18,
    appliances: '3 Commercial Display Freezers, Lighting Grid, POS Servers, HVAC Unit',
    description: 'Eliminates astronomical ₦2.4M monthly diesel bill for cold-chain preservation.'
  },
  {
    id: 'clinic',
    name: 'Medical Diagnostic Center',
    location: 'GRA Phase 2, Port Harcourt',
    kva: 15,
    dailyHours: 24,
    appliances: 'Ultrasound Scanner, Blood Centrifuges, Vaccine Chiller, Laboratory Lighting',
    description: 'Zero-tolerance for power cuts or voltage harmonics that corrupt sensitive medical equipment.'
  },
  {
    id: 'corporate',
    name: 'FinTech Hub & Server Floor',
    location: 'Yaba Tech Corridor, Lagos',
    kva: 50,
    dailyHours: 16,
    appliances: 'Cloud Server Racks, Central AC, 60 Developer Workstations, Fiber Terminal',
    description: 'Guaranteed 0.0 dB silent operation inside open-plan office with zero diesel fumes.'
  }
];

// Diesel consumption approximate burn rates by kVA (Liters per hour at 75% load)
const DIESEL_BURN_RATES: Record<number, number> = {
  5: 1.4,
  10: 2.6,
  15: 3.9,
  25: 6.5,
  50: 12.8
};

export const LivePerformanceOverlay: React.FC<LivePerformanceOverlayProps> = ({
  isOpen,
  onClose,
  isEmbedded = false,
  onExpandOverlay
}) => {
  // Scenario & Generator Configuration
  const [selectedPreset, setSelectedPreset] = useState<string>('residential');
  const [selectedKva, setSelectedKva] = useState<number>(10);
  const [dieselPricePerLiter, setDieselPricePerLiter] = useState<number>(1350); // Nigerian market rate ₦1,350/L
  const [dailyOutageHours, setDailyOutageHours] = useState<number>(14);
  const [isRunning, setIsRunning] = useState<boolean>(true);

  // Live real-time accumulators
  const [sessionSeconds, setSessionSeconds] = useState<number>(0);
  const [dieselLitersWasted, setDieselLitersWasted] = useState<number>(0);
  const [nairaSavedCumulative, setNairaSavedCumulative] = useState<number>(0);
  const [co2AvoidedKg, setCo2AvoidedKg] = useState<number>(0);

  // Real-time fluctuating telemetry metrics
  const [telemetry, setTelemetry] = useState({
    instantLoadPercent: 72.4,
    everflowWatts: 7240,
    everflowHz: 50.00,
    everflowThd: 1.14,
    everflowTempC: 22.3,
    dieselHz: 48.9,
    dieselThd: 9.8,
    dieselTempC: 412,
    dieselDb: 94.6,
    activePhase: 'L1-L2-L3 Balanced'
  });

  // Canvas ref for live 60fps dual waveform visualizer
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const secondsElapsedRef = useRef<number>(0);
  const logCounterRef = useRef<number>(0);

  // Telemetry log list
  const [logs, setLogs] = useState<Array<{ id: string; time: string; text: string; type: 'success' | 'warn' | 'info' }>>([
    {
      id: 'init-1',
      time: '00:00:01',
      text: 'EverFlow Quantum Solid-State Core initialized. Solid crystalline flux active.',
      type: 'success'
    },
    {
      id: 'init-2',
      time: '00:00:02',
      text: 'Baseline Traditional Diesel comparator set to 10 kVA @ ₦1,350/Liter (Lagos average).',
      type: 'info'
    },
    {
      id: 'init-3',
      time: '00:00:04',
      text: 'Seamless ATS transfer engaged: <6.2ms switch latency detected.',
      type: 'success'
    }
  ]);

  // Load preset changes
  const handlePresetSelect = (presetId: string) => {
    setSelectedPreset(presetId);
    const p = PRESETS.find(pr => pr.id === presetId);
    if (p) {
      setSelectedKva(p.kva);
      setDailyOutageHours(p.dailyHours);
    }
  };

  // Reset simulation counters
  const handleReset = () => {
    secondsElapsedRef.current = 0;
    logCounterRef.current += 1;
    setSessionSeconds(0);
    setDieselLitersWasted(0);
    setNairaSavedCumulative(0);
    setCo2AvoidedKg(0);
    setLogs([
      {
        id: `reset-${Date.now()}-${logCounterRef.current}`,
        time: '00:00:00',
        text: 'Live telemetry counters recalibrated to zero.',
        type: 'info'
      }
    ]);
  };

  // Calculated hourly and monthly projections
  const burnRatePerHour = DIESEL_BURN_RATES[selectedKva] || (selectedKva * 0.26);
  const dieselCostPerHour = burnRatePerHour * dieselPricePerLiter;
  const dieselCostPerDay = dieselCostPerHour * dailyOutageHours;
  const monthlySavings = dieselCostPerDay * 30;
  const yearlySavings = dieselCostPerDay * 365;

  // Real-time telemetry tick loop (every 1 second)
  useEffect(() => {
    if (!isRunning || (!isOpen && !isEmbedded)) return;

    const interval = setInterval(() => {
      secondsElapsedRef.current += 1;
      const currentSec = secondsElapsedRef.current;
      setSessionSeconds(currentSec);

      // Calculate incremental burn per second
      const burnPerSec = burnRatePerHour / 3600;
      const nairaPerSec = dieselCostPerHour / 3600;
      // 1 liter of diesel produces approx 2.68 kg CO2
      const co2PerSec = (burnPerSec * 2.68);

      setDieselLitersWasted(prev => prev + burnPerSec);
      setNairaSavedCumulative(prev => prev + nairaPerSec);
      setCo2AvoidedKg(prev => prev + co2PerSec);

      // Micro-fluctuations in load and harmonics to simulate real electrical draw
      const jitter = (Math.random() - 0.5) * 3;
      const loadPct = Math.min(92, Math.max(55, 72 + jitter));
      const activeWatts = Math.round((selectedKva * 1000 * 0.8) * (loadPct / 100));

      const dieselHzJitter = 48.2 + (Math.random() * 2.8); // erratic 48.2 - 51.0 Hz
      const dieselThdJitter = 8.8 + (Math.random() * 2.4); // 8.8% - 11.2% THD
      const dieselTempJitter = Math.round(405 + (Math.random() * 25));

      setTelemetry({
        instantLoadPercent: Number(loadPct.toFixed(1)),
        everflowWatts: activeWatts,
        everflowHz: 50.00, // Rock-solid solid state
        everflowThd: Number((1.12 + Math.random() * 0.08).toFixed(2)),
        everflowTempC: Number((22.1 + Math.random() * 0.4).toFixed(1)),
        dieselHz: Number(dieselHzJitter.toFixed(1)),
        dieselThd: Number(dieselThdJitter.toFixed(1)),
        dieselTempC: dieselTempJitter,
        dieselDb: Number((93.8 + Math.random() * 2.2).toFixed(1)),
        activePhase: 'L1-L2-L3 Balanced'
      });

      // Periodically push realistic event logs every 12 ticks
      if (currentSec > 0 && currentSec % 12 === 0) {
        logCounterRef.current += 1;
        const nowStr = new Date().toTimeString().split(' ')[0];
        const logMessages = [
          `Diesel generator equivalent emitted +${(burnPerSec * 12 * 2.68).toFixed(2)} kg CO₂ soot.`,
          `EverFlow solid-state resonance core maintained stable 22.3°C cold-chassis.`,
          `Voltage sag on diesel: ${dieselHzJitter.toFixed(1)} Hz (Warning: risk to inverter compressor).`,
          `Cumulative fuel cost avoided by EverFlow: ₦${Math.round(nairaPerSec * currentSec).toLocaleString()}.`,
          `Grid micro-fluctuation neutralized by EverFlow ultra-pure sine wave (<1.2% THD).`
        ];
        const pickedMsg = logMessages[Math.floor(Math.random() * logMessages.length)];
        const logType: 'success' | 'warn' | 'info' = pickedMsg.includes('Warning') ? 'warn' : pickedMsg.includes('avoided') ? 'success' : 'info';
        
        const newLogId = `log-${Date.now()}-${logCounterRef.current}-${Math.random().toString(36).substring(2, 7)}`;
        setLogs(prevLogs => [
          {
            id: newLogId,
            time: nowStr,
            text: pickedMsg,
            type: logType
          },
          ...prevLogs.slice(0, 7) // keep recent 8 items
        ]);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, isOpen, isEmbedded, burnRatePerHour, dieselCostPerHour, selectedKva]);

  // Dual Waveform Canvas Oscilloscope (60fps requestAnimationFrame)
  useEffect(() => {
    if (!isOpen && !isEmbedded) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let phase = 0;
    let running = true;

    const render = () => {
      if (!running) return;

      const width = canvas.width;
      const height = canvas.height;

      // Dark oscilloscope canvas clear
      ctx.fillStyle = '#090d16';
      ctx.fillRect(0, 0, width, height);

      // Draw faint oscilloscope grid lines
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 1;

      // Vertical grid lines
      for (let x = 0; x < width; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }

      // Horizontal grid lines
      for (let y = 0; y < height; y += 30) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Center baseline
      ctx.strokeStyle = '#334155';
      ctx.beginPath();
      ctx.moveTo(0, height / 2);
      ctx.lineTo(width, height / 2);
      ctx.stroke();

      // WAVEFORM 1: Traditional Diesel Generator (Noisy, distorted, clipped harmonic spikes)
      ctx.beginPath();
      ctx.lineWidth = 2.5;
      ctx.strokeStyle = '#ef4444'; // Red-orange warning tone
      ctx.shadowColor = '#ef4444';
      ctx.shadowBlur = 8;

      const dieselMidY = height * 0.5;
      const amp = height * 0.28;

      for (let x = 0; x < width; x++) {
        // Fundamental frequency + 3rd and 5th harmonics + erratic jitter
        const t = (x / width) * 4 * Math.PI + phase;
        const fundamental = Math.sin(t);
        const harmonic3 = 0.22 * Math.sin(3 * t + 0.4);
        const harmonic5 = 0.12 * Math.sin(5 * t + 1.2);
        const noise = (Math.sin(x * 12.3 + phase * 4) * 0.08);

        const y = dieselMidY + (fundamental + harmonic3 + harmonic5 + noise) * amp;
        if (x === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.stroke();

      // WAVEFORM 2: EverFlow Pure Sine Wave (Silky smooth, clean 50.00 Hz, laboratory emerald green)
      ctx.beginPath();
      ctx.lineWidth = 3.5;
      ctx.strokeStyle = '#10b981'; // Vibrant emerald
      ctx.shadowColor = '#10b981';
      ctx.shadowBlur = 12;

      for (let x = 0; x < width; x++) {
        const t = (x / width) * 4 * Math.PI + phase;
        // Ultra-pure sine wave with virtually zero harmonic distortion
        const y = dieselMidY + Math.sin(t) * amp;
        if (x === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.stroke();

      // Reset shadow blur
      ctx.shadowBlur = 0;

      phase += 0.045;
      animationFrameRef.current = requestAnimationFrame(render);
    };

    animationFrameRef.current = requestAnimationFrame(render);

    return () => {
      running = false;
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  // Format seconds into HH:MM:SS
  const formatTime = (secs: number) => {
    const h = Math.floor(secs / 3600).toString().padStart(2, '0');
    const m = Math.floor((secs % 3600) / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${h}:${m}:${s}`;
  };

  if (!isOpen && !isEmbedded) return null;

  // Render content
  const content = (
    <div className={`text-slate-900 ${isEmbedded ? '' : 'p-4 sm:p-6 lg:p-8 max-h-[90vh] overflow-y-auto'}`}>
      {/* Top Banner / HUD Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-200 pb-5 mb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-bold font-mono tracking-wider">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              LIVE TELEMETRY STREAM
            </span>
            <span className="px-2.5 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-xs font-medium">
              Nigeria Power Economics Benchmark
            </span>
            <span className="text-xs text-slate-500 font-mono">
              Sampling: 1000ms • Sub-cycle Precision
            </span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-black text-slate-900 font-heading tracking-tight">
            EverFlow vs. Traditional Diesel Generator
          </h3>
          <p className="text-xs sm:text-sm text-slate-600">
            Real-time simulated telemetry comparing fuel burn, harmonic distortion, noise levels, and cumulative cash waste across Nigerian commercial and residential operations.
          </p>
        </div>

        {/* Live Controls */}
        <div className="flex items-center gap-2 self-start lg:self-center flex-wrap">
          <button
            id="btn-telemetry-toggle-play"
            onClick={() => setIsRunning(!isRunning)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              isRunning 
                ? 'bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300' 
                : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm'
            }`}
          >
            {isRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{isRunning ? 'Pause Telemetry' : 'Resume Telemetry'}</span>
          </button>

          <button
            id="btn-telemetry-reset"
            onClick={handleReset}
            className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer border border-slate-200"
            title="Reset live accumulators"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Counters</span>
          </button>

          {isEmbedded && onExpandOverlay && (
            <button
              id="btn-telemetry-expand-overlay"
              onClick={onExpandOverlay}
              className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm ml-1"
              title="Expand into full-screen visual overlay"
            >
              <Maximize2 className="w-3.5 h-3.5" />
              <span>Full-Screen HUD</span>
            </button>
          )}

          {!isEmbedded && (
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 flex items-center justify-center transition-colors cursor-pointer border border-slate-200 ml-1"
              aria-label="Close modal"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Scenario Presets Bar */}
      <div className="mb-6 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
            <Sliders className="w-3.5 h-3.5 text-emerald-600" />
            <span>Select Nigerian Deployment Scenario:</span>
          </span>
          <span className="text-[11px] text-emerald-700 font-medium">
            Diesel Price Indexed at: <strong>{formatNaira(dieselPricePerLiter)}/Liter</strong>
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          {PRESETS.map((p) => {
            const isSelected = selectedPreset === p.id;
            return (
              <button
                key={p.id}
                onClick={() => handlePresetSelect(p.id)}
                className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                  isSelected 
                    ? 'bg-emerald-50/90 border-emerald-400 shadow-sm ring-1 ring-emerald-400/40' 
                    : 'bg-white hover:bg-slate-50 border-slate-200'
                }`}
              >
                <div className="flex items-center justify-between gap-1">
                  <span className="font-bold text-xs text-slate-900">{p.name}</span>
                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-md ${
                    isSelected ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {p.kva} kVA
                  </span>
                </div>
                <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
                  <span>📍 {p.location}</span>
                </div>
                <div className="text-[11px] text-slate-600 mt-1 line-clamp-1">
                  {p.appliances}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Hero Real-Time Counters (Ticking Live!) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        
        {/* Counter 1: Live Naira Ticking */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-600 to-emerald-800 text-white shadow-md relative overflow-hidden">
          <div className="absolute -right-4 -bottom-4 w-20 h-20 bg-white/10 rounded-full blur-xl pointer-events-none" />
          <div className="flex items-center justify-between text-emerald-100 text-xs mb-1">
            <span className="font-semibold uppercase tracking-wider text-[10px]">Session Cash Saved</span>
            <span className="flex items-center gap-1 font-mono text-[11px]">
              <Clock className="w-3 h-3" />
              {formatTime(sessionSeconds)}
            </span>
          </div>
          <div className="text-2xl sm:text-3xl font-black font-mono tracking-tight text-white">
            ₦{nairaSavedCumulative.toFixed(2)}
          </div>
          <div className="text-[11px] text-emerald-100 mt-1 flex items-center gap-1">
            <TrendingDown className="w-3.5 h-3.5 text-emerald-200" />
            <span>Accumulating at <strong>+{formatNaira(Math.round(dieselCostPerHour / 3600 * 60))}/min</strong></span>
          </div>
        </div>

        {/* Counter 2: Diesel Liters Burned */}
        <div className="p-4 rounded-2xl bg-slate-900 text-white border border-slate-800 shadow-md">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span className="font-semibold uppercase tracking-wider text-[10px]">Diesel Avoided</span>
            <Flame className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black font-mono tracking-tight text-amber-400">
            {dieselLitersWasted.toFixed(3)} <span className="text-base text-slate-400 font-sans">Liters</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Standard <strong>{burnRatePerHour.toFixed(1)} L/hr</strong> burn rate avoided
          </div>
        </div>

        {/* Counter 3: Projected Monthly Diesel Waste in Nigeria */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
            <span className="font-bold uppercase tracking-wider text-[10px]">Monthly Diesel Bill (Diesel)</span>
            <DollarSign className="w-3.5 h-3.5 text-red-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-black font-mono tracking-tight text-slate-900">
            {formatNaira(monthlySavings)}
          </div>
          <div className="text-[11px] text-red-600 font-semibold mt-1">
            ₦0.00 with EverFlow Zero-Fuel
          </div>
        </div>

        {/* Counter 4: Clean Air & Carbon Shield */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
            <span className="font-bold uppercase tracking-wider text-[10px]">CO₂ Carbon Avoided</span>
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-black font-mono tracking-tight text-emerald-700">
            {co2AvoidedKg.toFixed(2)} <span className="text-base text-slate-500 font-sans">kg CO₂</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Zero smoke • Zero carcinogenic particulate soot
          </div>
        </div>

      </div>

      {/* Main Grid: Oscilloscope + Side-by-Side Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">
        
        {/* Left Col: Live Oscilloscope Canvas (8 Cols) */}
        <div className="lg:col-span-7 bg-slate-950 rounded-3xl p-5 border border-slate-800 shadow-xl text-white flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-3 mb-3 flex-wrap">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400">
                  Live Oscilloscope Waveform Analysis
                </span>
              </div>
              <div className="flex items-center gap-4 text-xs font-mono">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-1 bg-emerald-400 rounded-full inline-block" />
                  <span className="text-emerald-300">EverFlow (Pure Sine)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-1 bg-red-500 rounded-full inline-block" />
                  <span className="text-red-400">Diesel (Harmonic Noise)</span>
                </div>
              </div>
            </div>

            {/* Canvas Screen */}
            <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 aspect-[16/8]">
              <canvas 
                ref={canvasRef} 
                width={640} 
                height={260} 
                className="w-full h-full block"
              />

              {/* Floating Real-Time Readouts on Canvas */}
              <div className="absolute top-3 left-3 bg-slate-900/90 backdrop-blur-md px-2.5 py-1 rounded-lg border border-emerald-500/40 text-[11px] font-mono text-emerald-400">
                EverFlow: {telemetry.everflowHz.toFixed(2)} Hz • THD: {telemetry.everflowThd}%
              </div>
              <div className="absolute bottom-3 left-3 bg-slate-900/90 backdrop-blur-md px-2.5 py-1 rounded-lg border border-red-500/40 text-[11px] font-mono text-red-400">
                Diesel: {telemetry.dieselHz.toFixed(1)} Hz • THD: {telemetry.dieselThd}% (Jitter)
              </div>
            </div>
          </div>

          {/* Under-Canvas Diagnostic Indicators */}
          <div className="grid grid-cols-3 gap-2 mt-4 text-center font-mono text-xs">
            <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
              <div className="text-[10px] text-slate-400 uppercase">Acoustic Level</div>
              <div className="text-sm font-bold text-emerald-400 mt-0.5">0.0 dB (Silent)</div>
              <div className="text-[10px] text-red-400 mt-0.5">vs. {telemetry.dieselDb} dB (Diesel)</div>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
              <div className="text-[10px] text-slate-400 uppercase">Core Operating Temp</div>
              <div className="text-sm font-bold text-emerald-400 mt-0.5">{telemetry.everflowTempC}°C (Cold)</div>
              <div className="text-[10px] text-red-400 mt-0.5">vs. {telemetry.dieselTempC}°C (Exhaust)</div>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
              <div className="text-[10px] text-slate-400 uppercase">ATS Cutover</div>
              <div className="text-sm font-bold text-emerald-400 mt-0.5">&lt; 8ms (Instant)</div>
              <div className="text-[10px] text-slate-400 mt-0.5">vs. 45s (Manual Crank)</div>
            </div>
          </div>
        </div>

        {/* Right Col: Deep Technical Comparison Matrix (5 Cols) */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between text-left">
          <div>
            <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Operating Differential ({selectedKva} kVA Rating)
              </span>
              <span className="text-xs font-bold text-emerald-700 font-mono">
                {telemetry.instantLoadPercent}% Active Load
              </span>
            </div>

            <div className="space-y-3 text-xs">
              
              {/* Row 1: Fuel Burn */}
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-slate-500 font-medium">Fuel Burn Rate</span>
                  <span className="text-emerald-700 font-bold font-mono">100% Free Forever</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="text-emerald-700 font-bold">EverFlow: 0.00 L / hr</div>
                  <div className="text-red-600 font-mono text-right">Diesel: {burnRatePerHour.toFixed(1)} L / hr</div>
                </div>
              </div>

              {/* Row 2: Hourly Fuel Cost */}
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-slate-500 font-medium">Hourly Running Cost</span>
                  <span className="text-slate-400 text-[10px]">At ₦{dieselPricePerLiter}/L</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="text-emerald-700 font-bold">EverFlow: ₦0.00 / hr</div>
                  <div className="text-red-600 font-mono font-bold text-right">{formatNaira(Math.round(dieselCostPerHour))} / hr</div>
                </div>
              </div>

              {/* Row 3: Maintenance & Oil Changes */}
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-slate-500 font-medium">Servicing & Oil Replacement</span>
                  <span className="text-emerald-700 font-bold">Zero Moving Parts</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="text-emerald-700 font-bold">EverFlow: 0 Servicing</div>
                  <div className="text-slate-600 text-right">Diesel: Every 200 Hrs</div>
                </div>
              </div>

              {/* Row 4: Sensitive Electronics Safety */}
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-slate-500 font-medium">Harmonics & Inverter Safety</span>
                  <span className="text-emerald-700 font-bold">THD &lt; 1.2%</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="text-emerald-700 font-bold">Inverter ACs 100% Safe</div>
                  <div className="text-red-600 text-right">Board Fried Risk High</div>
                </div>
              </div>

            </div>
          </div>

          {/* Micro Telemetry Events Stream */}
          <div className="mt-4 pt-3 border-t border-slate-100">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 flex items-center justify-between">
              <span>Live System Event Stream</span>
              <span className="font-mono text-slate-400">{logs.length} events</span>
            </div>
            <div className="space-y-1 max-h-24 overflow-y-auto pr-1">
              {logs.slice(0, 4).map((log, idx) => (
                <div key={`${log.id}-${idx}`} className="text-[11px] leading-tight flex items-start gap-1.5 font-mono">
                  <span className="text-slate-400 shrink-0">[{log.time}]</span>
                  <span className={
                    log.type === 'success' ? 'text-emerald-700 font-medium' :
                    log.type === 'warn' ? 'text-amber-700 font-medium' : 'text-slate-600'
                  }>
                    {log.text}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* Nigerian Economic Payoff Summary Card */}
      <div className="p-5 rounded-3xl bg-slate-900 text-white flex flex-col md:flex-row items-center justify-between gap-6 text-left">
        <div className="space-y-1 max-w-xl">
          <div className="text-xs uppercase font-bold tracking-wider text-emerald-400">
            5-Year Nigeria Economic Verdict
          </div>
          <div className="text-xl sm:text-2xl font-bold font-heading">
            Save Over {formatNaira(yearlySavings * 5)} in Diesel & Mechanic Fees
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Running a traditional {selectedKva} kVA diesel generator for {dailyOutageHours} hours/day burns approximately {Math.round(burnRatePerHour * dailyOutageHours * 365).toLocaleString()} liters of diesel every single year. EverFlow completely eliminates this recurring hemorrhage from day one.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0 flex-wrap">
          <div className="p-3 rounded-2xl bg-slate-800 border border-slate-700 text-center min-w-[130px]">
            <div className="text-lg font-black text-emerald-400 font-mono">{formatNaira(yearlySavings)}</div>
            <div className="text-[10px] text-slate-400 mt-0.5">Yearly Fuel Waste Avoided</div>
          </div>

          <div className="p-3 rounded-2xl bg-slate-800 border border-slate-700 text-center min-w-[130px]">
            <div className="text-lg font-black text-emerald-400 font-mono">0.0 dB</div>
            <div className="text-[10px] text-slate-400 mt-0.5">Noise Pollution</div>
          </div>
        </div>
      </div>

    </div>
  );

  // If embedded directly inside TechnologyExplainer
  if (isEmbedded) {
    return (
      <div className="rounded-3xl bg-white border border-slate-200 p-6 sm:p-8 shadow-xl shadow-slate-200/50 relative overflow-hidden">
        {content}
      </div>
    );
  }

  // If rendered as a full-screen interactive visual overlay modal
  return (
    <div 
      className="fixed inset-0 z-[65] overflow-y-auto bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-6xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-4"
        onClick={(e) => e.stopPropagation()}
      >
        {content}
      </div>
    </div>
  );
};
