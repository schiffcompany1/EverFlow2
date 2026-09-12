import React, { createContext, useContext, useState, useEffect } from 'react';
import { ProductModel, OrderRecord, CustomerInquiry, OrderStatus, PaymentTransaction } from '../types';
import { EVERFLOW_MODELS } from '../data/products';
import { INITIAL_ORDERS, INITIAL_INQUIRIES } from '../data/mockAdminData';

interface StoreContextType {
  products: ProductModel[];
  addProduct: (product: Omit<ProductModel, 'id'>) => ProductModel;
  updateProduct: (id: string, updates: Partial<ProductModel>) => void;
  deleteProduct: (id: string) => void;
  resetProducts: () => void;

  orders: OrderRecord[];
  createOrder: (orderData: {
    customerName: string;
    customerPhone: string;
    customerEmail?: string;
    deliveryCity: string;
    model: ProductModel;
    planType: 'outright' | 'paysmall';
    depositPercent?: number;
    tenureMonths?: number;
    notes?: string;
  }) => OrderRecord;
  updateOrderStatus: (
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
  deleteOrder: (orderId: string) => void;

  inquiries: CustomerInquiry[];
  addInquiry: (inquiry: {
    customerName: string;
    customerPhone: string;
    customerEmail: string;
    deliveryCity?: string;
    subject: string;
    message: string;
    modelInterest?: string;
  }) => CustomerInquiry;
  replyToInquiry: (
    inquiryId: string,
    content: string,
    channel?: 'whatsapp' | 'email' | 'portal',
    author?: string
  ) => void;
  updateInquiryStatus: (inquiryId: string, status: CustomerInquiry['status']) => void;

  view: 'store' | 'admin';
  setView: (view: 'store' | 'admin') => void;
  adminTab: 'products' | 'payments' | 'inquiries';
  setAdminTab: (tab: 'products' | 'payments' | 'inquiries') => void;

  isCustomerInquiryModalOpen: boolean;
  setIsCustomerInquiryModalOpen: (open: boolean) => void;
  inquiryInitialSubject: string;
  setInquiryInitialSubject: (subject: string) => void;
  openInquiryModal: (subject?: string, modelInterest?: string) => void;

  currentProductView: ProductModel;
  setCurrentProductView: (product: ProductModel) => void;
  isQuickChatOpen: boolean;
  setIsQuickChatOpen: (open: boolean) => void;
  quickChatProduct: ProductModel | null;
  openQuickChat: (product?: ProductModel) => void;

  selectedDeliveryRegion: string;
  setSelectedDeliveryRegion: (regionId: string) => void;

  isReferralModalOpen: boolean;
  setIsReferralModalOpen: (open: boolean) => void;
  openReferralModal: () => void;

  fontStyle: 'cyber-tech' | 'aero-geometric' | 'executive';
  setFontStyle: (fontStyle: 'cyber-tech' | 'aero-geometric' | 'executive') => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

const STORAGE_KEYS = {
  PRODUCTS: 'everflow_products_v2',
  ORDERS: 'everflow_orders_v2',
  INQUIRIES: 'everflow_inquiries_v2',
  DELIVERY_REGION: 'everflow_delivery_region_v1',
  FONT_STYLE: 'everflow_font_style_v1'
};

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Products state
  const [products, setProducts] = useState<ProductModel[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return EVERFLOW_MODELS;
  });

