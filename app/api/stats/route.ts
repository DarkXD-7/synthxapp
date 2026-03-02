import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const BOT_URL = process.env.BOT_API_URL || "http://localhost:8000";
const BOT_KEY = process.env.BOT_API_KEY || "";

export async function GET() {
  try {
    const res = await fetch(`${BOT_URL}/api/stats`, {
      headers: { "X-API-Key": BOT_KEY },
      cache: "no-store",
      signal: AbortSignal.timeout(5000), // 5s timeout
    });

    if (!res.ok) throw new Error(`Bot API returned ${res.status}`);

    const data = await res.json();

    // Normalize the response to ensure all fields exist
    return NextResponse.json(
      {
        servers: data.servers ?? 0,
        users: data.users ?? 0,
        ping: data.ping ?? 0,
        uptime: data.uptime ?? "Offline",
        commands: data.commands ?? 0,
        online: true,
      },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate",
        },
      }
    );
  } catch (err) {
    console.error("[/api/stats] Bot unreachable:", err);
    return NextResponse.json(
      {
        servers: 0,
        users: 0,
        ping: 0,
        uptime: "Offline",
        commands: 0,
        online: false,
      },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate",
        },
      }
    );
  }
}
