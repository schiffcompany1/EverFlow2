import { ProductModel, CalculationResult } from '../types';

export function formatNaira(val: number): string {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    maximumFractionDigits: 0
  }).format(val).replace('NGN', '₦');
}

export function calculateInstallment(
  model: ProductModel,
  depositPercent: number,
  tenureMonths: number
): CalculationResult {
  const outrightPrice = model.outrightPrice;
  const depositAmount = Math.round((outrightPrice * depositPercent) / 100);
  const balanceAmount = outrightPrice - depositAmount;

  // Gentle service/admin fee for deferred tenure:
  // 3 months: 3% flat
  // 6 months: 6% flat
  // 12 months: 10% flat
  const feeRate = tenureMonths === 3 ? 0.03 : tenureMonths === 6 ? 0.06 : 0.10;
  const financingFee = Math.round(balanceAmount * feeRate);
  const totalBalancePayable = balanceAmount + financingFee;
  const monthlyInstallment = Math.round(totalBalancePayable / tenureMonths);
  const totalPayable = depositAmount + totalBalancePayable;

  // Fuel savings:
  // Average Nigerian petrol spending:
  // 3.5kVA replaces ~15L/day @ ₦1,100/L = ₦16,500/day => ~₦6,022,500/year!
  // 7.5kVA replaces ~25L/day @ ₦1,100/L = ₦27,500/day => ~₦10,037,500/year!
  // 15kVA replaces ~45L/day @ ₦1,100/L = ₦49,500/day => ~₦18,067,500/year!
  // 50kVA replaces ~120L diesel/day @ ₦1,350/L = ₦162,000/day => ~₦59,130,000/year!
  const dailyFuelCost = model.kva <= 3.5 ? 12000 : model.kva <= 7.5 ? 24000 : model.kva <= 15 ? 45000 : 135000;
  const estimatedPetrolSavingsYearly = dailyFuelCost * 365;

  // Projected inflation shielding: projected 25% annual price escalation locked
  const inflationShieldSavings = Math.round(outrightPrice * 0.22);

  return {
    model,
    outrightPrice,
    depositPercent,
    depositAmount,
    tenureMonths,
    balanceAmount,
    monthlyInstallment,
    totalPayable,
    estimatedPetrolSavingsYearly,
    inflationShieldSavings
  };
}

export function generateWhatsAppLink(details: {
  modelName: string;
  planType: string;
  deposit?: number;
  monthly?: number;
  months?: number;
  customerName?: string;
  city?: string;
}): string {
  const phone = '2348123456789';
  const text = `Hello EverFlow Energy Luxury Team! ⚡
I want to reserve the *${details.modelName}*.

*Plan Details:*
- Option: ${details.planType.toUpperCase()}
${details.deposit ? `- Down Payment: ${formatNaira(details.deposit)}` : ''}
${details.monthly ? `- Monthly Installment: ${formatNaira(details.monthly)} / month (${details.months} Months)` : ''}
${details.customerName ? `- Name: ${details.customerName}` : ''}
${details.city ? `- Location: ${details.city}` : ''}

Please confirm availability and schedule my delivery & installation.`;

  return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
}

export interface QuickChatTemplate {
  id: string;
  label: string;
  badge: string;
  description: string;
  generateText: (model: ProductModel) => string;
}

export const QUICK_CHAT_TEMPLATES: QuickChatTemplate[] = [
  {
    id: 'paysmall',
    label: 'Pay-Small-Small Financing',
    badge: '30% Down Payment',
    description: 'Ask about monthly installments, tenure (3/6/12 mos), and instant approval.',
    generateText: (model) => `Hello EverFlow Sales! ⚡
I am reviewing the *${model.name}* (${model.kva}kVA / ${(model.continuousWatts / 1000).toFixed(1)}kW) on your website.

I would like to explore the *Pay-Small-Small* installment plan:
• Outright Price: ${formatNaira(model.outrightPrice)}
• Estimated Down Payment (30%): ${formatNaira(Math.round(model.outrightPrice * 0.3))}
• Monthly Installment: From ~${formatNaira(model.monthlyFrom)}/mo

Could you confirm availability and the documentation required for my location?`
  },
  {
    id: 'compatibility',
    label: 'Load & Appliance Audit',
    badge: 'Technical Check',
    description: 'Confirm if this model can run your ACs, deep freezer, and water pump with 0dB silence.',
    generateText: (model) => `Hello EverFlow Technical Team! 🛠️
I am looking at the *${model.name}* (${model.kva}kVA / Peak: ${(model.surgeWatts / 1000).toFixed(1)}kW).

I want to verify load compatibility:
• Continuous Power: ${(model.continuousWatts / 1000).toFixed(1)}kW (0.0 dB Silent)
• Recommended For: ${model.recommendedFor.join(', ')}

Can an engineer verify if this unit can power my equipment smoothly and advise on ATS hookup?`
  },
  {
    id: 'delivery',
    label: 'Site Inspection & Delivery',
    badge: 'Lagos & Abuja',
    description: 'Request engineer site inspection, ATS installation, and earliest delivery date.',
    generateText: (model) => `Good day EverFlow Operations! 🚚
I am interested in ordering the *${model.name}* (Price: ${formatNaira(model.outrightPrice)}).

I would like to request:
• Site electrical inspection & ATS setup
• Earliest dispatch date for my residence/office
• Details on the ${model.warrantyYears}-Year Comprehensive Warranty

Looking forward to connecting with your engineering desk.`
  },
  {
    id: 'tradein',
    label: 'Zero-Fuel Replacement',
    badge: '₦0 Fuel Savings',
    description: 'Calculate fuel savings replacing your noisy petrol or diesel generator.',
    generateText: (model) => `Hi EverFlow Sales Support! 🌿
I am spending heavily on fuel and want to replace my generator with the silent, fuel-free *${model.name}* (${model.kva}kVA).

Can you provide an estimated payback timeline and confirm zero-maintenance operation for this unit?`
  },
  {
    id: 'corporate',
    label: 'Corporate Proforma Invoice',
    badge: 'B2B Quotation',
    description: 'Request formal company invoice, payment split, and commercial VAT breakdown.',
    generateText: (model) => `Dear EverFlow Corporate Sales, 📋
Please issue a formal Proforma Invoice and technical datasheet for the *${model.name}*:
• Rated Capacity: ${model.kva}kVA (${(model.continuousWatts / 1000).toFixed(1)}kW)
• Output: ${model.voltage} (${model.frequency})
• Machine Price: ${formatNaira(model.outrightPrice)}

Kindly send this via WhatsApp or email for procurement review.`
  }
];

export function buildWhatsAppDeepLink(text: string, phone: string = '2348123456789'): string {
  return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
}
