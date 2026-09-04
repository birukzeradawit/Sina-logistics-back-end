import { prisma } from "@/lib/db";

export type ServiceSectorDTO = {
  id: string;
  code: string;
  slug: string;
  name: string;
  shortDesc: string;
  fullDesc: string | null;
  features: string[];
  iconSvg: string | null;
  sortOrder: number;
  isActive: boolean;
};

let sectorsCache: { data: ServiceSectorDTO[]; timestamp: number } | null = null;
const CACHE_TTL_MS = 60 * 1000; // 60 seconds

const FALLBACK_SECTORS: ServiceSectorDTO[] = [
  {
    id: "sec-01",
    code: "SV-01",
    slug: "procurement",
    name: "Procurement & Supply",
    shortDesc: "Office, hospitality, and event supplies, supplier sourcing, and inventory replenishment.",
    fullDesc: "With a strong network of vetted suppliers and verified service providers, SINA ensures timely delivery, quality assurance, and professional execution across everyday consumables to full-scale supplies.",
    features: ["Office consumables", "Hospitality supplies", "Supplier sourcing", "Inventory replenishment"],
    iconSvg: null,
    sortOrder: 1,
    isActive: true,
  },
  {
    id: "sec-02",
    code: "SV-02",
    slug: "logistics",
    name: "Logistics & Delivery",
    shortDesc: "Transportation coordination, delivery facilitation, distribution, and scheduled delivery.",
    fullDesc: "SINA coordinates local transportation, scheduled corporate delivery runs, multi-branch distribution, and event cargo movement across Addis Ababa and regional commercial corridors.",
    features: ["Local transportation", "Scheduled delivery runs", "Multi-site distribution", "Cargo tracking"],
    iconSvg: null,
    sortOrder: 2,
    isActive: true,
  },
  {
    id: "sec-03",
    code: "SV-03",
    slug: "events",
    name: "Event Organizing",
    shortDesc: "Corporate events, conferences, product launches, venue coordination, and full event logistics.",
    fullDesc: "From high-stakes international conferences to corporate retreats and product launches, SINA handles venue coordination, audiovisual setup, staging, protocol, and hospitality.",
    features: ["Corporate conferences", "Product launches", "Venue coordination", "AV & Staging"],
    iconSvg: null,
    sortOrder: 3,
    isActive: true,
  },
  {
    id: "sec-04",
    code: "SV-04",
    slug: "property",
    name: "Property Management",
    shortDesc: "Commercial and residential leasing, facility maintenance, cleaning, and security coordination.",
    fullDesc: "Comprehensive property and facility management ensuring corporate offices, commercial centers, and residential properties operate cleanly, securely, and efficiently.",
    features: ["Commercial leasing", "Facility maintenance", "Cleaning services", "Security coordination"],
    iconSvg: null,
    sortOrder: 4,
    isActive: true,
  },
  {
    id: "sec-05",
    code: "SV-05",
    slug: "staffing",
    name: "Staff Recruitment & Outsourcing",
    shortDesc: "Administrative, hospitality, event, and technical staff recruitment and management.",
    fullDesc: "Reliable workforce solutions connecting corporate clients with vetted administrative, hospitality, logistics, and technical staff with managed payroll and replacement cover.",
    features: ["Contract staffing", "Event personnel", "Front-office staff", "Payroll administration"],
    iconSvg: null,
    sortOrder: 5,
    isActive: true,
  },
  {
    id: "sec-06",
    code: "SV-06",
    slug: "support",
    name: "Additional Operational Support",
    shortDesc: "Hospitality, vendor negotiation, utility payments, and monthly operational reporting.",
    fullDesc: "Dedicated administrative and ground operational assistance to free your core management team from administrative friction and supplier coordination.",
    features: ["VIP protocol", "Vendor contract management", "Utility processing", "Monthly reporting"],
    iconSvg: null,
    sortOrder: 6,
    isActive: true,
  },
  {
    id: "sec-07",
    code: "SV-07",
    slug: "trade",
    name: "Trade & Supply Scope",
    shortDesc: "Licensed cargo, commodities, equipment, and materials supply across Ethiopia and beyond.",
    fullDesc: "Licensed international trade scope facilitating bulk commodity imports, industrial equipment distribution, raw materials, and cross-border commercial shipments.",
    features: ["Import/export trade", "Wholesale commodities", "Industrial equipment", "Customs clearance"],
    iconSvg: null,
    sortOrder: 7,
    isActive: true,
  },
  {
    id: "sec-08",
    code: "SV-08",
    slug: "construction",
    name: "Construction & Real Estate",
    shortDesc: "Contracting, materials, machinery, and commercial or residential property development.",
    fullDesc: "Procurement of heavy building materials, machinery rental facilitation, site logistics, and specialized commercial and residential contracting support.",
    features: ["Building materials", "Heavy machinery rental", "Subcontractor coordination", "Site logistics"],
    iconSvg: null,
    sortOrder: 8,
    isActive: true,
  },
  {
    id: "sec-09",
    code: "SV-09",
    slug: "agriculture",
    name: "Energy, Mining & Agriculture",
    shortDesc: "Energy and utilities, mining and quarrying, agri-commodities, and related supply.",
    fullDesc: "Strategic resources procurement and logistics for energy projects, mining sites, agricultural inputs, and bulk agricultural commodity distribution.",
    features: ["Agri-commodity trading", "Farming equipment", "Mining supplies", "Fuel distribution"],
    iconSvg: null,
    sortOrder: 9,
    isActive: true,
  },
];

export async function getSectors(onlyActive = true): Promise<ServiceSectorDTO[]> {
  const now = Date.now();
  if (sectorsCache && now - sectorsCache.timestamp < CACHE_TTL_MS) {
    const list = onlyActive ? sectorsCache.data.filter((s) => s.isActive) : sectorsCache.data;
    return list.length > 0 ? list : FALLBACK_SECTORS;
  }

  try {
    const sectors = await prisma.serviceSector.findMany({
      orderBy: { sortOrder: "asc" },
    });
    if (sectors.length > 0) {
      sectorsCache = { data: sectors, timestamp: now };
      return onlyActive ? sectors.filter((s) => s.isActive) : sectors;
    }
    return FALLBACK_SECTORS;
  } catch (err) {
    console.error("[lib/sectors] Failed to fetch service sectors from DB:", err);
    return FALLBACK_SECTORS;
  }
}

export function invalidateSectorsCache() {
  sectorsCache = null;
}

