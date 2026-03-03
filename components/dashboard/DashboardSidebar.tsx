"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  LayoutDashboard, Shield, Settings2, Hammer, Sliders, Users2,
  AlertOctagon, Gift, FileText, Repeat2, Layers, Ticket, Server,
  UserPlus, Wrench, Bot, Star, Moon, Menu, X, ChevronRight, Lock, ArrowLeft,
} from "lucide-react";
import type { ModuleId } from "@/app/dashboard/[guildId]/page";

interface NavGroup { label: string; items: NavItem[]; }
interface NavItem {
  id: ModuleId; label: string; icon: React.ElementType;
  iconColor: string; premium?: boolean; ownerOnly?: boolean;
}

const NAV_GROUPS: NavGroup[] = [
  {
    label: "General",
    items: [
      { id: "overview",      label: "Overview",         icon: LayoutDashboard, iconColor: "#f2f2f2" },
      { id: "botprofile",    label: "Bot Profile",      icon: Bot,             iconColor: "#c084fc", premium: true },
    ],
  },
  {
    label: "Security",
    items: [
      { id: "antinuke",      label: "Anti-Nuke",        icon: Shield,          iconColor: "#f87171", ownerOnly: true },
      { id: "automod",       label: "AutoMod",          icon: Settings2,       iconColor: "#fb923c" },
      { id: "emergency",     label: "Emergency",        icon: AlertOctagon,    iconColor: "#ef4444", ownerOnly: true },
      { id: "nightmode",     label: "Night Mode",       icon: Moon,            iconColor: "#93c5fd" },
    ],
  },
  {
    label: "Moderation",
    items: [
      { id: "moderation",    label: "Moderation",       icon: Hammer,          iconColor: "#fbbf24" },
      { id: "logging",       label: "Logging",          icon: FileText,        iconColor: "#818cf8" },
    ],
  },
  {
    label: "Members",
    items: [
      { id: "welcome",       label: "Welcomer & Boosts", icon: UserPlus,       iconColor: "#34d399" },
      { id: "autorole",      label: "Auto Role",        icon: Users2,          iconColor: "#22d3ee" },
      { id: "leveling",      label: "Leveling",         icon: Star,            iconColor: "#facc15", premium: true },
    ],
  },
  {
    label: "Engagement",
    items: [
      { id: "giveaway",      label: "Giveaways",        icon: Gift,            iconColor: "#f472b6" },
      { id: "reactionroles", label: "Reaction Roles",   icon: Repeat2,         iconColor: "#60a5fa" },
      { id: "tickets",       label: "Ticket System",    icon: Ticket,          iconColor: "#4ade80" },
    ],
  },
  {
    label: "Tools",
    items: [
      { id: "embeds",        label: "Embeds",           icon: Layers,          iconColor: "#fb923c" },
      { id: "setup",         label: "Setup / Roles",    icon: Sliders,         iconColor: "#a78bfa" },
      { id: "minecraft",     label: "Minecraft Status", icon: Server,          iconColor: "#86efac" },
      { id: "ignore",        label: "Ignore Setup",     icon: Wrench,          iconColor: "#9ca3af" },
    ],
  },
];

interface Props {
  activeModule: ModuleId;
  setActiveModule: (m: ModuleId) => void;
  guildId: string;
  isPremium: boolean;
  isOwner: boolean;
  guildName?: string;
  guildIcon?: string | null;
}

