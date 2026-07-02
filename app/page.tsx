"use client";

import { useEffect, useMemo, useState } from "react";
import { VentureSection } from "./components/venture-section";
import { propertyListings } from "./property-listings";
import { ventureGroups } from "./data/ventures";

const brodyAsset = (name: string) => `/brody/assets/${name}`;

const buttonScribble =
  "M11.4537 22.3596C19.6545 18.1847 27.8552 14.0098 32.8344 11.6445C41.5581 7.50052 10.5956 39.1206 6.13386 45.1438C2.89568 49.5152 3.9942 49.3863 5.19398 49.025C6.39374 48.6638 7.66149 48.0741 16.6566 42.4134C25.6517 36.7528 42.3355 26.0392 51.4912 20.0762C60.6469 14.1132 61.7484 12.4942 62.1378 12.8874C62.5272 13.2807 62.0891 12.7872 55.478 21.125C48.8669 29.4627 36.0752 45.8928 29.3568 54.687C22.6384 63.4811 22.3809 64.1413 22.567 64.3494C22.8772 64.6964 42.6498 51.3989 42.9267 51.203C56.191 41.8144 67.6277 33.8285 81.2663 24.2328C94.9049 14.6371 97.8293 12.9711 99.9697 11.818C100.642 11.4558 105.373 8.65201 104.36 10.5163C103.993 11.1922 103.237 12.3518 94.5861 22.3596C85.935 32.3674 62.1378 61.3918 62.1378 61.3918C62.1378 61.3918 53.0608 71.5223 53.3949 72.0021C53.729 72.482 56.2351 70.9697 67.1706 62.6156C78.1062 54.2615 118.271 23.2751 121.489 24.184C124.707 25.093 95.9878 68.8273 94.5862 74.2402C93.1846 79.6531 124.396 46.4414 134.63 39.8584";

const navLinks = [
  { label: "About,", href: "/#about" },
  { label: "Method,", href: "/#method" },
  { label: "Ventures,", href: "/#ventures" },
  { label: "Properties,", href: "/properties" },
  { label: "Contact", href: "/#contact" },
];

const stats = [
  { value: "20+", label: "years building" },
  { value: "13", label: "businesses across the portfolio" },
  { value: "250", label: "employees before sale" },
  { value: "UT", label: "Mapleton-based builder" },
];

const focusAreas = [
  {
    title: "Operations",
    text: "I organize the moving parts so owners can see where time, service, reporting, and accountability are leaking.",
  },
  {
    title: "Finance",
    text: "Capital efficiency, cash flow clarity, and financial analysis that support better operating decisions.",
  },
  {
    title: "AI Execution",
    text: "Practical AI for calls, intake, onboarding, scheduling, customer engagement, and decision support.",
  },
  {
    title: "Strategy",
    text: "Business coaching, marketing consulting, process improvement, and executive-level operating clarity.",
  },
];

const methodSteps = [
  {
    eyebrow: "Visibility",
    title: "Find the real constraint.",
    text: "The audit starts with leadership, communication, systems, customer experience, and culture before recommending software or spend.",
  },
  {
    eyebrow: "Intelligence",
    title: "Turn symptoms into signal.",
    text: "Financial analysis, risk management, and operational review clarify what is actually preventing growth.",
  },
  {
    eyebrow: "Action",
    title: "Build the operating moves.",
    text: "The diagnosis becomes practical changes that improve accountability, cash flow, execution, and team communication.",
  },
  {
    eyebrow: "Hermes",
    title: "Embed AI into the workflow.",
    text: "Automation is deployed inside the real business process so AI becomes an accelerator instead of an experiment.",
  },
];

const offers = [
  {
    number: "01",
    title: "Finance",
    shape: "ledger",
    text: "Help founder-led companies use capital more efficiently so they can scale without burning cash or taking unnecessary risk.",
  },
  {
    number: "02",
    title: "Strategy",
    shape: "compass",
    text: "Support business strategy, marketing decisions, process improvement, and executive operating clarity.",
  },
  {
    number: "03",
    title: "AI",
    shape: "network",
    text: "Explore practical AI use cases for customer engagement, call centers, automation, decision-making, and lower overhead.",
  },
  {
    number: "04",
    title: "Automation",
    shape: "flow",
    text: "Automate sales, marketing, customer service, and repetitive workflows so the team stays focused on revenue-producing work.",
  },
];

const testimonials = [
  {
    quote:
      "Brody is a rigorous businessman and a genuine, caring partner who builds lasting systems and value for his associates.",
    name: "Massimo Sahin",
    image: "massimo.jpeg",
  },
  {
    quote:
      "Monument Solutions' structured alignment guided us through a seamless operational scaling transition.",
    name: "Trent Scott",
    image: "trent.png",
  },
];

