# Brody Billings / Monument Solutions — Website + GHL Sales System

Working scope tracker for the Brody Billings site and the Monument Solutions
qualification funnel. The site (Next.js on Vercel) and GoHighLevel (CRM) are
one system: the site is the front end, GHL is the backend for contacts,
scoring, pipelines, booking, and automation.

## Decisions locked (as of Jul 6, 2026)

- **Hosting:** Vercel, free tier. Brody approved hosting outside GHL. The repo
  already auto-deploys to Vercel (`oneday-clone` + `brody-redesign` projects).
- **GHL:** account exists. GHL is used for CRM, surveys, pipelines, calendars,
  deposits, and automations — not for hosting the website.
- **Priority deliverable:** the Qualification Engine per Massimo's Spec v1
  (survey → complexity score → tier → pipeline → booking + deposit).
- **Ventures are structured data**, not hard-coded JSX (PR #1, `Arch` branch).
- **Phasing:** design approval first, then funnel, then personalization/AI.
  Do not build ahead of the design sign-off where the two overlap.

## Division of labor

| Lives on the website (this repo) | Lives inside GHL (no code) |
| --- | --- |
| Design, copy, sections, venture cards | Custom fields (`MS_` namespace) |
| CTAs opening the qualification survey | Qualification Survey + Score field |
| `/qualify` page / survey popup embed | Fit-gate + tier conditional logic |
| `/properties` listings | "Audit Pipeline" + stages |
| Later: personalized URLs, cookies, chat intake | Master workflow, notifications |
| Later: AI tools, analytics hooks | Calendars + deposit payments |
|  | Nurture/decline/no-show sequences |

The survey itself is built in GHL (native multi-step Survey with a Score
field), not in Next.js. The website only hosts the CTA and the embed. The
custom chat-style intake replaces the embed later, once the funnel is proven.

## Build order

### Phase 0 — Merge the modular ventures work

- [ ] Merge PR #1 (`Arch` branch): ventures moved to `app/data/ventures.json`
      with full fields (category, status, logo, images, tags, featured,
      hidden, order) + `VentureSection`/`VentureCard` components. Builds clean.
- [ ] After merge: resolve README conflict in favor of this file.
- [ ] Wire the unused `featured` flag or remove it (currently data-only).
- [ ] Move `property-listings.ts` into `app/data/` for consistency and add the
      same `hidden`/`order` fields as ventures.

### Phase 1 — Design approval (blocking Brody feedback)

Static redesign is done and deployed. Waiting on Brody for:

- [ ] Explicit approval of the design direction (likes / dislikes / wrong /
      missing), against the Vercel preview.
- [ ] Final logo + brand colors.
- [ ] Final venture list: which businesses show publicly, correct URLs,
      descriptions, logos.
- [ ] Final homepage copy and section order.
- [ ] Real property inventory (or confirmation placeholders stay for launch).
- [ ] Testimonials/media assets that are final enough to use.

### Phase 2 — Qualification Engine v1 (the current priority)

**GHL side** (build in the GHL app, per Spec v1):

- [ ] Create custom fields with `MS_` namespace: `MS_FunctionalScope`,
      `MS_Locations`, `MS_AnnualRevenue`, `MS_EmployeeRange`, `MS_Industry`,
      `MS_SystemFragmentation`, `MS_DecisionComplexity`, `MS_BuyingTimeline`,
      `MS_AuditGoal`, `MS_AuditAcknowledgement`, plus `MS_ComplexityScore`
      (numeric), `MS_EstimatedTier`, `MS_FitStatus`. The namespace avoids the
      "custom field already uses this name" collision Brody hit.
- [ ] Create "Audit Pipeline": New Application → Qualified–Needs Review →
      Booking Sent → Audit Booked (Deposit Paid) → Audit Delivered →
      Implementation Proposal → Won. Lost/Disqualified as status; Nurture via
      tag + workflow.
- [ ] Build the 4-step Qualification Survey with the native Score field and
      the Spec v1 point values (Locations heaviest). Verify score writes to
      `MS_ComplexityScore`.
- [ ] Add fit-gate conditional logic (chatbot-only intent → decline; exploring
      + solo → nurture; unchecked acknowledgement → flag).
- [ ] Master workflow: map fields → fit gate → tier branch (4–13 T1 / 14–24 T2
      / 25+ T3) → create Opportunity with tier value → notify Brody with
      confirm task → send booking link on confirm (v1 = human confirm on all
      tiers).
- [ ] Booking calendars per tier with deposit via partial payment. **Blocked
      on Brody: deposit amounts** (suggested $500–$1,500 T1, ~$1,000 T2).
- [ ] Follow-up sequences: booking-sent nudges, booked confirmations +
      reminders, no-show rebook, nurture drip, gracious decline, post-audit.
- [ ] Test end-to-end with a dummy contact through every branch.

**Website side** (this repo):

- [ ] Replace mailto CTAs with the primary CTA "See if Your Business
      Qualifies" — hero, offer section, footer. One CTA, one destination.
- [ ] Embed the GHL survey: popup over the page (preferred) or `/qualify`
      route. Read the survey URL from an env var so it can change without a
      deploy.
- [ ] Post-submit confirmation message (no score shown): "we'll follow up
      within one business day."
- [ ] Keep a secondary mailto link for people who refuse forms, but visually
      subordinate.

### Phase 3 — Domain + production launch

- [ ] Point the production domain (brodybillings.com or the chosen domain) at
      the Vercel project.
- [ ] Set metadata/OG images for the final brand.
- [ ] Lighthouse/responsive pass after the CTA changes.

### Phase 4 — Property + general lead capture into GHL

- [ ] Property inquiry form (per-property "Ask about this property") posting
      to GHL via inbound webhook or LeadConnector API with source + property
      tags.
- [ ] Individual property detail pages once real inventory arrives.
- [ ] Property status field (for sale / under contract / sold / leased).
- [ ] Decide if the family-properties site is a section here or a separate
      site (Brody decision).

### Phase 5 — Personalized URLs

- [ ] Dynamic route `app/[slug]/page.tsx` backed by a `profiles` data file:
      `/bruce`, `/chris`, `/peak`, `/audit`, `/brody`.
- [ ] Per-profile overrides: headline, offers shown, venture cards,
      testimonials, CTA. Unknown slug → 404 or generic homepage, never an
      error.
- [ ] Visiting a personalized URL sets a visitor cookie and fires a GHL tag
      (e.g. `Personalized Page Visited: bruce`).

### Phase 6 — Recognition + confidence

- [ ] Cookie on personalized-URL visit and on any form submit.
- [ ] UTM capture on landing, forwarded into GHL on every submit.
- [ ] Magic links from email/SMS (unique token → high confidence).
- [ ] Confidence tiers: <60% generic, 60–89% light ("Welcome back, Bruce"),
      90–99% personalized, 100% (verified via phone/email/token) portal mode.
- [ ] Hard rule enforced in code: no deal documents, financials, contracts,
      or private notes below verified confidence.

### Phase 7 — Chat-style smart intake (replaces the embed)

- [ ] Guided form that feels like chat: name, phone, email, company, reason
      for visit; then the qualification questions with client-side scoring
      mirrored to GHL fields via API.
- [ ] Creates/updates the GHL contact, tags, routes to the right page or
      booking link.

### Phase 8 — AI, analytics, and the rest (parked until funnel is live)

- AI assistant / tools / testimonial chatbot / review automation.
- Analytics: page views, CTA clicks, form starts/completes, venture
  engagement, per-profile engagement, fed back into GHL where useful.
- Twilio number + call tracking for real estate.
- Additional business sites (Arctic Peaks, WW Custom Design, Capital
  Bookkeeping, Halifax Flooring, immigration, pressure washing, Regenerative
  Research Group). Confirm which are paid scope and which Adam owns before
  touching any.

## Decisions needed from Brody

1. Design sign-off on the current preview (Phase 1 list above).
2. Deposit amounts per tier, and confirmation the tier pricing reads right.
3. v1 launches with human confirm on all tiers (recommended) or auto-send
   for Tier 1/2.
4. Which ventures/properties are public, and what content is private-only.
5. Booking via GHL calendars (assumed, since deposits need it) vs Calendly.
6. Production domain to point at Vercel.

## Development

```bash
npm install
npm run dev    # http://localhost:3000
npm run build
npm run lint
```

Note: this repo uses a newer Next.js (16.x) with breaking changes — read
`node_modules/next/dist/docs/` before writing framework-touching code
(see AGENTS.md).
