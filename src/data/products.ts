import { ProductModel, ApplianceItem, CustomerTestimonial } from '../types';

export const EVERFLOW_MODELS: ProductModel[] = [
  {
    id: 'solo-3-5',
    name: 'EverFlow Solo 3.5',
    tagline: 'Perpetual Silence for 2-3 Bedroom Homes',
    kva: 3.5,
    continuousWatts: 3000,
    surgeWatts: 4200,
    outrightPrice: 1950000, // ₦1.95M
    monthlyFrom: 135000, // starting from ₦135k/mo on 12-mo plan with 30% down
    badge: 'Best for Flats & Homes',
    category: 'residential',
    dimensions: '480 x 310 x 420 mm',
    weightKg: 28,
    soundDba: 0,
    voltage: '230V ±1%',
    frequency: '50.0 Hz Pure Sine',
    warrantyYears: 2,
    recommendedFor: ['1.5 HP Inverter AC', 'Large Double-Door Fridge', 'Home Lighting & TVs', 'Borehole Water Pump (1 HP)'],
    keySpecs: [
      { label: 'Acoustic Signature', value: '0 dB (Imperceptible)' },
      { label: 'Fuel / Gas Needed', value: '₦0 (Zero Forever)' },
      { label: 'Transfer Switch', value: 'Instant (<8ms Seamless)' },
      { label: 'Solar Panels Required', value: 'None (Self-Resonating)' }
    ],
    image: '/src/assets/images/everflow_compact_1788498985370.jpg'
  },
  {
    id: 'prime-7-5',
    name: 'EverFlow Prime 7.5',
    tagline: 'Uncompromising Luxury for Modern Duplexes & Executives',
    kva: 7.5,
    continuousWatts: 6500,
    surgeWatts: 9000,
    outrightPrice: 3850000, // ₦3.85M
    monthlyFrom: 265000,
    badge: 'Most Popular',
    category: 'residential',
    dimensions: '620 x 410 x 540 mm',
    weightKg: 46,
    soundDba: 0,
    voltage: '230V ±0.5%',
    frequency: '50.0 Hz Pure Sine',
    warrantyYears: 3,
    recommendedFor: ['Up to 3x 1.5 HP ACs', 'Full Kitchen Suite & Freezers', 'Water Pumping Machine (2 HP)', 'Home Theater & Workstation'],
    keySpecs: [
      { label: 'Acoustic Signature', value: '0 dB (Zero Noise)' },
      { label: 'Fuel Requirement', value: 'Zero Gas / Diesel' },
      { label: 'ATS Switch', value: 'Built-in Smart Relay' },
      { label: 'Surge Capacity', value: '9,000 Watts Peak' }
    ],
    image: '/src/assets/images/everflow_generator_1788498968530.jpg'
  },
  {
    id: 'pro-15',
    name: 'EverFlow Pro 15',
    tagline: 'High-Demand Commercial & Clinic Continuity',
    kva: 15.0,
    continuousWatts: 13500,
    surgeWatts: 18000,
    outrightPrice: 7600000, // ₦7.6M
    monthlyFrom: 520000,
    badge: 'Commercial Grade',
    category: 'commercial',
    dimensions: '880 x 560 x 720 mm',
    weightKg: 89,
    soundDba: 0,
    voltage: '230V / 400V 3-Phase',
    frequency: '50.0 Hz Pure Sine',
    warrantyYears: 3,
    recommendedFor: ['Commercial Offices & Co-working', 'Diagnostic Clinics & Labs', 'Bakeries & Cold Rooms', 'Full Duplex with 6+ ACs'],
    keySpecs: [
      { label: 'Phase Support', value: 'Single & 3-Phase 400V' },
      { label: 'Maintenance Interval', value: 'Zero Moving Engine Parts' },
      { label: 'Thermal Footprint', value: 'Cold Touch Nano-Chassis' },
      { label: 'Smart Telemetry', value: 'IoT App + Cellular Link' }
    ],
    image: '/src/assets/images/everflow_generator_1788498968530.jpg'
  },
  {
    id: 'titan-50',
    name: 'EverFlow Titan 50',
    tagline: 'Megawatt Architecture for Factories, Hotels & Estates',
    kva: 50.0,
    continuousWatts: 45000,
    surgeWatts: 60000,
    outrightPrice: 21500000, // ₦21.5M
    monthlyFrom: 1480000,
    badge: 'Heavy Industrial',
    category: 'industrial',
    dimensions: '1420 x 890 x 1150 mm',
    weightKg: 240,
    soundDba: 0,
    voltage: '400V / 415V 3-Phase Industrial',
    frequency: '50.0 Hz Pure Sine',
    warrantyYears: 5,
    recommendedFor: ['Manufacturing Plant Production', 'Hotels & Event Centers', 'Hospital Surgical Wings', 'Data Centers & Telecom Hubs'],
    keySpecs: [
      { label: 'Continuous Output', value: '45,000 Watts 24/7' },
      { label: 'Emissions', value: '0.00% CO2 / Zero Carbon' },
      { label: 'Diesel Cost Savings', value: 'Est. ₦4.2M / Month' },
      { label: 'Lifespan Rating', value: '25+ Years Continuous' }
    ],
    image: '/src/assets/images/everflow_generator_1788498968530.jpg'
  }
];

