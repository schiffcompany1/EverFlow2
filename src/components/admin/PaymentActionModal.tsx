import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, DollarSign, CreditCard, Shield, AlertCircle, Calendar } from 'lucide-react';
import { OrderRecord, OrderStatus, PaymentTransaction } from '../../types';
import { formatNaira } from '../../utils/formatters';

interface PaymentActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: OrderRecord | null;
  onSavePayment: (
    orderId: string,
    newStatus: OrderStatus,
    paymentDetails?: {
      amount?: number;
      type?: PaymentTransaction['type'];
      referenceNumber?: string;
      paymentMethod?: string;
      notes?: string;
      markInstallmentPaid?: boolean;
    }
  ) => void;
}

const PAYMENT_METHODS = [
  'Bank Transfer (Guaranty Trust Bank)',
  'Bank Transfer (Zenith Bank NIP)',
  'Bank Transfer (First Bank of Nigeria)',
  'Bank Transfer (Access Bank)',
  'Paystack Online Gateway',
  'Flutterwave Direct Settlement',
  'Corporate Cheque / Bank Draft',
  'POS Terminal'
];

export const PaymentActionModal: React.FC<PaymentActionModalProps> = ({
  isOpen,
  onClose,
  order,
  onSavePayment
}) => {
  if (!isOpen || !order) return null;

  const [targetStatus, setTargetStatus] = useState<OrderStatus>(order.status);
  const [amount, setAmount] = useState<number>(0);
  const [paymentType, setPaymentType] = useState<PaymentTransaction['type']>('deposit');
  const [referenceNumber, setReferenceNumber] = useState('');
  const [paymentMethod, setPaymentMethod] = useState(PAYMENT_METHODS[0]);
  const [notes, setNotes] = useState('');
  const [recordTransaction, setRecordTransaction] = useState(true);

  useEffect(() => {
    if (order) {
      setTargetStatus(order.status);
      setReferenceNumber(`REF-${Math.floor(100000 + Math.random() * 900000)}`);
      
      if (order.status === 'pending_verification') {
        if (order.planType === 'outright') {
          setPaymentType('outright_full');
          setAmount(order.totalPrice);
          setTargetStatus('outright_paid');
        } else {
          setPaymentType('deposit');
          setAmount(order.depositAmount);
          setTargetStatus('deposit_confirmed');
        }
      } else if (order.status === 'deposit_confirmed' || order.status === 'active_installment') {
        setPaymentType('installment');
        setAmount(order.monthlyInstallment);
        setTargetStatus('active_installment');
      } else {
        setAmount(0);
      }
    }
  }, [order, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    onSavePayment(order.id, targetStatus, recordTransaction && amount > 0 ? {
      amount: Number(amount),
      type: paymentType,
      referenceNumber: referenceNumber.trim() || `REF-${Date.now()}`,
      paymentMethod,
      notes: notes.trim(),
      markInstallmentPaid: paymentType === 'installment'
    } : undefined);

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-white rounded-2xl border border-slate-200 shadow-2xl overflow-hidden my-8 text-left">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900 font-heading">
                Manage Payment: {order.id}
              </h3>
              <p className="text-xs text-slate-500">
                Customer: <span className="font-semibold text-slate-800">{order.customerName}</span> ({order.deliveryCity})
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

        {/* Order summary card */}
        <div className="p-4 mx-6 mt-5 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
          <div className="flex justify-between">
            <span className="text-slate-500">Model Reserved:</span>
            <span className="font-bold text-slate-900">{order.modelName} ({order.modelKva} kVA)</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Total Purchase Value:</span>
            <span className="font-bold font-mono text-slate-900">{formatNaira(order.totalPrice)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Plan Option:</span>
            <span className="font-bold text-emerald-700 capitalize">
              {order.planType === 'paysmall' 
                ? `Pay-Small-Small (${order.depositPercent}% Down, ${order.tenureMonths} Mo)` 
                : '100% Outright Purchase'}
            </span>
          </div>
          {order.planType === 'paysmall' && (
            <div className="flex justify-between pt-1 border-t border-slate-200">
              <span className="text-slate-500">Installment Progress:</span>
              <span className="font-mono font-bold text-slate-800">
                {order.installmentsPaid} of {order.tenureMonths} Months Settled
              </span>
            </div>
          )}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Update Order Status
            </label>
            <select
              value={targetStatus}
              onChange={(e) => setTargetStatus(e.target.value as OrderStatus)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-sm focus:outline-none focus:border-emerald-500 font-semibold"
            >
              <option value="pending_verification">⏳ Pending Bank Verification</option>
              <option value="deposit_confirmed">✅ Deposit Confirmed (Scheduled for Dispatch)</option>
              <option value="outright_paid">🌟 100% Outright Paid in Full</option>
              <option value="active_installment">💳 Active Pay-Small-Small Plan</option>
              <option value="completed">🏆 Completed & Fully Paid Off</option>
              <option value="cancelled">❌ Cancelled Order</option>
            </select>
          </div>

          {/* Record Transaction Checkbox */}
          <div className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-200 space-y-4">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="recordTx"
                checked={recordTransaction}
                onChange={(e) => setRecordTransaction(e.target.checked)}
                className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500"
              />
              <label htmlFor="recordTx" className="text-xs font-bold text-slate-800 cursor-pointer">
                Log New Payment Transaction Entry
              </label>
            </div>

            {recordTransaction && (
              <div className="space-y-3 pt-2">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">
                      Payment Type
                    </label>
                    <select
                      value={paymentType}
                      onChange={(e) => setPaymentType(e.target.value as any)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-900 text-xs focus:outline-none focus:border-emerald-500"
                    >
                      <option value="deposit">Initial Down Payment Deposit</option>
                      <option value="installment">Monthly Installment</option>
                      <option value="outright_full">100% Full Outright Balance</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">
                      Amount Received (₦) *
                    </label>
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(parseInt(e.target.value) || 0)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-900 text-xs font-mono font-bold focus:outline-none focus:border-emerald-500"
                      required
                    />
                    <div className="text-[10px] text-emerald-700 font-semibold mt-0.5">
                      {formatNaira(amount)}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">
                      Payment Method
                    </label>
                    <select
                      value={paymentMethod}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-900 text-xs focus:outline-none focus:border-emerald-500"
                    >
                      {PAYMENT_METHODS.map((m) => (
                        <option key={m} value={m}>{m}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">
                      Bank Ref / Session ID
                    </label>
                    <input
                      type="text"
                      value={referenceNumber}
                      onChange={(e) => setReferenceNumber(e.target.value)}
                      placeholder="e.g. GTB-NIP-998821"
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-900 text-xs font-mono focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">
                    Internal Verification Note
                  </label>
                  <input
                    type="text"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="e.g. Bank credit alert confirmed by accounts department."
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-slate-900 text-xs focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-100 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-md shadow-emerald-600/20 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Save & Update Order</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
