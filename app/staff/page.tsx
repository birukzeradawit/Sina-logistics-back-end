"use client";

import { useEffect, useState, useMemo } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type StatusChange = {
  id: string;
  fromStatus: string | null;
  toStatus: string;
  createdAt: string;
  changedBy: {
    id: string;
    email: string;
    role: string;
  };
};

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
  statusHistory?: StatusChange[];
};

const STATUS_COLORS: Record<string, string> = {
  NEW: "#E8940C",
  CONTACTED: "#3B82C4",
  QUOTED: "#D49E00",
  WON: "#3E7A4E",
  LOST: "#6b6b68",
};

export default function StaffDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [filter, setFilter] = useState<string>("ALL");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [expandedHistories, setExpandedHistories] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (status === "unauthenticated") router.push("/staff/login");
  }, [status, router]);

  const loadInquiries = () => {
    fetch("/api/inquiries")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setInquiries(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    loadInquiries();
  }, []);

  async function updateStatus(id: string, newStatus: string) {
    const res = await fetch(`/api/inquiries/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
    if (res.ok) {
      loadInquiries();
    }
  }

  async function deleteInquiry(id: string, name: string) {
    if (!confirm(`Are you sure you want to delete the inquiry from ${name}?`)) return;
    const res = await fetch(`/api/inquiries/${id}`, {
      method: "DELETE",
    });
    if (res.ok) {
      setInquiries((prev) => prev.filter((i) => i.id !== id));
    }
  }

  function toggleHistory(id: string) {
    setExpandedHistories((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  const counts = useMemo(() => {
    const c: Record<string, number> = { ALL: inquiries.length, NEW: 0, CONTACTED: 0, QUOTED: 0, WON: 0, LOST: 0 };
    inquiries.forEach((i) => {
      if (c[i.status] !== undefined) c[i.status]++;
    });
    return c;
  }, [inquiries]);

  const visible = useMemo(() => {
    return inquiries.filter((inq) => {
      const matchesFilter = filter === "ALL" || inq.status === filter;
      if (!matchesFilter) return false;
      if (!search.trim()) return true;
      const q = search.toLowerCase();
      const fullName = `${inq.firstName} ${inq.lastName}`.toLowerCase();
      return (
        fullName.includes(q) ||
        inq.email.toLowerCase().includes(q) ||
        (inq.phone && inq.phone.toLowerCase().includes(q)) ||
        (inq.sector && inq.sector.toLowerCase().includes(q)) ||
        inq.message.toLowerCase().includes(q)
      );
    });
  }, [inquiries, filter, search]);

  const userRole = (session?.user as any)?.role;

  const handleExportCsv = () => {
    const params = new URLSearchParams();
    if (filter !== "ALL") params.set("status", filter);
    if (search.trim()) params.set("search", search.trim());
    window.location.href = `/api/inquiries/export?${params.toString()}`;
  };

  if (status === "loading" || loading) {
    return <div style={s.centered}>Loading inquiries…</div>;
  }

  return (
    <div style={s.page}>
      <header style={s.header}>
        <div>
          <div style={s.eyebrow}>SINA / Staff CRM</div>
          <h1 style={s.h1}>Inquiries &amp; Leads</h1>
        </div>
        <nav style={s.nav}>
          {userRole === "ADMIN" && (
            <Link href="/staff/admin" style={s.navLinkAdmin}>
              <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><path d="m9 12 2 2 4-4" /></svg>
                <span>Manage Staff</span>
              </span>
            </Link>
          )}
          <Link href="/staff/sectors" style={s.navLink}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
              <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2" /><polyline points="2 17 12 22 22 17" /><polyline points="2 12 12 17 22 12" /></svg>
              <span>Service Sectors</span>
            </span>
          </Link>
          <Link href="/staff/mfa" style={s.navLink}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
              <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
              <span>2FA Security</span>
            </span>
          </Link>
          <Link href="/staff/content" style={s.navLink}>
            Edit Site Content
          </Link>
          <div style={s.userInfo}>
            <span style={s.userEmail}>{session?.user?.email}</span>
            <span style={s.roleTag}>{userRole || "EDITOR"}</span>
          </div>
          <button style={s.signOut} onClick={() => signOut({ callbackUrl: "/staff/login" })}>
            Sign Out
          </button>
        </nav>
      </header>

      <div style={s.statsRow}>
        <div style={s.statBox}>
          <span style={s.statVal}>{counts.ALL}</span>
          <span style={s.statLabel}>Total Inquiries</span>
        </div>
        <div style={s.statBox}>
          <span style={{ ...s.statVal, color: STATUS_COLORS.NEW }}>{counts.NEW}</span>
          <span style={s.statLabel}>New Leads</span>
        </div>
        <div style={s.statBox}>
          <span style={{ ...s.statVal, color: STATUS_COLORS.CONTACTED }}>{counts.CONTACTED}</span>
          <span style={s.statLabel}>Contacted</span>
        </div>
        <div style={s.statBox}>
          <span style={{ ...s.statVal, color: STATUS_COLORS.QUOTED }}>{counts.QUOTED}</span>
          <span style={s.statLabel}>Quoted</span>
        </div>
        <div style={s.statBox}>
          <span style={{ ...s.statVal, color: STATUS_COLORS.WON }}>{counts.WON}</span>
          <span style={s.statLabel}>Won</span>
        </div>
        <div style={s.statBox}>
          <span style={{ ...s.statVal, color: STATUS_COLORS.LOST }}>{counts.LOST}</span>
          <span style={s.statLabel}>Lost</span>
        </div>
      </div>

      <div style={s.controlBar}>
        <div style={s.filters}>
          {["ALL", "NEW", "CONTACTED", "QUOTED", "WON", "LOST"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{ ...s.filterBtn, ...(filter === f ? s.filterBtnActive : {}) }}
            >
              {f} ({counts[f] ?? 0})
            </button>
          ))}
        </div>
        <div style={s.rightControls}>
          <div style={s.searchWrap}>
            <input
              style={s.searchInput}
              type="text"
              placeholder="Search leads by name, email, sector..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <button style={s.clearBtn} onClick={() => setSearch("")}>
                ✕
              </button>
            )}
          </div>
          <button style={s.exportBtn} onClick={handleExportCsv} title="Download CSV spreadsheet of leads">
            <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
              <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
              <span>Export CSV</span>
            </span>
          </button>
        </div>
      </div>

      <div style={s.list}>
        {visible.length === 0 && (
          <div style={s.empty}>
            {search ? `No inquiries match "${search}".` : "No inquiries in this category."}
          </div>
        )}
        {visible.map((inq) => {
          const isHistExpanded = !!expandedHistories[inq.id];
          const history = inq.statusHistory || [];
          return (
            <div key={inq.id} style={s.card}>
              <div style={s.cardTop}>
                <div>
                  <strong style={s.name}>{inq.firstName} {inq.lastName}</strong>
                  <span style={s.sector}>{inq.sector || "General inquiry / Unspecified"}</span>
                </div>
                <div style={s.badgeWrap}>
                  <span style={{ ...s.badge, background: STATUS_COLORS[inq.status] }}>
                    {inq.status}
                  </span>
                </div>
              </div>

              <div style={s.contactRow}>
                <a href={`mailto:${inq.email}`} style={s.link}>✉ {inq.email}</a>
                {inq.phone && <a href={`tel:${inq.phone}`} style={s.link}>☎ {inq.phone}</a>}
                <span style={s.date}>Received {new Date(inq.createdAt).toLocaleString()}</span>
              </div>

              <div style={s.messageBox}>
                <p style={s.message}>{inq.message}</p>
              </div>

              {history.length > 0 && (
                <div style={s.timelineSection}>
                  <button
                    style={s.toggleTimelineBtn}
                    onClick={() => toggleHistory(inq.id)}
                  >
                    {isHistExpanded ? "▼ Hide Status History" : `▶ View Status History (${history.length} update${history.length > 1 ? "s" : ""})`}
                  </button>
                  {isHistExpanded && (
                    <div style={s.timeline}>
                      {history.map((h) => (
                        <div key={h.id} style={s.timelineItem}>
                          <span style={s.timelineDot}>•</span>
                          <span style={s.timelineText}>
                            Moved from <strong>{h.fromStatus || "INITIAL"}</strong> to{" "}
                            <strong>{h.toStatus}</strong> by <em>{h.changedBy?.email || "Staff"}</em>
                          </span>
                          <span style={s.timelineDate}>
                            {new Date(h.createdAt).toLocaleString()}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              <div style={s.cardBottom}>
                <div style={s.actions}>
                  <span style={s.actionLabel}>Change Status:</span>
                  {(["NEW", "CONTACTED", "QUOTED", "WON", "LOST"] as const).map((st) => (
                    <button
                      key={st}
                      onClick={() => updateStatus(inq.id, st)}
                      disabled={inq.status === st}
                      style={{
                        ...s.statusBtn,
                        ...(inq.status === st ? s.statusBtnActive : {}),
                      }}
                    >
                      {st}
                    </button>
                  ))}
                </div>
                <button
                  style={s.deleteBtn}
                  onClick={() => deleteInquiry(inq.id, `${inq.firstName} ${inq.lastName}`)}
                  title="Delete inquiry"
                >
                  <span style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
                    <svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>
                    <span>Delete</span>
                  </span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

const s: Record<string, React.CSSProperties> = {
  page: { minHeight: "100vh", background: "#F7F5F1", fontFamily: "system-ui, -apple-system, sans-serif", padding: "32px", maxWidth: "1200px", margin: "0 auto" },
  centered: { display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", color: "#5B5B58", fontSize: "16px" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px", flexWrap: "wrap", gap: "16px" },
  eyebrow: { color: "#E8940C", fontSize: "12px", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase" },
  h1: { fontSize: "28px", margin: "4px 0 0 0", color: "#111112" },
  nav: { display: "flex", alignItems: "center", gap: "14px", flexWrap: "wrap" },
  navLink: { color: "#111112", fontSize: "13px", fontWeight: 500, textDecoration: "none", padding: "6px 12px", background: "#EAE7DF", borderRadius: "4px" },
  navLinkAdmin: { color: "#111112", fontSize: "13px", fontWeight: 600, textDecoration: "none", padding: "6px 12px", background: "#FFCB47", borderRadius: "4px" },
  userInfo: { display: "flex", alignItems: "center", gap: "6px" },
  userEmail: { color: "#5B5B58", fontSize: "13px" },
  roleTag: { background: "#111112", color: "#FFCB47", fontSize: "10px", fontWeight: 700, padding: "2px 6px", borderRadius: "3px" },
  signOut: { background: "#111112", color: "#F7F5F1", border: "none", padding: "8px 14px", borderRadius: "4px", cursor: "pointer", fontSize: "12px", fontWeight: 500 },
  
  statsRow: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "12px", marginBottom: "24px" },
  statBox: { background: "#FFFFFF", border: "1px solid rgba(17,17,18,0.08)", borderRadius: "6px", padding: "14px 16px", textAlign: "center" },
  statVal: { display: "block", fontSize: "22px", fontWeight: 700, color: "#111112", marginBottom: "4px" },
  statLabel: { fontSize: "11px", color: "#7B7B78", textTransform: "uppercase", letterSpacing: "0.04em" },

  controlBar: { display: "flex", justifyContent: "space-between", alignItems: "center", gap: "16px", marginBottom: "20px", flexWrap: "wrap" },
  filters: { display: "flex", gap: "6px", flexWrap: "wrap" },
  filterBtn: { padding: "7px 13px", borderRadius: "999px", border: "1px solid rgba(17,17,18,0.15)", background: "#FFFFFF", cursor: "pointer", fontSize: "12px", color: "#5B5B58", fontWeight: 500 },
  filterBtnActive: { background: "#111112", color: "#F7F5F1", borderColor: "#111112" },
  rightControls: { display: "flex", gap: "10px", alignItems: "center", flex: "1", justifyContent: "flex-end", flexWrap: "wrap" },
  searchWrap: { position: "relative", minWidth: "240px", flex: "1", maxWidth: "340px" },
  searchInput: { width: "100%", padding: "8px 12px", borderRadius: "6px", border: "1px solid rgba(17,17,18,0.15)", fontSize: "13px", background: "#FFFFFF", boxSizing: "border-box" },
  clearBtn: { position: "absolute", right: "8px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#9C9A94", fontSize: "14px" },
  exportBtn: { background: "#FFFFFF", border: "1px solid rgba(17,17,18,0.18)", color: "#111112", padding: "8px 14px", borderRadius: "6px", fontSize: "12px", fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap" },

  list: { display: "flex", flexDirection: "column", gap: "14px" },
  empty: { color: "#5B5B58", padding: "48px", textAlign: "center", background: "#FFFFFF", borderRadius: "6px", border: "1px dashed rgba(17,17,18,0.15)" },
  card: { background: "#FFFFFF", border: "1px solid rgba(17,17,18,0.1)", borderRadius: "8px", padding: "20px", boxShadow: "0 1px 3px rgba(0,0,0,0.02)" },
  cardTop: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "10px" },
  name: { fontSize: "17px", color: "#111112" },
  sector: { display: "block", fontSize: "12px", color: "#7B7B78", marginTop: "3px", fontWeight: 500 },
  badgeWrap: { display: "flex", gap: "6px", alignItems: "center" },
  badge: { fontSize: "11px", padding: "4px 10px", borderRadius: "999px", color: "#FFFFFF", fontWeight: 700, letterSpacing: "0.04em", textTransform: "uppercase" },
  contactRow: { display: "flex", gap: "16px", fontSize: "13px", marginBottom: "12px", flexWrap: "wrap", alignItems: "center" },
  link: { color: "#B96E00", textDecoration: "none", fontWeight: 500 },
  date: { color: "#9C9A94", fontSize: "12px", marginLeft: "auto" },
  messageBox: { background: "#FAF9F6", padding: "12px 14px", borderRadius: "6px", border: "1px solid rgba(17,17,18,0.05)", marginBottom: "14px" },
  message: { fontSize: "14px", color: "#111112", lineHeight: 1.5, margin: 0, whiteSpace: "pre-wrap" },
  
  timelineSection: { marginBottom: "14px", paddingTop: "8px", borderTop: "1px solid rgba(17,17,18,0.06)" },
  toggleTimelineBtn: { background: "none", border: "none", color: "#5B5B58", fontSize: "12px", cursor: "pointer", padding: "4px 0", fontWeight: 600 },
  timeline: { marginTop: "8px", display: "flex", flexDirection: "column", gap: "6px", background: "#F4F2EC", padding: "10px 12px", borderRadius: "6px" },
  timelineItem: { fontSize: "12px", color: "#333", display: "flex", alignItems: "center", gap: "8px" },
  timelineDot: { color: "#E8940C", fontSize: "16px" },
  timelineText: { flex: 1 },
  timelineDate: { fontSize: "11px", color: "#888" },

  cardBottom: { display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px", paddingTop: "10px", borderTop: "1px solid rgba(17,17,18,0.06)" },
  actions: { display: "flex", gap: "6px", alignItems: "center", flexWrap: "wrap" },
  actionLabel: { fontSize: "12px", color: "#7B7B78", marginRight: "4px" },
  statusBtn: { fontSize: "11px", padding: "6px 11px", borderRadius: "4px", border: "1px solid rgba(17,17,18,0.15)", background: "#FFFFFF", cursor: "pointer", fontWeight: 500 },
  statusBtnActive: { background: "#111112", color: "#F7F5F1", borderColor: "#111112", fontWeight: 700 },
  deleteBtn: { background: "none", border: "1px solid rgba(229,118,107,0.3)", color: "#C93B2B", padding: "5px 10px", borderRadius: "4px", fontSize: "11px", cursor: "pointer" },
};
