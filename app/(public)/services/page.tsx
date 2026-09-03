import Link from "next/link";
import { getContentMap, splitHeading, cms } from "@/lib/content";
import { getSectors } from "@/lib/sectors";

export default async function ServicesPage() {
  const [content, sectors] = await Promise.all([
    getContentMap("services"),
    getSectors(),
  ]);

  const heading = cms(content, "services.hero.heading", "Nine sectors, one accountable partner.");
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

      {/* Dynamic Nav Anchor Bar */}
      <section className="sectors-nav">
        <div className="wrap">
          <div className="nav-grid reveal">
            {sectors.map((s) => (
              <a href={`#${s.slug}`} className="nav-item" key={s.id}>
                {s.name.split("&")[0].trim()}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Dynamic Detailed Sectors */}
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

      {/* Working Methodology */}
      <section className="method-section">
        <div className="wrap">
          <div className="section-head reveal">
            <h2>Our Working Methodology</h2>
            <p>A structured five-phase approach that ensures quality control, visibility, and timely delivery at every step.</p>
          </div>
          <div className="process-grid">
            <div className="process-step reveal">
              <span className="step-num">01</span>
              <h4>Planning &amp; Needs Assessment</h4>
              <p>Consult with the client to define requirements, quantities, schedules, and delivery specifications.</p>
            </div>
            <div className="process-step reveal">
              <span className="step-num">02</span>
              <h4>Sourcing &amp; Procurement</h4>
              <p>Identify and negotiate with vetted suppliers to secure quality materials and services at competitive rates.</p>
            </div>
            <div className="process-step reveal">
              <span className="step-num">03</span>
              <h4>Execution &amp; Coordination</h4>
              <p>Deploy specialized operational teams, coordinate logistics, and supervise event or property activities.</p>
            </div>
            <div className="process-step reveal">
              <span className="step-num">04</span>
              <h4>Delivery &amp; Deployment</h4>
              <p>Ensure timely distribution, accurate handover, and proper setup across all designated client sites.</p>
            </div>
            <div className="process-step reveal">
              <span className="step-num">05</span>
              <h4>Monitoring &amp; Reporting</h4>
              <p>Conduct quality checks, gather client feedback, and provide transparent operational and financial reports.</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Accordion */}
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
