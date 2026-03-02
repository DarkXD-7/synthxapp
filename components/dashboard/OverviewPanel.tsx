"use client";

import { useEffect, useState } from "react";
import {
  Wifi, WifiOff, RefreshCw, Shield, Settings2, Star, Bell,
  Users2, UserPlus, Hammer, Ticket, Moon, Hash, Mic, Crown,
  Zap, ShieldCheck, Clock, BarChart3
} from "lucide-react";

interface Props {
  guildId: string; isPremium: boolean; isOwner: boolean;
  settings: Record<string, unknown>; onRefresh?: () => void;
}

interface ServerStats {
  memberCount: number; onlineCount: number; textChannels: number;
  voiceChannels: number; roleCount: number; boostCount: number;
  boostTier: number; createdAt: string; verificationLevel: string;
}

function StatCard({ icon: Icon, label, value, sub, color }: {
  icon: React.ElementType; label: string; value: string | number;
  sub?: string; color: string;
}) {
  return (
    <div className="card p-4 flex items-center gap-3.5">
      <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ background: `${color}18`, border: `1px solid ${color}30` }}>
        <Icon size={18} style={{ color }} />
      </div>
      <div className="min-w-0">
        <p className="text-xl font-bold text-white tabular-nums leading-tight">{value}</p>
        <p className="text-xs text-gray-500 mt-0.5">{label}</p>
        {sub && <p className="text-[10px] text-gray-700 mt-0.5">{sub}</p>}
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

  const guild      = settings.guild as Record<string, unknown> | undefined;
  const stats      = (settings.serverStats as ServerStats) | undefined;
  const setup      = (settings.setup  as Record<string, unknown>) | undefined;
  const prefix     = (setup?.prefix as string) || "s!";

  const modules = [
    { name: "Anti-Nuke",  icon: Shield,    color: "#f87171", key: "antinuke" },
    { name: "AutoMod",    icon: Settings2, color: "#fb923c", key: "automod" },
    { name: "Logging",    icon: Bell,      color: "#818cf8", key: "logging" },
    { name: "Welcome",    icon: UserPlus,  color: "#34d399", key: "welcome" },
    { name: "Leveling",   icon: Star,      color: "#facc15", key: "leveling", premium: true },
    { name: "Auto Role",  icon: Users2,    color: "#22d3ee", key: "autorole" },
    { name: "Moderation", icon: Hammer,    color: "#fbbf24", key: "moderation" },
    { name: "Tickets",    icon: Ticket,    color: "#4ade80", key: "tickets" },
    { name: "Night Mode", icon: Moon,      color: "#93c5fd", key: "nightmode" },
  ];

  const createdYear = stats?.createdAt
    ? new Date(stats.createdAt).getFullYear()
    : null;

  return (
    <div className="space-y-6 animate-fade-in">

      {/* ── Header ─────────────────────────────────────────────── */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Overview</h1>
          <div className="flex items-center gap-2 flex-wrap">
            <code className="text-xs text-gray-600 bg-[#111] px-2 py-0.5 rounded">{guildId}</code>
            <span className="text-xs text-gray-600">·</span>
            <span className="text-xs text-gray-500 font-mono">Prefix: <span className="text-red-400 font-bold">{prefix}</span></span>
            {isOwner && <span className="pill pill-orange">Owner</span>}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg border ${
            botUp
              ? "border-green-500/20 bg-green-500/5 text-green-400"
              : "border-red-500/20 bg-red-500/5 text-red-400"
          }`}>
            {botUp ? <Wifi size={12} /> : <WifiOff size={12} />}
            {botUp ? `Online · ${ping ?? "…"}ms` : "Offline"}
          </span>
          {onRefresh && (
            <button onClick={onRefresh} className="btn-secondary text-xs px-3 py-2 flex items-center gap-1.5">
              <RefreshCw size={12} /> Refresh
            </button>
          )}
        </div>
      </div>

      {/* ── Premium Banner ─────────────────────────────────────── */}
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
          <a href="https://discord.gg/WKX5HHPmWz" target="_blank" rel="noopener noreferrer" className="ml-auto btn-primary text-xs px-3 py-2">Get Premium</a>
        </div>
      )}

      {/* ── Server Statistics ──────────────────────────────────── */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <BarChart3 size={13} className="text-gray-600" />
          <p className="text-xs font-semibold text-gray-600 uppercase tracking-widest">Server Statistics</p>
        </div>
        {stats ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            <StatCard icon={Users2}     label="Total Members"    value={(stats.memberCount ?? 0).toLocaleString()} color="#22d3ee" />
            <StatCard icon={Wifi}       label="Online Now"       value={(stats.onlineCount  ?? 0).toLocaleString()} color="#4ade80" />
            <StatCard icon={Hash}       label="Text Channels"    value={stats.textChannels  ?? 0} color="#818cf8" />
            <StatCard icon={Mic}        label="Voice Channels"   value={stats.voiceChannels ?? 0} color="#fb923c" />
            <StatCard icon={Crown}      label="Roles"            value={stats.roleCount     ?? 0} color="#facc15" />
            <StatCard icon={Zap}        label="Boosts"           value={stats.boostCount    ?? 0} sub={`Tier ${stats.boostTier ?? 0}`} color="#c084fc" />
            <StatCard icon={ShieldCheck}label="Verification"     value={stats.verificationLevel ?? "none"} color="#f87171" />
            <StatCard icon={Clock}      label="Created"          value={createdYear ?? "—"} color="#94a3b8" />
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {["Members","Online","Channels","Roles"].map(l => (
              <div key={l} className="card p-4 animate-pulse">
                <div className="h-6 w-12 bg-white/5 rounded mb-1" />
                <div className="h-3 w-16 bg-white/3 rounded" />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Module Status ──────────────────────────────────────── */}
      <div>
        <p className="text-xs font-semibold text-gray-600 uppercase tracking-widest mb-3">Module Status</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
          {modules.map(({ name, icon: Icon, color, key, premium }) => {
            const mod     = settings[key] as Record<string, unknown> | undefined;
            const enabled = mod?.enabled === true;
            const locked  = Boolean(premium) && !isPremium;
            return (
              <div key={name} className="card p-3.5 flex items-center gap-3">
                <Icon size={15} style={{ color: locked ? "#333" : color, flexShrink: 0 }} />
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium text-white truncate">{name}</p>
                  {locked ? (
                    <p className="text-[10px] text-purple-600">Premium</p>
                  ) : (
                    <p className={`text-[10px] ${enabled ? "text-green-400" : mod !== undefined ? "text-gray-600" : "text-gray-700"}`}>
                      {mod === undefined ? "Unknown" : enabled ? "Enabled" : "Disabled"}
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

      {/* ── Quick Config Summary ───────────────────────────────── */}
      <div>
        <p className="text-xs font-semibold text-gray-600 uppercase tracking-widest mb-3">Configuration Summary</p>
        <div className="card divide-y divide-[#1e1e1e]">
          {(() => {
            const an = settings.antinuke  as Record<string, unknown> | undefined;
            const am = settings.automod   as Record<string, unknown> | undefined;
            const wc = settings.welcome   as Record<string, unknown> | undefined;
            const lv = settings.leveling  as Record<string, unknown> | undefined;
            const ar = settings.autorole  as Record<string, unknown> | undefined;
            const tk = settings.tickets   as Record<string, unknown> | undefined;
            const nm = settings.nightmode as Record<string, unknown> | undefined;

            const rows = [
              an && { label: "Anti-Nuke",  value: an.enabled ? "Enabled" : "Disabled", ok: Boolean(an.enabled) },
              am && { label: "AutoMod",    value: am.enabled ? `On · ${((am.activeEvents as string[]) || []).length} filter(s)` : "Disabled", ok: Boolean(am.enabled) },
              wc && { label: "Welcome",    value: wc.enabled ? `On` : "Disabled", ok: Boolean(wc.enabled) },
              lv && { label: "Leveling",   value: isPremium ? (lv.enabled ? `On · ${lv.xpPerMessage ?? 20}xp/msg` : "Disabled") : "Premium only", ok: Boolean(lv.enabled) },
              ar && { label: "Auto Role",  value: ((ar.humanRoles as string[]) || []).length > 0 ? `${((ar.humanRoles as string[]) || []).length} role(s)` : "Not configured", ok: ((ar.humanRoles as string[]) || []).length > 0 },
              tk && { label: "Tickets",    value: tk.enabled ? `On · ${((tk.categories as unknown[]) || []).length} categor${((tk.categories as unknown[]) || []).length === 1 ? "y" : "ies"}` : "Disabled", ok: Boolean(tk.enabled) },
              nm && { label: "Night Mode", value: nm.enabled ? "Active" : "Inactive", ok: Boolean(nm.enabled) },
              { label: "Bot Prefix",   value: prefix, ok: true },
            ].filter(Boolean) as { label: string; value: string; ok: boolean }[];

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
