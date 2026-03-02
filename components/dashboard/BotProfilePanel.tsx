"use client";

import { useState, useRef } from "react";
import { Star, Upload, Loader2, CheckCircle, AlertTriangle } from "lucide-react";

interface Props { guildId: string; isPremium: boolean; }

// Convert a File to a base64 string (without the data:...;base64, prefix)
function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload  = () => resolve((reader.result as string).split(",")[1]);
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsDataURL(file);
  });
}

export default function BotProfilePanel({ guildId, isPremium }: Props) {
  const [iconPreview,  setIconPreview]  = useState<string>("");
  const [iconFile,     setIconFile]     = useState<File | null>(null);
  const [bannerPreview,setBannerPreview]= useState<string>("");
  const [bannerFile,   setBannerFile]   = useState<File | null>(null);
  const [aboutText,    setAboutText]    = useState("");
  const [loading,      setLoading]      = useState<string | null>(null);
  const [msg,          setMsg]          = useState<{ type: "success" | "error"; text: string } | null>(null);
  const iconRef   = useRef<HTMLInputElement>(null);
  const bannerRef = useRef<HTMLInputElement>(null);

  const showMsg = (type: "success" | "error", text: string) => {
    setMsg({ type, text });
    setTimeout(() => setMsg(null), 5000);
  };

  const applyIcon = async () => {
    if (!iconFile) return;
    setLoading("set_icon");
    try {
      const iconBase64 = await fileToBase64(iconFile);
      const res = await fetch(`/api/botprofile/${guildId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "set_icon", iconBase64 }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      showMsg("success", data.message || "Icon updated!");
    } catch (e: unknown) {
      showMsg("error", e instanceof Error ? e.message : "Something went wrong");
    } finally { setLoading(null); }
  };

  const applyBanner = async () => {
    if (!bannerFile) return;
    setLoading("set_banner");
    try {
      const bannerBase64 = await fileToBase64(bannerFile);
      const res = await fetch(`/api/botprofile/${guildId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "set_banner", bannerBase64 }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      showMsg("success", data.message || "Banner updated!");
    } catch (e: unknown) {
      showMsg("error", e instanceof Error ? e.message : "Something went wrong");
    } finally { setLoading(null); }
  };

  const applyAbout = async () => {
    setLoading("set_about");
    try {
      const res = await fetch(`/api/botprofile/${guildId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "set_about", aboutText }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      showMsg("success", data.message || "About text saved!");
    } catch (e: unknown) {
      showMsg("error", e instanceof Error ? e.message : "Something went wrong");
    } finally { setLoading(null); }
  };

  const reset = async () => {
    setLoading("reset");
    try {
      const res = await fetch(`/api/botprofile/${guildId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "reset" }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      showMsg("success", data.message || "Profile reset!");
      setIconPreview(""); setIconFile(null);
      setBannerPreview(""); setBannerFile(null);
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
          Upgrade to customise the bot&apos;s icon, banner, and about section.
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
        <p className="text-sm text-gray-500">Customise SynthX&apos;s icon, banner, and about section for this server.</p>
      </div>

      {/* Toast */}
      {msg && (
        <div
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-4 rounded-2xl shadow-2xl text-sm font-semibold`}
          style={{
            background: msg.type === "success" ? "linear-gradient(135deg,#14532d,#166534)" : "linear-gradient(135deg,#7f1d1d,#991b1b)",
            border:     msg.type === "success" ? "1px solid #22c55e" : "1px solid #ef4444",
            boxShadow:  msg.type === "success" ? "0 8px 32px rgba(34,197,94,0.35)" : "0 8px 32px rgba(239,68,68,0.35)",
            minWidth: "260px",
            animation: "slideUp 0.3s ease",
          }}
        >
          {msg.type === "success"
            ? <><CheckCircle size={20} className="text-green-400 flex-shrink-0" /><div><p className="text-green-100 font-semibold">Success!</p><p className="text-green-400 text-xs font-normal mt-0.5">{msg.text}</p></div></>
            : <><AlertTriangle size={20} className="text-red-400 flex-shrink-0" /><div><p className="text-red-100 font-semibold">Error</p><p className="text-red-400 text-xs font-normal mt-0.5">{msg.text}</p></div></>
          }
        </div>
      )}

      {/* Bot Icon */}
      <div className="card p-5 space-y-3">
        <p className="text-sm font-semibold text-white">Bot Icon</p>
        <p className="text-xs text-gray-500">Upload a custom avatar for the bot in this server.</p>
        <div
          className="upload-zone cursor-pointer"
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
          <p className="text-xs text-gray-500">Drag &amp; drop or <span className="text-red-400 font-medium">browse</span></p>
          <p className="text-[10px] text-gray-700 mt-0.5">PNG, JPG, GIF — Recommended: 512×512</p>
        </div>
        <input ref={iconRef} type="file" accept="image/*" className="hidden"
          onChange={(e) => { const f = e.target.files?.[0]; if (f) { setIconFile(f); setIconPreview(URL.createObjectURL(f)); } }} />
        <button
          onClick={applyIcon}
          disabled={!iconFile || loading === "set_icon"}
          className="btn-primary text-sm flex items-center gap-2"
        >
          {loading === "set_icon" ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
          {loading === "set_icon" ? "Uploading…" : "Apply Icon"}
        </button>
      </div>

      {/* Banner */}
      <div className="card p-5 space-y-3">
        <p className="text-sm font-semibold text-white">Bot Banner</p>
        <p className="text-xs text-gray-500">Upload a banner image shown on the bot&apos;s profile.</p>
        <div
          className="upload-zone cursor-pointer"
          onClick={() => bannerRef.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            const f = e.dataTransfer.files[0];
            if (f) { setBannerFile(f); setBannerPreview(URL.createObjectURL(f)); }
          }}
        >
          {bannerPreview ? (
            <img src={bannerPreview} alt="banner preview" className="w-full h-24 object-cover rounded-lg mb-2" />
          ) : (
            <Upload size={20} className="text-gray-600 mx-auto mb-2" />
          )}
          <p className="text-xs text-gray-500">Drag &amp; drop or <span className="text-red-400 font-medium">browse</span></p>
          <p className="text-[10px] text-gray-700 mt-0.5">PNG, JPG, GIF — Recommended: 960×480</p>
        </div>
        <input ref={bannerRef} type="file" accept="image/*" className="hidden"
          onChange={(e) => { const f = e.target.files?.[0]; if (f) { setBannerFile(f); setBannerPreview(URL.createObjectURL(f)); } }} />
        <button
          onClick={applyBanner}
          disabled={!bannerFile || loading === "set_banner"}
          className="btn-primary text-sm flex items-center gap-2"
        >
          {loading === "set_banner" ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
          {loading === "set_banner" ? "Uploading…" : "Apply Banner"}
        </button>
      </div>

      {/* About */}
      <div className="card p-5 space-y-3">
        <p className="text-sm font-semibold text-white">About Me</p>
        <p className="text-xs text-gray-500">Custom about text shown on the bot&apos;s profile (max 190 characters).</p>
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
            onClick={applyAbout}
            disabled={!aboutText.trim() || loading === "set_about"}
            className="btn-primary text-sm flex items-center gap-2"
          >
            {loading === "set_about" ? <Loader2 size={14} className="animate-spin" /> : null}
            {loading === "set_about" ? "Saving…" : "Save About"}
          </button>
        </div>
      </div>

      {/* Reset */}
      <div className="card p-5">
        <p className="text-sm font-semibold text-white mb-1">Reset Profile</p>
        <p className="text-xs text-gray-500 mb-3">Revert the bot&apos;s icon and banner back to the default SynthX branding.</p>
        <button
          onClick={reset}
          disabled={loading === "reset"}
          className="btn-secondary text-sm flex items-center gap-2"
        >
          {loading === "reset" ? <Loader2 size={14} className="animate-spin" /> : null}
          Reset to Default
        </button>
      </div>

      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
