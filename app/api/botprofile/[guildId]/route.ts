import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const dynamic = "force-dynamic";

const BOT_API_URL = process.env.BOT_API_URL || "";
const BOT_API_KEY = process.env.BOT_API_KEY || "";

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ guildId: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.accessToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { guildId } = await context.params;
  const body = await request.json();
  const { action, iconBase64, bannerBase64, aboutText } = body;

  if (!action) {
    return NextResponse.json({ error: "Missing action" }, { status: 400 });
  }

  // Check premium
  try {
    const premRes = await fetch(`${BOT_API_URL}/api/premium/${guildId}`, {
      headers: { "X-API-Key": BOT_API_KEY },
      signal: AbortSignal.timeout(5000),
    });
    const premData = await premRes.json();
    if (!premData.premium) {
      return NextResponse.json({ error: "Premium required for bot profile customization" }, { status: 403 });
    }
  } catch {
    return NextResponse.json({ error: "Bot API unreachable — cannot verify premium" }, { status: 503 });
  }

  // Forward to bot with the right field names it expects
  try {
    const payload: Record<string, unknown> = { action };
    if (iconBase64)   payload.iconBase64   = iconBase64;
    if (bannerBase64) payload.bannerBase64 = bannerBase64;
    if (aboutText)    payload.aboutText    = aboutText;

    const res = await fetch(`${BOT_API_URL}/api/botprofile/${guildId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": BOT_API_KEY,
      },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(20000), // 20s — image upload can be slow
    });

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json({ error: data.error || "Bot API error" }, { status: res.status });
    }

    return NextResponse.json(data);
  } catch (e) {
    console.error("[botprofile] Error:", e);
    return NextResponse.json({ error: "Bot API unreachable" }, { status: 503 });
  }
}
