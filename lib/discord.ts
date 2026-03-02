const DISCORD_API = "https://discord.com/api/v10";
const MANAGE_GUILD = 0x20;
const ADMINISTRATOR = 0x8;

export interface DiscordGuild {
  id: string;
  name: string;
  icon: string | null;
  owner: boolean;
  permissions: string;
  features: string[];
}

export function getGuildIconUrl(guild: DiscordGuild): string {
  if (!guild.icon) return "/default-guild.png";
  const ext = guild.icon.startsWith("a_") ? "gif" : "png";
  return `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.${ext}?size=128`;
}

/**
 * Returns true if the user has MANAGE_GUILD or ADMINISTRATOR permission,
 * or is the guild owner.
 * Discord returns permissions as a decimal string — we use BigInt to handle it safely.
 */
export function hasManageGuild(guild: DiscordGuild): boolean {
  if (guild.owner) return true;
  try {
    const perms = BigInt(guild.permissions);
    const manageBit = BigInt(MANAGE_GUILD);
    const adminBit = BigInt(ADMINISTRATOR);
    return (perms & manageBit) !== BigInt(0) || (perms & adminBit) !== BigInt(0);
  } catch {
    return false;
  }
}

/**
 * Fetch all guilds the user is in via their OAuth2 access token.
 * Handles pagination (Discord returns max 200 per request).
 */
export async function getUserGuilds(accessToken: string): Promise<DiscordGuild[]> {
  const allGuilds: DiscordGuild[] = [];
  let after = "";

  for (let page = 0; page < 10; page++) {
    const url = after
      ? `${DISCORD_API}/users/@me/guilds?limit=200&after=${after}`
      : `${DISCORD_API}/users/@me/guilds?limit=200`;

    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Accept-Language": "en-US",
      },
      cache: "no-store",
    });

    if (!res.ok) {
      if (res.status === 401) throw new Error("Discord token expired or invalid");
      break;
    }

    const guilds: DiscordGuild[] = await res.json();
    if (!Array.isArray(guilds) || guilds.length === 0) break;

    allGuilds.push(...guilds);

    // Discord doesn't paginate /users/@me/guilds beyond 200 in a single call
    // but we still stop if we got fewer than 200
    if (guilds.length < 200) break;
    after = guilds[guilds.length - 1].id;
  }

  return allGuilds;
}

/**
 * Fetch guild IDs the bot is in, using the bot token.
 * Falls back to empty array if bot token not set.
 * Handles pagination for large bots.
 */
export async function getBotGuilds(): Promise<string[]> {
  const botToken = process.env.DISCORD_BOT_TOKEN;
  if (!botToken) {
    console.warn("[discord] DISCORD_BOT_TOKEN not set — cannot fetch bot guilds");
    return [];
  }

  const allIds: string[] = [];
  let after = "";

  for (let page = 0; page < 20; page++) {
    const url = after
      ? `${DISCORD_API}/users/@me/guilds?limit=200&after=${after}`
      : `${DISCORD_API}/users/@me/guilds?limit=200`;

    try {
      const res = await fetch(url, {
        headers: {
          Authorization: `Bot ${botToken}`,
        },
        next: { revalidate: 30 }, // cache 30s for bot guilds
      });

      if (!res.ok) {
        console.error(`[discord] Bot guild fetch failed: ${res.status}`);
        break;
      }

      const guilds: DiscordGuild[] = await res.json();
      if (!Array.isArray(guilds) || guilds.length === 0) break;

      allIds.push(...guilds.map((g) => g.id));

      if (guilds.length < 200) break;
      after = guilds[guilds.length - 1].id;
    } catch (err) {
      console.error("[discord] Bot guild fetch error:", err);
      break;
    }
  }

  return allIds;
}

/**
 * Fetch text channels for a guild (via bot token).
 */
export async function getGuildChannels(guildId: string) {
  const botToken = process.env.DISCORD_BOT_TOKEN;
  if (!botToken) return [];

  try {
    const res = await fetch(`${DISCORD_API}/guilds/${guildId}/channels`, {
      headers: { Authorization: `Bot ${botToken}` },
      next: { revalidate: 30 },
    });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

/**
 * Fetch roles for a guild (via bot token).
 */
export async function getGuildRoles(guildId: string) {
  const botToken = process.env.DISCORD_BOT_TOKEN;
  if (!botToken) return [];

  try {
    const res = await fetch(`${DISCORD_API}/guilds/${guildId}/roles`, {
      headers: { Authorization: `Bot ${botToken}` },
      next: { revalidate: 30 },
    });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

/**
 * Fetch a specific guild via bot token (to verify bot is present & get info).
 */
export async function getBotGuildInfo(guildId: string) {
  const botToken = process.env.DISCORD_BOT_TOKEN;
  if (!botToken) return null;

  try {
    const res = await fetch(`${DISCORD_API}/guilds/${guildId}?with_counts=true`, {
      headers: { Authorization: `Bot ${botToken}` },
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}
