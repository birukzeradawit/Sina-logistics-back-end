import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXTAUTH_URL || "https://www.sinatrading.et";

  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/about", "/services", "/contact", "/llms.txt", "/llms-full.txt"],
        disallow: ["/staff/", "/api/"],
      },
      {
        userAgent: [
          "GPTBot",
          "OAI-SearchBot",
          "ChatGPT-User",
          "PerplexityBot",
          "ClaudeBot",
          "anthropic-ai",
          "Google-Extended",
          "Googlebot",
          "Applebot",
          "Applebot-Extended",
          "Bingbot",
        ],
        allow: ["/", "/about", "/services", "/contact", "/llms.txt", "/llms-full.txt"],
        disallow: ["/staff/", "/api/"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}

