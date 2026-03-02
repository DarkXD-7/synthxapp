import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getUserGuilds, hasManageGuild } from "@/lib/discord";

export const dynamic = "force-dynamic";

const BOT_URL = process.env.BOT_API_URL || "http://localhost:8000";
const BOT_KEY = process.env.BOT_API_KEY || "";

function botFetch(path: string, init?: RequestInit) {
  return fetch(`${BOT_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      "X-API-Key": BOT_KEY,
      ...(init?.headers ?? {}),
    },
    cache: "no-store",
    signal: AbortSignal.timeout(12000),
  });
}

// antinuke: owner OR extraowner can manage (bot checks itself too)
// emergency: server owner only
const EMERGENCY_ONLY = new Set(["emergency"]);

// ── GET /api/settings/[guildId] ──────────────────────────────────────────────
export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ guildId: string }> }
) {
  const session = await getServerSession(authOptions);
  const { guildId } = await context.params;

  if (!session?.accessToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // ONE Discord API call
  let userGuild: Awaited<ReturnType<typeof getUserGuilds>>[number] | undefined;
  try {
    const userGuilds = await getUserGuilds(session.accessToken as string);
    userGuild = userGuilds.find((g) => g.id === guildId);
  } catch {
    return NextResponse.json({ error: "Failed to verify permissions" }, { status: 500 });
  }

  if (!userGuild) {
    return NextResponse.json({ error: "You are not a member of this server" }, { status: 403 });
  }
  if (!hasManageGuild(userGuild)) {
    return NextResponse.json({ error: "You need Manage Server permission" }, { status: 403 });
  }

  try {
    const res = await botFetch(`/api/settings/${guildId}`);

    if (!res.ok) {
      const text = await res.text();
      console.error(`[settings GET] Bot API ${res.status}:`, text);
      return NextResponse.json(
        { error: `Bot API returned ${res.status}. Is the bot online?` },
        { status: 502 }
      );
    }

    const data = await res.json();

    // Attach owner/extraOwner status — no second Discord API call
    if (data.guild) {
      const isDiscordOwner = userGuild.owner === true;
      // Check if user is an extraowner (bot returns this in antinuke.extraOwner)
      const extraOwnerId = data.antinuke?.extraOwner as string | null | undefined;
      const isExtraOwner = Boolean(extraOwnerId && extraOwnerId === String(session.user?.id ?? ""));
      data.guild.userIsOwner    = isDiscordOwner || isExtraOwner;
      data.guild.isDiscordOwner = isDiscordOwner;
    }

    return NextResponse.json(data, {
      headers: { "Cache-Control": "no-store, no-cache, must-revalidate" },
    });
  } catch (err) {
    console.error("[settings GET] Error:", err);
    return NextResponse.json(
      { error: "Cannot reach bot API. Make sure the bot is running." },
      { status: 502 }
    );
  }
}

// ── POST /api/settings/[guildId] ─────────────────────────────────────────────
export async function POST(
  req: NextRequest,
  context: { params: Promise<{ guildId: string }> }
) {
  const session = await getServerSession(authOptions);
  const { guildId } = await context.params;

  if (!session?.accessToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { module?: string; settings?: Record<string, unknown> };
  try { body = await req.json(); }
  catch { return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 }); }

  const { module, settings } = body;
  if (!module)    return NextResponse.json({ error: "Missing module" },   { status: 400 });
  if (!settings)  return NextResponse.json({ error: "Missing settings" }, { status: 400 });

  // ONE Discord API call for POST too
  let userGuild: Awaited<ReturnType<typeof getUserGuilds>>[number] | undefined;
  try {
    const userGuilds = await getUserGuilds(session.accessToken as string);
    userGuild = userGuilds.find((g) => g.id === guildId);
  } catch {
    return NextResponse.json({ error: "Failed to verify permissions" }, { status: 500 });
  }

  if (!userGuild) return NextResponse.json({ error: "You are not a member of this server" }, { status: 403 });
  if (!hasManageGuild(userGuild)) return NextResponse.json({ error: "You need Manage Server permission" }, { status: 403 });

  // Emergency: server owner only
  if (EMERGENCY_ONLY.has(module) && !userGuild.owner) {
    return NextResponse.json(
      { error: "Only the server owner can use Emergency mode", ownerOnly: true },
      { status: 403 }
    );
  }

  try {
    const res = await botFetch(`/api/settings/${guildId}`, {
      method: "POST",
      body: JSON.stringify({ module, settings }),
    });

    const data = await res.json();
    if (!res.ok) {
      return NextResponse.json(
        { error: data?.error || `Bot API returned ${res.status}` },
        { status: res.status }
      );
    }

    return NextResponse.json(data);
  } catch (err) {
    console.error("[settings POST] Error:", err);
    return NextResponse.json(
      { error: "Cannot reach bot API. Make sure the bot is running." },
      { status: 502 }
    );
  }
}
