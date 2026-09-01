"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function StaffLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
      // NextAuth's default provider setup here targets the staff auth
      // instance configured in lib/auth-staff.ts via the API route at
      // /api/auth/staff/[...nextauth].
    });

    setLoading(false);

    if (res?.error) {
      setError(res.error);
      return;
    }
    router.push("/staff");
  }

  return (
    <div style={styles.wrap}>
      <form onSubmit={handleSubmit} style={styles.card}>
        <div style={styles.eyebrow}>SINA / Staff Access</div>
        <h1 style={styles.h1}>Sign in</h1>

        <label style={styles.label}>Email</label>
        <input
          style={styles.input}
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label style={styles.label}>Password</label>
        <input
          style={styles.input}
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {error && <div style={styles.error}>{error}</div>}

        <button style={styles.button} type="submit" disabled={loading}>
          {loading ? "Signing in…" : "Sign In"}
        </button>

        <p style={styles.note}>
          MFA prompt appears here once TOTP enrollment is wired up — see
          README for the remaining step.
        </p>
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
  },
  card: {
    background: "#1c1c1e",
    padding: "40px",
    borderRadius: "8px",
    width: "360px",
    border: "1px solid rgba(247,245,241,0.1)",
  },
  eyebrow: {
    color: "#FFCB47",
    fontSize: "11px",
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    marginBottom: "8px",
  },
  h1: { color: "#F7F5F1", fontSize: "26px", marginBottom: "24px" },
  label: {
    display: "block",
    color: "#9C9A94",
    fontSize: "11px",
    textTransform: "uppercase",
    letterSpacing: "0.06em",
    marginBottom: "6px",
    marginTop: "16px",
  },
  input: {
    width: "100%",
    padding: "10px 12px",
    borderRadius: "4px",
    border: "1px solid rgba(247,245,241,0.15)",
    background: "#111112",
    color: "#F7F5F1",
    fontSize: "14px",
  },
  button: {
    width: "100%",
    marginTop: "24px",
    padding: "12px",
    borderRadius: "4px",
    border: "none",
    background: "#E8940C",
    color: "#111112",
    fontWeight: 600,
    cursor: "pointer",
  },
  error: {
    marginTop: "14px",
    color: "#E5766B",
    fontSize: "13px",
  },
  note: {
    marginTop: "20px",
    color: "#6b6b68",
    fontSize: "11px",
    lineHeight: 1.5,
  },
};
