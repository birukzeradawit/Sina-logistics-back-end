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

export async function getSectors(onlyActive = true): Promise<ServiceSectorDTO[]> {
  const now = Date.now();
  if (sectorsCache && now - sectorsCache.timestamp < CACHE_TTL_MS) {
    return onlyActive ? sectorsCache.data.filter((s) => s.isActive) : sectorsCache.data;
  }

  try {
    const sectors = await prisma.serviceSector.findMany({
      orderBy: { sortOrder: "asc" },
    });
    sectorsCache = { data: sectors, timestamp: now };
    return onlyActive ? sectors.filter((s) => s.isActive) : sectors;
  } catch (err) {
    console.error("[lib/sectors] Failed to fetch service sectors from DB:", err);
    return sectorsCache ? (onlyActive ? sectorsCache.data.filter((s) => s.isActive) : sectorsCache.data) : [];
  }
}

export function invalidateSectorsCache() {
  sectorsCache = null;
}

