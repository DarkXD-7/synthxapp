import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const dynamic = "force-dynamic";

const BOT_URL = process.env.BOT_API_URL || "";
const BOT_KEY = process.env.BOT_API_KEY || "";

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ guildId: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.accessToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { guildId } = await context.params;

  let body: Record<string, unknown>;
  try { body = await request.json(); }
  catch { return NextResponse.json({ error: "Invalid JSON" }, { status: 400 }); }

  const { action, iconBase64, bannerBase64, aboutText } = body as {
    action?: string;
    iconBase64?: string;
    bannerBase64?: string;
    aboutText?: string;
  };

  if (!action) {
    return NextResponse.json({ error: "Missing action" }, { status: 400 });
  }

  if (!BOT_URL) {
    return NextResponse.json({ error: "Bot API URL not configured" }, { status: 503 });
  }

  // Check premium — but give a clear error, not "unreachable"
  try {
    const premRes = await fetch(`${BOT_URL}/api/premium/${guildId}`, {
      headers: { "X-API-Key": BOT_KEY },
      signal: AbortSignal.timeout(6000),
      cache: "no-store",
    });
    if (premRes.ok) {
      const premData = await premRes.json();
      if (!premData.premium) {
        return NextResponse.json(
          { error: "Premium required for Bot Profile customization", premiumRequired: true },
          { status: 403 }
        );
      }
    } else {
      // If premium check fails with non-ok status, still try to proceed
      // (bot will do its own check and reject if needed)
      console.warn("[botprofile] Premium check returned", premRes.status);
    }
  } catch (e) {
    // Premium endpoint unreachable — let the bot reject it if needed
    console.warn("[botprofile] Could not check premium:", e);
  }

  // Build payload with correct field names that the bot expects
  const payload: Record<string, unknown> = { action };
  if (iconBase64)   payload.iconBase64   = iconBase64;
  if (bannerBase64) payload.bannerBase64 = bannerBase64;
  if (aboutText)    payload.aboutText    = aboutText;

  try {
    const res = await fetch(`${BOT_URL}/api/botprofile/${guildId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": BOT_KEY,
      },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(20000), // 20s — image upload is slow
    });

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json(
        { error: data.error || `Bot returned ${res.status}` },
        { status: res.status }
      );
    }

    return NextResponse.json(data);
  } catch (e) {
    console.error("[botprofile] Bot API error:", e);
    return NextResponse.json(
      { error: "Could not reach bot. Make sure it is running." },
      { status: 503 }
    );
  }
}
