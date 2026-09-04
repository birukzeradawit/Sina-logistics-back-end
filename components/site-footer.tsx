import Link from "next/link";

const MAPS_DIRECTIONS_URL = "https://www.google.com/maps/dir/?api=1&destination=9.010820,38.876480";

export function SiteFooter() {
  return (
    <footer>
      <div className="wrap">
        <div className="foot-top">
          <Link href="/" className="logo">
            <img className="logo-mark" src="/assets/logo-icon.png" alt="SINA Supplies and Logistics" width={58} height={33} />
            <div>
              <div className="logo-text" style={{ color: "var(--paper)" }}>SINA</div>
              <div className="logo-sub" style={{ color: "#8b8a85" }}>Your Goods, Our Priority</div>
            </div>
          </Link>
          <div className="foot-cols">
            <div className="foot-col">
              <h5>Core Sectors</h5>
              <Link href="/services#procurement-supply">Procurement &amp; Supply</Link>
              <Link href="/services#logistics-delivery">Logistics &amp; Delivery</Link>
              <Link href="/services#event-organizing">Event Organizing</Link>
              <Link href="/services#property-management">Property Management</Link>
              <Link href="/services#staff-recruitment-outsourcing">Staff Recruitment</Link>
            </div>
            <div className="foot-col">
              <h5>Commercial &amp; Trade</h5>
              <Link href="/services#trade-scope">General Trading</Link>
              <Link href="/services#construction-real-estate">Construction</Link>
              <Link href="/services#energy-mining-agriculture">Agri &amp; Energy</Link>
              <Link href="/services#additional-support">Operations Support</Link>
            </div>
            <div className="foot-col">
              <h5>Company</h5>
              <Link href="/about">About SINA</Link>
              <Link href="/about#why">Why Clients Choose Us</Link>
              <Link href="/about#method">Working Methodology</Link>
              <Link href="/services">Full Sector Catalog</Link>
            </div>
            <div className="foot-col">
              <h5>Direct Contact</h5>
              <a href="tel:+251909696932">+251 909 69 69 32</a>
              <a href="mailto:sinasupplies@outlook.com">sinasupplies@outlook.com</a>
              <Link href="/contact" style={{ color: "var(--gold)", fontWeight: 600 }}>Request a Quote →</Link>
              <a
                href={MAPS_DIRECTIONS_URL}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "#E8940C", display: "inline-flex", alignItems: "center", gap: "6px", marginTop: "4px" }}
                title="Open office in Google Maps (9.010820, 38.876480)"
              >
                <span>HQ Coordinates</span>
                <svg width={13} height={13} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                  <polyline points="15 3 21 3 21 9" />
                  <line x1="10" y1="14" x2="21" y2="3" />
                </svg>
              </a>
            </div>
          </div>
        </div>
        <div className="foot-bottom">
          <span>© 2026 SINA SUPPLIES AND LOGISTICS PLC · ALL RIGHTS RESERVED</span>
          <div className="foot-status">
            <span className="foot-status-dot"></span>
            <span>SYSTEMS ACTIVE · ADDIS ABABA HQ</span>
          </div>
          <span>ETHIOPIAN LICENSED COMMERCIAL OPERATOR</span>
        </div>
      </div>
    </footer>
  );
}
