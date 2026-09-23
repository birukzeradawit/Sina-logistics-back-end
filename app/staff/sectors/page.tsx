"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type Sector = {
  id: string;
  code: string;
  slug: string;
  name: string;
  shortDesc: string;
  fullDesc: string | null;
  features: string[];
  sortOrder: number;
  isActive: boolean;
};

export default function StaffSectorsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [sectors, setSectors] = useState<Sector[]>([]);
  const [loading, setLoading] = useState(true);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState("");
  const [formCode, setFormCode] = useState("");
  const [formSlug, setFormSlug] = useState("");
  const [formName, setFormName] = useState("");
  const [formShortDesc, setFormShortDesc] = useState("");
  const [formFullDesc, setFormFullDesc] = useState("");
  const [formFeaturesText, setFormFeaturesText] = useState("");
  const [formSortOrder, setFormSortOrder] = useState(0);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/staff/login");
  }, [status, router]);

  const loadSectors = () => {
    setLoading(true);
    fetch("/api/sectors?all=true")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setSectors(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    if (status === "authenticated") {
      loadSectors();
    }
  }, [status]);

  const showNotification = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(""), 3000);
  };

  const openCreateModal = () => {
    setIsEditing(false);
    setCurrentId("");
    setFormCode(`SV-0${sectors.length + 1}`);
    setFormSlug("");
    setFormName("");
    setFormShortDesc("");
    setFormFullDesc("");
    setFormFeaturesText("");
    setFormSortOrder(sectors.length + 1);
    setShowModal(true);
  };

  const openEditModal = (sector: Sector) => {
    setIsEditing(true);
    setCurrentId(sector.id);
    setFormCode(sector.code);
    setFormSlug(sector.slug);
    setFormName(sector.name);
    setFormShortDesc(sector.shortDesc);
    setFormFullDesc(sector.fullDesc || "");
    setFormFeaturesText(sector.features ? sector.features.join("\n") : "");
    setFormSortOrder(sector.sortOrder);
    setShowModal(true);
  };

  async function handleSaveSector(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setErrorMsg("");

    const features = formFeaturesText
      .split("\n")
      .map((f) => f.trim())
      .filter(Boolean);

    const payload = {
      code: formCode.trim(),
      slug: formSlug.trim().toLowerCase(),
      name: formName.trim(),
      shortDesc: formShortDesc.trim(),
      fullDesc: formFullDesc.trim() || undefined,
      features,
      sortOrder: Number(formSortOrder) || 0,
    };

    try {
      const url = isEditing ? `/api/sectors/${currentId}` : "/api/sectors";
      const method = isEditing ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save sector");

      setShowModal(false);
      showNotification(`Sector ${payload.code} ${isEditing ? "updated" : "created"} successfully.`);
      loadSectors();
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function toggleActive(sector: Sector) {
    const nextState = !sector.isActive;
    try {
      const res = await fetch(`/api/sectors/${sector.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: nextState }),
      });
      if (!res.ok) throw new Error("Update failed");
      showNotification(`Sector ${sector.code} is now ${nextState ? "Active" : "Inactive"}.`);
      loadSectors();
    } catch (err: any) {
      alert(err.message);
    }
  }

  async function handleDelete(sector: Sector) {
    if (!confirm(`Are you sure you want to delete sector ${sector.code} — ${sector.name}?`)) return;
    try {
      const res = await fetch(`/api/sectors/${sector.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete sector");
      showNotification(`Sector ${sector.code} deleted.`);
      loadSectors();
    } catch (err: any) {
      alert(err.message);
    }
  }

  const userRole = (session?.user as any)?.role;

  if (status === "loading" || loading) {
    return <div style={s.centered}>Loading service sectors catalog…</div>;
  }

  return (
    <div style={s.page}>
      <header style={s.header}>
        <div>
          <div style={s.eyebrow}>SINA / Database &amp; Services</div>
          <h1 style={s.h1}>Service Sectors Catalog</h1>
        </div>
        <nav style={s.nav}>
          <Link href="/staff" style={s.navLink}>← Back to Inquiries</Link>
          <Link href="/staff/content" style={s.navLink}>Site Copy &amp; Images</Link>
          {userRole === "ADMIN" && (
            <Link href="/staff/admin" style={s.navLinkAdmin}>
              <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><path d="m9 12 2 2 4-4" /></svg>
                <span>Manage Staff</span>
              </span>
            </Link>
          )}
        </nav>
      </header>

      {successMsg && <div style={s.successBanner}>{successMsg}</div>}
      {errorMsg && <div style={s.errorBanner}>{errorMsg}</div>}

      <div style={s.topBar}>
        <p style={s.subText}>
          Dynamic catalog of SINA service sectors stored in PostgreSQL. Updating these changes the live manifest board, services page, and contact quote selector.
        </p>
        <button style={s.primaryBtn} onClick={openCreateModal}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
            <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
            <span>Add New Sector</span>
          </span>
        </button>
      </div>

      <div style={s.grid}>
        {sectors.map((sItem) => (
          <div key={sItem.id} style={{ ...s.card, opacity: sItem.isActive ? 1 : 0.65 }}>
            <div style={s.cardHead}>
              <div style={s.codePill}>{sItem.code}</div>
              <span
                style={{
                  ...s.statusBadge,
                  background: sItem.isActive ? "#E7F6E9" : "#FDE8E8",
                  color: sItem.isActive ? "#236B35" : "#9B1C1C",
                }}
              >
                {sItem.isActive ? "ACTIVE" : "INACTIVE"}
              </span>
            </div>

            <h2 style={s.cardTitle}>{sItem.name}</h2>
            <div style={s.slugText}>Slug: /{sItem.slug} &bull; Order: #{sItem.sortOrder}</div>
            <p style={s.cardDesc}>{sItem.shortDesc}</p>

            <div style={s.featuresBox}>
              <div style={s.featuresLabel}>Capabilities ({sItem.features?.length || 0}):</div>
              <ul style={s.featuresList}>
                {sItem.features?.slice(0, 3).map((f, i) => (
                  <li key={i} style={s.featureItem}>{f}</li>
                ))}
                {(sItem.features?.length || 0) > 3 && (
                  <li style={s.featureMore}>+{(sItem.features?.length || 0) - 3} more capabilities…</li>
                )}
              </ul>
            </div>

            <div style={s.cardActions}>
              <button style={s.editBtn} onClick={() => openEditModal(sItem)}>
                <span style={{ display: "inline-flex", alignItems: "center", gap: "5px" }}>
                  <svg width={13} height={13} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                  <span>Edit Sector</span>
                </span>
              </button>
              <button
                style={{
                  ...s.toggleBtn,
                  color: sItem.isActive ? "#C93B2B" : "#236B35",
                }}
                onClick={() => toggleActive(sItem)}
              >
                {sItem.isActive ? "Deactivate" : "Activate"}
              </button>
              <button style={s.deleteBtn} onClick={() => handleDelete(sItem)} title="Delete Sector">
                <svg width={13} height={13} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>
              </button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div style={s.modalOverlay}>
          <div style={s.modalContent}>
            <div style={s.modalHead}>
              <h3 style={s.modalTitle}>{isEditing ? `Edit Sector ${formCode}` : "Create Service Sector"}</h3>
              <button style={s.closeBtn} onClick={() => setShowModal(false)}>✕</button>
            </div>

            <form onSubmit={handleSaveSector} style={s.modalForm}>
              <div style={s.formRow}>
                <div style={{ flex: 1 }}>
                  <label style={s.modalLabel}>Code (e.g. SV-01)</label>
                  <input
                    style={s.modalInput}
                    required
                    value={formCode}
                    onChange={(e) => setFormCode(e.target.value)}
                    placeholder="SV-01"
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={s.modalLabel}>URL Anchor Slug</label>
                  <input
                    style={s.modalInput}
                    required
                    value={formSlug}
                    onChange={(e) => setFormSlug(e.target.value)}
                    placeholder="procurement"
                  />
                </div>
                <div style={{ width: "80px" }}>
                  <label style={s.modalLabel}>Sort Order</label>
                  <input
                    style={s.modalInput}
                    type="number"
                    value={formSortOrder}
                    onChange={(e) => setFormSortOrder(Number(e.target.value))}
                  />
                </div>
              </div>

              <div>
                <label style={s.modalLabel}>Sector Name</label>
                <input
                  style={s.modalInput}
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="Procurement & Supply"
                />
              </div>

              <div>
                <label style={s.modalLabel}>Short Summary (Home Page Card)</label>
                <input
                  style={s.modalInput}
                  required
                  value={formShortDesc}
                  onChange={(e) => setFormShortDesc(e.target.value)}
                  placeholder="Brief overview of what this sector delivers..."
                />
              </div>

              <div>
                <label style={s.modalLabel}>Detailed Description (Services Page)</label>
                <textarea
                  style={s.modalTextarea}
                  rows={3}
                  value={formFullDesc}
                  onChange={(e) => setFormFullDesc(e.target.value)}
                  placeholder="Comprehensive description of why clients choose SINA for this sector..."
                />
              </div>

              <div>
                <label style={s.modalLabel}>Capabilities &amp; Scope Checklist (one item per line)</label>
                <textarea
                  style={s.modalTextarea}
                  rows={4}
                  value={formFeaturesText}
                  onChange={(e) => setFormFeaturesText(e.target.value)}
                  placeholder="Office consumables and supplies&#10;Hospitality and refreshment supplies&#10;Supplier sourcing..."
                />
              </div>

              <div style={s.modalActions}>
                <button type="button" style={s.cancelBtn} onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" style={s.primaryBtn} disabled={saving}>
                  {saving ? "Saving…" : isEditing ? "Update Sector" : "Create Sector"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

const s: Record<string, React.CSSProperties> = {
  page: { minHeight: "100vh", background: "#F7F5F1", fontFamily: "system-ui, -apple-system, sans-serif", padding: "32px", maxWidth: "1200px", margin: "0 auto" },
  centered: { display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", color: "#5B5B58", fontSize: "16px" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", flexWrap: "wrap", gap: "16px" },
  eyebrow: { color: "#E8940C", fontSize: "12px", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase" },
  h1: { fontSize: "28px", margin: "4px 0 0 0", color: "#111112" },
  nav: { display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" },
  navLink: { color: "#111112", fontSize: "13px", fontWeight: 500, textDecoration: "none", padding: "6px 12px", background: "#EAE7DF", borderRadius: "4px" },
  navLinkAdmin: { color: "#111112", fontSize: "13px", fontWeight: 600, textDecoration: "none", padding: "6px 12px", background: "#FFCB47", borderRadius: "4px" },

  topBar: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px", flexWrap: "wrap", gap: "12px" },
  subText: { color: "#7B7B78", fontSize: "13px", maxWidth: "700px", margin: 0 },
  primaryBtn: { background: "#111112", color: "#FFCB47", border: "none", padding: "9px 18px", borderRadius: "4px", cursor: "pointer", fontSize: "13px", fontWeight: 700 },

  successBanner: { background: "#E7F6E9", border: "1px solid #B8E4C1", color: "#236B35", padding: "10px 16px", borderRadius: "6px", marginBottom: "16px", fontSize: "13px", fontWeight: 500 },
  errorBanner: { background: "#FDE8E8", border: "1px solid #F8B4B4", color: "#9B1C1C", padding: "10px 16px", borderRadius: "6px", marginBottom: "16px", fontSize: "13px" },

  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: "20px" },
  card: { background: "#FFFFFF", border: "1px solid rgba(17,17,18,0.08)", borderRadius: "8px", padding: "22px", display: "flex", flexDirection: "column", boxShadow: "0 1px 3px rgba(0,0,0,0.02)" },
  cardHead: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" },
  codePill: { background: "#111112", color: "#FFCB47", fontSize: "11px", fontWeight: 700, padding: "3px 8px", borderRadius: "4px", letterSpacing: "0.04em" },
  statusBadge: { padding: "3px 8px", borderRadius: "999px", fontSize: "10px", fontWeight: 700, letterSpacing: "0.04em" },
  cardTitle: { fontSize: "17px", color: "#111112", margin: "0 0 4px 0" },
  slugText: { fontSize: "11px", color: "#9C9A94", fontFamily: "monospace", marginBottom: "10px" },
  cardDesc: { fontSize: "13px", color: "#5B5B58", lineHeight: 1.5, margin: "0 0 14px 0", flex: 1 },

  featuresBox: { background: "#FAF9F6", borderRadius: "6px", padding: "10px 12px", border: "1px solid rgba(17,17,18,0.05)", marginBottom: "16px" },
  featuresLabel: { fontSize: "11px", fontWeight: 600, color: "#7B7B78", textTransform: "uppercase", marginBottom: "6px" },
  featuresList: { margin: 0, paddingLeft: "16px", fontSize: "12px", color: "#333", lineHeight: 1.5 },
  featureItem: { marginBottom: "2px" },
  featureMore: { color: "#888", fontStyle: "italic", marginTop: "4px" },

  cardActions: { display: "flex", gap: "8px", borderTop: "1px solid rgba(17,17,18,0.06)", paddingTop: "12px" },
  editBtn: { background: "#FFFFFF", border: "1px solid rgba(17,17,18,0.18)", color: "#111112", padding: "6px 12px", borderRadius: "4px", fontSize: "12px", fontWeight: 600, cursor: "pointer", flex: 1 },
  toggleBtn: { background: "#FFFFFF", border: "1px solid rgba(17,17,18,0.18)", padding: "6px 10px", borderRadius: "4px", fontSize: "12px", fontWeight: 500, cursor: "pointer" },
  deleteBtn: { background: "#FFFFFF", border: "1px solid rgba(229,118,107,0.3)", color: "#C93B2B", padding: "6px 10px", borderRadius: "4px", fontSize: "12px", cursor: "pointer" },

  modalOverlay: { position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: "20px" },
  modalContent: { background: "#FFFFFF", borderRadius: "8px", padding: "26px", width: "560px", maxWidth: "100%", maxHeight: "90vh", overflowY: "auto", boxShadow: "0 10px 25px rgba(0,0,0,0.2)" },
  modalHead: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "18px" },
  modalTitle: { margin: 0, fontSize: "18px", color: "#111112" },
  closeBtn: { background: "none", border: "none", fontSize: "16px", cursor: "pointer", color: "#7B7B78" },
  modalForm: { display: "flex", flexDirection: "column", gap: "14px" },
  formRow: { display: "flex", gap: "10px" },
  modalLabel: { display: "block", fontSize: "11px", fontWeight: 600, color: "#5B5B58", textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: "4px" },
  modalInput: { width: "100%", padding: "9px 12px", borderRadius: "4px", border: "1px solid rgba(17,17,18,0.18)", fontSize: "13px", boxSizing: "border-box" },
  modalTextarea: { width: "100%", padding: "9px 12px", borderRadius: "4px", border: "1px solid rgba(17,17,18,0.18)", fontSize: "13px", boxSizing: "border-box", fontFamily: "inherit" },
  modalActions: { display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "10px" },
  cancelBtn: { background: "transparent", color: "#5B5B58", border: "1px solid rgba(17,17,18,0.2)", padding: "8px 16px", borderRadius: "4px", cursor: "pointer", fontSize: "13px" },
};
