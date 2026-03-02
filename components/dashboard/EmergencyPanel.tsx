"use client";

import { useState } from "react";
import { AlertOctagon, Shield, Lock, CheckCircle, Loader2, Zap } from "lucide-react";

interface Props { guildId: string; isOwner: boolean; }

export default function EmergencyPanel({ guildId, isOwner }: Props) {
  const [activating, setActivating] = useState(false);
  const [restoring,  setRestoring]  = useState(false);
  const [status,     setStatus]     = useState<"idle" | "active" | "restored">("idle");
  const [confirm,    setConfirm]    = useState(false);
  const [error,      setError]      = useState<string | null>(null);

  const handleEmergency = async () => {
    if (!confirm) { setConfirm(true); return; }
    setActivating(true); setConfirm(false); setError(null);
    try {
      const res = await fetch(`/api/settings/${guildId}`, {
        method: "POST",
        body: JSON.stringify({ module: "emergency", settings: { action: "activate" } }),
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Activation failed");
      setStatus("active");
    } catch (e: unknown) { setError(e instanceof Error ? e.message : "Failed"); }
    setActivating(false);
  };

  const handleRestore = async () => {
    setRestoring(true); setError(null);
    try {
      const res = await fetch(`/api/settings/${guildId}`, {
        method: "POST",
        body: JSON.stringify({ module: "emergency", settings: { action: "restore" } }),
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Restore failed");
      setStatus("restored");
    } catch (e: unknown) { setError(e instanceof Error ? e.message : "Failed"); }
    setRestoring(false);
  };

  return (
    <div className="max-w-xl space-y-5 animate-fade-in">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{background:"rgba(239,68,68,0.1)"}}>
          <AlertOctagon size={18} className="text-red-400" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-white">Emergency Mode</h1>
          <span className="pill pill-orange mt-0.5">Owner Only</span>
        </div>
      </div>

      {!isOwner && (
        <div className="info-banner info-yellow flex items-start gap-2">
          <Lock size={13} className="flex-shrink-0 mt-0.5" />
          <span>Only the server owner can activate or restore Emergency Mode.</span>
        </div>
      )}

      {/* Warning */}
      <div className="info-banner info-red">
        <p className="font-semibold mb-1 text-red-300">⚠ Warning</p>
        <p>Activating Emergency Mode will lock all channels, remove dangerous permissions from roles, and stop any ongoing raid. Only use during an active attack. Use "Restore" once the threat is cleared.</p>
      </div>

      {/* What it does */}
      <div className="card p-5">
        <p className="text-sm font-semibold text-white mb-3">What Emergency Mode Does</p>
        <div className="space-y-2.5">
          {[
            { icon: Lock,        color: "#f87171", text: "Locks all text channels (removes @everyone Send Messages)" },
            { icon: Shield,      color: "#fb923c", text: "Removes dangerous permissions from all non-whitelisted roles" },
            { icon: Zap,         color: "#fbbf24", text: "Pauses anti-nuke events and clears the action queue" },
            { icon: CheckCircle, color: "#60a5fa", text: "Creates a full permission backup for restoration" },
          ].map(({ icon: Icon, color, text }) => (
            <div key={text} className="flex items-start gap-3">
              <Icon size={14} style={{ color, flexShrink: 0 }} className="mt-0.5" />
              <p className="text-sm text-gray-300">{text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Status */}
      {status === "active" && (
        <div className="info-banner info-red flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-red-500 dot-pulse flex-shrink-0" />
          <span className="font-semibold">Emergency Mode Active — Server is locked down</span>
        </div>
      )}
      {status === "restored" && (
        <div className="info-banner info-green flex items-center gap-2">
          <CheckCircle size={14} className="flex-shrink-0" />
          <span className="font-semibold">Permissions Restored — Server back to normal</span>
        </div>
      )}
      {error && <div className="info-banner info-red">{error}</div>}

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={handleEmergency}
          disabled={activating || !isOwner}
          className="btn-primary justify-center"
          style={{background:"linear-gradient(135deg,#dc2626,#b91c1c)", flex:1}}
        >
          {activating ? <Loader2 size={16} className="animate-spin" /> : <AlertOctagon size={16} />}
          {confirm ? "⚠ Confirm Emergency Lockdown" : "🚨 Activate Emergency Mode"}
        </button>
        <button
          onClick={handleRestore}
          disabled={restoring || status !== "active" || !isOwner}
          className="btn-secondary justify-center"
          style={{flex:1}}
        >
          {restoring ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle size={16} />}
          Restore Permissions
        </button>
      </div>
      {confirm && <p className="text-xs text-yellow-400">Click again to confirm. This will immediately lock your server.</p>}
    </div>
  );
}
