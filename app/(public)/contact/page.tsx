import type { Metadata } from "next";
import { getContentMap } from "@/lib/content";
import { ContactForm } from "./contact-form";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Contact & Request a Quote | SINA Supplies & Logistics PLC",
  description:
    "Request a corporate quotation, procurement plan, or RFP proposal from SINA Supplies and Logistics PLC in Addis Ababa, Ethiopia.",
  keywords: [
    "Contact SINA Trading",
    "Request a Quote SINA PLC",
    "Procurement RFP Ethiopia",
    "SINA Phone Number Addis Ababa",
    "SINA Supplies Office Address",
  ],
  openGraph: {
    title: "Contact SINA Supplies & Logistics PLC | Request a Quote",
    description:
      "Tell us what your organization needs across procurement, logistics, events, property, staffing, or trade in Ethiopia.",
    url: "/contact",
  },
};

const MAPS_DIRECTIONS_URL = "https://www.google.com/maps/dir/?api=1&destination=9.010820,38.876480";

export default async function ContactPage() {
  const content = await getContentMap("contact");
  const address =
    content["contact.address"] ??
    "Lemi Kura Sub-city, W 03, House no. New, Addis Ababa, Ethiopia";
  const email = content["contact.email"] ?? "sinasupplies@outlook.com";
  const phone1 = content["contact.phone1"] ?? "+251 90-969-6932";
  const phone2 = content["contact.phone2"] ?? "+251 92-258-6552";
  const heroLead =
    content["contact.hero.lead"] ??
    "Procurement, logistics, events, property, staffing, or a trade enquiry — the team will respond with a tailored plan.";

  return (
    <>
      <section className="page-hero">
        <div className="wrap">
          <div className="eyebrow reveal">Get In Touch</div>
          <h1 className="reveal">Tell us what<br /><span className="accent">you need.</span></h1>
          <p className="lead reveal">{heroLead}</p>
        </div>
      </section>

      <section className="contact-section">
        <div className="wrap">
          <div className="contact-grid reveal">
            <div className="contact-info">
              <div className="info-card">
                <a href={`mailto:${email}`} className="info-icon" title="Email Us">
                  <svg viewBox="0 0 24 24"><path d="M3 6h18v12H3z" /><path d="m3 7 9 6 9-6" /></svg>
                </a>
                <div>
                  <div className="info-label">Email Us</div>
                  <div className="info-value"><a href={`mailto:${email}`}>{email}</a></div>
                </div>
              </div>

              <div className="info-card">
                <a href={`tel:${phone1.replace(/\s+/g, "")}`} className="info-icon" title="Call Us">
                  <svg viewBox="0 0 24 24"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-6-6 19.8 19.8 0 0 1-3.1-8.7A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.3 1.8.6 2.7a2 2 0 0 1-.5 2.1L8 9.7a16 16 0 0 0 6 6l1.2-1.2a2 2 0 0 1 2.1-.5c.9.3 1.8.5 2.7.6a2 2 0 0 1 1.7 2Z" /></svg>
                </a>
                <div>
                  <div className="info-label">Call Us</div>
                  <div className="info-value">
                    <a href={`tel:${phone1.replace(/\s+/g, "")}`}>{phone1}</a><br />
                    <a href={`tel:${phone2.replace(/\s+/g, "")}`}>{phone2}</a>
                  </div>
                </div>
              </div>

              <div className="info-card">
                <a
                  href={MAPS_DIRECTIONS_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="info-icon location-pin-btn"
                  title="Click to open office location in Google Maps"
                  style={{
                    background: "rgba(232, 148, 12, 0.18)",
                    border: "1px solid rgba(232, 148, 12, 0.45)",
                    boxShadow: "0 0 10px rgba(232, 148, 12, 0.25)",
                    cursor: "pointer",
                  }}
                >
                  <svg viewBox="0 0 24 24" style={{ stroke: "#FFCB47" }}>
                    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                </a>
                <div>
                  <div className="info-label">Visit Us</div>
                  <div className="info-value">{address}</div>
                  <a
                    href={MAPS_DIRECTIONS_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px",
                      fontSize: "12px",
                      fontWeight: 600,
                      color: "#FFCB47",
                      textDecoration: "none",
                      marginTop: "6px",
                      fontFamily: "var(--mono)",
                      letterSpacing: "0.04em",
                    }}
                  >
                    <span>Get Directions (Google Maps)</span>
                    <svg width={13} height={13} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                      <polyline points="15 3 21 3 21 9" />
                      <line x1="10" y1="14" x2="21" y2="3" />
                    </svg>
                  </a>
                </div>
              </div>

              <div className="info-card">
                <a href="https://www.sinatrading.et" target="_blank" rel="noopener noreferrer" className="info-icon" title="Visit Website">
                  <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" /><path d="M8 12h8M12 8v8" /></svg>
                </a>
                <div>
                  <div className="info-label">Website</div>
                  <div className="info-value"><a href="https://www.sinatrading.et" target="_blank" rel="noopener">www.sinatrading.et</a></div>
                </div>
              </div>

              <div className="contact-note">
                Inquiries are typically answered within 1–2 business days.
              </div>
              <a className="btn btn-ghost-dark" href="/assets/SINA-Company-Profile.pdf" download style={{ marginTop: 20, alignSelf: "flex-start", display: "inline-flex", alignItems: "center", gap: "8px" }}>
                <span>Download Company Profile (PDF)</span>
                <svg width={15} height={15} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
              </a>
            </div>

            <div className="contact-form-wrap">
              <h2>Request a Quote</h2>
              <p>Fill in a few details and we will get back to you with next steps.</p>
              <ContactForm />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
