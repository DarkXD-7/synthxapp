"use client";

import Link from "next/link";
import Image from "next/image";
import { useSession, signIn } from "next-auth/react";
import { ArrowRight, Shield, Zap, Star } from "lucide-react";

export default function HeroSection() {
  const { data: session } = useSession();

  return (
    <section className="min-h-screen flex flex-col items-center justify-center px-4 pt-16 pb-12 relative overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(239,68,68,0.04) 0%, transparent 70%)" }}
        />
      </div>

      <div className="text-center max-w-3xl mx-auto relative z-10">

        {/* ── Logo with banner background ── */}
        <div className="relative w-36 h-36 mx-auto mb-8 flex items-center justify-center">
          {/* Outer glow ring */}
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background: "radial-gradient(circle, rgba(239,68,68,0.25) 0%, rgba(249,115,22,0.12) 50%, transparent 75%)",
              filter: "blur(8px)",
            }}
          />
          {/* Banner circle background */}
          <div
            className="absolute inset-3 rounded-full"
            style={{
              background: "linear-gradient(135deg, rgba(239,68,68,0.15), rgba(249,115,22,0.1))",
              border: "1px solid rgba(239,68,68,0.25)",
              backdropFilter: "blur(4px)",
            }}
          />
          {/* Logo image */}
          <div className="relative w-20 h-20 z-10">
            <Image
              src="/bot-logo.png"
              alt="SynthX"
              fill
              className="object-contain drop-shadow-lg"
              priority
            />
          </div>
        </div>

        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#2a2a2a] bg-[#0f0f0f] text-xs text-gray-400 mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-green-400 dot-pulse" />
          All systems online
        </div>

        {/* Headline */}
        <h1 className="font-display text-5xl sm:text-6xl md:text-7xl font-bold leading-[1.05] mb-6">
          The <span className="gradient-text">all-in-one</span><br />Discord bot
        </h1>

        <p className="text-gray-400 text-lg max-w-xl mx-auto mb-10 leading-relaxed">
          Security, moderation, music, leveling, and more — all in one powerful bot with a professional dashboard.
        </p>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          {session ? (
            <Link href="/dashboard" className="btn-primary text-base px-6 py-3">
              Open Dashboard <ArrowRight size={16} />
            </Link>
          ) : (
            <button onClick={() => signIn("discord")} className="btn-primary text-base px-6 py-3">
              Get Started <ArrowRight size={16} />
            </button>
          )}
          <a
            href={`https://discord.com/oauth2/authorize?client_id=${process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID}&permissions=8&scope=bot%20applications.commands`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary text-base px-6 py-3"
          >
            Invite to Server
          </a>
        </div>

        {/* Feature pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mt-10">
          {[
            { icon: Shield, label: "Anti-Nuke", color: "#f87171" },
            { icon: Zap,    label: "AutoMod",   color: "#fb923c" },
            { icon: Star,   label: "Leveling",  color: "#facc15" },
          ].map(({ icon: Icon, label, color }) => (
            <div key={label} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#0f0f0f] border border-[#1e1e1e] text-xs text-gray-400">
              <Icon size={12} style={{ color }} />
              {label}
            </div>
          ))}
          <div className="px-3 py-1.5 rounded-full bg-[#0f0f0f] border border-[#1e1e1e] text-xs text-gray-600">
            +15 more features
          </div>
        </div>
      </div>
    </section>
  );
}
