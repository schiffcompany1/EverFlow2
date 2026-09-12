import React, { useState, useEffect } from 'react';
import { X, Send, CheckCircle2, MessageSquare, Phone, Mail, User, MapPin, Sparkles, Wrench, ShieldCheck } from 'lucide-react';
import { useStore } from '../context/StoreContext';

interface CustomerInquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialModelInterest?: string;
  initialSubject?: string;
}

export const CustomerInquiryModal: React.FC<CustomerInquiryModalProps> = ({
  isOpen,
  onClose,
  initialModelInterest,
  initialSubject
}) => {
  const { addInquiry, products } = useStore();
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [deliveryCity, setDeliveryCity] = useState('Lagos (Lekki / Ikoyi / VI)');
  const [subject, setSubject] = useState(initialSubject || '');
  const [message, setMessage] = useState('');
  const [modelInterest, setModelInterest] = useState(initialModelInterest || 'EverFlow Prime 7.5');
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (isOpen && initialSubject !== undefined) {
      setSubject(initialSubject);
    }
  }, [isOpen, initialSubject]);

  if (!isOpen) return null;

  const isTechnicalInquiry = subject.toLowerCase().includes('technical');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !customerPhone || !message) return;

    addInquiry({
      customerName,
      customerPhone,
      customerEmail: customerEmail || 'customer@example.com',
      deliveryCity,
      subject: subject.trim() || `Inquiry regarding ${modelInterest}`,
      message,
      modelInterest
    });

    setSubmitted(true);
  };

  const handleResetAndClose = () => {
    setSubmitted(false);
    setCustomerName('');
    setCustomerPhone('');
    setCustomerEmail('');
    setMessage('');
    setSubject('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white rounded-2xl border border-slate-200 shadow-2xl overflow-hidden my-8 text-left">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
              isTechnicalInquiry 
                ? 'bg-amber-50 border border-amber-200 text-amber-600' 
                : 'bg-emerald-50 border border-emerald-200 text-emerald-600'
            }`}>
              {isTechnicalInquiry ? <Wrench className="w-5 h-5" /> : <MessageSquare className="w-5 h-5" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-black text-slate-900 font-heading">
                  {isTechnicalInquiry ? 'Ask a Lead Engineer' : 'Inquire & Speak with an Engineer'}
                </h3>
                {isTechnicalInquiry && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200 uppercase tracking-wider">
                    Technical Desk
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500">
                {isTechnicalInquiry 
                  ? 'Direct consultation with a senior EverFlow power systems & ATS engineer.' 
                  : 'Direct consultation for in-home installation, load audits & financing.'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white border border-slate-200 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitted ? (
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto shadow-sm">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h4 className="text-xl font-bold text-slate-900 font-heading">
                Inquiry Received!
              </h4>
              <p className="text-xs text-slate-600 max-w-sm mx-auto leading-relaxed">
                Thank you, <strong>{customerName}</strong>. Your inquiry has been routed to our technical sales desk. An EverFlow systems engineer will respond via WhatsApp / Phone within 30 minutes.
              </p>
            </div>

            <button
              onClick={handleResetAndClose}
              className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
            >
              Back to Catalog
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Full Name *
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Chief Babatunde Adeleke"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-xs focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  WhatsApp Phone Number *
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="tel"
                    required
                    placeholder="+234 803 123 4567"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-xs focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="email"
                    placeholder="name@company.ng"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-xs focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Delivery City / State
                </label>
                <select
                  value={deliveryCity}
                  onChange={(e) => setDeliveryCity(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-xs focus:outline-none focus:border-emerald-500"
                >
                  <option value="Lagos (Lekki / Ikoyi / VI)">Lagos (Lekki / Ikoyi / VI)</option>
                  <option value="Lagos (Ikeja / Mainland / Magodo)">Lagos (Ikeja / Mainland / Magodo)</option>
                  <option value="Abuja (Maitama / Asokoro / Guzape)">Abuja (Maitama / Asokoro / Guzape)</option>
                  <option value="Port Harcourt (GRA Phase 1 & 2)">Port Harcourt (GRA Phase 1 & 2)</option>
                  <option value="Ibadan (Bodija / Oluyole)">Ibadan (Bodija / Oluyole)</option>
                  <option value="Enugu / Onitsha / Southeast">Enugu / Onitsha / Southeast</option>
                  <option value="Kano / Kaduna / North">Kano / Kaduna / North</option>
                  <option value="Other Location">Other Nigerian Location</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Generator of Interest
                </label>
                <select
                  value={modelInterest}
                  onChange={(e) => setModelInterest(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-xs focus:outline-none focus:border-emerald-500"
                >
                  {products.map((p) => (
                    <option key={p.id} value={p.name}>
                      {p.name} ({p.kva} kVA)
                    </option>
                  ))}
                  <option value="General Consultation / Sizing">Need Help Sizing My House</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Subject
              </label>
              <input
                type="text"
                placeholder="e.g. Sizing inquiry for 3 ACs and deep freezer"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-xs focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Your Question or Installation Requirements *
              </label>
              <textarea
                rows={3}
                required
                placeholder={
                  isTechnicalInquiry
                    ? "Ask your technical question (e.g. quantum resonance harmonics, ATS transfer response, 3-phase balancing, surge currents for heavy inductive loads, or inverter pairing)..."
                    : "Tell us what appliances you want to power, whether you have an existing ATS or solar system, or any questions about Pay-Small-Small..."
                }
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-xs focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-100 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-md shadow-emerald-600/20 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Submit Inquiry</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
