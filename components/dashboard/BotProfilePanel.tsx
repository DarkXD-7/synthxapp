"use client";

import { useState, useRef } from "react";
import { Star, Upload, Loader2, CheckCircle, AlertTriangle } from "lucide-react";

interface Props { guildId: string; isPremium: boolean; }

export default function BotProfilePanel({ guildId, isPremium }: Props) {
  const [iconPreview, setIconPreview] = useState<string>("");
  const [iconFile, setIconFile] = useState<File | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string>("");
  const [aboutText, setAboutText] = useState("");
  const [loading, setLoading] = useState<string | null>(null);
  const [msg, setMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const iconRef = useRef<HTMLInputElement>(null);
  const bannerRef = useRef<HTMLInputElement>(null);

  const showMsg = (type: "success" | "error", text: string) => {
    setMsg({ type, text });
    setTimeout(() => setMsg(null), 4000);
  };

  const call = async (action: string, body: Record<string, unknown>) => {
    setLoading(action);
    try {
      const res = await fetch(`/api/botprofile/${guildId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, ...body }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      showMsg("success", data.message || "Done!");
    } catch (e: unknown) {
      showMsg("error", e instanceof Error ? e.message : "Something went wrong");
    } finally { setLoading(null); }
  };

  if (!isPremium) {
    return (
      <div className="max-w-lg mx-auto text-center py-16 animate-fade-in">
        <div className="w-16 h-16 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mx-auto mb-5">
          <Star size={28} className="text-purple-400" />
        </div>
        <h2 className="text-xl font-bold text-white mb-2">Premium Required</h2>
        <p className="text-gray-500 text-sm mb-6">
          Custom Bot Profile is a <span className="text-purple-300 font-semibold">SynthX Premium</span> feature.
          Upgrade to customise the bot's icon, banner, and about section.
        </p>
        <a href="https://discord.gg/WKX5HHPmWz" target="_blank" rel="noopener noreferrer"
          className="btn-primary" style={{background:"linear-gradient(135deg,#9333ea,#7c3aed)"}}>
          Get Premium
        </a>
      </div>
    );
  }

  return (
    <div className="max-w-2xl space-y-5 animate-fade-in">
      <div>
        <h1 className="text-xl font-bold text-white mb-0.5">Bot Profile</h1>
        <p className="text-sm text-gray-500">Customise SynthX's icon, banner, and about section for this server.</p>
      </div>

      {msg && (
        <div className={`info-banner ${msg.type === "success" ? "info-green" : "info-red"} flex items-center gap-2`}>
          {msg.type === "success" ? <CheckCircle size={14} /> : <AlertTriangle size={14} />}
          {msg.text}
        </div>
      )}

      {/* Bot Icon */}
      <div className="card p-5 space-y-3">
        <p className="text-sm font-semibold text-white">Bot Icon</p>
        <p className="text-xs text-gray-500">Upload a custom avatar for the bot in this server.</p>
        <div
          className="upload-zone"
          onClick={() => iconRef.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            const f = e.dataTransfer.files[0];
            if (f) { setIconFile(f); setIconPreview(URL.createObjectURL(f)); }
          }}
        >
          {iconPreview ? (
            <img src={iconPreview} alt="icon preview" className="w-20 h-20 rounded-full mx-auto mb-2 object-cover" />
          ) : (
            <Upload size={20} className="text-gray-600 mx-auto mb-2" />
          )}
          <p className="text-xs text-gray-500">Drag & drop or <span className="text-red-400 font-medium">browse</span></p>
          <p className="text-[10px] text-gray-700 mt-0.5">PNG, JPG, GIF — Recommended: 512×512</p>
        </div>
        <input ref={iconRef} type="file" accept="image/*" className="hidden"
          onChange={(e) => { const f = e.target.files?.[0]; if (f) { setIconFile(f); setIconPreview(URL.createObjectURL(f)); } }} />
        <button
          onClick={() => call("set_icon", { iconUrl: iconPreview })}
          disabled={!iconFile || loading === "set_icon"}
          className="btn-primary text-sm"
        >
          {loading === "set_icon" ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
          {loading === "set_icon" ? "Uploading…" : "Apply Icon"}
        </button>
      </div>

      {/* Banner */}
      <div className="card p-5 space-y-3">
        <p className="text-sm font-semibold text-white">Bot Banner</p>
        <p className="text-xs text-gray-500">Upload a banner image shown on the bot's profile.</p>
        <div
          className="upload-zone"
          onClick={() => bannerRef.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            const f = e.dataTransfer.files[0];
            if (f) setBannerPreview(URL.createObjectURL(f));
          }}
        >
          {bannerPreview ? (
            <img src={bannerPreview} alt="banner preview" className="w-full h-24 object-cover rounded-lg mb-2" />
          ) : (
            <Upload size={20} className="text-gray-600 mx-auto mb-2" />
          )}
          <p className="text-xs text-gray-500">Drag & drop or <span className="text-red-400 font-medium">browse</span></p>
          <p className="text-[10px] text-gray-700 mt-0.5">PNG, JPG, GIF — Recommended: 960×480</p>
        </div>
        <input ref={bannerRef} type="file" accept="image/*" className="hidden"
          onChange={(e) => { const f = e.target.files?.[0]; if (f) setBannerPreview(URL.createObjectURL(f)); }} />
        <button
          onClick={() => call("set_banner", { bannerUrl: bannerPreview })}
          disabled={!bannerPreview || loading === "set_banner"}
          className="btn-primary text-sm"
        >
          {loading === "set_banner" ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
          {loading === "set_banner" ? "Uploading…" : "Apply Banner"}
        </button>
      </div>

      {/* About */}
      <div className="card p-5 space-y-3">
        <p className="text-sm font-semibold text-white">About Me</p>
        <p className="text-xs text-gray-500">Custom about text shown on the bot's profile (max 190 characters).</p>
        <textarea
          value={aboutText}
          onChange={(e) => setAboutText(e.target.value.slice(0, 190))}
          placeholder="A powerful Discord bot for your server."
          rows={3}
          className="input"
          style={{ resize: "none" }}
        />
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-600">{aboutText.length}/190</span>
          <button
            onClick={() => call("set_about", { aboutText })}
            disabled={!aboutText.trim() || loading === "set_about"}
            className="btn-primary text-sm"
          >
            {loading === "set_about" ? <Loader2 size={14} className="animate-spin" /> : null}
            {loading === "set_about" ? "Saving…" : "Save About"}
          </button>
        </div>
      </div>

      {/* Reset */}
      <div className="card p-5">
        <p className="text-sm font-semibold text-white mb-1">Reset Profile</p>
        <p className="text-xs text-gray-500 mb-3">Revert the bot's icon, banner, and about back to the default SynthX branding.</p>
        <button
          onClick={() => call("reset", {})}
          disabled={loading === "reset"}
          className="btn-secondary text-sm"
        >
          {loading === "reset" ? <Loader2 size={14} className="animate-spin" /> : null}
          Reset to Default
        </button>
      </div>
    </div>
  );
}
