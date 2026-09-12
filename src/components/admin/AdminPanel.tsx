import React, { useState } from 'react';
import { 
  Package, 
  CreditCard, 
  MessageSquare, 
  Store, 
  ShieldCheck, 
  Zap, 
  TrendingUp, 
  Bell, 
  LogOut,
  Sparkles,
  Layers,
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { ProductManager } from './ProductManager';
import { PaymentManager } from './PaymentManager';
import { InquiryManager } from './InquiryManager';
import { formatNaira } from '../../utils/formatters';

export const AdminPanel: React.FC = () => {
  const { 
    products, 
    orders, 
    inquiries, 
    setView, 
    adminTab, 
    setAdminTab 
  } = useStore();

  const pendingOrdersCount = orders.filter((o) => o.status === 'pending_verification').length;
  const newInquiriesCount = inquiries.filter((i) => i.status === 'new').length;

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 flex flex-col font-['Plus_Jakarta_Sans']">
      {/* Top Admin Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Brand & Admin Badge */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 p-0.5 flex items-center justify-center shadow-md shadow-emerald-600/20">
                <div className="w-full h-full rounded-[10px] bg-white flex items-center justify-center">
                  <Zap className="w-5 h-5 text-emerald-600 fill-emerald-600" />
                </div>
              </div>
              <div className="text-left">
                <div className="flex items-center gap-2">
                  <span className="text-lg font-black text-slate-900 font-heading">
                    EverFlow <span className="text-emerald-700">Admin</span>
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-mono font-bold text-[10px] uppercase tracking-wider">
                    Console v2.6
                  </span>
                </div>
                <div className="text-[11px] text-slate-500 font-medium">
                  Inventory, Nigerian Payment Settlements & Customer Inquiries
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats Pill (Desktop) */}
          <div className="hidden md:flex items-center gap-4 text-xs font-semibold">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-50 border border-slate-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-slate-600">Lagos HQ Dispatch: Online</span>
            </div>
          </div>

          {/* Return to Live Store */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setView('store')}
              className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-2 transition-all shadow-sm cursor-pointer"
            >
              <Store className="w-4 h-4 text-emerald-400" />
              <span className="hidden sm:inline">Return to Live Store</span>
              <span className="sm:hidden">Store</span>
            </button>
          </div>
        </div>

        {/* Sub-Header Navigation Tabs */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-slate-100 flex items-center justify-between overflow-x-auto py-2">
          <nav className="flex items-center gap-2">
            {/* Tab 1: Products */}
            <button
              onClick={() => setAdminTab('products')}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                adminTab === 'products'
                  ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/20'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Package className="w-4 h-4" />
              <span>Products & Inventory</span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono ${
                adminTab === 'products' ? 'bg-emerald-800 text-white' : 'bg-slate-200 text-slate-700'
              }`}>
                {products.length}
              </span>
            </button>

            {/* Tab 2: Payments & Orders */}
            <button
              onClick={() => setAdminTab('payments')}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                adminTab === 'payments'
                  ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/20'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <CreditCard className="w-4 h-4" />
              <span>Payments & Reservations</span>
              {pendingOrdersCount > 0 ? (
                <span className="px-2 py-0.5 rounded-full bg-amber-500 text-white text-[10px] font-mono font-bold animate-pulse">
                  {pendingOrdersCount} action
                </span>
              ) : (
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono ${
                  adminTab === 'payments' ? 'bg-emerald-800 text-white' : 'bg-slate-200 text-slate-700'
                }`}>
                  {orders.length}
                </span>
              )}
            </button>

            {/* Tab 3: Messages & Inquiries */}
            <button
              onClick={() => setAdminTab('inquiries')}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                adminTab === 'inquiries'
                  ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/20'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              <span>Customer Inquiries</span>
              {newInquiriesCount > 0 ? (
                <span className="px-2 py-0.5 rounded-full bg-emerald-700 text-white text-[10px] font-mono font-bold">
                  {newInquiriesCount} new
                </span>
              ) : (
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono ${
                  adminTab === 'inquiries' ? 'bg-emerald-800 text-white' : 'bg-slate-200 text-slate-700'
                }`}>
                  {inquiries.length}
                </span>
              )}
            </button>
          </nav>

          <div className="hidden lg:flex items-center gap-2 text-xs text-slate-500">
            <span>Logged in as:</span>
            <span className="font-bold text-slate-800">schiffcompany1@gmail.com</span>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1">
        {adminTab === 'products' && <ProductManager />}
        {adminTab === 'payments' && <PaymentManager />}
        {adminTab === 'inquiries' && <InquiryManager />}
      </main>

      {/* Mini Admin Footer */}
      <footer className="bg-white border-t border-slate-200 py-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>EverFlow Energy Technologies Ltd • CAC Nigeria Registered • Administrative Operations</span>
          <div className="flex items-center gap-4">
            <span className="hover:text-slate-800 cursor-pointer" onClick={() => setView('store')}>
              View Storefront
            </span>
            <span>•</span>
            <span>SON Certified Power Units</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
