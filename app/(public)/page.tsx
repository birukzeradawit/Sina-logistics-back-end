import Link from "next/link";
import { getContentMap, splitHeading, cms } from "@/lib/content";

const BOARD = [
  { code: "SV-01", name: "PROCUREMENT & SUPPLY", status: "ACTIVE" },
  { code: "SV-02", name: "LOGISTICS & DELIVERY", status: "ACTIVE" },
  { code: "SV-03", name: "EVENT ORGANIZING", status: "ACTIVE" },
  { code: "SV-04", name: "PROPERTY MANAGEMENT", status: "ACTIVE" },
  { code: "SV-05", name: "STAFF OUTSOURCING", status: "ACTIVE" },
  { code: "SV-06", name: "ADDITIONAL SUPPORT", status: "ACTIVE" },
  { code: "SV-07", name: "TRADE & SUPPLY", status: "ACTIVE" },
  { code: "SV-08", name: "CONSTRUCTION & REAL ESTATE", status: "ACTIVE" },
  { code: "SV-09", name: "ENERGY, MINING & AGRICULTURE", status: "ACTIVE" },
];

const PREVIEW_SECTORS = [
  {
    num: "01",
    code: "SV-01 / PROCUREMENT",
    title: "Procurement & Supply",
    href: "/services#procurement",
    desc: "Office, hospitality, and event supplies, supplier sourcing, and inventory replenishment.",
    icon: (
      <svg viewBox="0 0 24 24"><path d="M12 3 3 7.5 12 12l9-4.5L12 3Z" /><path d="M3 7.5V16l9 4.5V12" /><path d="M21 7.5V16l-9 4.5" /></svg>
    ),
  },
  {
    num: "02",
    code: "SV-02 / LOGISTICS",
    title: "Logistics & Delivery",
    href: "/services#logistics",
    desc: "Transportation coordination, delivery facilitation, distribution, and scheduled delivery.",
    icon: (
      <svg viewBox="0 0 24 24"><path d="M2 17h11V7H2v10Z" /><path d="M13 10h4l4 4v3h-8v-7Z" /><circle cx="6" cy="19" r="1.6" /><circle cx="17.5" cy="19" r="1.6" /></svg>
    ),
  },
  {
    num: "03",
    code: "SV-03 / EVENTS",
    title: "Event Organizing",
    href: "/services#events",
    desc: "Corporate events, conferences, product launches, venue coordination, and full event logistics.",
    icon: (
      <svg viewBox="0 0 24 24"><path d="M4 5h16v16H4z" /><path d="M4 9h16" /><path d="M8 3v4M16 3v4" /></svg>
    ),
  },
  {
    num: "04",
    code: "SV-04 / PROPERTY",
    title: "Property Management",
    href: "/services#property",
    desc: "Commercial and residential leasing, facility maintenance, cleaning, and security coordination.",
    icon: (
      <svg viewBox="0 0 24 24"><path d="M4 21V9l8-5 8 5v12" /><path d="M4 21h16" /><path d="M9 21v-6h6v6" /></svg>
    ),
  },
  {
    num: "05",
    code: "SV-05 / STAFFING",
    title: "Staff Recruitment & Outsourcing",
    href: "/services#staffing",
    desc: "Administrative, hospitality, event, and technical staff recruitment and management.",
    icon: (
      <svg viewBox="0 0 24 24"><circle cx="9" cy="8" r="3" /><path d="M4 20c0-3 2-5 5-5s5 2 5 5" /><circle cx="17" cy="9" r="2.4" /><path d="M15 20c0-2.5 1-4 3.5-4" /></svg>
    ),
  },
  {
    num: "06",
    code: "SV-06 / SUPPORT",
    title: "Additional Support",
    href: "/services#support",
    desc: "Hospitality, vendor negotiation, utility payments, and monthly operational reporting.",
    icon: (
      <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" /><path d="M8 12h8M12 8v8" /></svg>
    ),
  },
  {
    num: "07",
    code: "SV-07 / TRADE",
    title: "Trade & Supply",
    href: "/services#trade",
    desc: "Licensed cargo, commodities, equipment, and materials supply across Ethiopia and beyond.",
    icon: (
      <svg viewBox="0 0 24 24"><path d="M3 7h18v10H3z" /><path d="M3 11h18" /><path d="M7 7V5h10v2" /></svg>
    ),
  },
  {
    num: "08",
    code: "SV-08 / BUILD",
    title: "Construction & Real Estate",
    href: "/services#trade",
    desc: "Contracting, materials, machinery, and commercial or residential property development.",
    icon: (
      <svg viewBox="0 0 24 24"><path d="M3 21h18" /><path d="M5 21V10l7-5 7 5v11" /><path d="M10 21v-5h4v5" /></svg>
    ),
  },
  {
    num: "09",
    code: "SV-09 / RESOURCES",
    title: "Energy, Mining & Agriculture",
    href: "/services#trade",
    desc: "Energy and utilities, mining and quarrying, agri-commodities, and related supply.",
    icon: (
      <svg viewBox="0 0 24 24"><path d="M12 3 4 14h6l-1 7 9-12h-6l1-6Z" /></svg>
    ),
  },
];

