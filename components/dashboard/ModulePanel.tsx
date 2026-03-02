"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
  Shield, Star, Gift, Settings2, Users2, Bell, Moon, Save, Loader2,
  CheckCircle, AlertTriangle, X, Lock, Hammer, Sliders, Repeat2,
  Layers, Ticket, Server, UserPlus, Wrench, Upload, Plus, Trash2, Info,
} from "lucide-react";

interface Channel { id: string; name: string; }
interface Role     { id: string; name: string; color: number; }
interface Props {
  moduleId: string;
  guildId: string;
  isPremium: boolean;
  isOwner: boolean;
  settings: Record<string, unknown>;
  onSave: (module: string, settings: Record<string, unknown>) => void;
}

// ─── Primitive UI components ────────────────────────────────────────────────

function RowToggle({ label, desc, checked, onChange, disabled }: {
  label: string; desc?: string; checked: boolean;
  onChange: (v: boolean) => void; disabled?: boolean;
}) {
  return (
    <div className="section-row flex items-center justify-between gap-4">
      <div>
        <p className="text-sm font-medium text-white">{label}</p>
        {desc && <p className="text-xs text-gray-500 mt-0.5">{desc}</p>}
      </div>
      <label className={`toggle flex-shrink-0 ${disabled ? "opacity-40 pointer-events-none" : ""}`}>
        <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
        <div className="toggle-track">
          <div className="toggle-thumb" />
        </div>
      </label>
    </div>
  );
}

function RowSelect({ label, desc, channels, value, onChange, disabled, placeholder }: {
  label: string; desc?: string; channels: Channel[];
  value: string; onChange: (v: string) => void; disabled?: boolean; placeholder?: string;
}) {
  return (
    <div className="section-row">
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm font-medium text-white">{label}</p>
        {desc && <p className="text-xs text-gray-500">{desc}</p>}
      </div>
      {!desc && false}
      {desc && <p className="text-xs text-gray-500 mb-2">{desc}</p>}
      <select value={value} onChange={(e) => onChange(e.target.value)} disabled={disabled} className="input">
        <option value="">{placeholder || "— None / disabled —"}</option>
        {channels.map((c) => <option key={c.id} value={c.id}>#{c.name}</option>)}
      </select>
    </div>
  );
}

function RowRoleSelect({ label, desc, roles, value, onChange, disabled }: {
  label: string; desc?: string; roles: Role[];
  value: string; onChange: (v: string) => void; disabled?: boolean;
}) {
  return (
    <div className="section-row">
      <p className="text-sm font-medium text-white mb-1">{label}</p>
      {desc && <p className="text-xs text-gray-500 mb-2">{desc}</p>}
      <select value={value} onChange={(e) => onChange(e.target.value)} disabled={disabled} className="input">
        <option value="">— None —</option>
        {roles.map((r) => <option key={r.id} value={r.id}>@{r.name}</option>)}
      </select>
    </div>
  );
}

function RowMultiRole({ label, desc, roles, values, onChange, disabled }: {
  label: string; desc?: string; roles: Role[];
  values: string[]; onChange: (v: string[]) => void; disabled?: boolean;
}) {
  const name = (id: string) => roles.find((r) => r.id === id)?.name ?? id;
  return (
    <div className="section-row">
      <p className="text-sm font-medium text-white mb-1">{label}</p>
      {desc && <p className="text-xs text-gray-500 mb-2">{desc}</p>}
      <div className="flex flex-wrap gap-1.5 mb-2 min-h-[24px]">
        {values.map((id) => (
          <span key={id} className="flex items-center gap-1 text-xs bg-[#1c1c1c] text-gray-300 px-2 py-1 rounded-full border border-[#2a2a2a]">
            @{name(id)}
            {!disabled && (
              <button type="button" onClick={() => onChange(values.filter((v) => v !== id))} className="text-gray-500 hover:text-red-400 transition-colors">
                <X size={10} />
              </button>
            )}
          </span>
        ))}
        {values.length === 0 && <span className="text-xs text-gray-600 italic">None set</span>}
      </div>
      {!disabled && (
        <select
          defaultValue=""
          onChange={(e) => {
            if (e.target.value && !values.includes(e.target.value))
              onChange([...values, e.target.value]);
            e.target.value = "";
          }}
          className="input"
        >
          <option value="">+ Add role…</option>
          {roles.filter((r) => !values.includes(r.id)).map((r) => (
            <option key={r.id} value={r.id}>@{r.name}</option>
          ))}
        </select>
      )}
    </div>
  );
}

function RowTextarea({ label, desc, value, onChange, placeholder, disabled, rows = 3 }: {
  label: string; desc?: string; value: string;
  onChange: (v: string) => void; placeholder?: string; disabled?: boolean; rows?: number;
}) {
  return (
    <div className="section-row">
      <p className="text-sm font-medium text-white mb-1">{label}</p>
      {desc && <p className="text-xs text-gray-500 mb-2">{desc}</p>}
      <textarea
        value={value} onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder} rows={rows} disabled={disabled}
        className="input"
        style={{ resize: "vertical" }}
      />
    </div>
  );
}

function RowInput({ label, desc, value, onChange, placeholder, disabled }: {
  label: string; desc?: string; value: string;
  onChange: (v: string) => void; placeholder?: string; disabled?: boolean;
}) {
  return (
    <div className="section-row">
      <p className="text-sm font-medium text-white mb-1">{label}</p>
      {desc && <p className="text-xs text-gray-500 mb-2">{desc}</p>}
      <input type="text" value={value} onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder} disabled={disabled} className="input" />
    </div>
  );
}

