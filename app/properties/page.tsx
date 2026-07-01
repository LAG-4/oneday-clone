import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import { propertyListings } from "../property-listings";

const brodyAsset = (name: string) => `/brody/assets/${name}`;

export const metadata: Metadata = {
  title: "Properties | Brody Billings",
  description:
    "Commercial, residential, seller-financed, and investment property listings connected to Brody Billings.",
};

function ActionLink({
  children,
  href,
  variant = "base",
}: {
  children: ReactNode;
  href: string;
  variant?: "base" | "dark" | "outline";
}) {
  const content = (
    <>
      <span className="action-button__bg" />
      <span className="action-button__inner">
        <span className="action-button__text">{children}</span>
      </span>
    </>
  );

  if (href.startsWith("/")) {
    return (
      <Link className={`action-button action-button--${variant}`} href={href}>
        {content}
      </Link>
    );
  }

  return (
    <a className={`action-button action-button--${variant}`} href={href}>
      {content}
    </a>
  );
}

export default function PropertiesPage() {
  return (
    <main className="site-shell listing-page">
      <header className="listing-nav section-inner">
        <Link aria-label="Brody Billings home" className="site-nav__logo" href="/">
          <img
            alt="Brody Billings"
            className="brody-logo"
            src={brodyAsset("logo.png")}
          />
        </Link>
        <nav aria-label="Properties navigation">
          <Link className="text-draw" href="/#about">
            <span>About,</span>
            <span className="text-draw__line" aria-hidden="true" />
          </Link>
          <Link className="text-draw" href="/#ventures">
            <span>Ventures,</span>
            <span className="text-draw__line" aria-hidden="true" />
          </Link>
          <Link className="text-draw" href="/#contact">
            <span>Contact</span>
            <span className="text-draw__line" aria-hidden="true" />
          </Link>
        </nav>
      </header>

      <section className="listing-hero section-inner">
        <p className="mono">Properties / Listings</p>
        <h1>Property Listings</h1>
        <div>
          <p>
            Browse commercial, residential, seller-financed, and investment
            property opportunities. Addresses, pricing, images, and sale terms
            can be added as the final inventory is confirmed.
          </p>
          <ActionLink href="mailto:brody@monument.solutions" variant="outline">
            Ask about a property
          </ActionLink>
        </div>
      </section>

      <section className="listing-section section-inner" aria-labelledby="listings-title">
        <div className="section-kicker">
          <span>Inventory</span>
          <span>{propertyListings.length} property opportunities</span>
        </div>
        <h2 id="listings-title">All Listings</h2>

        <div className="listing-grid">
          {propertyListings.map((property, index) => (
            <article className="listing-card" key={property.title}>
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
            </article>
          ))}
        </div>
      </section>

      <section className="listing-cta section-inner">
        <span className="script-note">Next step.</span>
        <p>
          Add the final property packet here: addresses, photos, prices, parcel
          details, financing terms, status, and inquiry routing.
        </p>
        <ActionLink href="/" variant="dark">
          Back to main site
        </ActionLink>
      </section>
    </main>
  );
}
