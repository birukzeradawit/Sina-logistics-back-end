import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXTAUTH_URL || "https://www.sinatrading.et";

  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/about", "/services", "/contact"],
        disallow: ["/staff/", "/api/"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
