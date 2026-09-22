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
  "Professional Consulting",
];

export function ContactForm() {
  const [selectedSector, setSelectedSector] = useState<string>("");
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
      sector: selectedSector || (form.elements.namedItem("sector") as HTMLSelectElement).value || undefined,
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
      setMessage("Inquiry sent successfully. The SINA team will respond within 1 business day.");
      form.reset();
      setSelectedSector("");
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
          <input type="text" id="firstName" name="firstName" required placeholder="John" />
        </div>
        <div className="field">
          <label htmlFor="lastName">Last Name</label>
          <input type="text" id="lastName" name="lastName" required placeholder="Doe" />
        </div>
      </div>
      <div className="form-row">
        <div className="field">
          <label htmlFor="email">Email Address</label>
          <input type="email" id="email" name="email" required placeholder="john.doe@company.com" />
        </div>
        <div className="field">
          <label htmlFor="phone">Phone Number</label>
          <input type="tel" id="phone" name="phone" placeholder="+251 90 000 0000" />
        </div>
      </div>
      
      <div className="form-row">
        <div className="field full">
          <label>Select Sector of Interest</label>
          <div className="sector-pills-select">
            {SECTORS.map((opt) => (
              <button
                type="button"
                key={opt}
                className={`sector-select-pill${selectedSector === opt ? " active" : ""}`}
                onClick={() => setSelectedSector((curr) => (curr === opt ? "" : opt))}
              >
                {opt}
              </button>
            ))}
          </div>
          <input type="hidden" name="sector" value={selectedSector} />
        </div>
      </div>

      <div className="form-row">
        <div className="field full">
          <label htmlFor="message">Project Requirements / Message</label>
          <textarea id="message" name="message" required placeholder="Describe your procurement, logistics, or corporate operational requirements..." />
        </div>
      </div>
      <button type="submit" className="btn btn-gold" disabled={status === "sending"}>
        {status === "sending" ? "Sending…" : "Send Proposal Request →"}
      </button>
      {message && (
        <div className={`form-status ${status === "ok" ? "success" : "error"}`}>{message}</div>
      )}
    </form>
  );
}

