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
    // Fetch user's guilds via their OAuth token
    const userGuilds = await getUserGuilds(session.accessToken as string);

    if (!userGuilds || userGuilds.length === 0) {
      return NextResponse.json([]);
    }

    // Filter only guilds where user has MANAGE_GUILD permission (bit 0x20) or is owner
    const manageable = userGuilds.filter(hasManageGuild);

    // Fetch bot's guild IDs (via bot token — fastest & most accurate)
    const botGuildIds = await getBotGuilds();
    const botSet = new Set(botGuildIds);

    // Intersect: mark each manageable guild with whether bot is present
    const result = manageable.map((g) => ({
      id: g.id,
      name: g.name,
      icon: g.icon,
      owner: g.owner,
      permissions: g.permissions,
      botPresent: botSet.has(g.id),
    }));

    // Bot-present first, then alphabetically
    result.sort((a, b) => {
      if (b.botPresent !== a.botPresent) return b.botPresent ? 1 : -1;
      return a.name.localeCompare(b.name);
    });

    return NextResponse.json(result, {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate",
        "Pragma": "no-cache",
      },
    });
  } catch (err) {
    console.error("[/api/guilds] Error:", err);
    return NextResponse.json({ error: "Failed to fetch guilds" }, { status: 500 });
  }
}
