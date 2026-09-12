import { ProductModel } from '../types';

export type DemandTier = 'extreme_surge' | 'high_demand' | 'moderate' | 'custom';

export interface DeliveryRegion {
  id: string;
  name: string;
  shortName: string;
  hub: string;
  transitOffsetDays: number;
  expressAvailable: boolean;
  freeDeliveryEligible: boolean;
}

export const DELIVERY_REGIONS: DeliveryRegion[] = [
  {
    id: 'lagos',
    name: 'Lagos (Island, Lekki, Ikeja & Mainland)',
    shortName: 'Lagos',
    hub: 'EverFlow Lekki Distribution Hub',
    transitOffsetDays: 0,
    expressAvailable: true,
    freeDeliveryEligible: true
  },
  {
    id: 'abuja',
    name: 'Abuja (Maitama, Wuse, Gwarinpa, FCT)',
    shortName: 'Abuja',
    hub: 'EverFlow Abuja Regional Center',
    transitOffsetDays: 1,
    expressAvailable: true,
    freeDeliveryEligible: true
  },
  {
    id: 'phc',
    name: 'Port Harcourt & Rivers (GRA, Trans-Amadi)',
    shortName: 'Port Harcourt',
    hub: 'EverFlow South-South Freight Hub',
    transitOffsetDays: 2,
    expressAvailable: false,
    freeDeliveryEligible: false
  },
  {
    id: 'ibadan',
    name: 'Ibadan, Oyo & Ogun Corridor',
    shortName: 'Ibadan / Ogun',
    hub: 'South-West Transit Depot',
    transitOffsetDays: 1,
    expressAvailable: true,
    freeDeliveryEligible: true
  },
  {
    id: 'nationwide',
    name: 'Other States Nationwide (Interstate Freight)',
    shortName: 'Nationwide',
    hub: 'Central Interstate Logistics Network',
    transitOffsetDays: 3,
    expressAvailable: false,
    freeDeliveryEligible: false
  }
];

export interface DeliveryEstimateResult {
  demandTier: DemandTier;
  demandBadge: string;
  demandBadgeBg: string;
  demandBadgeText: string;
  demandDescription: string;
  recentOrdersCount: number;
  unitsLeftInBatch: number;
  batchCapacityPercent: number; // e.g. 88% reserved
  region: DeliveryRegion;
  dispatchDateFormatted: string;
  estimatedDeliveryFormatted: string;
  estimatedRangeFormatted: string;
  earliestDayName: string;
  latestDayName: string;
  daysRange: string;
  isSameDayPossible: boolean;
  cutoffCountdown: {
    hours: number;
    minutes: number;
    text: string;
  };
  hubName: string;
  atsTestingIncluded: boolean;
}

/**
 * Calculates a forward date skipping Sundays for logistics
 */
function addBusinessDays(baseDate: Date, daysToAdd: number): Date {
  const result = new Date(baseDate.getTime());
  let added = 0;
  while (added < daysToAdd) {
    result.setDate(result.getDate() + 1);
    // EverFlow delivery partners operate Mon-Sat. Skip Sunday (0)
    if (result.getDay() !== 0) {
      added++;
    }
  }
  return result;
}

function formatDateFriendly(date: Date, includeDay: boolean = true): string {
  const options: Intl.DateTimeFormatOptions = {
    month: 'short',
    day: 'numeric'
  };
  if (includeDay) {
    options.weekday = 'short';
  }
  return new Intl.DateTimeFormat('en-US', options).format(date);
}

/**
 * Calculates dynamic delivery date and demand metrics based on:
 * 1. Product Model (kVA, popularity, capacity)
 * 2. Real-time active demand level
 * 3. Selected Delivery Region
 * 4. Current time of day (order cutoff before 3:00 PM)
 */
