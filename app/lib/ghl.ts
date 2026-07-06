/**
 * GoHighLevel (LeadConnector) API v2 client.
 *
 * Everything is env-driven and degrades gracefully:
 * - GHL_API_TOKEN      Private Integration token (Settings → Private Integrations)
 * - GHL_LOCATION_ID    Sub-account location id
 * - GHL_WEBHOOK_URL    Optional inbound-webhook workflow trigger; every lead
 *                      payload is mirrored there when set.
 */

const GHL_BASE = "https://services.leadconnectorhq.com";
const GHL_VERSION = "2021-07-28";

export const ghlConfigured = () =>
  Boolean(process.env.GHL_API_TOKEN && process.env.GHL_LOCATION_ID);

const ghlHeaders = () => ({
  Authorization: `Bearer ${process.env.GHL_API_TOKEN}`,
  Version: GHL_VERSION,
  "Content-Type": "application/json",
  Accept: "application/json",
});

export type GhlCustomValue = { id: string; name: string; value: string };

/**
 * Location custom values, cached and tagged so `/api/revalidate` (or a GHL
 * workflow webhook) can bust the cache after edits inside GHL.
 */
export async function fetchCustomValues(): Promise<GhlCustomValue[]> {
  if (!ghlConfigured()) return [];

  try {
    const res = await fetch(
      `${GHL_BASE}/locations/${process.env.GHL_LOCATION_ID}/customValues`,
      {
        headers: ghlHeaders(),
        next: { revalidate: 300, tags: ["ghl-content"] },
      },
    );

    if (!res.ok) {
      console.warn(`GHL custom values request failed: ${res.status}`);
      return [];
    }

    const data = (await res.json()) as { customValues?: GhlCustomValue[] };
    return data.customValues ?? [];
  } catch (error) {
    console.warn("GHL custom values request errored", error);
    return [];
  }
}

export type GhlCustomField = { key: string; field_value: string };

export type GhlContactPayload = {
  firstName?: string;
  lastName?: string;
  name?: string;
  email?: string;
  phone?: string;
  companyName?: string;
  source?: string;
  tags?: string[];
  customFields?: GhlCustomField[];
};

export type DeliveryReport = {
  api: boolean;
  webhook: boolean;
  contactId: string | null;
  errors: string[];
};

/** Create-or-update a contact keyed on email/phone. */
export async function upsertContact(
  payload: GhlContactPayload,
): Promise<{ ok: boolean; contactId: string | null; error?: string }> {
  if (!ghlConfigured()) {
    return { ok: false, contactId: null, error: "GHL API not configured" };
  }

  try {
    const res = await fetch(`${GHL_BASE}/contacts/upsert`, {
      method: "POST",
      headers: ghlHeaders(),
      body: JSON.stringify({
        locationId: process.env.GHL_LOCATION_ID,
        ...payload,
      }),
    });

    const body = (await res.json().catch(() => ({}))) as {
      contact?: { id?: string };
      message?: string | string[];
    };

    if (!res.ok) {
      const message = Array.isArray(body.message)
        ? body.message.join("; ")
        : (body.message ?? `HTTP ${res.status}`);
      return { ok: false, contactId: null, error: message };
    }

    return { ok: true, contactId: body.contact?.id ?? null };
  } catch (error) {
    return { ok: false, contactId: null, error: String(error) };
  }
}

/**
 * Create an opportunity in the Audit Pipeline (optional — requires
 * GHL_PIPELINE_ID and GHL_PIPELINE_STAGE_ID). Lets the site drop qualified
 * leads straight into the pipeline so no GHL workflow step is needed for it.
 */
export async function createOpportunity(input: {
  contactId: string;
  name: string;
  monetaryValue: number;
}): Promise<{ ok: boolean; error?: string }> {
  const pipelineId = process.env.GHL_PIPELINE_ID;
  const pipelineStageId = process.env.GHL_PIPELINE_STAGE_ID;
  if (!ghlConfigured() || !pipelineId || !pipelineStageId) {
    return { ok: false, error: "pipeline not configured" };
  }

  try {
    const res = await fetch(`${GHL_BASE}/opportunities/`, {
      method: "POST",
      headers: ghlHeaders(),
      body: JSON.stringify({
        locationId: process.env.GHL_LOCATION_ID,
        pipelineId,
        pipelineStageId,
        contactId: input.contactId,
        name: input.name,
        monetaryValue: input.monetaryValue,
        status: "open",
      }),
    });
    if (!res.ok) {
      const body = (await res.json().catch(() => ({}))) as { message?: string | string[] };
      const message = Array.isArray(body.message)
        ? body.message.join("; ")
        : (body.message ?? `HTTP ${res.status}`);
      return { ok: false, error: message };
    }
    return { ok: true };
  } catch (error) {
    return { ok: false, error: String(error) };
  }
}

/** Mirror the raw lead payload to a GHL inbound-webhook workflow trigger. */
export async function forwardToWebhook(payload: unknown): Promise<{
  ok: boolean;
  error?: string;
}> {
  const url = process.env.GHL_WEBHOOK_URL;
  if (!url) return { ok: false, error: "GHL_WEBHOOK_URL not configured" };

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) return { ok: false, error: `HTTP ${res.status}` };
    return { ok: true };
  } catch (error) {
    return { ok: false, error: String(error) };
  }
}
