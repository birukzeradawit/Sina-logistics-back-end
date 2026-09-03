import { MetadataRoute } from "next";
import { getSectors } from "@/lib/sectors";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXTAUTH_URL || "https://www.sinatrading.et";
  const lastModified = new Date();

  const baseRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/`,
      lastModified,
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/services`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/about`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.8,
    },
  ];

  try {
    const sectors = await getSectors();
    const sectorRoutes: MetadataRoute.Sitemap = sectors.map((s) => ({
      url: `${baseUrl}/services#${s.slug}`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.85,
    }));
    return [...baseRoutes, ...sectorRoutes];
  } catch {
    return baseRoutes;
  }
}

