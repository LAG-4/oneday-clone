"use client";

import { useEffect } from "react";
import { QualificationForm } from "./qualification-form";

/**
 * Popup host for the qualification survey. If NEXT_PUBLIC_GHL_SURVEY_URL is
 * set, the GHL-hosted survey is embedded instead of the native form, so the
 * funnel can switch to GHL's survey builder without a code change.
 */
export function QualifyModal({
  open,
  onClose,
  confirmationMessage,
  submitLabel,
}: {
  open: boolean;
  onClose: () => void;
  confirmationMessage: string;
  submitLabel?: string;
}) {
  const surveyUrl = process.env.NEXT_PUBLIC_GHL_SURVEY_URL;

  useEffect(() => {
    if (!open) return;
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.body.classList.add("menu-open");
    window.addEventListener("keydown", handleKey);
    return () => {
      document.body.classList.remove("menu-open");
      window.removeEventListener("keydown", handleKey);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="qualify-modal" role="dialog" aria-modal="true" aria-label="Qualification survey">
      <div className="qualify-modal__backdrop" onClick={onClose} />
      <div className="qualify-modal__panel">
        <button
          type="button"
          className="qualify-modal__close"
          aria-label="Close survey"
          onClick={onClose}
        >
          ×
        </button>
        {surveyUrl ? (
          <iframe
            className="qualify-modal__iframe"
            src={surveyUrl}
            title="Qualification survey"
          />
        ) : (
          <QualificationForm
            confirmationMessage={confirmationMessage}
            submitLabel={submitLabel}
          />
        )}
      </div>
    </div>
  );
}
