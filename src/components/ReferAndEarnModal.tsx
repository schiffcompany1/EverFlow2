import React, { useState, useEffect } from 'react';
import { 
  X, 
  Gift, 
  Copy, 
  Check, 
  Share2, 
  Sparkles, 
  Wallet, 
  ShieldCheck, 
  ArrowRight, 
  Users, 
  Building2, 
  CheckCircle2, 
  HelpCircle,
  ExternalLink,
  DollarSign
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface ReferAndEarnModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const NIGERIAN_BANKS = [
  'Guaranty Trust Bank (GTBank)',
  'Zenith Bank',
  'Access Bank',
  'First Bank of Nigeria',
  'United Bank for Africa (UBA)',
  'Kuda Microfinance Bank',
  'Stanbic IBTC Bank',
  'Fidelity Bank',
  'Sterling Bank',
  'Wema Bank / ALAT'
];

export const ReferAndEarnModal: React.FC<ReferAndEarnModalProps> = ({ isOpen, onClose }) => {
  const [userName, setUserName] = useState<string>(() => {
    return localStorage.getItem('everflow_ambassador_name') || '';
  });
  const [userPhone, setUserPhone] = useState<string>(() => {
    return localStorage.getItem('everflow_ambassador_phone') || '';
  });
  const [selectedBank, setSelectedBank] = useState<string>(() => {
    return localStorage.getItem('everflow_ambassador_bank') || NIGERIAN_BANKS[0];
  });
  const [accountNumber, setAccountNumber] = useState<string>(() => {
    return localStorage.getItem('everflow_ambassador_account') || '';
  });

  const [referralCode, setReferralCode] = useState<string>(() => {
    return localStorage.getItem('everflow_referral_code') || 'EF-AMB-8842';
  });
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [hasGenerated, setHasGenerated] = useState<boolean>(() => {
    return !!localStorage.getItem('everflow_referral_code');
  });

  useEffect(() => {
    if (isCopied) {
      const timer = setTimeout(() => setIsCopied(false), 2500);
      return () => clearTimeout(timer);
    }
  }, [isCopied]);

  if (!isOpen) return null;

  const referralUrl = `https://everflowenergy.ng/ref/${referralCode}`;

  const handleGenerateLink = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanName = userName.trim().toUpperCase().replace(/[^A-Z]/g, '').slice(0, 7) || 'AMB';
    const randNum = Math.floor(100 + Math.random() * 900);
    const newCode = `EF-${cleanName}-${randNum}`;

    setReferralCode(newCode);
    setHasGenerated(true);

    try {
      localStorage.setItem('everflow_ambassador_name', userName);
      localStorage.setItem('everflow_ambassador_phone', userPhone);
      localStorage.setItem('everflow_ambassador_bank', selectedBank);
      localStorage.setItem('everflow_ambassador_account', accountNumber);
      localStorage.setItem('everflow_referral_code', newCode);
    } catch {
      // ignore
    }

    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 }
      });
    } catch {
      // ignore
    }
  };

  const handleCopyLink = async () => {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(referralUrl);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = referralUrl;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      setIsCopied(true);
      try {
        confetti({
          particleCount: 30,
          spread: 45,
          origin: { y: 0.7 }
        });
      } catch {
        // ignore
      }
    } catch (err) {
      console.error('Failed to copy link', err);
    }
  };

  const shareText = `Hello! I switched to an EverFlow fuel-free, zero-noise quantum generator in Nigeria. Say goodbye to petrol/diesel queues, toxic fumes, and noisy nights. Use my referral link to get 5% OFF or ₦50,000 credit plus FREE ATS Installation: ${referralUrl}`;

  const handleWhatsAppShare = () => {
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleTwitterShare = () => {
    const tweet = `Ditching noisy diesel generators in Nigeria for zero-decibel perpetual power! Get 5% off an EverFlow quantum generator with my referral link: ${referralUrl} #EverFlowEnergy #ZeroNoiseNigeria`;
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweet)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div 
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-emerald-100 overflow-hidden text-left my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Glow Banner */}
        <div className="bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 p-6 sm:p-8 text-white relative overflow-hidden">
          {/* Ambient Glows */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />

          {/* Close button */}
          <button 
            onClick={onClose}
            className="absolute top-5 right-5 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-bold uppercase tracking-wider mb-3">
            <Gift className="w-3.5 h-3.5 text-emerald-400" />
            <span>EverFlow Ambassador Programme</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black font-heading tracking-tight text-white">
            Refer & Earn Up to <span className="text-emerald-400">₦150,000 Cash</span>
          </h2>

          <p className="text-sm text-slate-300 mt-2 max-w-lg leading-relaxed">
            Empower friends, family, and estates across Nigeria with fuel-free 0 dB silent power. 
            Receive direct bank payout within 48 hours of their unit commissioning.
          </p>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 space-y-6 max-h-[75vh] overflow-y-auto">
          
          {/* Three-Tier Rewards Card */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-left">
              <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Residential Unit</div>
              <div className="text-lg font-black text-slate-900 font-heading mt-0.5">₦100,000</div>
              <div className="text-[11px] text-emerald-700 font-semibold mt-0.5">Solo 3.5 & Prime 7.5</div>
            </div>

            <div className="p-3.5 rounded-2xl bg-emerald-50/80 border border-emerald-300 text-left relative overflow-hidden">
              <span className="absolute top-2 right-2 text-[9px] bg-emerald-600 text-white font-black px-1.5 py-0.5 rounded uppercase">
                Popular
              </span>
              <div className="text-[11px] font-bold text-emerald-900 uppercase tracking-wider">Villa & Duplex</div>
              <div className="text-lg font-black text-emerald-800 font-heading mt-0.5">₦150,000</div>
              <div className="text-[11px] text-emerald-700 font-semibold mt-0.5">Duo 15 & Trio 30</div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-left">
              <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Commercial Plant</div>
              <div className="text-lg font-black text-slate-900 font-heading mt-0.5">₦250,000</div>
              <div className="text-[11px] text-emerald-700 font-semibold mt-0.5">Mega 60 & Custom</div>
            </div>
          </div>

          {/* Referred Friend Benefit Banner */}
          <div className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200 flex items-center gap-3 text-xs text-amber-900">
            <Sparkles className="w-5 h-5 text-amber-600 shrink-0" />
            <div>
              <strong>What your friend gets:</strong> 5% instant discount on outright purchase or ₦50,000 deposit credit, plus <strong>FREE Automatic Transfer Switch (ATS)</strong> and VIP priority installation.
            </div>
          </div>

          {/* Section: Generate or Show Link */}
          {!hasGenerated ? (
            <form onSubmit={handleGenerateLink} className="space-y-4 pt-2">
              <div className="text-sm font-bold text-slate-900">
                Step 1: Enter Your Details to Create Your Referral Link
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Chief Tunde Balogun"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    WhatsApp / Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. 0803 123 4567"
                    value={userPhone}
                    onChange={(e) => setUserPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Payout Bank (For Direct Cash Deposit)
                  </label>
                  <select
                    value={selectedBank}
                    onChange={(e) => setSelectedBank(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                  >
                    {NIGERIAN_BANKS.map((b) => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    NUBAN Account Number
                  </label>
                  <input
                    type="text"
                    maxLength={10}
                    placeholder="10-digit NUBAN (e.g. 0123456789)"
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm tracking-wide shadow-lg shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>Generate My Unique Referral Link</span>
              </button>
            </form>
          ) : (
            <div className="space-y-5 pt-2">
              
              {/* Unique Link Display */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold uppercase tracking-wider text-slate-700">
                    Your Personalized Referral Link:
                  </span>
                  <span className="text-emerald-700 font-mono font-bold">
                    Code: {referralCode}
                  </span>
                </div>

                <div className="flex items-center gap-2 p-2 rounded-2xl bg-slate-50 border border-slate-300">
                  <input 
                    type="text"
                    readOnly
                    value={referralUrl}
                    className="w-full bg-transparent px-2 text-xs sm:text-sm font-mono text-slate-800 select-all outline-none font-semibold"
                  />
                  <button
                    id="btn-copy-referral-link"
                    onClick={handleCopyLink}
                    className={`px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer shrink-0 ${
                      isCopied 
                        ? 'bg-emerald-600 text-white shadow-md' 
                        : 'bg-slate-900 hover:bg-slate-800 text-white'
                    }`}
                  >
                    {isCopied ? (
                      <>
                        <Check className="w-4 h-4 text-white" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        <span>Copy Link</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Instant Social Share Buttons */}
              <div className="space-y-2">
                <div className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Quick Share to Friends & Estates:
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    id="btn-share-whatsapp"
                    onClick={handleWhatsAppShare}
                    className="p-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-900 font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    <Share2 className="w-4 h-4 text-emerald-600" />
                    <span>Share on WhatsApp</span>
                  </button>

                  <button
                    id="btn-share-twitter"
                    onClick={handleTwitterShare}
                    className="p-3 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-800 font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    <Share2 className="w-4 h-4 text-slate-700" />
                    <span>Share on X / Twitter</span>
                  </button>
                </div>
              </div>

              {/* Ambassador Progress Snapshot */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-2.5">
                <div className="flex items-center justify-between font-bold text-slate-900">
                  <span className="flex items-center gap-1.5">
                    <Wallet className="w-4 h-4 text-emerald-600" />
                    <span>Direct Bank Deposit Target</span>
                  </span>
                  <span className="text-emerald-700 font-mono">
                    {accountNumber ? `${selectedBank.split(' ')[0]} ••••${accountNumber.slice(-4)}` : 'Bank Not Linked'}
                  </span>
                </div>
                <p className="text-[11px] leading-relaxed text-slate-500">
                  Whenever an estate neighbor or business places an order using your link or quotes code <strong className="text-slate-800">{referralCode}</strong>, your bonus is locked in and dispatched via NIP transfer upon delivery inspection.
                </p>
                <div className="pt-1 flex items-center gap-2 text-[11px] text-emerald-700 font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Verified 48-Hour Payout SLA</span>
                </div>
              </div>

              {/* Reset / Edit Details */}
              <div className="flex items-center justify-between text-xs pt-1">
                <button
                  onClick={() => setHasGenerated(false)}
                  className="text-slate-500 hover:text-slate-800 underline cursor-pointer"
                >
                  Edit name or banking details
                </button>
                <button
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold cursor-pointer"
                >
                  Done
                </button>
              </div>

            </div>
          )}

          {/* Simple How it Works Accordion / Bullets */}
          <div className="pt-2 border-t border-slate-100 text-xs text-slate-500 space-y-2">
            <div className="font-bold text-slate-700 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>How EverFlow Ambassador Payouts Work:</span>
            </div>
            <ul className="list-disc pl-5 space-y-1 text-[11px] text-slate-600">
              <li>Share your link with landlords, business owners, or resident estate associations.</li>
              <li>Your referee receives a 5% discount or ₦50,000 credit on their selected generator.</li>
              <li>Once our field engineering team commissions their unit, your cash reward is credited directly to your bank account.</li>
            </ul>
          </div>

        </div>

      </div>
    </div>
  );
};
