import Link from "next/link";
import { getContentMap, splitHeading, cms } from "@/lib/content";
import { getSectors } from "@/lib/sectors";
import { SectorsInteractiveShowcase } from "@/components/sectors-interactive-showcase";

const SECTOR_COLLAGE_IMAGES = [
  "/assets/procurement-supply.jpg",
  "/assets/logistics-1.jpg",
  "/assets/events.jpg",
  "/assets/property-management.jpg",
  "/assets/staff-recruitment.jpg",
  "/assets/operational-support.jpg",
  "/assets/trade-supply.jpg",
  "/assets/construction-real-estate.jpg",
  "/assets/energy-mining-full.jpg",
  "/assets/professional-consulting.jpg",
];

const SECTOR_ICONS: Record<string, JSX.Element> = {
  procurement: (
    <svg viewBox="0 0 24 24"><path d="M12 3 3 7.5 12 12l9-4.5L12 3Z" /><path d="M3 7.5V16l9 4.5V12" /><path d="M21 7.5V16l-9 4.5" /></svg>
  ),
  logistics: (
    <svg viewBox="0 0 24 24"><path d="M2 17h11V7H2v10Z" /><path d="M13 10h4l4 4v3h-8v-7Z" /><circle cx="6" cy="19" r="1.6" /><circle cx="17.5" cy="19" r="1.6" /></svg>
  ),
  events: (
    <svg viewBox="0 0 24 24"><path d="M4 5h16v16H4z" /><path d="M4 9h16" /><path d="M8 3v4M16 3v4" /></svg>
  ),
  property: (
    <svg viewBox="0 0 24 24"><path d="M4 21V9l8-5 8 5v12" /><path d="M4 21h16" /><path d="M9 21v-6h6v6" /></svg>
  ),
  staffing: (
    <svg viewBox="0 0 24 24"><circle cx="9" cy="8" r="3" /><path d="M4 20c0-3 2-5 5-5s5 2 5 5" /><circle cx="17" cy="9" r="2.4" /><path d="M15 20c0-2.5 1-4 3.5-4" /></svg>
  ),
  support: (
    <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" /><path d="M8 12h8M12 8v8" /></svg>
  ),
  trade: (
    <svg viewBox="0 0 24 24"><path d="M3 7h18v10H3z" /><path d="M3 11h18" /><path d="M7 7V5h10v2" /></svg>
  ),
  construction: (
    <svg viewBox="0 0 24 24"><path d="M3 21h18" /><path d="M5 21V10l7-5 7 5v11" /><path d="M10 21v-5h4v5" /></svg>
  ),
  agriculture: (
    <svg viewBox="0 0 24 24"><path d="M12 3 4 14h6l-1 7 9-12h-6l1-6Z" /></svg>
  ),
  consulting: (
    <svg viewBox="0 0 24 24"><path d="M8 4h8v4H8z" /><path d="M6 10h12v10H6z" /><path d="M9 14h6" /></svg>
  ),
};

