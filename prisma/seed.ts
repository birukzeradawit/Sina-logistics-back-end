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
    // File may not exist.
  }
}

const prisma = new PrismaClient();

async function main() {
  // --- First admin account ---
  // Change this email/password immediately after first login in production.
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
  console.log("Seeded admin account:", admin.email, "(password: ChangeMe123!)");

  // --- Starter content blocks ---
  // A small starting set covering the Home hero — enough to prove the
  // editing flow end-to-end. Add more rows here as more of the site is
  // migrated to read from the database instead of static HTML.
  const blocks = [
    { key: "home.hero.eyebrow", page: "home", label: "Hero Eyebrow", value: "INTERNATIONAL TRADING  &  COMMERCIAL SUPPLIES" },
    { key: "home.hero.heading", page: "home", label: "Hero Heading", value: "Your goods, our priority." },
    { key: "home.hero.lead", page: "home", label: "Hero Lead Paragraph", value: "SINA Supplies and Logistics PLC is a single-source partner for corporate organizations — procurement, logistics, event management, property management, and staffing, delivered as one coordinated service.", type: "RICH_TEXT" as const },
    { key: "home.overview.heading", page: "home", label: "Overview Heading", value: "Reliable operational support, under one provider." },
    { key: "home.overview.body", page: "home", label: "Overview Body", value: "Established to deliver reliable, efficient, and cost-effective support to corporate organizations, institutions, and private clients. With a strong network of suppliers, service providers, and logistics partners, SINA ensures timely delivery, quality assurance, and professional execution across every area of operation.", type: "RICH_TEXT" as const },
    { key: "home.sectors.heading", page: "home", label: "Sectors Section Heading", value: "Nine sectors, one provider." },
    { key: "home.sectors.lead", page: "home", label: "Sectors Section Lead", value: "A single-source partner across nine sectors — so clients coordinate one relationship instead of a dozen vendors.", type: "RICH_TEXT" as const },
    { key: "about.hero.heading", page: "about", label: "About Hero Heading", value: "Integrated support for Ethiopia." },
    { key: "about.hero.lead", page: "about", label: "About Hero Lead", value: "SINA Supplies and Logistics PLC delivers reliable, efficient, and cost-effective operational support to corporate organizations, institutions, and private clients.", type: "RICH_TEXT" as const },
    { key: "about.intro.heading", page: "about", label: "About Intro Heading", value: "Who We Are" },
    { key: "about.intro.body", page: "about", label: "About Intro Body", value: "SINA Supplies and Logistics PLC is a dynamic Ethiopian company specializing in procurement, logistics coordination, event management, property management, staffing solutions, and integrated business support services.", type: "RICH_TEXT" as const },
    { key: "services.hero.heading", page: "services", label: "Services Hero Heading", value: "Nine sectors, one accountable partner." },
    { key: "services.hero.lead", page: "services", label: "Services Hero Lead", value: "Premium operational support for corporate organizations — plus a licensed trade and supply scope across logistics, commodities, equipment, and materials.", type: "RICH_TEXT" as const },
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
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
