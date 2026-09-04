import type { Metadata, Viewport } from "next";

const siteUrl = process.env.NEXTAUTH_URL || "https://www.sinatrading.et";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#111112",
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "SINA Supplies & Logistics PLC | Your goods, our priority.",
    template: "%s | SINA Supplies & Logistics",
  },
  description:
    "SINA Supplies and Logistics PLC is a single-source partner for corporate organizations in Ethiopia — procurement, logistics, event management, property management, staffing, and commercial trade.",
  keywords: [
    "SINA Supplies and Logistics",
    "SINA Trading Ethiopia",
    "Procurement Addis Ababa",
    "Logistics and Delivery Ethiopia",
    "Event Organizing Addis Ababa",
    "Property Management Ethiopia",
    "Staff Outsourcing Ethiopia",
    "Commercial Trading Ethiopia",
  ],
  authors: [{ name: "SINA Supplies and Logistics PLC", url: siteUrl }],
  creator: "SINA Supplies and Logistics PLC",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "SINA Supplies and Logistics",
    title: "SINA Supplies & Logistics PLC | Your goods, our priority.",
    description:
      "Single-source partner for procurement, logistics coordination, event organizing, property management, and commercial trade in Ethiopia.",
  },
  twitter: {
    card: "summary_large_image",
    title: "SINA Supplies & Logistics PLC | Your goods, our priority.",
    description:
      "Single-source partner for corporate procurement, logistics, events, property, and trade in Ethiopia.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/assets/logo-icon.png",
    shortcut: "/assets/logo-icon.png",
    apple: "/assets/logo-icon.png",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Corporation",
      "@id": `${siteUrl}/#organization`,
      name: "SINA Supplies and Logistics PLC",
      alternateName: ["SINA Trading", "SINA PLC", "SINA Supplies & Logistics"],
      url: siteUrl,
      logo: `${siteUrl}/assets/logo-icon.png`,
      image: `${siteUrl}/assets/logo-icon.png`,
      description:
        "SINA Supplies and Logistics PLC is an enterprise operational partner and licensed commercial trading company in Ethiopia providing institutional procurement, freight logistics, event management, commercial property maintenance, staffing outsourcing, and industrial commodity trade.",
      telephone: "+251909696932",
      email: "sinasupplies@outlook.com",
      address: {
        "@type": "PostalAddress",
        streetAddress: "Lemi Kura Sub-city, W 03, House no. New",
        addressLocality: "Addis Ababa",
        addressRegion: "Addis Ababa",
        addressCountry: "ET",
      },
      geo: {
        "@type": "GeoCoordinates",
        latitude: 9.01082,
        longitude: 38.87648,
      },
      areaServed: [
        { "@type": "Country", name: "Ethiopia" },
        { "@type": "AdministrativeArea", name: "Addis Ababa" },
      ],
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "SINA 9 Specialized Operational Sectors",
        itemListElement: [
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "SV-01: Procurement & Supply Services",
              description: "Direct supplier sourcing, institutional purchasing, and bulk enterprise supplies in Ethiopia.",
              url: `${siteUrl}/services#procurement-supply`,
            },
          },
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "SV-02: Logistics & Delivery",
              description: "Nationwide freight, route dispatch, fleet tracking, and last-mile corporate delivery across Ethiopia.",
              url: `${siteUrl}/services#logistics-delivery`,
            },
          },
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "SV-03: Event Organizing",
              description: "High-level corporate conferences, venue production, protocol management, and delegate logistics.",
              url: `${siteUrl}/services#event-organizing`,
            },
          },
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "SV-04: Property Management",
              description: "Commercial facility leasing, ongoing asset maintenance, and institutional estate oversight.",
              url: `${siteUrl}/services#property-management`,
            },
          },
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "SV-05: Staff Recruitment & Outsourcing",
              description: "Executive staffing, skilled labor placement, outsourced workforce payroll, and compliance.",
              url: `${siteUrl}/services#staff-recruitment-outsourcing`,
            },
          },
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "SV-06: Additional Operational Support",
              description: "Custom operational problem-solving, rapid institutional deployments, and administrative assistance.",
              url: `${siteUrl}/services#additional-support`,
            },
          },
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "SV-07: General Trading & Supply Scope",
              description: "Licensed import, export, industrial machinery distribution, and bulk commodity trading in Ethiopia.",
              url: `${siteUrl}/services#trade-scope`,
            },
          },
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "SV-08: Construction & Real Estate",
              description: "Commercial building construction, site management, and real estate development coordination.",
              url: `${siteUrl}/services#construction-real-estate`,
            },
          },
          {
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: "SV-09: Energy, Mining & Agriculture",
              description: "Agribusiness supply chains, mineral commodity trade, and renewable energy equipment logistics.",
              url: `${siteUrl}/services#energy-mining-agriculture`,
            },
          },
        ],
      },
    },
    {
      "@type": "FAQPage",
      "@id": `${siteUrl}/#faq`,
      mainEntity: [
        {
          "@type": "Question",
          name: "What corporate services does SINA Supplies and Logistics PLC provide in Ethiopia?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "SINA Supplies and Logistics PLC operates across 9 specialized sectors in Ethiopia: Procurement & Supply, Logistics & Delivery, Event Organizing, Property Management, Staff Recruitment & Outsourcing, Operational Support, General Trading, Construction & Real Estate, and Energy, Mining & Agriculture.",
          },
        },
        {
          "@type": "Question",
          name: "Where is SINA Supplies and Logistics PLC located?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "SINA Supplies and Logistics PLC is located at Lemi Kura Sub-city, Woreda 03, House No. New, Addis Ababa, Ethiopia, coordinating operations nationwide.",
          },
        },
        {
          "@type": "Question",
          name: "How can I request a quote or corporate proposal from SINA Trading PLC?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "You can submit an inquiry directly through the website at https://www.sinatrading.et/contact, call +251 909 69 69 32, or email sinasupplies@outlook.com.",
          },
        },
      ],
    },
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      url: siteUrl,
      name: "SINA Supplies and Logistics PLC",
      publisher: {
        "@id": `${siteUrl}/#organization`,
      },
    },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Big+Shoulders+Display:wght@600;700;900&family=Space+Grotesk:wght@400;500;700&family=IBM+Plex+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body style={{ margin: 0 }}>{children}</body>
    </html>
  );
}
