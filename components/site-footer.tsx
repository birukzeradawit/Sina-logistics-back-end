import Link from "next/link";

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
