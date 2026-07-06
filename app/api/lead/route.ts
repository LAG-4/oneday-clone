import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  createOpportunity,
  forwardToWebhook,
  ghlConfigured,
  upsertContact,
  type GhlCustomField,
} from "../../lib/ghl";
import {
  describeAnswers,
  scoreQualification,
  type QualificationAnswers,
} from "../../lib/scoring";

type LeadBody = {
  type: "qualification" | "property" | "contact";
  contact: {
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    company?: string;
    role?: string;
  };
  qualification?: QualificationAnswers;
  property?: { id: string; title: string };
  message?: string;
  context?: {
    page?: string;
    profile?: string;
    profileTags?: string[];
    utm?: Record<string, string>;
    visitorId?: string;
    referrer?: string;
  };
};

const clean = (value: unknown) =>
  typeof value === "string" ? value.trim().slice(0, 500) : "";

export async function POST(request: NextRequest) {
  let body: LeadBody;
  try {
    body = (await request.json()) as LeadBody;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const email = clean(body.contact?.email);
  const phone = clean(body.contact?.phone);
  if (!email && !phone) {
    return NextResponse.json(
      { ok: false, error: "Email or phone is required" },
      { status: 400 },
    );
  }

  const firstName = clean(body.contact?.firstName);
  const lastName = clean(body.contact?.lastName);
  const company = clean(body.contact?.company);
  const role = clean(body.contact?.role);
  const page = clean(body.context?.page) || "/";
  const profile = clean(body.context?.profile);

  const tags = new Set<string>(["website-lead", `lead-${body.type}`]);
  const customFields: GhlCustomField[] = [];
  let result: ReturnType<typeof scoreQualification> | null = null;

  if (body.type === "qualification" && body.qualification) {
    // Score server-side; never trust a score computed in the browser.
    result = scoreQualification(body.qualification);
    const described = describeAnswers(body.qualification);

    tags.add("interested-in-audit");
    tags.add(`audit-${result.tier.toLowerCase()}`);
    tags.add(`fit-${result.fit}`);

    customFields.push(
      { key: "ms_functional_scope", field_value: described.functionalScope },
      { key: "ms_locations", field_value: described.locations },
      { key: "ms_annual_revenue", field_value: described.annualRevenue },
      { key: "ms_employee_range", field_value: described.employeeRange },
      { key: "ms_industry", field_value: described.industry },
      { key: "ms_system_fragmentation", field_value: described.systemFragmentation },
      { key: "ms_decision_complexity", field_value: described.decisionComplexity },
      { key: "ms_buying_timeline", field_value: described.buyingTimeline },
      { key: "ms_audit_goal", field_value: described.auditGoal },
      { key: "ms_audit_acknowledgement", field_value: described.auditAcknowledgement },
      { key: "ms_complexity_score", field_value: String(result.score) },
      { key: "ms_estimated_tier", field_value: result.tier },
      { key: "ms_fit_status", field_value: result.fit },
    );
  }

  if (body.type === "property" && body.property) {
    tags.add("property-inquiry");
    tags.add(`property-${clean(body.property.id) || "unknown"}`);
    customFields.push({
      key: "ms_property_interest",
      field_value: clean(body.property.title),
    });
  }

  if (role) customFields.push({ key: "ms_role_title", field_value: role });
  if (clean(body.message)) {
    customFields.push({ key: "ms_message", field_value: clean(body.message) });
  }
  if (clean(body.context?.visitorId)) {
    customFields.push({
      key: "ms_visitor_id",
      field_value: clean(body.context?.visitorId),
    });
  }

  if (profile) tags.add(`profile-${profile}`);
  for (const tag of body.context?.profileTags ?? []) {
    if (typeof tag === "string" && tag.trim()) tags.add(tag.trim());
  }

  const utm = body.context?.utm ?? {};
  for (const [key, value] of Object.entries(utm)) {
    if (/^utm_[a-z]+$/.test(key) && typeof value === "string" && value) {
      customFields.push({ key, field_value: clean(value) });
    }
  }

  const payload = {
    firstName: firstName || undefined,
    lastName: lastName || undefined,
    email: email || undefined,
    phone: phone || undefined,
    companyName: company || undefined,
    source: `brodybillings.com${page}`,
    tags: [...tags],
    customFields: customFields.length ? customFields : undefined,
  };

  const webhookPayload = {
    ...payload,
    role: role || undefined,
    message: clean(body.message) || undefined,
    property: body.property ?? undefined,
    qualification: body.qualification
      ? { ...describeAnswers(body.qualification), ...result }
      : undefined,
    context: {
      page,
      profile: profile || undefined,
      visitorId: clean(body.context?.visitorId) || undefined,
      referrer: clean(body.context?.referrer) || undefined,
      utm,
      submittedAt: new Date().toISOString(),
    },
  };

  const [api, webhook] = await Promise.all([
    ghlConfigured()
      ? upsertContact(payload)
      : Promise.resolve({ ok: false, contactId: null, error: "not configured" }),
    process.env.GHL_WEBHOOK_URL
      ? forwardToWebhook(webhookPayload)
      : Promise.resolve({ ok: false, error: "not configured" }),
  ]);

  if (!api.ok && !webhook.ok) {
    // No GHL connection yet — keep the lead visible in server logs so
    // nothing is silently lost during setup.
    console.warn("Lead received but GHL is not connected:", JSON.stringify(webhookPayload));
  } else if (!api.ok && ghlConfigured()) {
    console.error("GHL contact upsert failed:", api.error);
  }

  // Qualified audit applications go straight into the Audit Pipeline when
  // the pipeline env vars are set; T3 stays at 0 (custom-scoped pricing).
  if (api.ok && api.contactId && result && result.fit === "qualified") {
    const tierValue = result.tier === "T1" ? 3000 : result.tier === "T2" ? 5000 : 0;
    const opportunity = await createOpportunity({
      contactId: api.contactId,
      name: `Audit — ${company || firstName || email || "Website lead"} (${result.tier})`,
      monetaryValue: tierValue,
    });
    if (!opportunity.ok && opportunity.error !== "pipeline not configured") {
      console.error("GHL opportunity creation failed:", opportunity.error);
    }
  }

  return NextResponse.json({
    ok: true,
    delivered: { api: api.ok, webhook: webhook.ok },
    fit: result?.fit ?? null,
  });
}
