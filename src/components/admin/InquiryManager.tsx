import React, { useState } from 'react';
import { 
  MessageSquare, 
  Search, 
  Send, 
  CheckCircle2, 
  Clock, 
  Phone, 
  Mail, 
  MapPin, 
  Sparkles, 
  ExternalLink,
  ChevronDown,
  User,
  Zap,
  CornerDownRight
} from 'lucide-react';
import { CustomerInquiry } from '../../types';
import { useStore } from '../../context/StoreContext';

const QUICK_TEMPLATES = [
  {
    title: 'Pay-Small-Small Requirements',
    content: 'Good day! Thank you for contacting EverFlow Energy. To proceed with your Pay-Small-Small plan, we require: 1) Valid Nigerian ID (NIN, Drivers License, or Int\'l Passport), 2) 3 months bank statement, and 3) Utility bill for your delivery address. You can complete your 20% down payment deposit directly to lock in today\'s price.'
  },
  {
    title: 'Site Inspection & ATS Changeover',
    content: 'Hello! Our Senior Power Systems Engineers provide complimentary in-home site inspection across Lagos, Abuja, and Port Harcourt. We assess your changeover switch, balance load across phases, and guarantee seamless zero-flicker transfer. What day and time suits you best for our engineer to visit?'
  },
  {
    title: 'Solar Inverter Coexistence',
    content: 'Greetings! EverFlow generators synchronize smoothly with existing solar inverters and lithium battery storage. Because EverFlow generates a clean 50.0Hz pure sine wave with <1.5% THD, it will power your heavy inductive loads (like ACs and water pumps) while safely maintaining your battery bank without back-feeding.'
  },
  {
    title: 'Commercial / Industrial Delivery',
    content: 'Hello! For commercial and 3-phase industrial installations (15 kVA and 50 kVA Titan units), we include comprehensive on-site commissioning, cold-chassis thermal telemetry, and emergency technician dispatch. Our corporate financing desk is ready to approve your flexible installment terms within 24 hours.'
  }
];

