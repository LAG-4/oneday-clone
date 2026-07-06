import type { Metadata } from "next";
import Link from "next/link";
import { QualificationForm } from "../components/qualification-form";
import { getSiteContent } from "../lib/content";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "See if Your Business Qualifies | Brody Billings",
  description:
    "A short qualification survey to see whether an operational audit from Monument Solutions is the right next step for your business.",
};

export default async function QualifyPage() {
  const { settings } = await getSiteContent();
  const surveyUrl = process.env.NEXT_PUBLIC_GHL_SURVEY_URL;

  return (
    <main className="site-shell listing-page qualify-page">
      <header className="listing-nav section-inner">
        <Link aria-label="Brody Billings home" className="site-nav__logo" href="/">
          <img alt="Brody Billings" className="brody-logo" src="/brody/assets/logo.png" />
        </Link>
        <nav aria-label="Qualify navigation">
          <Link className="text-draw" href="/">
            <span>Home</span>
            <span className="text-draw__line" aria-hidden="true" />
          </Link>
        </nav>
      </header>

      <section className="listing-hero section-inner">
        <p className="mono">Monument Solutions / Operational Audit</p>
        <h1>{settings.primaryCtaLabel}</h1>
        <div>
          <p>
            Four short steps. No documents needed. We review every application
            and follow up within one business day.
          </p>
        </div>
      </section>

      <section className="section-inner qualify-page__form">
        {surveyUrl ? (
          <iframe
            className="qualify-page__iframe"
            src={surveyUrl}
            title="Qualification survey"
          />
        ) : (
          <QualificationForm confirmationMessage={settings.confirmationMessage} />
        )}
      </section>
    </main>
  );
}
