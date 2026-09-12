import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, Sparkles, Check, Image as ImageIcon, Zap, AlertCircle } from 'lucide-react';
import { ProductModel } from '../../types';
import { formatNaira } from '../../utils/formatters';

interface AddEditProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (product: Omit<ProductModel, 'id'>) => void;
  initialProduct?: ProductModel | null;
}

const PRESET_IMAGES = [
  {
    label: 'Compact Resonance Unit (White/Silver)',
    url: '/src/assets/images/everflow_compact_1788498985370.jpg'
  },
  {
    label: 'Executive Core Generator (Aero Graphite)',
    url: '/src/assets/images/everflow_generator_1788498968530.jpg'
  }
];

export const AddEditProductModal: React.FC<AddEditProductModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialProduct
}) => {
  const isEditing = Boolean(initialProduct);

  const [name, setName] = useState('');
  const [tagline, setTagline] = useState('');
  const [kva, setKva] = useState<number>(5);
  const [continuousWatts, setContinuousWatts] = useState<number>(4500);
  const [surgeWatts, setSurgeWatts] = useState<number>(6000);
  const [outrightPrice, setOutrightPrice] = useState<number>(2800000);
  const [monthlyFrom, setMonthlyFrom] = useState<number>(195000);
  const [badge, setBadge] = useState('New Release');
  const [category, setCategory] = useState<'residential' | 'commercial' | 'industrial'>('residential');
  const [dimensions, setDimensions] = useState('540 x 360 x 480 mm');
  const [weightKg, setWeightKg] = useState<number>(35);
  const [soundDba] = useState<number>(0);
  const [voltage, setVoltage] = useState('230V ±1% Single Phase');
  const [frequency, setFrequency] = useState('50.0 Hz Pure Sine');
  const [warrantyYears, setWarrantyYears] = useState<number>(3);
  const [image, setImage] = useState(PRESET_IMAGES[0].url);
  const [customImageUrl, setCustomImageUrl] = useState('');
  const [recommendedInput, setRecommendedInput] = useState('2x 1.5 HP Inverter AC, Double-Door Refrigerator, Borehole Pump, Home Office');
  
  const [keySpecs, setKeySpecs] = useState<{ label: string; value: string }[]>([
    { label: 'Acoustic Output', value: '0 dB (100% Silent)' },
    { label: 'Fuel Expense', value: '₦0 Forever (Zero PMS/AGO)' },
    { label: 'Automatic Transfer', value: '<8ms Seamless In-Home ATS' },
    { label: 'Harmonic Distortion', value: '<1.5% THD (Safe for Medical/Tech)' }
  ]);

  const [validationError, setValidationError] = useState('');

  // Load initial product if editing
  useEffect(() => {
    if (initialProduct) {
      setName(initialProduct.name);
      setTagline(initialProduct.tagline);
      setKva(initialProduct.kva);
      setContinuousWatts(initialProduct.continuousWatts);
      setSurgeWatts(initialProduct.surgeWatts);
      setOutrightPrice(initialProduct.outrightPrice);
      setMonthlyFrom(initialProduct.monthlyFrom);
      setBadge(initialProduct.badge || '');
      setCategory(initialProduct.category);
      setDimensions(initialProduct.dimensions);
      setWeightKg(initialProduct.weightKg);
      setVoltage(initialProduct.voltage);
      setFrequency(initialProduct.frequency);
      setWarrantyYears(initialProduct.warrantyYears);
      setImage(initialProduct.image);
      setRecommendedInput(initialProduct.recommendedFor.join(', '));
      setKeySpecs(initialProduct.keySpecs || []);
    } else {
      // Defaults for new product
      setName('');
      setTagline('');
      setKva(5);
      setContinuousWatts(4500);
      setSurgeWatts(6000);
      setOutrightPrice(2800000);
      setMonthlyFrom(195000);
      setBadge('New Arrival');
      setCategory('residential');
      setDimensions('540 x 360 x 480 mm');
      setWeightKg(35);
      setVoltage('230V ±1% Single Phase');
      setFrequency('50.0 Hz Pure Sine');
      setWarrantyYears(3);
      setImage(PRESET_IMAGES[0].url);
      setRecommendedInput('2x 1.5 HP Inverter AC, Double-Door Refrigerator, Borehole Pump, Home Office');
      setKeySpecs([
        { label: 'Acoustic Output', value: '0 dB (100% Silent)' },
        { label: 'Fuel Expense', value: '₦0 Forever (Zero PMS/AGO)' },
        { label: 'Automatic Transfer', value: '<8ms Seamless In-Home ATS' },
        { label: 'Harmonic Distortion', value: '<1.5% THD (Safe for Medical/Tech)' }
      ]);
    }
    setValidationError('');
  }, [initialProduct, isOpen]);

  // Auto-calculate helper
  const handleAutoComputeSpecs = () => {
    const computedCont = Math.round(kva * 850);
    const computedSurge = Math.round(kva * 1250);
    setContinuousWatts(computedCont);
    setSurgeWatts(computedSurge);
    
    // Estimate starting monthly on 12-month tenure with 30% down
    const deposit = outrightPrice * 0.3;
    const balance = outrightPrice - deposit;
    const estMonthly = Math.round((balance * 1.08) / 12);
    setMonthlyFrom(estMonthly);
  };

  const handleAddSpec = () => {
    setKeySpecs([...keySpecs, { label: '', value: '' }]);
  };

  const handleSpecChange = (index: number, field: 'label' | 'value', val: string) => {
    const updated = [...keySpecs];
    updated[index][field] = val;
    setKeySpecs(updated);
  };

  const handleRemoveSpec = (index: number) => {
    setKeySpecs(keySpecs.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setValidationError('Please enter a product name (e.g. EverFlow Apex 10).');
      return;
    }
    if (kva <= 0) {
      setValidationError('kVA capacity must be greater than 0.');
      return;
    }
    if (outrightPrice <= 0) {
      setValidationError('Price must be greater than ₦0.');
      return;
    }

    const recommendedList = recommendedInput
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const activeImage = customImageUrl.trim() ? customImageUrl.trim() : image;

    onSave({
      name: name.trim(),
      tagline: tagline.trim() || `${kva} kVA Fuel-Free Resonance Power Generator`,
      kva: Number(kva),
      continuousWatts: Number(continuousWatts),
      surgeWatts: Number(surgeWatts),
      outrightPrice: Number(outrightPrice),
      monthlyFrom: Number(monthlyFrom),
      badge: badge.trim() || undefined,
      category,
      dimensions: dimensions.trim() || '550 x 380 x 490 mm',
      weightKg: Number(weightKg) || 40,
      soundDba,
      voltage: voltage.trim() || '230V Single Phase',
      frequency: frequency.trim() || '50.0 Hz Pure Sine',
      warrantyYears: Number(warrantyYears) || 3,
      recommendedFor: recommendedList.length > 0 ? recommendedList : ['Household ACs', 'Freezers', 'Office Workstations'],
      keySpecs: keySpecs.filter((s) => s.label.trim() && s.value.trim()),
      image: activeImage
    });

    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-white rounded-2xl border border-slate-200 shadow-2xl overflow-hidden my-8 text-left">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
              <Zap className="w-5 h-5 fill-current" />
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-900 font-heading">
                {isEditing ? 'Edit Generator Specifications' : 'Post New Generator Model For Sale'}
              </h3>
              <p className="text-xs text-slate-500">
                Instantly published to the Storefront Catalog, Pay-Small-Small Calculator, and Load Sizer.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white border border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {validationError && (
          <div className="mx-6 mt-4 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{validationError}</span>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Section 1: Basic Identifiers */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Model Name *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. EverFlow Apex 10"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                required
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Tagline / Customer Positioning
              </label>
              <input
                type="text"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                placeholder="e.g. Uninterrupted Silence for 4-Bedroom Luxury Duplexes"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Target Market Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-sm focus:outline-none focus:border-emerald-500"
              >
                <option value="residential">Residential (Homes, Flats, Duplexes)</option>
                <option value="commercial">Commercial (Clinics, Offices, Bakeries)</option>
                <option value="industrial">Industrial (Factories, Hotels, Estates)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Promotional Badge
              </label>
              <input
                type="text"
                value={badge}
                onChange={(e) => setBadge(e.target.value)}
                placeholder="e.g. Most Popular, Executive Choice, Best Seller"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-sm focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Section 2: Power Capacity & Auto-calc */}
          <div className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-200/80 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs uppercase tracking-wider">
                <Zap className="w-4 h-4 text-emerald-600" />
                <span>Electrical Output & Pricing Engine</span>
              </div>
              <button
                type="button"
                onClick={handleAutoComputeSpecs}
                className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white text-[11px] font-bold hover:bg-emerald-500 flex items-center gap-1 cursor-pointer transition-colors shadow-xs"
              >
                <Sparkles className="w-3 h-3" />
                <span>Auto-Calculate Watts & Rates</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  kVA Rating *
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.1"
                    min="1"
                    value={kva}
                    onChange={(e) => setKva(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-900 text-sm font-mono font-bold focus:outline-none focus:border-emerald-500"
                    required
                  />
                  <span className="absolute right-3 top-2 text-xs text-slate-400 font-bold">kVA</span>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  Continuous Output
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={continuousWatts}
                    onChange={(e) => setContinuousWatts(parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-900 text-sm font-mono font-bold focus:outline-none focus:border-emerald-500"
                  />
                  <span className="absolute right-3 top-2 text-xs text-slate-400 font-bold">Watts</span>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  Peak Inductive Surge
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={surgeWatts}
                    onChange={(e) => setSurgeWatts(parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-900 text-sm font-mono font-bold focus:outline-none focus:border-emerald-500"
                  />
                  <span className="absolute right-3 top-2 text-xs text-slate-400 font-bold">Watts</span>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  Outright Price (₦) *
                </label>
                <input
                  type="number"
                  step="50000"
                  min="500000"
                  value={outrightPrice}
                  onChange={(e) => setOutrightPrice(parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-900 text-sm font-mono font-bold focus:outline-none focus:border-emerald-500"
                  required
                />
                <div className="text-[10px] text-emerald-700 font-semibold mt-1">
                  Formatted: {formatNaira(outrightPrice)}
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  Starting Monthly (₦ / mo)
                </label>
                <input
                  type="number"
                  step="5000"
                  value={monthlyFrom}
                  onChange={(e) => setMonthlyFrom(parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-900 text-sm font-mono font-bold focus:outline-none focus:border-emerald-500"
                />
                <div className="text-[10px] text-emerald-700 font-semibold mt-1">
                  Formatted: {formatNaira(monthlyFrom)} / mo
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  Warranty Coverage
                </label>
                <select
                  value={warrantyYears}
                  onChange={(e) => setWarrantyYears(parseInt(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-900 text-sm focus:outline-none focus:border-emerald-500"
                >
                  <option value={2}>2 Years Full Replacement Warranty</option>
                  <option value={3}>3 Years Comprehensive Warranty</option>
                  <option value={5}>5 Years Industrial Warranty</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 3: Product Image */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <ImageIcon className="w-3.5 h-3.5 text-emerald-600" />
              Generator Chassis Image
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {PRESET_IMAGES.map((preset, idx) => (
                <div
                  key={idx}
                  onClick={() => {
                    setImage(preset.url);
                    setCustomImageUrl('');
                  }}
                  className={`p-3 rounded-xl border flex items-center gap-3 cursor-pointer transition-all ${
                    image === preset.url && !customImageUrl
                      ? 'border-2 border-emerald-500 bg-emerald-50/60 shadow-xs'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <img
                    src={preset.url}
                    alt={preset.label}
                    className="w-14 h-14 rounded-lg object-cover border border-slate-200"
                  />
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-slate-900 leading-tight">
                      {preset.label}
                    </div>
                    <div className="text-[10px] text-emerald-700 mt-1 flex items-center gap-1">
                      {image === preset.url && !customImageUrl ? (
                        <>
                          <Check className="w-3 h-3" /> Selected Preset
                        </>
                      ) : (
                        'Click to select'
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2">
              <label className="block text-[11px] font-medium text-slate-500 mb-1">
                Or provide a custom image URL:
              </label>
              <input
                type="url"
                value={customImageUrl}
                onChange={(e) => setCustomImageUrl(e.target.value)}
                placeholder="https://example.com/custom-generator-photo.jpg"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-slate-900 text-xs focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Section 4: Recommended Appliances */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Recommended Household / Commercial Loads (Comma-separated)
            </label>
            <textarea
              rows={2}
              value={recommendedInput}
              onChange={(e) => setRecommendedInput(e.target.value)}
              placeholder="e.g. 2x 1.5 HP Inverter ACs, Double-Door Refrigerator, Borehole Pump, Home Office"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-sm focus:outline-none focus:border-emerald-500"
            />
            <p className="text-[11px] text-slate-500 mt-1">
              These items are highlighted on the product card as verified runnable appliances.
            </p>
          </div>

          {/* Section 5: Key Technical Specs */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Key Technical Highlights (Specs Table)
              </label>
              <button
                type="button"
                onClick={handleAddSpec}
                className="text-xs text-emerald-700 hover:text-emerald-800 font-bold flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Specification Row
              </button>
            </div>

            <div className="space-y-2">
              {keySpecs.map((spec, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={spec.label}
                    onChange={(e) => handleSpecChange(idx, 'label', e.target.value)}
                    placeholder="Feature (e.g. Noise Signature)"
                    className="w-1/2 px-3 py-1.5 rounded-lg border border-slate-300 text-xs text-slate-900 focus:outline-none focus:border-emerald-500"
                  />
                  <input
                    type="text"
                    value={spec.value}
                    onChange={(e) => handleSpecChange(idx, 'value', e.target.value)}
                    placeholder="Specification (e.g. 0 dB Silent)"
                    className="w-1/2 px-3 py-1.5 rounded-lg border border-slate-300 text-xs text-slate-900 focus:outline-none focus:border-emerald-500"
                  />
                  {keySpecs.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveSpec(idx)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 rounded-md hover:bg-rose-50 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Section 6: Dimensions & Voltage */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">
                Dimensions (L x W x H)
              </label>
              <input
                type="text"
                value={dimensions}
                onChange={(e) => setDimensions(e.target.value)}
                placeholder="540 x 360 x 480 mm"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs text-slate-900 focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">
                Chassis Weight
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={weightKg}
                  onChange={(e) => setWeightKg(parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs text-slate-900 focus:outline-none focus:border-emerald-500"
                />
                <span className="absolute right-3 top-2 text-xs text-slate-400">kg</span>
              </div>
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">
                Voltage / Phase
              </label>
              <input
                type="text"
                value={voltage}
                onChange={(e) => setVoltage(e.target.value)}
                placeholder="230V Single Phase"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs text-slate-900 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Modal Actions */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-100 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
            >
              <Zap className="w-4 h-4 fill-white" />
              <span>{isEditing ? 'Save Model Changes' : 'Publish Generator For Sale'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