function BoardItems({ suffix }: { suffix: string }) {
  return (
    <>
      {BOARD.map((s) => (
        <div className="board-item" key={`${s.code}-${suffix}`}>
          <span className="code">{s.code}</span>
          <span>{s.name}</span>
          <span className="status">{s.status}</span>
        </div>
      ))}
    </>
  );
}

export default async function HomePage() {
  const content = await getContentMap("home");
  const heading = cms(content, "home.hero.heading", "Your goods, our priority.");
  const lead = cms(
    content,
    "home.hero.lead",
    "SINA Supplies and Logistics PLC is a single-source partner for corporate organizations — procurement, logistics, event management, property management, and staffing, delivered as one coordinated service."
  );
  const eyebrow = cms(content, "home.hero.eyebrow", "INTERNATIONAL TRADING  &  COMMERCIAL SUPPLIES");
  const overviewHeading =
    content["home.overview.heading"] ?? "Reliable operational support, under one provider.";
  const overviewBody =
    content["home.overview.body"] ??
    "Established to deliver reliable, efficient, and cost-effective support to corporate organizations, institutions, and private clients. With a strong network of suppliers, service providers, and logistics partners, SINA ensures timely delivery, quality assurance, and professional execution across every area of operation.";
  const sectorsHeading = content["home.sectors.heading"] ?? "Nine sectors, one provider.";
  const sectorsLead =
    content["home.sectors.lead"] ??
    "A single-source partner across nine sectors — so clients coordinate one relationship instead of a dozen vendors.";

  const { start: headingStart, accent: headingAccent } = splitHeading(heading);
  const sectorsSplit = splitHeading(sectorsHeading);

  return (
    <>
      <section className="hero">
        <div className="wrap hero-grid">
          <div>
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
              <Link className="btn btn-primary" href="/contact">Request a Proposal</Link>
              <Link className="btn btn-ghost-dark" href="/services">Explore Our Services →</Link>
            </div>
          </div>

          <div className="route-panel reveal">
            <svg viewBox="0 0 400 400" role="img" aria-label="Animated logistics route diagram">
              <path className="route-line" d="M60 320 C120 280, 140 200, 200 200 C260 200, 280 120, 340 80" />
              <path className="route-line hot" d="M60 320 C120 280, 140 200, 200 200 C260 200, 280 120, 340 80" />
              <circle className="node origin" cx="60" cy="320" r="5" />
              <text className="node-label" x="72" y="324">ADDIS ABABA</text>
              <circle className="node" cx="200" cy="200" r="4" />
              <text className="node-label" x="210" y="196">HUB</text>
              <circle className="node" cx="340" cy="80" r="4" />
              <text className="node-label" x="300" y="66">DELIVERY</text>
              <path className="route-line" d="M60 320 C40 250, 90 180, 60 110" opacity="0.25" />
              <circle className="node" cx="60" cy="110" r="3.5" opacity="0.55" />
              <text className="node-label" x="72" y="114" opacity="0.55">SOURCING</text>
            </svg>
          </div>
        </div>

        <div className="board">
          <div className="board-inner">
            <div className="board-label">Manifest&nbsp;/&nbsp;Active</div>
            <div className="board-track" id="board-track">
              <BoardItems suffix="a" />
              <BoardItems suffix="b" />
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
          <div className="diamond-frame reveal">
            <img src="/assets/port-sunset.png" alt="Logistics operations" />
          </div>
        </div>
      </section>

      <section className="stats">
        <div className="wrap">
          <div className="stats-grid">
            <div className="stat-cell reveal">
              <div className="stat-number"><span className="accent">9</span></div>
              <div className="stat-rule"></div>
              <div className="stat-label">Core Sectors</div>
              <div className="stat-desc">Nine lines of work — from procurement and staffing to trade, construction, energy, and agriculture — under one provider.</div>
            </div>
            <div className="stat-cell reveal">
              <div className="stat-number"><span className="accent">5</span></div>
              <div className="stat-rule"></div>
              <div className="stat-label">Working Phases</div>
              <div className="stat-desc">Planning, sourcing, execution, delivery &amp; deployment, then monitoring and reporting.</div>
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
            <span className="ghost-numeral">09</span>
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

          <div className="sp-grid">
            {PREVIEW_SECTORS.map((s) => (
              <div className="sp-card reveal" key={s.num}>
                <span className="sp-num">{s.num}</span>
                <div className="sp-icon">{s.icon}</div>
                <span className="sp-code">{s.code}</span>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
                <Link className="sp-link" href={s.href}>View service →</Link>
              </div>
            ))}
          </div>

          <div className="sp-footer reveal">
            <Link className="btn btn-primary" href="/services">View All Services →</Link>
          </div>
        </div>
      </section>
    </>
  );
}
