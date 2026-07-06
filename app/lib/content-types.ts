export type VentureStatus = "active" | "past" | "planned";

export type Venture = {
  id: string;
  name: string;
  category: string;
  status: VentureStatus;
  logo: string | null;
  description: string;
  website: string | null;
  images: string[];
  cta: string | null;
  tags: string[];
  featured: boolean;
  hidden: boolean;
  order: number;
};

export type VentureGroup = {
  id: string;
  label: string;
  kicker: string;
  status: VentureStatus;
  order: number;
  hidden: boolean;
  items: Venture[];
};

export type Property = {
  id: string;
  title: string;
  category: string;
  status: string;
  location: string;
  price: string;
  summary: string;
  details: string[];
  images: string[];
  hidden: boolean;
  order: number;
};

export type Testimonial = {
  id: string;
  quote: string;
  name: string;
  image: string;
  hidden: boolean;
  order: number;
};

export type Profile = {
  slug: string;
  name: string;
  company: string | null;
  /** Short banner line, e.g. "This workspace was prepared for you." */
  welcome: string | null;
  /** Overrides the hero headline when set. */
  headline: string | null;
  /** Overrides the hero subtitle when set. */
  subheadline: string | null;
  /** Overrides the primary CTA label when set. */
  ctaLabel: string | null;
  /** Restrict which venture groups show; null/empty = all. */
  ventureGroupIds: string[] | null;
  showProperties: boolean;
  /** Restrict which testimonials show; null/empty = all. */
  testimonialIds: string[] | null;
  /** Extra GHL tags applied when this visitor submits any form. */
  ghlTags: string[];
  hidden: boolean;
};

export type SiteSettings = {
  siteName: string;
  contactEmail: string;
  monumentUrl: string;
  primaryCtaLabel: string;
  confirmationMessage: string;
};

export type SiteCopy = {
  nav: { label: string; href: string }[];
  hero: {
    kicker: string;
    title: string;
    subtitle: string;
    scriptNote: string;
    scriptText: string;
    locationLabel: string;
    coords: string;
  };
  stats: { value: string; label: string }[];
  focusAreas: { title: string; text: string }[];
  about: {
    titleLines: string[];
    body: string;
    script: string;
  };
  method: {
    titleLines: string[];
    intro: string;
    steps: { eyebrow: string; title: string; text: string }[];
    quote: string;
  };
  offers: {
    heading: string;
    items: { number: string; title: string; shape: string; text: string }[];
  };
  portfolio: {
    titleLines: string[];
    intro: string;
  };
  properties: {
    heading: string;
    intro: string;
    calloutScript: string;
    calloutText: string;
  };
  proof: {
    heading: string;
  };
  footer: {
    heading: string;
    text: string;
  };
};

export type SiteContent = {
  settings: SiteSettings;
  copy: SiteCopy;
  ventureGroups: VentureGroup[];
  properties: Property[];
  testimonials: Testimonial[];
};
