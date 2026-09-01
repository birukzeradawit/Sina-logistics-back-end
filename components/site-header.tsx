"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const current =
    pathname === "/"
      ? "home"
      : pathname.startsWith("/about")
        ? "about"
        : pathname.startsWith("/services")
          ? "services"
          : pathname.startsWith("/contact")
            ? "contact"
            : "";

  return (
    <header>
      <nav>
        <Link href="/" className="logo" onClick={() => setOpen(false)}>
          <img className="logo-mark" src="/assets/logo-icon.png" alt="SINA Supplies and Logistics" width={58} height={33} />
          <div>
            <div className="logo-text">SINA</div>
            <div className="logo-sub">TRADING</div>
          </div>
        </Link>

        <div className={`nav-links${open ? " open" : ""}`}>
          <Link href="/" prefetch aria-current={current === "home" ? "page" : undefined} onClick={() => setOpen(false)}>Home</Link>
          <Link href="/about" prefetch aria-current={current === "about" ? "page" : undefined} onClick={() => setOpen(false)}>About</Link>
          <Link href="/services" prefetch aria-current={current === "services" ? "page" : undefined} onClick={() => setOpen(false)}>Services</Link>
          <Link href="/contact" prefetch aria-current={current === "contact" ? "page" : undefined} onClick={() => setOpen(false)}>Contact</Link>
        </div>

        <div className="nav-cta">
          <Link className="btn btn-primary" href="/contact" prefetch>Request a Quote</Link>
          <button
            className="nav-toggle"
            type="button"
            aria-label="Toggle menu"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            <span></span><span></span><span></span>
          </button>
        </div>
      </nav>
    </header>
  );
}
