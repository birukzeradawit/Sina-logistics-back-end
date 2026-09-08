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
  // SV-01 / Procurement
  "SV-01": {
    image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1600&q=80",
    tag: "Institutional Sourcing & Supply Chain",
  },
  "procurement": {
    image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1600&q=80",
    tag: "Institutional Sourcing & Supply Chain",
  },
  "procurement-supply": {
    image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1600&q=80",
    tag: "Institutional Sourcing & Supply Chain",
  },

  // SV-02 / Logistics
  "SV-02": {
    image: "https://images.unsplash.com/photo-1519003722824-194d4455a60c?auto=format&fit=crop&w=1600&q=80",
    tag: "Freight, Route Dispatch & Fleet Tracking",
  },
  "logistics": {
    image: "https://images.unsplash.com/photo-1519003722824-194d4455a60c?auto=format&fit=crop&w=1600&q=80",
    tag: "Freight, Route Dispatch & Fleet Tracking",
  },
  "logistics-delivery": {
    image: "https://images.unsplash.com/photo-1519003722824-194d4455a60c?auto=format&fit=crop&w=1600&q=80",
    tag: "Freight, Route Dispatch & Fleet Tracking",
  },

  // SV-03 / Events
  "SV-03": {
    image: "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1600&q=80",
    tag: "Corporate Conferences & Production",
  },
  "events": {
    image: "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1600&q=80",
    tag: "Corporate Conferences & Production",
  },
  "event-organizing": {
    image: "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1600&q=80",
    tag: "Corporate Conferences & Production",
  },

  // SV-04 / Property
  "SV-04": {
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1600&q=80",
    tag: "Commercial Facilities & Asset Leasing",
  },
  "property": {
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1600&q=80",
    tag: "Commercial Facilities & Asset Leasing",
  },
  "property-management": {
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1600&q=80",
    tag: "Commercial Facilities & Asset Leasing",
  },

  // SV-05 / Staffing
  "SV-05": {
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1600&q=80",
    tag: "Executive & Specialized Outsourcing",
  },
  "staffing": {
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1600&q=80",
    tag: "Executive & Specialized Outsourcing",
  },
  "staff-recruitment-outsourcing": {
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1600&q=80",
    tag: "Executive & Specialized Outsourcing",
  },

  // SV-06 / Support
  "SV-06": {
    image: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1600&q=80",
    tag: "On-Demand Operational Solutions",
  },
  "support": {
    image: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1600&q=80",
    tag: "On-Demand Operational Solutions",
  },
  "additional-support": {
    image: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1600&q=80",
    tag: "On-Demand Operational Solutions",
  },

  // SV-07 / Trade
  "SV-07": {
    image: "https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=1600&q=80",
    tag: "Import, Export & Industrial Trade",
  },
  "trade": {
    image: "https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=1600&q=80",
    tag: "Import, Export & Industrial Trade",
  },
  "trade-scope": {
    image: "https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=1600&q=80",
    tag: "Import, Export & Industrial Trade",
  },

  // SV-08 / Construction
  "SV-08": {
    image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1600&q=80",
    tag: "Commercial Build & Infrastructure",
  },
  "construction": {
    image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1600&q=80",
    tag: "Commercial Build & Infrastructure",
  },
  "construction-real-estate": {
    image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1600&q=80",
    tag: "Commercial Build & Infrastructure",
  },

  // SV-09 / Agriculture, Energy & Mining
  "SV-09": {
    image: "/assets/energy-mining-agriculture.jpg",
    tag: "Agribusiness, Mining & Clean Energy",
  },
  "agriculture": {
    image: "/assets/energy-mining-agriculture.jpg",
    tag: "Agribusiness, Mining & Clean Energy",
  },
  "energy-mining-agriculture": {
    image: "/assets/energy-mining-agriculture.jpg",
    tag: "Agribusiness, Mining & Clean Energy",
  },

  // SV-10 / Consulting
  "SV-10": {
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1600&q=80",
    tag: "Advisory, Formation & Operational Improvement",
  },
  consulting: {
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1600&q=80",
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
          <img
            key={current.code || current.id || activeIndex}
            src={currentMeta.image}
            alt={current.name}
            className="showcase-cinematic-img"
          />

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
