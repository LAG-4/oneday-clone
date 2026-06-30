"use client";

import { useEffect, useMemo, useState } from "react";

const asset = (name: string) => `/dayone/assets/${name}`;

const buttonScribble =
  "M11.4537 22.3596C19.6545 18.1847 27.8552 14.0098 32.8344 11.6445C41.5581 7.50052 10.5956 39.1206 6.13386 45.1438C2.89568 49.5152 3.9942 49.3863 5.19398 49.025C6.39374 48.6638 7.66149 48.0741 16.6566 42.4134C25.6517 36.7528 42.3355 26.0392 51.4912 20.0762C60.6469 14.1132 61.7484 12.4942 62.1378 12.8874C62.5272 13.2807 62.0891 12.7872 55.478 21.125C48.8669 29.4627 36.0752 45.8928 29.3568 54.687C22.6384 63.4811 22.3809 64.1413 22.567 64.3494C22.8772 64.6964 42.6498 51.3989 42.9267 51.203C56.191 41.8144 67.6277 33.8285 81.2663 24.2328C94.9049 14.6371 97.8293 12.9711 99.9697 11.818C100.642 11.4558 105.373 8.65201 104.36 10.5163C103.993 11.1922 103.237 12.3518 94.5861 22.3596C85.935 32.3674 62.1378 61.3918 62.1378 61.3918C62.1378 61.3918 53.0608 71.5223 53.3949 72.0021C53.729 72.482 56.2351 70.9697 67.1706 62.6156C78.1062 54.2615 118.271 23.2751 121.489 24.184C124.707 25.093 95.9878 68.8273 94.5862 74.2402C93.1846 79.6531 124.396 46.4414 134.63 39.8584";

const navLinks = [
  { label: "Runs,", href: "#runs", aria: "runs" },
  { label: "Calendar,", href: "#calendar", aria: "community" },
  {
    label: "Shop,",
    href: "https://day-1.com/en/collections/frontpage",
    aria: "shop",
    external: true,
  },
  { label: "About", href: "#about", aria: "about" },
];

const featuredRuns = [
  {
    city: "Düsseldorf",
    day: "24",
    month: "02",
    start: "Provinciestraat 122, 2018",
    distance: "5.25 KM",
    href: "/runs/dusseldorf",
    map: "map-dusseldorf.png",
    route: "route-dusseldorf.svg",
  },
  {
    city: "Munich",
    day: "06",
    month: "03",
    start: "Goethestraße 16, 80336",
    distance: "6.50 KM",
    href: "/runs/munich",
    map: "map-munich.png",
    route: "route-munich.svg",
  },
];

const calendarRuns = [
  {
    city: "Cologne",
    day: "27",
    month: "08",
    start: "Osthallenstraße 20, 50679 Cologne",
    distance: "4.70 KM",
    href: "/runs/cologne",
  },
  {
    city: "Berlin",
    day: "18",
    month: "06",
    start: "Schönhauser Allee 13, 10119 Berlin",
    distance: "8.30 KM",
    href: "/runs/berlin",
  },
  {
    city: "Frankfurt",
    day: "22",
    month: "04",
    start: "Goethestraße 12, 60313 Frankfurt",
    distance: "7.20 KM",
    href: "/runs/frankfurt",
  },
  {
    city: "Munich",
    day: "06",
    month: "03",
    start: "Goethestraße 16, 80336",
    distance: "6.50 KM",
    href: "/runs/munich",
  },
  {
    city: "Düsseldorf",
    day: "24",
    month: "02",
    start: "Provinciestraat 122, 2018",
    distance: "5.25 KM",
    href: "/runs/dusseldorf",
  },
];

const categories = [
  {
    label: "Pants",
    image: "category-pants.png",
    href: "https://day-1.com/en/collections/pants",
  },
  {
    label: "Tops",
    image: "category-tops.webp",
    href: "https://day-1.com/en/collections/tops",
  },
  {
    label: "Thights",
    image: "category-tights.webp",
    href: "https://day-1.com/en/collections/tights-abd-leggings",
  },
  {
    label: "Gear",
    image: "category-gear.webp",
    href: "https://day-1.com/en/collections/accessoires",
  },
];

