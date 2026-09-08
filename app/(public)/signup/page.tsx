"use client";

import Link from "next/link";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function ClientSignupPage() {
  const { status } = useSession();
  const router = useRouter();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    company: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (status === "authenticated") {
      router.replace("/portal");
    }
  }, [status, router]);

  function setField(name: string, value: string) {
    setForm((curr) => ({ ...curr, [name]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (form.password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    const signupRes = await fetch("/api/auth/client/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        company: form.company,
        phone: form.phone,
        password: form.password,
      }),
    });

    const signupBody = await signupRes.json().catch(() => null);

    if (!signupRes.ok) {
      setLoading(false);
      setError(signupBody?.error || "Could not create your account.");
      return;
    }

    const loginRes = await signIn("client-credentials", {
      email: form.email,
      password: form.password,
      redirect: false,
    });

    setLoading(false);

    if (loginRes?.error) {
      setError("Account created, but automatic sign-in failed. Please log in manually.");
      router.push("/login");
      return;
    }

    router.push("/portal");
    router.refresh();
  }

  return (
    <section className="auth-shell">
      <div className="wrap">
        <div className="auth-card-wrap">
          <div className="auth-card auth-card-wide">
            <div className="eyebrow">Client Registration</div>
            <h1>Create your <span className="accent">portal account</span></h1>
            <p className="auth-lead">
              Set up a client account to manage your company details and submit inquiries through the SINA portal.
            </p>

            <form className="auth-form" onSubmit={handleSubmit}>
              <div className="auth-grid-two">
                <div>
                  <label>First name</label>
                  <input type="text" value={form.firstName} onChange={(e) => setField("firstName", e.target.value)} required />
                </div>
                <div>
                  <label>Last name</label>
                  <input type="text" value={form.lastName} onChange={(e) => setField("lastName", e.target.value)} required />
                </div>
              </div>

              <div className="auth-grid-two">
                <div>
                  <label>Email address</label>
                  <input type="email" value={form.email} onChange={(e) => setField("email", e.target.value)} required />
                </div>
                <div>
                  <label>Phone number</label>
                  <input type="tel" value={form.phone} onChange={(e) => setField("phone", e.target.value)} placeholder="+251 90 000 0000" />
                </div>
              </div>

              <div>
                <label>Company name</label>
                <input type="text" value={form.company} onChange={(e) => setField("company", e.target.value)} placeholder="Your organization" />
              </div>

              <div className="auth-grid-two">
                <div>
                  <label>Password</label>
                  <input type="password" value={form.password} onChange={(e) => setField("password", e.target.value)} required minLength={8} />
                </div>
                <div>
                  <label>Confirm password</label>
                  <input type="password" value={form.confirmPassword} onChange={(e) => setField("confirmPassword", e.target.value)} required minLength={8} />
                </div>
              </div>

              {error ? <div className="auth-error">{error}</div> : null}

              <button className="btn btn-gold auth-submit" type="submit" disabled={loading}>
                {loading ? "Creating account…" : "Create account →"}
              </button>
            </form>

            <p className="auth-meta">
              Already have an account? <Link href="/login">Login</Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
