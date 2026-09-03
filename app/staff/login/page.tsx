"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function StaffLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mfaToken, setMfaToken] = useState("");
  const [requireMfa, setRequireMfa] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await signIn("credentials", {
      email,
      password,
      mfaToken: requireMfa ? mfaToken.trim() : "",
      redirect: false,
    });

    setLoading(false);

    if (res?.error) {
      if (res.error === "MFA_REQUIRED") {
        setRequireMfa(true);
        setError("");
        return;
      }
      if (res.error === "INVALID_MFA_CODE") {
        setRequireMfa(true);
        setError("Invalid 6-digit authenticator code. Please check your authenticator app.");
        return;
      }
      setError(res.error === "CredentialsSignin" ? "Invalid email or password." : res.error);
      return;
    }

    router.push("/staff");
  }

  const resetForm = () => {
    setRequireMfa(false);
    setMfaToken("");
    setError("");
  };

  return (
    <div style={styles.wrap}>
      <form onSubmit={handleSubmit} style={styles.card}>
        <div style={styles.eyebrow}>SINA / Staff Access</div>
        <h1 style={styles.h1}>
          {requireMfa ? "Two-Factor Auth" : "Sign in"}
        </h1>

        {!requireMfa ? (
          <>
            <label style={styles.label}>Email</label>
            <input
              style={styles.input}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@sinatrading.et"
              required
            />

            <label style={styles.label}>Password</label>
            <input
              style={styles.input}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              required
            />
          </>
        ) : (
          <div style={styles.mfaBox}>
            <div style={{ display: "flex", justifyContent: "center", marginBottom: "12px" }}>
              <div style={{ width: 44, height: 44, borderRadius: "50%", background: "rgba(232,148,12,0.15)", border: "1px solid rgba(232,148,12,0.3)", display: "flex", alignItems: "center", justifyContent: "center", color: "#FFCB47" }}>
                <svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
              </div>
            </div>
            <p style={styles.mfaInstructions}>
              Enter the 6-digit verification code from your authenticator app for <strong>{email}</strong>:
            </p>
            <label style={styles.label}>6-Digit Authenticator Code</label>
            <input
              style={styles.mfaInput}
              type="text"
              maxLength={8}
              autoFocus
              value={mfaToken}
              onChange={(e) => setMfaToken(e.target.value.replace(/\D/g, ""))}
              placeholder="123456"
              required
            />
          </div>
        )}

        {error && <div style={styles.error}>{error}</div>}

        <button
          style={styles.button}
          type="submit"
          disabled={loading || (requireMfa && mfaToken.trim().length < 6)}
        >
          {loading
            ? "Verifying…"
            : requireMfa
              ? "Verify & Sign In →"
              : "Sign In"}
        </button>

        {requireMfa ? (
          <button type="button" style={styles.backBtn} onClick={resetForm}>
            ← Back to email &amp; password
          </button>
        ) : (
          <p style={styles.note}>
            Staff access only. Multi-Factor Authentication is supported and enforced for administrative roles.
          </p>
        )}
      </form>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  wrap: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#111112",
    fontFamily: "system-ui, sans-serif",
    padding: "20px",
  },
  card: {
    background: "#1c1c1e",
    padding: "36px",
    borderRadius: "8px",
    width: "360px",
    maxWidth: "100%",
    border: "1px solid rgba(247,245,241,0.1)",
    boxShadow: "0 12px 30px rgba(0,0,0,0.5)",
  },
  eyebrow: {
    color: "#FFCB47",
    fontSize: "11px",
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    marginBottom: "8px",
    fontWeight: 600,
  },
  h1: { color: "#F7F5F1", fontSize: "24px", marginBottom: "20px", margin: "0 0 20px 0" },
  label: {
    display: "block",
    color: "#9C9A94",
    fontSize: "11px",
    textTransform: "uppercase",
    letterSpacing: "0.06em",
    marginBottom: "6px",
    marginTop: "14px",
    fontWeight: 500,
  },
  input: {
    width: "100%",
    padding: "10px 12px",
    borderRadius: "4px",
    border: "1px solid rgba(247,245,241,0.15)",
    background: "#111112",
    color: "#F7F5F1",
    fontSize: "14px",
    boxSizing: "border-box",
  },
  mfaBox: { marginTop: "4px" },
  mfaIcon: { fontSize: "32px", textAlign: "center", marginBottom: "8px" },
  mfaInstructions: { color: "#9C9A94", fontSize: "13px", lineHeight: 1.5, margin: "0 0 12px 0", textAlign: "center" },
  mfaInput: {
    width: "100%",
    padding: "12px",
    borderRadius: "4px",
    border: "1px solid #E8940C",
    background: "#111112",
    color: "#FFCB47",
    fontSize: "24px",
    textAlign: "center",
    letterSpacing: "0.3em",
    fontWeight: 700,
    boxSizing: "border-box",
  },
  button: {
    width: "100%",
    marginTop: "20px",
    padding: "12px",
    borderRadius: "4px",
    border: "none",
    background: "#E8940C",
    color: "#111112",
    fontWeight: 700,
    cursor: "pointer",
    fontSize: "14px",
  },
  backBtn: {
    width: "100%",
    marginTop: "12px",
    background: "none",
    border: "none",
    color: "#9C9A94",
    fontSize: "12px",
    cursor: "pointer",
    padding: "8px",
    textAlign: "center",
  },
  error: {
    marginTop: "14px",
    color: "#E5766B",
    fontSize: "13px",
    background: "rgba(229,118,107,0.1)",
    padding: "8px 12px",
    borderRadius: "4px",
    border: "1px solid rgba(229,118,107,0.2)",
  },
  note: {
    marginTop: "20px",
    color: "#6b6b68",
    fontSize: "11px",
    lineHeight: 1.5,
  },
};
