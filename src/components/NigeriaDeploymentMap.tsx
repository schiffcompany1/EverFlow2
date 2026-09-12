import React, { useState } from 'react';
import { 
  MapPin, 
  ShieldCheck, 
  Zap, 
  VolumeX, 
  Clock, 
  TrendingDown, 
  Building2, 
  Home, 
  Award, 
  CheckCircle2, 
  ArrowRight,
  Sparkles,
  Users,
  Compass
} from 'lucide-react';
import { useStore } from '../context/StoreContext';

interface DeploymentLocation {
  id: string;
  name: string;
  state: string;
  region: 'southwest' | 'north' | 'southsouth' | 'southeast';
  regionLabel: string;
  neighborhoods: string;
  x: number; // SVG coordinates in 800x600 viewBox
  y: number;
  deployedUnits: number;
  flagshipModel: string;
  primaryApplication: string;
  loadProfile: string;
  decibelRating: string;
  monthlyFuelSaved: string;
  uptimeRate: string;
  atsSpeed: string;
  clientType: 'Residential Villa' | 'Diplomatic & Medical' | 'Corporate & Industrial' | 'Executive Penthouse';
  verifiedQuote: string;
  clientName: string;
}

const DEPLOYMENT_LOCATIONS: DeploymentLocation[] = [
  {
    id: 'lagos',
    name: 'Lagos Metropolitan & Coastal Estates',
    state: 'Lagos State',
    region: 'southwest',
    regionLabel: 'South-West',
    neighborhoods: 'Banana Island, Ikoyi, Lekki Phase 1, Victoria Island, Ikeja GRA, Magodo',
    x: 155,
    y: 505,
    deployedUnits: 520,
    flagshipModel: 'EverFlow Duo 15 & Trio 30',
    primaryApplication: 'Luxury Residential Compounds & Tech Penthouses',
    loadProfile: '4–6 Inverter ACs, Swimming Pool Pumps, Starlink, EV Chargers',
    decibelRating: '0.0 dB (Total Silence)',
    monthlyFuelSaved: '₦720,000 / mo',
    uptimeRate: '100% (Zero Downtime)',
    atsSpeed: '4.1 ms',
    clientType: 'Executive Penthouse',
    verifiedQuote: 'In Banana Island where noise bylaws are strict, running zero-decibel perpetual power has been a revelation. Our 35kVA diesel gen is permanently shut down.',
    clientName: 'Chief T. Balogun (Estate Chairman)'
  },
  {
    id: 'abuja',
    name: 'Abuja Federal Capital Territory',
    state: 'FCT Abuja',
    region: 'north',
    regionLabel: 'FCT & North',
    neighborhoods: 'Maitama, Asokoro, Guzape, Wuse II, Jabi Lake',
    x: 395,
    y: 330,
    deployedUnits: 345,
    flagshipModel: 'EverFlow Duo 15 & Mega 60',
    primaryApplication: 'Diplomatic Residences, Surgical Theatres & Private Villas',
    loadProfile: 'Central Ducted ACs, Medical Diagnostic Scanners, Security Perimeters',
    decibelRating: '0.0 dB (Silent)',
    monthlyFuelSaved: '₦880,000 / mo',
    uptimeRate: '99.99%',
    atsSpeed: '3.8 ms',
    clientType: 'Diplomatic & Medical',
    verifiedQuote: 'The pure 50.0 Hz sine wave protected our surgical microscopes and laboratory cooling with zero micro-flicker during public utility blackouts.',
    clientName: 'Dr. Amina Bello (Medical Director)'
  },
  {
    id: 'phc',
    name: 'Port Harcourt & Niger Delta Freight Belt',
    state: 'Rivers State',
    region: 'southsouth',
    regionLabel: 'South-South',
    neighborhoods: 'Old GRA, Peter Odili Road, Trans-Amadi Industrial Layout, Woji',
    x: 380,
    y: 535,
    deployedUnits: 235,
    flagshipModel: 'EverFlow Trio 30 & Mega 60',
    primaryApplication: 'Oil & Gas Logistics Headquarters & Private Waterfront Duplexes',
    loadProfile: 'Heavy Inductive Motors, Cold Storage, 8 Inverter Split Units',
    decibelRating: '0.0 dB (Silent)',
    monthlyFuelSaved: '₦1,150,000 / mo',
    uptimeRate: '100%',
    atsSpeed: '4.5 ms',
    clientType: 'Corporate & Industrial',
    verifiedQuote: 'Replacing diesel haulage and noisy 50kVA generators eliminated soot, toxic fumes, and weekly filter replacements completely.',
    clientName: 'Engr. Kenneth Briggs (Operations Lead)'
  },
  {
    id: 'ibadan',
    name: 'Ibadan Urban & University Belt',
    state: 'Oyo State',
    region: 'southwest',
    regionLabel: 'South-West',
    neighborhoods: 'Bodija GRA, Oluyole Estate, Jericho, Alalubosa',
    x: 185,
    y: 455,
    deployedUnits: 140,
    flagshipModel: 'EverFlow Solo 3.5 & Prime 7.5',
    primaryApplication: 'Modern Residential Duplexes & Professional Home Studios',
    loadProfile: '3 Inverter ACs, Deep Freezer, Submersible Borehole Pump',
    decibelRating: '0.0 dB (Silent)',
    monthlyFuelSaved: '₦380,000 / mo',
    uptimeRate: '99.98%',
    atsSpeed: '4.2 ms',
    clientType: 'Residential Villa',
    verifiedQuote: 'The Pay-Small-Small financing was completely seamless. My family sleeps peacefully at night without the persistent rumble of a generator.',
    clientName: 'Prof. Olufemi Adebayo'
  },
  {
    id: 'enugu',
    name: 'Enugu & South-East Commercial Hub',
    state: 'Enugu State',
    region: 'southeast',
    regionLabel: 'South-East',
    neighborhoods: 'Independence Layout, GRA Enugu, Trans-Ekulu, New Haven',
    x: 425,
    y: 460,
    deployedUnits: 115,
    flagshipModel: 'EverFlow Prime 7.5 & Duo 15',
    primaryApplication: 'Commercial Laboratories & Multi-Family Residential Compounds',
    loadProfile: 'Diagnostic Blood Centrifuges, Refrigeration, 4 ACs',
    decibelRating: '0.0 dB (Silent)',
    monthlyFuelSaved: '₦490,000 / mo',
    uptimeRate: '100%',
    atsSpeed: '4.0 ms',
    clientType: 'Diplomatic & Medical',
    verifiedQuote: 'Our sensitive diagnostic equipment requires clean harmonics. EverFlow delivers cleaner voltage stability than any inverter setup we tested.',
    clientName: 'Dr. Chinedu Eze'
  },
  {
    id: 'kano',
    name: 'Kano Industrial & Commercial Gateway',
    state: 'Kano State',
    region: 'north',
    regionLabel: 'FCT & North',
    neighborhoods: 'Nasarawa GRA, Bompai Industrial Area, Sharada, Fagge',
    x: 465,
    y: 140,
    deployedUnits: 98,
    flagshipModel: 'EverFlow Trio 30 & Mega 60',
    primaryApplication: 'Agro-Processing Logistics, Textile Facilities & Executive Homes',
    loadProfile: 'Milling Equipment, Industrial Air Curtains, High-Draw Compressors',
    decibelRating: '0.0 dB (Silent)',
    monthlyFuelSaved: '₦940,000 / mo',
    uptimeRate: '99.97%',
    atsSpeed: '4.4 ms',
    clientType: 'Corporate & Industrial',
    verifiedQuote: 'Even when outside ambient temperatures surpass 41°C in March, the cold-chassis core operates cool to the touch with zero thermal derating.',
    clientName: 'Alhaji Sanusi Dantata'
  },
  {
    id: 'warri',
    name: 'Warri & Asaba Capital Delta Belt',
    state: 'Delta State',
    region: 'southsouth',
    regionLabel: 'South-South',
    neighborhoods: 'GRA Warri, Airport Road Asaba, Effurun, Okpanam',
    x: 300,
    y: 505,
    deployedUnits: 82,
    flagshipModel: 'EverFlow Prime 7.5 & Duo 15',
    primaryApplication: 'Private Residential Compounds & Engineering Consultancies',
    loadProfile: '4 Split ACs, Water Treatment Plant, Computing Workstations',
    decibelRating: '0.0 dB (Silent)',
    monthlyFuelSaved: '₦460,000 / mo',
    uptimeRate: '100%',
    atsSpeed: '4.3 ms',
    clientType: 'Residential Villa',
    verifiedQuote: 'We survived the recent four-week localized grid collapse with zero interruption. The ATS transfer is so fast our Starlink router never even rebooted.',
    clientName: 'Mrs. Ese Oghene'
  },
  {
    id: 'ogun',
    name: 'Abeokuta & Sagamu Industrial Corridor',
    state: 'Ogun State',
    region: 'southwest',
    regionLabel: 'South-West',
    neighborhoods: 'Ibara GRA, Sagamu Interchange Corridor, Magboro Industrial',
    x: 165,
    y: 480,
    deployedUnits: 92,
    flagshipModel: 'EverFlow Trio 30 & Mega 60',
    primaryApplication: 'Packaging Plants, Warehouses & Luxury Country Mansions',
    loadProfile: 'Automated Conveyor Motors, 3-Phase Injection Molds, 10 ACs',
    decibelRating: '0.0 dB (Silent)',
    monthlyFuelSaved: '₦1,050,000 / mo',
    uptimeRate: '100%',
    atsSpeed: '3.9 ms',
    clientType: 'Corporate & Industrial',
    verifiedQuote: 'We eliminated our daily fuel logistics headache and driver diesel theft. The units run 24 hours without a sound.',
    clientName: 'Otunba Gboyega Adeleke'
  }
];

