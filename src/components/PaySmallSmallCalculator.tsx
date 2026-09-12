import React, { useState, useMemo } from 'react';
import { 
  Sparkles, 
  CreditCard, 
  ShieldCheck, 
  ArrowRight, 
  Sliders, 
  TrendingDown, 
  Lock, 
  Percent, 
  Calendar, 
  Fuel, 
  Check, 
  Zap,
  Info,
  Printer,
  FileText,
  X,
  MessageCircle
} from 'lucide-react';
import { ProductModel } from '../types';
import { calculateInstallment, formatNaira, generateWhatsAppLink } from '../utils/formatters';
import { useStore } from '../context/StoreContext';

interface PaySmallSmallCalculatorProps {
  onStartPlan: (model: ProductModel, depositPercent: number, tenureMonths: number) => void;
  selectedModelId?: string;
}

export const PaySmallSmallCalculator: React.FC<PaySmallSmallCalculatorProps> = ({
  onStartPlan,
  selectedModelId
}) => {
  const { products, openQuickChat, setCurrentProductView } = useStore();
  const [activeModelId, setActiveModelId] = useState<string>(selectedModelId || products[0]?.id || 'solo-3-5');
  const [depositPercent, setDepositPercent] = useState<number>(30);
  const [tenureMonths, setTenureMonths] = useState<number>(6);
  const [dailyFuelSpend, setDailyFuelSpend] = useState<number>(15000);
  const [showQuoteModal, setShowQuoteModal] = useState<boolean>(false);

  // Sync if prop changes or products update
  React.useEffect(() => {
    if (selectedModelId) {
      setActiveModelId(selectedModelId);
    } else if (!products.some((m) => m.id === activeModelId) && products.length > 0) {
      setActiveModelId(products[0].id);
    }
  }, [selectedModelId, products, activeModelId]);

  const selectedModel = useMemo(() => {
    return products.find((m) => m.id === activeModelId) || products[0];
  }, [products, activeModelId]);

  const calc = useMemo(() => {
    if (!selectedModel) {
      return {
        model: {} as any,
        outrightPrice: 0,
        depositPercent: 30,
        depositAmount: 0,
        tenureMonths: 6,
        balanceAmount: 0,
        monthlyInstallment: 0,
        totalPayable: 0,
        estimatedPetrolSavingsYearly: 0,
        inflationShieldSavings: 0
      };
    }
    return calculateInstallment(selectedModel, depositPercent, tenureMonths);
  }, [selectedModel, depositPercent, tenureMonths]);

  // Average monthly fuel spending for this generator class in Nigeria
  const estimatedFuelReplacedMonthly = useMemo(() => {
    return dailyFuelSpend * 30;
  }, [dailyFuelSpend]);

  const netMonthlyCashSurplus = estimatedFuelReplacedMonthly - calc.monthlyInstallment;

  const handlePrintQuote = () => {
    window.print();
  };

  return (
    <section id="calculator" className="py-20 border-b border-emerald-100 relative bg-white">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 right-1/4 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[130px] pointer-events-none -z-10" />
      <div className="absolute bottom-10 left-10 w-[450px] h-[450px] bg-green-500/5 rounded-full blur-[140px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold tracking-wider uppercase">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>Interactive Financial Control</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 font-heading tracking-tight">
            "Pay-Small-Small"{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-green-600">
              Installment Calculator
            </span>
          </h2>

          <p className="text-base sm:text-lg text-slate-600">
            Own the revolutionary zero-fuel generator today. Pay a modest initial deposit, take immediate delivery, 
            and pay the rest in easy monthly installments.
          </p>
        </div>

        {/* Main Calculator Glass Container */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-xl shadow-slate-200/60">
          
          {/* Left Column: User Interactive Controls */}
          <div className="lg:col-span-7 space-y-8 text-left">
            
            {/* Step 1: Model Selector */}
            <div className="space-y-3">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-emerald-600 text-white text-xs font-black flex items-center justify-center">1</span>
                  Select Generator Capacity
                </span>
                <span className="text-emerald-700 font-semibold lowercase">
                  {selectedModel.kva} kVA capacity
                </span>
              </label>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {products.map((model) => {
                  const isSelected = model.id === activeModelId;
                  return (
                    <button
                      key={model.id}
                      onClick={() => {
                        setActiveModelId(model.id);
                        // Auto calibrate default daily fuel based on model size
                        const autoFuel = model.kva <= 3.5 ? 12000 : model.kva <= 7.5 ? 24000 : model.kva <= 15 ? 48000 : 120000;
                        setDailyFuelSpend(autoFuel);
                      }}
                      className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer relative overflow-hidden ${
                        isSelected
                          ? 'bg-emerald-50 border-emerald-500 text-slate-900 shadow-xs ring-2 ring-emerald-500/20'
                          : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300 hover:text-slate-900'
                      }`}
                    >
                      {isSelected && (
                        <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                      )}
                      <div className="text-xs font-medium text-slate-500">
                        {model.kva} kVA
                      </div>
                      <div className="text-sm font-bold text-slate-900 font-heading mt-0.5 truncate">
                        {model.name.replace('EverFlow ', '')}
                      </div>
                      <div className="text-[11px] text-emerald-700 font-semibold mt-1">
                        {formatNaira(model.outrightPrice)}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Initial Deposit Selector */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-emerald-600 text-white text-xs font-black flex items-center justify-center">2</span>
                  Down Payment (Deposit)
                </label>
                <span className="text-sm font-bold text-emerald-700 font-mono">
                  {depositPercent}% ({formatNaira(calc.depositAmount)})
                </span>
              </div>

              {/* Quick deposit buttons */}
              <div className="grid grid-cols-4 gap-2.5">
                {[20, 30, 40, 50].map((pct) => (
                  <button
                    key={pct}
                    onClick={() => setDepositPercent(pct)}
                    className={`py-3 px-2 rounded-xl border text-center transition-all cursor-pointer ${
                      depositPercent === pct
                        ? 'bg-emerald-600 text-white font-black border-transparent shadow-xs'
                        : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    <div className="text-sm font-bold">{pct}% Down</div>
                    <div className="text-[10px] opacity-90 truncate">{formatNaira((selectedModel.outrightPrice * pct) / 100)}</div>
                  </button>
                ))}
              </div>

              {/* Range Slider for granular control */}
              <div className="pt-2">
                <input
                  type="range"
                  min="20"
                  max="60"
                  step="5"
                  value={depositPercent}
                  onChange={(e) => setDepositPercent(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                />
                <div className="flex justify-between text-[11px] text-slate-400 font-mono mt-1">
                  <span>20% (Minimum)</span>
                  <span>30% (Recommended)</span>
                  <span>50% (Fast Track)</span>
                  <span>60%</span>
                </div>
              </div>
            </div>

            {/* Step 3: Installment Duration */}
            <div className="space-y-3 pt-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-emerald-600 text-white text-xs font-black flex items-center justify-center">3</span>
                  Repayment Tenure Duration
                </span>
                <span className="text-xs text-slate-500">Fixed rate • No surprise jumps</span>
              </label>

              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2.5">
                {[
                  { months: 3, label: '3 Mo', note: 'Fastest' },
                  { months: 6, label: '6 Mo', note: 'Popular' },
                  { months: 9, label: '9 Mo', note: 'Balanced' },
                  { months: 12, label: '12 Mo', note: 'Standard' },
                  { months: 18, label: '18 Mo', note: 'Lowest' }
                ].map((item) => (
                  <button
                    key={item.months}
                    onClick={() => setTenureMonths(item.months)}
                    className={`py-3 px-2 rounded-xl border text-center transition-all cursor-pointer ${
                      tenureMonths === item.months
                        ? 'bg-emerald-600 text-white font-black border-transparent shadow-xs'
                        : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    <div className="text-sm font-bold">{item.label}</div>
                    <div className="text-[10px] opacity-80">{item.note}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 4: Fuel Arbitrage Comparator */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                  <Fuel className="w-4 h-4 text-emerald-600" />
                  Your Current Generator Fuel Bill:
                </span>
                <span className="font-mono font-bold text-slate-900">
                  {formatNaira(dailyFuelSpend)} / day (~{formatNaira(estimatedFuelReplacedMonthly)} / month)
                </span>
              </div>
              <input
                type="range"
                min="5000"
                max="150000"
                step="2500"
                value={dailyFuelSpend}
                onChange={(e) => setDailyFuelSpend(Number(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>₦5,000/day</span>
                <span>₦30,000/day</span>
                <span>₦80,000/day</span>
                <span>₦150,000/day</span>
              </div>
            </div>

            {/* Trust Assurance Bar */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600">
              <div className="flex items-center gap-1.5 text-emerald-700 font-medium">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>Instant KYC in 15 mins</span>
              </div>
              <div className="flex items-center gap-1.5 text-emerald-700 font-medium">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>Immediate Delivery Post-Deposit</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-700 font-medium">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>Zero Collateral Needed</span>
              </div>
            </div>

          </div>

          {/* Right Column: Live Output & Financial Summary Card */}
          <div className="lg:col-span-5 flex flex-col justify-between rounded-2xl bg-white border-2 border-emerald-200 p-6 sm:p-8 text-left relative overflow-hidden shadow-xl shadow-emerald-500/10">
            
            {/* Ambient inner glow */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />

            <div className="space-y-6">
              
              {/* Header Badge */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <div className="text-xs uppercase font-bold tracking-wider text-slate-500">Calculated Plan</div>
                  <div className="text-lg font-bold text-slate-900 font-heading">{selectedModel.name}</div>
                </div>
                <button
                  onClick={() => setShowQuoteModal(true)}
                  className="px-3 py-1.5 rounded-full bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 font-mono text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors"
                  title="Generate printable pro-forma quote"
                >
                  <FileText className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Get PDF Quote</span>
                </button>
              </div>

              {/* Major Metric 1: Deposit Today */}
              <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200">
                <div className="text-xs uppercase font-bold text-slate-600 flex items-center justify-between">
                  <span>Pay Today to Lock & Take Delivery:</span>
                  <span className="text-emerald-800 font-semibold">{depositPercent}% Down</span>
                </div>
                <div className="text-3xl sm:text-4xl font-extrabold text-emerald-800 font-heading mt-1">
                  {formatNaira(calc.depositAmount)}
                </div>
                <div className="text-[11px] text-slate-600 mt-1 flex items-center gap-1">
                  <Lock className="w-3.5 h-3.5 text-emerald-600" />
                  Guarantees model reservation and immediate priority dispatch.
                </div>
              </div>

              {/* Major Metric 2: Monthly Installment */}
              <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200">
                <div className="text-xs uppercase font-bold text-slate-600 flex items-center justify-between">
                  <span>Monthly Installment:</span>
                  <span className="text-emerald-800 font-semibold">{tenureMonths} Months</span>
                </div>
                <div className="text-3xl sm:text-4xl font-extrabold text-emerald-700 font-heading mt-1">
                  {formatNaira(calc.monthlyInstallment)}
                  <span className="text-sm font-normal text-slate-500"> / month</span>
                </div>
                <div className="text-[11px] text-slate-500 mt-1">
                  Equivalent to ~{formatNaira(Math.round(calc.monthlyInstallment / 30))} per day.
                </div>
              </div>

              {/* Inflation Protection Ring / Card */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-600 font-medium flex items-center gap-1.5">
                    <TrendingDown className="w-4 h-4 text-emerald-600" />
                    Estimated Fuel Replaced / Mo:
                  </span>
                  <span className="text-rose-500 font-bold font-mono line-through">
                    {formatNaira(estimatedFuelReplacedMonthly)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-600 font-medium">Monthly EverFlow Payment:</span>
                  <span className="text-slate-900 font-bold font-mono">
                    {formatNaira(calc.monthlyInstallment)}
                  </span>
                </div>
                <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-xs font-bold text-emerald-700">
                  <span>Net Monthly Cash Kept In Your Pocket:</span>
                  <span className="text-sm font-heading">
                    +{formatNaira(Math.max(0, netMonthlyCashSurplus))} / mo
                  </span>
                </div>
              </div>

              <div className="text-[11px] text-slate-500 leading-relaxed">
                *The money you would have wasted on petrol or diesel already covers your monthly installment, leaving you with surplus cash from Month 1!
              </div>

            </div>

            {/* Action CTAs */}
            <div className="pt-6 space-y-3">
              <button
                id="apply-paysmall-btn"
                onClick={() => onStartPlan(selectedModel, depositPercent, tenureMonths)}
                className="w-full py-4 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-base shadow-lg shadow-emerald-600/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Lock Plan ({depositPercent}% Deposit)</span>
                <ArrowRight className="w-5 h-5" />
              </button>

              <button
                id="whatsapp-instant-approval-btn"
                onClick={() => {
                  setCurrentProductView(selectedModel);
                  openQuickChat(selectedModel);
                }}
                className="w-full py-3 px-6 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-800 border border-slate-300 text-xs font-bold tracking-wide flex items-center justify-center gap-2 transition-all cursor-pointer group/chat"
              >
                <MessageCircle className="w-4 h-4 text-emerald-600 fill-emerald-600/20 group-hover/chat:scale-110 transition-transform" />
                <span>Quick Chat & Instant Pre-Approval (WhatsApp)</span>
              </button>
            </div>

          </div>

        </div>

      </div>

      {/* Printable Pro-Forma Quote Modal */}
      {showQuoteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-xl rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 text-left space-y-6 relative max-h-[90vh] overflow-y-auto">
            
            <button
              onClick={() => setShowQuoteModal(false)}
              className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Quote Header */}
            <div className="border-b border-slate-200 pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-black text-slate-900 font-heading">Official Pro-Forma Quotation</h3>
                  <div className="text-xs text-slate-500">EverFlow Energy Nigeria Ltd • Quote Ref: EF-2026-{(Math.random() * 89999 + 10000).toFixed(0)}</div>
                </div>
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-200 font-black text-lg">
                  ⚡
                </div>
              </div>
            </div>

            {/* Quote Body */}
            <div className="space-y-4 text-xs text-slate-700">
              <div className="grid grid-cols-2 gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <div>
                  <div className="text-slate-400 uppercase font-bold text-[10px]">Model Configuration</div>
                  <div className="font-bold text-slate-900 text-sm">{selectedModel.name} ({selectedModel.kva} kVA)</div>
                  <div className="text-slate-500">Continuous: {selectedModel.continuousWatts}W | Surge: {selectedModel.surgeWatts}W</div>
                </div>
                <div className="text-right">
                  <div className="text-slate-400 uppercase font-bold text-[10px]">Outright Value</div>
                  <div className="font-bold text-slate-900 text-sm">{formatNaira(selectedModel.outrightPrice)}</div>
                  <div className="text-emerald-700 font-semibold">2026 Price Shield</div>
                </div>
              </div>

              <div className="border border-slate-200 rounded-xl divide-y divide-slate-100 overflow-hidden">
                <div className="p-3 flex justify-between">
                  <span>Down Payment ({depositPercent}% Deposit):</span>
                  <span className="font-bold text-slate-900 font-mono">{formatNaira(calc.depositAmount)}</span>
                </div>
                <div className="p-3 flex justify-between">
                  <span>Financed Principal Balance:</span>
                  <span className="font-mono text-slate-700">{formatNaira(calc.balanceAmount)}</span>
                </div>
                <div className="p-3 flex justify-between">
                  <span>Tenure:</span>
                  <span className="font-bold text-slate-900">{tenureMonths} Monthly Payments</span>
                </div>
                <div className="p-3 flex justify-between bg-emerald-50/50">
                  <span className="font-bold text-emerald-900">Monthly Installment:</span>
                  <span className="font-black text-emerald-700 font-mono text-sm">{formatNaira(calc.monthlyInstallment)} / mo</span>
                </div>
                <div className="p-3 flex justify-between">
                  <span>Estimated Annual Petrol Savings:</span>
                  <span className="font-bold text-emerald-600 font-mono">+{formatNaira(calc.estimatedPetrolSavingsYearly)}</span>
                </div>
              </div>

              <div className="text-[11px] text-slate-500 space-y-1">
                <div>• Includes ATS (Automatic Transfer Switch) seamless cutover.</div>
                <div>• Free nationwide white-glove engineering commissioning.</div>
                <div>• Warranty: {selectedModel.warrantyYears} Years Comprehensive Parts & Labor.</div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
              <button
                onClick={handlePrintQuote}
                className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center gap-2 cursor-pointer transition-colors"
              >
                <Printer className="w-4 h-4 text-slate-600" />
                <span>Print or Save as PDF</span>
              </button>
              <button
                onClick={() => {
                  setShowQuoteModal(false);
                  onStartPlan(selectedModel, depositPercent, tenureMonths);
                }}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-2 cursor-pointer transition-colors shadow-md shadow-emerald-600/20"
              >
                <Lock className="w-4 h-4" />
                <span>Lock This Quote & Reserve</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </section>
  );
};
