"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export interface SectorItem {
  id: string;
  code: string;
  slug: string;
  name: string;
  shortDesc: string;
  features?: string[];
}

const SECTOR_DATA: Record<string, { image: string; tag: string }> = {
  // PS - 001 / Procurement
  "PS - 001": {
    image: "/assets/procurement-supply.jpg",
    tag: "Institutional Sourcing & Supply Chain",
  },
  "PS-001": {
    image: "/assets/procurement-supply.jpg",
    tag: "Institutional Sourcing & Supply Chain",
  },
  "SV-01": {
    image: "/assets/procurement-supply.jpg",
    tag: "Institutional Sourcing & Supply Chain",
  },
  "procurement": {
    image: "/assets/procurement-supply.jpg",
    tag: "Institutional Sourcing & Supply Chain",
  },
  "procurement-supply": {
    image: "/assets/procurement-supply.jpg",
    tag: "Institutional Sourcing & Supply Chain",
  },

  // LD - 002 / Logistics
  "LD - 002": {
    image: "/assets/logistics-1.jpg",
    tag: "Freight, Route Dispatch & Fleet Tracking",
  },
  "LD-002": {
    image: "/assets/logistics-1.jpg",
    tag: "Freight, Route Dispatch & Fleet Tracking",
  },
  "SV-02": {
    image: "/assets/logistics-1.jpg",
    tag: "Freight, Route Dispatch & Fleet Tracking",
  },
  "logistics": {
    image: "/assets/logistics-1.jpg",
    tag: "Freight, Route Dispatch & Fleet Tracking",
  },
  "logistics-delivery": {
    image: "/assets/logistics-1.jpg",
    tag: "Freight, Route Dispatch & Fleet Tracking",
  },

  // EO - 003 / Events
  "EO - 003": {
    image: "/assets/events.jpg",
    tag: "Corporate Conferences & Production",
  },
  "EO-003": {
    image: "/assets/events.jpg",
    tag: "Corporate Conferences & Production",
  },
  "EO 003": {
    image: "/assets/events.jpg",
    tag: "Corporate Conferences & Production",
  },
  "SV-03": {
    image: "/assets/events.jpg",
    tag: "Corporate Conferences & Production",
  },
  "events": {
    image: "/assets/events.jpg",
    tag: "Corporate Conferences & Production",
  },
  "event-organizing": {
    image: "/assets/events.jpg",
    tag: "Corporate Conferences & Production",
  },

  // PO - 004 / Property
  "PO - 004": {
    image: "/assets/property-management.jpg",
    tag: "Commercial Facilities & Asset Leasing",
  },
  "PO-004": {
    image: "/assets/property-management.jpg",
    tag: "Commercial Facilities & Asset Leasing",
  },
  "SV-04": {
    image: "/assets/property-management.jpg",
    tag: "Commercial Facilities & Asset Leasing",
  },
  "property": {
    image: "/assets/property-management.jpg",
    tag: "Commercial Facilities & Asset Leasing",
  },
  "property-management": {
    image: "/assets/property-management.jpg",
    tag: "Commercial Facilities & Asset Leasing",
  },

  // SRO - 005 / Staffing
  "SRO - 005": {
    image: "/assets/staff-recruitment.jpg",
    tag: "Executive & Specialized Outsourcing",
  },
  "SRO-005": {
    image: "/assets/staff-recruitment.jpg",
    tag: "Executive & Specialized Outsourcing",
  },
  "SV-05": {
    image: "/assets/staff-recruitment.jpg",
    tag: "Executive & Specialized Outsourcing",
  },
  "staffing": {
    image: "/assets/staff-recruitment.jpg",
    tag: "Executive & Specialized Outsourcing",
  },
  "staff-recruitment-outsourcing": {
    image: "/assets/staff-recruitment.jpg",
    tag: "Executive & Specialized Outsourcing",
  },

  // AOS - 006 / Support
  "AOS - 006": {
    image: "/assets/operational-support.jpg",
    tag: "On-Demand Operational Solutions",
  },
  "AOS-006": {
    image: "/assets/operational-support.jpg",
    tag: "On-Demand Operational Solutions",
  },
  "SV-06": {
    image: "/assets/operational-support.jpg",
    tag: "On-Demand Operational Solutions",
  },
  "support": {
    image: "/assets/operational-support.jpg",
    tag: "On-Demand Operational Solutions",
  },
  "additional-support": {
    image: "/assets/operational-support.jpg",
    tag: "On-Demand Operational Solutions",
  },

  // TSS - 007 / Trade
  "TSS - 007": {
    image: "/assets/trade-supply.jpg",
    tag: "Import, Export & Industrial Trade",
  },
  "TSS-007": {
    image: "/assets/trade-supply.jpg",
    tag: "Import, Export & Industrial Trade",
  },
  "TSS - 006": {
    image: "/assets/trade-supply.jpg",
    tag: "Import, Export & Industrial Trade",
  },
  "TSS-006": {
    image: "/assets/trade-supply.jpg",
    tag: "Import, Export & Industrial Trade",
  },
  "SV-07": {
    image: "/assets/trade-supply.jpg",
    tag: "Import, Export & Industrial Trade",
  },
  "trade": {
    image: "/assets/trade-supply.jpg",
    tag: "Import, Export & Industrial Trade",
  },
  "trade-scope": {
    image: "/assets/trade-supply.jpg",
    tag: "Import, Export & Industrial Trade",
  },

  // CORS - 008 / Construction
  "CORS - 008": {
    image: "/assets/construction-real-estate.jpg",
    tag: "Commercial Build & Infrastructure",
  },
  "CORS-008": {
    image: "/assets/construction-real-estate.jpg",
    tag: "Commercial Build & Infrastructure",
  },
  "SV-08": {
    image: "/assets/construction-real-estate.jpg",
    tag: "Commercial Build & Infrastructure",
  },
  "construction": {
    image: "/assets/construction-real-estate.jpg",
    tag: "Commercial Build & Infrastructure",
  },
  "construction-real-estate": {
    image: "/assets/construction-real-estate.jpg",
    tag: "Commercial Build & Infrastructure",
  },

  // EMNA - 009 / Agriculture, Energy & Mining
  "EMNA - 009": {
    image: "/assets/energy-mining-full.jpg",
    tag: "Agribusiness, Mining & Clean Energy",
  },
  "EMNA-009": {
    image: "/assets/energy-mining-full.jpg",
    tag: "Agribusiness, Mining & Clean Energy",
  },
  "SV-09": {
    image: "/assets/energy-mining-full.jpg",
    tag: "Agribusiness, Mining & Clean Energy",
  },
  "agriculture": {
    image: "/assets/energy-mining-full.jpg",
    tag: "Agribusiness, Mining & Clean Energy",
  },
  "energy-mining-agriculture": {
    image: "/assets/energy-mining-full.jpg",
    tag: "Agribusiness, Mining & Clean Energy",
  },

  // PC - 010 / Consulting
  "PC - 010": {
    image: "/assets/professional-consulting.jpg",
    tag: "Advisory, Formation & Operational Improvement",
  },
  "PC-010": {
    image: "/assets/professional-consulting.jpg",
    tag: "Advisory, Formation & Operational Improvement",
  },
  "SV-10": {
    image: "/assets/professional-consulting.jpg",
    tag: "Advisory, Formation & Operational Improvement",
  },
  consulting: {
    image: "/assets/professional-consulting.jpg",
    tag: "Advisory, Formation & Operational Improvement",
  },
  "professional-consulting": {
    image: "/assets/professional-consulting.jpg",
    tag: "Advisory, Formation & Operational Improvement",
  },
};

