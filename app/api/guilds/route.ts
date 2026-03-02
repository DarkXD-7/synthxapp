import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getUserGuilds, hasManageGuild } from "@/lib/discord";

export const dynamic = "force-dynamic";

const BOT_URL = process.env.BOT_API_URL || "http://localhost:8000";
const BOT_KEY = process.env.BOT_API_KEY || "";

// Fetch bot's guild list from the bot's own cache (instant — no Discord API call)
async function getBotGuildSet(): Promise<Set<string>> {
  try {
    const res = await fetch(`${BOT_URL}/api/guilds`, {
      headers: { "X-API-Key": BOT_KEY },
      cache: "no-store",
      signal: AbortSignal.timeout(4000), // 4s timeout max
    });
    if (!res.ok) return new Set();
    const guilds: { id: string }[] = await res.json();
    return new Set(guilds.map((g) => g.id));
  } catch {
    return new Set();
  }
}

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.accessToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Run both fetches IN PARALLEL — this is the main speed fix
    const [userGuilds, botGuildSet] = await Promise.all([
      getUserGuilds(session.accessToken as string),
      getBotGuildSet(),
    ]);

    if (!userGuilds || userGuilds.length === 0) {
      return NextResponse.json([]);
    }

    const result = userGuilds
      .filter(hasManageGuild)
      .map((g) => ({
        id:          g.id,
        name:        g.name,
        icon:        g.icon,
        owner:       g.owner,
        permissions: g.permissions,
        botPresent:  botGuildSet.has(g.id),
      }))
      .sort((a, b) => {
        if (b.botPresent !== a.botPresent) return b.botPresent ? 1 : -1;
        return a.name.localeCompare(b.name);
      });

    return NextResponse.json(result, {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (err) {
    console.error("[/api/guilds] Error:", err);
    return NextResponse.json({ error: "Failed to fetch guilds" }, { status: 500 });
  }
}
