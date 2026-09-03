import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export default function NotFound() {
  return (
    <div className="sina-site">
      <SiteHeader />
      <main>
        <section className="page-hero" style={{ minHeight: "60vh", display: "flex", alignItems: "center" }}>
          <div className="wrap" style={{ textAlign: "center", maxWidth: "640px", margin: "0 auto" }}>
            <div className="eyebrow" style={{ color: "var(--gold)" }}>404 · PAGE NOT FOUND</div>
            <h1 style={{ fontSize: "clamp(42px, 6vw, 76px)", margin: "14px 0 20px" }}>
              Lost in <span className="accent" style={{ color: "var(--amber)" }}>Transit.</span>
            </h1>
            <p className="lead" style={{ margin: "0 auto 34px", color: "#C7C5BE", lineHeight: 1.6 }}>
              The page or route you are looking for might have moved, been renamed, or is temporarily unavailable across our operational network.
            </p>
            <div style={{ display: "flex", gap: "14px", justifyContent: "center", flexWrap: "wrap" }}>
              <Link className="btn btn-primary" href="/">Return to Homepage</Link>
              <Link className="btn btn-ghost-dark" href="/services">View Our 9 Sectors →</Link>
              <Link className="btn btn-ghost-dark" href="/contact">Contact Support</Link>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
