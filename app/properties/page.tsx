import type { Metadata } from "next";
import Link from "next/link";
import { PropertiesExplorer } from "../components/properties-explorer";
import { getProperties, getSiteContent } from "../lib/content";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Properties | Brody Billings",
  description:
    "Commercial, residential, seller-financed, and investment property listings connected to Brody Billings.",
};

export default async function PropertiesPage() {
  const [properties, { settings }] = await Promise.all([
    getProperties(),
    getSiteContent(),
  ]);

  return (
    <main className="site-shell listing-page">
      <header className="listing-nav section-inner">
        <Link aria-label="Brody Billings home" className="site-nav__logo" href="/">
          <img
            alt="Brody Billings"
            className="brody-logo"
            src="/brody/assets/logo.png"
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
            property opportunities. Ask about any listing and the details go
            straight to Brody.
          </p>
        </div>
      </section>

      <section
        className="listing-section section-inner"
        aria-labelledby="listings-title"
      >
        <div className="section-kicker">
          <span>Inventory</span>
          <span>{properties.length} property opportunities</span>
        </div>
        <h2 id="listings-title">All Listings</h2>

        <PropertiesExplorer properties={properties} />
      </section>

      <section className="listing-cta section-inner">
        <span className="script-note">Next step.</span>
        <p>
          Want details on something that is not listed yet? Email{" "}
          <a href={`mailto:${settings.contactEmail}`}>{settings.contactEmail}</a>{" "}
          and mention the property.
        </p>
        <Link className="text-draw" href="/">
          <span>Back to main site</span>
          <span className="text-draw__line" aria-hidden="true" />
        </Link>
      </section>
    </main>
  );
}
