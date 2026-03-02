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
    const res = await fetch(`${BOT_URL}/api/premium/${guildId}`, {
      headers: { "X-API-Key": BOT_KEY },
      cache: "no-store",
    });

    if (!res.ok) {
      return NextResponse.json({ premium: false, error: "Bot offline" });
    }

    const data = await res.json();
    return NextResponse.json(data, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch {
    return NextResponse.json({ premium: false, error: "Cannot reach bot" });
  }
}
