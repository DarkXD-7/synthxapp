"use client";

import { useEffect, useState } from "react";
import {
  Wifi, WifiOff, RefreshCw, Shield, Settings2, Star, Bell,
  Users2, UserPlus, Hammer, Ticket, Moon, Hash, Mic, Crown,
  Zap, ShieldCheck, Clock, BarChart3,
} from "lucide-react";

interface Props {
  guildId: string;
  isPremium: boolean;
  isOwner: boolean;
  settings: Record<string, unknown>;
  onRefresh?: () => void;
}

interface ServerStats {
  memberCount: number;
  onlineCount: number;
  textChannels: number;
  voiceChannels: number;
  roleCount: number;
  boostCount: number;
  boostTier: number;
  createdAt: string;
  verificationLevel: string;
}

function StatCard({
  icon: Icon, label, value, sub, color,
}: {
  icon: React.ElementType; label: string;
  value: string | number; sub?: string; color: string;
}) {
  return (
    <div className="card p-4 flex items-center gap-3">
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ background: `${color}1a`, border: `1px solid ${color}33` }}
      >
        <Icon size={17} style={{ color }} />
      </div>
      <div className="min-w-0">
        <p className="text-lg font-bold text-white tabular-nums leading-tight">{value}</p>
        <p className="text-xs text-gray-500 mt-0.5">{label}</p>
        {sub && <p className="text-[10px] text-gray-700">{sub}</p>}
      </div>
    </div>
  );
}

