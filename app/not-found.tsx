import Link from "next/link";

export default function NotFound() {
  return (
    <div style={{ minHeight: "80vh", background: "#111112", color: "#F7F5F1", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Space Grotesk, sans-serif", padding: "40px 20px", textAlign: "center" }}>
      <div style={{ maxWidth: "560px" }}>
        <div style={{ color: "#FFCB47", fontFamily: "IBM Plex Mono, monospace", fontSize: "12px", letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: "12px" }}>404 · PAGE NOT FOUND</div>
        <h1 style={{ fontSize: "clamp(36px, 5vw, 64px)", fontFamily: "Big Shoulders Display, sans-serif", fontWeight: 900, textTransform: "uppercase", margin: "0 0 16px" }}>Lost in <span style={{ color: "#E8940C" }}>Transit.</span></h1>
        <p style={{ color: "#C7C5BE", fontSize: "16px", lineHeight: 1.6, marginBottom: "32px" }}>The requested page could not be located across our network.</p>
        <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
          <Link href="/" style={{ background: "#FFCB47", color: "#111112", padding: "12px 24px", borderRadius: "4px", fontWeight: 600, textDecoration: "none", fontSize: "13px", textTransform: "uppercase", fontFamily: "IBM Plex Mono, monospace" }}>Return Home</Link>
          <Link href="/services" style={{ background: "rgba(255,255,255,0.08)", color: "#F7F5F1", border: "1px solid rgba(255,255,255,0.2)", padding: "12px 24px", borderRadius: "4px", fontWeight: 600, textDecoration: "none", fontSize: "13px", textTransform: "uppercase", fontFamily: "IBM Plex Mono, monospace" }}>Explore Sectors</Link>
        </div>
      </div>
    </div>
  );
}
