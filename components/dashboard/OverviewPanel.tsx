"use client";

import { useEffect, useState } from "react";
import { Wifi, WifiOff, RefreshCw, Shield, Settings2, Star, Bell, Users2, UserPlus, Hammer } from "lucide-react";

interface Stats { servers: number; users: number; ping: number; uptime: string; commands: number; online?: boolean; }
interface Props {
  guildId: string; isPremium: boolean; isOwner: boolean;
  settings: Record<string, unknown>; onRefresh?: () => void;
}

export default function OverviewPanel({ guildId, isPremium, isOwner, settings, onRefresh }: Props) {
  const [stats, setStats] = useState<Stats | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);

  const fetchStats = async () => {
    setStatsLoading(true);
    try {
      const res = await fetch("/api/stats", { cache: "no-store" });
      if (res.ok) setStats(await res.json());
    } catch { setStats(null); }
    finally { setStatsLoading(false); }
  };

  useEffect(() => { fetchStats(); const t = setInterval(fetchStats, 30000); return () => clearInterval(t); }, []);

  const botOnline = stats && stats.online !== false && stats.ping > 0;
  const guildData = settings.guild as Record<string, unknown> | undefined;

  const modules = [
    { name: "Anti-Nuke",  icon: Shield,    color: "#f87171",  key: "antinuke" },
    { name: "AutoMod",    icon: Settings2, color: "#fb923c",  key: "automod" },
    { name: "Leveling",   icon: Star,      color: "#facc15",  key: "leveling", premium: true },
    { name: "Logging",    icon: Bell,      color: "#818cf8",  key: "logging" },
    { name: "Welcome",    icon: UserPlus,  color: "#34d399",  key: "welcome" },
    { name: "Auto Role",  icon: Users2,    color: "#22d3ee",  key: "autorole" },
    { name: "Moderation", icon: Hammer,    color: "#fbbf24",  key: "moderation" },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Overview</h1>
          <p className="text-sm text-gray-500">
            Server ID: <code>{guildId}</code>
            {guildData?.ownerId && isOwner && <span className="ml-2 text-orange-400 text-xs">(You are the owner)</span>}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {!statsLoading && (
            <span className={`flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg border ${botOnline ? "border-green-500/20 bg-green-500/5 text-green-400" : "border-red-500/20 bg-red-500/5 text-red-400"}`}>
              {botOnline ? <Wifi size={12} /> : <WifiOff size={12} />}
              {botOnline ? "Bot Online" : "Bot Offline"}
            </span>
          )}
          {onRefresh && (
            <button onClick={onRefresh} className="btn-secondary text-xs px-3 py-2">
              <RefreshCw size={12} /> Refresh
            </button>
          )}
        </div>
      </div>

      {/* Premium status */}
      {isPremium ? (
        <div className="flex items-center gap-3 p-4 rounded-xl" style={{background:"rgba(168,85,247,0.06)",border:"1px solid rgba(168,85,247,0.18)"}}>
          <Star size={18} className="text-purple-400 flex-shrink-0" />
          <div>
            <p className="text-sm font-semibold text-white">Premium Active</p>
            <p className="text-xs text-gray-500">All premium features including Leveling & Bot Profile are unlocked.</p>
          </div>
          <span className="ml-auto pill pill-purple">Active</span>
        </div>
      ) : (
        <div className="flex items-center gap-3 p-4 rounded-xl card">
          <Star size={18} className="text-gray-500 flex-shrink-0" />
          <div>
            <p className="text-sm font-semibold text-white">Upgrade to Premium</p>
            <p className="text-xs text-gray-500">Unlock Leveling, custom Bot Profile, and advanced features.</p>
          </div>
          <a href="https://discord.gg/WKX5HHPmWz" target="_blank" rel="noopener noreferrer" className="ml-auto btn-primary text-xs px-3 py-2">
            Get Premium
          </a>
        </div>
      )}

      {/* Bot stats (global) */}
      <div>
        <p className="text-xs font-semibold text-gray-600 uppercase tracking-widest mb-3">Bot Statistics</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "Servers", value: statsLoading ? "…" : stats?.servers?.toLocaleString() ?? "—" },
            { label: "Users",   value: statsLoading ? "…" : stats?.users?.toLocaleString() ?? "—" },
            { label: "Ping",    value: statsLoading ? "…" : `${stats?.ping ?? 0}ms` },
            { label: "Uptime",  value: statsLoading ? "…" : stats?.uptime ?? "Offline" },
          ].map(({ label, value }) => (
            <div key={label} className="card p-4">
              <p className="text-xl font-bold text-white">{value}</p>
              <p className="text-xs text-gray-500 mt-0.5">{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Module status — reads from REAL settings */}
      <div>
        <p className="text-xs font-semibold text-gray-600 uppercase tracking-widest mb-3">Module Status</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
          {modules.map(({ name, icon: Icon, color, key, premium }) => {
            const mod = settings[key] as Record<string, unknown> | undefined;
            const enabled = mod?.enabled === true;
            const configured = mod !== undefined;
            const locked = Boolean(premium) && !isPremium;
            return (
              <div key={name} className="card p-3.5 flex items-center gap-3">
                <Icon size={15} style={{ color: locked ? "#333" : color, flexShrink: 0 }} />
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium text-white truncate">{name}</p>
                  {locked ? (
                    <p className="text-[10px] text-purple-600">Premium</p>
                  ) : (
                    <p className={`text-[10px] ${enabled ? "text-green-400" : configured ? "text-gray-600" : "text-gray-700"}`}>
                      {!configured ? "Unknown" : enabled ? "Enabled" : "Disabled"}
                    </p>
                  )}
                </div>
                {!locked && (
                  <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${enabled ? "bg-green-400 dot-pulse" : "bg-gray-700"}`} />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Config summary */}
      <div>
        <p className="text-xs font-semibold text-gray-600 uppercase tracking-widest mb-3">Quick Summary</p>
        <div className="card divide-y divide-[#1e1e1e]">
          {(() => {
            const an = settings.antinuke as Record<string, unknown> | undefined;
            const am = settings.automod  as Record<string, unknown> | undefined;
            const wc = settings.welcome  as Record<string, unknown> | undefined;
            const lv = settings.leveling as Record<string, unknown> | undefined;
            const ar = settings.autorole as Record<string, unknown> | undefined;
            const tk = settings.tickets  as Record<string, unknown> | undefined;
            const rows = [
              an && { label: "Anti-Nuke",  value: an.enabled ? `On · ${an.punishment || "ban"}` : "Off", ok: Boolean(an.enabled) },
              am && { label: "AutoMod",    value: am.enabled ? `On · ${((am.activeEvents as string[]) || []).length} filter(s)` : "Off", ok: Boolean(am.enabled) },
              wc && { label: "Welcome",    value: wc.enabled ? `On · ${wc.welcomeType === "embed" ? "Embed" : "Text"}` : "Off", ok: Boolean(wc.enabled) },
              lv && { label: "Leveling",   value: isPremium ? (lv.enabled ? `On · ${lv.xpPerMessage ?? 20}xp/msg` : "Off") : "Premium only", ok: Boolean(lv.enabled) },
              ar && { label: "Auto Role",  value: ((ar.humanRoles as string[]) || []).length > 0 ? `${((ar.humanRoles as string[]) || []).length} member role(s)` : "Not configured", ok: ((ar.humanRoles as string[]) || []).length > 0 },
              tk && { label: "Tickets",    value: tk.enabled ? "On" : "Off", ok: Boolean(tk.enabled) },
            ].filter(Boolean) as { label: string; value: string; ok: boolean }[];

            if (rows.length === 0) return (
              <div className="p-4 text-sm text-gray-600">No modules configured yet. Start by enabling Anti-Nuke or AutoMod in the sidebar.</div>
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