export default function OverviewPanel({ guildId, isPremium, isOwner, settings, onRefresh }: Props) {
  const [ping, setPing]   = useState<number | null>(null);
  const [botUp, setBotUp] = useState(true);

  const fetchPing = async () => {
    try {
      const res = await fetch("/api/stats", { cache: "no-store" });
      if (res.ok) {
        const d = await res.json();
        setPing(d.ping);
        setBotUp(d.online !== false && d.ping > 0);
      }
    } catch { setBotUp(false); }
  };

  useEffect(() => {
    fetchPing();
    const t = setInterval(fetchPing, 30_000);
    return () => clearInterval(t);
  }, []);

  // Safe casts — never use | on types
  const guild       = (settings.guild       as Record<string, unknown> | undefined) ?? null;
  const serverStats = (settings.serverStats as ServerStats              | undefined) ?? null;
  const setup       = (settings.setup       as Record<string, unknown> | undefined) ?? null;

  const guildIcon = guild ? (guild.icon as string | null) : null;
  const guildName = guild ? (guild.name as string) : `Server ${guildId}`;
  const prefix    = setup  ? ((setup.prefix as string) || ".") : ".";

  const iconUrl = guildIcon
    ? `https://cdn.discordapp.com/icons/${guildId}/${guildIcon}.${guildIcon.startsWith("a_") ? "gif" : "png"}?size=128`
    : null;

  const createdYear = serverStats?.createdAt
    ? new Date(serverStats.createdAt).getFullYear()
    : null;

  const modules = [
    { name: "Anti-Nuke",  icon: Shield,    color: "#f87171", key: "antinuke"  },
    { name: "AutoMod",    icon: Settings2, color: "#fb923c", key: "automod"   },
    { name: "Logging",    icon: Bell,      color: "#818cf8", key: "logging"   },
    { name: "Welcome",    icon: UserPlus,  color: "#34d399", key: "welcome"   },
    { name: "Leveling",   icon: Star,      color: "#facc15", key: "leveling",  premium: true },
    { name: "Auto Role",  icon: Users2,    color: "#22d3ee", key: "autorole"  },
    { name: "Moderation", icon: Hammer,    color: "#fbbf24", key: "moderation"},
    { name: "Tickets",    icon: Ticket,    color: "#4ade80", key: "tickets"   },
    { name: "Night Mode", icon: Moon,      color: "#93c5fd", key: "nightmode" },
  ];

  return (
    <div className="space-y-6 animate-fade-in">

      {/* ── Server Header card ───────────────────────────────── */}
      <div className="card p-5 flex items-center gap-4 flex-wrap">
        <div className="w-16 h-16 rounded-2xl overflow-hidden flex-shrink-0 bg-[#1a1a1a] flex items-center justify-center">
          {iconUrl
            ? <img src={iconUrl} alt={guildName} className="w-full h-full object-cover" />
            : <span className="text-2xl font-bold text-gray-600">{guildName.charAt(0).toUpperCase()}</span>
          }
        </div>

        <div className="flex-1 min-w-0">
          <h1 className="text-xl font-bold text-white truncate">{guildName}</h1>
          <p className="text-[11px] text-gray-600 font-mono mt-0.5">{guildId}</p>
          <div className="flex items-center gap-2 mt-1.5 flex-wrap">
            <span className="text-xs text-gray-500">
              Prefix: <code className="text-red-400 font-bold">{prefix}</code>
            </span>
            {isPremium && <span className="pill pill-purple">Premium</span>}
            {isOwner   && <span className="pill pill-orange">Owner</span>}
          </div>
        </div>

        <div className="flex flex-col items-end gap-2 flex-shrink-0">
          <span className={`flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg border ${
            botUp
              ? "border-green-500/20 bg-green-500/5 text-green-400"
              : "border-red-500/20  bg-red-500/5  text-red-400"
          }`}>
            {botUp ? <Wifi size={12} /> : <WifiOff size={12} />}
            {botUp ? `Online · ${ping ?? "…"}ms` : "Offline"}
          </span>
          {onRefresh && (
            <button onClick={onRefresh} className="btn-secondary text-xs px-3 py-1.5 flex items-center gap-1.5">
              <RefreshCw size={11} /> Refresh
            </button>
          )}
        </div>
      </div>

      {/* ── Premium banner ───────────────────────────────────── */}
      {isPremium ? (
        <div className="flex items-center gap-3 p-4 rounded-xl"
          style={{ background: "rgba(168,85,247,0.06)", border: "1px solid rgba(168,85,247,0.18)" }}>
          <Star size={18} className="text-purple-400 flex-shrink-0" />
          <div>
            <p className="text-sm font-semibold text-white">Premium Active</p>
            <p className="text-xs text-gray-500">All premium features are unlocked.</p>
          </div>
          <span className="ml-auto pill pill-purple">Active</span>
        </div>
      ) : (
        <div className="flex items-center gap-3 p-4 rounded-xl card">
          <Star size={18} className="text-gray-500 flex-shrink-0" />
          <div>
            <p className="text-sm font-semibold text-white">Upgrade to Premium</p>
            <p className="text-xs text-gray-500">Unlock Leveling, custom Bot Profile, and more.</p>
          </div>
          <a href="https://discord.gg/WKX5HHPmWz" target="_blank" rel="noopener noreferrer"
            className="ml-auto btn-primary text-xs px-3 py-2 whitespace-nowrap">
            Get Premium
          </a>
        </div>
      )}

      {/* ── Server Statistics ────────────────────────────────── */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <BarChart3 size={12} className="text-gray-600" />
          <p className="text-xs font-semibold text-gray-600 uppercase tracking-widest">Server Statistics</p>
        </div>
        {serverStats ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            <StatCard icon={Users2}      label="Total Members"   value={(serverStats.memberCount  ?? 0).toLocaleString()} color="#22d3ee" />
            <StatCard icon={Wifi}        label="Online Now"      value={(serverStats.onlineCount   ?? 0).toLocaleString()} color="#4ade80" />
            <StatCard icon={Hash}        label="Text Channels"   value={serverStats.textChannels   ?? 0} color="#818cf8" />
            <StatCard icon={Mic}         label="Voice Channels"  value={serverStats.voiceChannels  ?? 0} color="#fb923c" />
            <StatCard icon={Crown}       label="Roles"           value={serverStats.roleCount      ?? 0} color="#facc15" />
            <StatCard icon={Zap}         label="Boosts"          value={serverStats.boostCount     ?? 0} sub={`Tier ${serverStats.boostTier ?? 0}`} color="#c084fc" />
            <StatCard icon={ShieldCheck} label="Verification"    value={serverStats.verificationLevel ?? "none"} color="#f87171" />
            <StatCard icon={Clock}       label="Est. Year"       value={createdYear ?? "—"} color="#94a3b8" />
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {["Members", "Online", "Channels", "Roles"].map((l) => (
              <div key={l} className="card p-4 animate-pulse">
                <div className="h-6 w-12 bg-white/5 rounded mb-2" />
                <div className="h-3 w-16 bg-white/3 rounded" />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Module Status ────────────────────────────────────── */}
      <div>
        <p className="text-xs font-semibold text-gray-600 uppercase tracking-widest mb-3">Module Status</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
          {modules.map(({ name, icon: Icon, color, key, premium }) => {
            const mod     = (settings[key] as Record<string, unknown> | undefined);
            const enabled = mod?.enabled === true;
            const locked  = Boolean(premium) && !isPremium;
            return (
              <div key={name} className="card p-3.5 flex items-center gap-3">
                <Icon size={14} style={{ color: locked ? "#333" : color, flexShrink: 0 }} />
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium text-white truncate">{name}</p>
                  {locked
                    ? <p className="text-[10px] text-purple-600">Premium</p>
                    : <p className={`text-[10px] ${enabled ? "text-green-400" : mod !== undefined ? "text-gray-600" : "text-gray-700"}`}>
                        {mod === undefined ? "Not set" : enabled ? "Enabled" : "Disabled"}
                      </p>
                  }
                </div>
                {!locked && (
                  <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${enabled ? "bg-green-400 dot-pulse" : "bg-gray-700"}`} />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Config Summary ───────────────────────────────────── */}
      <div>
        <p className="text-xs font-semibold text-gray-600 uppercase tracking-widest mb-3">Configuration Summary</p>
        <div className="card divide-y divide-[#1e1e1e]">
          {(() => {
            const an = (settings.antinuke  as Record<string, unknown> | undefined);
            const am = (settings.automod   as Record<string, unknown> | undefined);
            const wc = (settings.welcome   as Record<string, unknown> | undefined);
            const lv = (settings.leveling  as Record<string, unknown> | undefined);
            const ar = (settings.autorole  as Record<string, unknown> | undefined);
            const tk = (settings.tickets   as Record<string, unknown> | undefined);
            const nm = (settings.nightmode as Record<string, unknown> | undefined);

            const rows: { label: string; value: string; ok: boolean }[] = [
              { label: "Bot Prefix",  value: prefix, ok: true },
              ...(an ? [{ label: "Anti-Nuke", value: an.enabled ? "Enabled" : "Disabled", ok: Boolean(an.enabled) }] : []),
              ...(am ? [{ label: "AutoMod",   value: am.enabled ? `On · ${((am.activeEvents as string[]) || []).length} filter(s)` : "Disabled", ok: Boolean(am.enabled) }] : []),
              ...(wc ? [{ label: "Welcome",   value: wc.enabled ? "Enabled" : "Disabled", ok: Boolean(wc.enabled) }] : []),
              ...(lv ? [{ label: "Leveling",  value: isPremium ? (lv.enabled ? `On · ${lv.xpPerMessage ?? 20}xp/msg` : "Disabled") : "Premium only", ok: Boolean(lv.enabled) }] : []),
              ...(ar ? [{ label: "Auto Role", value: ((ar.humanRoles as string[]) || []).length > 0 ? `${((ar.humanRoles as string[]) || []).length} role(s)` : "Not set", ok: ((ar.humanRoles as string[]) || []).length > 0 }] : []),
              ...(tk ? [{ label: "Tickets",   value: tk.enabled ? `On · ${((tk.categories as unknown[]) || []).length} categor${((tk.categories as unknown[]) || []).length === 1 ? "y" : "ies"}` : "Disabled", ok: Boolean(tk.enabled) }] : []),
              ...(nm ? [{ label: "Night Mode", value: nm.enabled ? "Active" : "Inactive", ok: Boolean(nm.enabled) }] : []),
            ];

            if (rows.length === 0) return (
              <div className="p-4 text-sm text-gray-600">No modules configured yet.</div>
            );
            return rows.map((row) => (
              <div key={row.label} className="flex items-center justify-between px-4 py-3">
                <span className="text-sm text-gray-400">{row.label}</span>
                <span className={`text-sm font-medium ${row.ok ? "text-green-400" : "text-gray-600"}`}>{row.value}</span>
              </div>
            ));
          })()}
        </div>
      </div>

    </div>
  );
}
