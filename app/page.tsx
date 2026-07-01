"use client";

import { useEffect, useMemo, useState } from "react";
import { propertyListings } from "./property-listings";

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

const portfolioGroups = [
  {
    label: "Current Companies",
    kicker: "Systems and consulting",
    items: [
      {
        title: "Monument Solutions",
        type: "Operational intelligence",
        text: "An IT and marketing consulting firm focused on corporate infrastructure, technology adoption, cloud solutions, and AI-driven automation.",
        href: "https://www.monument.solutions",
      },
      {
        title: "MS AI Agents",
        type: "AI workflows",
        text: "Customizable AI agents for healthcare, hospitality, real estate, and office environments handling calls, intake, scheduling, and inquiries.",
      },
      {
        title: "Capital Bookkeeping Solutions",
        type: "Finance services",
        text: "Virtual bookkeeping for small businesses, including payroll, reporting, cash flow forecasting, forensic accounting, and QuickBooks integration.",
      },
      {
        title: "Arctic Peaks Water",
        type: "Water technology",
        text: "Part-ownership in a patented water-purification company serving residential, commercial, and industrial use cases.",
      },
    ],
  },
  {
    label: "Investments",
    kicker: "Capital and assets",
    items: [
      {
        title: "Commercial and Residential Real Estate",
        type: "Seller-financed properties",
        text: "Identifying high-potential properties, managing real estate investments, and structuring creative financing solutions for long-term value.",
      },
      {
        title: "Crypto Mining",
        type: "Digital asset operations",
        text: "A focus on automated mining technologies that improve efficiency, reduce operating costs, and support scalable systems.",
      },
    ],
  },
  {
    label: "Operating Experience",
    kicker: "Hands-on businesses",
    items: [
      {
        title: "Gas Stations and Travel Plaza",
        type: "Infrastructure",
        text: "Family-owned operations grew into an eight-figure business with more than 250 employees and recurring commercial accounts before sale.",
      },
      {
        title: "South Valley Packaging",
        type: "Business development",
        text: "Sales and client-relations work in co-packing, formulation, logistics, sports nutrition, and dietary supplement support.",
      },
      {
        title: "Subway Franchisee",
        type: "Food franchise",
        text: "Owned and operated multiple locations, applying operating discipline, customer service, and systems management.",
      },
      {
        title: "Arby's Franchisee",
        type: "Food franchise",
        text: "Led a quick-service franchise under a trusted national brand, supported by a live operations dashboard used daily.",
      },
      {
        title: "DonutNV",
        type: "Mobile dessert franchise",
        text: "Built a mobile dessert business around quality, guest experience, event energy, and operational excellence.",
      },
    ],
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
      { threshold: 0.16 },
    );

    revealElements.forEach((el) => {
      const rect = el.getBoundingClientRect();

      if (rect.top < window.innerHeight * 0.95 && rect.bottom > 0) {
        el.classList.add("is-visible");
      } else {
        observer.observe(el);
      }
    });

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
    handleScroll();

    return () => {
      observer.disconnect();
      document.body.classList.remove("reveal-ready");
      window.removeEventListener("pointermove", handlePointer);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    document.body.classList.toggle("menu-open", menuOpen);

    return () => {
      document.body.classList.remove("menu-open");
    };
  }, [menuOpen]);

  const currentGroup = useMemo(
    () => portfolioGroups[activeGroup],
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

            <h2 className="x-title" data-reveal>
              Entrepreneur.
              <br />
              Investor.
              <br />
              Systems builder.
            </h2>

            <div className="about__copy-wrap">
              <p className="section-copy" data-reveal>
                I am an entrepreneur and investor from Mapleton, Utah, with
                more than two decades of experience across import, distribution,
                consulting, retail, restaurants, real estate, and technology.
              </p>
              <span className="script-note about__script" aria-hidden="true">
                Build the system.
              </span>
            </div>

            <div className="stats-grid">
              {stats.map((stat) => (
                <StatCard key={stat.label} {...stat} />
              ))}
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

            <div className="portfolio__featured">
              <div className="portfolio-panel" data-reveal>
                <p className="mono">Explore</p>
                <div className="portfolio-panel__headings">
                  {portfolioGroups.map((group, index) => (
                    <button
                      className={index === activeGroup ? "is-active" : ""}
                      key={group.label}
                      type="button"
                      onClick={() => setActiveGroup(index)}
                      onFocus={() => setActiveGroup(index)}
                      onPointerEnter={() => setActiveGroup(index)}
                    >
                      {group.label}
                    </button>
                  ))}
                </div>
                <ActionButton href="#contact">
                  Discuss a business
                </ActionButton>
              </div>

              <div className="venture-list" data-reveal>
                <div className="venture-list__header">
                  <span className="mono">{currentGroup.kicker}</span>
                  <h3>{currentGroup.label}</h3>
                </div>
                <div className="venture-list__items">
                  {currentGroup.items.map((item) => (
                    <article className="venture-card" key={item.title}>
                      <span className="mono">{item.type}</span>
                      <h4>{item.title}</h4>
                      <p>{item.text}</p>
                      {item.href ? (
                        <a href={item.href} target="_blank" rel="noreferrer">
                          Visit site
                        </a>
                      ) : null}
                    </article>
                  ))}
                </div>
              </div>
            </div>
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
