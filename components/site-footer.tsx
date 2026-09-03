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
              <h5>Services</h5>
              <Link href="/services#procurement">Procurement</Link>
              <Link href="/services#logistics">Logistics</Link>
              <Link href="/services#events">Events</Link>
              <Link href="/services#property">Property</Link>
              <Link href="/services#staffing">Staffing</Link>
            </div>
            <div className="foot-col">
              <h5>Company</h5>
              <Link href="/about">About Us</Link>
              <Link href="/about#why">Why SINA</Link>
              <Link href="/about#method">Our Method</Link>
            </div>
            <div className="foot-col">
              <h5>Contact</h5>
              <a href="mailto:sinasupplies@outlook.com">Email Us</a>
              <Link href="/contact">Get a Quote</Link>
              <a
                href={MAPS_DIRECTIONS_URL}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "#E8940C", display: "inline-flex", alignItems: "center", gap: "6px" }}
                title="Open office in Google Maps (9.010820, 38.876480)"
              >
                <span>Get Directions</span>
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
          <span>© 2026 SINA TRADING PLC</span>
          <span>ADDIS ABABA · ETHIOPIA</span>
        </div>
      </div>
    </footer>
  );
}
