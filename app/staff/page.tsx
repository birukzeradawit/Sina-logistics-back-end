"use client";

import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type Inquiry = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  sector: string | null;
  message: string;
  status: "NEW" | "CONTACTED" | "QUOTED" | "WON" | "LOST";
  createdAt: string;
};

const STATUS_COLORS: Record<string, string> = {
  NEW: "#E8940C",
  CONTACTED: "#3B82C4",
  QUOTED: "#FFCB47",
  WON: "#3E7A4E",
  LOST: "#6b6b68",
};

export default function StaffDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [filter, setFilter] = useState<string>("ALL");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/staff/login");
  }, [status, router]);

  useEffect(() => {
    fetch("/api/inquiries")
      .then((r) => r.json())
      .then((data) => {
        setInquiries(data);
        setLoading(false);
      });
  }, []);

  async function updateStatus(id: string, newStatus: string) {
    const res = await fetch(`/api/inquiries/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
    if (res.ok) {
      setInquiries((prev) =>
        prev.map((i) => (i.id === id ? { ...i, status: newStatus as any } : i))
      );
    }
  }

  const visible =
    filter === "ALL" ? inquiries : inquiries.filter((i) => i.status === filter);

  if (status === "loading" || loading) {
    return <div style={s.centered}>Loading…</div>;
  }

  return (
    <div style={s.page}>
      <header style={s.header}>
        <div>
          <div style={s.eyebrow}>SINA / Staff</div>
          <h1 style={s.h1}>Inquiries</h1>
        </div>
        <nav style={s.nav}>
          <Link href="/staff/content" style={s.navLink}>Edit Content</Link>
          <span style={s.userEmail}>{session?.user?.email}</span>
          <button style={s.signOut} onClick={() => signOut({ callbackUrl: "/staff/login" })}>
            Sign Out
          </button>
        </nav>
      </header>

      <div style={s.filters}>
        {["ALL", "NEW", "CONTACTED", "QUOTED", "WON", "LOST"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{ ...s.filterBtn, ...(filter === f ? s.filterBtnActive : {}) }}
          >
            {f}
          </button>
        ))}
      </div>

      <div style={s.list}>
        {visible.length === 0 && <div style={s.empty}>No inquiries in this view.</div>}
        {visible.map((inq) => (
          <div key={inq.id} style={s.card}>
            <div style={s.cardTop}>
              <div>
                <strong style={s.name}>{inq.firstName} {inq.lastName}</strong>
                <span style={s.sector}>{inq.sector || "General inquiry"}</span>
              </div>
              <span style={{ ...s.badge, background: STATUS_COLORS[inq.status] }}>
                {inq.status}
              </span>
            </div>
            <div style={s.contactRow}>
              <a href={`mailto:${inq.email}`} style={s.link}>{inq.email}</a>
              {inq.phone && <a href={`tel:${inq.phone}`} style={s.link}>{inq.phone}</a>}
              <span style={s.date}>{new Date(inq.createdAt).toLocaleDateString()}</span>
            </div>
            <p style={s.message}>{inq.message}</p>
            <div style={s.actions}>
              {["NEW", "CONTACTED", "QUOTED", "WON", "LOST"].map((st) => (
                <button
                  key={st}
                  onClick={() => updateStatus(inq.id, st)}
                  style={{
                    ...s.statusBtn,
                    ...(inq.status === st ? s.statusBtnActive : {}),
                  }}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const s: Record<string, React.CSSProperties> = {
  page: { minHeight: "100vh", background: "#F7F5F1", fontFamily: "system-ui, sans-serif", padding: "32px" },
  centered: { display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", color: "#5B5B58" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "28px" },
  eyebrow: { color: "#E8940C", fontSize: "11px", letterSpacing: "0.08em", textTransform: "uppercase" },
  h1: { fontSize: "28px", margin: 0, color: "#111112" },
  nav: { display: "flex", alignItems: "center", gap: "16px" },
  navLink: { color: "#111112", fontSize: "13px", textDecoration: "underline" },
  userEmail: { color: "#5B5B58", fontSize: "13px" },
  signOut: { background: "#111112", color: "#F7F5F1", border: "none", padding: "8px 14px", borderRadius: "4px", cursor: "pointer", fontSize: "12px" },
  filters: { display: "flex", gap: "8px", marginBottom: "20px" },
  filterBtn: { padding: "8px 14px", borderRadius: "999px", border: "1px solid rgba(17,17,18,0.15)", background: "transparent", cursor: "pointer", fontSize: "12px", color: "#5B5B58" },
  filterBtnActive: { background: "#111112", color: "#F7F5F1", borderColor: "#111112" },
  list: { display: "flex", flexDirection: "column", gap: "12px" },
  empty: { color: "#5B5B58", padding: "40px", textAlign: "center" },
  card: { background: "#fff", border: "1px solid rgba(17,17,18,0.1)", borderRadius: "6px", padding: "20px" },
  cardTop: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "10px" },
  name: { fontSize: "16px", color: "#111112" },
  sector: { display: "block", fontSize: "12px", color: "#5B5B58", marginTop: "2px" },
  badge: { fontSize: "10px", padding: "4px 10px", borderRadius: "999px", color: "#111112", fontWeight: 600, textTransform: "uppercase" },
  contactRow: { display: "flex", gap: "16px", fontSize: "13px", marginBottom: "10px" },
  link: { color: "#B96E00" },
  date: { color: "#9C9A94" },
  message: { fontSize: "14px", color: "#111112", lineHeight: 1.5, marginBottom: "14px" },
  actions: { display: "flex", gap: "6px", flexWrap: "wrap" },
  statusBtn: { fontSize: "11px", padding: "6px 10px", borderRadius: "4px", border: "1px solid rgba(17,17,18,0.15)", background: "transparent", cursor: "pointer" },
  statusBtnActive: { background: "#111112", color: "#F7F5F1", borderColor: "#111112" },
};
