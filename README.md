# Brody Billings / Monument Solutions Site

This README is the working scope tracker for the Brody Billings redesign and the larger platform ideas that came out of the client conversation.

The project started as a website/profile revamp, but the conversation expanded into a broader digital ecosystem: personal brand site, venture hub, GoHighLevel CRM funnel, personalized pages, AI intake/tools, property pages, review automation, Twilio/call tracking, and additional business websites.

## Current Build Status

The current site is a static Next.js redesign sample. It is useful for reviewing visual direction, messaging, layout, and section structure before building the larger dynamic/GHL/business operating system pieces.

## Phase 1 Goal

Finalize and approve the current website design direction first.

Phase 1 should answer:

- What parts of the redesign does Brody like?
- What parts does Brody dislike?
- What feels wrong or unclear?
- What content/assets are missing?
- Which sections should stay, move, change, or be removed?
- What messaging is final enough to use?

Do not overbuild the dynamic system until the design direction is approved, because repeated messaging/layout changes can invalidate the dynamic structure.

## Extracted Client Scope

### Core Brand / Website

- Brody Billings personal brand website.
- Monument Solutions positioning connected to Brody's personal brand.
- Brand should communicate business architecture, visibility, operations, AI, automation, systems, capital clarity, and practical execution.
- Site should not be only a brochure website; it should become the foundation of Brody's personal and business ecosystem.
- Messaging ideas from conversation:
  - "I help business owners uncover the biggest opportunities and bottlenecks in their company, prioritize what will create the highest return, and then build the systems, AI, and processes to make it happen."
  - "Most companies do not have a software problem. They have a visibility problem."
  - "Think of me as a business architect."
  - "Brody helps companies see what they cannot see, decide what matters most, and build the systems to get there."

### Recommended Site Architecture

- Hero.
- What I Do / consulting framework.
- Who I Work With.
- Companies & Ventures.
- Case Studies / Success Stories.
- Insights: articles, podcasts, interviews, videos.
- AI Tools & Assessments.
- Properties & Investments.
- Contact / Book a Strategy Session.

### Consulting Framework

- Visibility.
- Intelligence.
- Action.
- Automation.

### Venture / Portfolio System

The venture list is not finalized. It should be organized into categories rather than treated as one flat list.

Possible categories:

- Current Companies.
- Portfolio Companies.
- Client Success Stories.
- Investments.
- Current Projects.
- Community & Research Initiatives.

Each venture should eventually be structured data rather than hard-coded page content.

Recommended venture fields:

- Name.
- Category.
- Status: Current, Past, Client, Investment, Acquisition Target.
- Logo.
- Description.
- Website.
- Images.
- CTA.
- Tags.
- Featured flag.

### Businesses / Sites Mentioned

- Arctic Peaks.
- WW Custom Design.
- Capital Bookkeeping Solutions.
- Halifax Flooring.
- Immigration law website.
- Pressure washing.
- Regenerative Research Group.
- Multiple lead-acquisition websites.
- Property management / family properties website.
- Any current BrodyBillings.com connected sites.

Note: Adam may want to work on some lead acquisition websites, so ownership needs clarification before scoping those.

### Dynamic Personalization System

The client wants the website to eventually support personalized visitor experiences.

Requested examples:

- `/brody`
- `/bruce`
- `/chris`
- `/peak`
- `/audit`

Personalized pages may eventually show different:

- Messaging.
- Offers.
- Venture cards.
- Testimonials.
- CTAs.
- AI conversations.
- Deal/client workspace content.

### Smart Intake / Guided Form

The intake should feel like a chatbot but technically work as a guided form.

Fields mentioned:

- Name.
- Phone.
- Email.
- Company.
- Reason for visit.

Expected behavior:

- Create or update the contact in GoHighLevel.
- Save a browser cookie.
- Generate or load a personal page.
- Change site content based on who the visitor is.

### GoHighLevel / CRM Requirements

The site needs to be CRM-first.

Every form should feed GoHighLevel with:

- Contact creation/update.
- Tags.
- Routing.
- Automations.
- Lead source tracking.
- Interest tracking.
- Funnel tracking.

Example tags mentioned:

- Website Visitor.
- Personalized Page Created.
- Bruce Workspace.
- Interested in Audit.

### GHL Custom Field Troubleshooting

There was a GHL issue:

> "A custom field already uses this name. Please choose a different name."

Fields to check for duplicates:

- Functional Scope.
- Locations.
- Annual Revenue.
- Employees.
- Industry.
- System Fragmentation.
- Decision Complexity.
- Timeline.
- Audit Goal.
- Audit Acknowledgement.

Recommended unique naming convention:

- `MS_FunctionalScope`
- `MS_Locations`
- `MS_AnnualRevenue`
- `MS_EmployeeRange`
- `MS_Industry`
- `MS_SystemFragmentation`
- `MS_DecisionComplexity`
- `MS_BuyingTimeline`
- `MS_AuditGoal`
- `MS_AuditAcknowledgement`

