"use client";

import Link from "next/link";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function ClientLoginPage() {
  const { status } = useSession();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (status === "authenticated") {
      router.replace("/portal");
    }
  }, [status, router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await signIn("client-credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (res?.error) {
      setError(res.error === "CredentialsSignin" ? "Invalid email or password." : res.error);
      return;
    }

    router.push("/portal");
    router.refresh();
  }

  return (
    <section className="auth-shell">
      <div className="wrap">
        <div className="auth-card-wrap">
          <div className="auth-card">
            <div className="eyebrow">Client Access</div>
            <h1>Login to your <span className="accent">portal</span></h1>
            <p className="auth-lead">
              Access your company profile and submit or review your quote requests with SINA.
            </p>

            <form className="auth-form" onSubmit={handleSubmit}>
              <div>
                <label>Email address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  required
                />
              </div>

              <div>
                <label>Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
              </div>

              {error ? <div className="auth-error">{error}</div> : null}

              <button className="btn btn-gold auth-submit" type="submit" disabled={loading}>
                {loading ? "Signing in…" : "Login →"}
              </button>
            </form>

            <p className="auth-meta">
              New here? <Link href="/signup">Create an account</Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
