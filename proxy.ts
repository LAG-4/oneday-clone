import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"];
const YEAR = 60 * 60 * 24 * 365;
const MONTH = 60 * 60 * 24 * 30;

/**
 * Recognition layer, phase one: give every visitor a stable anonymous id and
 * remember how they arrived. Forms read these cookies and send them to GHL,
 * which is what later powers returning-visitor confidence scoring.
 */
export function proxy(request: NextRequest) {
  const response = NextResponse.next();

  if (!request.cookies.get("bb_vid")) {
    response.cookies.set("bb_vid", crypto.randomUUID(), {
      maxAge: YEAR,
      sameSite: "lax",
      path: "/",
    });
  }

  const utm: Record<string, string> = {};
  for (const key of UTM_KEYS) {
    const value = request.nextUrl.searchParams.get(key);
    if (value) utm[key] = value.slice(0, 200);
  }
  if (Object.keys(utm).length > 0) {
    response.cookies.set("bb_utm", JSON.stringify(utm), {
      maxAge: MONTH,
      sameSite: "lax",
      path: "/",
    });
  }

  return response;
}

export const config = {
  // Skip static assets and API routes; run on every page view.
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|brody/|dayone/|.*\\..*).*)"],
};
