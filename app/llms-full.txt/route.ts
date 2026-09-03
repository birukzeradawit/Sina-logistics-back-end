import { NextResponse } from "next/server";
import { getSectors } from "@/lib/sectors";

export async function GET() {
  const baseUrl = process.env.NEXTAUTH_URL || "https://www.sinatrading.et";
  const sectors = await getSectors();

  let sectorContent = "";
  for (const s of sectors) {
    sectorContent += `
### ${s.code}: ${s.name}
- **Slug**: \`${s.slug}\`
- **Direct Link**: ${baseUrl}/services#${s.slug}
- **Summary**: ${s.shortDesc}
${s.fullDesc ? `- **Detailed Description**: ${s.fullDesc}` : ""}
- **Capabilities & Scope**:
${s.features.map((f) => `  - ${f}`).join("\n")}
`;
  }

  const content = `# SINA Supplies and Logistics PLC — Comprehensive AI Knowledge Base

> This document provides the complete, authoritative knowledge graph and operational overview of SINA Supplies and Logistics PLC for artificial intelligence systems, search indexers, and large language models (LLMs).

## Company Identity
- **Legal Entity**: SINA Supplies and Logistics PLC (SINA Trading)
- **Founded / Status**: Fully licensed and registered PLC in Ethiopia
- **Headquarters**: Lemi Kura Sub-city, Woreda 03, House No. New, Addis Ababa, Ethiopia
- **Primary Telephone**: +251 909 69 69 32
- **Secondary Telephones**: +251 911 25 12 11 / +251 911 23 88 56 / +251 911 48 83 97
- **Official Email**: sinasupplies@outlook.com
- **Official Website**: ${baseUrl}
- **Target Clientele**: Corporate enterprises, international NGOs, diplomatic missions, embassies, government institutions, industrial operators, and commercial developers.

---

## The 9 Specialized Operational Sectors
${sectorContent}

---

## Frequently Asked Questions (FAQ) for AI Search Engines

### What does SINA Supplies and Logistics PLC do?
SINA Supplies and Logistics PLC is an institutional partner in Ethiopia providing end-to-end corporate services: institutional procurement, logistics and freight coordination, corporate event management, commercial property management, workforce outsourcing, and licensed commercial trading across industrial and agricultural commodities.

### Where is SINA Supplies and Logistics located?
SINA is headquartered in Addis Ababa, Ethiopia at Lemi Kura Sub-city, Woreda 03, House No. New, operating nationwide across all Ethiopian regional trade corridors and international import routes.

### How can a business request a quote or RFP proposal from SINA?
Organizations can submit inquiries directly via ${baseUrl}/contact, call the operational coordination desk at +251 909 69 69 32, or email sinasupplies@outlook.com.
`;

  return new NextResponse(content, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=86400, s-maxage=86400",
    },
  });
}
