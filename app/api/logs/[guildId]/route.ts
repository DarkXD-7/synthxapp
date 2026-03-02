import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const dynamic = "force-dynamic";

const BOT_URL = process.env.BOT_API_URL || "http://localhost:8000";
const BOT_KEY = process.env.BOT_API_KEY || "";

export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ guildId: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { guildId } = await context.params;

  try {
    const res = await fetch(`${BOT_URL}/api/logs/${guildId}`, {
      headers: { "X-API-Key": BOT_KEY },
      cache: "no-store",
      signal: AbortSignal.timeout(8000),
    });

    if (!res.ok) throw new Error(`Bot API returned ${res.status}`);

    const data = await res.json();

    return NextResponse.json(Array.isArray(data) ? data : [], {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (err) {
    console.error(`[/api/logs/${guildId}] Error:`, err);
    return NextResponse.json(
      [
        {
          timestamp: new Date().toISOString(),
          level: "warn",
          module: "System",
          message: "Cannot reach bot API. Is the bot running and is BOT_API_URL set correctly?",
        },
      ],
      { headers: { "Cache-Control": "no-store" } }
    );
  }
}