type ButtonProps = {
  children: React.ReactNode;
  href?: string;
  className?: string;
  variant?: "base" | "dark" | "outline";
  external?: boolean;
  type?: "button" | "submit";
};

function ActionButton({
  children,
  href,
  className = "",
  variant = "base",
  external = false,
  type = "button",
}: ButtonProps) {
  const classes = `action-button action-button--${variant} ${className}`;
  const content = (
    <>
      <span className="action-button__bg" />
      <span className="action-button__inner">
        <span className="action-button__hover" aria-hidden="true">
          {children}
        </span>
        <span className="action-button__text">{children}</span>
        <svg
          aria-hidden="true"
          className="action-button__scribble"
          viewBox="0 0 139 85"
          preserveAspectRatio="none"
        >
          <path d={buttonScribble} />
        </svg>
      </span>
    </>
  );

  if (href) {
    return (
      <a
        className={classes}
        href={href}
        target={external ? "_blank" : undefined}
        rel={external ? "noreferrer" : undefined}
      >
        {content}
      </a>
    );
  }

  return (
    <button className={classes} type={type}>
      {content}
    </button>
  );
}

function TextLink({
  label,
  href,
  external,
  onClick,
}: {
  label: string;
  href: string;
  external?: boolean;
  onClick?: () => void;
}) {
  return (
    <a
      className="text-draw"
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noreferrer" : undefined}
      onClick={onClick}
    >
      <span>{label}</span>
      <span className="text-draw__line" aria-hidden="true" />
    </a>
  );
}

function BrodyLogo({ className = "" }: { className?: string }) {
  return (
    <img
      alt="Brody Billings"
      className={`brody-logo ${className}`}
      src={brodyAsset("logo.png")}
    />
  );
}

function BrodyMark({ className = "" }: { className?: string }) {
  return (
    <span className={`brody-mark ${className}`} aria-hidden="true">
      <img alt="" src={brodyAsset("logo.png")} />
    </span>
  );
}

