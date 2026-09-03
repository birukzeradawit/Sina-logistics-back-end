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

/**
 * Fetches service sectors from the database, ordered by sortOrder.
 */
export async function getSectors(onlyActive = true): Promise<ServiceSectorDTO[]> {
  try {
    const sectors = await prisma.serviceSector.findMany({
      where: onlyActive ? { isActive: true } : undefined,
      orderBy: { sortOrder: "asc" },
    });
    return sectors;
  } catch (err) {
    console.error("[lib/sectors] Failed to fetch service sectors from DB:", err);
    return [];
  }
}
