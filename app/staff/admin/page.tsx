"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type StaffUser = {
  id: string;
  email: string;
  role: "ADMIN" | "EDITOR";
  isActive: boolean;
  hasMfa: boolean;
  lastLoginAt: string | null;
  createdAt: string;
};

type AuditLogItem = {
  id: string;
  action: string;
  target: string | null;
  ipAddress: string | null;
  createdAt: string;
  staffActor: {
    email: string;
    role: string;
  } | null;
};

export default function StaffAdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [users, setUsers] = useState<StaffUser[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newRole, setNewRole] = useState<"ADMIN" | "EDITOR">("EDITOR");
  const [creating, setCreating] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  const [resetTargetUser, setResetTargetUser] = useState<StaffUser | null>(null);
  const [resetPasswordVal, setResetPasswordVal] = useState("");
  const [resetting, setResetting] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/staff/login");
    } else if (status === "authenticated" && (session?.user as any)?.role !== "ADMIN") {
      router.push("/staff");
    }
  }, [status, session, router]);

  const loadData = () => {
    fetch("/api/staff/users")
      .then((r) => {
        if (!r.ok) throw new Error("Unauthorized or server error");
        return r.json();
      })
      .then((data) => {
        if (data.users) setUsers(data.users);
        if (data.auditLogs) setAuditLogs(data.auditLogs);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  };

  useEffect(() => {
    if (status === "authenticated" && (session?.user as any)?.role === "ADMIN") {
      loadData();
    }
  }, [status, session]);

  const showNotification = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(""), 3000);
  };

  async function handleCreateUser(e: React.FormEvent) {
    e.preventDefault();
    setCreating(true);
    setError("");

    try {
      const res = await fetch("/api/staff/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: newEmail.trim(),
          password: newPassword,
          role: newRole,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create user");

      setNewEmail("");
      setNewPassword("");
      setNewRole("EDITOR");
      setShowAddModal(false);
      showNotification(`Staff user ${data.email} created successfully.`);
      loadData();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setCreating(false);
    }
  }

  async function toggleActive(user: StaffUser) {
    const nextState = !user.isActive;
    const confirmMsg = nextState
      ? `Activate account for ${user.email}?`
      : `Deactivate account for ${user.email}? They will no longer be able to log in.`;
    if (!confirm(confirmMsg)) return;

    try {
      const res = await fetch("/api/staff/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: user.id, isActive: nextState }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Update failed");
      showNotification(`Account ${user.email} ${nextState ? "activated" : "deactivated"}.`);
      loadData();
    } catch (err: any) {
      alert(err.message);
    }
  }

  async function updateRole(user: StaffUser, role: "ADMIN" | "EDITOR") {
    if (user.role === role) return;
    try {
      const res = await fetch("/api/staff/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: user.id, role }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Update failed");
      showNotification(`Role updated to ${role} for ${user.email}.`);
      loadData();
    } catch (err: any) {
      alert(err.message);
    }
  }

  async function handleResetMfa(user: StaffUser) {
    if (!confirm(`Are you sure you want to reset 2FA for ${user.email}? They will need to set up their authenticator again.`)) return;

    try {
      const res = await fetch("/api/staff/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: user.id, resetMfa: true }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to reset MFA");
      showNotification(`Two-Factor Authentication reset for ${user.email}.`);
      loadData();
    } catch (err: any) {
      alert(err.message);
    }
  }

  async function handleResetPassword(e: React.FormEvent) {
    e.preventDefault();
    if (!resetTargetUser) return;
    setResetting(true);

    try {
      const res = await fetch("/api/staff/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: resetTargetUser.id, password: resetPasswordVal }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Password reset failed");

      setResetPasswordVal("");
      setResetTargetUser(null);
      showNotification(`Password updated for ${resetTargetUser.email}.`);
      loadData();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setResetting(false);
    }
  }

  const handleExportAuditCsv = () => {
    window.location.href = "/api/staff/users/export-audit";
  };

  if (status === "loading" || loading) {
    return <div style={s.centered}>Loading admin console…</div>;
  }

  return (
    <div style={s.page}>
      <header style={s.header}>
        <div>
          <div style={s.eyebrow}>SINA / Security &amp; Admin</div>
          <h1 style={s.h1}>Staff Management</h1>
        </div>
        <nav style={s.nav}>
          <Link href="/staff" style={s.navLink}>← Back to Inquiries</Link>
          <Link href="/staff/sectors" style={s.navLink}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
              <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2" /><polyline points="2 17 12 22 22 17" /><polyline points="2 12 12 17 22 12" /></svg>
              <span>Service Sectors</span>
            </span>
          </Link>
          <Link href="/staff/mfa" style={s.navLinkMfa}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
              <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
              <span>My 2FA Settings</span>
            </span>
          </Link>
          <Link href="/staff/content" style={s.navLink}>Edit Content</Link>
        </nav>
      </header>

      {successMsg && <div style={s.successBanner}>{successMsg}</div>}
      {error && <div style={s.errorBanner}>{error}</div>}

      <section style={s.section}>
        <div style={s.sectionHead}>
          <div>
            <h2 style={s.h2}>Staff Accounts ({users.length})</h2>
            <p style={s.subText}>Manage who has access to the SINA staff CRM and CMS editor.</p>
          </div>
          <button style={s.primaryBtn} onClick={() => setShowAddModal(true)}>
            + Add New Staff Member
          </button>
        </div>

        <div style={s.tableWrap}>
          <table style={s.table}>
            <thead>
              <tr>
                <th style={s.th}>Email</th>
                <th style={s.th}>Role</th>
                <th style={s.th}>Status</th>
                <th style={s.th}>2FA / MFA</th>
                <th style={s.th}>Last Login</th>
                <th style={s.th}>Created</th>
                <th style={{ ...s.th, textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => {
                const isCurrent = u.id === (session?.user as any)?.id;
                return (
                  <tr key={u.id} style={s.tr}>
                    <td style={s.td}>
                      <strong style={s.userEmailText}>{u.email}</strong>
                      {isCurrent && <span style={s.youBadge}>(You)</span>}
                    </td>
                    <td style={s.td}>
                      <select
                        style={s.roleSelect}
                        value={u.role}
                        disabled={isCurrent}
                        onChange={(e) => updateRole(u, e.target.value as any)}
                      >
                        <option value="ADMIN">ADMIN</option>
                        <option value="EDITOR">EDITOR</option>
                      </select>
                    </td>
                    <td style={s.td}>
                      <span
                        style={{
                          ...s.statusBadge,
                          background: u.isActive ? "#E7F6E9" : "#FDE8E8",
                          color: u.isActive ? "#236B35" : "#9B1C1C",
                        }}
                      >
                        {u.isActive ? "ACTIVE" : "INACTIVE"}
                      </span>
                    </td>
                    <td style={s.td}>
                      <span
                        style={{
                          ...s.statusBadge,
                          background: u.hasMfa ? "#EBF5FF" : "#F4F2EC",
                          color: u.hasMfa ? "#1E429F" : "#7B7B78",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "4px",
                        }}
                      >
                        {u.hasMfa ? (
                          <>
                            <svg width={11} height={11} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><path d="m9 12 2 2 4-4" /></svg>
                            <span>2FA Active</span>
                          </>
                        ) : (
                          "Off"
                        )}
                      </span>
                    </td>
                    <td style={s.td}>
                      <span style={s.dateText}>
                        {u.lastLoginAt ? new Date(u.lastLoginAt).toLocaleString() : "Never"}
                      </span>
                    </td>
                    <td style={s.td}>
                      <span style={s.dateText}>{new Date(u.createdAt).toLocaleDateString()}</span>
                    </td>
                    <td style={{ ...s.td, textAlign: "right" }}>
                      <div style={s.actionRow}>
                        {u.hasMfa && (
                          <button
                            style={s.smallBtn}
                            onClick={() => handleResetMfa(u)}
                            title="Reset 2FA Secret"
                          >
                            Reset 2FA
                          </button>
                        )}
                        <button
                          style={s.smallBtn}
                          onClick={() => setResetTargetUser(u)}
                          title="Reset Password"
                        >
                          Reset Password
                        </button>
                        {!isCurrent && (
                          <button
                            style={{
                              ...s.smallBtn,
                              color: u.isActive ? "#C93B2B" : "#236B35",
                            }}
                            onClick={() => toggleActive(u)}
                          >
                            {u.isActive ? "Deactivate" : "Activate"}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      <section style={s.section}>
        <div style={s.sectionHead}>
          <div>
            <h2 style={s.h2}>Audit Trail (Security Activity)</h2>
            <p style={s.subText}>Immutable log of staff logins, 2FA actions, status changes, and CMS updates.</p>
          </div>
          <button style={s.secondaryBtn} onClick={handleExportAuditCsv} title="Download CSV spreadsheet of audit events">
            <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
              <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
              <span>Export Audit Log (CSV)</span>
            </span>
          </button>
        </div>

        <div style={s.auditBox}>
          {auditLogs.length === 0 ? (
            <div style={s.emptyAudit}>No audit events recorded yet.</div>
          ) : (
            <div style={s.auditList}>
              {auditLogs.map((log) => (
                <div key={log.id} style={s.auditItem}>
                  <div style={s.auditActionBadge}>{log.action}</div>
                  <div style={s.auditActor}>
                    {log.staffActor ? log.staffActor.email : "System / Unknown"}
                  </div>
                  <div style={s.auditTarget}>{log.target || "—"}</div>
                  {log.ipAddress && <div style={s.auditIp}>IP: {log.ipAddress}</div>}
                  <div style={s.auditDate}>{new Date(log.createdAt).toLocaleString()}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {showAddModal && (
        <div style={s.modalOverlay}>
          <div style={s.modalContent}>
            <div style={s.modalHead}>
              <h3 style={s.modalTitle}>Create Staff Account</h3>
              <button style={s.closeBtn} onClick={() => setShowAddModal(false)}>✕</button>
            </div>
            <form onSubmit={handleCreateUser} style={s.modalForm}>
              <label style={s.modalLabel}>Email Address</label>
              <input
                style={s.modalInput}
                type="email"
                required
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder="staff@sinatrading.et"
              />

              <label style={s.modalLabel}>Temporary Password (min 8 chars)</label>
              <input
                style={s.modalInput}
                type="password"
                required
                minLength={8}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••••••"
              />

              <label style={s.modalLabel}>Staff Role</label>
              <select
                style={s.modalSelect}
                value={newRole}
                onChange={(e) => setNewRole(e.target.value as any)}
              >
                <option value="EDITOR">EDITOR (Manages inquiries &amp; site content)</option>
                <option value="ADMIN">ADMIN (Full access including staff &amp; security)</option>
              </select>

              <div style={s.modalActions}>
                <button
                  type="button"
                  style={s.cancelBtn}
                  onClick={() => setShowAddModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" style={s.primaryBtn} disabled={creating}>
                  {creating ? "Creating…" : "Create Account"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {resetTargetUser && (
        <div style={s.modalOverlay}>
          <div style={s.modalContent}>
            <div style={s.modalHead}>
              <h3 style={s.modalTitle}>Reset Password for {resetTargetUser.email}</h3>
              <button style={s.closeBtn} onClick={() => setResetTargetUser(null)}>✕</button>
            </div>
            <form onSubmit={handleResetPassword} style={s.modalForm}>
              <label style={s.modalLabel}>New Password (min 8 chars)</label>
              <input
                style={s.modalInput}
                type="password"
                required
                minLength={8}
                value={resetPasswordVal}
                onChange={(e) => setResetPasswordVal(e.target.value)}
                placeholder="••••••••••••"
              />

              <div style={s.modalActions}>
                <button
                  type="button"
                  style={s.cancelBtn}
                  onClick={() => setResetTargetUser(null)}
                >
                  Cancel
                </button>
                <button type="submit" style={s.primaryBtn} disabled={resetting}>
                  {resetting ? "Resetting…" : "Update Password"}
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
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "28px", flexWrap: "wrap", gap: "16px" },
  eyebrow: { color: "#E8940C", fontSize: "12px", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase" },
  h1: { fontSize: "28px", margin: "4px 0 0 0", color: "#111112" },
  h2: { fontSize: "18px", margin: 0, color: "#111112" },
  subText: { fontSize: "13px", color: "#7B7B78", marginTop: "4px" },
  nav: { display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" },
  navLink: { color: "#111112", fontSize: "13px", fontWeight: 500, textDecoration: "none", padding: "6px 12px", background: "#EAE7DF", borderRadius: "4px" },
  navLinkMfa: { color: "#1E429F", fontSize: "13px", fontWeight: 600, textDecoration: "none", padding: "6px 12px", background: "#EBF5FF", border: "1px solid #C3DDFD", borderRadius: "4px" },

  successBanner: { background: "#E7F6E9", border: "1px solid #B8E4C1", color: "#236B35", padding: "10px 16px", borderRadius: "6px", marginBottom: "16px", fontSize: "13px", fontWeight: 500 },
  errorBanner: { background: "#FDE8E8", border: "1px solid #F8B4B4", color: "#9B1C1C", padding: "10px 16px", borderRadius: "6px", marginBottom: "16px", fontSize: "13px" },

  section: { background: "#FFFFFF", border: "1px solid rgba(17,17,18,0.08)", borderRadius: "8px", padding: "24px", marginBottom: "28px" },
  sectionHead: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", flexWrap: "wrap", gap: "12px" },
  primaryBtn: { background: "#111112", color: "#F7F5F1", border: "none", padding: "8px 16px", borderRadius: "4px", cursor: "pointer", fontSize: "13px", fontWeight: 600 },
  secondaryBtn: { background: "#FFFFFF", color: "#111112", border: "1px solid rgba(17,17,18,0.18)", padding: "8px 14px", borderRadius: "4px", cursor: "pointer", fontSize: "12px", fontWeight: 600 },
  cancelBtn: { background: "transparent", color: "#5B5B58", border: "1px solid rgba(17,17,18,0.2)", padding: "8px 16px", borderRadius: "4px", cursor: "pointer", fontSize: "13px" },

  tableWrap: { overflowX: "auto" },
  table: { width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "13px" },
  th: { padding: "10px 12px", borderBottom: "1px solid rgba(17,17,18,0.1)", color: "#7B7B78", fontWeight: 600, fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.04em" },
  tr: { borderBottom: "1px solid rgba(17,17,18,0.05)" },
  td: { padding: "12px", verticalAlign: "middle" },
  userEmailText: { color: "#111112", fontSize: "14px" },
  youBadge: { marginLeft: "8px", fontSize: "11px", color: "#E8940C", fontWeight: 600 },
  roleSelect: { padding: "4px 8px", borderRadius: "4px", border: "1px solid rgba(17,17,18,0.15)", fontSize: "12px", background: "#FAF9F6" },
  statusBadge: { padding: "3px 8px", borderRadius: "999px", fontSize: "10px", fontWeight: 700, letterSpacing: "0.04em" },
  dateText: { color: "#7B7B78", fontSize: "12px" },
  actionRow: { display: "flex", gap: "6px", justifyContent: "flex-end" },
  smallBtn: { padding: "5px 10px", borderRadius: "4px", border: "1px solid rgba(17,17,18,0.15)", background: "#FFFFFF", cursor: "pointer", fontSize: "11px", fontWeight: 500 },

  auditBox: { background: "#FAF9F6", border: "1px solid rgba(17,17,18,0.06)", borderRadius: "6px", overflow: "hidden" },
  emptyAudit: { padding: "24px", textAlign: "center", color: "#7B7B78", fontSize: "13px" },
  auditList: { display: "flex", flexDirection: "column" },
  auditItem: { display: "grid", gridTemplateColumns: "190px 160px 1fr 120px 150px", gap: "10px", padding: "10px 14px", borderBottom: "1px solid rgba(17,17,18,0.04)", fontSize: "12px", alignItems: "center" },
  auditActionBadge: { fontWeight: 700, color: "#111112", fontFamily: "monospace", fontSize: "11px" },
  auditActor: { color: "#5B5B58", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" },
  auditTarget: { color: "#7B7B78", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" },
  auditIp: { color: "#9C9A94", fontFamily: "monospace", fontSize: "11px" },
  auditDate: { color: "#9C9A94", textAlign: "right", fontSize: "11px" },

  modalOverlay: { position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 },
  modalContent: { background: "#FFFFFF", borderRadius: "8px", padding: "24px", width: "420px", maxWidth: "90%", boxShadow: "0 10px 25px rgba(0,0,0,0.2)" },
  modalHead: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "18px" },
  modalTitle: { margin: 0, fontSize: "18px", color: "#111112" },
  closeBtn: { background: "none", border: "none", fontSize: "16px", cursor: "pointer", color: "#7B7B78" },
  modalForm: { display: "flex", flexDirection: "column", gap: "12px" },
  modalLabel: { fontSize: "12px", fontWeight: 600, color: "#5B5B58", textTransform: "uppercase", letterSpacing: "0.04em" },
  modalInput: { padding: "10px 12px", borderRadius: "4px", border: "1px solid rgba(17,17,18,0.15)", fontSize: "14px" },
  modalSelect: { padding: "10px 12px", borderRadius: "4px", border: "1px solid rgba(17,17,18,0.15)", fontSize: "13px", background: "#FFFFFF" },
  modalActions: { display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "12px" },
};
