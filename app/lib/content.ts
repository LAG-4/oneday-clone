import localSiteContent from "../data/site-content.json";
import localVentures from "../data/ventures.json";
import localProperties from "../data/properties.json";
import localTestimonials from "../data/testimonials.json";
import localProfiles from "../data/profiles.json";
import { fetchCustomValues, ghlConfigured } from "./ghl";
import type {
  Profile,
  Property,
  SiteContent,
  SiteCopy,
  SiteSettings,
  Testimonial,
  VentureGroup,
} from "./content-types";

/**
 * Content resolution: local JSON files are the defaults; GoHighLevel
 * "Custom Values" override them when the account is connected.
 *
 * Create these custom values in GHL (Settings → Custom Values), each holding
 * a JSON document with the same shape as the matching file in `app/data/`:
 *
 *   Website Content JSON       → app/data/site-content.json
 *   Website Ventures JSON      → app/data/ventures.json
 *   Website Properties JSON    → app/data/properties.json
 *   Website Testimonials JSON  → app/data/testimonials.json
 *   Website Profiles JSON      → app/data/profiles.json
 *
 * Name matching ignores case and punctuation, so "website_ventures_json"
 * works too. Content is cached for 5 minutes; POST /api/revalidate with the
 * REVALIDATE_SECRET busts it immediately (wire that into a GHL workflow to
 * get instant publishes).
 */

const CUSTOM_VALUE_KEYS = {
  content: "websitecontentjson",
  ventures: "websiteventuresjson",
  properties: "websitepropertiesjson",
  testimonials: "websitetestimonialsjson",
  profiles: "websiteprofilesjson",
} as const;

const normalizeName = (name: string) => name.toLowerCase().replace(/[^a-z0-9]/g, "");

async function ghlOverride<T>(key: string): Promise<T | null> {
  if (!ghlConfigured()) return null;

  const values = await fetchCustomValues();
  const match = values.find((value) => normalizeName(value.name) === key);
  if (!match?.value?.trim()) return null;

  try {
    return JSON.parse(match.value) as T;
  } catch {
    console.warn(`GHL custom value "${match.name}" is not valid JSON; using local fallback`);
    return null;
  }
}

const sortByOrder = <T extends { order: number }>(items: T[]) =>
  [...items].sort((a, b) => a.order - b.order);

const normalizeVentureGroups = (groups: VentureGroup[]): VentureGroup[] =>
  sortByOrder(groups)
    .filter((group) => !group.hidden)
    .map((group) => ({
      ...group,
      items: sortByOrder(group.items).filter((venture) => !venture.hidden),
    }))
    .filter((group) => group.items.length > 0);

export async function getVentureGroups(): Promise<VentureGroup[]> {
  const override = await ghlOverride<{ groups: VentureGroup[] }>(CUSTOM_VALUE_KEYS.ventures);
  const groups = override?.groups ?? (localVentures as { groups: VentureGroup[] }).groups;
  return normalizeVentureGroups(groups);
}

export async function getProperties(): Promise<Property[]> {
  const override = await ghlOverride<{ properties: Property[] }>(CUSTOM_VALUE_KEYS.properties);
  const properties = override?.properties ?? (localProperties as { properties: Property[] }).properties;
  return sortByOrder(properties).filter((property) => !property.hidden);
}

export async function getTestimonials(): Promise<Testimonial[]> {
  const override = await ghlOverride<{ testimonials: Testimonial[] }>(
    CUSTOM_VALUE_KEYS.testimonials,
  );
  const testimonials =
    override?.testimonials ?? (localTestimonials as { testimonials: Testimonial[] }).testimonials;
  return sortByOrder(testimonials).filter((testimonial) => !testimonial.hidden);
}

export async function getProfiles(): Promise<Profile[]> {
  const override = await ghlOverride<{ profiles: Profile[] }>(CUSTOM_VALUE_KEYS.profiles);
  const profiles = override?.profiles ?? (localProfiles as { profiles: Profile[] }).profiles;
  return profiles.filter((profile) => !profile.hidden);
}

export async function getProfile(slug: string): Promise<Profile | null> {
  const profiles = await getProfiles();
  return profiles.find((profile) => profile.slug.toLowerCase() === slug.toLowerCase()) ?? null;
}

export async function getSiteContent(): Promise<SiteContent> {
  const override = await ghlOverride<{ settings: SiteSettings; copy: SiteCopy }>(
    CUSTOM_VALUE_KEYS.content,
  );
  const base = localSiteContent as { settings: SiteSettings; copy: SiteCopy };

  const [ventureGroups, properties, testimonials] = await Promise.all([
    getVentureGroups(),
    getProperties(),
    getTestimonials(),
  ]);

  return {
    settings: { ...base.settings, ...override?.settings },
    copy: { ...base.copy, ...override?.copy },
    ventureGroups,
    properties,
    testimonials,
  };
}

/** Apply a personalization profile's filters/overrides to the site content. */
export function applyProfile(content: SiteContent, profile: Profile): SiteContent {
  const ventureGroups = profile.ventureGroupIds?.length
    ? content.ventureGroups.filter((group) => profile.ventureGroupIds?.includes(group.id))
    : content.ventureGroups;

  const testimonials = profile.testimonialIds?.length
    ? content.testimonials.filter((testimonial) =>
        profile.testimonialIds?.includes(testimonial.id),
      )
    : content.testimonials;

  return {
    ...content,
    settings: {
      ...content.settings,
      primaryCtaLabel: profile.ctaLabel ?? content.settings.primaryCtaLabel,
    },
    copy: {
      ...content.copy,
      hero: {
        ...content.copy.hero,
        title: profile.headline ?? content.copy.hero.title,
        subtitle: profile.subheadline ?? content.copy.hero.subtitle,
      },
    },
    ventureGroups,
    properties: profile.showProperties ? content.properties : [],
    testimonials,
  };
}
