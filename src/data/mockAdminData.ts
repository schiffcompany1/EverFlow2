import { OrderRecord, CustomerInquiry } from '../types';

export const INITIAL_ORDERS: OrderRecord[] = [
  {
    id: 'EF-ORD-9021',
    customerName: 'Senator Babatunde Adeleke',
    customerPhone: '+234 803 445 9912',
    customerEmail: 'babatunde.adeleke@gmail.com',
    deliveryCity: 'Lagos (Lekki / Ikoyi / VI)',
    modelId: 'pro-15',
    modelName: 'EverFlow Pro 15',
    modelKva: 15.0,
    planType: 'paysmall',
    totalPrice: 7600000,
    depositPercent: 30,
    depositAmount: 2280000,
    tenureMonths: 6,
    monthlyInstallment: 931000,
    installmentsPaid: 2,
    status: 'active_installment',
    transactions: [
      {
        id: 'TX-1001',
        amount: 2280000,
        date: '2026-08-14',
        type: 'deposit',
        referenceNumber: 'GTB-TRF-8839201',
        paymentMethod: 'Bank Transfer (GTBank)',
        notes: 'Initial 30% commitment verified via corporate account'
      },
      {
        id: 'TX-1002',
        amount: 931000,
        date: '2026-08-30',
        type: 'installment',
        referenceNumber: 'ZEN-NIP-9920145',
        paymentMethod: 'Zenith Bank Direct NIP',
        notes: 'Month 1 of 6 installment received'
      },
      {
        id: 'TX-1003',
        amount: 931000,
        date: '2026-09-02',
        type: 'installment',
        referenceNumber: 'ZEN-NIP-9934112',
        paymentMethod: 'Zenith Bank Direct NIP',
        notes: 'Month 2 of 6 installment received'
      }
    ],
    notes: 'Installed in Lekki Phase 1 duplex corridor. ATS connected seamlessly to 3-phase switchboard.',
    createdAt: '2026-08-14T10:30:00Z',
    updatedAt: '2026-09-02T16:20:00Z'
  },
  {
    id: 'EF-ORD-9044',
    customerName: 'Dr. Stella Okonjo',
    customerPhone: '+234 812 990 4112',
    customerEmail: 'dr.stella.okonjo@apexclinics.ng',
    deliveryCity: 'Abuja (Maitama / Asokoro / Guzape)',
    modelId: 'prime-7-5',
    modelName: 'EverFlow Prime 7.5',
    modelKva: 7.5,
    planType: 'outright',
    totalPrice: 3850000,
    depositPercent: 100,
    depositAmount: 3850000,
    tenureMonths: 0,
    monthlyInstallment: 0,
    installmentsPaid: 0,
    status: 'outright_paid',
    transactions: [
      {
        id: 'TX-1004',
        amount: 3850000,
        date: '2026-08-28',
        type: 'outright_full',
        referenceNumber: 'FBN-CASH-7719283',
        paymentMethod: 'First Bank Instant Transfer',
        notes: '100% Outright payment settled. Priority dispatch executed.'
      }
    ],
    notes: 'Installed for pediatric clinic cold chain backup in Maitama. Tested with 3x inverter ACs.',
    createdAt: '2026-08-28T14:15:00Z',
    updatedAt: '2026-08-29T09:00:00Z'
  },
  {
    id: 'EF-ORD-9082',
    customerName: 'Engr. Emeka Dan-Jumbo',
    customerPhone: '+234 802 334 1109',
    customerEmail: 'emeka.jumbo@oilserv.com.ng',
    deliveryCity: 'Port Harcourt (GRA Phase 1 & 2)',
    modelId: 'solo-3-5',
    modelName: 'EverFlow Solo 3.5',
    modelKva: 3.5,
    planType: 'paysmall',
    totalPrice: 1950000,
    depositPercent: 20,
    depositAmount: 390000,
    tenureMonths: 12,
    monthlyInstallment: 136500,
    installmentsPaid: 0,
    status: 'deposit_confirmed',
    transactions: [
      {
        id: 'TX-1005',
        amount: 390000,
        date: '2026-09-01',
        type: 'deposit',
        referenceNumber: 'UBA-NIP-1234098',
        paymentMethod: 'UBA Direct Transfer',
        notes: '20% deposit credited. Scheduled for Port Harcourt logistics handover.'
      }
    ],
    notes: 'Customer requested installation for private apartment in Old GRA.',
    createdAt: '2026-09-01T11:45:00Z',
    updatedAt: '2026-09-01T15:30:00Z'
  },
  {
    id: 'EF-ORD-9105',
    customerName: 'Hajia Aisha Mohammed',
    customerPhone: '+234 809 778 3344',
    customerEmail: 'aisha.m@khalifagroup.ng',
    deliveryCity: 'Abuja (Maitama / Asokoro / Guzape)',
    modelId: 'titan-50',
    modelName: 'EverFlow Titan 50',
    modelKva: 50.0,
    planType: 'paysmall',
    totalPrice: 21500000,
    depositPercent: 50,
    depositAmount: 10750000,
    tenureMonths: 6,
    monthlyInstallment: 1881250,
    installmentsPaid: 0,
    status: 'pending_verification',
    transactions: [],
    notes: 'Order placed via online reservation. Awaiting corporate finance bank transfer confirmation of 50% deposit.',
    createdAt: '2026-09-03T18:20:00Z',
    updatedAt: '2026-09-03T18:20:00Z'
  },
  {
    id: 'EF-ORD-9118',
    customerName: 'Kunle Fashola Esq.',
    customerPhone: '+234 814 556 7890',
    customerEmail: 'kunle.fashola@chambers.ng',
    deliveryCity: 'Lagos (Ikeja / Mainland / Magodo)',
    modelId: 'prime-7-5',
    modelName: 'EverFlow Prime 7.5',
    modelKva: 7.5,
    planType: 'paysmall',
    totalPrice: 3850000,
    depositPercent: 30,
    depositAmount: 1155000,
    tenureMonths: 6,
    monthlyInstallment: 471625,
    installmentsPaid: 0,
    status: 'pending_verification',
    transactions: [],
    notes: 'Customer submitted Pay-Small-Small application. Verification team reviewing proof of address.',
    createdAt: '2026-09-03T21:05:00Z',
    updatedAt: '2026-09-03T21:05:00Z'
  }
];

