import type { Metadata } from "next";

const siteUrl = process.env.NEXTAUTH_URL || "https://www.sinatrading.et";

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
  "@type": "LocalBusiness",
  name: "SINA Supplies and Logistics PLC",
  image: `${siteUrl}/assets/logo-icon.png`,
  url: siteUrl,
  telephone: "+251909696932",
  email: "sinasupplies@outlook.com",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Lemi Kura Sub-city, W 03, House no. New",
    addressLocality: "Addis Ababa",
    addressCountry: "ET",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 9.01082,
    longitude: 38.87648,
  },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "08:30",
      closes: "17:30",
    },
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: "Saturday",
      opens: "08:30",
      closes: "12:30",
    },
  ],
  sameAs: ["https://www.sinatrading.et"],
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