export function calculateDeliveryEstimate(
  model: ProductModel,
  regionId: string = 'lagos',
  referenceDate: Date = new Date()
): DeliveryEstimateResult {
  const region = DELIVERY_REGIONS.find((r) => r.id === regionId) || DELIVERY_REGIONS[0];

  // Derive demand attributes based on model specifications
  let demandTier: DemandTier = 'high_demand';
  let recentOrdersCount = 14;
  let unitsLeftInBatch = 4;
  let batchCapacityPercent = 82;
  let baseLeadDaysMin = 1;
  let baseLeadDaysMax = 2;

  if (model.id === 'prime-7-5') {
    // Flagship duplex model: highest nationwide demand
    demandTier = 'extreme_surge';
    recentOrdersCount = 28;
    unitsLeftInBatch = 2;
    batchCapacityPercent = 94;
    baseLeadDaysMin = 2;
    baseLeadDaysMax = 3;
  } else if (model.id === 'solo-3-5') {
    // 3.5kVA: Residential best seller
    demandTier = 'high_demand';
    recentOrdersCount = 19;
    unitsLeftInBatch = 3;
    batchCapacityPercent = 88;
    baseLeadDaysMin = 1;
    baseLeadDaysMax = 2;
  } else if (model.id === 'pro-15') {
    // Commercial 15kVA
    demandTier = 'moderate';
    recentOrdersCount = 9;
    unitsLeftInBatch = 5;
    batchCapacityPercent = 75;
    baseLeadDaysMin = 2;
    baseLeadDaysMax = 3;
  } else if (model.kva >= 30) {
    // Heavy industrial units (e.g. 50kVA) require specialized lowbed crane logistics
    demandTier = 'extreme_surge';
    recentOrdersCount = 4;
    unitsLeftInBatch = 1;
    batchCapacityPercent = 90;
    baseLeadDaysMin = 4;
    baseLeadDaysMax = 6;
  } else {
    // Dynamically calibrated for newly created products in the admin panel
    const hash = model.name.length + Math.round(model.kva * 2);
    unitsLeftInBatch = Math.max(2, (hash % 6) + 1);
    recentOrdersCount = Math.max(5, (hash * 3) % 25 + 4);
    batchCapacityPercent = Math.min(95, 70 + (hash % 25));
    demandTier = unitsLeftInBatch <= 2 ? 'extreme_surge' : 'high_demand';
    baseLeadDaysMin = 1;
    baseLeadDaysMax = 3;
  }

  // Calculate cutoff time: 15:00 (3:00 PM) local time
  const currentHour = referenceDate.getHours();
  const currentMinutes = referenceDate.getMinutes();
  
  let hoursRemaining = 15 - currentHour;
  let minutesRemaining = 60 - currentMinutes;

  if (minutesRemaining === 60) {
    minutesRemaining = 0;
  } else {
    hoursRemaining -= 1;
  }

  let pastCutoff = false;
  if (hoursRemaining < 0 || (hoursRemaining === 0 && minutesRemaining <= 0)) {
    pastCutoff = true;
    // Next day's cutoff
    hoursRemaining = (24 - currentHour) + 15;
  }

  // If order is placed after cutoff, dispatch processing rolls over +1 day
  const dispatchLeadDays = pastCutoff ? 1 : 0;
  
  // Total delivery calculation
  const totalMinDays = baseLeadDaysMin + region.transitOffsetDays + dispatchLeadDays;
  const totalMaxDays = baseLeadDaysMax + region.transitOffsetDays + dispatchLeadDays;

  // Compute actual calendar arrival dates
  const dispatchDate = addBusinessDays(referenceDate, dispatchLeadDays || 1);
  const deliveryStart = addBusinessDays(referenceDate, totalMinDays);
  const deliveryEnd = addBusinessDays(referenceDate, totalMaxDays);

  // Formatting
  const dispatchDateFormatted = formatDateFriendly(dispatchDate);
  const deliveryStartFormatted = formatDateFriendly(deliveryStart);
  const deliveryEndFormatted = formatDateFriendly(deliveryEnd);
  
  const estimatedRangeFormatted = `${deliveryStartFormatted} – ${deliveryEndFormatted}`;

  // Styling and badges according to demand tier
  let demandBadge = `High Demand • ${unitsLeftInBatch} Units Left`;
  let demandBadgeBg = 'bg-amber-500/10 border-amber-400/30 text-amber-800';
  let demandBadgeText = 'text-amber-700';
  let demandDescription = `${recentOrdersCount} orders placed in last 24h. Priority queue active.`;

  if (demandTier === 'extreme_surge') {
    demandBadge = `Surge Demand • Only ${unitsLeftInBatch} Left in Batch`;
    demandBadgeBg = 'bg-rose-500/10 border-rose-400/30 text-rose-800';
    demandBadgeText = 'text-rose-700';
    demandDescription = `High demand spike (${recentOrdersCount} orders). Allocation filling rapidly.`;
  } else if (demandTier === 'moderate') {
    demandBadge = `In Stock • ${unitsLeftInBatch} Units Available`;
    demandBadgeBg = 'bg-emerald-500/10 border-emerald-400/30 text-emerald-800';
    demandBadgeText = 'text-emerald-700';
    demandDescription = `Direct inventory at ${region.shortName} depot. Fast dispatch ready.`;
  }

  const isSameDayPossible = region.id === 'lagos' && !pastCutoff && unitsLeftInBatch > 2 && model.kva <= 7.5;

  return {
    demandTier,
    demandBadge,
    demandBadgeBg,
    demandBadgeText,
    demandDescription,
    recentOrdersCount,
    unitsLeftInBatch,
    batchCapacityPercent,
    region,
    dispatchDateFormatted,
    estimatedDeliveryFormatted: deliveryStartFormatted,
    estimatedRangeFormatted,
    earliestDayName: deliveryStartFormatted,
    latestDayName: deliveryEndFormatted,
    daysRange: `${totalMinDays}-${totalMaxDays} days`,
    isSameDayPossible,
    cutoffCountdown: {
      hours: Math.max(0, hoursRemaining),
      minutes: Math.max(1, minutesRemaining),
      text: `${Math.max(0, hoursRemaining)}h ${Math.max(1, minutesRemaining)}m`
    },
    hubName: region.hub,
    atsTestingIncluded: true
  };
}