export const InquiryManager: React.FC = () => {
  const { inquiries, replyToInquiry, updateInquiryStatus } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'new' | 'in_progress' | 'replied' | 'closed'>('all');
  const [selectedInquiryId, setSelectedInquiryId] = useState<string>(inquiries[0]?.id || '');
  
  const [replyText, setReplyText] = useState('');
  const [authorName, setAuthorName] = useState('EverFlow Technical Support');
  const [sendChannel, setSendChannel] = useState<'whatsapp' | 'email' | 'portal'>('whatsapp');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const filteredInquiries = inquiries.filter((inq) => {
    const matchesSearch =
      inq.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inq.customerPhone.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inq.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inq.message.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || inq.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const activeInquiry = inquiries.find((i) => i.id === selectedInquiryId) || filteredInquiries[0];

  const handleApplyTemplate = (content: string) => {
    setReplyText(content);
  };

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeInquiry || !replyText.trim()) return;

    // Save reply to store
    replyToInquiry(activeInquiry.id, replyText.trim(), sendChannel, authorName);

    if (sendChannel === 'whatsapp') {
      const cleanPhone = activeInquiry.customerPhone.replace(/[^0-9]/g, '');
      const waText = `Hello ${activeInquiry.customerName}! ⚡\n\n${replyText.trim()}\n\n— ${authorName}, EverFlow Energy Nigeria`;
      window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(waText)}`, '_blank');
      showToast('Reply logged and WhatsApp chat opened!');
    } else if (sendChannel === 'email') {
      const mailtoUrl = `mailto:${activeInquiry.customerEmail}?subject=${encodeURIComponent(`Re: ${activeInquiry.subject}`)}&body=${encodeURIComponent(replyText.trim())}`;
      window.open(mailtoUrl, '_blank');
      showToast('Reply logged and Email client launched!');
    } else {
      showToast('Reply saved to internal customer thread!');
    }

    setReplyText('');
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  return (
    <div className="space-y-6 text-left">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-xl border border-emerald-500/40 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Search and Stats */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search inquiries by customer name, phone, or question..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-emerald-500 focus:bg-white"
          />
        </div>

        <div className="flex flex-wrap items-center gap-1 bg-slate-100 p-1 rounded-xl">
          {[
            { id: 'all', label: 'All Inquiries' },
            { id: 'new', label: 'New Unread' },
            { id: 'in_progress', label: 'In Progress' },
            { id: 'replied', label: 'Replied' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id as any)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                statusFilter === tab.id
                  ? 'bg-white text-emerald-800 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Two-Column View: Inquiries List & Reply Thread */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Messages Feed */}
        <div className="lg:col-span-5 space-y-3">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider px-1">
            Customer Inquiries ({filteredInquiries.length})
          </div>

          {filteredInquiries.length === 0 ? (
            <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 text-slate-400 text-xs">
              No inquiries found for this filter.
            </div>
          ) : (
            <div className="space-y-2.5 max-h-[720px] overflow-y-auto pr-1">
              {filteredInquiries.map((inq) => {
                const isSelected = activeInquiry?.id === inq.id;
                return (
                  <div
                    key={inq.id}
                    onClick={() => setSelectedInquiryId(inq.id)}
                    className={`p-4 rounded-2xl border text-left cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-emerald-50/70 border-2 border-emerald-500 shadow-xs'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 text-xs truncate">
                          {inq.customerName}
                        </span>
                        {inq.status === 'new' && (
                          <span className="px-2 py-0.5 rounded-full bg-emerald-600 text-white font-bold text-[9px] uppercase tracking-wider">
                            New
                          </span>
                        )}
                        {inq.status === 'replied' && (
                          <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-semibold text-[9px]">
                            Replied
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono shrink-0">
                        {new Date(inq.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                      </span>
                    </div>

                    <div className="font-semibold text-slate-800 text-xs mb-1 truncate">
                      {inq.subject}
                    </div>

                    <p className="text-slate-500 text-[11px] line-clamp-2 leading-relaxed">
                      {inq.message}
                    </p>

                    <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
                      <span className="text-emerald-700 font-medium truncate max-w-[160px]">
                        {inq.modelInterest || 'General Inquiry'}
                      </span>
                      <span>{inq.replies.length} response{inq.replies.length === 1 ? '' : 's'}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Column: Detail View & Reply Composer */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          {activeInquiry ? (
            <div className="divide-y divide-slate-100">
              {/* Header Details */}
              <div className="p-6 bg-slate-50/80">
                <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold bg-slate-900 text-white px-2.5 py-1 rounded-lg">
                      {activeInquiry.id}
                    </span>
                    <select
                      value={activeInquiry.status}
                      onChange={(e) => updateInquiryStatus(activeInquiry.id, e.target.value as any)}
                      className="px-2.5 py-1 rounded-lg border border-slate-300 text-xs font-bold bg-white text-slate-700 focus:outline-none focus:border-emerald-500"
                    >
                      <option value="new">🔴 Status: New (Unread)</option>
                      <option value="in_progress">🟡 Status: In Progress</option>
                      <option value="replied">🟢 Status: Replied</option>
                      <option value="closed">⚪ Status: Closed</option>
                    </select>
                  </div>

                  <span className="text-xs text-slate-400">
                    Received {new Date(activeInquiry.createdAt).toLocaleString()}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-slate-900 font-heading leading-tight mb-2">
                  {activeInquiry.subject}
                </h3>

                {/* Customer Contact Badges */}
                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 pt-1">
                  <div className="flex items-center gap-1.5 font-bold text-slate-900">
                    <User className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{activeInquiry.customerName}</span>
                  </div>

                  <a
                    href={`tel:${activeInquiry.customerPhone}`}
                    className="flex items-center gap-1.5 hover:text-emerald-700"
                  >
                    <Phone className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{activeInquiry.customerPhone}</span>
                  </a>

                  <a
                    href={`mailto:${activeInquiry.customerEmail}`}
                    className="flex items-center gap-1.5 hover:text-emerald-700"
                  >
                    <Mail className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{activeInquiry.customerEmail}</span>
                  </a>

                  {activeInquiry.deliveryCity && (
                    <div className="flex items-center gap-1.5 text-slate-500">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>{activeInquiry.deliveryCity}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Customer Original Question */}
              <div className="p-6 space-y-2">
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Customer Message:
                </div>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-sm leading-relaxed whitespace-pre-wrap">
                  {activeInquiry.message}
                </div>
              </div>

              {/* Reply Thread History */}
              {activeInquiry.replies.length > 0 && (
                <div className="p-6 space-y-3 bg-slate-50/40">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Response History ({activeInquiry.replies.length}):
                  </div>

                  <div className="space-y-3">
                    {activeInquiry.replies.map((rep) => (
                      <div key={rep.id} className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-200 space-y-1.5">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-emerald-900 flex items-center gap-1.5">
                            <CornerDownRight className="w-3.5 h-3.5 text-emerald-600" />
                            {rep.author}
                          </span>
                          <span className="text-[10px] text-emerald-700 font-mono">
                            Sent via {rep.channel.toUpperCase()} • {new Date(rep.timestamp).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-wrap">
                          {rep.content}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Reply Composer Form */}
              <form onSubmit={handleSendReply} className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                    <Send className="w-3.5 h-3.5 text-emerald-600" /> Compose Direct Reply
                  </span>

                  {/* Channel select */}
                  <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg text-xs">
                    <button
                      type="button"
                      onClick={() => setSendChannel('whatsapp')}
                      className={`px-2.5 py-1 rounded font-semibold transition-all cursor-pointer ${
                        sendChannel === 'whatsapp'
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      WhatsApp Direct
                    </button>
                    <button
                      type="button"
                      onClick={() => setSendChannel('email')}
                      className={`px-2.5 py-1 rounded font-semibold transition-all cursor-pointer ${
                        sendChannel === 'email'
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Email
                    </button>
                    <button
                      type="button"
                      onClick={() => setSendChannel('portal')}
                      className={`px-2.5 py-1 rounded font-semibold transition-all cursor-pointer ${
                        sendChannel === 'portal'
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      Internal Note
                    </button>
                  </div>
                </div>

                {/* Quick Templates Bar */}
                <div className="space-y-1">
                  <div className="text-[10px] text-slate-400 font-semibold uppercase">
                    Insert Quick Response Template:
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {QUICK_TEMPLATES.map((tmpl, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleApplyTemplate(tmpl.content)}
                        className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-emerald-50 hover:text-emerald-800 text-slate-700 border border-slate-200 transition-colors cursor-pointer"
                      >
                        + {tmpl.title}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Textarea */}
                <div>
                  <textarea
                    rows={4}
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder={`Type your reply to ${activeInquiry.customerName}...`}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-xs focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                    required
                  />
                </div>

                {/* Footer Send */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <span className="text-[11px] text-slate-400">Replying as:</span>
                    <input
                      type="text"
                      value={authorName}
                      onChange={(e) => setAuthorName(e.target.value)}
                      className="px-2.5 py-1 rounded-lg border border-slate-300 text-xs text-slate-700 w-44"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>
                      {sendChannel === 'whatsapp' 
                        ? 'Send via WhatsApp' 
                        : sendChannel === 'email' 
                        ? 'Send via Email' 
                        : 'Save Internal Reply'}
                    </span>
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="p-12 text-center text-slate-400 text-xs">
              Select an inquiry on the left to view questions and reply.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
