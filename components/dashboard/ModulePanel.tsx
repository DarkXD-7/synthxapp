"use client";

import { useState, useEffect, useCallback, useRef, ReactNode, ElementType, Dispatch, SetStateAction } from "react";
import {
  Shield, Star, Gift, Settings2, Users2, Bell, Moon, Save, Loader2,
  CheckCircle, AlertTriangle, X, Lock, Hammer, Sliders, Repeat2,
  Layers, Ticket, Server, UserPlus, Wrench, Upload, Plus, Trash2,
  Info, Hash, Send, Eye, RefreshCw, Zap, Ban, MessageSquare, Crown,
} from "lucide-react";

interface Channel { id: string; name: string; }
interface Role { id: string; name: string; color: number; }
interface Props {
  moduleId: string;
  guildId: string;
  isPremium: boolean;
  isOwner: boolean;
  settings: Record<string, unknown>;
  onSave: (module: string, settings: Record<string, unknown>) => void;
}

// ─── UI Primitives ─────────────────────────────────────────────────────────

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
        <div className="toggle-track"><div className="toggle-thumb" /></div>
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
      <p className="text-sm font-medium text-white mb-1">{label}</p>
      {desc && <p className="text-xs text-gray-500 mb-2">{desc}</p>}
      <select value={value} onChange={(e) => onChange(e.target.value)} disabled={disabled} className="input">
        <option value="">{placeholder || "— Select Channel —"}</option>
        {channels.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
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
        <option value="">— Select Role —</option>
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
        {values.length === 0 && <span className="text-xs text-gray-600 italic">None selected</span>}
      </div>
      {!disabled && (
        <select defaultValue="" onChange={(e) => {
          if (e.target.value && !values.includes(e.target.value)) onChange([...values, e.target.value]);
          e.target.value = "";
        }} className="input">
          <option value="">— Add Role —</option>
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
      <textarea value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
        rows={rows} disabled={disabled} className="input" style={{ resize: "vertical" }} />
    </div>
  );
}

function RowInput({ label, desc, value, onChange, placeholder, disabled, type = "text" }: {
  label: string; desc?: string; value: string;
  onChange: (v: string) => void; placeholder?: string; disabled?: boolean; type?: string;
}) {
  return (
    <div className="section-row">
      <p className="text-sm font-medium text-white mb-1">{label}</p>
      {desc && <p className="text-xs text-gray-500 mb-2">{desc}</p>}
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)}
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
        <input type="number" value={value} min={min} max={max} disabled={disabled}
          onChange={(e) => onChange(Number(e.target.value))} className="input w-24 text-right" />
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

function Banner({ color, children }: { color: "yellow" | "blue" | "red" | "green" | "gray"; children: ReactNode }) {
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
      <div className="upload-zone" onClick={() => ref.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) onFile(f); }}>
        {preview ? (
          <img src={preview} alt="preview" className="h-20 object-contain mx-auto mb-2 rounded" />
        ) : (
          <Upload size={20} className="text-gray-600 mx-auto mb-2" />
        )}
        <p className="text-xs text-gray-500">Drag & drop or <span className="text-red-400 font-medium">browse files</span></p>
        <p className="text-[10px] text-gray-700 mt-0.5">{accept ? "PNG, JPG, GIF, WEBP" : "Any file"} — max 8MB</p>
      </div>
      <input ref={ref} type="file" accept={accept} className="hidden"
        onChange={(e) => { const f = e.target.files?.[0]; if (f) onFile(f); }} />
    </div>
  );
}

