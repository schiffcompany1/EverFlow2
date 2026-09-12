import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  CreditCard, 
  CheckCircle2, 
  Clock, 
  DollarSign, 
  MessageSquare, 
  Phone, 
  Trash2, 
  ExternalLink,
  ChevronRight,
  TrendingUp,
  AlertCircle,
  FileText
} from 'lucide-react';
import { OrderRecord, OrderStatus } from '../../types';
import { formatNaira } from '../../utils/formatters';
import { useStore } from '../../context/StoreContext';
import { PaymentActionModal } from './PaymentActionModal';

export const PaymentManager: React.FC = () => {
  const { orders, updateOrderStatus, deleteOrder } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedOrderForPayment, setSelectedOrderForPayment] = useState<OrderRecord | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Financial KPI computations
  const totalPipeline = orders.reduce((sum, o) => sum + o.totalPrice, 0);

  const totalCollected = orders.reduce((sum, o) => {
    const orderCash = o.transactions.reduce((tSum, t) => tSum + t.amount, 0);
    return sum + orderCash;
  }, 0);

  const totalOutstanding = Math.max(0, totalPipeline - totalCollected);
  const pendingCount = orders.filter((o) => o.status === 'pending_verification').length;
  const activePlanCount = orders.filter((o) => o.status === 'active_installment').length;

  // Filtered orders
  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerPhone.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.modelName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.deliveryCity.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'pending_verification':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-[11px] font-bold">
            <Clock className="w-3 h-3 text-amber-600" /> Pending Verification
          </span>
        );
      case 'deposit_confirmed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-bold">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Deposit Verified
          </span>
        );
      case 'outright_paid':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-[11px] font-bold">
            <CheckCircle2 className="w-3 h-3 text-blue-600" /> Outright Paid 100%
          </span>
        );
      case 'active_installment':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-purple-50 border border-purple-200 text-purple-800 text-[11px] font-bold">
            <CreditCard className="w-3 h-3 text-purple-600" /> Active Pay-Small-Small
          </span>
        );
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 border border-slate-300 text-slate-800 text-[11px] font-bold">
            <CheckCircle2 className="w-3 h-3 text-slate-600" /> Completed
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-800 text-[11px] font-bold">
            <AlertCircle className="w-3 h-3 text-rose-600" /> Cancelled
          </span>
        );
    }
  };

  const openWhatsAppToCustomer = (order: OrderRecord) => {
    const cleanPhone = order.customerPhone.replace(/[^0-9]/g, '');
    const text = `Hello ${order.customerName}! This is the EverFlow Energy Accounts & Dispatch Desk regarding your reservation (${order.id}) for the ${order.modelName}. We are checking in on your order.`;
    window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="space-y-6 text-left">
      {/* Financial KPIs Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Pipeline</span>
            <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-700">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-2xl font-black text-slate-900 font-heading">
              {formatNaira(totalPipeline)}
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">
              {orders.length} total orders across Nigeria
            </div>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">Collected Cash</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-2xl font-black text-emerald-900 font-heading">
              {formatNaira(totalCollected)}
            </div>
            <div className="text-[11px] text-emerald-700 mt-0.5 font-medium">
              Verified in bank accounts
            </div>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Outstanding Installments</span>
            <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center text-purple-700">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-2xl font-black text-purple-900 font-heading">
              {formatNaira(totalOutstanding)}
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">
              {activePlanCount} active Pay-Small-Small contracts
            </div>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Action Needed</span>
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
              pendingCount > 0 ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-500'
            }`}>
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-2xl font-black text-slate-900 font-heading">
              {pendingCount} Pending
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">
              Awaiting transfer verification
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by customer name, phone, order ID, city, or model..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-emerald-500 focus:bg-white"
          />
        </div>

        <div className="flex flex-wrap items-center gap-1 bg-slate-100 p-1 rounded-xl">
          {[
            { id: 'all', label: 'All Orders' },
            { id: 'pending_verification', label: 'Pending' },
            { id: 'deposit_confirmed', label: 'Deposit Paid' },
            { id: 'active_installment', label: 'Active Plan' },
            { id: 'outright_paid', label: 'Outright Paid' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
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

      {/* Orders List / Cards */}
      <div className="space-y-4">
        {filteredOrders.length === 0 ? (
          <div className="bg-white p-12 text-center rounded-2xl border border-slate-200 text-slate-500">
            <FileText className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <div className="text-base font-bold text-slate-800">No orders matching criteria</div>
            <div className="text-xs text-slate-400 mt-1">Try clearing your search query or filters.</div>
          </div>
        ) : (
          filteredOrders.map((order) => {
            const paidTotal = order.transactions.reduce((s, t) => s + t.amount, 0);
            const remainingBalance = Math.max(0, order.totalPrice - paidTotal);

            return (
              <div
                key={order.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:border-slate-300 transition-all space-y-4"
              >
                {/* Header Row */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="font-mono font-bold text-xs bg-slate-900 text-white px-2.5 py-1 rounded-lg">
                      {order.id}
                    </span>
                    {getStatusBadge(order.status)}
                    <span className="text-xs text-slate-400">
                      Placed on {new Date(order.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                  </div>

                  {/* Actions right */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openWhatsAppToCustomer(order)}
                      className="px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                      title="Chat directly on WhatsApp"
                    >
                      <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                      <span>WhatsApp Customer</span>
                    </button>

                    <button
                      onClick={() => setSelectedOrderForPayment(order)}
                      className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                    >
                      <CreditCard className="w-3.5 h-3.5" />
                      <span>Manage Payment</span>
                    </button>

                    {deleteConfirmId === order.id ? (
                      <div className="flex items-center gap-1 bg-rose-50 p-1 rounded-xl border border-rose-200">
                        <button
                          onClick={() => deleteOrder(order.id)}
                          className="px-2 py-1 bg-rose-600 text-white rounded-lg text-[10px] font-bold cursor-pointer"
                        >
                          Confirm
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(null)}
                          className="px-2 py-1 bg-white text-slate-600 rounded-lg text-[10px] font-bold cursor-pointer"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setDeleteConfirmId(order.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                        title="Delete order record"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  {/* Customer Info */}
                  <div className="space-y-1.5 bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Customer Profile</div>
                    <div className="font-bold text-slate-900 text-sm">{order.customerName}</div>
                    <div className="flex items-center gap-1.5 text-slate-600">
                      <Phone className="w-3 h-3 text-emerald-600" />
                      <span>{order.customerPhone}</span>
                    </div>
                    <div className="text-slate-500">{order.deliveryCity}</div>
                    {order.customerEmail && (
                      <div className="text-slate-400 text-[11px] truncate">{order.customerEmail}</div>
                    )}
                  </div>

                  {/* Machine & Plan */}
                  <div className="space-y-1.5 bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Product & Financing</div>
                    <div className="font-bold text-slate-900 text-sm">{order.modelName} ({order.modelKva} kVA)</div>
                    <div className="text-slate-600">
                      Structure: <strong className="text-slate-900 capitalize">{order.planType === 'paysmall' ? 'Pay-Small-Small' : 'Outright Purchase'}</strong>
                    </div>
                    {order.planType === 'paysmall' && (
                      <div className="text-slate-600">
                        {order.depositPercent}% Down ({formatNaira(order.depositAmount)}) • {order.tenureMonths} Months
                      </div>
                    )}
                    <div className="text-slate-500 font-mono">
                      Monthly: {order.monthlyInstallment > 0 ? `${formatNaira(order.monthlyInstallment)} / mo` : '₦0'}
                    </div>
                  </div>

                  {/* Financial Balance & Progress */}
                  <div className="space-y-1.5 bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Settlement Progress</div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-500">Total Price:</span>
                      <span className="font-bold font-mono text-slate-900">{formatNaira(order.totalPrice)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-emerald-700 font-semibold">Cash Collected:</span>
                      <span className="font-bold font-mono text-emerald-700">{formatNaira(paidTotal)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500">Remaining Balance:</span>
                      <span className="font-bold font-mono text-slate-800">{formatNaira(remainingBalance)}</span>
                    </div>
                    {order.planType === 'paysmall' && (
                      <div className="pt-1">
                        <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                          <div
                            className="bg-emerald-600 h-full rounded-full transition-all"
                            style={{
                              width: `${Math.min(100, (paidTotal / order.totalPrice) * 100)}%`
                            }}
                          />
                        </div>
                        <div className="text-[10px] text-slate-500 mt-1 flex justify-between">
                          <span>{order.installmentsPaid} of {order.tenureMonths} Mo Paid</span>
                          <span>{Math.round((paidTotal / order.totalPrice) * 100)}% Paid</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Logged Transactions Table / History */}
                {order.transactions.length > 0 && (
                  <div className="pt-2">
                    <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                      Verified Payment Log ({order.transactions.length} record{order.transactions.length === 1 ? '' : 's'})
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs border border-slate-200 rounded-xl overflow-hidden">
                        <thead className="bg-slate-50 text-slate-600 font-semibold">
                          <tr>
                            <th className="py-2 px-3">Date</th>
                            <th className="py-2 px-3">Type</th>
                            <th className="py-2 px-3">Amount</th>
                            <th className="py-2 px-3">Reference</th>
                            <th className="py-2 px-3">Channel</th>
                            <th className="py-2 px-3">Note</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-slate-700">
                          {order.transactions.map((tx) => (
                            <tr key={tx.id} className="hover:bg-slate-50/60">
                              <td className="py-2 px-3 font-mono text-slate-500">{tx.date}</td>
                              <td className="py-2 px-3 capitalize font-medium text-emerald-800">
                                {tx.type.replace('_', ' ')}
                              </td>
                              <td className="py-2 px-3 font-bold font-mono text-slate-900">
                                {formatNaira(tx.amount)}
                              </td>
                              <td className="py-2 px-3 font-mono text-slate-500 text-[11px]">
                                {tx.referenceNumber}
                              </td>
                              <td className="py-2 px-3 text-slate-600">{tx.paymentMethod}</td>
                              <td className="py-2 px-3 text-slate-500 italic truncate max-w-xs">
                                {tx.notes || '—'}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Payment Action Modal */}
      <PaymentActionModal
        isOpen={Boolean(selectedOrderForPayment)}
        onClose={() => setSelectedOrderForPayment(null)}
        order={selectedOrderForPayment}
        onSavePayment={updateOrderStatus}
      />
    </div>
  );
};
