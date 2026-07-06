"use client";

import { useState } from "react";
import { ActionButton } from "./ui";
import { submitLead } from "../lib/lead-client";

export function PropertyInquiryForm({
  propertyId,
  propertyTitle,
  onDone,
}: {
  propertyId: string;
  propertyTitle: string;
  onDone?: () => void;
}) {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "submitting" | "done" | "error">("idle");

  const handleSubmit = async () => {
    if (!form.firstName.trim() || (!form.email.trim() && !form.phone.trim())) {
      setStatus("error");
      return;
    }
    setStatus("submitting");
    const ok = await submitLead({
      type: "property",
      contact: form,
      property: { id: propertyId, title: propertyTitle },
      message: form.message,
    });
    setStatus(ok ? "done" : "error");
  };

  if (status === "done") {
    return (
      <div className="qualify-confirmation">
        <span className="script-note">Received.</span>
        <p>
          Thanks — your inquiry about {propertyTitle} is in. Expect a follow-up
          within one business day.
        </p>
        {onDone ? (
          <button type="button" className="qualify-back" onClick={onDone}>
            Close
          </button>
        ) : null}
      </div>
    );
  }

  return (
    <div className="qualify-form inquiry-form">
      <div className="qualify-step-head">
        <span className="mono">Property inquiry</span>
        <h3>{propertyTitle}</h3>
        <p>Share where to send details and what you want to know.</p>
      </div>
      <div className="qualify-inputs">
        <input
          aria-label="First name"
          placeholder="First name *"
          value={form.firstName}
          onChange={(event) => setForm((f) => ({ ...f, firstName: event.target.value }))}
        />
        <input
          aria-label="Last name"
          placeholder="Last name"
          value={form.lastName}
          onChange={(event) => setForm((f) => ({ ...f, lastName: event.target.value }))}
        />
        <input
          aria-label="Email"
          type="email"
          placeholder="Email *"
          value={form.email}
          onChange={(event) => setForm((f) => ({ ...f, email: event.target.value }))}
        />
        <input
          aria-label="Phone"
          type="tel"
          placeholder="Phone"
          value={form.phone}
          onChange={(event) => setForm((f) => ({ ...f, phone: event.target.value }))}
        />
      </div>
      <textarea
        aria-label="Message"
        className="inquiry-form__message"
        placeholder="What would you like to know?"
        rows={3}
        value={form.message}
        onChange={(event) => setForm((f) => ({ ...f, message: event.target.value }))}
      />
      {status === "error" && (
        <p className="qualify-error" role="alert">
          Please add your first name plus an email or phone, then try again.
        </p>
      )}
      <div className="qualify-nav">
        <span />
        <ActionButton variant="dark" onClick={handleSubmit} disabled={status === "submitting"}>
          {status === "submitting" ? "Sending…" : "Request details"}
        </ActionButton>
      </div>
    </div>
  );
}