function RowNum({ label, desc, value, onChange, min, max, disabled }: {
  label: string; desc?: string; value: number;
  onChange: (v: number) => void; min?: number; max?: number; disabled?: boolean;
}) {
  return (
    <div className="section-row">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-white">{label}</p>
          {desc && <p className="text-xs text-gray-500 mt-0.5">{desc}</p>}
        </div>
        <input
          type="number" value={value} min={min} max={max} disabled={disabled}
          onChange={(e) => onChange(Number(e.target.value))}
          className="input w-24 text-right"
        />
      </div>
    </div>
  );
}

function RowDropdown({ label, desc, options, value, onChange, disabled }: {
  label: string; desc?: string;
  options: { value: string; label: string }[];
  value: string; onChange: (v: string) => void; disabled?: boolean;
}) {
  return (
    <div className="section-row">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-white">{label}</p>
          {desc && <p className="text-xs text-gray-500 mt-0.5">{desc}</p>}
        </div>
        <select value={value} onChange={(e) => onChange(e.target.value)} disabled={disabled} className="input w-44">
          {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      </div>
    </div>
  );
}

function Banner({ color, children }: { color: "yellow" | "blue" | "red" | "green" | "gray"; children: React.ReactNode }) {
  const cls = { yellow: "info-yellow", blue: "info-blue", red: "info-red", green: "info-green", gray: "info-gray" }[color];
  return <div className={`info-banner ${cls} my-2`}>{children}</div>;
}

function UploadField({ label, desc, accept, onFile, preview }: {
  label: string; desc?: string; accept?: string;
  onFile: (f: File) => void; preview?: string;
}) {
  const ref = useRef<HTMLInputElement>(null);
  return (
    <div className="section-row">
      <p className="text-sm font-medium text-white mb-1">{label}</p>
      {desc && <p className="text-xs text-gray-500 mb-2">{desc}</p>}
      <div
        className="upload-zone"
        onClick={() => ref.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          const f = e.dataTransfer.files[0];
          if (f) onFile(f);
        }}
      >
        {preview ? (
          <img src={preview} alt="preview" className="h-20 object-contain mx-auto mb-2 rounded" />
        ) : (
          <Upload size={20} className="text-gray-600 mx-auto mb-2" />
        )}
        <p className="text-xs text-gray-500">Drag & drop or <span className="text-red-400 font-medium">browse</span></p>
        <p className="text-[10px] text-gray-700 mt-0.5">{accept ? accept.replace("image/*","PNG, JPG, GIF, WEBP") : "Any file"} — max 8MB</p>
      </div>
      <input ref={ref} type="file" accept={accept} className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) onFile(f); }} />
    </div>
  );
}

