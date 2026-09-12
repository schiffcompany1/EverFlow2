export interface ProductModel {
  id: string;
  name: string;
  tagline: string;
  kva: number;
  continuousWatts: number;
  surgeWatts: number;
  outrightPrice: number; // in Naira (₦)
  monthlyFrom: number; // starting monthly installment
  badge?: string;
  category: 'residential' | 'commercial' | 'industrial';
  dimensions: string;
  weightKg: number;
  soundDba: number; // 0
  voltage: string;
  frequency: string;
  warrantyYears: number;
  recommendedFor: string[];
  keySpecs: {
    label: string;
    value: string;
  }[];
  image: string;
}

export interface PaySmallSmallConfig {
  modelId: string;
  depositPercent: number; // e.g. 20, 30, 50
  tenureMonths: number; // 3, 6, 12
}

export interface CalculationResult {
  model: ProductModel;
  outrightPrice: number;
  depositPercent: number;
  depositAmount: number;
  tenureMonths: number;
  balanceAmount: number;
  monthlyInstallment: number;
  totalPayable: number;
  estimatedPetrolSavingsYearly: number;
  inflationShieldSavings: number;
}

export interface ApplianceItem {
  id: string;
  name: string;
  category: 'cooling' | 'kitchen' | 'pumps' | 'entertainment' | 'office' | 'industrial';
  runningWatts: number;
  surgeWatts: number;
  defaultQty: number;
  iconName: string;
  note?: string;
}

export interface CustomerTestimonial {
  id: string;
  name: string;
  role: string;
  location: string;
  modelOwned: string;
  quote: string;
  monthlySavings: string;
  rating: number;
  verified: boolean;
}

export interface ReservationDetails {
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  deliveryCity: string;
  planType: 'outright' | 'paysmall';
  modelId: string;
  depositPercent?: number;
  tenureMonths?: number;
  specialNotes?: string;
}

export type OrderStatus = 
  | 'pending_verification'
  | 'deposit_confirmed'
  | 'outright_paid'
  | 'active_installment'
  | 'completed'
  | 'cancelled';

export interface PaymentTransaction {
  id: string;
  amount: number;
  date: string;
  type: 'deposit' | 'installment' | 'outright_full';
  referenceNumber: string;
  paymentMethod: string;
  notes?: string;
}

export interface OrderRecord {
  id: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  deliveryCity: string;
  modelId: string;
  modelName: string;
  modelKva: number;
  planType: 'outright' | 'paysmall';
  totalPrice: number;
  depositPercent: number;
  depositAmount: number;
  tenureMonths: number;
  monthlyInstallment: number;
  installmentsPaid: number;
  status: OrderStatus;
  transactions: PaymentTransaction[];
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface InquiryReply {
  id: string;
  author: string;
  content: string;
  timestamp: string;
  channel: 'whatsapp' | 'email' | 'portal';
}

export interface CustomerInquiry {
  id: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  deliveryCity: string;
  subject: string;
  message: string;
  modelInterest?: string;
  status: 'new' | 'in_progress' | 'replied' | 'closed';
  createdAt: string;
  replies: InquiryReply[];
}
