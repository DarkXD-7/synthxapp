"use client";

import Link from "next/link";
import Image from "next/image";
import { useSession, signIn } from "next-auth/react";
import { ArrowRight, Shield, Zap, Star } from "lucide-react";

export default function HeroSection() {
  const { data: session } = useSession();

  return (
    <section className="min-h-screen flex flex-col items-center justify-center px-4 pt-16 pb-12 relative overflow-hidden">
      {/* Subtle background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full" style={{background:"radial-gradient(circle, rgba(239,68,68,0.04) 0%, transparent 70%)"}} />
      </div>

      <div className="text-center max-w-3xl mx-auto relative z-10">
        {/* Logo with Discord-style banner */}
        <div className="relative mx-auto mb-10 w-64">
          {/* Banner */}
          <div
            className="w-full h-24 rounded-2xl"
            style={{
              background: "linear-gradient(135deg, #1a0505 0%, #3d0a0a 30%, #7f1010 60%, #ef4444 85%, #f97316 100%)",
              boxShadow: "0 0 40px rgba(239,68,68,0.3)",
            }}
          >
            {/* Shimmer overlay on banner */}
            <div
              className="w-full h-full rounded-2xl opacity-40"
              style={{
                background: "radial-gradient(ellipse at 70% 50%, rgba(249,115,22,0.6) 0%, transparent 60%)",
              }}
            />
         </div>

  {/* Circle logo sitting on top of banner */}
  <div className="absolute -bottom-8 left-1/2 -translate-x-1/2">
    <div
      className="w-20 h-20 rounded-full p-1"
      style={{
        background: "linear-gradient(135deg, #ef4444, #f97316)",
        boxShadow: "0 0 20px rgba(239,68,68,0.5)",
      }}
    >
      <div className="w-full h-full rounded-full overflow-hidden bg-[#0a0a0a] flex items-center justify-center">
        <div className="relative w-14 h-14">
          <Image src="/bot-logo.png" alt="SynthX" fill className="object-contain" priority />
        </div>
      </div>
    </div>
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
            target="_blank" rel="noopener noreferrer"
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