export const NigeriaDeploymentMap: React.FC = () => {
  const { openInquiryModal, setSelectedDeliveryRegion } = useStore();
  const [activeLocationId, setActiveLocationId] = useState<string>('lagos');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'southwest' | 'north' | 'southsouth' | 'southeast'>('all');
  const [hoveredLocationId, setHoveredLocationId] = useState<string | null>(null);

  const activeLocation = DEPLOYMENT_LOCATIONS.find((l) => l.id === activeLocationId) || DEPLOYMENT_LOCATIONS[0];

  const filteredLocations = DEPLOYMENT_LOCATIONS.filter((loc) => {
    if (selectedFilter === 'all') return true;
    return loc.region === selectedFilter;
  });

  const handleSelectLocation = (loc: DeploymentLocation) => {
    setActiveLocationId(loc.id);
    if (loc.id === 'lagos') setSelectedDeliveryRegion('lagos');
    else if (loc.id === 'abuja') setSelectedDeliveryRegion('abuja');
    else if (loc.id === 'phc' || loc.id === 'warri') setSelectedDeliveryRegion('phc');
    else if (loc.id === 'ibadan' || loc.id === 'ogun') setSelectedDeliveryRegion('ibadan');
    else setSelectedDeliveryRegion('nationwide');
  };

  const handleInquireForLocation = (loc: DeploymentLocation) => {
    openInquiryModal(`Deployment Inquiry for ${loc.state} (${loc.name})`, loc.flagshipModel.split('&')[0].trim());
  };

  return (
    <section id="deployments-map" className="py-20 border-b border-emerald-100 relative bg-slate-900 text-white overflow-hidden">
      {/* Background ambient gradient glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-emerald-600/10 rounded-full blur-[140px] pointer-events-none -z-0" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-cyan-600/10 rounded-full blur-[120px] pointer-events-none -z-0" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 text-xs font-bold uppercase tracking-wider">
            <Compass className="w-3.5 h-3.5 text-emerald-400" />
            <span>Interactive Deployment Map</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white font-heading tracking-tight">
            Active EverFlow Deployments Across Nigeria
          </h2>

          <p className="text-base sm:text-lg text-slate-300">
            Explore live installations operating in residential estates, hospitals, and corporate hubs with 0.0 dB silence and zero fuel consumption.
          </p>
        </div>

        {/* National Performance Metrics Banner */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
          <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80 backdrop-blur-md text-left">
            <div className="text-2xl sm:text-3xl font-black text-emerald-400 font-heading">1,420+</div>
            <div className="text-xs text-slate-300 mt-1 font-semibold">Active Units Nationwide</div>
            <div className="text-[10px] text-emerald-500/80 mt-0.5">Across 36 states & FCT</div>
          </div>
          <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80 backdrop-blur-md text-left">
            <div className="text-2xl sm:text-3xl font-black text-white font-heading">₦2.4B+</div>
            <div className="text-xs text-slate-300 mt-1 font-semibold">Fuel Expenses Eliminated</div>
            <div className="text-[10px] text-slate-400 mt-0.5">Verified customer savings</div>
          </div>
          <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80 backdrop-blur-md text-left">
            <div className="text-2xl sm:text-3xl font-black text-emerald-400 font-heading">0.0 dB</div>
            <div className="text-xs text-slate-300 mt-1 font-semibold">Acoustic Compliance</div>
            <div className="text-[10px] text-emerald-500/80 mt-0.5">100% zero-noise certified</div>
          </div>
          <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80 backdrop-blur-md text-left">
            <div className="text-2xl sm:text-3xl font-black text-white font-heading">99.98%</div>
            <div className="text-xs text-slate-300 mt-1 font-semibold">Average Power Uptime</div>
            <div className="text-[10px] text-slate-400 mt-0.5">&lt;8ms seamless ATS cutover</div>
          </div>
        </div>

        {/* Region Filter Tabs */}
        <div className="flex items-center justify-between flex-wrap gap-3 mb-8">
          <div className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-slate-800/90 border border-slate-700 backdrop-blur-md overflow-x-auto max-w-full">
            {[
              { id: 'all', label: 'All Nigeria (8 Hubs)' },
              { id: 'southwest', label: 'South-West (Lagos & Ibadan)' },
              { id: 'north', label: 'FCT Abuja & North' },
              { id: 'southsouth', label: 'South-South (PHC & Warri)' },
              { id: 'southeast', label: 'South-East (Enugu)' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setSelectedFilter(tab.id as any);
                  const matched = DEPLOYMENT_LOCATIONS.find((l) => tab.id === 'all' || l.region === tab.id);
                  if (matched) setActiveLocationId(matched.id);
                }}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
                  selectedFilter === tab.id
                    ? 'bg-emerald-500 text-slate-950 shadow-md font-extrabold'
                    : 'text-slate-400 hover:text-white hover:bg-slate-700/60'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="text-xs text-slate-400 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping inline-block" />
            <span>Click any marker to inspect installation dossier</span>
          </div>
        </div>

        {/* Main Grid: Interactive Map (Left/Top) + Deployment Dossier (Right/Bottom) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* SVG Map Container */}
          <div className="lg:col-span-7 bg-slate-950/80 rounded-3xl border border-slate-800 p-4 sm:p-6 relative shadow-2xl overflow-hidden group">
            
            {/* Subtle Map Grid lines background */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

            {/* Interactive SVG Overlay of Nigeria */}
            <div className="relative w-full aspect-[4/3] max-h-[520px]">
              <svg 
                viewBox="0 0 800 620" 
                className="w-full h-full drop-shadow-md select-none"
              >
                <defs>
                  {/* Linear gradient for Nigeria landmass */}
                  <linearGradient id="nigeriaLandGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#0f291e" stopOpacity="0.85" />
                    <stop offset="50%" stopColor="#133324" stopOpacity="0.9" />
                    <stop offset="100%" stopColor="#0b2016" stopOpacity="0.95" />
                  </linearGradient>

                  {/* Water / Rivers Glow */}
                  <filter id="riverGlow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="2" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>

                  {/* Active Pin Radial Glow */}
                  <radialGradient id="pinGlow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#10b981" stopOpacity="0.9" />
                    <stop offset="70%" stopColor="#10b981" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                  </radialGradient>
                </defs>

                {/* Surrounding Maritime / Ocean Area at the South */}
                <path
                  d="M 60 540 Q 250 520 400 560 T 780 570 L 780 620 L 0 620 L 0 540 Z"
                  fill="#030712"
                  opacity="0.6"
                />

                {/* Atlantic Ocean Label */}
                <text x="260" y="595" fill="#334155" fontSize="13" fontWeight="bold" letterSpacing="4" opacity="0.6">
                  GULF OF GUINEA / ATLANTIC OCEAN
                </text>

                {/* Neighboring Country Subtle Boundaries */}
                <text x="40" y="320" fill="#334155" fontSize="12" fontWeight="bold" letterSpacing="2" opacity="0.4" transform="rotate(-90 40 320)">
                  BENIN REPUBLIC
                </text>
                <text x="390" y="45" fill="#334155" fontSize="12" fontWeight="bold" letterSpacing="3" opacity="0.4">
                  NIGER REPUBLIC
                </text>
                <text x="680" y="420" fill="#334155" fontSize="12" fontWeight="bold" letterSpacing="2" opacity="0.4" transform="rotate(70 680 420)">
                  CAMEROON
                </text>
                <text x="730" y="70" fill="#0284c7" fontSize="10" fontWeight="bold" opacity="0.5">
                  LAKE CHAD
                </text>

                {/* Stylized Nigeria Landmass Silhouette Path */}
                <path
                  id="nigeria-boundary"
                  d="M 115 515
                     L 95 480
                     L 92 410
                     L 88 350
                     L 100 295
                     L 125 240
                     L 135 190
                     L 155 125
                     L 195 80
                     L 260 62
                     L 340 58
                     L 435 65
                     L 520 85
                     L 600 78
                     L 680 72
                     L 740 95
                     L 730 150
                     L 705 210
                     L 675 270
                     L 645 330
                     L 615 390
                     L 555 450
                     L 505 500
                     L 465 548
                     L 420 555
                     L 365 565
                     L 310 545
                     L 230 528
                     L 165 522
                     Z"
                  fill="url(#nigeriaLandGradient)"
                  stroke="#10b981"
                  strokeWidth="2"
                  strokeOpacity="0.5"
                  className="transition-all duration-300"
                />

                {/* Subtle Regional Dividing Guidemarks */}
                <path
                  d="M 92 410 Q 240 430 380 410"
                  stroke="#10b981"
                  strokeWidth="0.8"
                  strokeDasharray="4 4"
                  strokeOpacity="0.2"
                  fill="none"
                />
                <path
                  d="M 380 410 Q 550 420 645 330"
                  stroke="#10b981"
                  strokeWidth="0.8"
                  strokeDasharray="4 4"
                  strokeOpacity="0.2"
                  fill="none"
                />
                <path
                  d="M 380 58 L 380 410"
                  stroke="#10b981"
                  strokeWidth="0.8"
                  strokeDasharray="4 4"
                  strokeOpacity="0.2"
                  fill="none"
                />

                {/* Iconic Rivers: River Niger & River Benue Confluence at Lokoja */}
                {/* River Niger (from NW to Lokoja) */}
                <path
                  d="M 135 190 
                     Q 175 240 210 280 
                     T 260 320 
                     T 340 370 
                     L 375 410"
                  stroke="#06b6d4"
                  strokeWidth="2.5"
                  strokeOpacity="0.6"
                  fill="none"
                  filter="url(#riverGlow)"
                />
                {/* River Benue (from Cameroon East to Lokoja) */}
                <path
                  d="M 660 310 
                     Q 600 340 540 360 
                     T 440 390 
                     L 375 410"
                  stroke="#06b6d4"
                  strokeWidth="2.5"
                  strokeOpacity="0.6"
                  fill="none"
                  filter="url(#riverGlow)"
                />
                {/* Lower Niger & Niger Delta mouths (from Lokoja down south to ocean) */}
                <path
                  d="M 375 410 
                     Q 380 470 375 510 
                     Q 360 545 340 560
                     M 375 510 
                     Q 385 535 390 560
                     M 375 510 
                     Q 345 525 320 545"
                  stroke="#06b6d4"
                  strokeWidth="2.2"
                  strokeOpacity="0.6"
                  fill="none"
                  filter="url(#riverGlow)"
                />

                {/* Confluence Label (Lokoja) */}
                <circle cx="375" cy="410" r="3" fill="#06b6d4" />
                <text x="385" y="414" fill="#67e8f9" fontSize="9" fontWeight="bold" opacity="0.7">
                  Lokoja (Confluence)
                </text>

                {/* Regional Geopolitical Watermarks */}
                <text x="450" y="95" fill="#34d399" fontSize="11" fontWeight="bold" opacity="0.3" letterSpacing="1">
                  NORTH-WEST
                </text>
                <text x="610" y="160" fill="#34d399" fontSize="11" fontWeight="bold" opacity="0.3" letterSpacing="1">
                  NORTH-EAST
                </text>
                <text x="340" y="270" fill="#34d399" fontSize="11" fontWeight="bold" opacity="0.35" letterSpacing="1">
                  NORTH-CENTRAL (MIDDLE BELT)
                </text>
                <text x="140" y="430" fill="#34d399" fontSize="11" fontWeight="bold" opacity="0.35" letterSpacing="1">
                  SOUTH-WEST
                </text>
                <text x="440" y="480" fill="#34d399" fontSize="11" fontWeight="bold" opacity="0.35" letterSpacing="1">
                  SOUTH-EAST
                </text>
                <text x="310" y="530" fill="#34d399" fontSize="11" fontWeight="bold" opacity="0.35" letterSpacing="1">
                  SOUTH-SOUTH
                </text>

                {/* Deployment Location Interactive Pins */}
                {filteredLocations.map((loc) => {
                  const isActive = loc.id === activeLocationId;
                  const isHovered = loc.id === hoveredLocationId;

                  return (
                    <g 
                      key={loc.id}
                      className="cursor-pointer transition-transform"
                      onClick={() => handleSelectLocation(loc)}
                      onMouseEnter={() => setHoveredLocationId(loc.id)}
                      onMouseLeave={() => setHoveredLocationId(null)}
                    >
                      {/* Active / Highlight Pulse Rings */}
                      {isActive && (
                        <>
                          <circle
                            cx={loc.x}
                            cy={loc.y}
                            r="28"
                            fill="url(#pinGlow)"
                            className="animate-pulse"
                          />
                          <circle
                            cx={loc.x}
                            cy={loc.y}
                            r="18"
                            fill="none"
                            stroke="#34d399"
                            strokeWidth="1.5"
                            strokeOpacity="0.8"
                            className="animate-ping"
                          />
                        </>
                      )}

                      {/* Regular Ping Ring for all active locations */}
                      {!isActive && (
                        <circle
                          cx={loc.x}
                          cy={loc.y}
                          r="12"
                          fill="#10b981"
                          fillOpacity="0.2"
                          stroke="#10b981"
                          strokeWidth="1"
                          strokeOpacity="0.4"
                        />
                      )}

                      {/* Main Pin Circle */}
                      <circle
                        cx={loc.x}
                        cy={loc.y}
                        r={isActive ? "9" : isHovered ? "8" : "6"}
                        fill={isActive ? "#10b981" : isHovered ? "#34d399" : "#059669"}
                        stroke="#ffffff"
                        strokeWidth={isActive ? "2.5" : "1.5"}
                        className="transition-all duration-200 shadow-lg"
                      />

                      {/* Inner Core Dot */}
                      <circle
                        cx={loc.x}
                        cy={loc.y}
                        r={isActive ? "3.5" : "2"}
                        fill="#ffffff"
                      />

                      {/* Label Tag on Map */}
                      <rect
                        x={loc.x - (loc.name.split(' ')[0].length * 3.5 + 14)}
                        y={loc.y - 28}
                        width={loc.name.split(' ')[0].length * 7 + 28}
                        height="18"
                        rx="9"
                        fill={isActive ? "#064e3b" : "#0f172a"}
                        stroke={isActive ? "#34d399" : "#334155"}
                        strokeWidth="1"
                        opacity={isActive || isHovered ? "1" : "0.85"}
                      />
                      <text
                        x={loc.x}
                        y={loc.y - 16}
                        textAnchor="middle"
                        fill={isActive ? "#a7f3d0" : "#e2e8f0"}
                        fontSize="9.5"
                        fontWeight="bold"
                        letterSpacing="0.5"
                      >
                        {loc.name.split(' ')[0]} ({loc.deployedUnits})
                      </text>
                    </g>
                  );
                })}
              </svg>

              {/* Hover Tooltip Overlay */}
              {hoveredLocationId && (
                (() => {
                  const hLoc = DEPLOYMENT_LOCATIONS.find((l) => l.id === hoveredLocationId);
                  if (!hLoc) return null;
                  return (
                    <div 
                      className="absolute z-30 pointer-events-none p-3 rounded-xl bg-slate-900/95 border border-emerald-500/50 shadow-2xl backdrop-blur-md text-left text-xs max-w-xs transition-opacity"
                      style={{
                        left: `${(hLoc.x / 800) * 100}%`,
                        top: `${(hLoc.y / 620) * 100}%`,
                        transform: 'translate(-50%, -125%)'
                      }}
                    >
                      <div className="flex items-center gap-1.5 font-bold text-emerald-400 font-heading">
                        <MapPin className="w-3.5 h-3.5" />
                        <span>{hLoc.name}</span>
                      </div>
                      <div className="text-[11px] text-slate-300 mt-1">
                        <strong>{hLoc.deployedUnits} Units</strong> • {hLoc.flagshipModel}
                      </div>
                      <div className="text-[10px] text-emerald-300 mt-0.5">
                        {hLoc.monthlyFuelSaved} saved on fuel
                      </div>
                    </div>
                  );
                })()
              )}
            </div>

            {/* Map Legend Bar */}
            <div className="mt-4 pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between text-xs text-slate-400 gap-3">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block border border-white" />
                  <span className="text-slate-300">Selected Hub</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-700 inline-block" />
                  <span>Active Deployment Cluster</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-1 bg-cyan-500 rounded-full inline-block" />
                  <span>River Niger/Benue Logistics Waterway</span>
                </div>
              </div>

              <div className="text-[11px] text-emerald-400 font-mono">
                Real-Time Telemetry Connected
              </div>
            </div>
          </div>

          {/* Deployment Dossier Card (Right Side) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-slate-950/90 rounded-3xl border border-emerald-500/30 p-6 sm:p-7 shadow-2xl relative overflow-hidden text-left">
              {/* Subtle green glow */}
              <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

              {/* Dossier Header */}
              <div className="flex items-start justify-between gap-4 pb-5 border-b border-slate-800">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-1 rounded-full bg-emerald-950 border border-emerald-500/40 text-emerald-400">
                      {activeLocation.regionLabel}
                    </span>
                    <span className="text-xs text-slate-400 font-semibold">
                      {activeLocation.state}
                    </span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-white font-heading mt-2">
                    {activeLocation.name}
                  </h3>
                </div>

                <div className="text-right shrink-0">
                  <div className="text-2xl font-black text-emerald-400 font-heading">
                    {activeLocation.deployedUnits}
                  </div>
                  <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                    Units Deployed
                  </div>
                </div>
              </div>

              {/* Verified Neighborhoods */}
              <div className="py-4 border-b border-slate-800 space-y-1">
                <div className="text-[11px] uppercase tracking-wider text-slate-400 font-bold flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Active Neighborhoods & Estates:</span>
                </div>
                <div className="text-xs text-slate-200 font-medium leading-relaxed">
                  {activeLocation.neighborhoods}
                </div>
              </div>

              {/* Technical Profile Grid */}
              <div className="py-4 border-b border-slate-800 grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <div className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">
                    Primary Models:
                  </div>
                  <div className="text-xs font-bold text-emerald-300 font-mono">
                    {activeLocation.flagshipModel}
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">
                    Decibel Compliance:
                  </div>
                  <div className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                    <VolumeX className="w-3.5 h-3.5" />
                    <span>{activeLocation.decibelRating}</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">
                    Monthly Fuel Eliminated:
                  </div>
                  <div className="text-sm font-black text-emerald-400 font-mono">
                    {activeLocation.monthlyFuelSaved}
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">
                    ATS Transfer Speed:
                  </div>
                  <div className="text-xs font-bold text-slate-200 flex items-center gap-1">
                    <Zap className="w-3 h-3 text-amber-400" />
                    <span>{activeLocation.atsSpeed}</span>
                  </div>
                </div>
              </div>

              {/* Typical Load Profile */}
              <div className="py-4 border-b border-slate-800 space-y-1.5">
                <div className="text-[11px] uppercase tracking-wider text-slate-400 font-bold flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Continuous 24/7 Load Verified:</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs text-slate-300 font-mono">
                  {activeLocation.loadProfile}
                </div>
              </div>

              {/* Verified Field Testimonial */}
              <div className="py-4 space-y-2">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1">
                    <Award className="w-3.5 h-3.5 text-amber-400" />
                    <span>On-Site Client Log</span>
                  </span>
                  <span className="text-[10px] text-emerald-400 font-semibold bg-emerald-950 px-2 py-0.5 rounded-full border border-emerald-800">
                    {activeLocation.clientType}
                  </span>
                </div>
                <blockquote className="text-xs italic text-slate-300 leading-relaxed bg-slate-900/60 p-3 rounded-xl border border-slate-800/80">
                  "{activeLocation.verifiedQuote}"
                </blockquote>
                <div className="text-xs font-bold text-slate-200 flex items-center gap-1.5 pt-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{activeLocation.clientName}</span>
                </div>
              </div>

              {/* Direct Inquire & Deployment Action */}
              <div className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <button
                  id={`btn-deploy-${activeLocation.id}`}
                  onClick={() => handleInquireForLocation(activeLocation)}
                  className="w-full py-3 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-98 cursor-pointer shadow-lg shadow-emerald-500/20"
                >
                  <MapPin className="w-3.5 h-3.5" />
                  <span>Inquire for {activeLocation.name.split(' ')[0]} Delivery</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
