import localSiteContent from "../data/site-content.json";
import localVentures from "../data/ventures.json";
import localProperties from "../data/properties.json";
import localTestimonials from "../data/testimonials.json";
import localProfiles from "../data/profiles.json";
import { fetchCustomValues, ghlConfigured, type GhlCustomValue } from "./ghl";
import type {
  Profile,
  Property,
  SiteContent,
  SiteCopy,
  SiteSettings,
  Testimonial,
  VentureGroup,
  VentureStatus,
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
 * works too. Content pages fetch GHL fresh on each request so saved edits
 * appear on the next page refresh.
 */

const CUSTOM_VALUE_KEYS = {
  content: "websitecontentjson",
  ventures: "websiteventuresjson",
  properties: "websitepropertiesjson",
  testimonials: "websitetestimonialsjson",
  profiles: "websiteprofilesjson",
} as const;

const normalizeName = (name: string) => name.toLowerCase().replace(/[^a-z0-9]/g, "");

type GhlValueLookup = Map<string, GhlCustomValue>;

async function ghlValueLookup(): Promise<GhlValueLookup | null> {
  if (!ghlConfigured()) return null;

  const values = await fetchCustomValues();
  return new Map(values.map((value) => [normalizeName(value.name), value]));
}

function ghlJsonOverride<T>(lookup: GhlValueLookup | null, key: string): T | null {
  const match = lookup?.get(key);
  if (!match?.value?.trim()) return null;

  try {
    return JSON.parse(match.value) as T;
  } catch {
    console.warn(`GHL custom value "${match.name}" is not valid JSON; using local fallback`);
    return null;
  }
}

const clone = <T>(value: T): T => JSON.parse(JSON.stringify(value)) as T;

const flatValue = (lookup: GhlValueLookup | null, names: string | string[]) => {
  const candidates = Array.isArray(names) ? names : [names];
  for (const name of candidates) {
    const value = lookup?.get(normalizeName(name))?.value;
    if (typeof value === "string" && value.trim()) return value.trim();
  }
  return null;
};

const flatText = (
  lookup: GhlValueLookup | null,
  names: string | string[],
  fallback: string,
) => flatValue(lookup, names) ?? fallback;

const flatNullableText = (
  lookup: GhlValueLookup | null,
  names: string | string[],
  fallback: string | null,
) => {
  const value = flatValue(lookup, names);
  if (!value) return fallback;
  if (["none", "null", "n/a", "na"].includes(value.toLowerCase())) return null;
  return value;
};

const flatNumber = (
  lookup: GhlValueLookup | null,
  names: string | string[],
  fallback: number,
) => {
  const value = flatValue(lookup, names);
  if (!value) return fallback;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const flatBoolean = (lookup: GhlValueLookup | null, names: string | string[]) => {
  const value = flatValue(lookup, names)?.toLowerCase();
  if (!value) return null;
  if (["1", "true", "yes", "y", "on", "show", "shown", "visible"].includes(value)) {
    return true;
  }
  if (["0", "false", "no", "n", "off", "hide", "hidden"].includes(value)) {
    return false;
  }
  return null;
};

const flatList = (
  lookup: GhlValueLookup | null,
  names: string | string[],
  fallback: string[],
) => {
  const value = flatValue(lookup, names);
  if (!value) return fallback;
  if (["none", "null", "n/a", "na"].includes(value.toLowerCase())) return [];
  return value
    .split(/\n|,/)
    .map((item) => item.trim())
    .filter(Boolean);
};

const numberLabel = (index: number) => String(index + 1).padStart(2, "0");

const entityFieldNames = (entity: string, id: string, label: string, field: string) => [
  `Website ${entity} ${label} ${field}`,
  `Website ${entity} ${id} ${field}`,
];

function applyVisibility<T extends { hidden: boolean }>(
  item: T,
  lookup: GhlValueLookup | null,
  names: { visible: string[]; hidden: string[] },
) {
  const visible = flatBoolean(lookup, names.visible);
  if (visible !== null) {
    item.hidden = !visible;
    return;
  }

  const hidden = flatBoolean(lookup, names.hidden);
  if (hidden !== null) item.hidden = hidden;
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

function applyFlatSiteOverrides(
  site: { settings: SiteSettings; copy: SiteCopy },
  lookup: GhlValueLookup | null,
) {
  const settings = clone(site.settings);
  const copy = clone(site.copy);

  settings.siteName = flatText(lookup, "Website Site Name", settings.siteName);
  settings.contactEmail = flatText(lookup, "Website Contact Email", settings.contactEmail);
  settings.monumentUrl = flatText(lookup, "Website Monument URL", settings.monumentUrl);
  settings.primaryCtaLabel = flatText(
    lookup,
    "Website Primary CTA Label",
    settings.primaryCtaLabel,
  );
  settings.confirmationMessage = flatText(
    lookup,
    "Website Confirmation Message",
    settings.confirmationMessage,
  );

  copy.nav = copy.nav.map((item, index) => {
    const label = numberLabel(index);
    return {
      label: flatText(lookup, `Website Nav ${label} Label`, item.label),
      href: flatText(lookup, `Website Nav ${label} Link`, item.href),
    };
  });

  copy.hero.kicker = flatText(lookup, "Website Hero Kicker", copy.hero.kicker);
  copy.hero.title = flatText(lookup, "Website Hero Title", copy.hero.title);
  copy.hero.subtitle = flatText(lookup, "Website Hero Subtitle", copy.hero.subtitle);
  copy.hero.scriptNote = flatText(lookup, "Website Hero Script Note", copy.hero.scriptNote);
  copy.hero.scriptText = flatText(lookup, "Website Hero Script Text", copy.hero.scriptText);
  copy.hero.locationLabel = flatText(
    lookup,
    "Website Hero Location Label",
    copy.hero.locationLabel,
  );
  copy.hero.coords = flatText(lookup, "Website Hero Coordinates", copy.hero.coords);

  copy.stats = copy.stats.map((stat, index) => {
    const label = numberLabel(index);
    return {
      value: flatText(lookup, `Website Stat ${label} Value`, stat.value),
      label: flatText(lookup, `Website Stat ${label} Label`, stat.label),
    };
  });

  copy.focusAreas = copy.focusAreas.map((area, index) => {
    const label = numberLabel(index);
    return {
      title: flatText(lookup, `Website Focus ${label} Title`, area.title),
      text: flatText(lookup, `Website Focus ${label} Text`, area.text),
    };
  });

  copy.about.titleLines = copy.about.titleLines.map((line, index) =>
    flatText(lookup, `Website About Title Line ${numberLabel(index)}`, line),
  );
  copy.about.body = flatText(lookup, "Website About Body", copy.about.body);
  copy.about.script = flatText(lookup, "Website About Script Note", copy.about.script);

  copy.method.titleLines = copy.method.titleLines.map((line, index) =>
    flatText(lookup, `Website Method Title Line ${numberLabel(index)}`, line),
  );
  copy.method.intro = flatText(lookup, "Website Method Intro", copy.method.intro);
  copy.method.steps = copy.method.steps.map((step, index) => {
    const label = numberLabel(index);
    return {
      eyebrow: flatText(lookup, `Website Method Step ${label} Eyebrow`, step.eyebrow),
      title: flatText(lookup, `Website Method Step ${label} Title`, step.title),
      text: flatText(lookup, `Website Method Step ${label} Text`, step.text),
    };
  });
  copy.method.quote = flatText(lookup, "Website Method Quote", copy.method.quote);

  copy.offers.heading = flatText(lookup, "Website Offers Heading", copy.offers.heading);
  copy.offers.items = copy.offers.items.map((item, index) => {
    const label = numberLabel(index);
    return {
      ...item,
      title: flatText(lookup, `Website Offer ${label} Title`, item.title),
      text: flatText(lookup, `Website Offer ${label} Text`, item.text),
    };
  });

  copy.portfolio.titleLines = copy.portfolio.titleLines.map((line, index) =>
    flatText(lookup, `Website Portfolio Title Line ${numberLabel(index)}`, line),
  );
  copy.portfolio.intro = flatText(lookup, "Website Portfolio Intro", copy.portfolio.intro);

  copy.properties.heading = flatText(
    lookup,
    "Website Properties Heading",
    copy.properties.heading,
  );
  copy.properties.intro = flatText(lookup, "Website Properties Intro", copy.properties.intro);
  copy.properties.calloutScript = flatText(
    lookup,
    "Website Properties Callout Script",
    copy.properties.calloutScript,
  );
  copy.properties.calloutText = flatText(
    lookup,
    "Website Properties Callout Text",
    copy.properties.calloutText,
  );

  copy.proof.heading = flatText(lookup, "Website Proof Heading", copy.proof.heading);
  copy.footer.heading = flatText(lookup, "Website Footer Heading", copy.footer.heading);
  copy.footer.text = flatText(lookup, "Website Footer Text", copy.footer.text);

  return { settings, copy };
}

function applyFlatVentureOverrides(groups: VentureGroup[], lookup: GhlValueLookup | null) {
  return groups.map((group) => {
    const nextGroup = clone(group);
    const groupNames = (field: string) =>
      entityFieldNames("Venture Group", group.id, group.label, field);

    nextGroup.label = flatText(lookup, groupNames("Label"), nextGroup.label);
    nextGroup.kicker = flatText(lookup, groupNames("Kicker"), nextGroup.kicker);
    nextGroup.order = flatNumber(lookup, groupNames("Order"), nextGroup.order);
    applyVisibility(nextGroup, lookup, {
      visible: groupNames("Visible"),
      hidden: groupNames("Hidden"),
    });

    nextGroup.items = nextGroup.items.map((venture) => {
      const nextVenture = clone(venture);
      const ventureNames = (field: string) =>
        entityFieldNames("Venture", venture.id, venture.name, field);

      nextVenture.name = flatText(lookup, ventureNames("Name"), nextVenture.name);
      nextVenture.category = flatText(lookup, ventureNames("Category"), nextVenture.category);
      nextVenture.status = flatText(
        lookup,
        ventureNames("Status"),
        nextVenture.status,
      ) as VentureStatus;
      nextVenture.description = flatText(
        lookup,
        ventureNames("Description"),
        nextVenture.description,
      );
      nextVenture.website = flatNullableText(lookup, ventureNames("Website"), nextVenture.website);
      nextVenture.cta = flatNullableText(lookup, ventureNames("CTA"), nextVenture.cta);
      nextVenture.tags = flatList(lookup, ventureNames("Tags"), nextVenture.tags);
      nextVenture.featured =
        flatBoolean(lookup, ventureNames("Featured")) ?? nextVenture.featured;
      nextVenture.order = flatNumber(lookup, ventureNames("Order"), nextVenture.order);
      applyVisibility(nextVenture, lookup, {
        visible: ventureNames("Visible"),
        hidden: ventureNames("Hidden"),
      });

      return nextVenture;
    });

    return nextGroup;
  });
}

function applyFlatPropertyOverrides(properties: Property[], lookup: GhlValueLookup | null) {
  return properties.map((property) => {
    const nextProperty = clone(property);
    const names = (field: string) =>
      entityFieldNames("Property", property.id, property.title, field);

    nextProperty.title = flatText(lookup, names("Title"), nextProperty.title);
    nextProperty.category = flatText(lookup, names("Category"), nextProperty.category);
    nextProperty.status = flatText(lookup, names("Status"), nextProperty.status);
    nextProperty.location = flatText(lookup, names("Location"), nextProperty.location);
    nextProperty.price = flatText(lookup, names("Price"), nextProperty.price);
    nextProperty.summary = flatText(lookup, names("Summary"), nextProperty.summary);
    nextProperty.details = flatList(lookup, names("Details"), nextProperty.details);
    nextProperty.order = flatNumber(lookup, names("Order"), nextProperty.order);
    applyVisibility(nextProperty, lookup, {
      visible: names("Visible"),
      hidden: names("Hidden"),
    });

    return nextProperty;
  });
}

function applyFlatTestimonialOverrides(
  testimonials: Testimonial[],
  lookup: GhlValueLookup | null,
) {
  return testimonials.map((testimonial, index) => {
    const nextTestimonial = clone(testimonial);
    const numberedNames = (field: string) =>
      [`Website Testimonial ${numberLabel(index)} ${field}`].concat(
        entityFieldNames("Testimonial", testimonial.id, testimonial.name, field),
      );

    nextTestimonial.quote = flatText(lookup, numberedNames("Quote"), nextTestimonial.quote);
    nextTestimonial.name = flatText(lookup, numberedNames("Name"), nextTestimonial.name);
    nextTestimonial.image = flatText(lookup, numberedNames("Image"), nextTestimonial.image);
    nextTestimonial.order = flatNumber(lookup, numberedNames("Order"), nextTestimonial.order);
    applyVisibility(nextTestimonial, lookup, {
      visible: numberedNames("Visible"),
      hidden: numberedNames("Hidden"),
    });

    return nextTestimonial;
  });
}

function applyFlatProfileOverrides(profiles: Profile[], lookup: GhlValueLookup | null) {
  return profiles.map((profile) => {
    const nextProfile = clone(profile);
    const names = (field: string) =>
      entityFieldNames("Profile", profile.slug, profile.name, field);

    nextProfile.name = flatText(lookup, names("Name"), nextProfile.name);
    nextProfile.company = flatNullableText(lookup, names("Company"), nextProfile.company);
    nextProfile.welcome = flatNullableText(lookup, names("Welcome"), nextProfile.welcome);
    nextProfile.headline = flatNullableText(lookup, names("Headline"), nextProfile.headline);
    nextProfile.subheadline = flatNullableText(
      lookup,
      names("Subheadline"),
      nextProfile.subheadline,
    );
    nextProfile.ctaLabel = flatNullableText(lookup, names("CTA Label"), nextProfile.ctaLabel);
    nextProfile.ventureGroupIds = flatList(
      lookup,
      names("Venture Group IDs"),
      nextProfile.ventureGroupIds ?? [],
    );
    if (nextProfile.ventureGroupIds.length === 0) nextProfile.ventureGroupIds = null;
    nextProfile.showProperties =
      flatBoolean(lookup, names("Show Properties")) ?? nextProfile.showProperties;
    nextProfile.testimonialIds = flatList(
      lookup,
      names("Testimonial IDs"),
      nextProfile.testimonialIds ?? [],
    );
    if (nextProfile.testimonialIds.length === 0) nextProfile.testimonialIds = null;
    nextProfile.ghlTags = flatList(lookup, names("GHL Tags"), nextProfile.ghlTags);
    applyVisibility(nextProfile, lookup, {
      visible: names("Visible"),
      hidden: names("Hidden"),
    });

    return nextProfile;
  });
}

export async function getVentureGroups(): Promise<VentureGroup[]> {
  const lookup = await ghlValueLookup();
  const override = ghlJsonOverride<{ groups: VentureGroup[] }>(lookup, CUSTOM_VALUE_KEYS.ventures);
  const groups = override?.groups ?? (localVentures as { groups: VentureGroup[] }).groups;
  return normalizeVentureGroups(applyFlatVentureOverrides(groups, lookup));
}

export async function getProperties(): Promise<Property[]> {
  const lookup = await ghlValueLookup();
  const override = ghlJsonOverride<{ properties: Property[] }>(
    lookup,
    CUSTOM_VALUE_KEYS.properties,
  );
  const properties = override?.properties ?? (localProperties as { properties: Property[] }).properties;
  return sortByOrder(applyFlatPropertyOverrides(properties, lookup)).filter(
    (property) => !property.hidden,
  );
}

export async function getTestimonials(): Promise<Testimonial[]> {
  const lookup = await ghlValueLookup();
  const override = ghlJsonOverride<{ testimonials: Testimonial[] }>(
    lookup,
    CUSTOM_VALUE_KEYS.testimonials,
  );
  const testimonials =
    override?.testimonials ?? (localTestimonials as { testimonials: Testimonial[] }).testimonials;
  return sortByOrder(applyFlatTestimonialOverrides(testimonials, lookup)).filter(
    (testimonial) => !testimonial.hidden,
  );
}

export async function getProfiles(): Promise<Profile[]> {
  const lookup = await ghlValueLookup();
  const override = ghlJsonOverride<{ profiles: Profile[] }>(lookup, CUSTOM_VALUE_KEYS.profiles);
  const profiles = override?.profiles ?? (localProfiles as { profiles: Profile[] }).profiles;
  return applyFlatProfileOverrides(profiles, lookup).filter((profile) => !profile.hidden);
}

export async function getProfile(slug: string): Promise<Profile | null> {
  const profiles = await getProfiles();
  return profiles.find((profile) => profile.slug.toLowerCase() === slug.toLowerCase()) ?? null;
}

export async function getSiteContent(): Promise<SiteContent> {
  const lookup = await ghlValueLookup();
  const override = ghlJsonOverride<{ settings: SiteSettings; copy: SiteCopy }>(
    lookup,
    CUSTOM_VALUE_KEYS.content,
  );
  const base = localSiteContent as { settings: SiteSettings; copy: SiteCopy };
  const site = applyFlatSiteOverrides(
    {
      settings: { ...base.settings, ...override?.settings },
      copy: { ...base.copy, ...override?.copy },
    },
    lookup,
  );

  const ventureOverride = ghlJsonOverride<{ groups: VentureGroup[] }>(
    lookup,
    CUSTOM_VALUE_KEYS.ventures,
  );
  const propertyOverride = ghlJsonOverride<{ properties: Property[] }>(
    lookup,
    CUSTOM_VALUE_KEYS.properties,
  );
  const testimonialOverride = ghlJsonOverride<{ testimonials: Testimonial[] }>(
    lookup,
    CUSTOM_VALUE_KEYS.testimonials,
  );
  const ventureGroups = normalizeVentureGroups(
    applyFlatVentureOverrides(
      ventureOverride?.groups ?? (localVentures as { groups: VentureGroup[] }).groups,
      lookup,
    ),
  );
  const properties = sortByOrder(
    applyFlatPropertyOverrides(
      propertyOverride?.properties ??
        (localProperties as { properties: Property[] }).properties,
      lookup,
    ),
  ).filter((property) => !property.hidden);
  const testimonials = sortByOrder(
    applyFlatTestimonialOverrides(
      testimonialOverride?.testimonials ??
        (localTestimonials as { testimonials: Testimonial[] }).testimonials,
      lookup,
    ),
  ).filter((testimonial) => !testimonial.hidden);

  return {
    settings: site.settings,
    copy: site.copy,
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
