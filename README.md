# Brody Billings / Monument Solutions — Website + GHL Sales System

The Brody Billings site and the Monument Solutions qualification funnel as
one system: Next.js on Vercel is the front end, GoHighLevel is the backend
for contacts, scoring, pipelines, booking, and automation.

## Decisions locked (as of Jul 6, 2026)

- **Hosting:** Vercel, free tier. Brody approved hosting outside GHL. The repo
  already auto-deploys to Vercel (`oneday-clone` + `brody-redesign` projects).
- **Design:** Brody has approved the current design direction. No sign-off
  blocker remains; content/asset refresh (real logo, colors, venture list,
  property inventory) can still happen incrementally without re-approval.
- **GHL:** connected. Custom fields + content custom values created via API;
  leads verified flowing in. Remaining manual setup listed below.
- **UI:** boxy aesthetic (sharp corners) per client feedback; testimonials
  redesigned as bordered editorial cards.
- **Priority deliverable:** the Qualification Engine per Massimo's Spec v1
  (survey → complexity score → tier → pipeline → booking + deposit).
- **All site content is data**, editable from GHL Custom Values without a
  deploy.

## What is implemented (website side — done)

- **Dynamic content layer.** Every piece of content — copy, ventures,
  properties, testimonials, personalization profiles — lives in JSON under
  `app/data/` and can be overridden from GHL (table below).
- **Qualification engine, native.** Primary CTA "See if Your Business
  Qualifies" in the hero, offers section, footer, and mobile menu opens a
  4-step popup survey (also standalone at `/qualify`). Scoring, tier mapping
  (4–13 T1 / 14–24 T2 / 25+ T3), and the fit gate follow Spec v1 exactly and
  are re-computed server-side; the visitor never sees the score. Verified
  against the spec's worked examples. Setting `NEXT_PUBLIC_GHL_SURVEY_URL`
  swaps the native form for an embedded GHL-hosted survey with no code change.
- **Lead capture → GHL.** All forms post to `/api/lead`, which upserts the
  GHL contact (tags + `MS_*` custom fields + UTM) via the API and mirrors the
  full payload to a GHL inbound-webhook workflow when configured. Without GHL
  connected, submissions still succeed and are logged server-side.
- **Personalized URLs.** `/bruce`, `/chris`, `/peak`, `/audit` (any slug in
  the profiles data) render the site with per-profile welcome banner,
  headline, CTA label, venture/testimonial filters, and GHL tags applied on
  any later form submit. Unknown slugs 404 safely. Profiles are marked
  noindex.
- **Recognition, phase one.** `proxy.ts` assigns an anonymous `bb_vid`
  cookie and captures UTM parameters; personalized pages set a profile
  cookie. All of it rides along on every lead.
- **Property inquiries.** Each listing on `/properties` has "Ask about this
  property" → inquiry form → GHL with property tags.
- **Live GHL content.** Website content pages fetch GHL Custom Values on each
  request, so saved edits appear on the next browser refresh without a manual
  revalidate step.

## Editing the site from GHL

For day-to-day edits, use the plain `Website ...` Custom Values in GHL
(Settings → Custom Values). These are normal text / yes-no / order fields
such as `Website Hero Title`, `Website Primary CTA Label`,
`Website Property Commercial Property Visible`, and
`Website Testimonial 01 Quote`. The site reads those friendly fields first,
so Brody does not need to edit JSON for normal content changes.

Common field patterns:

| Field pattern | What to edit |
| --- | --- |
| `Website Hero *`, `Website About *`, `Website Footer *` | Main page copy |
| `Website Venture <name> Name/Description/Visible/Order` | Venture cards |
| `Website Property <title> Title/Summary/Visible/Order` | Property cards |
| `Website Testimonial 01 Quote/Name/Visible/Order` | Testimonials |
| `Website Profile <name> Welcome/Subheadline/Visible` | Personalized pages |

Use `yes` / `no` for `Visible`, numbers for `Order`, comma-separated text
for list fields such as `Tags` or `Details`, and `none` for optional fields
that should be blank. After saving a value in GHL, refresh the site page; the
next request reads GHL directly.

The raw JSON Custom Values still exist as a fallback/import-export layer.
They should only be edited by a technical user. Each JSON value holds a
document copied from (and shaped like) the matching local file:

| GHL Custom Value name | Controls | Template file |
| --- | --- | --- |
| `Website Content JSON` | All copy, nav, CTAs, contact email | `app/data/site-content.json` |
| `Website Ventures JSON` | Venture groups/cards (hide, reorder, add) | `app/data/ventures.json` |
| `Website Properties JSON` | Property listings | `app/data/properties.json` |
| `Website Testimonials JSON` | Testimonials | `app/data/testimonials.json` |
| `Website Profiles JSON` | Personalized URLs (`/bruce`, …) | `app/data/profiles.json` |

Name matching ignores case/punctuation. Local JSON is the fallback whenever a
custom value is missing or invalid, so a bad edit can never blank the site.