Troubleshooting flow:

- Refresh/sync GHL custom fields.
- Reload Forms/Surveys builder.
- Search Contact and Opportunity fields for duplicates.
- Check archived/deleted fields that may reserve internal names.
- Reuse existing fields if appropriate.
- Rename fields with a namespace if needed.
- Reconnect fields to the form.
- Save the form.
- Test a submission and confirm CRM fields populate.

### Recognition / Identity Confidence

The long-term idea is to determine how much personalization to show based on confidence.

Signals mentioned:

- Person typed a personalized URL.
- Visitor clicked unique email/text link.
- Browser cookie identifies visitor.
- Visitor entered phone/email in form.
- CRM has matching phone/email.
- Same IP/device/browser as prior visit.
- Company/IP match.

Confidence tiers:

- Under 60%: generic website.
- 60-89%: lightly personalized.
- 90-99%: personalized.
- 100%: verified/client portal mode.

Important rule:

- Do not show private information unless identity is highly verified.

Safe at lower confidence:

- Welcome message.
- General services discussed.

Unsafe until verified:

- Deal documents.
- Financial numbers.
- Contracts.
- Private notes.
- Acquisition reports.
- Client files.

### Advanced Tracking

Requested or implied tracking:

- Cookies.
- UTM links.
- Magic links.
- CRM tracking links.
- Returning visitor detection.
- Visitor behavior analytics.
- Lead source analytics.
- Venture engagement tracking.
- Interest tracking.

### AI / Automation Scope

Long-term AI ideas mentioned:

- AI that understands Brody, his companies, and his services.
- AI conversations personalized by visitor/page.
- AI tools and assessments.
- Interactive diagnostics.
- Calculators.
- Qualification engine.
- Testimonial chatbot.
- Google review auto-replies.
- Email customers for reviews.
- Review automation workflow.

### Additional Operations Scope

Other scope expansions mentioned:

- GHL subaccount setup.
- Gmail connection.
- Calendly connection.
- Twilio phone number for real estate.
- Call forwarding.
- Lead-source call tracking.
- Qualification survey/scoring.
- Pipeline routing.
- Deposits.
- Booking workflows.

## Phase Checklist

### Phase 1: Static Redesign / Design Approval

- [x] Create a redesigned Brody Billings homepage sample.
- [x] Use the Brody family hero image.
- [x] Add personal brand hero section.
- [x] Keep hero name on one line without covering faces.
- [x] Replace "operator" wording with "builder" wording.
- [x] Remove unsupported MBA claim.
- [x] Remove unsupported annual franchise revenue claim.
- [x] Add About section.
- [x] Add stats/cards section.
- [x] Add consulting framework / method section.
- [x] Add offer cards for Finance, Strategy, AI, and Automation.
- [x] Fix hover readability on buttons.
- [x] Fix navbar hover treatment.
- [x] Improve offer cards so they feel more designed.
- [x] Keep Automation title readable on one line on desktop.
- [x] Add portfolio/ventures section.
- [x] Organize current content into basic categories: Current Companies, Investments, Operating Experience.
- [x] Add Real Estate / properties section.
- [x] Improve property cards beyond simple boxes.
- [x] Add proof/testimonial section.
- [x] Add footer/contact section.
- [x] Make current page responsive.
- [ ] Get Brody's explicit approval on design direction.
- [ ] Collect specific feedback: likes, dislikes, confusing sections, missing assets.
- [ ] Finalize logo direction.
- [ ] Finalize brand colors/style direction.
- [ ] Finalize current section order.
- [ ] Finalize current homepage copy.
- [ ] Finalize which current businesses should be shown.
- [ ] Collect final business descriptions.
- [ ] Collect final website links/subdomains.
- [ ] Collect final images/logos/testimonials/media assets.
- [ ] Decide which sections are must-have now versus later.

### Phase 2: Modular Content Architecture

- [x] Current page uses local structured arrays for some content.
- [x] Move ventures/businesses into a dedicated structured data file.
- [x] Add complete venture fields: name, category, status, logo, description, website, images, CTA, tags, featured flag.
- [x] Support hiding ventures without deleting content.
- [x] Support reordering ventures without redesigning the page.
- [x] Support adding new ventures without editing layout code.
- [x] Decide whether content should live in JSON, CMS, database, GHL custom objects, or another source.
- [x] Build reusable section components.
- [x] Build reusable venture/card components.

### Phase 3: GoHighLevel Funnel / CRM Integration

- [ ] Decide GHL account/subaccount structure.
- [ ] Fix GHL custom field conflicts.
- [ ] Standardize custom field naming with `MS_` or another namespace.
- [ ] Build contact form or guided intake form.
- [ ] Send form submissions to GoHighLevel.
- [ ] Create/update GHL contacts.
- [ ] Attach tags to contacts.
- [ ] Route leads by reason for visit.
- [ ] Track lead source.
- [ ] Test form save in GHL.
- [ ] Test live submission.
- [ ] Confirm all custom fields populate in CRM.
- [ ] Connect Gmail if needed.
- [ ] Connect Calendly if needed.

