import type { ReactNode } from "react";
import "@/styles/site/base.css";
import "@/styles/site/layout.css";
import "@/styles/site/home.css";
import "@/styles/site/overview.css";
import "@/styles/site/stats.css";
import "@/styles/site/sectors-preview.css";
import "@/styles/site/about.css";
import "@/styles/site/sectors.css";
import "@/styles/site/contact.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { SiteEffects } from "@/components/site-effects";

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <div className="sina-site">
      <SiteHeader />
      {children}
      <SiteFooter />
      <SiteEffects />
    </div>
  );
}