function StatCard({ value, label }: { value: string; label: string }) {
  return (
    <article className="stat-card" data-reveal>
      <strong>{value}</strong>
      <span>{label}</span>
    </article>
  );
}

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeGroup, setActiveGroup] = useState(0);

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
    [activeGroup],
  );

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

      <main>
        <section className="hero" aria-labelledby="hero-title">
          <div className="hero__media">
            <img src={brodyAsset("brody-family.jpg")} alt="" />
          </div>
          <div className="hero__shade" />

          <header className="site-nav" data-reveal>
            <a aria-label="Brody Billings home" className="site-nav__logo" href="#">
              <BrodyLogo />
            </a>
            <nav className="site-nav__links" aria-label="Main navigation">
              {navLinks.map((link) => (
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
              {navLinks.map((link) => (
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
              <ActionButton href="mailto:brody@monument.solutions" variant="dark">
                Start the conversation
              </ActionButton>
            </div>
          </div>

          <div className="hero__title" data-reveal>
            <p className="mono">Monument Solutions / Mapleton, Utah</p>
            <h1 id="hero-title">Brody Billings</h1>
            <p>
              Entrepreneur, investor, and systems builder helping founder-led
              companies find the constraint and build the system around it.
            </p>
            <div className="hero__actions">
              <ActionButton href="mailto:brody@monument.solutions">
                Start the conversation
              </ActionButton>
              <ActionButton href="#ventures" variant="outline">
                View ventures
              </ActionButton>
            </div>
          </div>

          <div className="hero__signature" data-reveal>
            <span className="script-note">Builder before advisor.</span>
            <p>
              I build, invest in, and improve businesses with operating
              discipline, capital clarity, and practical systems.
            </p>
          </div>

          <div className="hero__next-run" data-reveal>
            <div className="hero__next-main">
              <span className="mono">Active builder</span>
              <BrodyMark />
              <strong>Mapleton, UT</strong>
              <span>40.1305 N</span>
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

            <div className="about__grid">
              <div className="about__lead" data-reveal>
                <h2>
                  Entrepreneur.
                  <br />
                  Investor.
                  <br />
                  Systems builder.
                </h2>
                <p>
                  I work with founder-led companies where operations, capital,
                  technology, and leadership all have to move together.
                </p>
              </div>

              <aside className="about__note" data-reveal>
                <span className="script-note">Build the system.</span>
                <p>
                  Based in Mapleton, Utah, I bring more than two decades of
                  hands-on experience across import, distribution, consulting,
                  retail, restaurants, real estate, and technology.
                </p>
                <ActionButton href="#method" variant="outline">
                  See the method
                </ActionButton>
              </aside>

              <div className="stats-grid">
                {stats.map((stat) => (
                  <StatCard key={stat.label} {...stat} />
                ))}
              </div>

              <div className="about__focus">
                <div className="about__focus-heading" data-reveal>
                  <span className="mono">Where I help</span>
                  <p>
                    The useful work is usually practical: make the numbers
                    clearer, tighten execution, and put better systems around
                    the team.
                  </p>
                </div>
                <div className="focus-grid">
                  {focusAreas.map((area) => (
                    <article className="focus-card" data-reveal key={area.title}>
                      <span className="mono">{area.title}</span>
                      <p>{area.text}</p>
                    </article>
                  ))}
                </div>
              </div>
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
                Operational
                <br />
                Intelligence
              </h2>
              <p>
                Monument Solutions helps organizations understand what is
                actually preventing growth before recommending technology,
                hiring, or process change.
              </p>
            </div>

            <div className="method__cards" aria-label="Monument method" data-reveal>
              {methodSteps.map((step) => (
                <article className="method-card" key={step.eyebrow}>
                  <span className="mono">{step.eyebrow}</span>
                  <h3>{step.title}</h3>
                  <p>{step.text}</p>
                </article>
              ))}
            </div>

            <blockquote className="method__quote" data-reveal>
              <p>
                &quot;Technology can accelerate progress, but people create it. If
                leadership, communication, and accountability improve, AI
                becomes much more valuable.&quot;
              </p>
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
              <h2>
                Scaling founder-led businesses through smart automation,
                strategic outsourcing, capital efficiency, and AI-powered
                innovation.
              </h2>
            </div>

            <div className="offers__grid">
              {offers.map((offer) => (
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
          </div>
        </section>

        <section className="portfolio section-pad" id="ventures">
          <div className="section-inner">
            <div className="portfolio__header" data-reveal>
              <h2>
                My Portfolio
                <br />
                and Operating Work.
              </h2>
              <p>
                The businesses, investments, and operating experience behind the
                way I think about systems, capital, customer service, and
                execution.
              </p>
            </div>

            <VentureSection
              activeGroup={selectedGroup}
              groups={ventureGroups}
              onSelectGroup={setActiveGroup}
              action={
                <ActionButton href="#contact">
                  Discuss a business
                </ActionButton>
              }
            />
          </div>
        </section>

        <section className="properties section-pad" id="properties">
          <div className="section-inner">
            <div className="properties__header" data-reveal>
              <h2>Real Estate</h2>
              <p>
                Commercial, residential, and seller-financed properties shaped
                by market analysis, creative deal structure, and long-term
                operating value.
              </p>
            </div>

            <div className="properties__grid">
              {propertyListings.slice(0, 3).map((property) => (
                <article className="property-card" data-reveal key={property.title}>
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
              <span className="script-note">Creative structure.</span>
              <div>
                <p>
                  I look for opportunities where better structure, clearer
                  operations, and flexible financing can help both sides reach a
                  practical outcome.
                </p>
                <ActionButton href="/properties" variant="outline">
                  View all listings
                </ActionButton>
              </div>
            </div>
          </div>
        </section>

        <section className="proof section-pad">
          <div className="section-inner">
            <div className="proof__header" data-reveal>
              <p className="section-kicker">
                <span>Friends and partners</span>
                <span>What people say</span>
              </p>
              <h2>
                A practical builder with a people-first view of how businesses
                actually improve.
              </h2>
            </div>

            <div className="proof__grid">
              {testimonials.map((testimonial) => (
                <blockquote className="testimonial-card" data-reveal key={testimonial.name}>
                  <div className="testimonial-card__person">
                    <img
                      alt={testimonial.name}
                      src={brodyAsset(testimonial.image)}
                    />
                    <cite>{testimonial.name}</cite>
                  </div>
                  <p>&quot;{testimonial.quote}&quot;</p>
                </blockquote>
              ))}
            </div>
          </div>
        </section>

        <footer className="footer" id="contact">
          <div className="section-inner footer__inner">
            <div className="footer__nav" data-reveal>
              <nav aria-label="Footer navigation">
                {navLinks.map((link) => (
                  <TextLink key={link.label} {...link} />
                ))}
              </nav>
              <BrodyLogo />
              <a className="footer__contact-link" href="mailto:brody@monument.solutions">
                brody@monument.solutions
              </a>
            </div>

            <div className="footer__cta" data-reveal>
              <h2>Work with me.</h2>
              <p>
                Send the context for a business, property, operating challenge,
                or AI opportunity. I will review it and respond with a practical
                next step.
              </p>
              <div>
                <ActionButton href="mailto:brody@monument.solutions">
                  Start inquiry
                </ActionButton>
                <ActionButton
                  href="https://www.monument.solutions"
                  external
                  variant="outline"
                >
                  Monument Solutions
                </ActionButton>
              </div>
            </div>

            <div className="footer__legal" data-reveal>
              <p>Copyright 2024. All rights reserved.</p>
              <p>Brody Billings / Monument Solutions / Mapleton, Utah</p>
              <a href="mailto:brody@monument.solutions">Email me</a>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