  // Orders state
  const [orders, setOrders] = useState<OrderRecord[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ORDERS);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return INITIAL_ORDERS;
  });

  // Inquiries state
  const [inquiries, setInquiries] = useState<CustomerInquiry[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.INQUIRIES);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return INITIAL_INQUIRIES;
  });

  // Navigation & View state
  const [view, setView] = useState<'store' | 'admin'>('store');
  const [adminTab, setAdminTab] = useState<'products' | 'payments' | 'inquiries'>('products');
  const [isCustomerInquiryModalOpen, setIsCustomerInquiryModalOpen] = useState(false);
  const [inquiryInitialSubject, setInquiryInitialSubject] = useState<string>('');

  const openInquiryModal = (subject?: string, modelInterest?: string) => {
    setInquiryInitialSubject(subject || '');
    if (modelInterest) {
      const found = products.find((p) => p.name === modelInterest || p.id === modelInterest);
      if (found) setCurrentProductView(found);
    }
    setIsCustomerInquiryModalOpen(true);
  };

  // Quick Chat & Current Product View State
  const [currentProductView, setCurrentProductView] = useState<ProductModel>(() => {
    return products[0] || EVERFLOW_MODELS[0];
  });
  const [isQuickChatOpen, setIsQuickChatOpen] = useState(false);
  const [quickChatProduct, setQuickChatProduct] = useState<ProductModel | null>(null);

  // Delivery Region State
  const [selectedDeliveryRegion, setSelectedDeliveryRegion] = useState<string>(() => {
    try {
      return localStorage.getItem(STORAGE_KEYS.DELIVERY_REGION) || 'lagos';
    } catch {
      return 'lagos';
    }
  });

  // Refer & Earn Modal State
  const [isReferralModalOpen, setIsReferralModalOpen] = useState(false);
  const openReferralModal = () => {
    setIsReferralModalOpen(true);
  };

  // Typography / Font Style State ('cyber-tech' | 'aero-geometric' | 'executive')
  const [fontStyle, setFontStyle] = useState<'cyber-tech' | 'aero-geometric' | 'executive'>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.FONT_STYLE);
      if (saved === 'cyber-tech' || saved === 'aero-geometric' || saved === 'executive') {
        return saved;
      }
    } catch {
      // fallback
    }
    return 'cyber-tech';
  });

  // Apply active font style attribute to HTML root
  useEffect(() => {
    document.documentElement.setAttribute('data-font', fontStyle);
    try {
      localStorage.setItem(STORAGE_KEYS.FONT_STYLE, fontStyle);
    } catch {
      // ignore
    }
  }, [fontStyle]);

  // Keep currentProductView in sync if products list changes
  useEffect(() => {
    if (products.length > 0 && !products.some((p) => p.id === currentProductView.id)) {
      setCurrentProductView(products[0]);
    }
  }, [products, currentProductView.id]);

  const openQuickChat = (product?: ProductModel) => {
    if (product) {
      setQuickChatProduct(product);
      setCurrentProductView(product);
    } else {
      setQuickChatProduct(currentProductView);
    }
    setIsQuickChatOpen(true);
  };

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
    } catch (e) {
      console.error('Failed to save products', e);
    }
  }, [products]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
    } catch (e) {
      console.error('Failed to save orders', e);
    }
  }, [orders]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.INQUIRIES, JSON.stringify(inquiries));
    } catch (e) {
      console.error('Failed to save inquiries', e);
    }
  }, [inquiries]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.DELIVERY_REGION, selectedDeliveryRegion);
    } catch (e) {
      console.error('Failed to save delivery region', e);
    }
  }, [selectedDeliveryRegion]);

  // Product actions
  const addProduct = (productData: Omit<ProductModel, 'id'>): ProductModel => {
    const newId = `model-${productData.kva}-${Date.now().toString(36)}`;
    const newProduct: ProductModel = {
      ...productData,
      id: newId
    };
    setProducts((prev) => [newProduct, ...prev]);
    return newProduct;
  };

  const updateProduct = (id: string, updates: Partial<ProductModel>) => {
    setProducts((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updates } : item))
    );
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((item) => item.id !== id));
  };

  const resetProducts = () => {
    setProducts(EVERFLOW_MODELS);
  };

  // Order actions
  const createOrder = (data: {
    customerName: string;
    customerPhone: string;
    customerEmail?: string;
    deliveryCity: string;
    model: ProductModel;
    planType: 'outright' | 'paysmall';
    depositPercent?: number;
    tenureMonths?: number;
    notes?: string;
  }): OrderRecord => {
    const orderId = `EF-ORD-${Math.floor(1000 + Math.random() * 9000)}`;
    const depositPct = data.depositPercent || (data.planType === 'outright' ? 100 : 30);
    const depositAmt = Math.round(data.model.outrightPrice * (depositPct / 100));
    const tenure = data.tenureMonths || 6;
    const balance = data.model.outrightPrice - depositAmt;
    const monthlyAmt = data.planType === 'paysmall' && tenure > 0 
      ? Math.round((balance * 1.05) / tenure) 
      : 0;

    const newOrder: OrderRecord = {
      id: orderId,
      customerName: data.customerName,
      customerPhone: data.customerPhone,
      customerEmail: data.customerEmail,
      deliveryCity: data.deliveryCity,
      modelId: data.model.id,
      modelName: data.model.name,
      modelKva: data.model.kva,
      planType: data.planType,
      totalPrice: data.model.outrightPrice,
      depositPercent: depositPct,
      depositAmount: depositAmt,
      tenureMonths: tenure,
      monthlyInstallment: monthlyAmt,
      installmentsPaid: 0,
      status: 'pending_verification',
      transactions: [],
      notes: data.notes || 'Order placed via online reservation.',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setOrders((prev) => [newOrder, ...prev]);
    return newOrder;
  };

  const updateOrderStatus = (
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
  ) => {
    setOrders((prev) =>
      prev.map((order) => {
        if (order.id !== orderId) return order;

        const updatedTransactions = [...order.transactions];
        let installmentsCount = order.installmentsPaid;

        if (paymentDetails && paymentDetails.amount && paymentDetails.amount > 0) {
          const newTx: PaymentTransaction = {
            id: `TX-${Date.now().toString(36).toUpperCase()}`,
            amount: paymentDetails.amount,
            date: new Date().toISOString().split('T')[0],
            type: paymentDetails.type || (newStatus === 'deposit_confirmed' ? 'deposit' : 'installment'),
            referenceNumber: paymentDetails.referenceNumber || `REF-${Math.floor(100000 + Math.random() * 900000)}`,
            paymentMethod: paymentDetails.paymentMethod || 'Bank Transfer',
            notes: paymentDetails.notes
          };
          updatedTransactions.push(newTx);
        }

        if (paymentDetails?.markInstallmentPaid) {
          installmentsCount = Math.min(order.tenureMonths, installmentsCount + 1);
        }

        return {
          ...order,
          status: newStatus,
          installmentsPaid: installmentsCount,
          transactions: updatedTransactions,
          updatedAt: new Date().toISOString()
        };
      })
    );
  };

  const deleteOrder = (orderId: string) => {
    setOrders((prev) => prev.filter((order) => order.id !== orderId));
  };

  // Inquiry actions
  const addInquiry = (data: {
    customerName: string;
    customerPhone: string;
    customerEmail: string;
    deliveryCity?: string;
    subject: string;
    message: string;
    modelInterest?: string;
  }): CustomerInquiry => {
    const inquiryId = `INQ-${Math.floor(100 + Math.random() * 900)}`;
    const newInquiry: CustomerInquiry = {
      id: inquiryId,
      customerName: data.customerName,
      customerPhone: data.customerPhone,
      customerEmail: data.customerEmail,
      deliveryCity: data.deliveryCity || 'Lagos',
      subject: data.subject,
      message: data.message,
      modelInterest: data.modelInterest || 'General Inquiry',
      status: 'new',
      createdAt: new Date().toISOString(),
      replies: []
    };

    setInquiries((prev) => [newInquiry, ...prev]);
    return newInquiry;
  };

  const replyToInquiry = (
    inquiryId: string,
    content: string,
    channel: 'whatsapp' | 'email' | 'portal' = 'whatsapp',
    author = 'EverFlow Admin Desk'
  ) => {
    setInquiries((prev) =>
      prev.map((inq) => {
        if (inq.id !== inquiryId) return inq;
        const newReply: CustomerInquiry['replies'][0] = {
          id: `REP-${Date.now().toString(36)}`,
          author,
          content,
          timestamp: new Date().toISOString(),
          channel
        };
        return {
          ...inq,
          status: 'replied',
          replies: [...inq.replies, newReply]
        };
      })
    );
  };

  const updateInquiryStatus = (inquiryId: string, status: CustomerInquiry['status']) => {
    setInquiries((prev) =>
      prev.map((inq) => (inq.id === inquiryId ? { ...inq, status } : inq))
    );
  };

  return (
    <StoreContext.Provider
      value={{
        products,
        addProduct,
        updateProduct,
        deleteProduct,
        resetProducts,
        orders,
        createOrder,
        updateOrderStatus,
        deleteOrder,
        inquiries,
        addInquiry,
        replyToInquiry,
        updateInquiryStatus,
        view,
        setView,
        adminTab,
        setAdminTab,
        isCustomerInquiryModalOpen,
        setIsCustomerInquiryModalOpen,
        inquiryInitialSubject,
        setInquiryInitialSubject,
        openInquiryModal,
        currentProductView,
        setCurrentProductView,
        isQuickChatOpen,
        setIsQuickChatOpen,
        quickChatProduct,
        openQuickChat,
        selectedDeliveryRegion,
        setSelectedDeliveryRegion,
        isReferralModalOpen,
        setIsReferralModalOpen,
        openReferralModal,
        fontStyle,
        setFontStyle
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