export const COMPARISON_DATA = [
  {
    feature: 'Fuel / Sunlight Requirement',
    everflow: 'Zero (No Petrol, Diesel, or Sun)',
    petrol: 'Heavy Daily PMS/AGO Expense (₦1,100+/L)',
    solar: 'Dependent on Sunshine (Fails in Rain/Dust)',
    winner: 'everflow'
  },
  {
    feature: 'Noise Signature (Decibels)',
    everflow: '0 dB (Completely Silent)',
    petrol: '85 dB - 105 dB (Deafening Noise & Fumes)',
    solar: '0 dB (Silent Inverter Hum)',
    winner: 'everflow'
  },
  {
    feature: 'Monthly Fuel Expenditure',
    everflow: '₦0 / Month Guaranteed',
    petrol: '₦180,000 – ₦1,200,000+ / Month',
    solar: '₦0 Fuel (Until Rainy Season Generator Kicks In)',
    winner: 'everflow'
  },
  {
    feature: 'Roof Space / Installation Friction',
    everflow: 'Zero Roof Impact. Fits in Any Room or Hallway',
    petrol: 'Requires outdoor cage, fire hazard ventilation',
    solar: 'Requires 12-24 large roof panels prone to dust & leakage',
    winner: 'everflow'
  },
  {
    feature: 'Continuous 24/7 Rainy Season Power',
    everflow: '100% Perpetual Power regardless of weather',
    petrol: 'Runs until fuel runs out or spark plug knocks',
    solar: 'Dramatically degrades during cloudy July/August weeks',
    winner: 'everflow'
  },
  {
    feature: 'Carbon Emission & Fume Poisoning Risk',
    everflow: 'Zero Carbon (0.00% Emission, Zero Fumes)',
    petrol: 'Dangerous Carbon Monoxide poisoning risk',
    solar: 'Zero Direct Emission',
    winner: 'everflow'
  },
  {
    feature: 'Maintenance & Servicing Needs',
    everflow: 'Zero Oil Changes, Zero Spark Plugs, Zero Filters',
    petrol: 'Frequent oil changes, carburetor servicing, mechanics',
    solar: 'Periodic roof cleaning, battery degradation after 3-5 yrs',
    winner: 'everflow'
  },
  {
    feature: 'Payment Options Available',
    everflow: 'Flexible "Pay-Small-Small" (20% down, up to 12 mos)',
    petrol: '100% upfront cash payment required',
    solar: 'High upfront capital expenditure (₦4M - ₦15M)',
    winner: 'everflow'
  }
];