export const INITIAL_INQUIRIES: CustomerInquiry[] = [
  {
    id: 'INQ-501',
    customerName: 'Alhaji Mansur Bello',
    customerPhone: '+234 803 555 1290',
    customerEmail: 'mansur.bello@estatehotel.ng',
    deliveryCity: 'Abuja (CBD / Wuse 2)',
    subject: 'Bulk EverFlow 50 kVA inquiry for 40-room Boutique Hotel',
    message: 'Good day EverFlow management. We spend over ₦3.8 million monthly running twin 60kVA Perkins diesel generators for our hotel in Wuse 2. The noise and fuel fumes have led to frequent guest complaints. Does the Titan 50 support 3-phase balancing for our central water chillers and kitchen cold storage? How soon can you deliver 2 units to Abuja under the Pay-Small-Small scheme?',
    modelInterest: 'EverFlow Titan 50',
    status: 'new',
    createdAt: '2026-09-03T20:15:00Z',
    replies: []
  },
  {
    id: 'INQ-502',
    customerName: 'Engr. Taiwo Ogundimu',
    customerPhone: '+234 802 889 0041',
    customerEmail: 'taiwo.ogundimu@cadbury.com.ng',
    deliveryCity: 'Lagos (Ikeja / Mainland / Magodo)',
    subject: 'ATS In-Home Integration with preexisting 5kVA Solar inverter',
    message: 'Hello, I live in Magodo Phase 2. I already have a 5kVA solar setup with 8 lithium batteries, but in cloudy monsoon months it fails completely. Can the EverFlow Solo 3.5 or Prime 7.5 be tied directly to my existing automated transfer switch (ATS) to charge my lithium bank or power the ACs without back-feeding the grid?',
    modelInterest: 'EverFlow Prime 7.5',
    status: 'in_progress',
    createdAt: '2026-09-03T14:40:00Z',
    replies: [
      {
        id: 'REP-101',
        author: 'Engr. David K. (Chief Technical Officer)',
        content: 'Hello Engr. Taiwo! Yes, absolutely. The EverFlow Prime 7.5 comes equipped with an internal bidirectional ATS sync module. It generates a pure 50.0 Hz sine wave that matches the frequency of your inverter. Our Lagos engineering team can install an auxiliary changeover so EverFlow supplies continuous power without any back-feeding risk.',
        timestamp: '2026-09-03T16:05:00Z',
        channel: 'whatsapp'
      }
    ]
  },
  {
    id: 'INQ-503',
    customerName: 'Mrs. Chidinma Eze-Nwachukwu',
    customerPhone: '+234 818 234 7790',
    customerEmail: 'chidinma.eze@oakridge.edu.ng',
    deliveryCity: 'Lagos (Lekki / Ikoyi / VI)',
    subject: 'Pay-Small-Small salary earner verification requirement',
    message: 'Hello, I am a school administrator in Ikoyi. I would like to get the Solo 3.5 for my 3-bedroom flat. What documents are needed for the 20% down payment Pay-Small-Small plan? Can the monthly deduction be automated via my bank card or direct debit?',
    modelInterest: 'EverFlow Solo 3.5',
    status: 'replied',
    createdAt: '2026-09-02T11:20:00Z',
    replies: [
      {
        id: 'REP-102',
        author: 'Grace A. (Customer Financing Desk)',
        content: 'Good day Mrs. Chidinma! For the 20% Pay-Small-Small plan, requirements are simple: 1) Valid Nigerian ID (NIN or Passport), 2) 3 months recent bank statement, and 3) Utility bill of your Ikoyi residence. Monthly installments can be automated via Remita or Direct Debit mandate with zero hassle. We have reserved a Solo 3.5 unit for you.',
        timestamp: '2026-09-02T13:45:00Z',
        channel: 'email'
      }
    ]
  }
];
