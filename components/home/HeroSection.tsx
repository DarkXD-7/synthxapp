"use client";

import Link from "next/link";
import Image from "next/image";
import { useSession, signIn } from "next-auth/react";
import { ArrowRight, Shield, Zap, Star, Ticket, Users, Bell } from "lucide-react";

export default function HeroSection() {
  const { data: session } = useSession();

  return (
    <section className="min-h-screen flex flex-col items-center justify-center px-4 pt-20 pb-16 relative overflow-hidden">
      {/* Background glow orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[500px] rounded-full opacity-60"
          style={{
            background: "radial-gradient(circle, rgba(239,68,68,0.06) 0%, transparent 65%)",
            animation: "float 6s ease-in-out infinite",
          }}
        />
        <div
          className="absolute top-1/3 left-1/4 w-64 h-64 rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(249,115,22,0.04) 0%, transparent 70%)",
            animation: "float 8s ease-in-out infinite",
            animationDelay: "-3s",
          }}
        />
        <div
          className="absolute bottom-1/3 right-1/4 w-48 h-48 rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(239,68,68,0.03) 0%, transparent 70%)",
            animation: "float 5s ease-in-out infinite",
            animationDelay: "-1.5s",
          }}
        />
        {/* Subtle grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage: "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      <div className="text-center max-w-3xl mx-auto relative z-10">

        {/* Discord-style banner + logo */}
        <div className="relative mx-auto mb-16 w-full max-w-lg stagger-1">
          {/* Banner */}
          <div
            className="relative w-full h-36 rounded-2xl overflow-hidden"
            style={{ boxShadow: "0 8px 48px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.06)" }}
          >
            <Image src="/banner.jpg" alt="SynthX Banner" fill className="object-cover" priority />
            <div
              className="absolute inset-0"
              style={{ background: "linear-gradient(135deg, rgba(239,68,68,0.08), rgba(249,115,22,0.04))" }}
            />
            <div
              className="absolute bottom-0 left-0 right-0 h-16"
              style={{ background: "linear-gradient(to bottom, transparent, rgba(0,0,0,0.8))" }}
            />
          </div>

          {/* Logo avatar */}
          <div className="absolute -bottom-10 left-1/2 -translate-x-1/2">
            <div
              className="relative w-20 h-20 rounded-full overflow-hidden bg-[#0a0a0a] border-4 border-[#080808]"
              style={{ boxShadow: "0 0 0 1px rgba(239,68,68,0.2), 0 8px 24px rgba(0,0,0,0.6)" }}
            >
              <Image src="/bot-logo.png" alt="SynthX" fill className="object-contain" priority />
            </div>
          </div>
        </div>

        {/* Online badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#2a2a2a] bg-[#0f0f0f] text-xs text-gray-400 mb-6 stagger-2 hover:border-green-500/20 hover:text-green-400 transition-all">
          <span className="w-1.5 h-1.5 rounded-full bg-green-400 dot-pulse" />
          online & ready
        </div>

        {/* Headline */}
        <h1 className="font-display text-5xl sm:text-6xl md:text-7xl font-bold leading-[1.05] mb-6 stagger-2">
          <span className="gradient-text">SynthX</span>
          <br />
          <span className="text-white">Protection Engine</span>
        </h1>

        <p className="text-gray-400 text-lg max-w-xl mx-auto mb-10 leading-relaxed stagger-3">
          Advanced security, AutoMod, tickets, and essential server tools — all managed through a modern, professional dashboard.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-10 stagger-4">
          {session ? (
            <Link href="/dashboard" className="btn-primary text-base px-7 py-3">
              Open Dashboard <ArrowRight size={16} />
            </Link>
          ) : (
            <button onClick={() => signIn("discord")} className="btn-primary text-base px-7 py-3">
              Get Started Free <ArrowRight size={16} />
            </button>
          )}
          <a
            href={`https://discord.com/oauth2/authorize?client_id=${process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID}&permissions=8&scope=bot%20applications.commands`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary text-base px-7 py-3"
          >
            Invite to Server
          </a>
        </div>

        {/* Feature pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 stagger-5">
          {[
            { icon: Shield,  label: "Anti-Nuke",   color: "#f87171" },
            { icon: Zap,     label: "AutoMod",     color: "#fb923c" },
            { icon: Ticket,  label: "Tickets",     color: "#4ade80" },
            { icon: Star,    label: "Leveling",    color: "#facc15" },
            { icon: Bell,    label: "Logging",     color: "#818cf8" },
            { icon: Users,   label: "Auto Role",   color: "#22d3ee" },
          ].map(({ icon: Icon, label, color }, i) => (
            <div
              key={label}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#0f0f0f] border border-[#1e1e1e] text-xs text-gray-400 hover:border-[#2a2a2a] hover:text-gray-200 transition-all cursor-default"
              style={{ animationDelay: `${0.3 + i * 0.05}s` }}
            >
              <Icon size={11} style={{ color }} />
              {label}
            </div>
          ))}
          <div className="px-3 py-1.5 rounded-full bg-[#0f0f0f] border border-[#1e1e1e] text-xs text-gray-600">
            +9 more features
          </div>
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%,100% { transform: translateY(0) translateX(-50%); }
          50%      { transform: translateY(-12px) translateX(-50%); }
        }
      `}</style>
    </section>
  );
}
