// app/api/stats/route.ts
// Fixed stats route — returns online status + ping even when bot restarts

import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";

const BOT_URL = process.env.BOT_API_URL || "";
const BOT_KEY = process.env.BOT_API_KEY || "";

export async function GET() {
  try {
    const res = await fetch(`${BOT_URL}/api/stats`, {
      headers: { "X-API-Key": BOT_KEY, "Content-Type": "application/json" },
      cache: "no-store",
      signal: AbortSignal.timeout(5000), // 5s timeout
    });

    if (!res.ok) {
      return NextResponse.json({ online: false, servers: 0, users: 0, ping: 0, uptime: "Offline", commands: 120 });
    }

    const data = await res.json();
    return NextResponse.json({ online: true, ...data });
  } catch {
    // Bot is offline or restarting — return graceful offline state
    return NextResponse.json({ online: false, servers: 0, users: 0, ping: 0, uptime: "Offline", commands: 120 });
  }
}
