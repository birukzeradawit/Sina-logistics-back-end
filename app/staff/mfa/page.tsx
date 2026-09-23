"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function StaffMfaPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [isEnabled, setIsEnabled] = useState(false);
  const [secret, setSecret] = useState("");
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState("");
  const [token, setToken] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const [showDisableModal, setShowDisableModal] = useState(false);
  const [disablePassword, setDisablePassword] = useState("");
  const [disabling, setDisabling] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/staff/login");
  }, [status, router]);

  const loadMfaStatus = (forceNew = false) => {
    setLoading(true);
    setErrorMsg("");
    fetch(`/api/staff/mfa${forceNew ? "?new=true" : ""}`)
      .then((r) => r.json())
      .then((data) => {
        setIsEnabled(!!data.isEnabled);
        if (!data.isEnabled && data.secret) {
          setSecret(data.secret);
          if (data.qrCodeDataUrl) setQrCodeDataUrl(data.qrCodeDataUrl);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    if (status === "authenticated") {
      loadMfaStatus(false);
    }
  }, [status]);

  const generateNewSecret = () => {
    setToken("");
    setErrorMsg("");
    loadMfaStatus(true);
  };

  async function handleVerifyAndEnable(e: React.FormEvent) {
    e.preventDefault();
    setVerifying(true);
    setErrorMsg("");
    setSuccessMsg("");

    const cleanedToken = token.replace(/[\s-]+/g, "").trim();

    try {
      const res = await fetch("/api/staff/mfa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ secret, token: cleanedToken }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to verify code");

      setSuccessMsg("Two-Factor Authentication successfully activated!");
      setIsEnabled(true);
      setToken("");
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setVerifying(false);
    }
  }

  async function handleDisableMfa(e: React.FormEvent) {
    e.preventDefault();
    setDisabling(true);
    setErrorMsg("");

    try {
      const res = await fetch("/api/staff/mfa", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: disablePassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to disable MFA");

      setShowDisableModal(false);
      setDisablePassword("");
      setSuccessMsg("Two-Factor Authentication has been disabled.");
      setSecret("");
      setQrCodeDataUrl("");
      loadMfaStatus(true);
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setDisabling(false);
    }
  }

  const copySecret = () => {
    navigator.clipboard.writeText(secret);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (status === "loading" || loading) {
    return <div style={s.centered}>Loading security settings…</div>;
  }

  return (
    <div style={s.page}>
      <header style={s.header}>
        <div>
          <div style={s.eyebrow}>SINA / Account Security</div>
          <h1 style={s.h1}>Two-Factor Authentication (2FA)</h1>
        </div>
        <nav style={s.nav}>
          <Link href="/staff" style={s.navLink}>← Back to Inquiries</Link>
          {(session?.user as any)?.role === "ADMIN" && (
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

      <div style={s.card}>
        {isEnabled ? (
          <div style={s.enabledWrap}>
            <div style={{ ...s.shieldIcon, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width={42} height={42} viewBox="0 0 24 24" fill="none" stroke="#236B35" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><path d="m9 12 2 2 4-4" /></svg>
            </div>
            <h2 style={s.statusTitle}>Two-Factor Authentication is Active</h2>
            <p style={s.statusDesc}>
              Your staff account (<strong>{session?.user?.email}</strong>) is currently protected with TOTP Two-Factor Authentication.
              You will be prompted for a 6-digit code each time you sign in.
            </p>
            <div style={s.enabledActions}>
              <button
                style={s.disableBtn}
                onClick={() => setShowDisableModal(true)}
              >
                Disable Two-Factor Authentication
              </button>
            </div>
          </div>
        ) : (
          <div style={s.setupWrap}>
            <div style={s.setupHeader}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "10px" }}>
                <div>
                  <h2 style={s.setupTitle}>Set Up Two-Factor Authentication</h2>
                  <p style={s.setupDesc}>
                    Protect your SINA staff account using an authenticator app (such as Google Authenticator, Microsoft Authenticator, 1Password, or Apple Keychain).
                  </p>
                </div>
                <button style={s.refreshBtn} onClick={generateNewSecret} title="Generate a new QR Code & Key">
                  <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                    <svg width={13} height={13} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" /></svg>
                    <span>Generate Fresh QR Code</span>
                  </span>
                </button>
              </div>
            </div>

            <div style={s.stepsGrid}>
              <div style={s.stepCard}>
                <div style={s.stepNum}>Step 1</div>
                <h3 style={s.stepTitle}>Scan the QR Code</h3>
                <p style={s.stepText}>Open your authenticator app on your phone and scan the code below:</p>

                {qrCodeDataUrl ? (
                  <div style={s.qrBox}>
                    <img src={qrCodeDataUrl} alt="MFA QR Code" style={s.qrImg} />
                  </div>
                ) : (
                  <div style={s.qrBox}>Generating QR Code…</div>
                )}

                <div style={s.manualBox}>
                  <span style={s.manualLabel}>Or enter this setup key manually:</span>
                  <div style={s.keyRow}>
                    <code style={s.secretCode}>{secret}</code>
                    <button style={s.copyBtn} onClick={copySecret}>
                      {copied ? "Copied!" : "Copy"}
                    </button>
                  </div>
                </div>
              </div>

              <div style={s.stepCard}>
                <div style={s.stepNum}>Step 2</div>
                <h3 style={s.stepTitle}>Verify &amp; Activate</h3>
                <p style={s.stepText}>
                  Enter the 6-digit verification code currently shown in your authenticator app:
                </p>

                <form onSubmit={handleVerifyAndEnable} style={s.form}>
                  <input
                    style={s.tokenInput}
                    type="text"
                    maxLength={8}
                    autoFocus
                    required
                    placeholder="123456"
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                  />

                  <button
                    type="submit"
                    style={s.verifyBtn}
                    disabled={token.replace(/[\s-]+/g, "").length < 6 || verifying}
                  >
                    {verifying ? "Verifying…" : "Activate Two-Factor Authentication →"}
                  </button>
                </form>

                <div style={s.infoTip}>
                  Once activated, you will need this 6-digit code each time you log in to SINA.
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {showDisableModal && (
        <div style={s.modalOverlay}>
          <div style={s.modalContent}>
            <div style={s.modalHead}>
              <h3 style={s.modalTitle}>Disable Two-Factor Authentication</h3>
              <button style={s.closeBtn} onClick={() => setShowDisableModal(false)}>✕</button>
            </div>
            <p style={s.modalWarning}>
              Are you sure? Disabling 2FA reduces the security of your account. Enter your password to confirm:
            </p>
            <form onSubmit={handleDisableMfa} style={s.modalForm}>
              <label style={s.modalLabel}>Current Password</label>
              <input
                style={s.modalInput}
                type="password"
                required
                value={disablePassword}
                onChange={(e) => setDisablePassword(e.target.value)}
                placeholder="••••••••••••"
              />

              <div style={s.modalActions}>
                <button
                  type="button"
                  style={s.cancelBtn}
                  onClick={() => setShowDisableModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={s.dangerBtn}
                  disabled={disabling}
                >
                  {disabling ? "Disabling…" : "Confirm & Disable"}
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
  page: { minHeight: "100vh", background: "#F7F5F1", fontFamily: "system-ui, -apple-system, sans-serif", padding: "32px", maxWidth: "1000px", margin: "0 auto" },
  centered: { display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", color: "#5B5B58", fontSize: "16px" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "28px", flexWrap: "wrap", gap: "16px" },
  eyebrow: { color: "#E8940C", fontSize: "12px", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase" },
  h1: { fontSize: "28px", margin: "4px 0 0 0", color: "#111112" },
  nav: { display: "flex", alignItems: "center", gap: "12px" },
  navLink: { color: "#111112", fontSize: "13px", fontWeight: 500, textDecoration: "none", padding: "6px 12px", background: "#EAE7DF", borderRadius: "4px" },
  navLinkAdmin: { color: "#111112", fontSize: "13px", fontWeight: 600, textDecoration: "none", padding: "6px 12px", background: "#FFCB47", borderRadius: "4px" },

  successBanner: { background: "#E7F6E9", border: "1px solid #B8E4C1", color: "#236B35", padding: "12px 16px", borderRadius: "6px", marginBottom: "20px", fontSize: "13px", fontWeight: 500 },
  errorBanner: { background: "#FDE8E8", border: "1px solid #F8B4B4", color: "#9B1C1C", padding: "12px 16px", borderRadius: "6px", marginBottom: "20px", fontSize: "13px" },

  card: { background: "#FFFFFF", border: "1px solid rgba(17,17,18,0.08)", borderRadius: "8px", padding: "32px", boxShadow: "0 1px 4px rgba(0,0,0,0.02)" },
  
  enabledWrap: { textAlign: "center", padding: "20px 0" },
  shieldIcon: { fontSize: "48px", marginBottom: "12px" },
  statusTitle: { fontSize: "22px", color: "#111112", margin: "0 0 10px 0" },
  statusDesc: { color: "#5B5B58", fontSize: "14px", lineHeight: 1.6, maxWidth: "560px", margin: "0 auto 24px auto" },
  enabledActions: { display: "flex", justifyContent: "center", gap: "12px" },
  disableBtn: { background: "none", border: "1px solid rgba(201,59,43,0.3)", color: "#C93B2B", padding: "10px 18px", borderRadius: "4px", fontSize: "13px", cursor: "pointer", fontWeight: 500 },

  setupWrap: {},
  setupHeader: { marginBottom: "28px" },
  setupTitle: { fontSize: "20px", color: "#111112", margin: "0 0 6px 0" },
  setupDesc: { color: "#5B5B58", fontSize: "13px", lineHeight: 1.5, margin: 0, maxWidth: "600px" },
  refreshBtn: { background: "#FAF9F6", border: "1px solid rgba(17,17,18,0.15)", padding: "7px 12px", borderRadius: "4px", fontSize: "12px", cursor: "pointer", color: "#5B5B58", fontWeight: 500 },

  stepsGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "24px" },
  stepCard: { background: "#FAF9F6", border: "1px solid rgba(17,17,18,0.06)", borderRadius: "6px", padding: "20px", display: "flex", flexDirection: "column" },
  stepNum: { color: "#E8940C", fontSize: "11px", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "4px" },
  stepTitle: { fontSize: "16px", color: "#111112", margin: "0 0 8px 0" },
  stepText: { fontSize: "13px", color: "#5B5B58", lineHeight: 1.5, margin: "0 0 16px 0" },

  qrBox: { background: "#FFFFFF", padding: "16px", borderRadius: "6px", border: "1px solid rgba(17,17,18,0.1)", display: "flex", justifyContent: "center", alignItems: "center", minHeight: "180px", marginBottom: "16px" },
  qrImg: { width: "180px", height: "180px", display: "block" },

  manualBox: { borderTop: "1px solid rgba(17,17,18,0.08)", paddingTop: "14px", marginTop: "auto" },
  manualLabel: { fontSize: "11px", color: "#7B7B78", display: "block", marginBottom: "6px" },
  keyRow: { display: "flex", gap: "6px", alignItems: "center" },
  secretCode: { background: "#FFFFFF", border: "1px solid rgba(17,17,18,0.12)", padding: "6px 8px", borderRadius: "4px", fontSize: "12px", color: "#111112", fontFamily: "monospace", letterSpacing: "0.08em", flex: 1, overflowX: "auto" },
  copyBtn: { background: "#111112", color: "#F7F5F1", border: "none", padding: "6px 12px", borderRadius: "4px", fontSize: "11px", cursor: "pointer", fontWeight: 600 },

  form: { display: "flex", flexDirection: "column", gap: "12px" },
  tokenInput: { width: "100%", padding: "14px", borderRadius: "4px", border: "2px solid #E8940C", fontSize: "26px", textAlign: "center", letterSpacing: "0.25em", fontWeight: 700, boxSizing: "border-box", background: "#FFFFFF" },
  verifyBtn: { background: "#111112", color: "#FFCB47", border: "none", padding: "12px", borderRadius: "4px", fontSize: "13px", fontWeight: 700, cursor: "pointer" },
  infoTip: { background: "rgba(232,148,12,0.08)", border: "1px solid rgba(232,148,12,0.2)", borderRadius: "4px", padding: "10px 12px", fontSize: "12px", color: "#8F5B08", marginTop: "16px", lineHeight: 1.4 },

  modalOverlay: { position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 },
  modalContent: { background: "#FFFFFF", borderRadius: "8px", padding: "24px", width: "400px", maxWidth: "90%", boxShadow: "0 10px 25px rgba(0,0,0,0.2)" },
  modalHead: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" },
  modalTitle: { margin: 0, fontSize: "18px", color: "#111112" },
  closeBtn: { background: "none", border: "none", fontSize: "16px", cursor: "pointer", color: "#7B7B78" },
  modalWarning: { color: "#9B1C1C", fontSize: "13px", lineHeight: 1.5, margin: "0 0 16px 0" },
  modalForm: { display: "flex", flexDirection: "column", gap: "12px" },
  modalLabel: { fontSize: "11px", fontWeight: 600, color: "#5B5B58", textTransform: "uppercase", letterSpacing: "0.04em" },
  modalInput: { padding: "10px 12px", borderRadius: "4px", border: "1px solid rgba(17,17,18,0.15)", fontSize: "14px" },
  modalActions: { display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "8px" },
  cancelBtn: { background: "transparent", color: "#5B5B58", border: "1px solid rgba(17,17,18,0.2)", padding: "8px 16px", borderRadius: "4px", cursor: "pointer", fontSize: "13px" },
  dangerBtn: { background: "#C93B2B", color: "#FFFFFF", border: "none", padding: "8px 16px", borderRadius: "4px", cursor: "pointer", fontSize: "13px", fontWeight: 600 },
};
