"use client";

import { useEffect, useState } from "react";
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
  const { status } = useSession();
  const router = useRouter();
  const [blocks, setBlocks] = useState<ContentBlock[]>([]);
  const [page, setPage] = useState("home");
  const [saving, setSaving] = useState<string | null>(null);
  const [savedKey, setSavedKey] = useState<string | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/staff/login");
  }, [status, router]);

  useEffect(() => {
    fetch(`/api/content?page=${page}`)
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setBlocks(data);
      });
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
      setTimeout(() => setSavedKey(null), 1500);
    }
  }

  return (
    <div style={s.page}>
      <header style={s.header}>
        <div>
          <div style={s.eyebrow}>SINA / Staff</div>
          <h1 style={s.h1}>Edit Content</h1>
        </div>
        <Link href="/staff" style={s.navLink}>← Back to Inquiries</Link>
      </header>

      <div style={s.tabs}>
        {["home", "about", "services", "contact"].map((p) => (
          <button
            key={p}
            onClick={() => setPage(p)}
            style={{ ...s.tab, ...(page === p ? s.tabActive : {}) }}
          >
            {p}
          </button>
        ))}
      </div>

      <div style={s.list}>
        {blocks.length === 0 && (
          <div style={s.empty}>
            No content blocks seeded for this page yet — see the seed script
            in the README to add editable fields.
          </div>
        )}
        {blocks.map((b) => (
          <div key={b.key} style={s.card}>
            <div style={s.cardHead}>
              <label style={s.label}>{b.label}</label>
              <span style={s.keyTag}>{b.key}</span>
            </div>
            {b.type === "RICH_TEXT" ? (
              <textarea
                style={s.textarea}
                value={b.value}
                onChange={(e) => updateLocal(b.key, e.target.value)}
              />
            ) : (
              <input
                style={s.input}
                value={b.value}
                onChange={(e) => updateLocal(b.key, e.target.value)}
              />
            )}
            <div style={s.saveRow}>
              <button
                style={s.saveBtn}
                onClick={() => save(b.key, b.value)}
                disabled={saving === b.key}
              >
                {saving === b.key ? "Saving…" : savedKey === b.key ? "Saved ✓" : "Save"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const s: Record<string, React.CSSProperties> = {
  page: { minHeight: "100vh", background: "#F7F5F1", fontFamily: "system-ui, sans-serif", padding: "32px" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "28px" },
  eyebrow: { color: "#E8940C", fontSize: "11px", letterSpacing: "0.08em", textTransform: "uppercase" },
  h1: { fontSize: "28px", margin: 0, color: "#111112" },
  navLink: { color: "#111112", fontSize: "13px" },
  tabs: { display: "flex", gap: "8px", marginBottom: "24px", textTransform: "capitalize" },
  tab: { padding: "8px 16px", borderRadius: "999px", border: "1px solid rgba(17,17,18,0.15)", background: "transparent", cursor: "pointer", fontSize: "13px", color: "#5B5B58" },
  tabActive: { background: "#111112", color: "#F7F5F1", borderColor: "#111112" },
  list: { display: "flex", flexDirection: "column", gap: "14px" },
  empty: { color: "#5B5B58", padding: "40px", textAlign: "center", background: "#fff", borderRadius: "6px" },
  card: { background: "#fff", border: "1px solid rgba(17,17,18,0.1)", borderRadius: "6px", padding: "18px" },
  cardHead: { display: "flex", justifyContent: "space-between", marginBottom: "8px" },
  label: { fontSize: "13px", fontWeight: 600, color: "#111112" },
  keyTag: { fontSize: "11px", color: "#9C9A94", fontFamily: "monospace" },
  input: { width: "100%", padding: "10px", border: "1px solid rgba(17,17,18,0.15)", borderRadius: "4px", fontSize: "14px" },
  textarea: { width: "100%", minHeight: "90px", padding: "10px", border: "1px solid rgba(17,17,18,0.15)", borderRadius: "4px", fontSize: "14px", fontFamily: "inherit" },
  saveRow: { display: "flex", justifyContent: "flex-end", marginTop: "10px" },
  saveBtn: { background: "#111112", color: "#F7F5F1", border: "none", padding: "8px 16px", borderRadius: "4px", cursor: "pointer", fontSize: "12px" },
};