function SectionHeader({ title }: { title: string }) {
  return <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mt-5 mb-2 pb-1 border-b border-[#1e1e1e]">{title}</p>;
}

function PremiumGate({ title }: { title: string }) {
  return (
    <div className="max-w-lg mx-auto text-center py-16">
      <div className="w-16 h-16 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mx-auto mb-5">
        <Star size={28} className="text-purple-400" />
      </div>
      <h2 className="text-xl font-bold text-white mb-2">Premium Required</h2>
      <p className="text-gray-500 text-sm mb-6">
        <strong className="text-purple-300">{title}</strong> is a premium feature.
      </p>
      <a href="https://discord.gg/WKX5HHPmWz" target="_blank" rel="noopener noreferrer"
        className="btn-primary" style={{ background: "linear-gradient(135deg,#9333ea,#7c3aed)" }}>
        Get Premium
      </a>
    </div>
  );
}

// Module metadata
const META: Record<string, { title: string; icon: ElementType; iconColor: string; premium?: boolean; ownerOnly?: boolean }> = {
  antinuke:     { title: "Anti-Nuke",         icon: Shield,    iconColor: "#f87171", ownerOnly: true },
  automod:      { title: "AutoMod",            icon: Settings2, iconColor: "#fb923c" },
  logging:      { title: "Logging",            icon: Bell,      iconColor: "#818cf8" },
  welcome:      { title: "Welcomer & Boosts",  icon: UserPlus,  iconColor: "#34d399" },
  leveling:     { title: "Leveling",           icon: Star,      iconColor: "#facc15", premium: true },
  giveaway:     { title: "Giveaways",          icon: Gift,      iconColor: "#f472b6" },
  reactionroles:{ title: "Reaction Roles",     icon: Repeat2,   iconColor: "#60a5fa" },
  autorole:     { title: "Auto Role",          icon: Users2,    iconColor: "#22d3ee" },
  nightmode:    { title: "Night Mode",         icon: Moon,      iconColor: "#93c5fd" },
  moderation:   { title: "Moderation",         icon: Hammer,    iconColor: "#fbbf24" },
  setup:        { title: "Setup / Roles",      icon: Sliders,   iconColor: "#a78bfa" },
  tickets:      { title: "Ticket System",      icon: Ticket,    iconColor: "#4ade80" },
  embeds:       { title: "Embeds",             icon: Layers,    iconColor: "#fb923c" },
  minecraft:    { title: "Minecraft Status",   icon: Server,    iconColor: "#86efac" },
  ignore:       { title: "Ignore Setup",       icon: Wrench,    iconColor: "#9ca3af" },
};

const AUTOMOD_EVENTS = [
  { key: "Anti spam",         label: "Anti Spam",          desc: "Detect message spam" },
  { key: "Anti caps",         label: "Anti Caps",          desc: "Block all-caps messages" },
  { key: "Anti link",         label: "Anti Link",          desc: "Block external links" },
  { key: "Anti invites",      label: "Anti Invites",       desc: "Block Discord invite links" },
  { key: "Anti mass mention", label: "Anti Mass Mention",  desc: "Block mass @mentions" },
  { key: "Anti emoji spam",   label: "Anti Emoji Spam",    desc: "Block excessive emojis" },
  { key: "Anti NSFW link",    label: "Anti NSFW Link",     desc: "Block NSFW URLs" },
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

// ─── Ticket Panel Sender ───────────────────────────────────────────────────
function TicketPanelSender({ guildId, channels }: { guildId: string; channels: Channel[] }) {
  const [channelId, setChannelId] = useState("");
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const send = async () => {
    if (!channelId) return;
    setSending(true);
    setResult(null);
    try {
      const res = await fetch(`/api/settings/${guildId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ module: "tickets_send_panel", settings: { channelId } }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setResult({ type: "success", text: data.message || "Panel sent!" });
      } else {
        setResult({ type: "error", text: data.error || "Failed to send panel" });
      }
    } catch {
      setResult({ type: "error", text: "Network error" });
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="p-4 rounded-xl bg-[#0a0a0a] border border-[#1e1e1e] space-y-3">
      <p className="text-sm font-semibold text-white">Send Ticket Panel</p>
      <p className="text-xs text-gray-500">Send the configured ticket panel embed to a channel.</p>
      <select value={channelId} onChange={(e) => setChannelId(e.target.value)} className="input">
        <option value="">— Select Channel —</option>
        {channels.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
      </select>
      <button onClick={send} disabled={!channelId || sending}
        className="btn-primary w-full flex items-center justify-center gap-2">
        {sending ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
        {sending ? "Sending…" : "Send Panel"}
      </button>
      {result && (
        <div className={`text-xs p-2 rounded-lg ${result.type === "success" ? "bg-green-500/10 text-green-400 border border-green-500/20" : "bg-red-500/10 text-red-400 border border-red-500/20"}`}>
          {result.text}
        </div>
      )}
    </div>
  );
}

// ─── Embed Preview ──────────────────────────────────────────────────────────
function DiscordEmbedPreview({ embed }: { embed: Record<string, string> }) {
  const color = embed.color ? `#${embed.color.replace("#", "")}` : "#4ade80";
  return (
    <div className="rounded-lg overflow-hidden bg-[#2f3136] border-l-4 max-w-lg" style={{ borderColor: color }}>
      <div className="p-3">
        {embed.authorName && (
          <div className="flex items-center gap-2 mb-2">
            {embed.authorIcon && <img src={embed.authorIcon} alt="" className="w-5 h-5 rounded-full" onError={(e) => (e.currentTarget.style.display = "none")} />}
            <p className="text-xs font-semibold text-gray-200">{embed.authorName}</p>
          </div>
        )}
        {embed.title && <p className="text-sm font-bold text-white mb-1">{embed.title}</p>}
        {embed.description && <p className="text-xs text-gray-300 whitespace-pre-wrap mb-2">{embed.description}</p>}
        {embed.image && <img src={embed.image} alt="" className="w-full rounded mt-2 max-h-48 object-cover" onError={(e) => (e.currentTarget.style.display = "none")} />}
        {(embed.footerText || embed.footerIcon) && (
          <div className="flex items-center gap-2 mt-3 pt-2 border-t border-white/10">
            {embed.footerIcon && <img src={embed.footerIcon} alt="" className="w-4 h-4 rounded-full" onError={(e) => (e.currentTarget.style.display = "none")} />}
            {embed.footerText && <p className="text-[10px] text-gray-500">{embed.footerText}</p>}
          </div>
        )}
      </div>
      {embed.thumbnail && (
        <img src={embed.thumbnail} alt="" className="absolute top-3 right-3 w-16 h-16 rounded object-cover" onError={(e) => (e.currentTarget.style.display = "none")} />
      )}
    </div>
  );
}

// ─── Extracted Module Sub-Components (fixes Rules of Hooks) ─────────────────

function AntinukePanel({ local, set, readOnly, guildId }: {
  local: Record<string, unknown>; set: (k: string, v: unknown) => void;
  readOnly: boolean; guildId: string;
}) {
  const an = local;
  const whitelist: string[] = (an.whitelist as string[]) || [];
  const [newWlId, setNewWlId] = useState("");
  const [wlStatus, setWlStatus] = useState<string | null>(null);
  const [extraOwnerInput, setExtraOwnerInput] = useState(String(an.extraOwner || ""));
  const [eoStatus, setEoStatus] = useState<string | null>(null);

  const addToWhitelist = async () => {
    if (!newWlId.trim()) return;
    const updated = [...whitelist, newWlId.trim()];
    set("whitelist", updated);
    setNewWlId("");
    setWlStatus("Added. Save changes to apply.");
  };

  const removeFromWhitelist = (uid: string) => {
    set("whitelist", whitelist.filter((x) => x !== uid));
    setWlStatus("Removed. Save changes to apply.");
  };

  const setExtraOwner = () => {
    set("extraOwner", extraOwnerInput.trim() || null);
    setEoStatus("Extra owner set. Save to apply.");
  };

  const modules = [
    { key: "antiban",      label: "Anti Ban",            desc: "Prevent mass bans" },
    { key: "antikick",     label: "Anti Kick",           desc: "Prevent mass kicks" },
    { key: "antibotadd",   label: "Anti Bot Add",        desc: "Prevent adding bots" },
    { key: "antichcr",     label: "Anti Channel Create", desc: "Prevent mass channel creation" },
    { key: "antichdl",     label: "Anti Channel Delete", desc: "Prevent mass channel deletion" },
    { key: "antieveryone", label: "Anti Everyone Ping",  desc: "Block @everyone pings" },
    { key: "antirlcr",     label: "Anti Role Create",    desc: "Prevent mass role creation" },
    { key: "antirldl",     label: "Anti Role Delete",    desc: "Prevent mass role deletion" },
    { key: "antiwebhookcr",label: "Anti Webhook Create", desc: "Block webhook creation" },
    { key: "antiwebhookdl",label: "Anti Webhook Delete", desc: "Block webhook deletion" },
    { key: "antiprune",    label: "Anti Prune",          desc: "Prevent member pruning" },
  ];

  return (
    <>
      <Banner color="red">Anti-Nuke protects your server from raids and nukes. Only the server owner and extra owner can modify these settings.</Banner>

      <SectionHeader title="Main Toggle" />
      <RowToggle label="Enable Anti-Nuke" desc="Activate server protection"
        checked={Boolean(an.enabled)} onChange={(v) => set("enabled", v)} disabled={readOnly} />

      <SectionHeader title="Punishment" />
      <RowDropdown label="Default Punishment" desc="Action taken against violators"
        options={[
          { value: "ban",      label: "Ban" },
          { value: "kick",     label: "Kick" },
          { value: "temprole", label: "Temp Role" },
        ]}
        value={String(an.punishment || "ban")} onChange={(v) => set("punishment", v)} disabled={readOnly} />

      <SectionHeader title="Protection Modules" />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {modules.map(({ key, label, desc }) => (
          <div key={key} className="flex items-center justify-between p-3 rounded-xl bg-[#0a0a0a] border border-[#1e1e1e]">
            <div>
              <p className="text-sm font-medium text-white">{label}</p>
              <p className="text-xs text-gray-600">{desc}</p>
            </div>
            <label className={`toggle flex-shrink-0 ${readOnly ? "opacity-40 pointer-events-none" : ""}`}>
              <input type="checkbox" checked={Boolean(an[key as keyof typeof an] !== false)}
                onChange={(e) => set(key, e.target.checked)} />
              <div className="toggle-track"><div className="toggle-thumb" /></div>
            </label>
          </div>
        ))}
      </div>

      <SectionHeader title="Extra Owner" />
      <div className="section-row space-y-2">
        <p className="text-sm font-medium text-white">Extra Owner</p>
        <p className="text-xs text-gray-500">This user gets the same Anti-Nuke access as the server owner.</p>
        {Boolean(an.extraOwner) && (
          <div className="flex items-center gap-2 text-xs bg-orange-500/10 border border-orange-500/20 text-orange-300 px-3 py-2 rounded-lg">
            <Crown size={12} />
            Current Extra Owner: <code>{String(an.extraOwner)}</code>
            {!readOnly && (
              <button onClick={() => { set("extraOwner", null); setEoStatus("Removed. Save to apply."); }}
                className="ml-auto text-orange-500 hover:text-red-400"><X size={12} /></button>
            )}
          </div>
        )}
        {!readOnly && (
          <div className="flex gap-2">
            <input type="text" value={extraOwnerInput} onChange={(e) => setExtraOwnerInput(e.target.value)}
              placeholder="User ID or username" className="input flex-1 text-sm" />
            <button onClick={setExtraOwner} className="btn-secondary text-xs px-3">Set</button>
          </div>
        )}
        {eoStatus && <p className="text-xs text-green-400">{eoStatus}</p>}
      </div>

      <SectionHeader title="Whitelist" />
      <div className="section-row space-y-2">
        <p className="text-sm font-medium text-white">Whitelisted Users</p>
        <p className="text-xs text-gray-500">These users are exempt from Anti-Nuke protection.</p>
        <div className="flex flex-wrap gap-1.5 min-h-[30px]">
          {whitelist.length === 0 && <span className="text-xs text-gray-600 italic">No whitelisted users</span>}
          {whitelist.map((uid) => (
            <span key={uid} className="flex items-center gap-1 text-xs bg-[#1c1c1c] text-gray-300 px-2 py-1 rounded-full border border-[#2a2a2a]">
              {uid}
              {!readOnly && (
                <button onClick={() => removeFromWhitelist(uid)} className="text-gray-500 hover:text-red-400 transition-colors">
                  <X size={10} />
                </button>
              )}
            </span>
          ))}
        </div>
        {!readOnly && (
          <div className="flex gap-2">
            <input type="text" value={newWlId} onChange={(e) => setNewWlId(e.target.value)}
              placeholder="User ID or username" className="input flex-1 text-sm"
              onKeyDown={(e) => e.key === "Enter" && addToWhitelist()} />
            <button onClick={addToWhitelist} className="btn-secondary text-xs px-3">
              <Plus size={12} />
            </button>
          </div>
        )}
        {wlStatus && <p className="text-xs text-green-400">{wlStatus}</p>}
      </div>
    </>
  );
}

function AutomodPanel({ local, set, channels, roles }: {
  local: Record<string, unknown>; set: (k: string, v: unknown) => void;
  channels: Channel[]; roles: Role[];
}) {
  const am = local;
  const activeEvents: string[] = (am.activeEvents as string[]) || [];
  const ignoredUsers: string[] = (am.ignoredUsers as string[]) || [];
  const ignoredChannels: string[] = (am.ignoredChannels as string[]) || [];
  const [newIgnoreUser, setNewIgnoreUser] = useState("");
  const [newIgnoreCh, setNewIgnoreCh] = useState("");
  const punishMap: Record<string, string> = (am.punishments as Record<string, string>) || {};

  const toggleEvent = (event: string) => {
    if (activeEvents.includes(event)) set("activeEvents", activeEvents.filter((e) => e !== event));
    else set("activeEvents", [...activeEvents, event]);
  };

  const setPunishment = (event: string, punishment: string) => {
    set("punishments", { ...punishMap, [event]: punishment });
  };

  return (
    <>
      <SectionHeader title="Main Toggle" />
      <RowToggle label="Enable AutoMod" desc="Automatically moderate messages"
        checked={Boolean(am.enabled)} onChange={(v) => set("enabled", v)} />

      <SectionHeader title="Log Channel" />
      <RowSelect label="AutoMod Log Channel" desc="Where AutoMod actions are logged"
        channels={channels} value={String(am.logChannel || "")} onChange={(v) => set("logChannel", v)} />

      <SectionHeader title="Filters" />
      <div className="space-y-2">
        {AUTOMOD_EVENTS.map(({ key, label, desc }) => {
          const isActive = activeEvents.includes(key);
          return (
            <div key={key} className={`p-3 rounded-xl border transition-colors ${isActive ? "bg-orange-500/5 border-orange-500/20" : "bg-[#0a0a0a] border-[#1e1e1e]"}`}>
              <div className="flex items-center justify-between mb-2">
                <div>
                  <p className="text-sm font-medium text-white">{label}</p>
                  <p className="text-xs text-gray-500">{desc}</p>
                </div>
                <label className="toggle flex-shrink-0">
                  <input type="checkbox" checked={isActive} onChange={() => toggleEvent(key)} />
                  <div className="toggle-track"><div className="toggle-thumb" /></div>
                </label>
              </div>
              {isActive && (
                <select
                  value={punishMap[key] || "mute"}
                  onChange={(e) => setPunishment(key, e.target.value)}
                  className="input text-xs w-36"
                >
                  <option value="delete">Delete only</option>
                  <option value="mute">Mute</option>
                  <option value="kick">Kick</option>
                  <option value="ban">Ban</option>
                  <option value="warn">Warn</option>
                </select>
              )}
            </div>
          );
        })}
      </div>

      <SectionHeader title="Ignored Users" />
      <div className="section-row space-y-2">
        <p className="text-xs text-gray-500">These users are exempt from AutoMod.</p>
        <div className="flex flex-wrap gap-1.5 min-h-[24px]">
          {ignoredUsers.length === 0 && <span className="text-xs text-gray-600 italic">None</span>}
          {ignoredUsers.map((uid) => (
            <span key={uid} className="flex items-center gap-1 text-xs bg-[#1c1c1c] text-gray-300 px-2 py-1 rounded-full border border-[#2a2a2a]">
              {uid}
              <button onClick={() => set("ignoredUsers", ignoredUsers.filter((x) => x !== uid))}
                className="text-gray-500 hover:text-red-400"><X size={10} /></button>
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <input type="text" value={newIgnoreUser} onChange={(e) => setNewIgnoreUser(e.target.value)}
            placeholder="User ID" className="input flex-1 text-sm"
            onKeyDown={(e) => { if (e.key === "Enter" && newIgnoreUser.trim()) { set("ignoredUsers", [...ignoredUsers, newIgnoreUser.trim()]); setNewIgnoreUser(""); } }} />
          <button onClick={() => { if (newIgnoreUser.trim()) { set("ignoredUsers", [...ignoredUsers, newIgnoreUser.trim()]); setNewIgnoreUser(""); } }}
            className="btn-secondary text-xs px-3"><Plus size={12} /></button>
        </div>
      </div>

      <SectionHeader title="Ignored Channels" />
      <div className="section-row space-y-2">
        <p className="text-xs text-gray-500">AutoMod won{"'"}t act in these channels.</p>
        <div className="flex flex-wrap gap-1.5 min-h-[24px]">
          {ignoredChannels.length === 0 && <span className="text-xs text-gray-600 italic">None</span>}
          {ignoredChannels.map((cid) => {
            const ch = channels.find((c) => c.id === cid);
            return (
              <span key={cid} className="flex items-center gap-1 text-xs bg-[#1c1c1c] text-gray-300 px-2 py-1 rounded-full border border-[#2a2a2a]">
                {ch ? ch.name : cid}
                <button onClick={() => set("ignoredChannels", ignoredChannels.filter((x) => x !== cid))}
                  className="text-gray-500 hover:text-red-400"><X size={10} /></button>
              </span>
            );
          })}
        </div>
        <select defaultValue="" onChange={(e) => {
          if (e.target.value && !ignoredChannels.includes(e.target.value)) {
            set("ignoredChannels", [...ignoredChannels, e.target.value]);
            e.target.value = "";
          }
        }} className="input">
          <option value="">— Add Channel —</option>
          {channels.filter((c) => !ignoredChannels.includes(c.id)).map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>

      <SectionHeader title="Bypass Role" />
      <RowRoleSelect label="AutoMod Bypass Role" desc="Members with this role ignore AutoMod"
        roles={roles} value={String(am.bypassRole || "")} onChange={(v) => set("bypassRole", v)} />
    </>
  );
}

function WelcomePanel({ local, set, setLocal, channels, guildId }: {
  local: Record<string, unknown>; set: (k: string, v: unknown) => void;
  setLocal: Dispatch<SetStateAction<Record<string, unknown>>>;
  channels: Channel[]; guildId: string;
}) {
  const wc = local;
  const [testSending, setTestSending] = useState(false);
  const [testResult, setTestResult] = useState<string | null>(null);

  const sendTest = async () => {
    if (!wc.channelId) { setTestResult("Please select a channel first."); return; }
    setTestSending(true);
    setTestResult(null);
    try {
      const res = await fetch(`/api/settings/${guildId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ module: "welcome_test", settings: { channelId: wc.channelId } }),
      });
      const data = await res.json();
      setTestResult(data.success ? "Test message sent!" : (data.error || "Failed"));
    } catch { setTestResult("Error sending test."); }
    finally { setTestSending(false); setTimeout(() => setTestResult(null), 5000); }
  };

  const resetWelcome = () => {
    setLocal({
      enabled: false, welcomeType: "embed", channelId: null,
      embed: { title: "Welcome to {server_name}! 🎉", description: "Hey {user_mention}, welcome to **{server_name}**!\nYou are member **#{server_membercount}**.", color: "ef4444", authorName: "", authorIcon: "", footerText: "", footerIcon: "", thumbnail: "", image: "" },
      boosterEnabled: false, boostChannelId: null,
      boostMessage: "🎉 {user_mention} just boosted {server_name}! We now have {boost_count} boosts!",
    });
  };

  const embed = (wc.embed as Record<string, string>) || {};
  const setEmbed = (k: string, v: string) => set("embed", { ...embed, [k]: v });

  const toBase64 = (file: File): Promise<string> =>
    new Promise((res, rej) => {
      const reader = new FileReader();
      reader.onload = () => res((reader.result as string).split(",")[1]);
      reader.onerror = rej;
      reader.readAsDataURL(file);
    });

  return (
    <>
      <SectionHeader title="Welcome Messages" />
      <RowToggle label="Enable Welcome Messages" desc="Send a message when a new member joins"
        checked={Boolean(wc.enabled)} onChange={(v) => set("enabled", v)} />
      <RowSelect label="Welcome Channel" desc="Where welcome messages are sent"
        channels={channels} value={String(wc.channelId || "")} onChange={(v) => set("channelId", v)}
        placeholder="— Select Channel —" />

      {wc.enabled && (
        <>
          <SectionHeader title="Embed Configuration" />
          <div className="p-4 rounded-xl bg-[#0a0a0a] border border-[#1e1e1e] space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-xs text-gray-500 mb-1">Embed Color</p>
                <div className="flex gap-2">
                  <input type="color" value={`#${embed.color || "ef4444"}`}
                    onChange={(e) => setEmbed("color", e.target.value.replace("#", ""))}
                    className="w-10 h-9 rounded cursor-pointer border border-[#2a2a2a] bg-transparent" />
                  <input type="text" value={embed.color || "ef4444"} onChange={(e) => setEmbed("color", e.target.value.replace("#", ""))}
                    placeholder="ef4444" className="input flex-1 font-mono text-sm" />
                </div>
              </div>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Author Name</p>
              <input type="text" value={embed.authorName || ""} onChange={(e) => setEmbed("authorName", e.target.value)}
                placeholder="Author name (optional)" className="input text-sm" />
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Author Icon URL</p>
              <input type="text" value={embed.authorIcon || ""} onChange={(e) => setEmbed("authorIcon", e.target.value)}
                placeholder="https://..." className="input text-sm" />
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Embed Title</p>
              <input type="text" value={embed.title || ""} onChange={(e) => setEmbed("title", e.target.value)}
                placeholder="Welcome to {server_name}! 🎉" className="input text-sm" />
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Description</p>
              <p className="text-[10px] text-gray-600 mb-1">Variables: {"{user_mention} {user_name} {server_name} {server_membercount}"}</p>
              <textarea value={embed.description || ""} onChange={(e) => setEmbed("description", e.target.value)}
                rows={3} placeholder="Welcome message..." className="input" style={{ resize: "vertical" }} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-xs text-gray-500 mb-1">Thumbnail URL</p>
                <input type="text" value={embed.thumbnail || ""} onChange={(e) => setEmbed("thumbnail", e.target.value)}
                  placeholder="Use {user_avatar} or URL" className="input text-sm" />
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Image URL</p>
                <input type="text" value={embed.image || ""} onChange={(e) => setEmbed("image", e.target.value)}
                  placeholder="Banner image URL" className="input text-sm" />
              </div>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Footer Text</p>
              <input type="text" value={embed.footerText || ""} onChange={(e) => setEmbed("footerText", e.target.value)}
                placeholder="Footer text..." className="input text-sm" />
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Footer Icon URL</p>
              <input type="text" value={embed.footerIcon || ""} onChange={(e) => setEmbed("footerIcon", e.target.value)}
                placeholder="https://..." className="input text-sm" />
            </div>
            <UploadField label="Upload Thumbnail" accept="image/*"
              preview={wc.thumbnailPreview as string}
              onFile={async (f) => {
                set("thumbnailPreview", URL.createObjectURL(f));
                set("thumbnailBase64", await toBase64(f));
                setEmbed("thumbnail", "__uploaded__");
              }} />
            <UploadField label="Upload Banner Image" accept="image/*"
              preview={wc.bannerPreview as string}
              onFile={async (f) => {
                set("bannerPreview", URL.createObjectURL(f));
                set("bannerBase64", await toBase64(f));
                setEmbed("image", "__uploaded__");
              }} />
          </div>

          <div className="mt-3">
            <p className="text-xs text-gray-500 mb-2">Preview</p>
            <DiscordEmbedPreview embed={{
              color: embed.color, authorName: embed.authorName, authorIcon: embed.authorIcon,
              title: (embed.title || "").replace("{server_name}", "Your Server"),
              description: (embed.description || "").replace("{user_mention}", "@NewMember").replace("{user_name}", "NewMember").replace("{server_name}", "Your Server").replace("{server_membercount}", "1234"),
              thumbnail: embed.thumbnail?.startsWith("__") ? "" : (embed.thumbnail || ""),
              image: embed.image?.startsWith("__") ? (wc.bannerPreview as string || "") : (embed.image || ""),
              footerText: embed.footerText, footerIcon: embed.footerIcon,
            }} />
          </div>

          <div className="flex gap-2 mt-3">
            <button onClick={sendTest} disabled={testSending || !wc.channelId}
              className="btn-secondary text-xs flex items-center gap-1.5">
              {testSending ? <Loader2 size={12} className="animate-spin" /> : <Send size={12} />}
              Send Test
            </button>
            <button onClick={resetWelcome} className="btn-secondary text-xs text-red-400 hover:text-red-300 flex items-center gap-1.5">
              <RefreshCw size={12} /> Reset
            </button>
          </div>
          {testResult && <p className="text-xs text-green-400 mt-1">{testResult}</p>}
        </>
      )}

      <SectionHeader title="Booster Messages" />
      <RowToggle label="Enable Booster Messages" desc="Send a message when someone boosts the server"
        checked={Boolean(wc.boosterEnabled)} onChange={(v) => set("boosterEnabled", v)} />
      {wc.boosterEnabled && (
        <>
          <RowSelect label="Boost Channel" channels={channels} value={String(wc.boostChannelId || "")}
            onChange={(v) => set("boostChannelId", v)} placeholder="— Select Channel —" />
          <RowTextarea label="Boost Message" desc="Variables: {user_mention} {server_name} {boost_count}"
            value={String(wc.boostMessage || "")} onChange={(v) => set("boostMessage", v)}
            placeholder="🎉 {user_mention} just boosted {server_name}!" />
        </>
      )}
    </>
  );
}

function GiveawayPanel({ channels, guildId, settings }: {
  channels: Channel[]; guildId: string; settings: Record<string, unknown>;
}) {
  const [newGw, setNewGw] = useState({ prize: "", winners: "1", duration: "1h", channelId: "" });
  const [creating, setCreating] = useState(false);
  const [createResult, setCreateResult] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [endingId, setEndingId] = useState<string | null>(null);
  const [confirmEnd, setConfirmEnd] = useState<string | null>(null);
  const giveaways = (settings.giveaways as Record<string, unknown>[]) || [];

  const createGiveaway = async () => {
    if (!newGw.prize || !newGw.channelId) return;
    setCreating(true);
    try {
      const res = await fetch(`/api/settings/${guildId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ module: "giveaway_create", settings: newGw }),
      });
      const data = await res.json();
      setCreateResult({ type: data.success ? "success" : "error", text: data.message || data.error || "Done" });
      if (data.success) setNewGw({ prize: "", winners: "1", duration: "1h", channelId: "" });
    } catch { setCreateResult({ type: "error", text: "Network error" }); }
    finally { setCreating(false); setTimeout(() => setCreateResult(null), 5000); }
  };

  const endGiveaway = async (messageId: string) => {
    setEndingId(messageId);
    try {
      await fetch(`/api/settings/${guildId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ module: "giveaway_end", settings: { messageId } }),
      });
    } catch {}
    finally { setEndingId(null); setConfirmEnd(null); }
  };

  return (
    <>
      <SectionHeader title="Start New Giveaway" />
      <div className="p-4 rounded-xl bg-[#0a0a0a] border border-[#1e1e1e] space-y-3">
        <RowInput label="Prize" value={newGw.prize} onChange={(v) => setNewGw((p) => ({ ...p, prize: v }))}
          placeholder="e.g. Nitro Classic, Discord Server Boost" />
        <div className="grid grid-cols-2 gap-3">
          <div>
            <p className="text-xs text-gray-500 mb-1">Winners</p>
            <input type="number" min="1" max="20" value={newGw.winners}
              onChange={(e) => setNewGw((p) => ({ ...p, winners: e.target.value }))} className="input" />
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Duration</p>
            <select value={newGw.duration} onChange={(e) => setNewGw((p) => ({ ...p, duration: e.target.value }))} className="input">
              <option value="30m">30 Minutes</option>
              <option value="1h">1 Hour</option>
              <option value="6h">6 Hours</option>
              <option value="12h">12 Hours</option>
              <option value="1d">1 Day</option>
              <option value="3d">3 Days</option>
              <option value="7d">7 Days</option>
            </select>
          </div>
        </div>
        <div>
          <p className="text-xs text-gray-500 mb-1">Channel</p>
          <select value={newGw.channelId} onChange={(e) => setNewGw((p) => ({ ...p, channelId: e.target.value }))} className="input">
            <option value="">— Select Channel —</option>
            {channels.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
        <button onClick={createGiveaway} disabled={creating || !newGw.prize || !newGw.channelId}
          className="btn-primary w-full flex items-center justify-center gap-2">
          {creating ? <Loader2 size={14} className="animate-spin" /> : <Gift size={14} />}
          {creating ? "Starting…" : "Start Giveaway"}
        </button>
        {createResult && (
          <p className={`text-xs ${createResult.type === "success" ? "text-green-400" : "text-red-400"}`}>{createResult.text}</p>
        )}
      </div>

      <SectionHeader title="Active Giveaways" />
      {giveaways.length === 0 ? (
        <div className="text-center py-8 text-gray-600">
          <Gift size={28} className="mx-auto mb-3 opacity-30" />
          <p className="text-sm">No active giveaways.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {giveaways.map((gw, i) => (
            <div key={i} className="p-4 rounded-xl bg-[#0a0a0a] border border-[#1e1e1e]">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-white text-sm">{String(gw.prize)}</p>
                  <p className="text-xs text-gray-500">
                    {String(gw.winners)} winner(s) • Ends: {new Date(Number(gw.endsAt) * 1000).toLocaleString()}
                  </p>
                </div>
                <div className="flex gap-2">
                  {confirmEnd === String(gw.messageId) ? (
                    <>
                      <button onClick={() => endGiveaway(String(gw.messageId))} disabled={endingId === String(gw.messageId)}
                        className="text-xs px-3 py-1.5 rounded-lg bg-red-500/20 border border-red-500/40 text-red-300 hover:bg-red-500/30">
                        {endingId === String(gw.messageId) ? "Ending…" : "Confirm End"}
                      </button>
                      <button onClick={() => setConfirmEnd(null)} className="text-xs px-2 py-1.5 rounded-lg border border-[#2a2a2a] text-gray-500">
                        Cancel
                      </button>
                    </>
                  ) : (
                    <button onClick={() => setConfirmEnd(String(gw.messageId))}
                      className="text-xs px-3 py-1.5 rounded-lg bg-[#1a1a1a] border border-[#2a2a2a] text-gray-400 hover:text-red-400 hover:border-red-500/30">
                      End Giveaway
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

function ReactionRolesPanel({ local, set, roles, guildId }: {
  local: Record<string, unknown>; set: (k: string, v: unknown) => void;
  roles: Role[]; guildId: string;
}) {
  const rr = local;
  const [messageId, setMessageId] = useState(String(rr.activeMessageId || ""));
  const [loading, setLoading] = useState(false);
  const [rrConfig, setRrConfig] = useState<{ emoji: string; roleId: string }[]>([]);
  const [rrStatus, setRrStatus] = useState<string | null>(null);

  const loadPanel = async () => {
    if (!messageId.trim()) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/settings/${guildId}?reactionroles_msg=${messageId}`);
      const data = await res.json();
      if (data.reactionroles_panel) {
        setRrConfig(data.reactionroles_panel.mappings || []);
        setRrStatus("Panel loaded.");
      } else {
        setRrStatus("No reaction role panel found for that message ID.");
      }
    } catch { setRrStatus("Error loading panel."); }
    finally { setLoading(false); setTimeout(() => setRrStatus(null), 4000); }
  };

  const addMapping = () => setRrConfig((prev) => [...prev, { emoji: "", roleId: "" }]);
  const removeMapping = (i: number) => setRrConfig((prev) => prev.filter((_, j) => j !== i));
  const updateMapping = (i: number, k: "emoji" | "roleId", v: string) =>
    setRrConfig((prev) => prev.map((m, j) => j === i ? { ...m, [k]: v } : m));

  return (
    <>
      <SectionHeader title="Load Existing Panel" />
      <div className="section-row space-y-2">
        <p className="text-xs text-gray-500">Enter the message ID of an existing reaction role panel to edit it.</p>
        <div className="flex gap-2">
          <input type="text" value={messageId} onChange={(e) => setMessageId(e.target.value)}
            placeholder="Message ID" className="input flex-1 text-sm font-mono" />
          <button onClick={loadPanel} disabled={loading || !messageId.trim()}
            className="btn-secondary text-xs px-3 flex items-center gap-1.5">
            {loading ? <Loader2 size={12} className="animate-spin" /> : <Eye size={12} />} Load
          </button>
        </div>
        {rrStatus && <p className="text-xs text-green-400">{rrStatus}</p>}
      </div>

      <SectionHeader title="Reaction Role Mappings" />
      <div className="space-y-2">
        {rrConfig.map((m, i) => (
          <div key={i} className="flex items-center gap-2 p-3 rounded-xl bg-[#0a0a0a] border border-[#1e1e1e]">
            <input type="text" value={m.emoji} onChange={(e) => updateMapping(i, "emoji", e.target.value)}
              placeholder="Emoji" className="input w-20 text-center text-lg" />
            <select value={m.roleId} onChange={(e) => updateMapping(i, "roleId", e.target.value)} className="input flex-1">
              <option value="">— Select Role —</option>
              {roles.map((r) => <option key={r.id} value={r.id}>@{r.name}</option>)}
            </select>
            <button onClick={() => removeMapping(i)} className="text-gray-600 hover:text-red-400 transition-colors p-1.5 rounded-lg hover:bg-red-500/10">
              <Trash2 size={14} />
            </button>
          </div>
        ))}
        {rrConfig.length === 0 && (
          <p className="text-xs text-gray-600 text-center py-3">No mappings yet. Add emoji → role pairs below.</p>
        )}
        <button onClick={addMapping} className="btn-secondary text-xs w-full flex items-center justify-center gap-1.5">
          <Plus size={12} /> Add Emoji → Role
        </button>
      </div>

      <div className="mt-4">
        <p className="text-xs text-gray-500 mb-2">When ready, save changes and the bot will update the reaction role panel.</p>
        <input type="hidden" value={JSON.stringify(rrConfig)} onChange={() => {}} />
      </div>
    </>
  );
}

function EmbedsPanel({ channels, guildId }: { channels: Channel[]; guildId: string }) {
  const [embed, setEmbed] = useState<Record<string, string>>({
    title: "", description: "", color: "ef4444",
    authorName: "", authorIcon: "", footerText: "", footerIcon: "",
    thumbnail: "", image: "",
  });
  const [channelId, setChannelId] = useState("");
  const [editMessageId, setEditMessageId] = useState("");
  const [sending, setSending] = useState(false);
  const [loadingEdit, setLoadingEdit] = useState(false);
  const [result, setResult] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const setE = (k: string, v: string) => setEmbed((p) => ({ ...p, [k]: v }));

  const loadExisting = async () => {
    if (!editMessageId.trim()) return;
    setLoadingEdit(true);
    try {
      const res = await fetch(`/api/settings/${guildId}?embed_msg=${editMessageId}`);
      const data = await res.json();
      if (data.embed) setEmbed(data.embed);
      else setResult({ type: "error", text: "Could not find embed. Make sure the bot sent it." });
    } catch { setResult({ type: "error", text: "Error loading embed." }); }
    finally { setLoadingEdit(false); setTimeout(() => setResult(null), 4000); }
  };

  const sendEmbed = async () => {
    if (!channelId) { setResult({ type: "error", text: "Select a channel." }); return; }
    setSending(true);
    try {
      const res = await fetch(`/api/settings/${guildId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ module: "embed_send", settings: { embed, channelId, editMessageId: editMessageId || undefined } }),
      });
      const data = await res.json();
      setResult({ type: data.success ? "success" : "error", text: data.message || data.error || "Done" });
    } catch { setResult({ type: "error", text: "Network error." }); }
    finally { setSending(false); setTimeout(() => setResult(null), 5000); }
  };

  return (
    <>
      <SectionHeader title="Edit Existing Embed (Optional)" />
      <div className="section-row space-y-2">
        <p className="text-xs text-gray-500">Load an existing embed by its message ID to edit it.</p>
        <div className="flex gap-2">
          <input type="text" value={editMessageId} onChange={(e) => setEditMessageId(e.target.value)}
            placeholder="Message ID" className="input flex-1 text-sm font-mono" />
          <button onClick={loadExisting} disabled={loadingEdit || !editMessageId.trim()}
            className="btn-secondary text-xs px-3 flex items-center gap-1.5">
            {loadingEdit ? <Loader2 size={12} className="animate-spin" /> : <Eye size={12} />} Load
          </button>
        </div>
      </div>

      <SectionHeader title="Embed Builder" />
      <div className="p-4 rounded-xl bg-[#0a0a0a] border border-[#1e1e1e] space-y-3">
        <div className="flex items-center gap-2">
          <div>
            <p className="text-xs text-gray-500 mb-1">Embed Color</p>
            <div className="flex gap-2">
              <input type="color" value={`#${embed.color || "ef4444"}`}
                onChange={(e) => setE("color", e.target.value.replace("#", ""))}
                className="w-10 h-9 rounded cursor-pointer border border-[#2a2a2a] bg-transparent" />
              <input type="text" value={embed.color} onChange={(e) => setE("color", e.target.value.replace("#", ""))}
                placeholder="ef4444" className="input w-28 font-mono text-sm" />
            </div>
          </div>
        </div>
        <div><p className="text-xs text-gray-500 mb-1">Author Name</p>
          <input type="text" value={embed.authorName} onChange={(e) => setE("authorName", e.target.value)} placeholder="Author name" className="input text-sm" /></div>
        <div><p className="text-xs text-gray-500 mb-1">Author Icon URL</p>
          <input type="text" value={embed.authorIcon} onChange={(e) => setE("authorIcon", e.target.value)} placeholder="https://..." className="input text-sm" /></div>
        <div><p className="text-xs text-gray-500 mb-1">Title</p>
          <input type="text" value={embed.title} onChange={(e) => setE("title", e.target.value)} placeholder="Embed title" className="input text-sm" /></div>
        <div><p className="text-xs text-gray-500 mb-1">Description</p>
          <textarea value={embed.description} onChange={(e) => setE("description", e.target.value)}
            rows={4} placeholder="Embed description..." className="input" style={{ resize: "vertical" }} /></div>
        <div className="grid grid-cols-2 gap-3">
          <div><p className="text-xs text-gray-500 mb-1">Thumbnail URL</p>
            <input type="text" value={embed.thumbnail} onChange={(e) => setE("thumbnail", e.target.value)} placeholder="https://..." className="input text-sm" /></div>
          <div><p className="text-xs text-gray-500 mb-1">Image URL</p>
            <input type="text" value={embed.image} onChange={(e) => setE("image", e.target.value)} placeholder="https://..." className="input text-sm" /></div>
        </div>
        <div><p className="text-xs text-gray-500 mb-1">Footer Text</p>
          <input type="text" value={embed.footerText} onChange={(e) => setE("footerText", e.target.value)} placeholder="Footer text" className="input text-sm" /></div>
        <div><p className="text-xs text-gray-500 mb-1">Footer Icon URL</p>
          <input type="text" value={embed.footerIcon} onChange={(e) => setE("footerIcon", e.target.value)} placeholder="https://..." className="input text-sm" /></div>
      </div>

      <SectionHeader title="Live Preview" />
      <DiscordEmbedPreview embed={embed} />

      <SectionHeader title="Send Embed" />
      <div className="section-row space-y-2">
        <select value={channelId} onChange={(e) => setChannelId(e.target.value)} className="input">
          <option value="">— Select Channel —</option>
          {channels.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <button onClick={sendEmbed} disabled={sending || !channelId}
          className="btn-primary w-full flex items-center justify-center gap-2">
          {sending ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
          {sending ? "Sending…" : editMessageId ? "Edit Embed" : "Send Embed"}
        </button>
        {result && (
          <p className={`text-xs ${result.type === "success" ? "text-green-400" : "text-red-400"}`}>{result.text}</p>
        )}
      </div>
    </>
  );
}

function IgnorePanel({ local, set, channels, roles }: {
  local: Record<string, unknown>; set: (k: string, v: unknown) => void;
  channels: Channel[]; roles: Role[];
}) {
  const ig = local;
  const ignoredChannels: string[] = (ig.channels as string[]) || [];
  const ignoredUsers: string[] = (ig.users as string[]) || [];
  const bypassRoles: string[] = (ig.bypassRoles as string[]) || [];
  const [newUser, setNewUser] = useState("");

  return (
    <>
      <Banner color="gray">Configure which channels, users and roles are ignored by the bot globally.</Banner>

      <SectionHeader title="Ignored Channels" />
      <p className="text-xs text-gray-500 mb-2">Bot ignores all commands in these channels.</p>
      <div className="flex flex-wrap gap-1.5 mb-2 min-h-[24px]">
        {ignoredChannels.length === 0 && <span className="text-xs text-gray-600 italic">None</span>}
        {ignoredChannels.map((cid) => {
          const ch = channels.find((c) => c.id === cid);
          return (
            <span key={cid} className="flex items-center gap-1 text-xs bg-[#1c1c1c] text-gray-300 px-2 py-1 rounded-full border border-[#2a2a2a]">
              {ch ? ch.name : cid}
              <button onClick={() => set("channels", ignoredChannels.filter((x) => x !== cid))}
                className="text-gray-500 hover:text-red-400"><X size={10} /></button>
            </span>
          );
        })}
      </div>
      <select defaultValue="" onChange={(e) => {
        if (e.target.value && !ignoredChannels.includes(e.target.value)) {
          set("channels", [...ignoredChannels, e.target.value]);
          e.target.value = "";
        }
      }} className="input mb-4">
        <option value="">— Add Channel to Ignore —</option>
        {channels.filter((c) => !ignoredChannels.includes(c.id)).map((c) => (
          <option key={c.id} value={c.id}>{c.name}</option>
        ))}
      </select>

      <SectionHeader title="Ignored Users" />
      <p className="text-xs text-gray-500 mb-2">Bot ignores all commands from these users.</p>
      <div className="flex flex-wrap gap-1.5 mb-2 min-h-[24px]">
        {ignoredUsers.length === 0 && <span className="text-xs text-gray-600 italic">None</span>}
        {ignoredUsers.map((uid) => (
          <span key={uid} className="flex items-center gap-1 text-xs bg-[#1c1c1c] text-gray-300 px-2 py-1 rounded-full border border-[#2a2a2a]">
            {uid}
            <button onClick={() => set("users", ignoredUsers.filter((x) => x !== uid))}
              className="text-gray-500 hover:text-red-400"><X size={10} /></button>
          </span>
        ))}
      </div>
      <div className="flex gap-2 mb-4">
        <input type="text" value={newUser} onChange={(e) => setNewUser(e.target.value)}
          placeholder="User ID" className="input flex-1 text-sm"
          onKeyDown={(e) => { if (e.key === "Enter" && newUser.trim()) { set("users", [...ignoredUsers, newUser.trim()]); setNewUser(""); } }} />
        <button onClick={() => { if (newUser.trim()) { set("users", [...ignoredUsers, newUser.trim()]); setNewUser(""); } }}
          className="btn-secondary text-xs px-3"><Plus size={12} /></button>
      </div>

      <SectionHeader title="Bypass Roles" />
      <p className="text-xs text-gray-500 mb-2">These roles bypass all ignore settings.</p>
      <RowMultiRole label="Bypass Roles" roles={roles} values={bypassRoles} onChange={(v) => set("bypassRoles", v)} />
    </>
  );
}

// ─── Main Component ─────────────────────────────────────────────────────────
export default function ModulePanel({ moduleId, guildId, isPremium, isOwner, settings, onSave }: Props) {
  const meta = META[moduleId];
  const [local, setLocal] = useState<Record<string, unknown>>({});
  const [channels, setChannels] = useState<Channel[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const premiumLocked = Boolean(meta?.premium) && !isPremium;
  const readOnly = Boolean(meta?.ownerOnly) && !isOwner;

  useEffect(() => {
    const raw = settings[moduleId];
    setLocal((raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>);
    setChannels((settings._channels as Channel[]) || []);
    setRoles((settings._roles as Role[]) || []);
  }, [moduleId, settings]);

  const set = useCallback((k: string, v: unknown) => setLocal((p) => ({ ...p, [k]: v })), []);

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);
    setErr(null);
    try {
      const res = await fetch(`/api/settings/${guildId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ module: moduleId, settings: local }),
      });
      const data = await res.json();
      if (res.ok && data.success !== false) {
        setSaved(true);
        onSave(moduleId, local);
        setTimeout(() => setSaved(false), 3000);
      } else {
        setErr(data.error || "Save failed");
        setTimeout(() => setErr(null), 5000);
      }
    } catch {
      setErr("Network error — could not reach the bot.");
      setTimeout(() => setErr(null), 5000);
    } finally {
      setSaving(false);
    }
  };

  if (!meta) return <div className="text-gray-500 text-sm p-6">Unknown module.</div>;
  if (premiumLocked) return <PremiumGate title={meta.title} />;

  const Icon = meta.icon;

  return (
    <div className="max-w-2xl space-y-1 animate-fade-in">
      {/* Module Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: `${meta.iconColor}1a`, border: `1px solid ${meta.iconColor}33` }}>
          <Icon size={18} style={{ color: meta.iconColor }} />
        </div>
        <div>
          <h2 className="text-lg font-bold text-white">{meta.title}</h2>
          {readOnly && (
            <span className="text-xs text-orange-400 flex items-center gap-1"><Lock size={10} /> Owner-only — view mode</span>
          )}
        </div>
      </div>

      {/* ── ANTINUKE ──────────────────────────────────────── */}
      {moduleId === "antinuke" && <AntinukePanel local={local} set={set} readOnly={readOnly} guildId={guildId} />}

      {/* ── AUTOMOD ──────────────────────────────────────── */}
      {moduleId === "automod" && <AutomodPanel local={local} set={set} channels={channels} roles={roles} />}

      {/* ── LOGGING ───────────────────────────────────────── */}
      {moduleId === "logging" && (() => {
        const lg = local;
        const ch = (lg.channels as Record<string, string>) || {};
        return (
          <>
            <RowToggle label="Enable Logging" desc="Log server events to channels"
              checked={Boolean(lg.enabled)} onChange={(v) => set("enabled", v)} />
            <SectionHeader title="Log Channels" />
            <p className="text-xs text-gray-500 mb-3">Select a channel for each log type. Set to Disabled to turn off that log type.</p>
            <div className="space-y-2">
              {LOG_TYPES.map(({ key, label }) => (
                <div key={key} className="flex items-center gap-3 p-3 rounded-xl bg-[#0a0a0a] border border-[#1e1e1e]">
                  <span className="text-sm text-gray-300 flex-1 min-w-0 font-medium">{label}</span>
                  <select value={ch[key] || ""} onChange={(e) => set("channels", { ...ch, [key]: e.target.value })} className="input w-48 flex-shrink-0">
                    <option value="">Disabled</option>
                    {channels.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
              ))}
            </div>
          </>
        );
      })()}

      {/* ── WELCOME ───────────────────────────────────────── */}
      {moduleId === "welcome" && <WelcomePanel local={local} set={set} setLocal={setLocal} channels={channels} guildId={guildId} />}

      {/* ── LEVELING ──────────────────────────────────────── */}
      {moduleId === "leveling" && !premiumLocked && (() => {
        const lv = local;
        return (
          <>
            <SectionHeader title="Enable Leveling" />
            <RowToggle label="Enable Leveling System" desc="Members earn XP for sending messages"
              checked={Boolean(lv.enabled)} onChange={(v) => set("enabled", v)} />
            <RowToggle label="DM Level-Up Notification" desc="DM members when they level up"
              checked={Boolean(lv.dmLevelUp)} onChange={(v) => set("dmLevelUp", v)} />

            <SectionHeader title="Channel & Message" />
            <RowSelect label="Level-Up Channel" desc="Where announcements are sent (blank = same channel)"
              channels={channels} value={String(lv.channelId || "")} onChange={(v) => set("channelId", v)}
              placeholder="— Same as message channel —" />
            <RowTextarea label="Level-Up Message" desc="Variables: {user_mention} {level} {user_name}"
              value={String(lv.levelMessage || "")} onChange={(v) => set("levelMessage", v)}
              placeholder="🎉 Congrats {user_mention}! You reached level {level}!" />

            <SectionHeader title="XP Settings" />
            <RowNum label="XP Per Message" desc="Base XP per message" value={Number(lv.xpPerMessage ?? 20)} onChange={(v) => set("xpPerMessage", v)} min={1} max={999} />
            <RowNum label="Min XP (random floor)" value={Number(lv.minXp ?? 15)} onChange={(v) => set("minXp", v)} min={1} max={999} />
            <RowNum label="Max XP (random ceiling)" value={Number(lv.maxXp ?? 25)} onChange={(v) => set("maxXp", v)} min={1} max={999} />
            <RowNum label="Cooldown (seconds)" desc="Min time between XP gains per user" value={Number(lv.cooldown ?? 60)} onChange={(v) => set("cooldown", v)} min={1} max={3600} />

            <SectionHeader title="Level Roles" />
            <Banner color="gray">Level roles are managed via bot commands: <code>levelrole set &lt;level&gt; @role</code></Banner>
          </>
        );
      })()}

      {/* ── GIVEAWAYS ─────────────────────────────────────── */}
      {moduleId === "giveaway" && <GiveawayPanel channels={channels} guildId={guildId} settings={settings} />}

      {/* ── REACTION ROLES ────────────────────────────────── */}
      {moduleId === "reactionroles" && <ReactionRolesPanel local={local} set={set} roles={roles} guildId={guildId} />}

      {/* ── AUTOROLE ──────────────────────────────────────── */}
      {moduleId === "autorole" && (() => {
        const ar = local;
        return (
          <>
            <Banner color="blue">Roles assigned automatically when someone joins your server.</Banner>
            <RowToggle label="Enable Auto Role" desc="Assign roles when members join"
              checked={Boolean(ar.enabled)} onChange={(v) => set("enabled", v)} />
            <SectionHeader title="Member Roles" />
            <RowMultiRole label="Roles for New Members" desc="Assigned to human members on join"
              roles={roles} values={(ar.humanRoles as string[]) || []} onChange={(v) => set("humanRoles", v)} />
            <SectionHeader title="Bot Roles" />
            <RowMultiRole label="Roles for Bots" desc="Assigned to bots when added"
              roles={roles} values={(ar.botRoles as string[]) || []} onChange={(v) => set("botRoles", v)} />
          </>
        );
      })()}

      {/* ── NIGHTMODE ─────────────────────────────────────── */}
      {moduleId === "nightmode" && (() => {
        const nm = local;
        return (
          <>
            <Banner color="blue">Night Mode locks channels on a schedule. Timezone: IST (UTC+5:30)</Banner>
            <RowToggle label="Enable Night Mode" desc="Automatically lock channels at night"
              checked={Boolean(nm.enabled)} onChange={(v) => set("enabled", v)} />
            <SectionHeader title="Schedule (IST)" />
            <RowInput label="Start Time (IST)" desc="e.g. 22:00 (10:00 PM)" value={String(nm.startTime || "")}
              onChange={(v) => set("startTime", v)} placeholder="22:00" />
            <RowInput label="End Time (IST)" desc="e.g. 07:00 (7:00 AM)" value={String(nm.endTime || "")}
              onChange={(v) => set("endTime", v)} placeholder="07:00" />
            <SectionHeader title="Channels" />
            <RowSelect label="Night Mode Log Channel" desc="Where Night Mode events are logged"
              channels={channels} value={String(nm.logChannel || "")} onChange={(v) => set("logChannel", v)}
              placeholder="— Select Channel —" />
            <SectionHeader title="Bypass Role" />
            <RowRoleSelect label="Night Mode Bypass Role" desc="Members with this role can still send messages"
              roles={roles} value={String(nm.bypassRole || "")} onChange={(v) => set("bypassRole", v)} />
          </>
        );
      })()}

      {/* ── MODERATION ────────────────────────────────────── */}
      {moduleId === "moderation" && (() => {
        const md = local;
        return (
          <>
            <SectionHeader title="Channels" />
            <RowSelect label="Mod Log Channel" desc="Where mod actions are logged"
              channels={channels} value={String(md.modLogChannel || "")} onChange={(v) => set("modLogChannel", v)}
              placeholder="— Select Channel —" />
            <RowSelect label="Appeals Channel" desc="Where ban/kick appeal messages go (optional)"
              channels={channels} value={String(md.appealsChannel || "")} onChange={(v) => set("appealsChannel", v)}
              placeholder="— Disabled —" />

            <SectionHeader title="Roles" />
            <RowRoleSelect label="Muted Role" desc="Role assigned when a member is muted"
              roles={roles} value={String(md.muteRole || "")} onChange={(v) => set("muteRole", v)} />
            <RowRoleSelect label="Moderator Role" desc="Users with this role can use mod commands"
              roles={roles} value={String(md.modRole || "")} onChange={(v) => set("modRole", v)} />

            <SectionHeader title="Warn Settings" />
            <RowDropdown label="Auto Action on Warn Threshold"
              desc="Action taken when warn count is reached"
              options={[
                { value: "none", label: "No Action" },
                { value: "mute", label: "Mute" },
                { value: "kick", label: "Kick" },
                { value: "ban",  label: "Ban" },
              ]}
              value={String(md.warnAction || "none")} onChange={(v) => set("warnAction", v)} />
            <RowNum label="Warn Threshold" desc="Warnings before auto-action triggers"
              value={Number(md.warnThreshold ?? 3)} onChange={(v) => set("warnThreshold", v)} min={1} max={20} />

            <SectionHeader title="DM Notifications" />
            <RowToggle label="DM on Ban"  desc="Send a DM to banned members"  checked={Boolean(md.dmBan)}  onChange={(v) => set("dmBan", v)} />
            <RowToggle label="DM on Kick" desc="Send a DM to kicked members"  checked={Boolean(md.dmKick)} onChange={(v) => set("dmKick", v)} />
            <RowToggle label="DM on Mute" desc="Send a DM to muted members"   checked={Boolean(md.dmMute)} onChange={(v) => set("dmMute", v)} />
            <RowToggle label="DM on Warn" desc="Send a DM when a member gets warned" checked={Boolean(md.dmWarn)} onChange={(v) => set("dmWarn", v)} />

            <SectionHeader title="Modules" />
            <RowToggle label="Anti Ghost Ping" desc="Warn users who ghost ping members"
              checked={Boolean(md.antiGhostPing)} onChange={(v) => set("antiGhostPing", v)} />
            <RowToggle label="Auto Dehoist" desc="Remove hoisting characters from nicknames"
              checked={Boolean(md.autoDehoist)} onChange={(v) => set("autoDehoist", v)} />
          </>
        );
      })()}

      {/* ── SETUP / ROLES ─────────────────────────────────── */}
      {moduleId === "setup" && (() => {
        const sp = local;
        type CustomRole = { id?: number; name: string; roleId: string };
        const customRoles: CustomRole[] = (sp.customRoles as CustomRole[]) || [];

        return (
          <>
            <SectionHeader title="Bot Prefix" />
            <RowInput label="Command Prefix" desc="Bot prefix for this server"
              value={String(sp.prefix || ".")} onChange={(v) => set("prefix", v)} placeholder="." />

            <SectionHeader title="Moderation Roles" />
            <RowRoleSelect label="Mod Role" desc="Can use moderation commands"
              roles={roles} value={String(sp.modRole || "")} onChange={(v) => set("modRole", v)} />
            <RowRoleSelect label="Mute / Jail Role" desc="Assigned when muted or jailed"
              roles={roles} value={String(sp.muteRole || "")} onChange={(v) => set("muteRole", v)} />

            <SectionHeader title="Moderation Channels" />
            <RowSelect label="Jail Channel" desc="Where jailed members are sent"
              channels={channels} value={String(sp.jailChannel || "")} onChange={(v) => set("jailChannel", v)}
              placeholder="— Select Channel —" />
            <RowSelect label="Mod Log Channel" channels={channels}
              value={String(sp.modLogChannel || "")} onChange={(v) => set("modLogChannel", v)}
              placeholder="— Select Channel —" />

            <SectionHeader title="Named Roles" />
            <RowRoleSelect label="Staff Role" roles={roles} value={String(sp.staffRole || "")} onChange={(v) => set("staffRole", v)} />
            <RowRoleSelect label="VIP Role"   roles={roles} value={String(sp.vipRole || "")}   onChange={(v) => set("vipRole", v)} />
            <RowRoleSelect label="Guest Role" roles={roles} value={String(sp.guestRole || "")} onChange={(v) => set("guestRole", v)} />
            <RowRoleSelect label="Friend Role" roles={roles} value={String(sp.friendRole || "")} onChange={(v) => set("friendRole", v)} />
            <RowRoleSelect label="Girl Role"  roles={roles} value={String(sp.girlRole || "")}  onChange={(v) => set("girlRole", v)} />
            <RowRoleSelect label="Required Role" desc="Required to use certain commands"
              roles={roles} value={String(sp.reqRole || "")} onChange={(v) => set("reqRole", v)} />

            <SectionHeader title="Custom Named Roles" />
            <p className="text-xs text-gray-500 mb-2">Create your own role commands like <code>+givename @user</code></p>
            <div className="space-y-2">
              {customRoles.map((cr, i) => (
                <div key={i} className="card p-3 flex items-center gap-2">
                  <input className="input flex-1 text-sm" placeholder="Role name (e.g. booster)"
                    value={cr.name}
                    onChange={(e) => {
                      const updated = [...customRoles];
                      updated[i] = { ...cr, name: e.target.value };
                      set("customRoles", updated);
                    }} />
                  <select className="input flex-1 text-sm" value={cr.roleId || ""}
                    onChange={(e) => {
                      const updated = [...customRoles];
                      updated[i] = { ...cr, roleId: e.target.value };
                      set("customRoles", updated);
                    }}>
                    <option value="">— Select Role —</option>
                    {roles.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                  </select>
                  <button onClick={() => set("customRoles", customRoles.filter((_, j) => j !== i))}
                    className="text-gray-600 hover:text-red-400 transition-colors p-1.5 rounded-lg hover:bg-red-500/10">
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
              <button className="btn-secondary text-xs w-full flex items-center justify-center gap-1.5"
                onClick={() => set("customRoles", [...customRoles, { name: "", roleId: "" }])}>
                <Plus size={12} /> Add Custom Role
              </button>
            </div>
          </>
        );
      })()}

      {/* ── TICKET SYSTEM ─────────────────────────────────── */}
      {moduleId === "tickets" && (() => {
        const tk = local;
        type TicketCat = { id?: number; name: string; emoji: string; description: string; roleId: string };
        const cats: TicketCat[] = (tk.categories as TicketCat[]) || [];

        return (
          <>
            <SectionHeader title="General" />
            <RowToggle label="Enable Ticket System" desc="Allow members to open support tickets"
              checked={Boolean(tk.enabled)} onChange={(v) => set("enabled", v)} />
            <RowNum label="Max Open Tickets Per User" value={Number(tk.maxPerUser ?? 3)} onChange={(v) => set("maxPerUser", v)} min={1} max={20} />
            <RowNum label="Cooldown (seconds)" value={Number(tk.cooldownSec ?? 60)} onChange={(v) => set("cooldownSec", v)} min={0} max={3600} />
            <RowNum label="Auto-Close After (hours, 0 = off)" value={Number(tk.autoCloseH ?? 0)} onChange={(v) => set("autoCloseH", v)} min={0} max={168} />

            <SectionHeader title="Channels & Categories" />
            <RowSelect label="Tickets Open Category" desc="Discord category where tickets open"
              channels={channels} value={String(tk.categoryId || "")} onChange={(v) => set("categoryId", v)}
              placeholder="— Select Category —" />
            <RowSelect label="Archive Category" desc="Category where closed tickets move"
              channels={channels} value={String(tk.archiveCat || "")} onChange={(v) => set("archiveCat", v)}
              placeholder="— Disabled —" />
            <RowSelect label="Claimed Category" desc="Category where claimed tickets move"
              channels={channels} value={String(tk.claimedCat || "")} onChange={(v) => set("claimedCat", v)}
              placeholder="— Disabled —" />
            <RowSelect label="Log Channel" desc="Transcripts and ticket logs"
              channels={channels} value={String(tk.logChannel || "")} onChange={(v) => set("logChannel", v)}
              placeholder="— Select Channel —" />

            <SectionHeader title="Support Roles" />
            <RowMultiRole label="Support Roles" desc="Can see and manage all tickets"
              roles={roles} values={(tk.supportRoles as string[]) || []} onChange={(v) => set("supportRoles", v)} />

            <SectionHeader title="Panel Customisation" />
            <RowInput label="Panel Title" value={String(tk.panelTitle || "")} onChange={(v) => set("panelTitle", v)} placeholder="Open a Ticket" />
            <RowTextarea label="Panel Description" value={String(tk.panelDesc || "")} onChange={(v) => set("panelDesc", v)}
              placeholder="Select a category to create your ticket." />
            <div className="section-row">
              <p className="text-sm font-medium text-white mb-1">Panel Color</p>
              <div className="flex gap-2">
                <input type="color" value={`#${(tk.panelColor || "0a0a0a").replace("#", "")}`}
                  onChange={(e) => set("panelColor", e.target.value.replace("#", ""))}
                  className="w-10 h-9 rounded cursor-pointer border border-[#2a2a2a] bg-transparent" />
                <input type="text" value={String(tk.panelColor || "")} onChange={(e) => set("panelColor", e.target.value.replace("#", ""))}
                  placeholder="0a0a0a" className="input flex-1 font-mono" />
              </div>
            </div>
            <RowInput label="Panel Image URL" value={String(tk.panelImage || "")} onChange={(v) => set("panelImage", v)} placeholder="https://..." />
            <RowInput label="Panel Thumbnail URL" value={String(tk.panelThumbnail || "")} onChange={(v) => set("panelThumbnail", v)} placeholder="https://..." />

            <div className="section-row">
              <p className="text-sm font-medium text-white mb-2">Panel Style</p>
              <div className="flex gap-2">
                {[{ v: "select", l: "Dropdown Menu" }, { v: "button", l: "Buttons" }].map((opt) => (
                  <button key={opt.v} onClick={() => set("panelStyle", opt.v)}
                    className={`px-4 py-2 rounded-xl text-xs font-medium transition-all border ${(tk.panelStyle || "select") === opt.v
                      ? "bg-red-500/20 border-red-500/40 text-red-300"
                      : "border-[#2a2a2a] text-gray-500 hover:text-white hover:border-[#444]"
                    }`}>{opt.l}</button>
                ))}
              </div>
            </div>

            <SectionHeader title="Ticket Categories" />
            <div className="space-y-2">
              {cats.map((cat, i) => (
                <div key={i} className="card p-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <input className="input w-16 text-center text-lg" placeholder="🎫" value={cat.emoji}
                      onChange={(e) => {
                        const updated = [...cats]; updated[i] = { ...cat, emoji: e.target.value };
                        set("categories", updated);
                      }} />
                    <input className="input flex-1 text-sm font-medium" placeholder="Category name (e.g. Support)"
                      value={cat.name}
                      onChange={(e) => {
                        const updated = [...cats]; updated[i] = { ...cat, name: e.target.value };
                        set("categories", updated);
                      }} />
                    <button onClick={() => set("categories", cats.filter((_, j) => j !== i))}
                      className="text-gray-600 hover:text-red-400 transition-colors p-1.5 rounded-lg hover:bg-red-500/10 flex-shrink-0">
                      <Trash2 size={14} />
                    </button>
                  </div>
                  <input className="input w-full text-sm text-gray-400" placeholder="Short description (optional)"
                    value={cat.description || ""}
                    onChange={(e) => {
                      const updated = [...cats]; updated[i] = { ...cat, description: e.target.value };
                      set("categories", updated);
                    }} />
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-600 w-24 flex-shrink-0">Category Role</span>
                    <select className="input flex-1 text-sm" value={cat.roleId || ""}
                      onChange={(e) => {
                        const updated = [...cats]; updated[i] = { ...cat, roleId: e.target.value };
                        set("categories", updated);
                      }}>
                      <option value="">— Inherit support roles —</option>
                      {roles.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}
                    </select>
                  </div>
                </div>
              ))}
              {cats.length < 25 && (
                <button className="btn-secondary text-xs w-full flex items-center justify-center gap-1.5"
                  onClick={() => set("categories", [...cats, { name: "", emoji: "🎫", description: "", roleId: "" }])}>
                  <Plus size={12} /> Add Category
                </button>
              )}
              {cats.length === 0 && (
                <p className="text-xs text-gray-600 text-center py-2">No categories yet. Add at least one.</p>
              )}
            </div>

            <SectionHeader title="Send Panel" />
            <TicketPanelSender guildId={guildId} channels={channels} />
          </>
        );
      })()}

      {/* ── EMBEDS ────────────────────────────────────────── */}
      {moduleId === "embeds" && <EmbedsPanel channels={channels} guildId={guildId} />}

      {/* ── MINECRAFT STATUS ──────────────────────────────── */}
      {moduleId === "minecraft" && (() => {
        const mc = local;
        return (
          <>
            <SectionHeader title="Server Info" />
            <RowInput label="Server IP / Host" desc="Your Minecraft server address"
              value={String(mc.serverIp || "")} onChange={(v) => set("serverIp", v)} placeholder="play.myserver.net" />
            <RowNum label="Server Port" value={Number(mc.serverPort ?? 25565)} onChange={(v) => set("serverPort", v)} min={1} max={65535} />
            <RowDropdown label="Server Type"
              options={[{ value: "java", label: "Java Edition" }, { value: "bedrock", label: "Bedrock Edition" }]}
              value={String(mc.serverType || "java")} onChange={(v) => set("serverType", v)} />

            <SectionHeader title="Status Display" />
            <RowSelect label="Status Channel" desc="Where the status message is posted"
              channels={channels} value={String(mc.statusChannel || "")} onChange={(v) => set("statusChannel", v)}
              placeholder="— Select Channel —" />
            <RowNum label="Update Interval (minutes)" desc="How often to refresh (min 1)"
              value={Number(mc.updateInterval ?? 5)} onChange={(v) => set("updateInterval", v)} min={1} max={60} />
            <RowToggle label="Show Player List" desc="List online players in the status embed"
              checked={Boolean(mc.showPlayers)} onChange={(v) => set("showPlayers", v)} />
            <RowToggle label="Show Server MOTD" desc="Display the server message of the day"
              checked={Boolean(mc.showMotd)} onChange={(v) => set("showMotd", v)} />
          </>
        );
      })()}

      {/* ── IGNORE SETUP ──────────────────────────────────── */}
      {moduleId === "ignore" && <IgnorePanel local={local} set={set} channels={channels} roles={roles} />}

      {/* Save Bar */}
      {moduleId !== "embeds" && (
        <div className="flex items-center gap-3 flex-wrap pt-4">
          <button onClick={handleSave} disabled={saving || readOnly}
            title={readOnly ? "Only the server owner can save" : undefined}
            className="btn-primary transition-all duration-300 min-w-[140px] flex items-center justify-center gap-2"
            style={saved ? {
              background: "linear-gradient(135deg,#16a34a,#15803d)",
              boxShadow: "0 0 20px rgba(34,197,94,0.3)"
            } : {}}>
            {saving ? <Loader2 size={15} className="animate-spin" /> : saved ? <CheckCircle size={15} /> : <Save size={15} />}
            {saving ? "Saving…" : saved ? "Saved!" : readOnly ? "View Only" : "Save Changes"}
          </button>
          {readOnly && <span className="text-xs text-gray-600">Only server owner can edit</span>}
        </div>
      )}

      {/* Toast */}
      {(saved || err) && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-4 rounded-2xl shadow-2xl text-sm font-semibold"
          style={{
            background: saved ? "linear-gradient(135deg,#14532d,#166534)" : "linear-gradient(135deg,#7f1d1d,#991b1b)",
            border:     saved ? "1px solid #22c55e" : "1px solid #ef4444",
            boxShadow:  saved ? "0 8px 32px rgba(34,197,94,0.35)" : "0 8px 32px rgba(239,68,68,0.35)",
            minWidth: "280px",
            animation: "toastSlideUp 0.35s cubic-bezier(0.34,1.56,0.64,1) forwards",
          }}>
          {saved
            ? <><CheckCircle size={20} className="text-green-400 flex-shrink-0" /><div><p className="text-green-100 font-semibold">Saved successfully!</p><p className="text-green-400 text-xs font-normal mt-0.5">Your changes are live.</p></div></>
            : <><AlertTriangle size={20} className="text-red-400 flex-shrink-0" /><div><p className="text-red-100 font-semibold">Save failed</p><p className="text-red-400 text-xs font-normal mt-0.5">{err}</p></div></>
          }
        </div>
      )}
      <style>{`@keyframes toastSlideUp{from{opacity:0;transform:translateY(24px) scale(0.95)}to{opacity:1;transform:translateY(0) scale(1)}}`}</style>
    </div>
  );
}
