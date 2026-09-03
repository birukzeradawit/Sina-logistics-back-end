import { readFileSync } from "fs";
import { resolve } from "path";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

for (const file of [".env.local", ".env"]) {
  try {
    const text = readFileSync(resolve(process.cwd(), file), "utf8");
    for (const line of text.split(/\r?\n/)) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eq = trimmed.indexOf("=");
      if (eq < 1) continue;
      const key = trimmed.slice(0, eq).trim();
      let val = trimmed.slice(eq + 1).trim();
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1);
      }
      if (!process.env[key]) process.env[key] = val;
    }
  } catch {
  }
}

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash("ChangeMe123!", 12);
  const admin = await prisma.staffUser.upsert({
    where: { email: "admin@sinatrading.et" },
    update: {},
    create: {
      email: "admin@sinatrading.et",
      passwordHash,
      role: "ADMIN",
    },
  });
  console.log("Seeded admin account:", admin.email);

  const blocks = [
    { key: "home.hero.eyebrow", page: "home", label: "Hero Eyebrow", value: "INTERNATIONAL TRADING  &  COMMERCIAL SUPPLIES" },
    { key: "home.hero.heading", page: "home", label: "Hero Heading", value: "Your goods, our priority." },
    { key: "home.hero.lead", page: "home", label: "Hero Lead Paragraph", value: "SINA Supplies and Logistics PLC is a single-source partner for corporate organizations — procurement, logistics, event management, property management, and staffing, delivered as one coordinated service.", type: "RICH_TEXT" as const },
    { key: "home.hero.image", page: "home", label: "Hero Banner Image", value: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80", type: "IMAGE_URL" as const },
    { key: "home.overview.heading", page: "home", label: "Overview Heading", value: "Reliable operational support, under one provider." },
    { key: "home.overview.body", page: "home", label: "Overview Body", value: "Established to deliver reliable, efficient, and cost-effective support to corporate organizations, institutions, and private clients. With a strong network of suppliers, service providers, and logistics partners, SINA ensures timely delivery, quality assurance, and professional execution across every area of operation.", type: "RICH_TEXT" as const },
    { key: "home.sectors.heading", page: "home", label: "Sectors Section Heading", value: "Nine sectors, one provider." },
    { key: "home.sectors.lead", page: "home", label: "Sectors Section Lead", value: "A single-source partner across nine sectors — so clients coordinate one relationship instead of a dozen vendors.", type: "RICH_TEXT" as const },
    
    { key: "about.hero.heading", page: "about", label: "About Hero Heading", value: "Integrated support for Ethiopia." },
    { key: "about.hero.lead", page: "about", label: "About Hero Lead", value: "SINA Supplies and Logistics PLC delivers reliable, efficient, and cost-effective operational support to corporate organizations, institutions, and private clients.", type: "RICH_TEXT" as const },
    { key: "about.hero.image", page: "about", label: "About Banner Image", value: "https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=1200&q=80", type: "IMAGE_URL" as const },
    { key: "about.intro.heading", page: "about", label: "About Intro Heading", value: "Who We Are" },
    { key: "about.intro.body", page: "about", label: "About Intro Body", value: "SINA Supplies and Logistics PLC is a dynamic Ethiopian company specializing in procurement, logistics coordination, event management, property management, staffing solutions, and integrated business support services.", type: "RICH_TEXT" as const },
    { key: "about.vision.heading", page: "about", label: "Vision Section Heading", value: "Vision & Mission" },
    { key: "about.vision.text", page: "about", label: "Vision Text", value: "To become one of Ethiopia’s leading integrated procurement, logistics, and business support service providers, recognized for reliability, professionalism, and customer satisfaction.", type: "RICH_TEXT" as const },
    { key: "about.why.heading", page: "about", label: "Why Choose SINA Heading", value: "Why Clients Choose SINA" },
    { key: "about.method.heading", page: "about", label: "Working Method Heading", value: "Working Methodology" },
    { key: "about.benefits.heading", page: "about", label: "Expected Benefits Heading", value: "Expected Benefits" },
    { key: "about.csr.heading", page: "about", label: "Strategic Focus Heading", value: "Built to serve local and international organizations" },
    { key: "about.csr.body", page: "about", label: "Strategic Focus Body", value: "SINA Supplies and Logistics PLC is committed to expanding its integrated business support solutions across Ethiopia by investing in technology, strengthening supplier partnerships, enhancing service quality, and developing a highly skilled operational team.\n\nThe same network that supports day-to-day corporate operations also underpins a wider licensed supply scope — from cargo and commodities to equipment and materials. See the full list on our services page.", type: "RICH_TEXT" as const },

    { key: "services.hero.heading", page: "services", label: "Services Hero Heading", value: "Nine sectors, one accountable partner." },
    { key: "services.hero.lead", page: "services", label: "Services Hero Lead", value: "Premium operational support for corporate organizations — plus a licensed trade and supply scope across logistics, commodities, equipment, and materials.", type: "RICH_TEXT" as const },
    { key: "services.hero.image", page: "services", label: "Services Banner Image", value: "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=1200&q=80", type: "IMAGE_URL" as const },

    { key: "contact.hero.lead", page: "contact", label: "Contact Hero Lead", value: "Procurement, logistics, events, property, staffing, or a trade enquiry — the team will respond with a tailored plan.", type: "RICH_TEXT" as const },
    { key: "contact.address", page: "contact", label: "Visit Us Address", value: "Lemi Kura Sub-city, W 03, House no. New, Addis Ababa, Ethiopia" },
    { key: "contact.email", page: "contact", label: "Contact Email", value: "sinasupplies@outlook.com" },
    { key: "contact.phone1", page: "contact", label: "Phone 1", value: "+251 90-969-6932" },
    { key: "contact.phone2", page: "contact", label: "Phone 2", value: "+251 92-258-6552" },
  ];

  for (const b of blocks) {
    await prisma.contentBlock.upsert({
      where: { key: b.key },
      update: {},
      create: { ...b, type: b.type ?? "TEXT" },
    });
  }
  console.log(`Seeded ${blocks.length} content blocks.`);

  const sectors = [
    {
      code: "SV-01",
      slug: "procurement",
      name: "Procurement & Supply",
      shortDesc: "Office, hospitality, and event supplies, supplier sourcing, and inventory replenishment.",
      fullDesc: "With a strong network of vetted suppliers and verified service providers, SINA ensures timely delivery, quality assurance, and professional execution — from everyday office consumables to full-scale corporate and event supply runs.",
      features: [
        "Office consumables and supplies",
        "Hospitality and refreshment supplies",
        "Meeting and conference materials",
        "Holiday and celebration items",
        "Supplier sourcing and management",
        "Inventory monitoring and replenishment",
      ],
      sortOrder: 1,
    },
    {
      code: "SV-02",
      slug: "logistics",
      name: "Logistics & Delivery",
      shortDesc: "Transportation coordination, delivery facilitation, distribution, and scheduled delivery.",
      fullDesc: "SINA coordinates local transportation, scheduled corporate delivery runs, multi-branch distribution, and event cargo movement across Addis Ababa and regional commercial corridors.",
      features: [
        "Local transportation coordination",
        "Scheduled corporate delivery runs",
        "Distribution to multiple sites or branches",
        "Consolidated delivery for events",
        "Tracking and proof of delivery confirmation",
      ],
      sortOrder: 2,
    },
    {
      code: "SV-03",
      slug: "events",
      name: "Event Organizing",
      shortDesc: "Corporate events, conferences, product launches, venue coordination, and full event logistics.",
      fullDesc: "From high-stakes international conferences to corporate retreats and product launches, SINA handles venue coordination, audiovisual setup, staging, protocol, and hospitality.",
      features: [
        "Corporate workshops and conferences",
        "Product launches and brand activations",
        "Annual general meetings and retreats",
        "Venue sourcing and floor plan setup",
        "Audio-visual and staging coordination",
        "Catering and hospitality management",
      ],
      sortOrder: 3,
    },
    {
      code: "SV-04",
      slug: "property",
      name: "Property Management",
      shortDesc: "Commercial and residential leasing, facility maintenance, cleaning, and security coordination.",
      fullDesc: "Comprehensive property and facility management ensuring corporate offices, commercial centers, and residential properties operate cleanly, securely, and efficiently.",
      features: [
        "Commercial property leasing facilitation",
        "Residential property rental services",
        "Facility maintenance coordination",
        "Cleaning and janitorial management",
        "Security and safety services coordination",
        "Tenant support and lease administration",
      ],
      sortOrder: 4,
    },
    {
      code: "SV-05",
      slug: "staffing",
      name: "Staff Recruitment & Outsourcing",
      shortDesc: "Administrative, hospitality, event, and technical staff recruitment and management.",
      fullDesc: "Reliable workforce solutions connecting corporate clients with vetted administrative, hospitality, logistics, and technical staff with managed payroll and replacement cover.",
      features: [
        "Short-term and contract staffing",
        "Event support personnel",
        "Administrative and front-office staff",
        "Cleaning and hospitality personnel",
        "Logistics and warehouse support staff",
        "Payroll and staff administration",
      ],
      sortOrder: 5,
    },
    {
      code: "SV-06",
      slug: "support",
      name: "Additional Operational Support",
      shortDesc: "Hospitality, vendor negotiation, utility payments, and monthly operational reporting.",
      fullDesc: "Dedicated administrative and ground operational assistance to free your core management team from administrative friction and supplier coordination.",
      features: [
        "Protocol and VIP hospitality coordination",
        "Vendor contract management",
        "Bill payment and utility coordination",
        "Document and permit processing",
        "Customized corporate assistance",
        "Monthly operational summary reporting",
      ],
      sortOrder: 6,
    },
    {
      code: "SV-07",
      slug: "trade",
      name: "Trade & Supply Scope",
      shortDesc: "Licensed cargo, commodities, equipment, and materials supply across Ethiopia and beyond.",
      fullDesc: "Licensed international trade scope facilitating bulk commodity imports, industrial equipment distribution, raw materials, and cross-border commercial shipments.",
      features: [
        "Import and export trade facilitation",
        "Wholesale commodity supply",
        "Industrial equipment distribution",
        "Raw materials sourcing",
        "Customs clearance coordination",
      ],
      sortOrder: 7,
    },
    {
      code: "SV-08",
      slug: "construction",
      name: "Construction & Real Estate",
      shortDesc: "Contracting, materials, machinery, and commercial or residential property development.",
      fullDesc: "Procurement of heavy building materials, machinery rental facilitation, site logistics, and specialized commercial and residential contracting support.",
      features: [
        "Construction materials supply",
        "Heavy machinery rental and procurement",
        "Subcontractor coordination",
        "Site logistics support",
        "Safety equipment and gear",
      ],
      sortOrder: 8,
    },
    {
      code: "SV-09",
      slug: "agriculture",
      name: "Energy, Mining & Agriculture",
      shortDesc: "Energy and utilities, mining and quarrying, agri-commodities, and related supply.",
      fullDesc: "Strategic resources procurement and logistics for energy projects, mining sites, agricultural inputs, and bulk agricultural commodity distribution.",
      features: [
        "Agricultural commodity trading",
        "Farming equipment and inputs",
        "Mining supplies and tools",
        "Energy and fuel distribution logistics",
        "Storage and warehousing solutions",
      ],
      sortOrder: 9,
    },
  ];

  for (const s of sectors) {
    await prisma.serviceSector.upsert({
      where: { code: s.code },
      update: {
        name: s.name,
        slug: s.slug,
        shortDesc: s.shortDesc,
        fullDesc: s.fullDesc,
        features: s.features,
        sortOrder: s.sortOrder,
        isActive: true,
      },
      create: s,
    });
  }
  console.log(`Seeded ${sectors.length} dynamic service sectors.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
