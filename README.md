# Brody Billings / Monument Solutions — Website + GHL Sales System

The Brody Billings site and the Monument Solutions qualification funnel as
one system: Next.js on Vercel is the front end, GoHighLevel is the backend
for contacts, scoring, pipelines, booking, and automation.

## Decisions locked (as of Jul 6, 2026)

- **Hosting:** Vercel, free tier. Brody approved hosting outside GHL. The repo
  already auto-deploys to Vercel (`oneday-clone` + `brody-redesign` projects).
- **GHL:** account exists; connection pending (see "Connecting GHL" below).
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
- **Cache + publish.** GHL content is cached 5 minutes;
  `POST /api/revalidate?secret=<REVALIDATE_SECRET>` publishes instantly
  (wire it to a GHL workflow button/webhook).

## Editing the site from GHL

Create these Custom Values in GHL (Settings → Custom Values), each holding a
JSON document copied from (and shaped like) the matching local file:

| GHL Custom Value name | Controls | Template file |
| --- | --- | --- |
| `Website Content JSON` | All copy, nav, CTAs, contact email | `app/data/site-content.json` |
| `Website Ventures JSON` | Venture groups/cards (hide, reorder, add) | `app/data/ventures.json` |
| `Website Properties JSON` | Property listings | `app/data/properties.json` |
| `Website Testimonials JSON` | Testimonials | `app/data/testimonials.json` |
| `Website Profiles JSON` | Personalized URLs (`/bruce`, …) | `app/data/profiles.json` |

Name matching ignores case/punctuation. Local JSON is the fallback whenever a
custom value is missing or invalid, so a bad edit can never blank the site.

## Connecting GHL (the remaining setup)

Environment variables (see `.env.example`; set them in Vercel → Project →
Settings → Environment Variables):

1. `GHL_API_TOKEN` — Private Integration token (Settings → Private
   Integrations) with scopes: contacts write/read, custom values read.
2. `GHL_LOCATION_ID` — the sub-account location id.
3. `GHL_WEBHOOK_URL` — optional: a workflow with an Inbound Webhook trigger;
   receives every lead payload in full.
4. `NEXT_PUBLIC_GHL_SURVEY_URL` — optional: GHL-hosted survey embed URL.
5. `REVALIDATE_SECRET` — any random string, for instant content publishes.

Inside the GHL app (per Spec v1):

- [ ] Contact custom fields, `MS_` namespace (avoids the "name already used"
      collision). Create with these exact names so the API keys match:
      `MS Functional Scope`, `MS Locations`, `MS Annual Revenue`,
      `MS Employee Range`, `MS Industry`, `MS System Fragmentation`,
      `MS Decision Complexity`, `MS Buying Timeline`, `MS Audit Goal`,
      `MS Audit Acknowledgement`, `MS Complexity Score`, `MS Estimated Tier`,
      `MS Fit Status` (keys: `ms_functional_scope`, `ms_locations`,
      `ms_annual_revenue`, `ms_employee_range`, `ms_industry`,
      `ms_system_fragmentation`, `ms_decision_complexity`,
      `ms_buying_timeline`, `ms_audit_goal`, `ms_audit_acknowledgement`,
      `ms_complexity_score`, `ms_estimated_tier`, `ms_fit_status`).
- [ ] "Audit Pipeline": New Application → Qualified–Needs Review → Booking
      Sent → Audit Booked (Deposit Paid) → Audit Delivered → Implementation
      Proposal → Won. Lost/Disqualified as status; Nurture via tag.
- [ ] Master workflow on contact tag `interested-in-audit`: branch on
      `ms_fit_status` (declined → decline sequence; nurture → drip) and
      `ms_estimated_tier` → create Opportunity with tier value → notify Brody
      with a confirm task → send booking link on confirm (v1 = human confirm
      on all tiers). The site already computes score/tier/fit — no GHL survey
      or Math Operation needed.
- [ ] Booking calendars per tier with deposit via partial payment.
      **Blocked on Brody: deposit amounts.**
- [ ] Follow-up sequences: booking-sent nudges, booked confirmations +
      reminders, no-show rebook, nurture drip, gracious decline, post-audit.
- [ ] End-to-end test: submit the site survey with test data, confirm
      contact, fields, tags, opportunity, and notification all appear.

Useful tags the site sends: `website-lead`, `lead-qualification` /
`lead-property` / `lead-contact`, `interested-in-audit`, `audit-t1|t2|t3`,
`fit-qualified|nurture|declined|review`, `property-<id>`, `profile-<slug>`,
`personalized-page-visited`, plus any `ghlTags` from the visitor's profile.

## Still open (later phases)

- **Design sign-off from Brody** — likes/dislikes on the deployed preview;
  final logo, colors, venture list, property inventory, copy.
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

1. Design sign-off on the deployed preview.
2. Deposit amounts per tier; confirm tier pricing reads right.
3. Human confirm on all tiers at launch (recommended) or auto-send T1/T2.
4. Which ventures/properties are public; what stays private.
5. Production domain.

## Development

```bash
npm install
npm run dev    # http://localhost:3000
npm run build
npm run lint
```

Note: this repo uses a newer Next.js (16.x) with breaking changes — read
`node_modules/next/dist/docs/` before writing framework-touching code
(see AGENTS.md). Middleware is `proxy.ts`, `params` are Promises,
`revalidateTag` takes a cache profile argument.
