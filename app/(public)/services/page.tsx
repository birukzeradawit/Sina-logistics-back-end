import Link from "next/link";
import { getContentMap, splitHeading, cms } from "@/lib/content";

export default async function ServicesPage() {
  const content = await getContentMap("services");
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

      <section className="sectors-nav">
        <div className="wrap">
          <div className="nav-grid reveal">
            <a href="#procurement" className="nav-item">Procurement</a>
            <a href="#logistics" className="nav-item">Logistics</a>
            <a href="#events" className="nav-item">Events</a>
            <a href="#property" className="nav-item">Property</a>
            <a href="#staffing" className="nav-item">Staffing</a>
            <a href="#support" className="nav-item">Support</a>
            <a href="#trade" className="nav-item">Trade Scope</a>
          </div>
        </div>
      </section>

      <section className="sectors-detail">
        <div className="wrap">
          <div className="sector-block" id="procurement">
            <div className="sector-header reveal">
              <span className="sector-code">SV-01 / PROCUREMENT</span>
              <h2>Procurement &amp; Supply Services</h2>
              <p>Sourcing, supplier management, and reliable supply for corporate and event needs.</p>
            </div>
            <div className="sector-content reveal">
              <div className="sector-services">
                <h3>Our Services</h3>
                <ul>
                  <li>Office consumables and supplies</li>
                  <li>Hospitality and refreshment supplies</li>
                  <li>Meeting and conference materials</li>
                  <li>Holiday and celebration items</li>
                  <li>Supplier sourcing and management</li>
                  <li>Inventory monitoring and replenishment</li>
                </ul>
              </div>
              <div className="sector-description">
                <h3>Why Our Procurement Services?</h3>
                <p>With a strong network of suppliers and service providers, SINA ensures timely delivery, quality assurance, and professional execution — from everyday office consumables to full-scale event supply runs.</p>
                <p>Instead of managing multiple suppliers yourself, one point of contact handles sourcing, negotiation, and delivery on your behalf.</p>
                <Link className="btn btn-primary" href="/contact">Get a Procurement Quote →</Link>
              </div>
            </div>
          </div>

          <div className="sector-block" id="logistics">
            <div className="sector-header reveal">
              <span className="sector-code">SV-02 / LOGISTICS</span>
              <h2>Logistics &amp; Delivery Services</h2>
              <p>Transportation coordination, distribution, and reliable scheduled delivery.</p>
            </div>
            <div className="sector-content reveal">
              <div className="sector-services">
                <h3>Our Services</h3>
                <ul>
                  <li>Transportation coordination</li>
                  <li>Delivery facilitation</li>
                  <li>Distribution management</li>
                  <li>Vendor coordination</li>
                  <li>Scheduled delivery services</li>
                </ul>
              </div>
              <div className="sector-description">
                <h3>Why Our Logistics Services?</h3>
                <p>Our logistics coordination keeps goods and materials moving reliably — whether it is a one-off delivery or an ongoing scheduled distribution arrangement for a corporate client.</p>
                <p>We work with a network of logistics partners to ensure timely delivery and professional service execution across every job.</p>
                <Link className="btn btn-primary" href="/contact">Get a Logistics Quote →</Link>
              </div>
            </div>
          </div>

          <div className="sector-block" id="events">
            <div className="sector-header reveal">
              <span className="sector-code">SV-03 / EVENTS</span>
              <h2>Event Organizing Services</h2>
              <p>Complete event planning and coordination, from concept to execution.</p>
            </div>
            <div className="sector-content reveal">
              <div className="sector-services">
                <h3>Events We Organize</h3>
                <ul>
                  <li>Corporate events</li>
                  <li>Conferences and workshops</li>
                  <li>Product launches</li>
                  <li>Graduation ceremonies</li>
                  <li>Holiday celebrations</li>
                  <li>Traditional and cultural events</li>
                  <li>VIP guest hospitality arrangements</li>
                </ul>
              </div>
              <div className="sector-description">
                <h3>What’s Included</h3>
                <p>Venue coordination, decoration and branding, catering coordination, audio-visual setup, guest management, transportation arrangements, conference hall rental, and full event logistics and supervision — SINA handles the details so your event runs from start to finish.</p>
                <Link className="btn btn-primary" href="/contact">Get an Event Quote →</Link>
              </div>
            </div>
          </div>

          <div className="sector-block" id="property">
            <div className="sector-header reveal">
              <span className="sector-code">SV-04 / PROPERTY</span>
              <h2>Property Management Services</h2>
              <p>Commercial and residential property management, maintained end-to-end.</p>
            </div>
            <div className="sector-content reveal">
              <div className="sector-services">
                <h3>Our Services Include</h3>
                <ul>
                  <li>Commercial property management</li>
                  <li>Residential property management</li>
                  <li>Facility maintenance coordination</li>
                  <li>Utility payment management</li>
                  <li>Cleaning and housekeeping supervision</li>
                  <li>Security service coordination</li>
                  <li>Tenant communication support</li>
                  <li>Routine inspection and reporting</li>
                </ul>
              </div>
              <div className="sector-description">
                <h3>Specialized Management For</h3>
                <p>Beyond standard property management, we offer specialized management for spa facilities, gym operations, swimming pool facilities, and recreational service areas — a single team covering both the property itself and the amenities inside it.</p>
                <Link className="btn btn-primary" href="/contact">Get a Property Quote →</Link>
              </div>
            </div>
          </div>

          <div className="sector-block" id="staffing">
            <div className="sector-header reveal">
              <span className="sector-code">SV-05 / STAFFING</span>
              <h2>Staff Recruitment &amp; Outsourcing</h2>
              <p>Qualified personnel, recruited and managed, across operational roles.</p>
            </div>
            <div className="sector-content reveal">
              <div className="sector-services">
                <h3>SINA Recruits &amp; Manages</h3>
                <ul>
                  <li>Administrative staff</li>
                  <li>Receptionists</li>
                  <li>Housekeeping staff</li>
                  <li>Maintenance personnel</li>
                  <li>Traditional coffee and tea makers</li>
                  <li>Event support staff</li>
                  <li>Spa and wellness staff</li>
                  <li>Gym and swimming pool attendants</li>
                  <li>Drivers and logistics assistants</li>
                  <li>Temporary and contract employees</li>
                </ul>
              </div>
              <div className="sector-description">
                <h3>Additional HR Support</h3>
                <p>Beyond placement, we provide payroll administration, attendance monitoring, staff replacement coordination, and ongoing HR operational support — so managing outsourced staff does not become a second job.</p>
                <Link className="btn btn-primary" href="/contact">Get a Staffing Quote →</Link>
              </div>
            </div>
          </div>

          <div className="sector-block" id="support">
            <div className="sector-header reveal">
              <span className="sector-code">SV-06 / ADDITIONAL SUPPORT</span>
              <h2>Additional Support Services</h2>
              <p>Day-to-day operational tasks that sit beside the five core services.</p>
            </div>
            <div className="sector-content reveal">
              <div className="sector-services">
                <h3>Included On Request</h3>
                <ul>
                  <li>Utility expense payment management</li>
                  <li>Corporate hospitality coordination</li>
                  <li>Vendor and supplier negotiation</li>
                  <li>Guest meal arrangements</li>
                  <li>Office operational support</li>
                  <li>Monthly operational reporting</li>
                </ul>
              </div>
              <div className="sector-description">
                <h3>How It Fits</h3>
                <p>These services keep facilities, guests, and vendors moving without adding another contractor. They are typically bundled with property, staffing, or procurement retainers.</p>
                <Link className="btn btn-primary" href="/contact">Discuss Support Needs →</Link>
              </div>
            </div>
          </div>

          <div className="sector-block" id="trade">
            <div className="sector-header reveal">
              <span className="sector-code">SV-07 / TRADE &amp; SUPPLY SCOPE</span>
              <h2>Licensed Trade &amp; Supply Activities</h2>
              <p>Beyond day-to-day corporate support, SINA is licensed across a wide commercial scope. These are grouped below so you can see where we can source, move, or supply — without treating every line as a separate product brand.</p>
            </div>
            <div className="trade-grid">
              <article className="trade-card reveal">
                <h3>Cargo, Transport &amp; Warehousing</h3>
                <p>Transportation, freight handling, warehouse rental, cargo, transit and forwarding, and commission-based logistics services.</p>
              </article>
              <article className="trade-card reveal">
                <h3>Furniture &amp; Hospitality Equipment</h3>
                <p>Manufacturing, import, export, supply, and distribution of furniture and equipment for homes, offices, hotels, and restaurants.</p>
              </article>
              <article className="trade-card reveal">
                <h3>Office Technology &amp; Electronics</h3>
                <p>Printing services and equipment, computers and stationery, electronics, household appliances, office equipment, mobile phones and accessories.</p>
              </article>
              <article className="trade-card reveal">
                <h3>Automotive, Medical &amp; Industrial Goods</h3>
                <p>Automotive spare parts, batteries and tires; medical equipment and pharmaceuticals; plastics; textiles, leather, and footwear.</p>
              </article>
              <article className="trade-card reveal">
                <h3>Agri-commodities &amp; Food</h3>
                <p>Coffee farming, roasting, and export; pulses and oilseeds; spices, traditional foods, and injera; sesame, soybean, maize, sorghum, and chili; forestry and fisheries.</p>
              </article>
              <article className="trade-card reveal">
                <h3>Beverages</h3>
                <p>Production, distribution, and sale of bottled mineral water, soft drinks, and alcoholic beverages for the domestic market.</p>
              </article>
              <article className="trade-card reveal">
                <h3>Energy &amp; Utilities</h3>
                <p>Electricity, gas, steam, and water-supply related services.</p>
              </article>
              <article className="trade-card reveal">
                <h3>Construction, Real Estate &amp; Equipment</h3>
                <p>General contracting and road construction; construction materials and machinery rental; aluminum profiles; electrical, ceramic, and finishing materials; agricultural and construction equipment; development, sale, management, and leasing of commercial and residential property.</p>
              </article>
              <article className="trade-card reveal">
                <h3>Mining, Tourism &amp; Community Services</h3>
                <p>Mining and quarrying; tour operation, travel agency, and vehicle rental; community, social, and personal support services; wholesale, retail, manufacturing, and maintenance.</p>
              </article>
            </div>
          </div>
        </div>
      </section>

      <section className="sectors-cta">
        <div className="wrap">
          <div className="cta-content reveal">
            <h2>Ready to Work With Us?</h2>
            <p>Tell us whether you need ongoing operational support, a one-off supply run, or a larger trade enquiry.</p>
            <Link className="btn btn-primary" href="/contact">Request a Proposal →</Link>
          </div>
        </div>
      </section>

      <SiteFooter />
    </>
  );
}