const products = [
  {
    name: "Performance Half-Zipper",
    price: "€79,90",
    image: "product-half-zipper.webp",
    href: "https://day-1.com/en/products/performance-half-zipper?variant=50617827393877",
  },
  {
    name: "Vest BLN Marathon Edition",
    price: "€44,90",
    image: "product-vest.webp",
    href: "https://day-1.com/en/products/performance-vest-bln-marathon-edition?_psq=Vest+BLN+Marathon+Edition&_v=1.0&variant=51375575531861",
  },
  {
    name: "Performance Longsleeve",
    price: "€64,90",
    image: "product-longsleeve.png",
    href: "https://day-1.com/en/products/performance-longsleeve?_psq=Performance+Longsleeve&_v=1.0&variant=50617874252117",
  },
  {
    name: "Compound T-Shirt",
    price: "€49,90",
    image: "product-tshirt.webp",
    href: "https://day-1.com/en/products/compound-t-shirt?_psq=Compound+T-Shirt&_v=1.0&variant=50617898172757",
  },
];

type ButtonProps = {
  children: React.ReactNode;
  href?: string;
  className?: string;
  variant?: "base" | "dark" | "newsletter";
  external?: boolean;
  type?: "button" | "submit";
};

function DayButton({
  children,
  href,
  className = "",
  variant = "base",
  external = false,
  type = "button",
}: ButtonProps) {
  const classes = `day-button day-button--${variant} ${className}`;
  const content = (
    <>
      <span className="day-button__bg" />
      <span className="day-button__inner">
        <span className="day-button__hover" aria-hidden="true">
          {children}
        </span>
        <span className="day-button__text">{children}</span>
        <svg
          aria-hidden="true"
          className="day-button__scribble"
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
  aria,
  external,
  onClick,
}: {
  label: string;
  href: string;
  aria?: string;
  external?: boolean;
  onClick?: () => void;
}) {
  return (
    <a
      aria-label={aria ?? label}
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

function RunScript({ className = "" }: { className?: string }) {
  return (
    <svg
      className={`run-script ${className}`}
      viewBox="0 0 66 32"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M32.4962 3.59985C32.4962 4.33585 32.0642 5.32785 31.2002 6.57585C30.3682 7.79185 28.8322 9.21586 26.5922 10.8479C24.3842 12.4799 21.3762 14.1599 17.5682 15.8879L16.4642 16.3679C16.3682 16.3999 16.3202 16.5279 16.3202 16.7519C18.0162 19.1199 19.4242 21.2799 20.5442 23.2319C21.6962 25.1839 22.4962 26.7679 22.9442 27.9839C23.3282 29.1359 23.5202 30.0799 23.5202 30.8159C23.5202 31.1359 23.4882 31.3439 23.4242 31.4399C23.3922 31.5679 23.3122 31.6319 23.1842 31.6319C22.9922 31.6319 22.8002 31.4079 22.6082 30.9599C21.4882 28.4319 20.0482 25.9359 18.2882 23.4719C16.5602 21.0079 14.8162 18.8319 13.0562 16.9439C12.2242 16.3679 11.8082 15.8879 11.8082 15.5039C11.9362 15.2159 12.2082 14.9759 12.6242 14.7839C13.0722 14.5599 13.5522 14.4159 14.0642 14.3519C14.4482 14.3519 14.8002 14.5279 15.1202 14.8799C15.2162 14.9759 15.2962 15.0239 15.3602 15.0239C15.4562 15.0239 15.5362 14.9919 15.6002 14.9279C19.0242 13.4879 22.0962 11.6959 24.8162 9.55185C27.5362 7.40785 29.2642 5.11985 30.0002 2.68785C30.0002 2.23985 29.7122 2.01585 29.1362 2.01585C27.2162 2.01585 24.8962 2.84785 22.1762 4.51186C19.4562 6.17585 16.7842 8.22385 14.1602 10.6559C12.0162 12.8319 9.98418 15.3439 8.06418 18.1919C6.14418 21.0399 4.52818 23.7919 3.21618 26.4479C2.54418 27.6639 2.16018 28.5759 2.06418 29.1839C1.90418 29.8559 1.69618 30.1919 1.44018 30.1919L1.34418 30.1439C0.448176 29.4719 0.000175774 28.6879 0.000175774 27.7919C0.000175774 26.6399 2.09618 23.1039 6.28818 17.1839C6.51218 16.8319 6.70418 16.5439 6.86418 16.3199C7.02418 16.0959 7.13618 15.9199 7.20018 15.7919C9.02418 12.7199 10.5442 9.98385 11.7602 7.58385C13.0082 5.18385 13.8882 3.27985 14.4002 1.87185C14.4962 1.61585 14.6562 1.48785 14.8802 1.48785C15.0082 1.48785 15.1202 1.51985 15.2162 1.58385C15.5042 1.77585 15.7442 2.04785 15.9362 2.39985C16.1282 2.71985 16.2242 3.10385 16.2242 3.55185C15.9362 4.41585 15.1842 5.91986 13.9682 8.06386C13.9042 8.19185 13.8722 8.30385 13.8722 8.39986C13.8722 8.49585 13.9042 8.54385 13.9682 8.54385C14.0322 8.54385 14.1442 8.46385 14.3042 8.30385C14.7842 7.82385 15.9362 6.89585 17.7602 5.51986C19.5842 4.14385 21.5202 2.87985 23.5682 1.72785C25.6162 0.575853 27.2962 -0.000146866 28.6082 -0.000146866C29.6322 -0.000146866 30.6722 0.559854 31.7282 1.67985C32.2402 2.22385 32.4962 2.86385 32.4962 3.59985ZM39.5211 16.6079C39.5211 16.7999 39.3291 17.1359 38.9451 17.6159C38.5611 18.0639 38.3051 18.3679 38.1771 18.5279C36.7051 20.6719 35.7611 22.2239 35.3451 23.1839C35.2811 23.4079 35.1851 23.5199 35.0571 23.5199C34.8971 23.5199 34.7851 23.4239 34.7211 23.2319C34.6571 23.0079 34.6251 22.7999 34.6251 22.6079C34.6251 22.0959 34.7691 21.4399 35.0571 20.6399L35.1051 20.5439C35.1051 20.4799 35.0731 20.4479 35.0091 20.4479C34.9451 20.4479 34.8811 20.4799 34.8171 20.5439C32.3531 22.5279 30.6571 23.7919 29.7291 24.3359C28.8331 24.8799 28.1611 25.1519 27.7131 25.1519C27.1371 25.1519 26.7371 24.8639 26.5131 24.2879C26.3211 23.7119 26.2251 23.1199 26.2251 22.5119C26.2251 21.3279 26.6091 20.0159 27.3771 18.5759C28.1451 17.1359 28.9611 15.8719 29.8251 14.7839C30.6891 13.6639 31.2811 12.9439 31.6011 12.6239C31.6971 12.5599 31.8251 12.5279 31.9851 12.5279C32.2411 12.5279 32.5131 12.6559 32.8011 12.9119C33.0891 13.1679 33.2331 13.5039 33.2331 13.9199C33.1691 14.0159 32.9771 14.2079 32.6571 14.4959C32.3691 14.7839 32.1131 15.0559 31.8891 15.3119C31.0571 16.2399 30.1771 17.4399 29.2491 18.9119C28.3531 20.3839 27.8251 21.6319 27.6651 22.6559C27.6651 22.9119 27.7931 23.0399 28.0491 23.0399C28.4331 23.0399 29.1531 22.7839 30.2091 22.2719C31.2651 21.7599 32.3851 21.0399 33.5691 20.1119C34.7851 19.1839 35.8571 18.1279 36.7851 16.9439C37.1051 16.4959 37.6651 16.2719 38.4651 16.2719C39.1691 16.2719 39.5211 16.3839 39.5211 16.6079ZM65.2483 18.0959C65.2483 18.7359 65.0563 19.1519 64.6723 19.3439C60.7043 21.5519 57.4883 23.1039 55.0243 23.9999C54.6723 24.1279 54.2403 24.1919 53.7283 24.1919C52.9283 24.1919 52.2563 23.9519 51.7123 23.4719C51.1683 22.9599 50.8963 22.4159 50.8963 21.8399C50.8963 21.5199 50.9443 21.1839 51.0403 20.8319C51.1683 20.4799 51.2323 20.2719 51.2323 20.2079C51.2323 20.0159 51.1523 19.9199 50.9923 19.9199C50.6083 19.9199 49.9843 20.2079 49.1203 20.7839C48.2883 21.3279 47.3923 22.0159 46.4323 22.8479C45.1843 23.9999 44.0803 24.8639 43.1203 25.4399C42.9603 25.5679 42.7523 25.6319 42.4963 25.6319C42.2083 25.6319 42.0003 25.5519 41.8723 25.3919C41.7443 25.2319 41.6803 24.9599 41.6803 24.5759C41.6803 24.2239 41.7283 23.8239 41.8243 23.3759C42.1443 21.9359 42.8003 20.2879 43.7923 18.4319C44.7843 16.5439 45.8883 14.7199 47.1043 12.9599C47.3283 12.5759 47.8243 12.3839 48.5923 12.3839C49.2963 12.3839 49.6483 12.4639 49.6483 12.6239C49.6483 12.7519 49.6163 12.8479 49.5523 12.9119C48.6883 14.2559 47.8723 15.4239 47.1043 16.4159C47.1043 16.4799 47.0403 16.6079 46.9123 16.7999C46.7843 16.9599 46.6403 17.1679 46.4803 17.4239C44.4963 20.2079 43.5043 22.0479 43.5043 22.9439C43.5043 23.1679 43.6003 23.2799 43.7923 23.2799C43.8563 23.2799 44.5123 22.7999 45.7603 21.8399C47.3923 20.5279 48.8483 19.4239 50.1283 18.5279C51.4083 17.6319 52.4003 17.1359 53.1043 17.0399C53.5203 17.1039 53.8723 17.2319 54.1603 17.4239C54.4483 17.5839 54.5923 17.8239 54.5923 18.1439C54.5923 18.3999 54.3523 18.8639 53.8723 19.5359C53.4883 20.0479 53.1843 20.5119 52.9603 20.9279C52.7683 21.3119 52.6723 21.7439 52.6723 22.2239C52.6723 22.4799 52.7203 22.6719 52.8163 22.7999C52.9443 22.9279 53.1683 22.9919 53.4883 22.9919C53.8403 22.9919 54.3363 22.8799 54.9763 22.6559C56.0003 22.2719 57.4723 21.5999 59.3923 20.6399C61.5363 19.4879 63.3603 18.6239 64.8643 18.0479C64.9603 17.9839 65.0403 17.9519 65.1043 17.9519C65.2003 17.9519 65.2483 17.9999 65.2483 18.0959Z"
        fill="currentColor"
      />
    </svg>
  );
}

function DateStack({ day, month }: { day: string; month: string }) {
  return (
    <span className="date-stack" aria-label={`${day}.${month}.`}>
      <span>{day}</span>
      <span>.</span>
      <span>{month}</span>
      <span>.</span>
    </span>
  );
}

function RunCard({ run }: { run: (typeof featuredRuns)[number] }) {
  return (
    <article className="run-card" data-hover data-reveal>
      <div className="run-card__map" aria-hidden="true">
        <img src={asset(run.map)} alt="" />
        <img className="run-card__route" src={asset(run.route)} alt="" />
      </div>
      <div className="run-card__header">
        <p className="mono">Upcoming run:</p>
        <DateStack day={run.day} month={run.month} />
        <h3>{run.city}</h3>
      </div>
      <div className="run-card__meta">
        <div>
          <p className="mono muted">Start:</p>
          <p>{run.start}</p>
        </div>
        <div>
          <p className="mono muted">Distance:</p>
          <p>{run.distance}</p>
        </div>
      </div>
      <div className="run-card__footer">
        <DayButton href={run.href} variant="dark">
          View Event Details
        </DayButton>
        <img src={asset("run-mark.svg")} alt="day one Run" />
      </div>
    </article>
  );
}

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState(0);

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
        `${Math.min(y * 0.06, 52)}px`,
      );
      document.documentElement.style.setProperty(
        "--calendar-parallax",
        `${Math.max(-60, Math.min(60, (y - window.innerHeight * 2.2) * -0.035))}px`,
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

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveCategory((current) => (current + 1) % categories.length);
    }, 4200);

    return () => window.clearInterval(timer);
  }, []);

  const currentCategory = useMemo(
    () => categories[activeCategory],
    [activeCategory],
  );

  return (
    <div className="site-shell">
      <div className="pageloader" aria-hidden="true">
        <div className="pageloader__bg" />
        <div className="pageloader__content">
          <p className="pageloader__one">one day</p>
          <img src={asset("logo-dayone.svg")} alt="" />
        </div>
      </div>

      <div className="cursor-glow" aria-hidden="true" />

      <main>
        <section className="hero" aria-labelledby="hero-title">
          <div className="hero__media">
            <video autoPlay muted loop playsInline preload="auto">
              <source src={asset("hero.mp4")} type="video/mp4" />
            </video>
          </div>
          <div className="hero__shade" />

          <header className="site-nav" data-reveal>
            <a aria-label="day one Run home" className="site-nav__logo" href="#">
              <img src={asset("logo-dayonerun.svg")} alt="" />
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
            <img src={asset("logo-dayone.svg")} alt="" />
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
                <span className="mono">Next Run</span>
                <strong>Düsseldorf</strong>
                <DateStack day="24" month="02" />
              </div>
              <DayButton href="/runs/dusseldorf" variant="dark">
                View Event Details
              </DayButton>
            </div>
          </div>

          <div className="hero__title" data-reveal>
            <h1 id="hero-title">One Pace, One Community. day one Run</h1>
            <img src={asset("h1.svg")} alt="" />
            <RunScript />
          </div>

          <div className="hero__signature" data-reveal>
            <img src={asset("signature.svg")} alt="" />
            <p>
              Arda Saatçi
              <span>Co-Founder of DayOne®</span>
            </p>
          </div>

          <div className="hero__next-run" data-reveal>
            <div className="hero__next-main">
              <span className="mono">Next Run</span>
              <img src={asset("run-icon.svg")} alt="" />
              <strong>Düsseldorf</strong>
              <DateStack day="24" month="02" />
            </div>
            <DayButton href="/runs/dusseldorf" variant="dark">
              Join the Run
            </DayButton>
          </div>
        </section>

        <section className="runs section-pad" id="runs">
          <div className="section-inner runs__inner">
            <h2 className="x-title" data-reveal>
              Uniting Runners.
              <br />
              City by City.
            </h2>

            <div className="runs__copy-wrap">
              <p className="section-copy" data-reveal>
                Join co-founder Alvaro for a series of community runs across
                Germany and beyond. 5-7km routes built for conversation,
                connection, and the simple joy of moving together.
              </p>
              <span className="script-note runs__script" aria-hidden="true">
                You vs You
              </span>
            </div>

            <div className="runs__badges" aria-hidden="true" data-reveal>
              <span>
                <img src={asset("runs-germany.svg")} alt="" />
                <img src={asset("runs-line.svg")} alt="" />
                <img src={asset("runs-beyond.svg")} alt="" />
              </span>
              <img src={asset("runs-you-vs-you.svg")} alt="" />
              <img src={asset("runs-every-day.svg")} alt="" />
            </div>

            <div className="runs__cards">
              {featuredRuns.map((run) => (
                <RunCard key={run.city} run={run} />
              ))}
            </div>
          </div>
        </section>

        <section className="calendar" id="calendar" aria-labelledby="calendar-title">
          <div className="calendar__background" aria-hidden="true">
            <img src={asset("calendar-arda.png")} alt="" />
          </div>
          <div className="calendar__gradient" />
          <div className="section-inner calendar__inner">
            <div className="calendar__header" data-reveal>
              <h2 className="display-title" id="calendar-title">
                Calendar
              </h2>
              <p>
                Join co-founder Alvaro for a series
                <br />
                of community runs across
                <br />
                Germany and beyond. 5-7km
                <br />
                routes built for conversation.
              </p>
            </div>

            <div className="calendar__track" aria-label="Calendar Runs">
              {calendarRuns.map((run) => (
                <article className="calendar-card" key={run.city} data-reveal>
                  <div className="calendar-card__top">
                    <h3>{run.city}</h3>
                    <DateStack day={run.day} month={run.month} />
                  </div>
                  <DayButton href={run.href} variant="dark">
                    View Details
                  </DayButton>
                  <div className="calendar-card__meta">
                    <div>
                      <p className="mono muted">Start:</p>
                      <p>{run.start}</p>
                    </div>
                    <div>
                      <p className="mono muted">Distance:</p>
                      <p>{run.distance}</p>
                    </div>
                  </div>
                  <span className="calendar-card__scribble" aria-hidden="true">
                    Join the Run
                  </span>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="mission section-pad" id="about">
          <div className="section-inner">
            <div className="mission__header" data-reveal>
              <h3>Our Mission</h3>
              <h2>
                Every day is day one®. You are not bound by what you were
                yesterday; every morning, you get to decide who you are. So,
                what will it be today, &apos;one day&apos; or day one®?
              </h2>
            </div>

            <div className="mission__gallery">
              <figure className="mission__image mission__image--large" data-reveal>
                <img src={asset("mission-gallery-left.png")} alt="" />
              </figure>
              <figure className="mission__image mission__image--small" data-reveal>
                <img src={asset("mission-gallery-card.png")} alt="" />
                <figcaption>
                  <span>Find your Run <strong>day one®</strong></span>
                  <DayButton href="#calendar">Join the Run</DayButton>
                </figcaption>
              </figure>
            </div>
          </div>
        </section>

        <section className="gear section-pad">
          <div className="section-inner">
            <div className="gear__header" data-reveal>
              <h2>
                May our performance attire
                <br />
                serve as a call to embrace every
                <br />
                challenge you face and push
                <br />
                your boundaries to a new level.
              </h2>
              <p>
                <span className="script-note">Gear Up</span>
                <span>Performance Apparel</span>
              </p>
            </div>

            <div className="gear__featured">
              <a
                className="feature-product"
                data-reveal
                href="https://day-1.com/en/products/performance-windbreaker?_psq=wind&_v=1.0&variant=49404648587605"
                target="_blank"
                rel="noreferrer"
              >
                <span>
                  Performance Windbreaker
                  <small>€199,90</small>
                </span>
                <img src={asset("product-windbreaker.png")} alt="" />
                <strong>Bestseller</strong>
              </a>

              <div className="category-panel" data-reveal>
                <div className="category-panel__image">
                  <img
                    key={currentCategory.image}
                    src={asset(currentCategory.image)}
                    alt=""
                  />
                </div>
                <p>Popular Categories</p>
                <div className="category-panel__headings">
                  {categories.map((category, index) => (
                    <button
                      className={index === activeCategory ? "is-active" : ""}
                      key={category.label}
                      type="button"
                      onClick={() => setActiveCategory(index)}
                      onMouseEnter={() => setActiveCategory(index)}
                    >
                      {category.label}
                    </button>
                  ))}
                </div>
                <DayButton href={currentCategory.href} external>
                  Shop {currentCategory.label}
                </DayButton>
              </div>
            </div>

            <div className="product-row">
              {products.map((product) => (
                <a
                  className="product-card"
                  data-reveal
                  href={product.href}
                  key={product.name}
                  target="_blank"
                  rel="noreferrer"
                >
                  <span>
                    {product.name}
                    <small>{product.price}</small>
                  </span>
                  <img src={asset(product.image)} alt="" />
                </a>
              ))}
            </div>
          </div>
        </section>

        <footer className="footer">
          <div className="section-inner footer__inner">
            <div className="footer__nav" data-reveal>
              <nav aria-label="Footer navigation">
                {navLinks.map((link) => (
                  <TextLink key={link.label} {...link} />
                ))}
              </nav>
              <img src={asset("logo-small.svg")} alt="" />
              <a
                className="footer__insta"
                href="https://www.instagram.com/day1"
                target="_blank"
                rel="noreferrer"
              >
                <img src={asset("instagram.svg")} alt="" />
                @day1
              </a>
            </div>

            <div className="footer__cta" data-reveal>
              <h2>Ready?</h2>
              <div>
                <img src={asset("logo-dayone-footer.svg")} alt="day one" />
                <RunScript />
              </div>
              <DayButton href="#calendar">Join the Run</DayButton>
            </div>

            <div className="footer__newsletter" data-reveal>
              <p>
                Join the day one®
                <br />
                community for free!
              </p>
              <p>
                Sign up now to get exclusive early access for future drops,
                important updates, and behind-the-scenes insights!
              </p>
              <form>
                <label className="sr-only" htmlFor="email">
                  Your email
                </label>
                <input id="email" name="email" placeholder="Your email..." type="email" />
                <DayButton variant="newsletter" type="submit">
                  Signup
                </DayButton>
              </form>
            </div>

            <div className="footer__legal" data-reveal>
              <p>© 2026, day one®</p>
              <nav aria-label="Legal links">
                <TextLink
                  href="https://day-1.com/en/pages/datenschutzerklarung"
                  label="Privacy Policy"
                  external
                />
                <TextLink
                  href="https://day-1.com/en/pages/agb"
                  label="T&Cs"
                  external
                />
              </nav>
              <div>
                <a href="mailto:support@day-1.com">support@day-1.com</a>
                <button type="button">Site Credits</button>
              </div>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
