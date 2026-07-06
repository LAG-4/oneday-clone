"use client";

import { useEffect, useState } from "react";
import type { Property } from "../lib/content-types";
import { PropertyInquiryForm } from "./property-inquiry-form";

export function PropertiesExplorer({ properties }: { properties: Property[] }) {
  const [inquiry, setInquiry] = useState<Property | null>(null);

  useEffect(() => {
    if (!inquiry) return;
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setInquiry(null);
    };
    document.body.classList.add("menu-open");
    window.addEventListener("keydown", handleKey);
    return () => {
      document.body.classList.remove("menu-open");
      window.removeEventListener("keydown", handleKey);
    };
  }, [inquiry]);

  return (
    <>
      <div className="listing-grid">
        {properties.map((property, index) => (
          <article className="listing-card" key={property.id}>
            <div className="listing-card__top">
              <span className="mono">{String(index + 1).padStart(2, "0")}</span>
              <span>{property.category}</span>
            </div>
            <div className="listing-card__main">
              <h3>{property.title}</h3>
              <p>{property.summary}</p>
            </div>
            <dl>
              <div>
                <dt>Status</dt>
                <dd>{property.status}</dd>
              </div>
              <div>
                <dt>Location</dt>
                <dd>{property.location}</dd>
              </div>
              <div>
                <dt>Price</dt>
                <dd>{property.price}</dd>
              </div>
            </dl>
            <ul>
              {property.details.map((detail) => (
                <li key={detail}>{detail}</li>
              ))}
            </ul>
            <button
              type="button"
              className="listing-card__inquire"
              onClick={() => setInquiry(property)}
            >
              Ask about this property
            </button>
          </article>
        ))}
      </div>

      {inquiry ? (
        <div
          className="qualify-modal"
          role="dialog"
          aria-modal="true"
          aria-label={`Inquiry about ${inquiry.title}`}
        >
          <div className="qualify-modal__backdrop" onClick={() => setInquiry(null)} />
          <div className="qualify-modal__panel">
            <button
              type="button"
              className="qualify-modal__close"
              aria-label="Close inquiry"
              onClick={() => setInquiry(null)}
            >
              ×
            </button>
            <PropertyInquiryForm
              propertyId={inquiry.id}
              propertyTitle={inquiry.title}
              onDone={() => setInquiry(null)}
            />
          </div>
        </div>
      ) : null}
    </>
  );
}
