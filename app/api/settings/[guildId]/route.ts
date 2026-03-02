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
  });
}

// Modules that require the user to be the guild OWNER (not just MANAGE_GUILD)
const OWNER_ONLY_MODULES = new Set(["antinuke", "emergency"]);

// Modules that require premium
const PREMIUM_MODULES = new Set(["fortify"]);

async function verifyAccess(
  session: import("next-auth").Session | null,
  guildId: string,
  module?: string
): Promise<{ ok: true; userId: string } | { ok: false; response: NextResponse }> {
  if (!session?.accessToken) {
    return { ok: false, response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  }

  // Get the user's guilds to validate they can actually manage this guild
  try {
    const userGuilds = await getUserGuilds(session.accessToken as string);
    const guild = userGuilds.find((g) => g.id === guildId);

    if (!guild) {
      return {
        ok: false,
        response: NextResponse.json({ error: "You are not a member of this server" }, { status: 403 }),
      };
    }

    if (!hasManageGuild(guild)) {
      return {
        ok: false,
        response: NextResponse.json({ error: "You need Manage Server permission" }, { status: 403 }),
      };
    }

    // For owner-only modules, check if user is the guild owner
    if (module && OWNER_ONLY_MODULES.has(module) && !guild.owner) {
      return {
        ok: false,
        response: NextResponse.json(
          { error: "Only the server owner can modify this setting", ownerOnly: true },
          { status: 403 }
        ),
      };
    }

    return { ok: true, userId: "verified" };
  } catch (err) {
    console.error("[settings] verifyAccess error:", err);
    return {
      ok: false,
      response: NextResponse.json({ error: "Failed to verify permissions" }, { status: 500 }),
    };
  }
}

// ── GET /api/settings/[guildId] ─────────────────────────────────────────────
export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ guildId: string }> }
) {
  const session = await getServerSession(authOptions);
  const { guildId } = await context.params;

  const access = await verifyAccess(session, guildId);
  if (!access.ok) return access.response;

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

    // Attach the requesting user's guild metadata (owner status) to the response
    try {
      const userGuilds = await getUserGuilds(session!.accessToken as string);
      const guild = userGuilds.find((g) => g.id === guildId);
      if (guild && data.guild) {
        data.guild.userIsOwner = guild.owner;
      }
    } catch {
      // Non-critical
    }

    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate",
      },
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

  let body: { module?: string; settings?: Record<string, unknown> };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { module, settings } = body;

  if (!module) {
    return NextResponse.json({ error: "Missing module" }, { status: 400 });
  }

  if (settings === undefined) {
    return NextResponse.json({ error: "Missing settings" }, { status: 400 });
  }

  // Verify access, passing module for owner-only check
  const access = await verifyAccess(session, guildId, module);
  if (!access.ok) return access.response;

  // Check premium requirement before hitting bot
  if (PREMIUM_MODULES.has(module)) {
    try {
      const premRes = await botFetch(`/api/premium/${guildId}`);
      if (premRes.ok) {
        const premData = await premRes.json();
        if (!premData.premium) {
          return NextResponse.json(
            { error: "This feature requires Premium", premiumRequired: true },
            { status: 403 }
          );
        }
      }
    } catch {
      // If we can't check premium, let the bot handle it
    }
  }

  // Validate settings input (basic sanitization)
  const sanitized = sanitizeSettings(module, settings);

  try {
    const res = await botFetch(`/api/settings/${guildId}`, {
      method: "POST",
      body: JSON.stringify({ module, settings: sanitized }),
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

/**
 * Sanitize and validate settings before sending to bot.
 * Prevents injection of unexpected fields.
 */
function sanitizeSettings(
  module: string,
  settings: Record<string, unknown>
): Record<string, unknown> {
  const clean: Record<string, unknown> = {};

  switch (module) {
    case "antinuke": {
      const boolCols = [
        "antiban", "antikick", "antibotadd", "antichcr", "antichdl",
        "antieveryone", "antirlcr", "antirldl", "antiwebhookcr",
        "antiwebhookdl", "antiprune",
      ];
      for (const col of boolCols) {
        if (col in settings) clean[col] = Boolean(settings[col]);
      }
      if ("punishment" in settings && typeof settings.punishment === "string") {
        const validPunishments = ["ban", "kick", "strip_roles"];
        if (validPunishments.includes(settings.punishment)) {
          clean.punishment = settings.punishment;
        }
      }
      break;
    }

    case "automod": {
      if ("enabled" in settings) clean.enabled = Boolean(settings.enabled);
      if ("logChannel" in settings) {
        clean.logChannel = settings.logChannel ? String(settings.logChannel) : null;
      }
      if ("activeEvents" in settings && Array.isArray(settings.activeEvents)) {
        const validEvents = [
          "Anti spam", "Anti caps", "Anti link", "Anti invites",
          "Anti mass mention", "Anti emoji spam", "Anti NSFW link",
        ];
        clean.activeEvents = (settings.activeEvents as unknown[])
          .filter((e): e is string => typeof e === "string" && validEvents.includes(e));
      }
      break;
    }

    case "logging": {
      if ("channels" in settings && typeof settings.channels === "object") {
        clean.channels = settings.channels;
      }
      break;
    }

    case "welcome": {
      if ("enabled" in settings) clean.enabled = Boolean(settings.enabled);
      if ("channelId" in settings) clean.channelId = settings.channelId ? String(settings.channelId) : null;
      if ("welcomeMessage" in settings) clean.welcomeMessage = String(settings.welcomeMessage || "").slice(0, 2000);
      break;
    }

    case "leveling": {
      if ("enabled" in settings) clean.enabled = Boolean(settings.enabled);
      if ("channelId" in settings) clean.channelId = settings.channelId ? String(settings.channelId) : null;
      if ("levelMessage" in settings) clean.levelMessage = String(settings.levelMessage || "").slice(0, 500);
      if ("xpPerMessage" in settings) clean.xpPerMessage = Math.min(999, Math.max(1, Number(settings.xpPerMessage) || 20));
      if ("minXp" in settings) clean.minXp = Math.min(999, Math.max(1, Number(settings.minXp) || 15));
      if ("maxXp" in settings) clean.maxXp = Math.min(999, Math.max(1, Number(settings.maxXp) || 25));
      if ("cooldown" in settings) clean.cooldown = Math.min(3600, Math.max(1, Number(settings.cooldown) || 60));
      if ("dmLevelUp" in settings) clean.dmLevelUp = Boolean(settings.dmLevelUp);
      break;
    }

    case "autorole": {
      if ("humanRoles" in settings && Array.isArray(settings.humanRoles)) {
        clean.humanRoles = (settings.humanRoles as unknown[]).filter((r): r is string => typeof r === "string");
      }
      if ("botRoles" in settings && Array.isArray(settings.botRoles)) {
        clean.botRoles = (settings.botRoles as unknown[]).filter((r): r is string => typeof r === "string");
      }
      break;
    }

    case "fortify": {
      if ("enabled" in settings) clean.enabled = Boolean(settings.enabled);
      if ("aiEnabled" in settings) clean.aiEnabled = Boolean(settings.aiEnabled);
      if ("defenseMode" in settings) clean.defenseMode = Boolean(settings.defenseMode);
      if ("punishment" in settings && typeof settings.punishment === "string") {
        const validPunishments = ["ban", "kick", "strip_roles"];
        if (validPunishments.includes(settings.punishment)) clean.punishment = settings.punishment;
      }
      if ("logChannel" in settings) clean.logChannel = settings.logChannel ? String(settings.logChannel) : null;
      if ("banThreshold" in settings) clean.banThreshold = Math.min(20, Math.max(1, Number(settings.banThreshold) || 3));
      if ("kickThreshold" in settings) clean.kickThreshold = Math.min(20, Math.max(1, Number(settings.kickThreshold) || 5));
      if ("channelThreshold" in settings) clean.channelThreshold = Math.min(20, Math.max(1, Number(settings.channelThreshold) || 3));
      if ("roleThreshold" in settings) clean.roleThreshold = Math.min(20, Math.max(1, Number(settings.roleThreshold) || 3));
      break;
    }

    case "emergency": {
      if ("action" in settings && typeof settings.action === "string") {
        if (["activate", "restore"].includes(settings.action)) {
          clean.action = settings.action;
        }
      }
      break;
    }

    default:
      // For unknown modules, pass through but don't add extra fields
      return settings;
  }

  return clean;
}