export const APPLIANCE_LIST: ApplianceItem[] = [
  {
    id: 'ac-1hp',
    name: '1.0 HP Inverter AC',
    category: 'cooling',
    runningWatts: 850,
    surgeWatts: 1400,
    defaultQty: 0,
    iconName: 'Wind',
    note: 'Standard bedroom inverter'
  },
  {
    id: 'ac-1-5hp',
    name: '1.5 HP Dual Inverter AC',
    category: 'cooling',
    runningWatts: 1200,
    surgeWatts: 2100,
    defaultQty: 1,
    iconName: 'Wind',
    note: 'Master bedroom / Living room'
  },
  {
    id: 'ac-2hp',
    name: '2.0 HP Standard AC',
    category: 'cooling',
    runningWatts: 1800,
    surgeWatts: 3400,
    defaultQty: 0,
    iconName: 'Wind',
    note: 'Large living room or office'
  },
  {
    id: 'fridge-inverter',
    name: 'Double-Door Inverter Refrigerator',
    category: 'kitchen',
    runningWatts: 250,
    surgeWatts: 600,
    defaultQty: 1,
    iconName: 'Refrigerator',
    note: '24/7 food preservation'
  },
  {
    id: 'deep-freezer',
    name: 'Chest Deep Freezer (300L)',
    category: 'kitchen',
    runningWatts: 380,
    surgeWatts: 950,
    defaultQty: 1,
    iconName: 'Snowflake',
    note: 'Continuous frozen storage'
  },
  {
    id: 'water-pump',
    name: 'Borehole Water Pumping Machine (1 HP)',
    category: 'pumps',
    runningWatts: 1100,
    surgeWatts: 2500,
    defaultQty: 1,
    iconName: 'Droplets',
    note: 'Essential water supply'
  },
  {
    id: 'washing-machine',
    name: 'Automatic Washing Machine',
    category: 'kitchen',
    runningWatts: 500,
    surgeWatts: 1200,
    defaultQty: 0,
    iconName: 'RefreshCw',
    note: 'Spin and wash cycle'
  },
  {
    id: 'tv-entertainment',
    name: '65" 4K Smart TV + Soundbar + Decoder',
    category: 'entertainment',
    runningWatts: 220,
    surgeWatts: 350,
    defaultQty: 1,
    iconName: 'Tv',
    note: 'Home entertainment center'
  },
  {
    id: 'home-lighting',
    name: 'Full House LED Lighting & Ceiling Fans (x10)',
    category: 'entertainment',
    runningWatts: 350,
    surgeWatts: 450,
    defaultQty: 1,
    iconName: 'Lightbulb',
    note: 'Ambient & security lights'
  },
  {
    id: 'workstation',
    name: 'Home Office (2x Laptops, Wi-Fi Starlink, Monitors)',
    category: 'office',
    runningWatts: 280,
    surgeWatts: 400,
    defaultQty: 1,
    iconName: 'Laptop',
    note: 'Remote executive work'
  },
  {
    id: 'microwave',
    name: 'Kitchen Microwave Oven',
    category: 'kitchen',
    runningWatts: 1200,
    surgeWatts: 1600,
    defaultQty: 0,
    iconName: 'Flame',
    note: 'Occasional quick heating'
  },
  {
    id: 'iron',
    name: 'Steam Electric Pressing Iron',
    category: 'office',
    runningWatts: 1500,
    surgeWatts: 1700,
    defaultQty: 0,
    iconName: 'Shirt',
    note: 'High resistive heating'
  }
];

export const TESTIMONIALS: CustomerTestimonial[] = [
  {
    id: 't-1',
    name: 'Engr. Femi Adeleke',
    role: 'Managing Director, Horizon Tech Hub',
    location: 'Lekki Phase 1, Lagos',
    modelOwned: 'EverFlow Pro 15 (15 kVA)',
    quote: 'We were spending over ₦680,000 every single month on diesel for our co-working hub and the noise was driving clients insane. Switching to the EverFlow Pro 15 was the best financial decision of our 2025. 100% silent, zero fuel cost, and the Pay-Small-Small plan made cash flow seamless.',
    monthlySavings: '₦680,000 / mo',
    rating: 5,
    verified: true
  },
  {
    id: 't-2',
    name: 'Dr. Amina Bello-Yusuf',
    role: 'Lead Consultant, Premier Care Pediatrics',
    location: 'Maitama, Abuja',
    modelOwned: 'EverFlow Prime 7.5 (7.5 kVA)',
    quote: 'In our pediatric clinic, vaccine cold storage and pediatric monitors cannot blink. Fuel shortages in Abuja used to give me sleepless nights. The EverFlow Prime runs completely silent in our utility corridor with zero fumes. The patients and staff are in awe.',
    monthlySavings: '₦340,000 / mo',
    rating: 5,
    verified: true
  },
  {
    id: 't-3',
    name: 'Chief Ken Nwosu',
    role: 'Homeowner & Estate Executive',
    location: 'Old GRA, Port Harcourt',
    modelOwned: 'EverFlow Solo 3.5 (3.5 kVA)',
    quote: 'I placed the Solo 3.5 inside my interior laundry room. My neighbors could not believe my 1.5 HP AC and borehole pump were running without any generator noise outside. The 30% deposit Pay-Small-Small option was processed in under 24 hours.',
    monthlySavings: '₦190,000 / mo',
    rating: 5,
    verified: true
  }
];