### Phase 4: Personalized URLs

- [ ] Define URL structure for personalized pages.
- [ ] Build dynamic route support for `/bruce`, `/chris`, `/peak`, `/audit`, etc.
- [ ] Decide what data source powers each personalized page.
- [ ] Load different messaging by visitor/page.
- [ ] Load different offers by visitor/page.
- [ ] Load different venture cards by visitor/page.
- [ ] Load different testimonials by visitor/page.
- [ ] Load different CTAs by visitor/page.
- [ ] Add safe fallback for unknown/low-confidence visitors.

### Phase 5: Recognition / Identity Confidence

- [ ] Store returning visitor cookie.
- [ ] Add unique tracked links from email/text.
- [ ] Add UTM capture.
- [ ] Add CRM tracking-link support.
- [ ] Match form phone/email to CRM contact.
- [ ] Add confidence score model.
- [ ] Define personalization rules for each confidence tier.
- [ ] Prevent private content from rendering below verified confidence.
- [ ] Add secure token or verification flow for private portal mode.

### Phase 6: Smart Intake / Qualification Engine

- [ ] Design fake-chat guided form UX.
- [ ] Capture name.
- [ ] Capture phone.
- [ ] Capture email.
- [ ] Capture company.
- [ ] Capture reason for visit.
- [ ] Add audit/qualification questions.
- [ ] Add scoring logic.
- [ ] Route scored leads into GHL pipelines.
- [ ] Trigger booking/deposit workflows if required.
- [ ] Add confirmation/follow-up automation.

### Phase 7: AI Features

- [ ] Define AI assistant purpose and safe boundaries.
- [ ] Build AI chat or assistant entry point.
- [ ] Give AI approved knowledge about Brody, Monument Solutions, companies, and services.
- [ ] Support AI conversations on personalized pages.
- [ ] Build AI tools/assessments.
- [ ] Build diagnostic/calculator experiences.
- [ ] Build testimonial chatbot.
- [ ] Build Google review auto-reply service.
- [ ] Build customer review email workflow.

### Phase 8: Analytics

- [ ] Add analytics tool decision.
- [ ] Track page views.
- [ ] Track CTA clicks.
- [ ] Track form starts/completions.
- [ ] Track lead source.
- [ ] Track venture card engagement.
- [ ] Track personalized page engagement.
- [ ] Track returning visitors.
- [ ] Feed relevant analytics back into CRM where useful.

### Phase 9: Properties / Investments Platform

- [x] Add basic Real Estate section on current homepage.
- [x] Add dedicated `/properties` listing page.
- [x] Show a few property listings on the homepage with a button to view all listings.
- [x] Define initial property listing data model.
- [ ] Replace placeholder property inventory with Brody's real property list.
- [ ] Decide whether to build separate property management/listing website beyond `/properties`.
- [ ] Add individual property detail pages.
- [ ] Add property images.
- [ ] Add property status: for sale, under contract, sold, leased, etc.
- [ ] Add inquiry form for properties.
- [ ] Route property inquiries into GHL.
- [ ] Add call tracking/Twilio if needed.

### Phase 10: Additional Business Websites

- [ ] Confirm which websites are in scope now.
- [ ] Confirm which websites Adam owns or wants to handle.
- [ ] Arctic Peaks site scope.
- [ ] WW Custom Design site scope.
- [ ] Capital Bookkeeping Solutions site scope.
- [ ] Halifax Flooring site scope.
- [ ] Immigration law website scope.
- [ ] Pressure washing site scope.
- [ ] Regenerative Research Group site scope.
- [ ] Multiple lead acquisition websites scope.
- [ ] Define shared design/component system across related websites.
- [ ] Define shared CRM/funnel architecture across related websites.

### Phase 11: Twilio / Call Tracking

- [ ] Decide which phone numbers are needed.
- [ ] Set up Twilio number for real estate if required.
- [ ] Configure call forwarding.
- [ ] Track lead source by number/campaign.
- [ ] Send call metadata into GHL.
- [ ] Connect calls to property/business pipelines.

## Open Clarifications Needed

- Is Phase 1 only the Brody Billings homepage redesign, or should Monument Solutions pages also be included now?
- Which logo should be used for Brody Billings and Monument Solutions?
- What are the final brand colors/style references?
- Which ventures are approved to show publicly right now?
- Which ventures are investments versus client projects versus owned companies?
- Which businesses need links, and what are the correct URLs?
- Which content is private and must never show without verification?
- Should the first GHL integration be a simple contact form, an audit form, or the full guided intake?
- Does Brody want booking through Calendly, GHL calendars, or both?
- Which analytics tool should be used?
- Which additional sites are actually in the current paid scope?
- Does the property website belong inside BrodyBillings.com or as a separate site?

## Development

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

Build:

```bash
npm run build
```

Lint:

```bash
npm run lint
```
