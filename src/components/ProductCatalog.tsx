import React, { useState } from 'react';
import { 
  Zap, 
  VolumeX, 
  Flame, 
  ShieldCheck, 
  Sparkles, 
  Check, 
  ArrowRight, 
  Layers, 
  Info,
  Sliders,
  ChevronRight,
  MessageCircle,
  Truck,
  MapPin
} from 'lucide-react';
import { ProductModel } from '../types';
import { useStore } from '../context/StoreContext';
import { DELIVERY_REGIONS } from '../utils/deliveryEstimator';
import { MagneticProductCard } from './MagneticProductCard';
import { motion, AnimatePresence } from 'motion/react';

interface ProductCatalogProps {
  onSelectModel: (model: ProductModel, mode: 'outright' | 'paysmall') => void;
  onOpenCalculatorWithModel: (model: ProductModel) => void;
}

export const ProductCatalog: React.FC<ProductCatalogProps> = ({
  onSelectModel,
  onOpenCalculatorWithModel
}) => {
  const { 
    products, 
    openQuickChat, 
    setCurrentProductView,
    selectedDeliveryRegion,
    setSelectedDeliveryRegion
  } = useStore();
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'residential' | 'commercial' | 'industrial'>('all');

  const filteredModels = products.filter((model) => {
    if (selectedCategory === 'all') return true;
    return model.category === selectedCategory;
  });

  const activeRegion = DELIVERY_REGIONS.find((r) => r.id === selectedDeliveryRegion) || DELIVERY_REGIONS[0];

  return (
    <section id="models" className="py-20 border-b border-emerald-100 relative bg-white">
      {/* Subtle background glow */}
      <div className="absolute top-1/3 left-10 w-96 h-96 bg-emerald-500/5 rounded-full blur-[140px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading & Filter Header with subtle fade-in-up */}
        <motion.div 
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 text-left"
        >
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold uppercase tracking-wider">
              <Zap className="w-3.5 h-3.5 fill-current text-emerald-600" />
              <span>Zero-Fuel Machine Lineup</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 font-heading tracking-tight">
              Precision Engineered for Every Scale
            </h2>
            <p className="text-slate-600 text-base sm:text-lg">
              From high-end executive duplexes to industrial manufacturing plants. 
              All units operate at 0 dB sound with zero petroleum fuel consumption.
            </p>
          </div>

          {/* Category Filter Pills & Delivery Region Banner */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {/* Category Filter Pills */}
            <div className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-slate-100 border border-slate-200 backdrop-blur-xl shrink-0 overflow-x-auto">
              {(['all', 'residential', 'commercial', 'industrial'] as const).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
                    selectedCategory === cat
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
                  }`}
                >
                  {cat === 'all' ? 'All Models' : cat}
                </button>
              ))}
            </div>

            {/* Quick Regional Hub Selector */}
            <div className="flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-emerald-50/80 border border-emerald-200 text-xs text-slate-700">
              <Truck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider hidden sm:inline">Delivering to:</span>
              <select
                id="catalog-destination-select"
                value={selectedDeliveryRegion}
                onChange={(e) => setSelectedDeliveryRegion(e.target.value)}
                className="bg-transparent font-bold text-emerald-950 focus:outline-none cursor-pointer text-xs"
              >
                {DELIVERY_REGIONS.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.shortName} {r.transitOffsetDays === 0 ? '(Fastest)' : `(+${r.transitOffsetDays}d)`}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </motion.div>

        {/* Product Cards Grid with Subtle Fade-in-up Scroll In-View Trigger & Layout Animations */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 items-stretch">
          <AnimatePresence mode="popLayout">
            {filteredModels.map((model, idx) => (
              <motion.div
                key={model.id}
                layout
                initial={{ opacity: 0, y: 32, scale: 0.98 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, amount: 0.15, margin: "-30px" }}
                exit={{ opacity: 0, y: 20, scale: 0.96, transition: { duration: 0.2 } }}
                transition={{
                  duration: 0.55,
                  delay: (idx % 2) * 0.1,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="h-full flex flex-col"
              >
                <MagneticProductCard
                  model={model}
                  onSelectModel={onSelectModel}
                  onOpenCalculatorWithModel={onOpenCalculatorWithModel}
                  setCurrentProductView={setCurrentProductView}
                  openQuickChat={openQuickChat}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

      </div>
    </section>
  );
};