export const TRUST_BADGES = [
  { label: '0 dB Certified Silent', detail: 'Zero acoustic disturbance', icon: 'VolumeX' },
  { label: '₦0 Fuel Required', detail: 'No Petrol or Diesel ever', icon: 'FlameOff' },
  { label: 'No Solar Panels Needed', detail: '100% Weather Independent', icon: 'SunOff' },
  { label: 'Pay-Small-Small Ready', detail: 'From 20% down payment', icon: 'CreditCard' },
  { label: 'SON & CE Approved', detail: 'Military-grade surge shielding', icon: 'ShieldCheck' },
  { label: 'Nationwide Delivery', detail: 'Lagos, Abuja, PH in 48 hrs', icon: 'Truck' }
];

export const FAQS = [
  {
    question: 'How does EverFlow generate electricity without fuel or solar panels?',
    answer: 'EverFlow Energy generators utilize proprietary solid-state quantum magnetic resonance and perpetual harmonic induction cells. Unlike traditional combustion engines that burn hydrocarbon fuel, or photovoltaic panels that require direct sunlight, EverFlow generators recycle ambient electromagnetic kinetic flux through specialized super-conducting core windings. It is sealed, solid-state, and generates clean continuous 230V / 50Hz pure sine wave power 24/7 without consuming fossil fuels.'
  },
  {
    question: 'How does the "Pay-Small-Small" installment plan work?',
    answer: 'Our Pay-Small-Small scheme lets you take delivery of your EverFlow generator with as little as 20%, 30%, or 50% initial down payment. The remaining balance is split evenly across 3, 6, or 12 monthly installments. Verification requires basic KYC (Valid ID, proof of income or bank statement, and utility bill). You lock in today’s price and shield yourself against inflation and escalating petrol costs immediately.'
  },
  {
    question: 'Is it truly 100% silent (0 dB)? Can I place it inside my apartment?',
    answer: 'Yes. Traditional generators produce 85 to 105 decibels because of internal combustion explosions and exhaust mufflers. EverFlow has zero pistons, zero belts, and zero exhaust pipes. The acoustic output is 0 dB—less sound than a sleeping breath. It produces zero carbon monoxide, allowing safe installation inside living rooms, corridors, stairwells, or offices.'
  },
  {
    question: 'What is the warranty and expected lifespan?',
    answer: 'Every EverFlow generator comes with a 2-Year to 5-Year Comprehensive Warranty and a 25-year structural service lifespan rating. Because there are no reciprocating pistons or friction engine parts, there are no oil changes, spark plug swaps, or carburetor replacements ever.'
  },
  {
    question: 'How does delivery and installation work across Nigeria?',
    answer: 'We provide white-glove delivery and professional electrical installation across Lagos, Abuja, Port Harcourt, Ibadan, Kano, and nationwide. Our certified electrical engineers connect the generator directly to your existing changeover or automatic transfer switch (ATS) within 2 hours.'
  },
  {
    question: 'Can EverFlow power heavy inductive loads like Borehole Pumps and ACs?',
    answer: 'Absolutely. EverFlow units are engineered with High-Surge Inductive Boost capacitors capable of handling up to 140% to 150% peak startup surge currents for inverter and non-inverter air conditioners, deep freezers, and borehole pumping machines without voltage drops.'
  }
];
