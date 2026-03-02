// app/dashboard/[guildId]/page.tsx — Updated with ignore module, utility removed

"use client";

import { useEffect, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Loader2, AlertTriangle, ShieldAlert, RefreshCw, Wifi, WifiOff } from "lucide-react";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import ModulePanel from "@/components/dashboard/ModulePanel";
import OverviewPanel from "@/components/dashboard/OverviewPanel";
import EmergencyPanel from "@/components/dashboard/EmergencyPanel";
import BotProfilePanel from "@/components/dashboard/BotProfilePanel";

export type ModuleId =
  | "overview" | "antinuke" | "automod" | "logging" | "welcome"
  | "leveling" | "giveaway" | "reactionroles" | "autorole" | "nightmode"
  | "emergency" | "botprofile" | "moderation" | "setup" | "tickets"
  | "embeds" | "minecraft" | "ignore";

interface GuildInfo {
  id: string;
  name: string;
  icon: string | null;
  ownerId: string | null;
  userIsOwner?: boolean;
}

export default function GuildDashboard() {
  const { data: session, status } = useSession();
  const params = useParams();
  const router = useRouter();
  const guildId = params.guildId as string;

  const [activeModule, setActiveModule] = useState<ModuleId>("overview");
  const [guildInfo, setGuildInfo] = useState<GuildInfo | null>(null);
  const [settings, setSettings] = useState<Record<string, unknown>>({});
  const [isPremium, setIsPremium] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const [isBlacklisted, setIsBlacklisted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [botOnline, setBotOnline] = useState(true);

  const loadSettings = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/settings/${guildId}`, { cache: "no-store" });
      if (res.status === 401) { router.push("/"); return; }
      if (res.status === 403) {
        const data = await res.json();
        setError(data.error || "Access denied");
        setLoading(false);
        return;
      }
      if (!res.ok) {
        setBotOnline(false);
        setLoading(false);
        return;
      }
      const data = await res.json();
      setSettings(data);
      setBotOnline(true);
      if (data?.guild) {
        setGuildInfo(data.guild);
        setIsOwner(Boolean(data.guild.userIsOwner));
      }
      if (data?.premium === true) setIsPremium(true);
      if (data?.blacklisted === true) setIsBlacklisted(true);
    } catch {
      setBotOnline(false);
    } finally {
      setLoading(false);
    }
  }, [guildId, router]);

  useEffect(() => {
    if (status === "unauthenticated") { router.push("/"); return; }
    if (status === "authenticated") loadSettings();
  }, [status, loadSettings, router]);

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen page-bg flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 mx-auto mb-4 relative">
            <Image src="/bot-logo.png" alt="SynthX" fill className="object-contain animate-pulse" />
          </div>
          <Loader2 size={20} className="animate-spin text-red-500 mx-auto mb-3" />
          <p className="text-gray-500 text-sm">Loading dashboard…</p>
        </div>
      </div>
    );
  }

  if (!session) return null;

  if (error && Object.keys(settings).length === 0) {
    return (
      <div className="min-h-screen page-bg flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <AlertTriangle size={40} className="text-red-400 mx-auto mb-4" />
          <h1 className="text-xl font-bold text-white mb-2">Access Denied</h1>
          <p className="text-gray-500 text-sm mb-6">{error}</p>
          <Link href="/dashboard" className="btn-primary">← Back to Servers</Link>
        </div>
      </div>
    );
  }

  if (isBlacklisted) {
    return (
      <div className="min-h-screen page-bg flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <ShieldAlert size={40} className="text-red-500 mx-auto mb-4" />
          <h1 className="text-xl font-bold text-white mb-2">Server Blacklisted</h1>
          <p className="text-gray-500 text-sm mb-6">This server is blacklisted. Contact support if you believe this is an error.</p>
          <a href="https://discord.gg/WKX5HHPmWz" target="_blank" rel="noopener noreferrer" className="btn-primary">Contact Support</a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen page-bg flex">
      <DashboardSidebar
        activeModule={activeModule}
        setActiveModule={setActiveModule}
        guildId={guildId}
        isPremium={isPremium}
        isOwner={isOwner}
        guildName={guildInfo?.name}
        guildIcon={guildInfo?.icon}
      />

      <div className="flex-1 md:ml-60 min-h-screen flex flex-col">
        {/* Topbar */}
        <div className="sticky top-0 z-20 bg-[#080808]/95 backdrop-blur border-b border-[#1e1e1e] px-5 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3 ml-10 md:ml-0">
            {guildInfo?.icon ? (
              <img src={`https://cdn.discordapp.com/icons/${guildId}/${guildInfo.icon}.png?size=32`}
                alt={guildInfo.name} className="w-6 h-6 rounded-md object-cover" />
            ) : null}
            <span className="font-semibold text-sm text-white truncate max-w-[150px] sm:max-w-none">
              {guildInfo?.name || `Server ${guildId}`}
            </span>
            {isPremium && <span className="pill pill-purple hidden sm:inline-flex">Premium</span>}
            {isOwner && <span className="pill pill-orange hidden sm:inline-flex">Owner</span>}
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5">
              {botOnline ? <Wifi size={13} className="text-green-400" /> : <WifiOff size={13} className="text-red-400" />}
              <span className={`text-xs hidden sm:inline ${botOnline ? "text-green-400" : "text-red-400"}`}>
                {botOnline ? "Online" : "Offline"}
              </span>
            </div>
            <button onClick={loadSettings}
              className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-white px-2.5 py-1.5 rounded-lg hover:bg-white/5 transition-colors">
              <RefreshCw size={12} /><span className="hidden sm:inline">Refresh</span>
            </button>
          </div>
        </div>

        {!botOnline && (
          <div className="mx-5 mt-4 info-banner info-yellow flex items-center gap-2">
            <AlertTriangle size={14} className="flex-shrink-0" />
            <span>Bot API unreachable — settings shown may be stale. The bot will sync when it comes back online.</span>
          </div>
        )}

        <div className="flex-1 p-5 md:p-6 animate-fade-in">
          {activeModule === "overview" && (
            <OverviewPanel guildId={guildId} isPremium={isPremium} isOwner={isOwner} settings={settings} onRefresh={loadSettings} />
          )}
          {activeModule === "emergency" && (
            <EmergencyPanel guildId={guildId} isOwner={isOwner} />
          )}
          {activeModule === "botprofile" && (
            <BotProfilePanel guildId={guildId} isPremium={isPremium} />
          )}
          {activeModule !== "overview" && activeModule !== "emergency" && activeModule !== "botprofile" && (
            <ModulePanel
              moduleId={activeModule}
              guildId={guildId}
              isPremium={isPremium}
              isOwner={isOwner}
              settings={settings}
              onSave={(mod, newSettings) => setSettings((prev) => ({ ...prev, [mod]: newSettings }))}
            />
          )}
        </div>
      </div>
    </div>
  );
}
