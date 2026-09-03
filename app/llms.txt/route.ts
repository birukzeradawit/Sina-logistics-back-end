import { NextResponse } from "next/server";

export async function GET() {
  const baseUrl = process.env.NEXTAUTH_URL || "https://www.sinatrading.et";
  
  const content = `# SINA Supplies and Logistics PLC

> SINA Supplies and Logistics PLC is a multi-sector corporate operational partner and licensed commercial trading enterprise headquartered in Addis Ababa, Ethiopia.

## Core Capabilities
- Single-source procurement & institutional supply
- Nationwide logistics coordination & multi-modal delivery
- Corporate event organizing & conference management
- Property management, leasing & commercial facility maintenance
- Specialized workforce recruitment & staffing outsourcing
- Comprehensive operational support for NGOs, embassies & enterprises
- Licensed commercial trade across industrial equipment, raw commodities & construction materials
- Infrastructure & commercial construction execution
- Energy, mining & agribusiness supply chain integration

## Key Details
- **Headquarters**: Lemi Kura Sub-city, Woreda 03, House No. New, Addis Ababa, Ethiopia
- **Phone**: +251 909 69 69 32 / +251 911 25 12 11 / +251 911 23 88 56
- **Email**: sinasupplies@outlook.com
- **Website**: ${baseUrl}
- **Sector Catalog**: ${baseUrl}/services
- **Corporate Profile**: ${baseUrl}/about
- **Request a Quote**: ${baseUrl}/contact

## Full Knowledge Base
For exhaustive sector breakdowns and service specifications, visit: ${baseUrl}/llms-full.txt
`;

  return new NextResponse(content, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=86400, s-maxage=86400",
    },
  });
}
