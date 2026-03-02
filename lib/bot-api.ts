// lib/bot-api.ts — all API calls go through Next.js API routes
// which proxy to the bot's Flask server.

const BOT_URL = process.env.BOT_API_URL || "http://localhost:8000";
const BOT_KEY = process.env.BOT_API_KEY  || "";

export function botFetch(path: string, init?: RequestInit) {
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

export async function getBotStats() {
  try {
    const res = await botFetch("/api/stats");
    if (!res.ok) throw new Error("offline");
    return await res.json();
  } catch {
    return { servers: 0, users: 0, ping: 0, uptime: "Offline", commands: 120 };
  }
}

export async function getGuildSettings(guildId: string) {
  try {
    const res = await botFetch(`/api/settings/${guildId}`);
    if (!res.ok) return null;
    return await res.json();
  } catch { return null; }
}

export async function updateGuildSettings(
  guildId: string, module: string, settings: Record<string, unknown>
) {
  try {
    const res = await botFetch(`/api/settings/${guildId}`, {
      method: "POST",
      body: JSON.stringify({ module, settings }),
    });
    return await res.json();
  } catch { return { success: false }; }
}

export async function checkPremium(guildId: string): Promise<boolean> {
  try {
    const res = await botFetch(`/api/premium/${guildId}`);
    if (!res.ok) return false;
    const data = await res.json();
    return data.premium === true;
  } catch { return false; }
}

export async function getGuildChannels(guildId: string) {
  // Channels are now returned inside /api/settings/<id> as _channels
  return [];
}

export async function getGuildRoles(guildId: string) {
  // Roles are now returned inside /api/settings/<id> as _roles
  return [];
}
