"use client";

import { useEffect, useState, useMemo } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type ContentBlock = {
  id: string;
  key: string;
  page: string;
  label: string;
  type: "TEXT" | "RICH_TEXT" | "IMAGE_URL";
  value: string;
};

export default function ContentEditor() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [blocks, setBlocks] = useState<ContentBlock[]>([]);
  const [page, setPage] = useState("home");
  const [search, setSearch] = useState("");
  const [saving, setSaving] = useState<string | null>(null);
  const [savedKey, setSavedKey] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const [showAddModal, setShowAddModal] = useState(false);
  const [newKey, setNewKey] = useState("");
  const [newPage, setNewPage] = useState("home");
  const [newLabel, setNewLabel] = useState("");
  const [newType, setNewType] = useState<"TEXT" | "RICH_TEXT" | "IMAGE_URL">("TEXT");
  const [newValue, setNewValue] = useState("");
  const [creating, setCreating] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") router.push("/staff/login");
  }, [status, router]);

  const fetchBlocks = () => {
    const url = page === "all" ? "/api/content" : `/api/content?page=${page}`;
    fetch(url)
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setBlocks(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    setLoading(true);
    fetchBlocks();
  }, [page]);

  function updateLocal(key: string, value: string) {
    setBlocks((prev) => prev.map((b) => (b.key === key ? { ...b, value } : b)));
  }

  async function save(key: string, value: string) {
    setSaving(key);
    const res = await fetch("/api/content", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key, value }),
    });
    setSaving(null);
    if (res.ok) {
      setSavedKey(key);
      setTimeout(() => setSavedKey(null), 2000);
    }
  }

  async function deleteBlock(key: string, label: string) {
    if (!confirm(`Are you sure you want to delete the content block "${label}" (${key})?`)) return;
    const res = await fetch(`/api/content?key=${encodeURIComponent(key)}`, {
      method: "DELETE",
    });
    if (res.ok) {
      setBlocks((prev) => prev.filter((b) => b.key !== key));
    }
  }

  async function handleAddBlock(e: React.FormEvent) {
    e.preventDefault();
    setCreating(true);
    setErrorMsg("");

    try {
      const res = await fetch("/api/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          key: newKey.trim(),
          page: newPage.toLowerCase(),
          label: newLabel.trim(),
          type: newType,
          value: newValue,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create content block");

      setShowAddModal(false);
      setNewKey("");
      setNewLabel("");
      setNewValue("");
      fetchBlocks();
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setCreating(false);
    }
  }

  const filteredBlocks = useMemo(() => {
    if (!search.trim()) return blocks;
    const q = search.toLowerCase();
    return blocks.filter(
      (b) =>
        b.key.toLowerCase().includes(q) ||
        b.label.toLowerCase().includes(q) ||
        b.value.toLowerCase().includes(q)
    );
  }, [blocks, search]);

  const userRole = (session?.user as any)?.role;

  return (
    <div style={s.page}>
      <header style={s.header}>
        <div>
          <div style={s.eyebrow}>SINA / Staff CMS</div>
          <h1 style={s.h1}>Website Content Manager</h1>
        </div>
        <nav style={s.nav}>
          <Link href="/staff" style={s.navLink}>← Back to Inquiries</Link>
          <Link href="/staff/sectors" style={s.navLink}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
              <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2" /><polyline points="2 17 12 22 22 17" /><polyline points="2 12 17 22 12" /></svg>
              <span>Service Sectors</span>
            </span>
          </Link>
          <Link href="/staff/mfa" style={s.navLink}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
              <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
              <span>2FA Security</span>
            </span>
          </Link>
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

      <div style={s.controlBar}>
        <div style={s.tabs}>
          {["home", "about", "services", "contact", "all"].map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              style={{ ...s.tab, ...(page === p ? s.tabActive : {}) }}
            >
              {p === "all" ? "All Pages" : p}
            </button>
          ))}
        </div>

        <div style={s.rightControls}>
          <div style={s.searchWrap}>
            <input
              style={s.searchInput}
              type="text"
              placeholder="Search content keys, labels, text..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <button style={s.clearBtn} onClick={() => setSearch("")}>✕</button>
            )}
          </div>
          <button style={s.addBlockBtn} onClick={() => setShowAddModal(true)}>
            + Add Content Block
          </button>
        </div>
      </div>

      {loading ? (
        <div style={s.empty}>Loading content blocks…</div>
      ) : (
        <div style={s.list}>
          {filteredBlocks.length === 0 && (
            <div style={s.empty}>
              {search
                ? `No content blocks match "${search}".`
                : `No content blocks found for page "${page}". Click "+ Add Content Block" to add one.`}
            </div>
          )}
          {filteredBlocks.map((b) => (
            <div key={b.key} style={s.card}>
              <div style={s.cardHead}>
                <div style={s.headLeft}>
                  <label style={s.label}>{b.label}</label>
                  <span style={s.keyTag}>{b.key}</span>
                  <span style={s.pageBadge}>{b.page}</span>
                  <span style={s.typeBadge}>{b.type}</span>
                </div>
                <button
                  style={s.delBlockBtn}
                  onClick={() => deleteBlock(b.key, b.label)}
                  title="Delete content block"
                >
                  ✕
                </button>
              </div>

              {b.type === "RICH_TEXT" ? (
                <textarea
                  style={s.textarea}
                  value={b.value}
                  placeholder="Enter text content..."
                  onChange={(e) => updateLocal(b.key, e.target.value)}
                />
              ) : b.type === "IMAGE_URL" ? (
                <div style={s.imageBlockWrap}>
                  <input
                    style={s.input}
                    value={b.value}
                    placeholder="/assets/image.png or https://..."
                    onChange={(e) => updateLocal(b.key, e.target.value)}
                  />
                  {b.value && (
                    <div style={s.imagePreview}>
                      <img
                        src={b.value}
                        alt="Preview"
                        style={s.previewThumb}
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = "none";
                        }}
                      />
                    </div>
                  )}
                </div>
              ) : (
                <input
                  style={s.input}
                  value={b.value}
                  placeholder="Enter text..."
                  onChange={(e) => updateLocal(b.key, e.target.value)}
                />
              )}

              <div style={s.saveRow}>
                <span style={s.charCount}>{b.value.length} characters</span>
                <button
                  style={{
                    ...s.saveBtn,
                    ...(savedKey === b.key ? s.saveBtnSaved : {}),
                  }}
                  onClick={() => save(b.key, b.value)}
                  disabled={saving === b.key}
                >
                  {saving === b.key ? "Saving…" : savedKey === b.key ? "✓ Saved to Database" : "Save Changes"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showAddModal && (
        <div style={s.modalOverlay}>
          <div style={s.modalContent}>
            <div style={s.modalHead}>
              <h3 style={s.modalTitle}>Add New Content Block</h3>
              <button style={s.closeBtn} onClick={() => setShowAddModal(false)}>✕</button>
            </div>
            {errorMsg && <div style={s.errorBanner}>{errorMsg}</div>}
            <form onSubmit={handleAddBlock} style={s.modalForm}>
              <label style={s.modalLabel}>Key (dot notation, e.g. home.hero.cta)</label>
              <input
                style={s.modalInput}
                type="text"
                required
                placeholder="home.features.title"
                value={newKey}
                onChange={(e) => setNewKey(e.target.value)}
              />

              <label style={s.modalLabel}>Page Section</label>
              <select
                style={s.modalSelect}
                value={newPage}
                onChange={(e) => setNewPage(e.target.value)}
              >
                <option value="home">home</option>
                <option value="about">about</option>
                <option value="services">services</option>
                <option value="contact">contact</option>
              </select>

              <label style={s.modalLabel}>Human-Readable Label</label>
              <input
                style={s.modalInput}
                type="text"
                required
                placeholder="e.g. Hero Section CTA Button Text"
                value={newLabel}
                onChange={(e) => setNewLabel(e.target.value)}
              />

              <label style={s.modalLabel}>Field Type</label>
              <select
                style={s.modalSelect}
                value={newType}
                onChange={(e) => setNewType(e.target.value as any)}
              >
                <option value="TEXT">TEXT (Single line heading or short phrase)</option>
                <option value="RICH_TEXT">RICH_TEXT (Multi-line paragraph)</option>
                <option value="IMAGE_URL">IMAGE_URL (Asset path or URL)</option>
              </select>

              <label style={s.modalLabel}>Initial Value</label>
              <textarea
                style={s.modalTextarea}
                placeholder="Initial text content..."
                value={newValue}
                onChange={(e) => setNewValue(e.target.value)}
              />

              <div style={s.modalActions}>
                <button
                  type="button"
                  style={s.cancelBtn}
                  onClick={() => setShowAddModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" style={s.primaryBtn} disabled={creating}>
                  {creating ? "Creating…" : "Add Block"}
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
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px", flexWrap: "wrap", gap: "16px" },
  eyebrow: { color: "#E8940C", fontSize: "12px", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase" },
  h1: { fontSize: "28px", margin: "4px 0 0 0", color: "#111112" },
  nav: { display: "flex", alignItems: "center", gap: "12px" },
  navLink: { color: "#111112", fontSize: "13px", fontWeight: 500, textDecoration: "none", padding: "6px 12px", background: "#EAE7DF", borderRadius: "4px" },
  navLinkAdmin: { color: "#111112", fontSize: "13px", fontWeight: 600, textDecoration: "none", padding: "6px 12px", background: "#FFCB47", borderRadius: "4px" },

  controlBar: { display: "flex", justifyContent: "space-between", alignItems: "center", gap: "16px", marginBottom: "24px", flexWrap: "wrap" },
  tabs: { display: "flex", gap: "6px", textTransform: "capitalize", flexWrap: "wrap" },
  tab: { padding: "8px 16px", borderRadius: "999px", border: "1px solid rgba(17,17,18,0.15)", background: "#FFFFFF", cursor: "pointer", fontSize: "13px", color: "#5B5B58", fontWeight: 500 },
  tabActive: { background: "#111112", color: "#F7F5F1", borderColor: "#111112" },

  rightControls: { display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap" },
  searchWrap: { position: "relative", minWidth: "260px" },
  searchInput: { width: "100%", padding: "8px 12px", borderRadius: "6px", border: "1px solid rgba(17,17,18,0.15)", fontSize: "13px", background: "#FFFFFF" },
  clearBtn: { position: "absolute", right: "8px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#9C9A94", fontSize: "14px" },
  addBlockBtn: { background: "#111112", color: "#F7F5F1", border: "none", padding: "8px 16px", borderRadius: "6px", cursor: "pointer", fontSize: "13px", fontWeight: 600 },

  list: { display: "flex", flexDirection: "column", gap: "16px" },
  empty: { color: "#5B5B58", padding: "48px", textAlign: "center", background: "#FFFFFF", borderRadius: "8px", border: "1px dashed rgba(17,17,18,0.15)" },
  card: { background: "#FFFFFF", border: "1px solid rgba(17,17,18,0.1)", borderRadius: "8px", padding: "20px", boxShadow: "0 1px 3px rgba(0,0,0,0.02)" },
  cardHead: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "10px" },
  headLeft: { display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" },
  label: { fontSize: "14px", fontWeight: 600, color: "#111112" },
  keyTag: { fontSize: "11px", color: "#7B7B78", fontFamily: "monospace", background: "#FAF9F6", padding: "2px 6px", borderRadius: "3px", border: "1px solid rgba(17,17,18,0.08)" },
  pageBadge: { fontSize: "10px", color: "#B96E00", background: "#FDF5E6", padding: "2px 6px", borderRadius: "3px", fontWeight: 600, textTransform: "uppercase" },
  typeBadge: { fontSize: "10px", color: "#5B5B58", background: "#EEEEEE", padding: "2px 6px", borderRadius: "3px", fontWeight: 600 },
  delBlockBtn: { background: "none", border: "none", color: "#C93B2B", cursor: "pointer", fontSize: "14px", padding: "2px 6px" },

  input: { width: "100%", padding: "10px 12px", border: "1px solid rgba(17,17,18,0.15)", borderRadius: "4px", fontSize: "14px", background: "#FFFFFF", boxSizing: "border-box" },
  textarea: { width: "100%", minHeight: "100px", padding: "10px 12px", border: "1px solid rgba(17,17,18,0.15)", borderRadius: "4px", fontSize: "14px", fontFamily: "inherit", background: "#FFFFFF", boxSizing: "border-box", lineHeight: 1.5 },
  imageBlockWrap: { display: "flex", flexDirection: "column", gap: "8px" },
  imagePreview: { background: "#FAF9F6", padding: "8px", borderRadius: "4px", border: "1px solid rgba(17,17,18,0.08)", display: "inline-block" },
  previewThumb: { maxHeight: "80px", objectFit: "contain", borderRadius: "4px" },

  saveRow: { display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "12px" },
  charCount: { fontSize: "11px", color: "#9C9A94" },
  saveBtn: { background: "#111112", color: "#F7F5F1", border: "none", padding: "8px 18px", borderRadius: "4px", cursor: "pointer", fontSize: "12px", fontWeight: 600, transition: "background 0.2s" },
  saveBtnSaved: { background: "#3E7A4E" },

  modalOverlay: { position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 },
  modalContent: { background: "#FFFFFF", borderRadius: "8px", padding: "24px", width: "460px", maxWidth: "90%", boxShadow: "0 10px 25px rgba(0,0,0,0.2)" },
  modalHead: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" },
  modalTitle: { margin: 0, fontSize: "18px", color: "#111112" },
  closeBtn: { background: "none", border: "none", fontSize: "16px", cursor: "pointer", color: "#7B7B78" },
  modalForm: { display: "flex", flexDirection: "column", gap: "10px" },
  modalLabel: { fontSize: "11px", fontWeight: 600, color: "#5B5B58", textTransform: "uppercase", letterSpacing: "0.04em" },
  modalInput: { padding: "8px 12px", borderRadius: "4px", border: "1px solid rgba(17,17,18,0.15)", fontSize: "13px" },
  modalSelect: { padding: "8px 12px", borderRadius: "4px", border: "1px solid rgba(17,17,18,0.15)", fontSize: "13px", background: "#FFFFFF" },
  modalTextarea: { padding: "8px 12px", borderRadius: "4px", border: "1px solid rgba(17,17,18,0.15)", fontSize: "13px", minHeight: "80px", fontFamily: "inherit" },
  modalActions: { display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "12px" },
  primaryBtn: { background: "#111112", color: "#F7F5F1", border: "none", padding: "8px 16px", borderRadius: "4px", cursor: "pointer", fontSize: "13px", fontWeight: 600 },
  cancelBtn: { background: "transparent", color: "#5B5B58", border: "1px solid rgba(17,17,18,0.2)", padding: "8px 16px", borderRadius: "4px", cursor: "pointer", fontSize: "13px" },
  errorBanner: { background: "#FDE8E8", color: "#9B1C1C", padding: "8px 12px", borderRadius: "4px", fontSize: "12px" },
};
