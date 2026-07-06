"use client";

import { useState } from "react";
import { ActionButton } from "./ui";
import { submitLead } from "../lib/lead-client";
import {
  DECISION,
  EMPLOYEES,
  INDUSTRIES,
  INTENT,
  LOCATIONS,
  PAIN_POINTS,
  REVENUE,
  SYSTEMS,
  TIMELINE,
  type Option,
  type QualificationAnswers,
} from "../lib/scoring";

type StepId = "situation" | "shape" | "systems" | "contact";

const STEPS: { id: StepId; title: string; intro: string }[] = [
  {
    id: "situation",
    title: "Your situation",
    intro: "Which of these sound like your business?",
  },
  {
    id: "shape",
    title: "The shape of the business",
    intro: "A quick sense of scale — ranges are fine.",
  },
  {
    id: "systems",
    title: "Systems & decision",
    intro: "What you run today, and how this decision gets made.",
  },
  {
    id: "contact",
    title: "Where to send the review",
    intro: "We follow up within one business day.",
  },
];

const emptyAnswers: QualificationAnswers = {
  painPoints: [],
  locations: "",
  revenue: "",
  employees: "",
  industry: "",
  systems: [],
  decision: "",
  timeline: "",
  intent: "",
  acknowledged: false,
};

function OptionPills({
  options,
  selected,
  onToggle,
  multi = false,
}: {
  options: Option[];
  selected: string[];
  onToggle: (value: string) => void;
  multi?: boolean;
}) {
  return (
    <div className="qualify-options" role={multi ? "group" : "radiogroup"}>
      {options.map((option) => {
        const isActive = selected.includes(option.value);
        return (
          <button
            key={option.value}
            type="button"
            role={multi ? "checkbox" : "radio"}
            aria-checked={isActive}
            className={`qualify-option ${isActive ? "is-active" : ""}`}
            onClick={() => onToggle(option.value)}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

export function QualificationForm({
  confirmationMessage,
  submitLabel = "Apply for an Audit",
}: {
  confirmationMessage: string;
  submitLabel?: string;
}) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<QualificationAnswers>(emptyAnswers);
  const [contact, setContact] = useState({
    firstName: "",
    lastName: "",
    company: "",
    role: "",
    email: "",
    phone: "",
  });
  const [status, setStatus] = useState<"idle" | "submitting" | "done" | "error">("idle");
  const [attempted, setAttempted] = useState(false);

  const set = <K extends keyof QualificationAnswers>(
    key: K,
    value: QualificationAnswers[K],
  ) => setAnswers((current) => ({ ...current, [key]: value }));

  const toggleMulti = (key: "painPoints" | "systems", value: string) =>
    setAnswers((current) => ({
      ...current,
      [key]: current[key].includes(value)
        ? current[key].filter((item) => item !== value)
        : [...current[key], value],
    }));

  const stepValid = (index: number): boolean => {
    switch (STEPS[index].id) {
      case "situation":
        return answers.painPoints.length > 0 && Boolean(answers.locations);
      case "shape":
        return Boolean(answers.revenue && answers.employees && answers.industry);
      case "systems":
        return (
          answers.systems.length > 0 &&
          Boolean(answers.decision && answers.timeline && answers.intent)
        );
      case "contact":
        return Boolean(
          contact.firstName.trim() &&
            contact.company.trim() &&
            (contact.email.trim() || contact.phone.trim()),
        );
    }
  };

  const next = () => {
    if (!stepValid(step)) {
      setAttempted(true);
      return;
    }
    setAttempted(false);
    setStep((current) => Math.min(current + 1, STEPS.length - 1));
  };

  const back = () => {
    setAttempted(false);
    setStep((current) => Math.max(current - 1, 0));
  };

  const handleSubmit = async () => {
    if (!stepValid(step)) {
      setAttempted(true);
      return;
    }
    setStatus("submitting");
    const ok = await submitLead({
      type: "qualification",
      contact,
      qualification: answers,
    });
    setStatus(ok ? "done" : "error");
  };

  if (status === "done") {
    return (
      <div className="qualify-confirmation">
        <span className="script-note">Received.</span>
        <p>{confirmationMessage}</p>
      </div>
    );
  }

  const current = STEPS[step];

  return (
    <div className="qualify-form">
      <div className="qualify-progress" aria-hidden="true">
        {STEPS.map((item, index) => (
          <span
            key={item.id}
            className={`qualify-progress__dot ${index <= step ? "is-active" : ""}`}
          />
        ))}
      </div>

      <div className="qualify-step-head">
        <span className="mono">
          Step {step + 1} of {STEPS.length}
        </span>
        <h3>{current.title}</h3>
        <p>{current.intro}</p>
      </div>

      {current.id === "situation" && (
        <div className="qualify-fields">
          <label className="qualify-label">Select everything that applies</label>
          <OptionPills
            multi
            options={PAIN_POINTS}
            selected={answers.painPoints}
            onToggle={(value) => toggleMulti("painPoints", value)}
          />
          <label className="qualify-label">How many locations do you operate?</label>
          <OptionPills
            options={LOCATIONS}
            selected={answers.locations ? [answers.locations] : []}
            onToggle={(value) => set("locations", value)}
          />
        </div>
      )}

      {current.id === "shape" && (
        <div className="qualify-fields">
          <label className="qualify-label">Annual revenue</label>
          <OptionPills
            options={REVENUE}
            selected={answers.revenue ? [answers.revenue] : []}
            onToggle={(value) => set("revenue", value)}
          />
          <label className="qualify-label">Number of employees</label>
          <OptionPills
            options={EMPLOYEES}
            selected={answers.employees ? [answers.employees] : []}
            onToggle={(value) => set("employees", value)}
          />
          <label className="qualify-label">Industry</label>
          <OptionPills
            options={INDUSTRIES}
            selected={answers.industry ? [answers.industry] : []}
            onToggle={(value) => set("industry", value)}
          />
        </div>
      )}

      {current.id === "systems" && (
        <div className="qualify-fields">
          <label className="qualify-label">Which systems are you running?</label>
          <OptionPills
            multi
            options={SYSTEMS}
            selected={answers.systems}
            onToggle={(value) => toggleMulti("systems", value)}
          />
          <label className="qualify-label">Who&apos;s involved in this decision?</label>
          <OptionPills
            options={DECISION}
            selected={answers.decision ? [answers.decision] : []}
            onToggle={(value) => set("decision", value)}
          />
          <label className="qualify-label">How soon are you looking to fix this?</label>
          <OptionPills
            options={TIMELINE}
            selected={answers.timeline ? [answers.timeline] : []}
            onToggle={(value) => set("timeline", value)}
          />
          <label className="qualify-label">What are you hoping Monument helps with?</label>
          <OptionPills
            options={INTENT}
            selected={answers.intent ? [answers.intent] : []}
            onToggle={(value) => set("intent", value)}
          />
        </div>
      )}

      {current.id === "contact" && (
        <div className="qualify-fields qualify-fields--contact">
          <div className="qualify-inputs">
            <input
              aria-label="First name"
              placeholder="First name *"
              value={contact.firstName}
              onChange={(event) =>
                setContact((c) => ({ ...c, firstName: event.target.value }))
              }
            />
            <input
              aria-label="Last name"
              placeholder="Last name"
              value={contact.lastName}
              onChange={(event) =>
                setContact((c) => ({ ...c, lastName: event.target.value }))
              }
            />
            <input
              aria-label="Company"
              placeholder="Company *"
              value={contact.company}
              onChange={(event) =>
                setContact((c) => ({ ...c, company: event.target.value }))
              }
            />
            <input
              aria-label="Role or title"
              placeholder="Role / title"
              value={contact.role}
              onChange={(event) => setContact((c) => ({ ...c, role: event.target.value }))}
            />
            <input
              aria-label="Email"
              type="email"
              placeholder="Email *"
              value={contact.email}
              onChange={(event) => setContact((c) => ({ ...c, email: event.target.value }))}
            />
            <input
              aria-label="Phone"
              type="tel"
              placeholder="Phone"
              value={contact.phone}
              onChange={(event) => setContact((c) => ({ ...c, phone: event.target.value }))}
            />
          </div>
          <button
            type="button"
            className={`qualify-ack ${answers.acknowledged ? "is-active" : ""}`}
            role="checkbox"
            aria-checked={answers.acknowledged}
            onClick={() => set("acknowledged", !answers.acknowledged)}
          >
            <span className="qualify-ack__box" aria-hidden="true" />
            An audit requires honest access to your people, systems, and data. Understood.
          </button>
        </div>
      )}

      {attempted && !stepValid(step) && (
        <p className="qualify-error" role="alert">
          {current.id === "contact"
            ? "Please add your first name, company, and an email or phone number."
            : "Please answer each question to continue."}
        </p>
      )}
      {status === "error" && (
        <p className="qualify-error" role="alert">
          Something went wrong sending your answers. Please try again.
        </p>
      )}

      <div className="qualify-nav">
        {step > 0 ? (
          <button type="button" className="qualify-back" onClick={back}>
            Back
          </button>
        ) : (
          <span />
        )}
        {step < STEPS.length - 1 ? (
          <ActionButton variant="dark" onClick={next}>
            Continue
          </ActionButton>
        ) : (
          <ActionButton
            variant="dark"
            onClick={handleSubmit}
            disabled={status === "submitting"}
          >
            {status === "submitting" ? "Sending…" : submitLabel}
          </ActionButton>
        )}
      </div>
    </div>
  );
}