export default function DashboardSidebar({
  activeModule, setActiveModule, guildId, isPremium, isOwner, guildName, guildIcon,
}: Props) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const iconUrl = guildIcon
    ? `https://cdn.discordapp.com/icons/${guildId}/${guildIcon}.${guildIcon.startsWith("a_") ? "gif" : "png"}?size=64`
    : null;

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Brand header */}
      <div className="p-4 border-b border-[#1a1a1a]">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="relative w-8 h-8 rounded-lg overflow-hidden flex-shrink-0 animate-glow">
            <Image src="/bot-logo.png" alt="SynthX" fill className="object-contain" />
          </div>
          <span className="font-display font-bold text-sm gradient-text tracking-wide">SynthX</span>
        </div>

        {/* Guild card */}
        <div
          className="flex items-center gap-3 p-3 rounded-xl border transition-all cursor-default"
          style={{
            background: "linear-gradient(135deg, rgba(239,68,68,0.04), rgba(249,115,22,0.02))",
            borderColor: "rgba(239,68,68,0.12)",
          }}
        >
          {iconUrl ? (
            <img src={iconUrl} alt={guildName} className="w-10 h-10 rounded-xl object-cover flex-shrink-0 ring-1 ring-white/10" />
          ) : (
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0 shadow-lg">
              {guildName?.charAt(0) || "S"}
            </div>
          )}
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-white truncate leading-tight">{guildName || "Server"}</p>
            <div className="flex items-center gap-1 mt-1 flex-wrap">
              {isPremium && <span className="pill pill-purple" style={{ fontSize: "0.6rem" }}>✦ Premium</span>}
              {isOwner  && <span className="pill pill-orange"  style={{ fontSize: "0.6rem" }}>👑 Owner</span>}
              {!isPremium && !isOwner && <span className="text-[10px] text-gray-600">Member</span>}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-5">
        {NAV_GROUPS.map((group) => (
          <div key={group.label} className="nav-group">
            {/* Group label */}
            <p className="text-[10px] font-bold text-gray-700 uppercase tracking-[0.12em] px-2 mb-1.5">
              {group.label}
            </p>
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const premiumLocked = item.premium && !isPremium;
                const isActive = activeModule === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => { if (!premiumLocked) { setActiveModule(item.id); setMobileOpen(false); } }}
                    className={`nav-item ${isActive ? "active" : ""} ${premiumLocked ? "locked" : ""}`}
                    title={premiumLocked ? "Premium required" : item.ownerOnly && !isOwner ? "Owner-only (view mode)" : undefined}
                  >
                    {/* Icon */}
                    <div
                      className="w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0 transition-all"
                      style={{
                        background: isActive ? `${item.iconColor}18` : premiumLocked ? "transparent" : "transparent",
                      }}
                    >
                      <item.icon
                        size={13}
                        style={{
                          color: isActive ? item.iconColor : premiumLocked ? "#2a2a2a" : "#4b5563",
                        }}
                      />
                    </div>

                    <span className="flex-1 truncate text-[13px]">{item.label}</span>

                    {/* Badges */}
                    {item.premium && !isPremium && (
                      <Lock size={10} className="text-gray-700 flex-shrink-0" />
                    )}
                    {item.premium && isPremium && (
                      <span className="text-[9px] font-bold text-purple-400 uppercase tracking-wide flex-shrink-0">Pro</span>
                    )}
                    {item.ownerOnly && !item.premium && isOwner && (
                      <span className="text-[10px] flex-shrink-0">👑</span>
                    )}
                    {isActive && !premiumLocked && (
                      <ChevronRight size={11} className="text-red-400 flex-shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-[#1a1a1a]">
        <Link href="/dashboard" className="nav-item group" onClick={() => setMobileOpen(false)}>
          <div className="w-6 h-6 rounded-md flex items-center justify-center">
            <ArrowLeft size={13} className="text-gray-600 group-hover:text-gray-400 transition-colors" />
          </div>
          <span className="text-[13px]">All Servers</span>
        </Link>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile toggle button */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 w-9 h-9 rounded-lg bg-[#0f0f0f] border border-[#1e1e1e] flex items-center justify-center text-gray-400 hover:text-white hover:border-[#2a2a2a] transition-all"
        onClick={() => setMobileOpen(!mobileOpen)}
        aria-label="Toggle menu"
      >
        {mobileOpen ? <X size={16} /> : <Menu size={16} />}
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/70 z-40 backdrop-blur-sm"
          style={{ animation: "fadeIn 0.2s ease" }}
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile sidebar */}
      <div
        className={`md:hidden fixed left-0 top-0 bottom-0 z-50 w-64 bg-[#09090b] border-r border-[#1a1a1a] overflow-y-auto transform transition-transform duration-300 ease-out ${mobileOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <SidebarContent />
      </div>

      {/* Desktop sidebar */}
      <div className="hidden md:flex flex-col fixed left-0 top-0 bottom-0 w-60 bg-[#09090b] border-r border-[#1a1a1a] overflow-y-auto z-30">
        <SidebarContent />
      </div>
    </>
  );
}