function SectionHeader({ title }: { title: string }) {
  return <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mt-4 mb-1 pb-1 border-b border-[#1e1e1e]">{title}</p>;
}

function PremiumGate({ title }: { title: string }) {
  return (
    <div className="max-w-lg mx-auto text-center py-16">
      <div className="w-16 h-16 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mx-auto mb-5">
        <Star size={28} className="text-purple-400" />
      </div>
      <h2 className="text-xl font-bold text-white mb-2">Premium Required</h2>
      <p className="text-gray-500 text-sm mb-6">
        <strong className="text-purple-300">{title}</strong> is a premium feature. Upgrade to unlock it for this server.
      </p>
      <a href="https://discord.gg/WKX5HHPmWz" target="_blank" rel="noopener noreferrer"
        className="btn-primary" style={{background:"linear-gradient(135deg,#9333ea,#7c3aed)"}}>
        Get Premium
      </a>
    </div>
  );
}

// ─── Module metadata ────────────────────────────────────────────────────────

const META: Record<string, { title: string; icon: React.ElementType; iconColor: string; premium?: boolean; ownerOnly?: boolean }> = {
  antinuke:     { title: "Anti-Nuke",       icon: Shield,    iconColor: "#f87171",  ownerOnly: true },
  automod:      { title: "AutoMod",         icon: Settings2, iconColor: "#fb923c" },
  logging:      { title: "Logging",         icon: Bell,      iconColor: "#818cf8" },
  welcome:      { title: "Welcomer & Boosts", icon: UserPlus, iconColor: "#34d399" },
  leveling:     { title: "Leveling",        icon: Star,      iconColor: "#facc15",  premium: true },
  giveaway:     { title: "Giveaways",       icon: Gift,      iconColor: "#f472b6" },
  reactionroles:{ title: "Reaction Roles",  icon: Repeat2,   iconColor: "#60a5fa" },
  autorole:     { title: "Auto Role",       icon: Users2,    iconColor: "#22d3ee" },
  nightmode:    { title: "Night Mode",      icon: Moon,      iconColor: "#93c5fd" },
  moderation:   { title: "Moderation",      icon: Hammer,    iconColor: "#fbbf24" },
  setup:        { title: "Setup / Roles",   icon: Sliders,   iconColor: "#a78bfa" },
  tickets:      { title: "Ticket System",   icon: Ticket,    iconColor: "#4ade80" },
  embeds:       { title: "Embeds",          icon: Layers,    iconColor: "#fb923c" },
  minecraft:    { title: "Minecraft Status",icon: Server,    iconColor: "#86efac" },
  utility:      { title: "Utility",         icon: Wrench,    iconColor: "#9ca3af" },
};

const AUTOMOD_EVENTS = [
  "Anti spam", "Anti caps", "Anti link", "Anti invites",
  "Anti mass mention", "Anti emoji spam", "Anti NSFW link",
];

const LOG_TYPES = [
  { key: "message", label: "Message Logs" },
  { key: "mod",     label: "Mod Action Logs" },
  { key: "channel", label: "Channel Logs" },
  { key: "role",    label: "Role Logs" },
  { key: "guild",   label: "Server Logs" },
  { key: "invite",  label: "Invite Logs" },
  { key: "webhook", label: "Webhook Logs" },
  { key: "emoji",   label: "Emoji Logs" },
  { key: "join",    label: "Join / Leave Logs" },
  { key: "voice",   label: "Voice Logs" },
  { key: "thread",  label: "Thread Logs" },
];

// ─── Main Component ──────────────────────────────────────────────────────────

export default function ModulePanel({ moduleId, guildId, isPremium, isOwner, settings, onSave }: Props) {
  const meta = META[moduleId];
  const channels = (settings._channels as Channel[]) || [];
  const roles    = (settings._roles    as Role[])    || [];
  const rawMod   = (settings[moduleId] as Record<string, unknown>) || {};

  const [local,  setLocal]  = useState<Record<string, unknown>>(rawMod);
  const [saving, setSaving] = useState(false);
  const [saved,  setSaved]  = useState(false);
  const [err,    setErr]    = useState<string | null>(null);

  useEffect(() => {
    setLocal((settings[moduleId] as Record<string, unknown>) || {});
    setSaved(false); setErr(null);
  }, [moduleId, settings]);

  const set = useCallback((k: string, v: unknown) => {
    setLocal((p) => ({ ...p, [k]: v })); setSaved(false);
  }, []);

  const handleSave = async () => {
    setSaving(true); setErr(null);
    try {
      const res = await fetch(`/api/settings/${guildId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ module: moduleId, settings: local }),
      });
      const data = await res.json();
      if (!res.ok || data.error) {
        if (data.ownerOnly) throw new Error("Only the server owner can change this setting");
        if (data.premiumRequired) throw new Error("This feature requires Premium");
        throw new Error(data.error || "Save failed");
      }
      onSave(moduleId, local);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : "Save failed");
    }
    setSaving(false);
  };

  if (!meta) return <p className="text-gray-500">Module not found.</p>;
  if (meta.premium && !isPremium) return <PremiumGate title={meta.title} />;

  const ownerGated = meta.ownerOnly && !isOwner;
  const Icon = meta.icon;
  const readOnly = moduleId === "giveaway" || moduleId === "reactionroles";

  return (
    <div className="max-w-2xl space-y-5 animate-fade-in">
      {/* Page header */}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: `${meta.iconColor}15` }}>
          <Icon size={18} style={{ color: meta.iconColor }} />
        </div>
        <div>
          <h1 className="text-xl font-bold text-white">{meta.title}</h1>
          <div className="flex items-center gap-2 mt-0.5">
            {meta.premium && <span className="pill pill-purple">Premium</span>}
            {meta.ownerOnly && <span className="pill pill-orange">Owner Only</span>}
          </div>
        </div>
      </div>

      {ownerGated && (
        <Banner color="yellow">
          <div className="flex items-center gap-2"><Lock size={13} className="flex-shrink-0" /> Only the server owner can modify these settings. You are viewing in read-only mode.</div>
        </Banner>
      )}

      {/* Card */}
      <div className="card p-5">

        {/* ── ANTINUKE ──────────────────────────────────────────── */}
        {moduleId === "antinuke" && (() => {
          const an = local;
          return (
            <>
              <div className={`flex items-center gap-2 p-3 rounded-lg mb-4 text-sm font-medium ${an.enabled ? "info-green" : "info-red"}`}>
                <div className={`w-2 h-2 rounded-full ${an.enabled ? "bg-green-400 dot-pulse" : "bg-red-400"} flex-shrink-0`} />
                Anti-Nuke is {an.enabled ? "ENABLED" : "DISABLED"}
              </div>
              <Banner color="yellow">
                Enable / disable via bot command: <code>antinuke enable</code> / <code>antinuke disable</code>. Only Server Owner or Extra Owner can run these.
              </Banner>

              {an.enabled && (
                <>
                  <SectionHeader title="Sub-Module Toggles" />
                  {[
                    { key:"antiban",       label:"Anti Ban",            desc:"Action on mass-bans" },
                    { key:"antikick",      label:"Anti Kick",           desc:"Action on mass-kicks" },
                    { key:"antibotadd",    label:"Anti Bot Add",        desc:"Action on unauthorised bot additions" },
                    { key:"antichcr",      label:"Anti Channel Create", desc:"Prevent mass channel creation" },
                    { key:"antichdl",      label:"Anti Channel Delete", desc:"Prevent mass channel deletion" },
                    { key:"antieveryone", label:"Anti @everyone Ping",  desc:"Timeout abuser, remove message" },
                    { key:"antirlcr",      label:"Anti Role Create",    desc:"Prevent mass role creation" },
                    { key:"antirldl",      label:"Anti Role Delete",    desc:"Prevent mass role deletion" },
                    { key:"antiwebhookcr", label:"Anti Webhook Create", desc:"Prevent webhook abuse" },
                    { key:"antiwebhookdl", label:"Anti Webhook Delete", desc:"Prevent webhook deletion" },
                    { key:"antiprune",     label:"Anti Prune",          desc:"Prevent mass member pruning" },
                  ].map(({ key, label, desc }) => (
                    <RowToggle key={key} label={label} desc={desc}
                      checked={Boolean(an[key])} onChange={(v) => set(key, v)} disabled={ownerGated} />
                  ))}
                </>
              )}

              <SectionHeader title="Punishment" />
              <RowDropdown
                label="Action" desc="What happens to users who trigger Anti-Nuke"
                options={[{ value:"ban",label:"Ban" },{ value:"kick",label:"Kick" },{ value:"strip_roles",label:"Strip Roles" }]}
                value={String(an.punishment || "ban")} onChange={(v) => set("punishment", v)} disabled={ownerGated}
              />

              <SectionHeader title="Whitelist" />
              <div className="section-row">
                <p className="text-sm font-medium text-white mb-1">Extra Owner</p>
                <p className="text-xs text-gray-500 mb-2">Set via <code>extraowner set @user</code></p>
                {an.extraOwner
                  ? <span className="pill pill-orange">ID: {String(an.extraOwner)}</span>
                  : <span className="text-xs text-gray-600 italic">None set</span>}
              </div>
              <div className="section-row">
                <p className="text-sm font-medium text-white mb-1">Whitelisted Users</p>
                <p className="text-xs text-gray-500 mb-2">Set via <code>whitelist @user</code> — these users bypass Anti-Nuke</p>
                {((an.whitelist as string[]) || []).length > 0
                  ? <div className="flex flex-wrap gap-1.5">{((an.whitelist as string[]) || []).map((id) => (
                      <span key={id} className="pill pill-gray">ID: {id}</span>
                    ))}</div>
                  : <span className="text-xs text-gray-600 italic">No whitelisted users</span>}
              </div>
            </>
          );
        })()}

        {/* ── AUTOMOD ──────────────────────────────────────────── */}
        {moduleId === "automod" && (() => {
          const am = local;
          return (
            <>
              <RowToggle label="Enable AutoMod" desc="Toggle all automod filters on/off" checked={Boolean(am.enabled)} onChange={(v) => set("enabled", v)} />
              <SectionHeader title="Active Filters" />
              <div className="space-y-0.5 py-2">
                {AUTOMOD_EVENTS.map((event) => {
                  const active = ((am.activeEvents as string[]) || []).includes(event);
                  return (
                    <label key={event} className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/3 cursor-pointer transition-colors">
                      <input type="checkbox" checked={active} className="flex-shrink-0"
                        onChange={(e) => {
                          const cur = (am.activeEvents as string[]) || [];
                          set("activeEvents", e.target.checked ? [...cur, event] : cur.filter((ev) => ev !== event));
                        }}
                      />
                      <span className="text-sm text-gray-200">{event}</span>
                      {active && <span className="ml-auto pill pill-green">Active</span>}
                    </label>
                  );
                })}
              </div>
              <SectionHeader title="Logging" />
              <RowSelect label="AutoMod Log Channel" desc="Where violation alerts are sent"
                channels={channels} value={String(am.logChannel || "")} onChange={(v) => set("logChannel", v)} />
            </>
          );
        })()}

        {/* ── LOGGING ──────────────────────────────────────────── */}
        {moduleId === "logging" && (() => {
          const lg = local;
          const ch = (lg.channels as Record<string, string>) || {};
          return (
            <>
              <Banner color="blue">Set a channel for each log type. Leave blank to disable that type.</Banner>
              <div className="grid gap-2 mt-3">
                {LOG_TYPES.map(({ key, label }) => (
                  <div key={key} className="flex items-center gap-3 p-3 rounded-lg bg-[#0a0a0a] border border-[#1e1e1e]">
                    <span className="text-sm text-gray-300 flex-1 min-w-0">{label}</span>
                    <select value={ch[key] || ""} onChange={(e) => set("channels", { ...ch, [key]: e.target.value })} className="input w-44 flex-shrink-0">
                      <option value="">Disabled</option>
                      {channels.map((c) => <option key={c.id} value={c.id}>#{c.name}</option>)}
                    </select>
                  </div>
                ))}
              </div>
            </>
          );
        })()}

        {/* ── WELCOME & BOOSTERS ───────────────────────────────── */}
        {moduleId === "welcome" && (() => {
          const wc = local;
          return (
            <>
              <SectionHeader title="Welcome Messages" />
              <RowToggle label="Enable Welcome Messages" desc="Send a message when a new member joins" checked={Boolean(wc.enabled)} onChange={(v) => set("enabled", v)} />
              <RowSelect label="Welcome Channel" desc="Channel for welcome messages" channels={channels} value={String(wc.channelId || "")} onChange={(v) => set("channelId", v)} />
              {wc.welcomeType !== "embed" && (
                <RowTextarea
                  label="Welcome Message" rows={4}
                  desc="Variables: {user} {user_name} {user_id} {server_name} {server_membercount}"
                  value={String(wc.welcomeMessage || "")} onChange={(v) => set("welcomeMessage", v)}
                  placeholder="Welcome {user} to {server_name}! You are member #{server_membercount}"
                />
              )}
              {wc.welcomeType === "embed" && (
                <Banner color="blue">This server uses an embed welcome configured via <code>greet setup</code>. Edit the channel above; manage embed content via bot command.</Banner>
              )}
              <UploadField label="Welcome Banner Image" desc="Optional image displayed in the welcome embed (PNG, JPG, GIF)" accept="image/*"
                preview={wc.bannerPreview as string | undefined}
                onFile={(f) => {
                  const url = URL.createObjectURL(f);
                  set("bannerPreview", url);
                  set("bannerFileName", f.name);
                }}
              />

              <SectionHeader title="Booster Messages" />
              <RowToggle label="Enable Booster Messages" desc="Post a message when someone boosts the server" checked={Boolean(wc.boosterEnabled)} onChange={(v) => set("boosterEnabled", v)} />
              <RowSelect label="Boost Channel" channels={channels} value={String(wc.boostChannelId || "")} onChange={(v) => set("boostChannelId", v)} />
              <RowTextarea label="Boost Message" desc="Variables: {user} {user_name} {server_name} {boost_count}"
                value={String(wc.boostMessage || "")} onChange={(v) => set("boostMessage", v)}
                placeholder="🎉 {user} just boosted {server_name}!" />

              {wc.enabled && !wc.channelId && (
                <Banner color="yellow">⚠ No welcome channel set. Select a channel to activate welcome messages.</Banner>
              )}
            </>
          );
        })()}

        {/* ── LEVELING (PREMIUM) ───────────────────────────────── */}
        {moduleId === "leveling" && isPremium && (() => {
          const lv = local;
          return (
            <>
              <RowToggle label="Enable Leveling" desc="Members earn XP for sending messages" checked={Boolean(lv.enabled)} onChange={(v) => set("enabled", v)} />
              <RowToggle label="DM Level-Up Notification" desc="DM members when they level up" checked={Boolean(lv.dmLevelUp)} onChange={(v) => set("dmLevelUp", v)} />
              <SectionHeader title="Channel & Message" />
              <RowSelect label="Level-Up Channel" desc="Where announcements are sent (blank = same channel)" channels={channels} value={String(lv.channelId || "")} onChange={(v) => set("channelId", v)} />
              <RowTextarea label="Level-Up Message" desc="Variables: {user} {level} {user_name}"
                value={String(lv.levelMessage || "")} onChange={(v) => set("levelMessage", v)}
                placeholder="🎉 Congrats {user}! You reached level {level}!" />
              <SectionHeader title="XP Settings" />
              <RowNum label="XP Per Message" desc="Base XP awarded per message" value={Number(lv.xpPerMessage ?? 20)} onChange={(v) => set("xpPerMessage", v)} min={1} max={999} />
              <RowNum label="Min XP (random low)" value={Number(lv.minXp ?? 15)} onChange={(v) => set("minXp", v)} min={1} max={999} />
              <RowNum label="Max XP (random high)" value={Number(lv.maxXp ?? 25)} onChange={(v) => set("maxXp", v)} min={1} max={999} />
              <RowNum label="Cooldown (seconds)" desc="Minimum time between XP gains per user" value={Number(lv.cooldown ?? 60)} onChange={(v) => set("cooldown", v)} min={1} max={3600} />
              <Banner color="gray">Manage level roles via: <code>levelrole set &lt;level&gt; @role</code></Banner>
            </>
          );
        })()}

        {/* ── GIVEAWAYS ────────────────────────────────────────── */}
        {moduleId === "giveaway" && (() => {
          const gws = (settings.giveaways as Record<string, unknown>[]) || [];
          return (
            <>
              <Banner color="blue">
                Giveaways are managed via bot commands: <code>gstart</code>, <code>gend</code>, <code>greroll</code>, <code>gcancel</code>
              </Banner>
              {gws.length === 0 ? (
                <div className="text-center py-12 text-gray-600">
                  <Gift size={32} className="mx-auto mb-3 opacity-30" />
                  <p className="text-sm">No active giveaways right now.</p>
                </div>
              ) : (
                <div className="space-y-2 mt-3">
                  {gws.map((gw, i) => (
                    <div key={i} className="p-3.5 rounded-xl bg-[#0a0a0a] border border-[#1e1e1e]">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-white text-sm">{String(gw.prize)}</span>
                        <span className="pill pill-pink" style={{color:"#f472b6",background:"rgba(244,114,182,0.1)",border:"1px solid rgba(244,114,182,0.2)"}}>
                          {String(gw.winners)} winner{Number(gw.winners) !== 1 ? "s" : ""}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">Ends: {new Date(Number(gw.endsAt) * 1000).toLocaleString()}</p>
                    </div>
                  ))}
                </div>
              )}
            </>
          );
        })()}

        {/* ── REACTION ROLES ───────────────────────────────────── */}
        {moduleId === "reactionroles" && (
          <>
            <Banner color="blue">Reaction roles are created via the <code>reactionroles</code> command in Discord. Active reaction role panels are listed below.</Banner>
            {!settings.reactionroles || (settings.reactionroles as Record<string, unknown>[]).length === 0 ? (
              <div className="text-center py-12 text-gray-600">
                <Repeat2 size={28} className="mx-auto mb-3 opacity-30" />
                <p className="text-sm">No reaction role panels configured.</p>
              </div>
            ) : null}
          </>
        )}

        {/* ── AUTOROLE ─────────────────────────────────────────── */}
        {moduleId === "autorole" && (() => {
          const ar = local;
          return (
            <>
              <Banner color="blue">Roles assigned automatically when someone joins the server.</Banner>
              <RowMultiRole label="Roles for New Members" desc="Assigned to human members on join" roles={roles}
                values={(ar.humanRoles as string[]) || []} onChange={(v) => set("humanRoles", v)} />
              <RowMultiRole label="Roles for Bots" desc="Assigned to bots when they are added" roles={roles}
                values={(ar.botRoles as string[]) || []} onChange={(v) => set("botRoles", v)} />
            </>
          );
        })()}

        {/* ── NIGHTMODE ────────────────────────────────────────── */}
        {moduleId === "nightmode" && (() => {
          const nm = local;
          return (
            <>
              <Banner color="blue">
                Night Mode is toggled via: <code>nightmode enable</code> / <code>nightmode disable</code>. It locks/unlocks channels on a schedule.
              </Banner>
              <div className="section-row flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-white">Night Mode Status</p>
                  <p className="text-xs text-gray-500 mt-0.5">Current state (read-only — use bot command to change)</p>
                </div>
                <span className={nm.enabled ? "pill pill-green" : "pill pill-gray"}>
                  {nm.enabled ? "Active" : "Inactive"}
                </span>
              </div>
              <RowSelect label="Locked Channels" desc="Configure via bot command which channels are locked" channels={channels}
                value={String(nm.logChannel || "")} onChange={(v) => set("logChannel", v)} placeholder="Log channel for nightmode events" />
              <RowInput label="Start Time (UTC)" desc="e.g. 22:00" value={String(nm.startTime || "")} onChange={(v) => set("startTime", v)} placeholder="22:00" />
              <RowInput label="End Time (UTC)" desc="e.g. 08:00" value={String(nm.endTime || "")} onChange={(v) => set("endTime", v)} placeholder="08:00" />
            </>
          );
        })()}

        {/* ── MODERATION ───────────────────────────────────────── */}
        {moduleId === "moderation" && (() => {
          const md = local;
          return (
            <>
              <Banner color="gray">Configure default moderation behaviour and channels.</Banner>
              <SectionHeader title="Channels" />
              <RowSelect label="Mod Log Channel" desc="Where mod actions are logged" channels={channels} value={String(md.modLogChannel || "")} onChange={(v) => set("modLogChannel", v)} />
              <SectionHeader title="Mute Settings" />
              <RowRoleSelect label="Muted Role" desc="Role assigned when a member is muted" roles={roles} value={String(md.muteRole || "")} onChange={(v) => set("muteRole", v)} />
              <SectionHeader title="Defaults" />
              <RowDropdown label="Default Warn Action" desc="Action after reaching warn threshold" 
                options={[{ value:"none",label:"None"},{value:"kick",label:"Kick"},{value:"ban",label:"Ban"},{value:"mute",label:"Mute"}]}
                value={String(md.warnAction || "none")} onChange={(v) => set("warnAction", v)} />
              <RowNum label="Warn Threshold" desc="Warnings before auto-action" value={Number(md.warnThreshold ?? 3)} onChange={(v) => set("warnThreshold", v)} min={1} max={20} />
              <SectionHeader title="DM Notifications" />
              <RowToggle label="DM on Ban" desc="Send a DM to banned members" checked={Boolean(md.dmBan)} onChange={(v) => set("dmBan", v)} />
              <RowToggle label="DM on Kick" desc="Send a DM to kicked members" checked={Boolean(md.dmKick)} onChange={(v) => set("dmKick", v)} />
              <RowToggle label="DM on Mute" desc="Send a DM to muted members" checked={Boolean(md.dmMute)} onChange={(v) => set("dmMute", v)} />
              <RowToggle label="DM on Warn" desc="Send a DM when a member is warned" checked={Boolean(md.dmWarn)} onChange={(v) => set("dmWarn", v)} />
            </>
          );
        })()}

        {/* ── SETUP / ROLE TRIGGERS ────────────────────────────── */}
        {moduleId === "setup" && (() => {
          const sp = local;
          return (
            <>
              <Banner color="gray">Configure role-based command triggers for this server.</Banner>
              <SectionHeader title="Permission Roles" />
              <RowRoleSelect label="Admin Role" desc="Users with this role can use admin commands" roles={roles} value={String(sp.adminRole || "")} onChange={(v) => set("adminRole", v)} />
              <RowRoleSelect label="Mod Role" desc="Users with this role can use mod commands" roles={roles} value={String(sp.modRole || "")} onChange={(v) => set("modRole", v)} />
              <RowRoleSelect label="Helper Role" desc="Users with this role can use helper commands" roles={roles} value={String(sp.helperRole || "")} onChange={(v) => set("helperRole", v)} />
              <SectionHeader title="Command Settings" />
              <RowInput label="Command Prefix" desc="Bot prefix for this server (default: s!)" value={String(sp.prefix || "")} onChange={(v) => set("prefix", v)} placeholder="s!" />
              <RowSelect label="Bot Commands Channel" desc="Channel where bot commands are allowed" channels={channels} value={String(sp.botChannel || "")} onChange={(v) => set("botChannel", v)} />
              <SectionHeader title="Custom Triggers" />
              <Banner color="blue">Custom role triggers are managed via the <code>setup</code> command in Discord.</Banner>
            </>
          );
        })()}

        {/* ── TICKET SYSTEM ────────────────────────────────────── */}
        {moduleId === "tickets" && (() => {
          const tk = local;
          return (
            <>
              <RowToggle label="Enable Ticket System" desc="Allow members to open support tickets" checked={Boolean(tk.enabled)} onChange={(v) => set("enabled", v)} />
              <SectionHeader title="Channels" />
              <RowSelect label="Ticket Category Channel" desc="Category where new tickets are created" channels={channels} value={String(tk.categoryId || "")} onChange={(v) => set("categoryId", v)} />
              <RowSelect label="Ticket Log Channel" desc="Where ticket transcripts are sent on close" channels={channels} value={String(tk.logChannel || "")} onChange={(v) => set("logChannel", v)} />
              <SectionHeader title="Roles" />
              <RowMultiRole label="Support Roles" desc="Roles that can see and manage tickets" roles={roles} values={(tk.supportRoles as string[]) || []} onChange={(v) => set("supportRoles", v)} />
              <SectionHeader title="Customisation" />
              <RowInput label="Ticket Panel Title" desc="Title shown on the ticket open button" value={String(tk.panelTitle || "")} onChange={(v) => set("panelTitle", v)} placeholder="Support Tickets" />
              <RowTextarea label="Ticket Panel Description" desc="Text shown in the ticket panel embed"
                value={String(tk.panelDesc || "")} onChange={(v) => set("panelDesc", v)}
                placeholder="Click the button below to open a ticket." />
              <RowTextarea label="Open Message" desc="Message sent inside a newly opened ticket"
                value={String(tk.openMessage || "")} onChange={(v) => set("openMessage", v)}
                placeholder="Hello {user}, a staff member will assist you shortly." />
              <RowNum label="Max Open Tickets Per User" value={Number(tk.maxPerUser ?? 1)} onChange={(v) => set("maxPerUser", v)} min={1} max={10} />
              <RowToggle label="Save HTML Transcripts" desc="Generate an HTML transcript when a ticket is closed" checked={Boolean(tk.transcripts)} onChange={(v) => set("transcripts", v)} />
              <UploadField label="Ticket Panel Image" desc="Optional image/banner for the ticket panel" accept="image/*"
                preview={tk.panelImagePreview as string | undefined}
                onFile={(f) => { set("panelImagePreview", URL.createObjectURL(f)); set("panelImageFile", f.name); }} />
            </>
          );
        })()}

        {/* ── EMBEDS ───────────────────────────────────────────── */}
        {moduleId === "embeds" && (() => {
          const em = local;
          return (
            <>
              <Banner color="gray">Create and manage custom embeds to send in channels. Use the bot command <code>embed create</code> for full builder.</Banner>
              <SectionHeader title="Default Embed Style" />
              <RowInput label="Default Embed Color" desc="Hex color e.g. #ef4444" value={String(em.defaultColor || "")} onChange={(v) => set("defaultColor", v)} placeholder="#ef4444" />
              <RowInput label="Default Footer Text" desc="Footer added to all embeds" value={String(em.defaultFooter || "")} onChange={(v) => set("defaultFooter", v)} placeholder="SynthX Bot" />
              <UploadField label="Default Footer Icon" desc="Small icon shown in embed footers" accept="image/*"
                preview={em.footerIconPreview as string | undefined}
                onFile={(f) => { set("footerIconPreview", URL.createObjectURL(f)); set("footerIconFile", f.name); }} />
              <RowToggle label="Include Timestamp" desc="Add a timestamp to all embeds" checked={Boolean(em.timestamp)} onChange={(v) => set("timestamp", v)} />
            </>
          );
        })()}

        {/* ── MINECRAFT STATUS ─────────────────────────────────── */}
        {moduleId === "minecraft" && (() => {
          const mc = local;
          return (
            <>
              <Banner color="gray">Display live Minecraft server status in a Discord channel.</Banner>
              <SectionHeader title="Server Settings" />
              <RowInput label="Server IP / Host" desc="Your Minecraft server address" value={String(mc.serverIp || "")} onChange={(v) => set("serverIp", v)} placeholder="play.myserver.net" />
              <RowNum label="Server Port" value={Number(mc.serverPort ?? 25565)} onChange={(v) => set("serverPort", v)} min={1} max={65535} />
              <RowDropdown label="Server Type"
                options={[{ value:"java",label:"Java Edition" },{ value:"bedrock",label:"Bedrock Edition" }]}
                value={String(mc.serverType || "java")} onChange={(v) => set("serverType", v)} />
              <SectionHeader title="Status Display" />
              <RowSelect label="Status Channel" desc="Channel where the status message is posted" channels={channels} value={String(mc.statusChannel || "")} onChange={(v) => set("statusChannel", v)} />
              <RowNum label="Update Interval (minutes)" desc="How often to refresh the status (min 1)" value={Number(mc.updateInterval ?? 5)} onChange={(v) => set("updateInterval", v)} min={1} max={60} />
              <RowToggle label="Show Player List" desc="List online players in the status embed" checked={Boolean(mc.showPlayers)} onChange={(v) => set("showPlayers", v)} />
              <RowToggle label="Show Server MOTD" desc="Display the server message of the day" checked={Boolean(mc.showMotd)} onChange={(v) => set("showMotd", v)} />
            </>
          );
        })()}

        {/* ── UTILITY ──────────────────────────────────────────── */}
        {moduleId === "utility" && (() => {
          const ut = local;
          return (
            <>
              <Banner color="gray">General utility settings for this server.</Banner>
              <SectionHeader title="General" />
              <RowInput label="Bot Prefix" desc="Command prefix for this server" value={String(ut.prefix || "")} onChange={(v) => set("prefix", v)} placeholder="s!" />
              <RowSelect label="Bot Commands Channel" desc="Restrict bot commands to this channel (optional)" channels={channels} value={String(ut.commandChannel || "")} onChange={(v) => set("commandChannel", v)} />
              <SectionHeader title="Features" />
              <RowToggle label="Enable AFK System" desc="Members can set AFK status" checked={Boolean(ut.afkEnabled)} onChange={(v) => set("afkEnabled", v)} />
              <RowToggle label="Enable Starboard" desc="Pin messages that get enough ⭐ reactions" checked={Boolean(ut.starboardEnabled)} onChange={(v) => set("starboardEnabled", v)} />
              {ut.starboardEnabled && (
                <>
                  <RowSelect label="Starboard Channel" channels={channels} value={String(ut.starboardChannel || "")} onChange={(v) => set("starboardChannel", v)} />
                  <RowNum label="Stars Required" value={Number(ut.starboardThreshold ?? 3)} onChange={(v) => set("starboardThreshold", v)} min={1} max={50} />
                </>
              )}
              <RowToggle label="Enable Suggestions" desc="Allow members to submit suggestions" checked={Boolean(ut.suggestionsEnabled)} onChange={(v) => set("suggestionsEnabled", v)} />
              {ut.suggestionsEnabled && (
                <RowSelect label="Suggestions Channel" channels={channels} value={String(ut.suggestionsChannel || "")} onChange={(v) => set("suggestionsChannel", v)} />
              )}
            </>
          );
        })()}

      </div>

      {/* Save bar */}
      {!readOnly && (
        <div className="flex items-center gap-3 flex-wrap">
          <button
            onClick={handleSave}
            disabled={saving || ownerGated}
            title={ownerGated ? "Only the server owner can save" : undefined}
            className="btn-primary"
          >
            {saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
            {saving ? "Saving…" : ownerGated ? "Owner Only" : "Save Changes"}
          </button>
          {saved && (
            <span className="flex items-center gap-1.5 text-green-400 text-sm font-medium">
              <CheckCircle size={15} /> Saved
            </span>
          )}
          {err && (
            <span className="flex items-center gap-1.5 text-red-400 text-sm">
              <AlertTriangle size={15} /> {err}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
