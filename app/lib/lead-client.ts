/** Browser-side helpers shared by every lead form. */

const readCookie = (name: string): string | null => {
  const match = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${name}=`));
  return match ? decodeURIComponent(match.slice(name.length + 1)) : null;
};

export function setProfileCookie(slug: string, tags: string[]) {
  const maxAge = 60 * 60 * 24 * 180;
  document.cookie = `bb_profile=${encodeURIComponent(slug)}; max-age=${maxAge}; path=/; samesite=lax`;
  document.cookie = `bb_profile_tags=${encodeURIComponent(tags.join(","))}; max-age=${maxAge}; path=/; samesite=lax`;
}

export function leadContext() {
  let utm: Record<string, string> = {};
  try {
    utm = JSON.parse(readCookie("bb_utm") ?? "{}") as Record<string, string>;
  } catch {
    utm = {};
  }

  return {
    page: window.location.pathname,
    profile: readCookie("bb_profile") ?? undefined,
    profileTags: (readCookie("bb_profile_tags") ?? "").split(",").filter(Boolean),
    utm,
    visitorId: readCookie("bb_vid") ?? undefined,
    referrer: document.referrer || undefined,
  };
}

export async function submitLead(payload: Record<string, unknown>): Promise<boolean> {
  try {
    const res = await fetch("/api/lead", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...payload, context: leadContext() }),
    });
    return res.ok;
  } catch {
    return false;
  }
}
