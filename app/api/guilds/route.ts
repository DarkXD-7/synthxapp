import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getUserGuilds, getBotGuilds, hasManageGuild } from "@/lib/discord";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.accessToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Run BOTH fetches at the same time instead of one after the other
    // This is the only change from the original — cuts load time in half
    const [userGuilds, botGuildIds] = await Promise.all([
      getUserGuilds(session.accessToken as string),
      getBotGuilds(),
    ]);

    if (!userGuilds || userGuilds.length === 0) {
      return NextResponse.json([]);
    }

    const botSet = new Set(botGuildIds);

    const result = userGuilds
      .filter(hasManageGuild)
      .map((g) => ({
        id:          g.id,
        name:        g.name,
        icon:        g.icon,
        owner:       g.owner,
        permissions: g.permissions,
        botPresent:  botSet.has(g.id),
      }))
      .sort((a, b) => {
        if (b.botPresent !== a.botPresent) return b.botPresent ? 1 : -1;
        return a.name.localeCompare(b.name);
      });

    return NextResponse.json(result, {
      headers: { "Cache-Control": "no-store, no-cache, must-revalidate" },
    });
  } catch (err) {
    console.error("[/api/guilds] Error:", err);
    return NextResponse.json({ error: "Failed to fetch guilds" }, { status: 500 });
  }
}
