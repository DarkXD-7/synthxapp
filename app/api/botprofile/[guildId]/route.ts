import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";;

export const dynamic = "force-dynamic";

const BOT_API_URL = process.env.BOT_API_URL || "";
const BOT_API_KEY = process.env.BOT_API_KEY || "";

export async function POST(
  request: NextRequest,
  context: { params: { guildId: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.accessToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { guildId } = context.params;
  const body = await request.json();
  const { action, url, text } = body;

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
    return NextResponse.json({ error: "Cannot verify premium status" }, { status: 503 });
  }

  // Forward to bot
  try {
    const res = await fetch(`${BOT_API_URL}/api/botprofile/${guildId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": BOT_API_KEY,
      },
      body: JSON.stringify({ action, url, text }),
      signal: AbortSignal.timeout(15000),
    });

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json({ error: data.error || "Bot API error" }, { status: res.status });
    }

    return NextResponse.json(data);
  } catch (e) {
    return NextResponse.json({ error: "Bot API unreachable" }, { status: 503 });
  }
}