function BoardItems({ sectors, suffix }: { sectors: any[]; suffix: string }) {
  return (
    <>
      {sectors.map((s) => (
        <div className="board-item" key={`${s.code}-${suffix}`}>
          <span className="code">{s.code}</span>
          <span>{s.name.toUpperCase()}</span>
          <span className="status">ACTIVE</span>
        </div>
      ))}
    </>
  );
}

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function HomePage() {
  const [content, dbSectors] = await Promise.all([
    getContentMap("home"),
    getSectors(),
  ]);

  const heading = cms(content, "home.hero.heading", "Your goods, our priority.");
  const lead = cms(
    content,
    "home.hero.lead",
    "SINA TRADING PLC is a single-source partner for corporate organizations — procurement, logistics, event management, property management, and staffing, delivered as one coordinated service."
  );
  const eyebrow = cms(content, "home.hero.eyebrow", "INTERNATIONAL TRADING  &  COMMERCIAL SUPPLIES");
  const heroImage = (content["home.hero.image"] || "").trim();
  const overviewHeading =
    content["home.overview.heading"] ?? "Reliable operational support, under one provider.";
  const overviewBody =
    content["home.overview.body"] ??
    "Established to deliver reliable, efficient, and cost-effective support to corporate organizations, institutions, and private clients. With a strong network of suppliers, service providers, and logistics partners, SINA ensures timely delivery, quality assurance, and professional execution across every area of operation.";
  const sectorsHeading = content["home.sectors.heading"] ?? "Ten sectors, one provider.";
  const sectorsLead =
    content["home.sectors.lead"] ??
    "A single-source partner across ten sectors — so clients coordinate one relationship instead of a dozen vendors.";

  const { start: headingStart, accent: headingAccent } = splitHeading(heading);
  const sectorsSplit = splitHeading(sectorsHeading);
  const sectorCount = dbSectors.length || 10;

  const heroStyle: React.CSSProperties = heroImage
    ? {
        background: `radial-gradient(circle at 78% 32%, rgba(232,148,12,0.14) 0%, transparent 50%), linear-gradient(180deg, rgba(255,255,255,0.72) 0%, rgba(247,245,241,0.86) 100%), url("${heroImage}") center 28% / cover no-repeat`,
      }
    : {};

  return (
    <>
      <section className="hero" style={heroStyle}>
        <div className="wrap hero-grid">
          <div>
            <div className="hero-badges reveal">
              <div className="trust-badge">
                <span className="trust-badge-dot"></span>
                <span>Licensed Ethiopian Operator</span>
              </div>
              <div className="trust-badge">
                <span>{sectorCount} Specialized Sectors</span>
              </div>
            </div>
            <div className="eyebrow reveal">{eyebrow}</div>
            <h1 className="reveal">
              {headingStart}
              {headingAccent ? (
                <>
                  {" "}
                  <span className="accent">{headingAccent}</span>
                </>
              ) : null}
            </h1>
            <p className="lead reveal">{lead}</p>
            <div className="hero-actions reveal">
              <Link className="btn btn-gold" href="/contact">Request a Proposal</Link>
              <Link className="btn btn-ghost-dark" href="/services">Explore {sectorCount} Sectors →</Link>
            </div>
          </div>

          <div className="route-panel reveal">
            <svg viewBox="0 0 600 600" role="img" aria-label="Animated multi-sector network with glowing orbs">
              <defs>
                <filter id="gold-glow" x="-60%" y="-60%" width="220%" height="220%">
                  <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="blur1" />
                  <feGaussianBlur in="SourceGraphic" stdDeviation="2" result="blur2" />
                  <feMerge>
                    <feMergeNode in="blur1" />
                    <feMergeNode in="blur2" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
                <filter id="soft-glow" x="-30%" y="-30%" width="160%" height="160%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              <path id="pAgri" className="route-line" d="M300 300 L300 90" />
              <path id="pTrade" className="route-line" d="M300 300 L150 150" />
              <path id="pProcure" className="route-line" d="M300 300 L95 255" />
              <path id="pSupport" className="route-line" d="M300 300 L105 375" />
              <path id="pStaffing" className="route-line" d="M300 300 L165 470" />
              <path id="pProperty" className="route-line" d="M300 300 L300 515" />
              <path id="pEvents" className="route-line" d="M300 300 L445 465" />
              <path id="pConstruct" className="route-line" d="M300 300 L500 340" />
              <path id="pConsult" className="route-line" d="M300 300 L510 230" />
              <path id="pLogistics" className="route-line" d="M300 300 L505 115" />

              {/* Addis Ababa Center Radar Ripples */}
              <circle cx="300" cy="300" r="12" className="radar-ring r1" />
              <circle cx="300" cy="300" r="28" className="radar-ring r2" />
              <circle cx="300" cy="300" r="44" className="radar-ring r3" />

              {/* 9 Glowing Golden Orbs Gliding Outward from Center to Each Sector */}
              <g className="beacon-group" filter="url(#gold-glow)">
                <circle r="7" fill="rgba(255,203,71,0.25)" stroke="#FFCB47" strokeWidth="1">
                  <animateMotion dur="4.0s" repeatCount="indefinite" begin="0s">
                    <mpath href="#pAgri" />
                  </animateMotion>
                </circle>
                <circle r="3.5" fill="#FFE066">
                  <animateMotion dur="4.0s" repeatCount="indefinite" begin="0s">
                    <mpath href="#pAgri" />
                  </animateMotion>
                </circle>
              </g>

              <g className="beacon-group" filter="url(#gold-glow)">
                <circle r="7" fill="rgba(255,203,71,0.25)" stroke="#FFCB47" strokeWidth="1">
                  <animateMotion dur="3.8s" repeatCount="indefinite" begin="0.8s">
                    <mpath href="#pTrade" />
                  </animateMotion>
                </circle>
                <circle r="3.5" fill="#FFE066">
                  <animateMotion dur="3.8s" repeatCount="indefinite" begin="0.8s">
                    <mpath href="#pTrade" />
                  </animateMotion>
                </circle>
              </g>

              <g className="beacon-group" filter="url(#gold-glow)">
                <circle r="7" fill="rgba(255,203,71,0.25)" stroke="#FFCB47" strokeWidth="1">
                  <animateMotion dur="4.2s" repeatCount="indefinite" begin="1.6s">
                    <mpath href="#pProcure" />
                  </animateMotion>
                </circle>
                <circle r="3.5" fill="#FFE066">
                  <animateMotion dur="4.2s" repeatCount="indefinite" begin="1.6s">
                    <mpath href="#pProcure" />
                  </animateMotion>
                </circle>
              </g>

              <g className="beacon-group" filter="url(#gold-glow)">
                <circle r="7" fill="rgba(255,203,71,0.25)" stroke="#FFCB47" strokeWidth="1">
                  <animateMotion dur="3.9s" repeatCount="indefinite" begin="2.4s">
                    <mpath href="#pSupport" />
                  </animateMotion>
                </circle>
                <circle r="3.5" fill="#FFE066">
                  <animateMotion dur="3.9s" repeatCount="indefinite" begin="2.4s">
                    <mpath href="#pSupport" />
                  </animateMotion>
                </circle>
              </g>

              <g className="beacon-group" filter="url(#gold-glow)">
                <circle r="7" fill="rgba(255,203,71,0.25)" stroke="#FFCB47" strokeWidth="1">
                  <animateMotion dur="4.1s" repeatCount="indefinite" begin="0.4s">
                    <mpath href="#pStaffing" />
                  </animateMotion>
                </circle>
                <circle r="3.5" fill="#FFE066">
                  <animateMotion dur="4.1s" repeatCount="indefinite" begin="0.4s">
                    <mpath href="#pStaffing" />
                  </animateMotion>
                </circle>
              </g>

              <g className="beacon-group" filter="url(#gold-glow)">
                <circle r="7" fill="rgba(255,203,71,0.25)" stroke="#FFCB47" strokeWidth="1">
                  <animateMotion dur="3.7s" repeatCount="indefinite" begin="1.2s">
                    <mpath href="#pProperty" />
                  </animateMotion>
                </circle>
                <circle r="3.5" fill="#FFE066">
                  <animateMotion dur="3.7s" repeatCount="indefinite" begin="1.2s">
                    <mpath href="#pProperty" />
                  </animateMotion>
                </circle>
              </g>

              <g className="beacon-group" filter="url(#gold-glow)">
                <circle r="7" fill="rgba(255,203,71,0.25)" stroke="#FFCB47" strokeWidth="1">
                  <animateMotion dur="4.3s" repeatCount="indefinite" begin="2.0s">
                    <mpath href="#pEvents" />
                  </animateMotion>
                </circle>
                <circle r="3.5" fill="#FFE066">
                  <animateMotion dur="4.3s" repeatCount="indefinite" begin="2.0s">
                    <mpath href="#pEvents" />
                  </animateMotion>
                </circle>
              </g>

              <g className="beacon-group" filter="url(#gold-glow)">
                <circle r="7" fill="rgba(255,203,71,0.25)" stroke="#FFCB47" strokeWidth="1">
                  <animateMotion dur="3.9s" repeatCount="indefinite" begin="2.8s">
                    <mpath href="#pConstruct" />
                  </animateMotion>
                </circle>
                <circle r="3.5" fill="#FFE066">
                  <animateMotion dur="3.9s" repeatCount="indefinite" begin="2.8s">
                    <mpath href="#pConstruct" />
                  </animateMotion>
                </circle>
              </g>

              <g className="beacon-group" filter="url(#gold-glow)">
                <circle r="7" fill="rgba(255,203,71,0.25)" stroke="#FFCB47" strokeWidth="1">
                  <animateMotion dur="4.0s" repeatCount="indefinite" begin="1.0s">
                    <mpath href="#pConsult" />
                  </animateMotion>
                </circle>
                <circle r="3.5" fill="#FFE066">
                  <animateMotion dur="4.0s" repeatCount="indefinite" begin="1.0s">
                    <mpath href="#pConsult" />
                  </animateMotion>
                </circle>
              </g>

              <g className="beacon-group" filter="url(#gold-glow)">
                <circle r="7" fill="rgba(255,203,71,0.25)" stroke="#FFCB47" strokeWidth="1">
                  <animateMotion dur="3.6s" repeatCount="indefinite" begin="0.2s">
                    <mpath href="#pLogistics" />
                  </animateMotion>
                </circle>
                <circle r="3.5" fill="#FFE066">
                  <animateMotion dur="3.6s" repeatCount="indefinite" begin="0.2s">
                    <mpath href="#pLogistics" />
                  </animateMotion>
                </circle>
              </g>

              {/* ---------------- 9 SEPARATED SECTOR DESTINATIONS & LABELS ---------------- */}

              {/* Central Hub: SINA */}
              <circle className="node origin" cx="300" cy="300" r="6.5" filter="url(#soft-glow)" />
              <text className="node-label origin-label" x="300" y="325" textAnchor="middle">SINA</text>

              {/* EMNA - 009: Energy, Mining & Agriculture */}
              <circle className="node" cx="300" cy="90" r="5" />
              <text className="node-label" x="300" y="68" textAnchor="middle">
                <tspan fill="#111112" fontWeight="800">EMNA - 009 </tspan>
                <tspan fill="#111112">AGRI &amp; ENERGY</tspan>
              </text>

              {/* TSS - 007: Trade Scope */}
              <circle className="node" cx="150" cy="150" r="5" />
              <text className="node-label" x="136" y="138" textAnchor="end">
                <tspan fill="#111112" fontWeight="800">TSS - 007 </tspan>
                <tspan fill="#111112">TRADE</tspan>
              </text>

              {/* PS - 001: Procurement */}
              <circle className="node" cx="95" cy="255" r="5" />
              <text className="node-label" x="80" y="259" textAnchor="end">
                <tspan fill="#111112" fontWeight="800">PS - 001 </tspan>
                <tspan fill="#111112">PROCUREMENT</tspan>
              </text>

              {/* AOS - 006: Additional Support */}
              <circle className="node" cx="105" cy="375" r="5" />
              <text className="node-label" x="90" y="379" textAnchor="end">
                <tspan fill="#111112" fontWeight="800">AOS - 006 </tspan>
                <tspan fill="#111112">SUPPORT</tspan>
              </text>

              {/* SRO - 005: Staff Recruitment */}
              <circle className="node" cx="165" cy="470" r="5" />
              <text className="node-label" x="150" y="488" textAnchor="end">
                <tspan fill="#111112" fontWeight="800">SRO - 005 </tspan>
                <tspan fill="#111112">STAFFING</tspan>
              </text>

              {/* PO - 004: Property Management */}
              <circle className="node" cx="300" cy="515" r="5" />
              <text className="node-label" x="300" y="542" textAnchor="middle">
                <tspan fill="#111112" fontWeight="800">PO - 004 </tspan>
                <tspan fill="#111112">PROPERTY</tspan>
              </text>

              {/* EO - 003: Event Organizing */}
              <circle className="node" cx="445" cy="465" r="5" />
              <text className="node-label" x="460" y="469" textAnchor="start">
                <tspan fill="#111112" fontWeight="800">EO - 003 </tspan>
                <tspan fill="#111112">EVENTS</tspan>
              </text>

              {/* CORS - 008: Construction */}
              <circle className="node" cx="500" cy="340" r="5" />
              <text className="node-label" x="515" y="344" textAnchor="start">
                <tspan fill="#111112" fontWeight="800">CORS - 008 </tspan>
                <tspan fill="#111112">CONSTRUCTION</tspan>
              </text>

              {/* PC - 010: Professional Consulting */}
              <circle className="node" cx="510" cy="230" r="5" />
              <text className="node-label" x="525" y="226" textAnchor="start">
                <tspan fill="#111112" fontWeight="800">PC - 010 </tspan>
                <tspan fill="#111112">CONSULTING</tspan>
              </text>

              {/* LD - 002: Logistics & Delivery */}
              <circle className="node delivery-node" cx="505" cy="115" r="6" filter="url(#soft-glow)" />
              <text className="node-label origin-label" x="520" y="111" textAnchor="start">
                <tspan fill="#111112" fontWeight="800">LD - 002 </tspan>
                <tspan fill="#111112">DELIVERY</tspan>
              </text>
            </svg>
          </div>
        </div>

        <div className="board">
          <div className="board-inner">
            <div className="board-label">
              <span className="board-live-dot"></span>
              <span>LIVE MANIFEST</span>
            </div>
            <div className="board-track" id="board-track">
              <BoardItems sectors={dbSectors} suffix="a" />
              <BoardItems sectors={dbSectors} suffix="b" />
            </div>
          </div>
        </div>
      </section>

      <section className="overview">
        <div className="diag-block amber"></div>
        <div className="diag-block gold"></div>
        <div className="wrap overview-grid">
          <div className="overview-copy reveal">
            <div className="eyebrow">Company Profile</div>
            <h2>{overviewHeading}</h2>
            <p>{overviewBody}</p>
            <Link className="btn btn-ghost-dark" href="/about">Read Full Profile →</Link>
          </div>
          
          <div className="overview-visual reveal">
            <div className="mosaic-frame" title="SINA integrated operational sectors">
              <div className="mosaic-grid">
                {SECTOR_COLLAGE_IMAGES.map((imgUrl, i) => (
                  <div className="mosaic-tile" key={i}>
                    <img src={imgUrl} alt={`SINA Sector ${i + 1}`} loading="lazy" />
                  </div>
                ))}
              </div>
              <div className="mosaic-blend-overlay" />
            </div>
          </div>
        </div>
      </section>

      <section className="stats">
        <div className="wrap">
          <div className="stats-grid">
            <div className="stat-cell reveal">
              <div className="stat-number"><span className="accent">{sectorCount}</span></div>
              <div className="stat-rule"></div>
              <div className="stat-label">Core Sectors</div>
              <div className="stat-desc">Lines of work — procurement, logistics, events, property, staffing, support, trade, construction, energy, and consulting — under one provider.</div>
            </div>
            <div className="stat-cell reveal">
              <div className="stat-number"><span className="accent">6</span></div>
              <div className="stat-rule"></div>
              <div className="stat-label">Working Phases</div>
              <div className="stat-desc">Consultation, planning, mobilization, implementation, delivery and support, then monitoring and after-sales.</div>
            </div>
            <div className="stat-cell reveal">
              <div className="stat-number"><span className="accent">6</span></div>
              <div className="stat-rule"></div>
              <div className="stat-label">Why Clients Choose Us</div>
              <div className="stat-desc">Reliable delivery, a strong vendor network, quality assurance, and fast coordination.</div>
            </div>
            <div className="stat-cell reveal">
              <div className="stat-number"><span className="accent">8</span></div>
              <div className="stat-rule"></div>
              <div className="stat-label">Client Benefits</div>
              <div className="stat-desc">Less administration, better cost control, qualified staff, and timely operational reporting.</div>
            </div>
          </div>
        </div>
      </section>

      <section className="sectors-preview" id="sectors">
        <div className="wrap">
          <div className="section-head reveal">
            <span className="ghost-numeral">{String(sectorCount).padStart(2, "0")}</span>
            <h2>
              {sectorsSplit.start}
              {sectorsSplit.accent ? (
                <>
                  <br />
                  {sectorsSplit.accent}
                </>
              ) : null}
            </h2>
            <p>{sectorsLead}</p>
          </div>

          <div className="reveal">
            <SectorsInteractiveShowcase sectors={dbSectors} />
          </div>
        </div>
      </section>
    </>
  );
}
