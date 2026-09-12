import React, { useState } from 'react';
import { 
  X, 
  Printer, 
  Download, 
  Copy, 
  Check, 
  FileText, 
  ShieldCheck, 
  Zap, 
  Building2, 
  Calendar, 
  Truck,
  Sparkles,
  Lock
} from 'lucide-react';
import { ProductModel } from '../types';
import { formatNaira } from '../utils/formatters';
import { DeliveryEstimateResult } from '../utils/deliveryEstimator';

interface PrintableQuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedModel: ProductModel;
  planType: 'paysmall' | 'outright';
  depositPercent: number;
  tenureMonths: number;
  customerName?: string;
  customerPhone?: string;
  customerEmail?: string;
  deliveryCity?: string;
  deliveryEstimate: DeliveryEstimateResult;
}

export const PrintableQuoteModal: React.FC<PrintableQuoteModalProps> = ({
  isOpen,
  onClose,
  selectedModel,
  planType,
  depositPercent,
  tenureMonths,
  customerName = 'Valued Client',
  customerPhone = 'Not Provided',
  customerEmail = 'Not Provided',
  deliveryCity = 'Lagos, Nigeria',
  deliveryEstimate
}) => {
  const [copied, setCopied] = useState(false);
  
  // Static quote reference and date
  const [quoteRef] = useState(() => {
    const rand = Math.floor(1000 + Math.random() * 9000);
    return `EF-QTE-2026-${rand}`;
  });

  const currentDate = new Date().toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  const validUntilDate = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  if (!isOpen) return null;

  // Calculation figures
  const outrightPrice = selectedModel.outrightPrice;
  const depositAmount = planType === 'paysmall' 
    ? Math.round(outrightPrice * (depositPercent / 100))
    : outrightPrice;

  const financedBalance = Math.max(0, outrightPrice - depositAmount);
  // 1.5% interest per month for financed balance
  const totalFinancedWithInterest = financedBalance * (1 + (tenureMonths * 0.015));
  const monthlyInstallment = tenureMonths > 0 ? Math.round(totalFinancedWithInterest / tenureMonths) : 0;
  const totalCost = planType === 'paysmall' ? depositAmount + (monthlyInstallment * tenureMonths) : outrightPrice;

  const handlePrint = () => {
    try {
      window.print();
    } catch {
      // Fallback
    }
  };

  const handleCopySummary = () => {
    const text = `
*OFFICIAL EVERFLOW ENERGY PROFORMA QUOTE*
Quote Ref: ${quoteRef}
Date: ${currentDate} (Valid 14 Days)

Client: ${customerName || 'Valued Client'}
Phone: ${customerPhone}
Destination: ${deliveryCity}

MACHINE SPECIFICATIONS:
- Model: EverFlow ${selectedModel.name}
- Rating: ${selectedModel.kva} kVA Zero-Fuel Quantum Generator
- Continuous Output: ${(selectedModel.continuousWatts / 1000).toFixed(1)} kW
- Surge Induction: ${(selectedModel.surgeWatts / 1000).toFixed(1)} kW
- Acoustic Rating: 0 dB (Silent)
- ATS Changeover: < 8ms Seamless Transfer Switch (INCLUDED FREE)
- Warranty: ${selectedModel.warrantyYears}-Year Comprehensive SON-Certified Warranty

PAYMENT STRUCTURE (${planType === 'paysmall' ? 'PAY-SMALL-SMALL' : 'OUTRIGHT PURCHASE'}):
${planType === 'paysmall' ? `
- Initial Deposit (${depositPercent}%): ${formatNaira(depositAmount)}
- Monthly Repayment: ${formatNaira(monthlyInstallment)} / month
- Tenure Duration: ${tenureMonths} Months
- Total Investment: ${formatNaira(totalCost)}
` : `
- 100% Outright Equipment Price: ${formatNaira(outrightPrice)}
- VIP Priority Dispatch: Next-Day Included
`}

DISPATCH & COMMISSIONING:
- Hub: ${deliveryEstimate.hubName}
- Delivery ETA: ${deliveryEstimate.estimatedRangeFormatted}

PAYMENT ACCOUNT (EVERFLOW CORPORATE):
- Bank: Guaranty Trust Bank (GTBank)
- Account Name: EverFlow Energy Technologies Ltd
- Account Number: 0823491029
- Reference: Quote ${quoteRef}
    `.trim();

    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownloadHtml = () => {
    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>EverFlow Energy Quote - ${quoteRef}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; color: #0f172a; margin: 40px; }
    .header { border-bottom: 2px solid #10b981; padding-bottom: 20px; display: flex; justify-content: space-between; }
    .title { font-size: 24px; font-weight: bold; color: #064e3b; }
    .meta { font-size: 13px; color: #64748b; line-height: 1.6; }
    .section-title { font-size: 15px; font-weight: bold; text-transform: uppercase; margin-top: 24px; margin-bottom: 8px; color: #047857; border-bottom: 1px solid #e2e8f0; padding-bottom: 4px; }
    table { width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 14px; }
    th, td { padding: 10px; text-align: left; border-bottom: 1px solid #e2e8f0; }
    th { background: #f8fafc; color: #475569; }
    .highlight { font-weight: bold; color: #047857; }
    .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #cbd5e1; font-size: 12px; color: #64748b; text-align: center; }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <div class="title">EVERFLOW ENERGY TECHNOLOGIES LTD</div>
      <div class="meta">Zero-Fuel Perpetual Power Generation | Lagos • Abuja • Port Harcourt<br>RC: 1849204 | SON & NERC Regulatory Certified</div>
    </div>
    <div style="text-align: right;">
      <div style="font-weight: bold; color: #047857;">PROFORMA QUOTE</div>
      <div class="meta">Ref: <strong>${quoteRef}</strong><br>Date: ${currentDate}<br>Price Lock: Valid 14 Days</div>
    </div>
  </div>

  <div class="section-title">Client Information</div>
  <table style="width: 100%;">
    <tr>
      <td><strong>Prepared For:</strong> ${customerName || 'Valued Client'}</td>
      <td><strong>Phone:</strong> ${customerPhone}</td>
    </tr>
    <tr>
      <td><strong>Email:</strong> ${customerEmail || 'N/A'}</td>
      <td><strong>Destination:</strong> ${deliveryCity}</td>
    </tr>
  </table>

  <div class="section-title">Equipment Specification</div>
  <table>
    <thead>
      <tr><th>Description</th><th>Rating</th><th>Acoustic</th><th>ATS Changeover</th><th>Warranty</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>${selectedModel.name}</strong><br><small style="color: #64748b;">Zero-Petroleum Clean Generator</small></td>
        <td>${selectedModel.kva} kVA (${(selectedModel.continuousWatts / 1000).toFixed(1)} kW Run / ${(selectedModel.surgeWatts / 1000).toFixed(1)} kW Peak)</td>
        <td>0 dB (Silent)</td>
        <td>&lt; 8ms ATS Switch</td>
        <td>${selectedModel.warrantyYears} Years Replacement</td>
      </tr>
    </tbody>
  </table>

  <div class="section-title">Commercial Terms & Payment Structure (${planType === 'paysmall' ? 'PAY-SMALL-SMALL' : 'OUTRIGHT'})</div>
  <table>
    <tr><td>Outright Equipment Price</td><td style="text-align: right; font-weight: bold;">${formatNaira(outrightPrice)}</td></tr>
    ${planType === 'paysmall' ? `
    <tr><td>Down Payment Deposit (${depositPercent}%)</td><td style="text-align: right; font-weight: bold; color: #047857;">${formatNaira(depositAmount)}</td></tr>
    <tr><td>Tenure Duration</td><td style="text-align: right;">${tenureMonths} Months</td></tr>
    <tr><td>Monthly Installment Repayment</td><td style="text-align: right; font-weight: bold; color: #047857;">${formatNaira(monthlyInstallment)} / month</td></tr>
    <tr><td><strong>Total Planned Investment</strong></td><td style="text-align: right; font-weight: bold; font-size: 16px;"><strong>${formatNaira(totalCost)}</strong></td></tr>
    ` : `
    <tr><td>Down Payment Required</td><td style="text-align: right; font-weight: bold; color: #047857;">100% (${formatNaira(outrightPrice)})</td></tr>
    `}
    <tr><td>Automatic Transfer Switch (ATS) 8ms</td><td style="text-align: right; color: #047857; font-weight: bold;">FREE (₦350,000 value)</td></tr>
    <tr><td>Delivery & Commissioning (${deliveryEstimate.hubName})</td><td style="text-align: right; color: #047857; font-weight: bold;">INCLUDED (ETA: ${deliveryEstimate.estimatedRangeFormatted})</td></tr>
  </table>

  <div class="section-title">Official Remittance Details</div>
  <table style="width: 100%; background: #f0fdf4;">
    <tr><td><strong>Bank:</strong> Guaranty Trust Bank (GTBank)</td><td><strong>Account Name:</strong> EverFlow Energy Technologies Ltd</td></tr>
    <tr><td><strong>Account Number:</strong> 0823491029 (NUBAN)</td><td><strong>Reference Note:</strong> Quote ${quoteRef}</td></tr>
  </table>

  <div class="footer">
    This document constitutes a binding 14-day price lock guarantee under Nigerian Commercial Law.<br>
    EverFlow Energy Technologies Ltd • Plot 14 Admiralty Way, Lekki Phase 1, Lagos • support@everflowenergy.ng
  </div>
</body>
</html>
    `.trim();

    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `EverFlow-Quote-${quoteRef}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div 
      className="fixed inset-0 z-[60] overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden text-left my-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Control Bar (Hidden on print) */}
        <div className="no-print bg-slate-900 text-white p-4 sm:px-6 flex items-center justify-between gap-4 flex-wrap border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-400">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <div className="text-sm font-bold font-heading">Official Proforma Quote & Price Guarantee</div>
              <div className="text-[11px] text-slate-400 font-mono">Ref: {quoteRef} • Valid 14 Days</div>
            </div>
          </div>

          {/* Action Toolbar */}
          <div className="flex items-center gap-2">
            <button
              id="btn-print-pdf"
              onClick={handlePrint}
              className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
              title="Print directly or save as PDF"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>

            <button
              id="btn-download-html"
              onClick={handleDownloadHtml}
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer border border-slate-700"
              title="Download standalone printable document"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Download</span>
            </button>

            <button
              onClick={handleCopySummary}
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer border border-slate-700"
              title="Copy quote summary"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">{copied ? 'Copied' : 'Copy'}</span>
            </button>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer border border-slate-700 ml-1"
              aria-label="Close quote"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Sheet View */}
        <div id="printable-quote-sheet" className="p-6 sm:p-10 text-slate-900 space-y-6 max-h-[80vh] overflow-y-auto bg-white">
          
          {/* Header Row: Corporate Logo + Quote Meta */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b-2 border-emerald-600 pb-6">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-black text-sm">
                  ⚡
                </div>
                <span className="text-xl font-black font-heading tracking-tight text-slate-900">
                  EVERFLOW <span className="text-emerald-700">ENERGY</span>
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium leading-relaxed">
                EverFlow Energy Technologies Ltd • RC: 1849204<br />
                Plot 14 Admiralty Way, Lekki Phase 1, Lagos & Maitama Hub, Abuja<br />
                SON & NERC Regulatory Certified Commercial Vendor
              </p>
            </div>

            <div className="sm:text-right space-y-0.5">
              <span className="inline-block px-2.5 py-1 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-mono font-bold">
                PROFORMA QUOTE
              </span>
              <div className="text-xs font-mono text-slate-500 mt-1">
                Ref: <strong className="text-slate-900">{quoteRef}</strong>
              </div>
              <div className="text-xs text-slate-600">
                Date: <strong>{currentDate}</strong>
              </div>
              <div className="text-xs text-emerald-700 font-semibold">
                Price Lock: <strong>Valid Until {validUntilDate}</strong>
              </div>
            </div>
          </div>

          {/* Client & Destination Info Card */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <div className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Client Details:</div>
              <div className="text-sm font-bold text-slate-900 mt-0.5">{customerName || 'Valued Client'}</div>
              <div className="text-slate-600 font-mono mt-0.5">Phone: {customerPhone}</div>
              {customerEmail && customerEmail !== 'Not Provided' && (
                <div className="text-slate-600 mt-0.5">Email: {customerEmail}</div>
              )}
            </div>

            <div>
              <div className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Delivery & Commissioning:</div>
              <div className="text-sm font-bold text-slate-900 mt-0.5">{deliveryCity}</div>
              <div className="text-emerald-800 font-medium mt-0.5 flex items-center gap-1">
                <Truck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Hub: {deliveryEstimate.hubName}</span>
              </div>
              <div className="text-slate-500 text-[11px] mt-0.5">
                Arrival Schedule: <strong>{deliveryEstimate.estimatedRangeFormatted}</strong>
              </div>
            </div>
          </div>

          {/* Machine Line Item Table */}
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              Configured Machine Specification
            </div>

            <div className="border border-slate-200 rounded-2xl overflow-hidden">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                  <tr>
                    <th className="p-3">Equipment / Description</th>
                    <th className="p-3 text-center">Rating</th>
                    <th className="p-3 text-center">Acoustics</th>
                    <th className="p-3 text-right">Standard Price</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr>
                    <td className="p-3">
                      <div className="font-bold text-slate-900 text-sm">{selectedModel.name}</div>
                      <div className="text-slate-500 text-[11px]">{selectedModel.tagline}</div>
                      <div className="text-emerald-700 text-[11px] mt-0.5 flex items-center gap-1 font-medium">
                        <Sparkles className="w-3 h-3" />
                        <span>Zero Petrol • Zero Diesel • Zero Smoke</span>
                      </div>
                    </td>
                    <td className="p-3 text-center font-mono">
                      <div className="font-bold text-slate-900">{selectedModel.kva} kVA</div>
                      <div className="text-[11px] text-slate-500">{(selectedModel.continuousWatts / 1000).toFixed(1)} kW Run</div>
                    </td>
                    <td className="p-3 text-center">
                      <span className="font-bold text-emerald-700">0 dB Silent</span>
                    </td>
                    <td className="p-3 text-right font-mono font-bold text-slate-900">
                      {formatNaira(outrightPrice)}
                    </td>
                  </tr>

                  {/* Included Free Accessories */}
                  <tr className="bg-emerald-50/40">
                    <td className="p-3" colSpan={3}>
                      <div className="font-semibold text-emerald-950 flex items-center gap-1.5">
                        <Zap className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Automatic Transfer Switch (ATS) 8ms In-Home Bypass Panel</span>
                      </div>
                      <div className="text-[11px] text-emerald-800">
                        Seamless instant grid-to-EverFlow cutover without power blinks.
                      </div>
                    </td>
                    <td className="p-3 text-right font-bold text-emerald-700">
                      INCLUDED (FREE)
                    </td>
                  </tr>

                  <tr className="bg-emerald-50/40">
                    <td className="p-3" colSpan={3}>
                      <div className="font-semibold text-emerald-950 flex items-center gap-1.5">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                        <span>{selectedModel.warrantyYears}-Year Comprehensive Unit Replacement Warranty & Installation</span>
                      </div>
                      <div className="text-[11px] text-emerald-800">
                        SON Certified 100% replacement guarantee with certified electrical engineer commissioning.
                      </div>
                    </td>
                    <td className="p-3 text-right font-bold text-emerald-700">
                      INCLUDED (FREE)
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Payment Plan Financial Terms */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <span className="text-xs uppercase font-bold text-slate-700 tracking-wider">
                Selected Purchase Structure:
              </span>
              <span className="px-3 py-1 rounded-full bg-emerald-600 text-white font-bold text-xs font-mono uppercase">
                {planType === 'paysmall' ? 'Pay-Small-Small Installment' : 'Outright Purchase'}
              </span>
            </div>

            {planType === 'paysmall' ? (
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-600">Initial Down Payment Deposit ({depositPercent}%):</span>
                  <strong className="text-slate-900 font-mono text-sm">{formatNaira(depositAmount)}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Repayment Duration:</span>
                  <strong className="text-slate-900">{tenureMonths} Months</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Monthly Repayment Installment:</span>
                  <strong className="text-emerald-700 font-mono text-sm">{formatNaira(monthlyInstallment)} / month</strong>
                </div>
                <div className="pt-2 border-t border-slate-200 flex justify-between text-sm">
                  <span className="font-bold text-slate-800">Total Program Investment:</span>
                  <strong className="text-slate-900 font-mono text-base">{formatNaira(totalCost)}</strong>
                </div>
              </div>
            ) : (
              <div className="space-y-2 text-xs">
                <div className="flex justify-between text-sm">
                  <span className="font-bold text-slate-800">Total Outright Investment:</span>
                  <strong className="text-emerald-700 font-mono text-lg">{formatNaira(outrightPrice)}</strong>
                </div>
                <div className="text-[11px] text-slate-500">
                  Includes full outright machine ownership, VAT, logistics insurance, and priority immediate commissioning.
                </div>
              </div>
            )}
          </div>

          {/* Remittance Banking Information for Direct Wire */}
          <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-300 text-xs text-emerald-950 space-y-2">
            <div className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-[11px] text-emerald-900">
              <Building2 className="w-4 h-4 text-emerald-700" />
              <span>Official Corporate Bank Account For Deposit Wire:</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 font-mono text-xs">
              <div className="p-2 rounded-xl bg-white border border-emerald-200">
                <span className="block text-[10px] text-slate-500">Bank:</span>
                <strong className="text-slate-900">Guaranty Trust Bank (GTBank)</strong>
              </div>
              <div className="p-2 rounded-xl bg-white border border-emerald-200">
                <span className="block text-[10px] text-slate-500">Account Name:</span>
                <strong className="text-slate-900 truncate block">EverFlow Energy Technologies Ltd</strong>
              </div>
              <div className="p-2 rounded-xl bg-white border border-emerald-200">
                <span className="block text-[10px] text-slate-500">NUBAN Account:</span>
                <strong className="text-emerald-700 text-sm">0823491029</strong>
              </div>
            </div>
            <p className="text-[11px] text-slate-600 pt-1">
              *Please quote reference <strong className="font-mono text-slate-900">{quoteRef}</strong> in your payment narration or send proof to our Lagos dispatch desk on WhatsApp.
            </p>
          </div>

          {/* Regulatory Seals & Legal Disclaimer */}
          <div className="pt-3 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
            <div className="flex items-center gap-3">
              <span className="px-2 py-1 rounded bg-slate-100 font-mono text-slate-700 font-semibold">
                SONCAP / SON-ENG-9921
              </span>
              <span className="px-2 py-1 rounded bg-slate-100 font-mono text-slate-700 font-semibold">
                NERC Micro-Grid Compliant
              </span>
            </div>
            <div className="text-center sm:text-right">
              Authorized EverFlow Commercial Engineering Directorate
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
