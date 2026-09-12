/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { PaySmallSmallCalculator } from './components/PaySmallSmallCalculator';
import { ProductCatalog } from './components/ProductCatalog';
import { ComparisonMatrix } from './components/ComparisonMatrix';
import { EnergySizer } from './components/EnergySizer';
import { TechnologyExplainer } from './components/TechnologyExplainer';
import { NigeriaDeploymentMap } from './components/NigeriaDeploymentMap';
import { CustomerProof } from './components/CustomerProof';
import { FAQSection } from './components/FAQSection';
import { Footer } from './components/Footer';
import { MobileActionBar } from './components/MobileActionBar';
import { ReservationDrawer } from './components/ReservationDrawer';
import { CustomerInquiryModal } from './components/CustomerInquiryModal';
import { ReferAndEarnModal } from './components/ReferAndEarnModal';
import { QuickChatWidget } from './components/QuickChatWidget';
import { AdminPanel } from './components/admin/AdminPanel';
import { StoreProvider, useStore } from './context/StoreContext';
import { ProductModel } from './types';

function StorefrontApp() {
  const { 
    view, 
    products, 
    isCustomerInquiryModalOpen, 
    setIsCustomerInquiryModalOpen,
    inquiryInitialSubject,
    currentProductView,
    setCurrentProductView,
    isReferralModalOpen,
    setIsReferralModalOpen
  } = useStore();

  const [selectedModel, setSelectedModel] = useState<ProductModel>(currentProductView || products[0]);
  const [depositPercent, setDepositPercent] = useState<number>(30);
  const [tenureMonths, setTenureMonths] = useState<number>(6);
  const [planType, setPlanType] = useState<'paysmall' | 'outright'>('paysmall');
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [calculatorModelId, setCalculatorModelId] = useState<string>(products[0]?.id || 'solo-3-5');

  // Keep selectedModel synced with currentProductView and products
  React.useEffect(() => {
    if (currentProductView && currentProductView.id !== selectedModel.id) {
      setSelectedModel(currentProductView);
    }
  }, [currentProductView]);

  React.useEffect(() => {
    if (!products.some((m) => m.id === selectedModel.id) && products.length > 0) {
      setSelectedModel(products[0]);
      setCurrentProductView(products[0]);
    }
  }, [products, selectedModel.id, setCurrentProductView]);

  // Handlers
  const handleOpenReservation = (model?: ProductModel) => {
    if (model) {
      setSelectedModel(model);
      setCurrentProductView(model);
    }
    setIsDrawerOpen(true);
  };

  const handleOpenCalculator = (model?: ProductModel) => {
    if (model) {
      setSelectedModel(model);
      setCurrentProductView(model);
      setCalculatorModelId(model.id);
    }
    const el = document.getElementById('calculator');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleStartPlanFromCalculator = (
    model: ProductModel,
    deposit: number,
    tenure: number
  ) => {
    setSelectedModel(model);
    setDepositPercent(deposit);
    setTenureMonths(tenure);
    setPlanType('paysmall');
    setIsDrawerOpen(true);
  };

  const handleSelectFromCatalog = (model: ProductModel, mode: 'outright' | 'paysmall') => {
    setSelectedModel(model);
    setPlanType(mode);
    setIsDrawerOpen(true);
  };

  const handleSelectRecommendedFromSizer = (model: ProductModel) => {
    setSelectedModel(model);
    setCalculatorModelId(model.id);
    setPlanType('paysmall');
    setIsDrawerOpen(true);
  };

  // If user navigated to Admin Panel, render admin workspace
  if (view === 'admin') {
    return <AdminPanel />;
  }

  return (
    <div className="min-h-screen bg-white text-slate-700 relative selection:bg-emerald-500 selection:text-white font-['Plus_Jakarta_Sans'] bg-cyber-grid">
      {/* Background ambient radial gradients */}
      <div className="fixed inset-0 bg-radial-vignette pointer-events-none -z-10" />

      {/* Sticky Header */}
      <Header
        onOpenReservation={handleOpenReservation}
        selectedModel={selectedModel}
        cartCount={1}
      />

      {/* Main Page Flow */}
      <main>
        {/* Hero Section */}
        <Hero
          onOpenCalculator={handleOpenCalculator}
          onOpenReservation={handleOpenReservation}
          defaultModel={selectedModel}
        />

        {/* Section C: Interactive "Pay-Small-Small" Calculator Widget */}
        <PaySmallSmallCalculator
          onStartPlan={handleStartPlanFromCalculator}
          selectedModelId={calculatorModelId}
        />

        {/* Section D: Product Catalog (Glass Cards) */}
        <ProductCatalog
          onSelectModel={handleSelectFromCatalog}
          onOpenCalculatorWithModel={handleOpenCalculator}
        />

        {/* Section F: Interactive Power Sizing Tool (Load Calculator) */}
        <EnergySizer
          onSelectRecommendedModel={handleSelectRecommendedFromSizer}
        />

        {/* Section E: "Why EverFlow?" Comparison Matrix & Fuel Waste Simulator */}
        <ComparisonMatrix />

        {/* Technology Science Explainer */}
        <TechnologyExplainer />

        {/* Interactive Nigeria Deployment Map */}
        <NigeriaDeploymentMap />

        {/* Verified Customer Proof & Nigerian Case Studies */}
        <CustomerProof />

        {/* FAQs & Guarantees */}
        <FAQSection />
      </main>

      {/* Footer */}
      <Footer />

      {/* Mobile Floating Action Bar */}
      <MobileActionBar
        onOpenReservation={() => handleOpenReservation(selectedModel)}
        selectedModel={selectedModel}
      />

      {/* Reservation & Priority Delivery Drawer */}
      <ReservationDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        selectedModel={selectedModel}
        depositPercent={depositPercent}
        tenureMonths={tenureMonths}
        planType={planType}
      />

      {/* Customer Question & Technical Inquiry Modal */}
      <CustomerInquiryModal
        isOpen={isCustomerInquiryModalOpen}
        onClose={() => setIsCustomerInquiryModalOpen(false)}
        initialModelInterest={selectedModel.name}
        initialSubject={inquiryInitialSubject}
      />

      {/* Refer & Earn Ambassador Modal */}
      <ReferAndEarnModal
        isOpen={isReferralModalOpen}
        onClose={() => setIsReferralModalOpen(false)}
      />

      {/* Floating & Interactive WhatsApp Quick Chat Sales Support Desk */}
      <QuickChatWidget />
    </div>
  );
}

export default function App() {
  return (
    <StoreProvider>
      <StorefrontApp />
    </StoreProvider>
  );
}

