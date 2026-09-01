"use client";

import { useState } from "react";

const SECTORS = [
  "Procurement & Supply",
  "Logistics & Delivery",
  "Event Organizing",
  "Property Management",
  "Staff Recruitment & Outsourcing",
  "Additional Support",
  "Trade & Supply",
  "Construction & Real Estate",
  "Energy, Mining & Agriculture",
];

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "error">("idle");
  const [message, setMessage] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    setMessage("");

    const form = e.currentTarget;
    const data = {
      firstName: (form.elements.namedItem("firstName") as HTMLInputElement).value.trim(),
      lastName: (form.elements.namedItem("lastName") as HTMLInputElement).value.trim(),
      email: (form.elements.namedItem("email") as HTMLInputElement).value.trim(),
      phone: (form.elements.namedItem("phone") as HTMLInputElement).value.trim() || undefined,
      sector: (form.elements.namedItem("sector") as HTMLSelectElement).value || undefined,
      message: (form.elements.namedItem("message") as HTMLTextAreaElement).value.trim(),
    };

    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.error || "Could not send inquiry.");
      }
      setStatus("ok");
      setMessage("Inquiry sent. The team typically replies within 1–2 business days.");
      form.reset();
    } catch {
      setStatus("error");
      setMessage("Could not send right now. Please try again, or email sinasupplies@outlook.com.");
    }
  }

  return (
    <form id="contact-form" onSubmit={onSubmit}>
      <div className="form-row">
        <div className="field">
          <label htmlFor="firstName">First Name</label>
          <input type="text" id="firstName" name="firstName" required />
        </div>
        <div className="field">
          <label htmlFor="lastName">Last Name</label>
          <input type="text" id="lastName" name="lastName" required />
        </div>
      </div>
      <div className="form-row">
        <div className="field">
          <label htmlFor="email">Email Address</label>
          <input type="email" id="email" name="email" required />
        </div>
        <div className="field">
          <label htmlFor="phone">Phone Number</label>
          <input type="tel" id="phone" name="phone" />
        </div>
      </div>
      <div className="form-row">
        <div className="field full">
          <label htmlFor="sector">Service of Interest</label>
          <select id="sector" name="sector" defaultValue="">
            <option value="">Select a service (optional)</option>
            {SECTORS.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="form-row">
        <div className="field full">
          <label htmlFor="message">Message</label>
          <textarea id="message" name="message" required placeholder="Tell us what you need..." />
        </div>
      </div>
      <button type="submit" className="btn btn-primary" disabled={status === "sending"}>
        {status === "sending" ? "Sending…" : "Send Inquiry →"}
      </button>
      {message && (
        <div className={`form-status ${status === "ok" ? "success" : "error"}`}>{message}</div>
      )}
    </form>
  );
}
