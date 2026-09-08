"use client";

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

type StatusChange = {
  id: string;
  fromStatus: string | null;
  toStatus: string;
  createdAt: string;
  changedBy: {
    email: string;
    role: string;
  };
};

type Inquiry = {
  id: string;
  sector: string | null;
  message: string;
  status: "NEW" | "CONTACTED" | "QUOTED" | "WON" | "LOST";
  createdAt: string;
  statusHistory?: StatusChange[];
};

const SECTORS = [
  "Procurement & Supply",
  "Logistics & Delivery",
  "Event Organizing",
  "Property Management",
  "Staff Recruitment & Outsourcing",
  "Additional Operational Support",
  "Trade & Supply Scope",
  "Construction & Real Estate",
  "Energy, Mining & Agriculture",
  "Professional Consulting",
];

const STATUS_COLORS: Record<Inquiry["status"], string> = {
  NEW: "#E8940C",
  CONTACTED: "#3B82C4",
  QUOTED: "#D49E00",
  WON: "#3E7A4E",
  LOST: "#6B6B68",
};

export default function ClientPortalPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [sector, setSector] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/login");
    }
  }, [status, router]);

  const loadInquiries = () => {
    setLoading(true);
    fetch("/api/portal/inquiries")
      .then((r) => {
        if (!r.ok) throw new Error("Failed to load your inquiry history.");
        return r.json();
      })
      .then((data) => {
        if (Array.isArray(data)) setInquiries(data);
        setLoading(false);
      })
      .catch((err: Error) => {
        setErrorMsg(err.message);
        setLoading(false);
      });
  };

  useEffect(() => {
    if (status === "authenticated") {
      loadInquiries();
    }
  }, [status]);

  const counts = useMemo(() => {
    return inquiries.reduce(
      (acc, item) => {
        acc[item.status] += 1;
        return acc;
      },
      { NEW: 0, CONTACTED: 0, QUOTED: 0, WON: 0, LOST: 0 }
    );
  }, [inquiries]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const res = await fetch("/api/portal/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sector: sector || undefined, message }),
      });

      const data = await res.json().catch(() => null);
      if (!res.ok) throw new Error(data?.error || "Could not send your request.");

      setSector("");
      setMessage("");
      setSuccessMsg("Your request was submitted successfully. The SINA team will review it shortly.");
      loadInquiries();
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  if (status === "loading" || (status === "authenticated" && loading)) {
    return <div style={s.centered}>Loading your client portal…</div>;
  }

  return (
    <div style={s.page}>
      <header style={s.header}>
        <div>
          <div style={s.eyebrow}>SINA / Client Portal</div>
          <h1 style={s.h1}>Welcome back, {(session?.user as any)?.firstName || "Client"}</h1>
          <p style={s.subText}>
            Manage quote requests and review your inquiry pipeline in one place.
          </p>
        </div>
        <div style={s.nav}>
          <Link href="/contact" style={s.navLink}>Public Contact Page</Link>
          <button style={s.signOut} onClick={() => signOut({ callbackUrl: "/login" })}>Sign Out</button>
        </div>
      </header>

      <div style={s.summaryGrid}>
        <div style={s.summaryCard}><span style={s.summaryValue}>{inquiries.length}</span><span style={s.summaryLabel}>Total Requests</span></div>
        <div style={s.summaryCard}><span style={{ ...s.summaryValue, color: STATUS_COLORS.NEW }}>{counts.NEW}</span><span style={s.summaryLabel}>New</span></div>
        <div style={s.summaryCard}><span style={{ ...s.summaryValue, color: STATUS_COLORS.CONTACTED }}>{counts.CONTACTED}</span><span style={s.summaryLabel}>Contacted</span></div>
        <div style={s.summaryCard}><span style={{ ...s.summaryValue, color: STATUS_COLORS.QUOTED }}>{counts.QUOTED}</span><span style={s.summaryLabel}>Quoted</span></div>
        <div style={s.summaryCard}><span style={{ ...s.summaryValue, color: STATUS_COLORS.WON }}>{counts.WON}</span><span style={s.summaryLabel}>Won</span></div>
        <div style={s.summaryCard}><span style={{ ...s.summaryValue, color: STATUS_COLORS.LOST }}>{counts.LOST}</span><span style={s.summaryLabel}>Closed Lost</span></div>
      </div>

      <section style={s.section}>
        <div style={s.sectionHead}>
          <div>
            <h2 style={s.h2}>Submit a New Request</h2>
            <p style={s.subText}>Send a fresh procurement, logistics, staffing, or consulting request directly from your account.</p>
          </div>
        </div>

        {successMsg ? <div style={s.successBanner}>{successMsg}</div> : null}
        {errorMsg ? <div style={s.errorBanner}>{errorMsg}</div> : null}

        <form onSubmit={handleSubmit} style={s.form}>
          <div style={s.formRow}>
            <div style={s.field}>
              <label style={s.label}>Sector of interest</label>
              <select value={sector} onChange={(e) => setSector(e.target.value)} style={s.select}>
                <option value="">General inquiry</option>
                {SECTORS.map((item) => (
                  <option key={item} value={item}>{item}</option>
                ))}
              </select>
            </div>
          </div>

          <div style={s.field}>
            <label style={s.label}>Project requirements / message</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              style={s.textarea}
              placeholder="Describe your requirements, timelines, and operational needs..."
              required
            />
          </div>

          <button type="submit" style={s.primaryBtn} disabled={submitting}>
            {submitting ? "Submitting…" : "Submit Request"}
          </button>
        </form>
      </section>

      <section style={s.section}>
        <div style={s.sectionHead}>
          <div>
            <h2 style={s.h2}>Your Inquiry History</h2>
            <p style={s.subText}>Each request is tracked through the same internal SINA pipeline used by the staff team.</p>
          </div>
        </div>

        {inquiries.length === 0 ? (
          <div style={s.empty}>You have not submitted any requests yet.</div>
        ) : (
          <div style={s.list}>
            {inquiries.map((inq) => (
              <div key={inq.id} style={s.card}>
                <div style={s.cardTop}>
                  <div>
                    <strong style={s.name}>{inq.sector || "General Inquiry"}</strong>
                    <div style={s.date}>Submitted {new Date(inq.createdAt).toLocaleString()}</div>
                  </div>
                  <span style={{ ...s.badge, background: STATUS_COLORS[inq.status] }}>{inq.status}</span>
                </div>
                <div style={s.messageBox}>
                  <p style={s.message}>{inq.message}</p>
                </div>
                {inq.statusHistory && inq.statusHistory.length > 0 ? (
                  <div style={s.timeline}>
                    {inq.statusHistory.map((item) => (
                      <div key={item.id} style={s.timelineItem}>
                        <span style={s.timelineDot}>•</span>
                        <span style={s.timelineText}>
                          Updated from <strong>{item.fromStatus || "INITIAL"}</strong> to <strong>{item.toStatus}</strong>
                        </span>
                        <span style={s.timelineDate}>{new Date(item.createdAt).toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

const s: Record<string, React.CSSProperties> = {
  page: { minHeight: "100vh", background: "#F7F5F1", fontFamily: "system-ui, -apple-system, sans-serif", padding: "32px", maxWidth: "1200px", margin: "0 auto" },
  centered: { display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", color: "#5B5B58", fontSize: "16px" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px", flexWrap: "wrap", gap: "16px" },
  eyebrow: { color: "#E8940C", fontSize: "12px", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase" },
  h1: { fontSize: "28px", margin: "4px 0 0 0", color: "#111112" },
  h2: { fontSize: "18px", margin: 0, color: "#111112" },
  subText: { fontSize: "13px", color: "#7B7B78", marginTop: "4px", maxWidth: "640px", lineHeight: 1.55 },
  nav: { display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" },
  navLink: { color: "#111112", fontSize: "13px", fontWeight: 500, textDecoration: "none", padding: "6px 12px", background: "#EAE7DF", borderRadius: "4px" },
  signOut: { background: "#111112", color: "#F7F5F1", border: "none", padding: "8px 14px", borderRadius: "4px", cursor: "pointer", fontSize: "12px", fontWeight: 500 },
  summaryGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "12px", marginBottom: "24px" },
  summaryCard: { background: "#FFFFFF", border: "1px solid rgba(17,17,18,0.08)", borderRadius: "6px", padding: "14px 16px", textAlign: "center" },
  summaryValue: { display: "block", fontSize: "22px", fontWeight: 700, color: "#111112", marginBottom: "4px" },
  summaryLabel: { fontSize: "11px", color: "#7B7B78", textTransform: "uppercase", letterSpacing: "0.04em" },
  section: { background: "#FFFFFF", border: "1px solid rgba(17,17,18,0.08)", borderRadius: "8px", padding: "24px", marginBottom: "28px" },
  sectionHead: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", flexWrap: "wrap", gap: "12px" },
  successBanner: { background: "#E7F6E9", border: "1px solid #B8E4C1", color: "#236B35", padding: "10px 16px", borderRadius: "6px", marginBottom: "16px", fontSize: "13px", fontWeight: 500 },
  errorBanner: { background: "#FDE8E8", border: "1px solid #F8B4B4", color: "#9B1C1C", padding: "10px 16px", borderRadius: "6px", marginBottom: "16px", fontSize: "13px" },
  form: { display: "flex", flexDirection: "column", gap: "14px" },
  formRow: { display: "flex", gap: "12px", flexWrap: "wrap" },
  field: { display: "flex", flexDirection: "column", gap: "6px", flex: 1 },
  label: { color: "#5B5B58", fontSize: "12px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" },
  select: { width: "100%", padding: "10px 12px", borderRadius: "6px", border: "1px solid rgba(17,17,18,0.15)", fontSize: "14px", background: "#FFFFFF" },
  textarea: { minHeight: "140px", padding: "12px 14px", borderRadius: "6px", border: "1px solid rgba(17,17,18,0.15)", fontSize: "14px", resize: "vertical", fontFamily: "inherit" },
  primaryBtn: { alignSelf: "flex-start", background: "#111112", color: "#F7F5F1", border: "none", padding: "10px 18px", borderRadius: "4px", cursor: "pointer", fontSize: "13px", fontWeight: 600 },
  empty: { color: "#5B5B58", padding: "48px", textAlign: "center", background: "#FAF9F6", borderRadius: "6px", border: "1px dashed rgba(17,17,18,0.15)" },
  list: { display: "flex", flexDirection: "column", gap: "14px" },
  card: { background: "#FFFFFF", border: "1px solid rgba(17,17,18,0.1)", borderRadius: "8px", padding: "20px", boxShadow: "0 1px 3px rgba(0,0,0,0.02)" },
  cardTop: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "10px", gap: "12px" },
  name: { fontSize: "17px", color: "#111112" },
  date: { color: "#9C9A94", fontSize: "12px", marginTop: "4px" },
  badge: { fontSize: "11px", padding: "4px 10px", borderRadius: "999px", color: "#FFFFFF", fontWeight: 700, letterSpacing: "0.04em", textTransform: "uppercase" },
  messageBox: { background: "#FAF9F6", padding: "12px 14px", borderRadius: "6px", border: "1px solid rgba(17,17,18,0.05)", marginBottom: "14px" },
  message: { fontSize: "14px", color: "#111112", lineHeight: 1.5, margin: 0, whiteSpace: "pre-wrap" },
  timeline: { marginTop: "8px", display: "flex", flexDirection: "column", gap: "6px", background: "#F4F2EC", padding: "10px 12px", borderRadius: "6px" },
  timelineItem: { fontSize: "12px", color: "#333", display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" },
  timelineDot: { color: "#E8940C", fontSize: "16px" },
  timelineText: { flex: 1 },
  timelineDate: { fontSize: "11px", color: "#888" },
};
