"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { Profile, SiteContent } from "../lib/content-types";
import { setProfileCookie } from "../lib/lead-client";
import { ActionButton, BrodyLogo, BrodyMark, TextLink, brodyAsset } from "./ui";
import { QualifyModal } from "./qualify-modal";
import { VentureSection } from "./venture-section";

function StatCard({ value, label }: { value: string; label: string }) {
  return (
    <article className="stat-card" data-reveal>
      <strong>{value}</strong>
      <span>{label}</span>
    </article>
  );
}

export function SiteExperience({
  content,
  profile = null,
}: {
  content: SiteContent;
  profile?: Profile | null;
}) {
  const { settings, copy, ventureGroups, properties, testimonials } = content;
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeGroup, setActiveGroup] = useState(0);
  const [qualifyOpen, setQualifyOpen] = useState(false);

  useEffect(() => {
    if (profile) setProfileCookie(profile.slug, profile.ghlTags);
  }, [profile]);

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    document.documentElement.classList.add("is-ready");
    document.body.classList.add("reveal-ready");

    const revealElements = Array.from(
      document.querySelectorAll<HTMLElement>("[data-reveal]"),
    );
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.01 },
    );

    const showVisibleElements = () => {
      revealElements.forEach((el) => {
        if (el.classList.contains("is-visible")) return;

        const rect = el.getBoundingClientRect();

        if (rect.top < window.innerHeight * 1.08 && rect.bottom > -80) {
          el.classList.add("is-visible");
          observer.unobserve(el);
        } else {
          observer.observe(el);
        }
      });
    };

    const cursor = document.querySelector<HTMLElement>(".cursor-glow");
    let ticking = false;
    const handlePointer = (event: PointerEvent) => {
      if (!cursor || ticking || event.pointerType !== "mouse") return;
      ticking = true;
      requestAnimationFrame(() => {
        cursor.style.setProperty("--x", `${event.clientX}px`);
        cursor.style.setProperty("--y", `${event.clientY}px`);
        ticking = false;
      });
    };

    const handleScroll = () => {
      if (reduceMotion.matches) return;
      const y = window.scrollY;
      document.documentElement.style.setProperty(
        "--hero-parallax",
        `${Math.min(y * 0.055, 56)}px`,
      );
      document.documentElement.style.setProperty(
        "--portrait-parallax",
        `${Math.max(-42, Math.min(42, (y - window.innerHeight * 2) * -0.025))}px`,
      );
    };

    window.addEventListener("pointermove", handlePointer);
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", showVisibleElements);
    handleScroll();
    showVisibleElements();

    return () => {
      observer.disconnect();
      document.body.classList.remove("reveal-ready");
      window.removeEventListener("pointermove", handlePointer);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", showVisibleElements);
    };
  }, []);

  useEffect(() => {
    document.body.classList.toggle("menu-open", menuOpen);

    return () => {
      document.body.classList.remove("menu-open");
    };
  }, [menuOpen]);

  const selectedGroup = useMemo(
    () => Math.min(activeGroup, Math.max(ventureGroups.length - 1, 0)),
    [activeGroup, ventureGroups.length],
  );

  const openQualify = () => setQualifyOpen(true);

  return (
    <div className="site-shell">
      <div className="pageloader" aria-hidden="true">
        <div className="pageloader__bg" />
        <div className="pageloader__content">
          <p className="pageloader__one">Brody</p>
          <p className="pageloader__two">Billings</p>
        </div>
      </div>

      <div className="cursor-glow" aria-hidden="true" />

      <QualifyModal
        open={qualifyOpen}
        onClose={() => setQualifyOpen(false)}
        confirmationMessage={settings.confirmationMessage}
      />

      {profile?.welcome ? (
        <div className="profile-banner" data-reveal>
          <span className="mono">Prepared for {profile.name}</span>
          <p>{profile.welcome}</p>
        </div>
      ) : null}

      <main>
        <section className="hero" aria-labelledby="hero-title">
          <div className="hero__media">
            <img src={brodyAsset("brody-family.jpg")} alt="" />
          </div>
          <div className="hero__shade" />

          <header className="site-nav" data-reveal>
            <Link aria-label="Brody Billings home" className="site-nav__logo" href="/">
              <BrodyLogo />
            </Link>
            <nav className="site-nav__links" aria-label="Main navigation">
              {copy.nav.map((link) => (
                <TextLink key={link.label} {...link} />
              ))}
            </nav>
            <button
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              className="menu-toggle"
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
            >
              <span />
              <span />
            </button>
          </header>

          <div className={`mobile-menu ${menuOpen ? "is-open" : ""}`}>
            <div className="mobile-menu__brand">
              <BrodyLogo />
            </div>
            <nav aria-label="Mobile navigation">
              {copy.nav.map((link) => (
                <TextLink
                  key={link.label}
                  {...link}
                  onClick={() => setMenuOpen(false)}
                />
              ))}
            </nav>
            <div className="mobile-menu__next">
              <div>
                <span className="mono">Start here</span>
                <strong>Operations. Capital. AI.</strong>
              </div>
              <ActionButton
                variant="dark"
                onClick={() => {
                  setMenuOpen(false);
                  openQualify();
                }}
              >
                {settings.primaryCtaLabel}
              </ActionButton>
            </div>
          </div>

          <div className="hero__title" data-reveal>
            <p className="mono">{copy.hero.kicker}</p>
            <h1 id="hero-title">{copy.hero.title}</h1>
            <p>{copy.hero.subtitle}</p>
            <div className="hero__actions">
              <ActionButton onClick={openQualify}>
                {settings.primaryCtaLabel}
              </ActionButton>
              <ActionButton href="#ventures" variant="outline">
                View ventures
              </ActionButton>
            </div>
          </div>

          <div className="hero__signature" data-reveal>
            <span className="script-note">{copy.hero.scriptNote}</span>
            <p>{copy.hero.scriptText}</p>
          </div>

          <div className="hero__next-run" data-reveal>
            <div className="hero__next-main">
              <span className="mono">Active builder</span>
              <BrodyMark />
              <strong>{copy.hero.locationLabel}</strong>
              <span>{copy.hero.coords}</span>
            </div>
            <ActionButton href="#method" variant="dark">
              See the method
            </ActionButton>
          </div>
        </section>

        <section className="about section-pad" id="about">
          <div className="section-inner about__inner">
            <div className="section-kicker" data-reveal>
              <span>About</span>
              <span>A few words about me</span>
            </div>

            <h2 className="x-title" data-reveal>
              {copy.about.titleLines.map((line, index) => (
                <span key={line}>
                  {index > 0 ? <br /> : null}
                  {line}
                </span>
              ))}
            </h2>

            <div className="about__copy-wrap">
              <p className="section-copy" data-reveal>
                {copy.about.body}
              </p>
              <span className="script-note about__script" aria-hidden="true">
                {copy.about.script}
              </span>
            </div>

            <div className="stats-grid">
              {copy.stats.map((stat) => (
                <StatCard key={stat.label} {...stat} />
              ))}
            </div>

            <div className="focus-grid">
              {copy.focusAreas.map((area) => (
                <article className="focus-card" data-reveal key={area.title}>
                  <span className="mono">{area.title}</span>
                  <p>{area.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="method" id="method" aria-labelledby="method-title">
          <div className="method__background" aria-hidden="true">
            <img src={brodyAsset("brody-family.jpg")} alt="" />
          </div>
          <div className="method__gradient" />
          <div className="section-inner method__inner">
            <div className="method__header" data-reveal>
              <h2 className="display-title" id="method-title">
                {copy.method.titleLines.map((line, index) => (
                  <span key={line}>
                    {index > 0 ? <br /> : null}
                    {line}
                  </span>
                ))}
              </h2>
              <p>{copy.method.intro}</p>
            </div>

            <div className="method__cards" aria-label="Monument method" data-reveal>
              {copy.method.steps.map((step) => (
                <article className="method-card" key={step.eyebrow}>
                  <span className="mono">{step.eyebrow}</span>
                  <h3>{step.title}</h3>
                  <p>{step.text}</p>
                </article>
              ))}
            </div>

            <blockquote className="method__quote" data-reveal>
              <p>&quot;{copy.method.quote}&quot;</p>
            </blockquote>
          </div>
        </section>

        <section className="offers section-pad" id="offer">
          <div className="section-inner">
            <div className="offers__header" data-reveal>
              <p className="section-kicker">
                <span>Offer</span>
                <span>What Brody has to offer</span>
              </p>
              <h2>{copy.offers.heading}</h2>
            </div>

            <div className="offers__grid">
              {copy.offers.items.map((offer) => (
                <article
                  className={`offer-card offer-card--${offer.shape}`}
                  data-reveal
                  key={offer.title}
                >
                  <span className="offer-card__number">{offer.number}</span>
                  <h3>{offer.title}</h3>
                  <p>{offer.text}</p>
                </article>
              ))}
            </div>

            <div className="offers__cta" data-reveal>
              <ActionButton onClick={openQualify}>
                {settings.primaryCtaLabel}
              </ActionButton>
            </div>
          </div>
        </section>

        {ventureGroups.length > 0 ? (
          <section className="portfolio section-pad" id="ventures">
            <div className="section-inner">
              <div className="portfolio__header" data-reveal>
                <h2>
                  {copy.portfolio.titleLines.map((line, index) => (
                    <span key={line}>
                      {index > 0 ? <br /> : null}
                      {line}
                    </span>
                  ))}
                </h2>
                <p>{copy.portfolio.intro}</p>
              </div>

              <VentureSection
                groups={ventureGroups}
                activeGroup={selectedGroup}
                onSelectGroup={setActiveGroup}
                action={
                  <ActionButton onClick={openQualify}>
                    Discuss a business
                  </ActionButton>
                }
              />
            </div>
          </section>
        ) : null}

        {properties.length > 0 ? (
          <section className="properties section-pad" id="properties">
            <div className="section-inner">
              <div className="properties__header" data-reveal>
                <h2>{copy.properties.heading}</h2>
                <p>{copy.properties.intro}</p>
              </div>

              <div className="properties__grid">
                {properties.slice(0, 3).map((property) => (
                  <article className="property-card" data-reveal key={property.id}>
                    <span className="mono">{property.category}</span>
                    <div>
                      <h3>{property.title}</h3>
                      <p>{property.summary}</p>
                    </div>
                    <small>
                      {property.location} / {property.status}
                    </small>
                  </article>
                ))}
              </div>

              <div className="properties__callout" data-reveal>
                <span className="script-note">{copy.properties.calloutScript}</span>
                <div>
                  <p>{copy.properties.calloutText}</p>
                  <ActionButton href="/properties" variant="outline">
                    View all listings
                  </ActionButton>
                </div>
              </div>
            </div>
          </section>
        ) : null}

        {testimonials.length > 0 ? (
          <section className="proof section-pad">
            <div className="section-inner">
              <div className="proof__header" data-reveal>
                <p className="section-kicker">
                  <span>Friends and partners</span>
                  <span>What people say</span>
                </p>
                <h2>{copy.proof.heading}</h2>
              </div>

              <div className="proof__grid">
                {testimonials.map((testimonial, index) => (
                  <figure className="testimonial-card" data-reveal key={testimonial.id}>
                    <div className="testimonial-card__top">
                      <span className="mono">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span className="mono">In their words</span>
                    </div>
                    <blockquote>
                      <p>&quot;{testimonial.quote}&quot;</p>
                    </blockquote>
                    <figcaption className="testimonial-card__person">
                      <img
                        alt={testimonial.name}
                        src={brodyAsset(testimonial.image)}
                      />
                      <span className="testimonial-card__person-meta">
                        <cite>{testimonial.name}</cite>
                        <span className="script-note" aria-hidden="true">
                          {testimonial.name.split(" ")[0]}
                        </span>
                      </span>
                    </figcaption>
                  </figure>
                ))}
              </div>
            </div>
          </section>
        ) : null}

        <footer className="footer" id="contact">
          <div className="section-inner footer__inner">
            <div className="footer__nav" data-reveal>
              <nav aria-label="Footer navigation">
                {copy.nav.map((link) => (
                  <TextLink key={link.label} {...link} />
                ))}
              </nav>
              <BrodyLogo />
              <a
                className="footer__contact-link"
                href={`mailto:${settings.contactEmail}`}
              >
                {settings.contactEmail}
              </a>
            </div>

            <div className="footer__cta" data-reveal>
              <h2>{copy.footer.heading}</h2>
              <p>{copy.footer.text}</p>
              <div>
                <ActionButton onClick={openQualify}>
                  {settings.primaryCtaLabel}
                </ActionButton>
                <ActionButton
                  href={settings.monumentUrl}
                  external
                  variant="outline"
                >
                  Monument Solutions
                </ActionButton>
              </div>
            </div>

            <div className="footer__legal" data-reveal>
              <p>Copyright 2026. All rights reserved.</p>
              <p>Brody Billings / Monument Solutions / Mapleton, Utah</p>
              <a href={`mailto:${settings.contactEmail}`}>Email me</a>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
