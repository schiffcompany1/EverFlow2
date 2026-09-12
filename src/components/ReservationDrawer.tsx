import React, { useState } from 'react';
import { 
  X, 
  Zap, 
  Sparkles, 
  ShieldCheck, 
  CreditCard, 
  Phone, 
  MapPin, 
  User, 
  Mail, 
  CheckCircle2, 
  ArrowRight,
  Truck,
  Lock,
  CalendarDays,
  Flame,
  FileText
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { ProductModel } from '../types';
import { calculateInstallment, formatNaira, generateWhatsAppLink } from '../utils/formatters';
import { calculateDeliveryEstimate } from '../utils/deliveryEstimator';
import { useStore } from '../context/StoreContext';
import { PrintableQuoteModal } from './PrintableQuoteModal';

interface ReservationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  selectedModel: ProductModel;
  depositPercent?: number;
  tenureMonths?: number;
  planType?: 'paysmall' | 'outright';
}

export const ReservationDrawer: React.FC<ReservationDrawerProps> = ({
  isOpen,
  onClose,
  selectedModel,
  depositPercent = 30,
  tenureMonths = 6,
  planType: initialPlanType = 'paysmall'
}) => {
  const { createOrder, selectedDeliveryRegion } = useStore();
  const [planType, setPlanType] = useState<'paysmall' | 'outright'>(initialPlanType);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  
  // Default city based on selectedDeliveryRegion
  const initialCity = selectedDeliveryRegion === 'abuja' 
    ? 'Abuja (Maitama / Asokoro / Wuse)'
    : selectedDeliveryRegion === 'phc'
    ? 'Port Harcourt (GRA / Peter Odili)'
    : selectedDeliveryRegion === 'ibadan'
    ? 'Ibadan / Oyo State'
    : selectedDeliveryRegion === 'nationwide'
    ? 'Other Nigerian State'
    : 'Lagos (Lekki / Ikoyi / VI)';

  const [city, setCity] = useState(initialCity);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [createdOrderId, setCreatedOrderId] = useState<string>('');
  const [showQuoteModal, setShowQuoteModal] = useState(false);

  // Map city dropdown to regionId
  const regionId = city.toLowerCase().includes('abuja') 
    ? 'abuja' 
    : city.toLowerCase().includes('harcourt') 
    ? 'phc' 
    : city.toLowerCase().includes('ibadan') 
    ? 'ibadan' 
    : city.toLowerCase().includes('other') 
    ? 'nationwide' 
    : 'lagos';

  const deliveryEstimate = calculateDeliveryEstimate(selectedModel, regionId);

  const calc = calculateInstallment(selectedModel, depositPercent, tenureMonths);

  const handleConfirmReservation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !customerPhone) {
      alert('Please provide your name and phone number so our logistics dispatch can reach you.');
      return;
    }

    // Persist real order to store & localStorage
    const newOrder = createOrder({
      customerName,
      customerPhone,
      customerEmail: customerEmail || undefined,
      deliveryCity: city,
      model: selectedModel,
      planType,
      depositPercent: planType === 'paysmall' ? depositPercent : 100,
      tenureMonths: planType === 'paysmall' ? tenureMonths : 0,
      notes: `Reserved via storefront drawer. Down payment ${depositPercent}%.`
    });

    setCreatedOrderId(newOrder.id);

    // Trigger celebratory confetti
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });

    setIsSubmitted(true);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity animate-in fade-in duration-300" 
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-lg bg-white border-l border-slate-200 text-left flex flex-col justify-between overflow-y-auto p-6 sm:p-8 shadow-2xl relative">
          
          {/* Top Header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
                <Zap className="w-4 h-4 fill-current" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 font-heading">Priority Unit Reservation</h3>
                <div className="text-xs text-slate-500">2026 Guaranteed Price Lock</div>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-100 border border-slate-200 text-slate-600 hover:text-slate-900 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {isSubmitted ? (
            /* Success Screen */
            <div className="my-auto py-12 text-center space-y-6">
              <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-300 flex items-center justify-center text-emerald-600 mx-auto animate-bounce">
                <CheckCircle2 className="w-9 h-9" />
              </div>

              <div className="space-y-2">
                <span className="inline-block px-3 py-1 rounded-lg bg-slate-900 text-white font-mono text-xs font-bold">
                  Order Ref: {createdOrderId || 'EF-ORD-PENDING'}
                </span>
                <h4 className="text-2xl font-bold text-slate-900 font-heading">Reservation Confirmed!</h4>
                <p className="text-sm text-slate-600 max-w-sm mx-auto leading-relaxed">
                  Thank you, <strong className="text-emerald-700">{customerName}</strong>. Your priority allocation for the{' '}
                  <strong className="text-slate-900">{selectedModel.name}</strong> is locked and registered in our order system.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600 text-left space-y-2 max-w-sm mx-auto">
                <div className="flex justify-between">
                  <span>Selected Model:</span>
                  <strong className="text-slate-900">{selectedModel.name}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Plan Type:</span>
                  <strong className="text-emerald-700">{planType.toUpperCase()}</strong>
                </div>
                {planType === 'paysmall' ? (
                  <>
                    <div className="flex justify-between">
                      <span>Deposit Due:</span>
                      <strong className="text-slate-900">{formatNaira(calc.depositAmount)}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Monthly Installment:</span>
                      <strong className="text-slate-900">{formatNaira(calc.monthlyInstallment)} / mo</strong>
                    </div>
                  </>
                ) : (
                  <div className="flex justify-between">
                    <span>Outright Price:</span>
                    <strong className="text-slate-900">{formatNaira(selectedModel.outrightPrice)}</strong>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Delivery Destination:</span>
                  <strong className="text-slate-900">{city}</strong>
                </div>
                <div className="flex justify-between border-t border-slate-200 pt-2 text-emerald-800">
                  <span className="font-bold flex items-center gap-1">
                    <Truck className="w-3.5 h-3.5 text-emerald-600" />
                    Estimated Arrival:
                  </span>
                  <strong className="font-bold font-mono">{deliveryEstimate.estimatedRangeFormatted}</strong>
                </div>
                <div className="flex justify-between text-[11px] text-slate-500">
                  <span>Fulfillment Hub:</span>
                  <span className="font-medium text-slate-700">{deliveryEstimate.hubName}</span>
                </div>
              </div>

              <p className="text-xs text-slate-500">
                An EverFlow Senior Logistics Engineer will call you on <strong className="text-slate-900">{customerPhone}</strong> within 15 minutes to coordinate ATS changeover inspection and delivery.
              </p>

              <div className="pt-4 flex flex-col gap-3">
                <a
                  href={generateWhatsAppLink({
                    modelName: selectedModel.name,
                    planType: planType,
                    deposit: planType === 'paysmall' ? calc.depositAmount : undefined,
                    monthly: planType === 'paysmall' ? calc.monthlyInstallment : undefined,
                    months: planType === 'paysmall' ? tenureMonths : undefined,
                    customerName,
                    city
                  })}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-sm text-center flex items-center justify-center gap-2 shadow-md shadow-emerald-600/20"
                >
                  <Zap className="w-4 h-4 fill-current" />
                  <span>Open WhatsApp Direct Chat</span>
                </a>

                <button
                  id="btn-success-print-quote"
                  type="button"
                  onClick={() => setShowQuoteModal(true)}
                  className="w-full py-3.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-950 border border-emerald-300 text-xs font-bold tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs"
                >
                  <FileText className="w-4 h-4 text-emerald-600" />
                  <span>Download / Print Official PDF Quote</span>
                </button>

                <button
                  onClick={onClose}
                  className="w-full py-3 rounded-xl bg-slate-100 text-slate-700 text-xs font-semibold hover:bg-slate-200 cursor-pointer"
                >
                  Back to Website
                </button>
              </div>
            </div>
          ) : (
            /* Reservation Configuration Form */
            <form onSubmit={handleConfirmReservation} className="space-y-6 my-4">
              
              {/* Selected Machine Card */}
              <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200 flex items-center gap-4">
                <img
                  src={selectedModel.image}
                  alt={selectedModel.name}
                  className="w-16 h-16 rounded-xl object-cover border border-emerald-200 shrink-0"
                />
                <div className="min-w-0">
                  <div className="text-xs font-mono font-bold text-emerald-800">{selectedModel.kva} kVA Zero-Fuel</div>
                  <div className="text-base font-bold text-slate-900 font-heading truncate">{selectedModel.name}</div>
                  <div className="text-xs text-slate-600">
                    {formatNaira(selectedModel.outrightPrice)} outright
                  </div>
                </div>
              </div>

              {/* Payment Mode Toggle */}
              <div className="space-y-2">
                <label className="text-xs uppercase font-bold text-slate-500 tracking-wider">
                  Select Purchase Structure:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setPlanType('paysmall')}
                    className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                      planType === 'paysmall'
                        ? 'bg-emerald-50 border-2 border-emerald-500 text-emerald-800 font-bold shadow-sm'
                        : 'bg-slate-50 border border-slate-200 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    <div className="text-xs font-bold">Pay-Small-Small</div>
                    <div className="text-[10px] text-slate-500">From {depositPercent}% Down</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPlanType('outright')}
                    className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                      planType === 'outright'
                        ? 'bg-emerald-50 border-2 border-emerald-500 text-emerald-800 font-bold shadow-sm'
                        : 'bg-slate-50 border border-slate-200 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    <div className="text-xs font-bold">Outright Purchase</div>
                    <div className="text-[10px] text-slate-500">100% Complete Pay</div>
                  </button>
                </div>
              </div>

              {/* Financial Snapshot */}
              {planType === 'paysmall' ? (
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Initial Deposit Due Today ({depositPercent}%):</span>
                    <span className="text-emerald-700 font-bold font-mono text-sm">{formatNaira(calc.depositAmount)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Monthly Installment ({tenureMonths} Mos):</span>
                    <span className="text-emerald-700 font-bold font-mono">{formatNaira(calc.monthlyInstallment)} / mo</span>
                  </div>
                  <div className="pt-2 border-t border-slate-200 flex justify-between text-[11px] text-slate-500">
                    <span>Includes: ATS In-Home Switch + 2-Yr Warranty</span>
                    <span className="text-emerald-700 font-medium">FREE</span>
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Total Outright Investment:</span>
                    <span className="text-slate-900 font-bold font-mono text-base">{formatNaira(selectedModel.outrightPrice)}</span>
                  </div>
                  <div className="flex justify-between text-[11px] text-emerald-700">
                    <span>Priority Next-Day Dispatch Included</span>
                    <span>100% Protected</span>
                  </div>
                </div>
              )}

              {/* Customer Info Form Fields */}
              <div className="space-y-4 pt-1">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-emerald-600" /> Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Chief Adeleke Williams"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-emerald-600" /> WhatsApp / Phone *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="0803 123 4567"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-emerald-600" /> Delivery Location
                    </label>
                    <select
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 text-sm focus:outline-none focus:border-emerald-500"
                    >
                      <option value="Lagos (Lekki / Ikoyi / VI)">Lagos (Island)</option>
                      <option value="Lagos (Ikeja / Mainland / Magodo)">Lagos (Mainland)</option>
                      <option value="Abuja (Maitama / Asokoro / Wuse)">Abuja (FCT)</option>
                      <option value="Port Harcourt (GRA / Peter Odili)">Port Harcourt</option>
                      <option value="Ibadan / Oyo State">Ibadan</option>
                      <option value="Other Nigerian State">Other State (Nationwide)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-slate-500" /> Email Address (Optional for Invoice)
                  </label>
                  <input
                    type="email"
                    placeholder="adeleke@example.com"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Dynamic Delivery Date Estimator Box */}
              <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200 text-xs text-slate-700 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 font-bold text-emerald-950">
                    <Truck className="w-4 h-4 text-emerald-600" />
                    <span>Dynamic Delivery Estimator</span>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${deliveryEstimate.demandBadgeBg}`}>
                    {deliveryEstimate.demandBadge}
                  </span>
                </div>

                <div className="flex items-center justify-between pt-1 border-t border-emerald-200/60">
                  <span className="text-slate-600">Expected Arrival at {city.split(' ')[0]}:</span>
                  <strong className="font-mono text-emerald-900 font-bold text-sm">
                    {deliveryEstimate.estimatedRangeFormatted}
                  </strong>
                </div>

                <div className="text-[11px] text-slate-500 flex items-center justify-between">
                  <span>Hub: {deliveryEstimate.hubName}</span>
                  <span className="text-emerald-700 font-semibold">Includes ATS Bench Test</span>
                </div>
              </div>

              {/* Submit / Action Buttons */}
              <div className="pt-3 space-y-3">
                <button
                  type="submit"
                  className="w-full py-4 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-sm tracking-wide shadow-lg shadow-emerald-600/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Lock className="w-4 h-4 fill-white" />
                  <span>Lock Model & Schedule Delivery</span>
                </button>

                <a
                  href={generateWhatsAppLink({
                    modelName: selectedModel.name,
                    planType,
                    deposit: planType === 'paysmall' ? calc.depositAmount : undefined,
                    monthly: planType === 'paysmall' ? calc.monthlyInstallment : undefined,
                    months: planType === 'paysmall' ? tenureMonths : undefined,
                    customerName: customerName || 'Interested Buyer',
                    city
                  })}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-3 px-6 rounded-xl bg-slate-100 hover:bg-slate-200 text-emerald-800 border border-emerald-200 text-xs font-bold tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <Zap className="w-4 h-4 text-emerald-600" />
                  <span>Instant Reserve via WhatsApp Chat</span>
                </a>
                <button
                  id="btn-generate-pdf-quote"
                  type="button"
                  onClick={() => setShowQuoteModal(true)}
                  className="w-full py-3.5 px-5 rounded-xl bg-slate-100 hover:bg-emerald-50 text-slate-800 hover:text-emerald-950 border border-slate-300 hover:border-emerald-400 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs group"
                >
                  <FileText className="w-4 h-4 text-emerald-600 group-hover:scale-110 transition-transform" />
                  <span>Generate Printable PDF Quote</span>
                </button>
              </div>

            </form>
          )}

          {/* Footer note */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span className="flex items-center gap-1">
              <Truck className="w-3.5 h-3.5 text-emerald-600" />
              Insured Nationwide Delivery
            </span>
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              SON Certified
            </span>
          </div>

        </div>
      </div>

      {/* Official Printable PDF Quote Modal */}
      <PrintableQuoteModal
        isOpen={showQuoteModal}
        onClose={() => setShowQuoteModal(false)}
        selectedModel={selectedModel}
        planType={planType}
        depositPercent={depositPercent}
        tenureMonths={tenureMonths}
        customerName={customerName}
        customerPhone={customerPhone}
        customerEmail={customerEmail}
        deliveryCity={city}
        deliveryEstimate={deliveryEstimate}
      />
    </div>
  );
};