const DEFAULT_META = {
  image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1600&q=80",
  tag: "Corporate Operations",
};

function getSectorMeta(s: SectorItem) {
  if (!s) return DEFAULT_META;
  return (
    SECTOR_DATA[s.code] ||
    SECTOR_DATA[s.slug] ||
    SECTOR_DATA[s.slug?.toLowerCase()] ||
    DEFAULT_META
  );
}

export function SectorsInteractiveShowcase({ sectors }: { sectors: SectorItem[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused || sectors.length === 0) return;
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % sectors.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [isPaused, sectors.length]);

  if (sectors.length === 0) return null;

  const current = sectors[activeIndex] || sectors[0];
  const currentMeta = getSectorMeta(current);

  const handleSelect = (idx: number) => {
    setActiveIndex(idx);
    setIsPaused(true);
    setTimeout(() => setIsPaused(false), 15000);
  };

  return (
    <div
      className="sectors-interactive-layout"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Top Cinematic Photo Stage */}
      <div className="showcase-main-stage">
        <div className="showcase-cinematic-frame">
          {current.code === "EMNA - 009" || current.code === "EMNA-009" || current.code === "SV-09" || current.slug === "agriculture" ? (
            <div className="showcase-cinematic-multi-img">
              <img
                key="energy-mining"
                src="/assets/energy-mining-full.jpg"
                alt="Energy and Mining"
              />
              <img
                key="agriculture"
                src="/assets/agriculture-full.jpg"
                alt="Agriculture"
              />
            </div>
          ) : current.code === "LD - 002" || current.code === "LD-002" || current.code === "SV-02" || current.slug === "logistics" ? (
            <div className="showcase-cinematic-triple-img">
              <img
                key="logistics-1"
                src="/assets/logistics-1.jpg"
                alt="Logistics 1"
              />
              <img
                key="logistics-2"
                src="/assets/logistics-2.jpg"
                alt="Logistics 2"
              />
              <img
                key="logistics-3"
                src="/assets/logistics-3.jpg"
                alt="Logistics 3"
              />
            </div>
          ) : (
            <img
              key={current.code || current.id || activeIndex}
              src={currentMeta.image}
              alt={current.name}
              className="showcase-cinematic-img"
            />
          )}

          <div className="showcase-cinematic-overlay" />

          {/* Floating Glassmorphic Details Card */}
          <div className="showcase-cinematic-card" key={`card-${current.code || activeIndex}`}>
            <div className="cinematic-meta-row">
              <span className="cinematic-code">{current.code}</span>
              <span className="cinematic-tag">{currentMeta.tag}</span>
            </div>
            <h3 className="cinematic-title">{current.name}</h3>
            <p className="cinematic-desc">{current.shortDesc}</p>
            <div className="cinematic-actions">
              <Link href={`/services#${current.slug}`} className="btn btn-gold">
                Explore {current.name} →
              </Link>
              <Link href="/contact" className="btn btn-ghost-dark">
                Request a Quote
              </Link>
            </div>
          </div>

          {/* Top-Right Nav Counter & Arrows */}
          <div className="cinematic-nav-controls">
            <button
              type="button"
              className="cinematic-nav-btn"
              aria-label="Previous Sector"
              onClick={() => handleSelect((activeIndex - 1 + sectors.length) % sectors.length)}
            >
              ‹
            </button>
            <span className="cinematic-counter">
              {String(activeIndex + 1).padStart(2, "0")} / {String(sectors.length).padStart(2, "0")}
            </span>
            <button
              type="button"
              className="cinematic-nav-btn"
              aria-label="Next Sector"
              onClick={() => handleSelect((activeIndex + 1) % sectors.length)}
            >
              ›
            </button>
          </div>
        </div>
      </div>

      {/* Bottom 3x3 Selector Cards Grid */}
      <div className="showcase-sidebar-grid">
        {sectors.map((s, idx) => {
          const isActive = idx === activeIndex;
          const numStr = String(idx + 1).padStart(2, "0");
          return (
            <button
              key={s.id || s.code || idx}
              type="button"
              className={`sector-selector-card${isActive ? " active" : ""}`}
              onClick={() => handleSelect(idx)}
              aria-selected={isActive}
            >
              <div className="selector-top">
                <span className="selector-num">{numStr}</span>
                <span className="selector-code">{s.code}</span>
              </div>
              <div className="selector-name">{s.name}</div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
