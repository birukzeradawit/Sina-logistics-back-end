import type { Metadata } from "next";
import Link from "next/link";
import { getContentMap, splitHeading, cms } from "@/lib/content";
import { getSectors } from "@/lib/sectors";
import SectorNavBar from "@/components/sector-nav-bar";

export const metadata: Metadata = {
  title: "Corporate Sectors & Services | SINA Supplies & Logistics PLC",
  description:
    "Explore SINA's corporate operational sectors: Procurement & Supply, Logistics Coordination, Event Management, Property Oversight, Staffing Outsourcing, General Trading, Construction, Agribusiness, and Professional Consulting in Ethiopia.",
  keywords: [
    "SINA Services Ethiopia",
    "Procurement Services Addis Ababa",
    "Logistics Delivery Ethiopia",
    "Event Organizing Ethiopia",
    "Property Management Addis Ababa",
    "Staff Outsourcing Ethiopia",
    "General Trading Commodities Ethiopia",
  ],
  openGraph: {
    title: "Corporate Operational Sectors | SINA Supplies & Logistics",
    description:
      "Single-source partner for institutional procurement, logistics, corporate events, property, staffing, and commercial trade in Ethiopia.",
    url: "/services",
  },
};

export default async function ServicesPage() {
  const [content, sectors] = await Promise.all([
    getContentMap("services"),
    getSectors(),
  ]);

  const heading = cms(content, "services.hero.heading", "Ten sectors, one accountable partner.");
  const lead = cms(
    content,
    "services.hero.lead",
    "Premium operational support for corporate organizations — plus a licensed trade and supply scope across logistics, commodities, equipment, and materials."
  );
  const hero = splitHeading(heading);

  return (
    <>
      <section className="page-hero hero-photo">
        <div className="wrap">
          <div className="eyebrow reveal">Our Services</div>
          <h1 className="reveal">
            {hero.start}
            {hero.accent ? (
              <>
                {" "}
                <span className="accent">{hero.accent}</span>
              </>
            ) : null}
          </h1>
          <p className="lead reveal">{lead}</p>
        </div>
      </section>

      <section className="sectors-nav">
        <div className="wrap">
          <SectorNavBar sectors={sectors} />
        </div>
      </section>

      <section className="sectors-detail">
        <div className="wrap">
          {sectors.map((s) => (
            <div className="sector-block" id={s.slug} key={s.id}>
              <div className="sector-header reveal">
                <span className="sector-code">{s.code} / {s.slug.toUpperCase()}</span>
                <h2>{s.name}</h2>
                <p>{s.shortDesc}</p>
              </div>
              <div className="sector-content reveal">
                <div className="sector-services">
                  <h3>Our Capabilities &amp; Scope</h3>
                  <ul>
                    {s.features && s.features.length > 0 ? (
                      s.features.map((f, i) => <li key={i}>{f}</li>)
                    ) : (
                      <li>Comprehensive operational execution and supply coordination.</li>
                    )}
                  </ul>
                </div>
                <div className="sector-description">
                  <h3>Why Choose SINA for {s.name}?</h3>
                  <p>{s.fullDesc || s.shortDesc}</p>
                  <p>Instead of managing multiple suppliers and vendors yourself, SINA acts as your accountable single-source partner on the ground.</p>
                  <Link className="btn btn-primary" href={`/contact`}>
                    Get a Quote for {s.name} →
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="method" id="method">
        <div className="wrap">
          <div className="section-head reveal">
            <h2>Our Working Methodology</h2>
            <p>
              Six phases from our working approach — client consultation through after-sales — applied
              across every sector we operate, with quality control and a single point of contact.
            </p>
          </div>
          <div className="method-grid">
            <div className="method-card reveal">
              <span className="method-phase">Phase 1</span>
              <h3>Client Consultation and Needs Assessment</h3>
              <p>
                We start with a structured consultation to document operational needs, volumes, sites,
                timelines, and quality expectations across all ten sectors before any work is committed.
              </p>
            </div>
            <div className="method-card reveal">
              <span className="method-phase">Phase 2</span>
              <h3>Planning and Technical Evaluation</h3>
              <p>
                Scope, schedules, and technical options are evaluated so procurement, logistics, events,
                facilities, construction, and advisory work sit in one coordinated programme.
              </p>
            </div>
            <div className="method-card reveal">
              <span className="method-phase">Phase 3</span>
              <h3>Procurement, Production, or Project Mobilization</h3>
              <p>
                Goods are sourced through our partner network; teams are recruited; venues and project
                sites are booked; trade channels or construction packages are opened as required.
              </p>
            </div>
            <div className="method-card reveal">
              <span className="method-phase">Phase 4</span>
              <h3>Implementation and Quality Control</h3>
              <p>
                Execution is supervised against agreed quality-assurance systems, with a single point of
                contact so compliance, timelines, and service standards stay visible.
              </p>
            </div>
            <div className="method-card reveal">
              <span className="method-phase">Phase 5</span>
              <h3>Delivery, Commissioning, and Client Support</h3>
              <p>
                Goods are handed over, staff deployed, works commissioned, and ongoing operational
                support stood up at the client site against the original brief.
              </p>
            </div>
            <div className="method-card reveal">
              <span className="method-phase">Phase 6</span>
              <h3>Continuous Monitoring and After-Sales Service</h3>
              <p>
                Performance is tracked after go-live, with operational reports, replacements, and
                after-sales support — using feedback for continuous improvement.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="faq-section">
        <div className="wrap">
          <div className="section-head reveal">
            <h2>Frequently Asked Questions</h2>
            <p>Common questions about how we work, contract arrangements, and service delivery.</p>
          </div>
          <div className="faq-list">
            <details className="faq-item reveal">
              <summary>Can SINA handle multi-sector operational requirements under one agreement?</summary>
              <div className="faq-answer">
                <p>Yes. That is our core operating model. A client can engage SINA for procurement, logistics coordination, and event organizing under one master contract with consolidated monthly billing.</p>
              </div>
            </details>
            <details className="faq-item reveal">
              <summary>What areas and regions in Ethiopia do you cover?</summary>
              <div className="faq-answer">
                <p>We are headquartered in Addis Ababa and provide operational and supply support across the capital and key commercial regional hubs.</p>
              </div>
            </details>
            <details className="faq-item reveal">
              <summary>How quickly can you deploy staff or begin deliveries?</summary>
              <div className="faq-answer">
                <p>Standard delivery runs and routine procurement orders commence within 24–48 hours of approval. For large staffing or event deployments, we agree on clear project milestone timelines during initial planning.</p>
              </div>
            </details>
            <details className="faq-item reveal">
              <summary>What is your quality assurance process?</summary>
              <div className="faq-answer">
                <p>Every delivery undergoes pre-dispatch inspection against client specifications. For staffing and property operations, on-site supervisors conduct routine audits and submit monthly performance metrics.</p>
              </div>
            </details>
          </div>
        </div>
      </section>
    </>
  );
}
