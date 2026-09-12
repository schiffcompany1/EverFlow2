import React, { useState } from 'react';
import { 
  Zap, 
  Cpu, 
  Radio, 
  VolumeX, 
  ShieldCheck, 
  CheckCircle, 
  Sparkles, 
  Layers, 
  ThermometerSnowflake, 
  Activity, 
  Wrench, 
  ArrowRight, 
  HelpCircle, 
  MessageSquare,
  Maximize2
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { LivePerformanceOverlay } from './LivePerformanceOverlay';

export const TechnologyExplainer: React.FC = () => {
  const { openInquiryModal, currentProductView } = useStore();
  const [isOverlayOpen, setIsOverlayOpen] = useState<boolean>(false);

  const handleAskLeadEngineer = () => {
    openInquiryModal('Technical Question', currentProductView?.name);
  };

  const pillars = [
    {
      icon: Radio,
      title: 'Quantum Resonance Flux Cell',
      detail: 'Replaces combustion engines entirely. Solid-state sub-atomic crystalline lattices harness perpetual electromagnetic flux without burning fuel or needing sunshine.'
    },
    {
      icon: VolumeX,
      title: '0 dB Acoustic Cancellation',
      detail: 'No reciprocating pistons, valves, spark plugs, or exhaust pipes. Operates in total laboratory silence. Safe for indoor living rooms, bedrooms, or clinical wards.'
    },
    {
      icon: ThermometerSnowflake,
      title: 'Cold-Chassis Thermal Design',
      detail: 'Ultra-efficient superconducting core operates cold to the touch (21°C - 24°C). Zero heat exhaust, eliminating ventilation fire hazards common to diesel rooms.'
    },
    {
      icon: Activity,
      title: 'Ultra-Pure 50.0 Hz Sine Wave',
      detail: 'Total Harmonic Distortion (THD) under 1.2%—cleaner than NEPA/PHCN utility power. Shields sensitive inverter ACs, medical scanners, and Starlink systems.'
    }
  ];

  return (
    <section id="technology" className="py-20 border-b border-emerald-100 relative bg-white">
      {/* Background radial glow */}
      <div className="absolute top-1/2 right-10 w-96 h-96 bg-emerald-500/5 rounded-full blur-[150px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold uppercase tracking-wider">
            <Cpu className="w-3.5 h-3.5 text-emerald-600" />
            <span>Under The Hood</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 font-heading tracking-tight">
            The Science of Perpetual Clean Power
          </h2>

          <p className="text-base sm:text-lg text-slate-600">
            Engineered with aerospace-grade solid-state magnetic induction. 
            No fuel combustion, no mechanical friction, and zero moving wear parts.
          </p>

          {/* Quick Trigger Button for Live Performance Visual Overlay */}
          <div className="pt-2">
            <button
              id="btn-launch-live-performance-overlay"
              onClick={() => setIsOverlayOpen(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-slate-950 hover:bg-slate-900 text-emerald-400 border border-emerald-500/40 text-xs font-bold uppercase tracking-wider transition-all shadow-md hover:shadow-emerald-950/20 hover:scale-105 cursor-pointer group"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <Activity className="w-3.5 h-3.5 text-emerald-400" />
              <span>Launch Live Performance Visual Overlay (Nigeria vs. Diesel)</span>
              <Maximize2 className="w-3.5 h-3.5 text-slate-400 group-hover:text-white transition-colors" />
            </button>
          </div>
        </div>

        {/* 4 Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
          {pillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <div 
                key={idx}
                className="p-6 rounded-3xl bg-white border border-slate-200 hover:border-emerald-300 transition-all hover:-translate-y-1 group shadow-sm hover:shadow-md"
              >
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 mb-5 group-hover:scale-110 transition-transform shadow-xs">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 font-heading mb-2 group-hover:text-emerald-700 transition-colors">
                  {pillar.title}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {pillar.detail}
                </p>
              </div>
            );
          })}
        </div>

        {/* Live Performance Visual Telemetry Section (Embedded Live Display) */}
        <div id="live-performance-telemetry" className="mt-14">
          <LivePerformanceOverlay
            isOpen={true}
            onClose={() => {}}
            isEmbedded={true}
            onExpandOverlay={() => setIsOverlayOpen(true)}
          />
        </div>

        {/* Architecture Infographic Banner */}
        <div className="mt-12 p-8 rounded-3xl bg-slate-50 border border-slate-200 flex flex-col lg:flex-row items-center justify-between gap-8 text-left">
          <div className="space-y-2 max-w-xl">
            <div className="text-xs uppercase font-bold tracking-wider text-emerald-700">
              Military-Grade Engineering
            </div>
            <div className="text-2xl font-bold text-slate-900 font-heading">
              25-Year Operational Lifespan Rating
            </div>
            <p className="text-sm text-slate-600">
              Unlike petrol engines that break down every 6 months and solar batteries that degrade after 3 years, 
              EverFlow’s solid-state resonance core has zero degradation over two decades of 24/7 service.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-6">
            <div className="text-center p-4 rounded-2xl bg-white border border-slate-200 min-w-[120px] shadow-xs">
              <div className="text-3xl font-black text-emerald-700 font-heading">25+</div>
              <div className="text-xs text-slate-500 mt-0.5">Years Lifespan</div>
            </div>
            <div className="text-center p-4 rounded-2xl bg-white border border-slate-200 min-w-[120px] shadow-xs">
              <div className="text-3xl font-black text-emerald-700 font-heading">0.0%</div>
              <div className="text-xs text-slate-500 mt-0.5">Carbon Emissions</div>
            </div>
            <div className="text-center p-4 rounded-2xl bg-white border border-slate-200 min-w-[120px] shadow-xs">
              <div className="text-3xl font-black text-emerald-700 font-heading">&lt;8ms</div>
              <div className="text-xs text-slate-500 mt-0.5">ATS Transfer Time</div>
            </div>
          </div>
        </div>

        {/* Floating 'Ask a Lead Engineer' Action Component */}
        <div className="sticky bottom-6 z-20 flex justify-center mt-12 pointer-events-none">
          <div className="pointer-events-auto bg-slate-950/95 text-white backdrop-blur-xl px-5 py-3.5 rounded-full border border-emerald-500/40 shadow-2xl shadow-emerald-950/40 flex flex-wrap sm:flex-nowrap items-center justify-between gap-4 max-w-2xl w-full mx-4 transition-all hover:border-emerald-400 group">
            <div className="flex items-center gap-3">
              <div className="relative shrink-0">
                <div className="w-10 h-10 rounded-full bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-400">
                  <Wrench className="w-5 h-5" />
                </div>
                <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 rounded-full ring-2 ring-slate-950 animate-ping" />
                <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 rounded-full ring-2 ring-slate-950" />
              </div>
              <div className="text-left">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded-md border border-emerald-800/60">
                    Lead Systems Engineer
                  </span>
                  <span className="text-[11px] text-slate-400 hidden sm:inline">• Direct Technical Routing</span>
                </div>
                <div className="text-xs font-semibold text-slate-200 mt-0.5">
                  Questions on ATS cutover, harmonics, or DB panel load balancing?
                </div>
              </div>
            </div>

            <button
              id="btn-ask-lead-engineer"
              onClick={handleAskLeadEngineer}
              className="px-5 py-2.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all hover:scale-105 active:scale-95 cursor-pointer shrink-0 shadow-md shadow-emerald-500/30"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Ask a Lead Engineer</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>

      </div>

      {/* Fullscreen Dedicated Visual Overlay Modal */}
      <LivePerformanceOverlay
        isOpen={isOverlayOpen}
        onClose={() => setIsOverlayOpen(false)}
        isEmbedded={false}
      />
    </section>
  );
};
