import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Busts the cached GHL content so edits made in GoHighLevel appear
 * immediately instead of after the 5-minute cache window.
 *
 * Wire a GHL workflow webhook (or hit it manually) with:
 *   POST /api/revalidate?secret=<REVALIDATE_SECRET>
 */
export async function POST(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get("secret");

  if (!process.env.REVALIDATE_SECRET || secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ ok: false, error: "Invalid secret" }, { status: 401 });
  }

  revalidateTag("ghl-content", "max");
  return NextResponse.json({ ok: true, revalidated: "ghl-content" });
}
