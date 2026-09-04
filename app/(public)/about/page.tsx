import type { Metadata } from "next";
import Link from "next/link";
import { getContentMap, splitHeading, cms } from "@/lib/content";

export const metadata: Metadata = {
  title: "About SINA | Corporate Partner in Ethiopia",
  description:
    "Learn about SINA Supplies and Logistics PLC — an established partner in Addis Ababa, Ethiopia providing procurement, logistics, event management, property management, staffing, and commercial trade.",
  keywords: [
    "About SINA Trading",
    "SINA Supplies and Logistics Ethiopia",
    "Company Profile SINA PLC",
    "Corporate Partner Addis Ababa",
    "Ethiopian Logistics and Procurement",
  ],
  openGraph: {
    title: "About SINA Supplies & Logistics PLC",
    description:
      "Reliable, efficient, and cost-effective operational support for corporate organizations and international institutions in Ethiopia.",
    url: "/about",
  },
};

export default async function AboutPage() {
  const content = await getContentMap("about");
  const heroHeading = cms(content, "about.hero.heading", "Integrated support for Ethiopia.");
  const heroLead = cms(
    content,
    "about.hero.lead",
    "SINA Supplies and Logistics PLC delivers reliable, efficient, and cost-effective operational support to corporate organizations, institutions, and private clients."
  );
  const introHeading = cms(content, "about.intro.heading", "Who We Are");
  const introBody = cms(
    content,
    "about.intro.body",
    "SINA Supplies and Logistics PLC is a dynamic Ethiopian company specializing in procurement, logistics coordination, event management, property management, staffing solutions, and integrated business support services."
  );
  const visionHeading = cms(content, "about.vision.heading", "Vision & Mission");
  const visionText = cms(
    content,
    "about.vision.text",
    "To become one of Ethiopia’s leading integrated procurement, logistics, and business support service providers, recognized for reliability, professionalism, and customer satisfaction."
  );
  const whyHeading = cms(content, "about.why.heading", "Why Clients Choose SINA");
  const methodHeading = cms(content, "about.method.heading", "Working Methodology");
  const benefitsHeading = cms(content, "about.benefits.heading", "Expected Benefits");
  const csrHeading = cms(content, "about.csr.heading", "Built to serve local and international organizations");
  const csrBody = cms(
    content,
    "about.csr.body",
    "SINA Supplies and Logistics PLC is committed to expanding its integrated business support solutions across Ethiopia by investing in technology, strengthening supplier partnerships, enhancing service quality, and developing a highly skilled operational team.\n\nThe same network that supports day-to-day corporate operations also underpins a wider licensed supply scope — from cargo and commodities to equipment and materials. See the full list on our services page."
  );

  const aboutImage = cms(
    content,
    "about.hero.image",
    "/assets/sina-who-we-are.jpg"
  );

  const hero = splitHeading(heroHeading);

  return (
    <>
      <section className="page-hero">
        <div className="wrap">
          <div className="eyebrow reveal">About Us</div>
          <h1 className="reveal">
            {hero.start}
            {hero.accent ? (
              <>
                {" "}
                <span className="accent">{hero.accent}</span>
              </>
            ) : null}
          </h1>
          <p className="lead reveal">{heroLead}</p>
        </div>
      </section>

      <section className="about-intro">
        <div className="wrap">
          <div className="intro-grid">
            <div className="intro-content reveal">
              <h2>{introHeading}</h2>
              {introBody.split(/\n+/).map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
            <div className="intro-image reveal">
              <img src={aboutImage} alt="SINA operations" />
            </div>
          </div>
        </div>
      </section>

      <section className="mission-values" id="vision">
        <div className="wrap">
          <div className="section-head reveal">
            <h2>{visionHeading}</h2>
            <p>The direction we are building toward, and how we serve clients every day.</p>
          </div>
          <div className="vision-block reveal">
            <div className="eyebrow">Vision</div>
            <p>{visionText}</p>
          </div>
          <div className="values-grid">
            <div className="value-card reveal">
              <h3>Procurement &amp; Logistics</h3>
              <p>Provide high-quality procurement and logistics solutions that keep operations supplied and on schedule.</p>
            </div>
            <div className="value-card reveal">
              <h3>Events &amp; Property</h3>
              <p>Deliver professional event and property management services with clear accountability on the ground.</p>
            </div>
            <div className="value-card reveal">
              <h3>Staffing &amp; Operations</h3>
              <p>Support organizations with efficient staffing and operational services, including payroll and replacement cover.</p>
            </div>
            <div className="value-card reveal">
              <h3>Long-term Value</h3>
              <p>Create long-term value for clients through dependable service delivery, reporting, and cost control.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="why-sina" id="why">
        <div className="wrap">
          <div className="section-head reveal">
            <h2>{whyHeading}</h2>
            <p>Why organizations work with SINA Supplies and Logistics PLC.</p>
          </div>
          <div className="why-grid">
            <div className="why-item reveal">
              <div className="why-number">01</div>
              <h3>Reliable Service Delivery</h3>
              <p>Consistent execution and dependable support across procurement, logistics, events, property, and staffing.</p>
            </div>
            <div className="why-item reveal">
              <div className="why-number">02</div>
              <h3>Strong Supplier Network</h3>
              <p>Access to qualified vendors, service providers, and logistics partners — without you managing each one.</p>
            </div>
            <div className="why-item reveal">
              <div className="why-number">03</div>
              <h3>Quality Assurance &amp; Accountability</h3>
              <p>Standards, checks, and responsible delivery, with a single point of contact for every engagement.</p>
            </div>
            <div className="why-item reveal">
              <div className="why-number">04</div>
              <h3>Fast Response &amp; Coordination</h3>
              <p>Quick communication and issue resolution when schedules shift or a replacement is needed.</p>
            </div>
            <div className="why-item reveal">
              <div className="why-number">05</div>
              <h3>Cost-effective Support</h3>
              <p>Practical solutions that help control expenses — from supplier negotiation to outsourced operations.</p>
            </div>
            <div className="why-item reveal">
              <div className="why-number">06</div>
              <h3>Integrated, One Provider</h3>
              <p>Procurement, staffing, events, and property support coordinated under one company.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="method" id="method">
        <div className="wrap">
          <div className="section-head reveal">
            <h2>{methodHeading}</h2>
            <p>Five phases we use on every engagement — from first brief to ongoing reports.</p>
          </div>
          <div className="method-grid">
            <div className="method-card reveal"><span className="method-phase">Phase 1</span><h3>Planning</h3><p>Review client requirements and schedules.</p></div>
            <div className="method-card reveal"><span className="method-phase">Phase 2</span><h3>Sourcing</h3><p>Identify qualified suppliers and service providers.</p></div>
            <div className="method-card reveal"><span className="method-phase">Phase 3</span><h3>Execution</h3><p>Procure, organize, recruit, and coordinate services.</p></div>
            <div className="method-card reveal"><span className="method-phase">Phase 4</span><h3>Delivery &amp; Deployment</h3><p>Ensure timely delivery and service implementation.</p></div>
            <div className="method-card reveal"><span className="method-phase">Phase 5</span><h3>Monitoring &amp; Reporting</h3><p>Provide performance updates and operational reports.</p></div>
          </div>
        </div>
      </section>

      <section className="benefits" id="benefits">
        <div className="wrap">
          <div className="section-head reveal">
            <h2>{benefitsHeading}</h2>
            <p>What clients typically gain when operations sit with one accountable partner.</p>
          </div>
          <ul className="benefits-list">
            <li className="reveal">Reduced administrative workload</li>
            <li className="reveal">Improved operational efficiency</li>
            <li className="reveal">Better cost control and procurement management</li>
            <li className="reveal">Professional event execution</li>
            <li className="reveal">Well-maintained facilities and properties</li>
            <li className="reveal">Access to qualified and managed staff</li>
            <li className="reveal">Enhanced employee and guest experience</li>
            <li className="reveal">Timely reporting and service transparency</li>
          </ul>
        </div>
      </section>

      <section className="csr" id="focus">
        <div className="wrap">
          <div className="csr-grid">
            <div className="csr-content reveal">
              <div className="eyebrow">Strategic Focus</div>
              <h2>{csrHeading}</h2>
              {csrBody.split(/\n\n+/).map((p, i) => (
                <p key={i}>{p}</p>
              ))}
              <Link className="btn btn-ghost" href="/services#trade">View Supply Scope →</Link>
            </div>
            <div className="csr-image reveal">
              <img src="/assets/port-sunset.png" alt="SINA strategic operations" />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
