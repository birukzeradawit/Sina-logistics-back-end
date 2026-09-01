import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { getContentMap } from "@/lib/content";
import { ContactForm } from "./contact-form";

export const dynamic = "force-dynamic";

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
      <SiteHeader current="contact" />

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
                <div className="info-icon"><svg viewBox="0 0 24 24"><path d="M3 6h18v12H3z" /><path d="m3 7 9 6 9-6" /></svg></div>
                <div>
                  <div className="info-label">Email Us</div>
                  <div className="info-value"><a href={`mailto:${email}`}>{email}</a></div>
                </div>
              </div>
              <div className="info-card">
                <div className="info-icon"><svg viewBox="0 0 24 24"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3.1-8.7A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.3 1.8.6 2.7a2 2 0 0 1-.5 2.1L8 9.7a16 16 0 0 0 6 6l1.2-1.2a2 2 0 0 1 2.1-.5c.9.3 1.8.5 2.7.6a2 2 0 0 1 1.7 2Z" /></svg></div>
                <div>
                  <div className="info-label">Call Us</div>
                  <div className="info-value"><a href={`tel:${phone1.replace(/\s+/g, "")}`}>{phone1}</a><br /><a href={`tel:${phone2.replace(/\s+/g, "")}`}>{phone2}</a></div>
                </div>
              </div>
              <div className="info-card">
                <div className="info-icon"><svg viewBox="0 0 24 24"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></svg></div>
                <div>
                  <div className="info-label">Visit Us</div>
                  <div className="info-value">{address}</div>
                </div>
              </div>
              <div className="info-card">
                <div className="info-icon"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" /><path d="M8 12h8M12 8v8" /></svg></div>
                <div>
                  <div className="info-label">Website</div>
                  <div className="info-value"><a href="https://www.sinatrading.et" target="_blank" rel="noopener">www.sinatrading.et</a></div>
                </div>
              </div>
              <div className="contact-note">
                Inquiries are typically answered within 1–2 business days.
              </div>
              <a className="btn btn-ghost-dark" href="/assets/SINA-Company-Profile.pdf" download style={{ marginTop: 20, alignSelf: "flex-start" }}>
                Download Company Profile (PDF) ↓
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

      <SiteFooter />
    </>
  );
}