## GHL connection status (done via API, Jul 6, 2026)

- [x] Private Integration token + location id wired into Vercel (production
      and preview) and `.env.local`.
- [x] 22 contact custom fields created (all `MS *` + `UTM *`), keys verified
      to match what `/api/lead` sends: `ms_functional_scope`, `ms_locations`,
      `ms_annual_revenue`, `ms_employee_range`, `ms_industry`,
      `ms_system_fragmentation`, `ms_decision_complexity`,
      `ms_buying_timeline`, `ms_audit_goal`, `ms_audit_acknowledgement`,
      `ms_complexity_score`, `ms_estimated_tier`, `ms_fit_status`,
      `ms_role_title`, `ms_property_interest`, `ms_message`, `ms_visitor_id`,
      `utm_source`, `utm_medium`, `utm_campaign`, `utm_term`, `utm_content`.
- [x] All five `Website * JSON` custom values seeded with the current site
      content and verified byte-for-byte. Editing them in GHL (Settings →
      Custom Values) changes the live site — proven end to end with a live
      edit + revalidate + page check.
- [x] 308 plain website editor Custom Values seeded in GHL so non-technical
      edits can happen through normal fields instead of raw JSON. The site
      prefers these plain `Website ...` fields, with JSON/local content as
      fallback.
- [x] End-to-end lead test: contact created with correct tags
      (`audit-t1`, `fit-qualified`, `interested-in-audit`, …) and 17
      populated fields, then deleted.
- [x] `Audit Pipeline` created in GHL with stages New Application →
      Qualified - Needs Review → Booking Sent → Audit Booked (Deposit Paid)
      → Audit Delivered → Implementation Proposal → Won. `GHL_PIPELINE_ID`
      and `GHL_PIPELINE_STAGE_ID` are set locally and in Vercel production +
      preview, so qualified submissions create Opportunities automatically.
- [x] Production smoke test after pipeline wiring: qualified test submission
      created a contact and an `Audit Pipeline` Opportunity in the first
      stage, then both test records were deleted.

## Remaining GHL setup (manual, in the GHL app)

Do these in the GHL UI unless we intentionally script more setup later:

- [ ] **Property Pipeline** (optional but recommended): New Inquiry →
      Details Sent → Negotiation → Under Contract → Closed, fed by a small
      workflow on tag `property-inquiry`.
- [ ] **Notification workflow** (Automation → Workflows → Create, trigger:
      Contact Tag Added = `interested-in-audit`): If/Else on `MS Fit Status`
      → qualified: internal notification + task "Confirm tier for {{contact.name}}
      (score {{contact.ms_complexity_score}}, {{contact.ms_estimated_tier}})";
      nurture: add to nurture drip; declined: send one gracious email.
- [ ] **Booking calendars** per tier (Calendars → Create) with deposit via
      Forms & Payments → Accept Payments → partial payment.
      **Blocked on Brody: deposit amounts.**
- [ ] **Follow-up sequences**: booking-sent nudges, booked confirmation +
      reminders, no-show rebook, nurture drip, post-audit proposal cadence.
- [ ] Optional env additions later: `GHL_WEBHOOK_URL` (mirror every lead into
      a workflow), `NEXT_PUBLIC_GHL_SURVEY_URL` (swap native survey for a
      GHL-hosted one).

Useful tags the site sends: `website-lead`, `lead-qualification` /
`lead-property` / `lead-contact`, `interested-in-audit`, `audit-t1|t2|t3`,
`fit-qualified|nurture|declined|review`, `property-<id>`, `profile-<slug>`,
`personalized-page-visited`, plus any `ghlTags` from the visitor's profile.

## Still open (later phases)

- **Real content pass** — final logo, colors, venture list, property
  inventory, copy (design direction itself is already approved).
- **Domain:** point brodybillings.com (or chosen domain) at Vercel.
- **Recognition phase two:** magic links, confidence tiers, verified portal
  mode (no private content below verified confidence — rule already scoped).
- **Chat-style intake skin** for the qualification form.
- **AI features:** assistant, testimonial chatbot, review automation.
- **Analytics** beyond UTM/source tagging.
- **Twilio** call tracking for real estate.
- **Additional business sites** (Arctic Peaks, WW Custom Design, Capital
  Bookkeeping, Halifax Flooring, immigration, pressure washing, Regenerative
  Research Group) — confirm paid scope and Adam's ownership first.

## Decisions needed from Brody

1. Deposit amounts per tier; confirm tier pricing reads right.
2. Human confirm on all tiers at launch (recommended) or auto-send T1/T2.
3. Which ventures/properties are public; what stays private.
4. Production domain.

## Development

```bash
npm install
npm run dev    # http://localhost:3000
npm run build
npm run lint
```

Note: this repo uses a newer Next.js (16.x) with breaking changes — read
`node_modules/next/dist/docs/` before writing framework-touching code
(see AGENTS.md). Middleware is `proxy.ts`, and `params` are Promises.
