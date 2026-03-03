"use client";

import { Shield, Settings2, Star, Gift, Ticket, Server, Bell, Users2, Moon, Hammer, Repeat2, Layers } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const features = [
  { icon: Shield,    color: "#f87171", bg: "#f871711a", title: "Anti-Nuke",      desc: "Protect your server from raids with real-time detection and instant response." },
  { icon: Settings2, color: "#fb923c", bg: "#fb923c1a", title: "AutoMod",        desc: "7 intelligent filters to keep your server clean and free from spam." },
  { icon: Star,      color: "#facc15", bg: "#facc151a", title: "Leveling",       desc: "XP-based leveling system with role rewards and custom messages." },
  { icon: Gift,      color: "#f472b6", bg: "#f472b61a", title: "Giveaways",      desc: "Run professional giveaways with requirements and multiple winners." },
  { icon: Ticket,    color: "#4ade80", bg: "#4ade801a", title: "Ticket System",  desc: "Full ticket system with transcripts, categories, and support roles." },
  { icon: Server,    color: "#86efac", bg: "#86efac1a", title: "Minecraft",      desc: "Display live Minecraft server status and player counts in real time." },
  { icon: Bell,      color: "#818cf8", bg: "#818cf81a", title: "Logging",        desc: "Comprehensive logging across 11 event types with per-channel config." },
  { icon: Users2,    color: "#22d3ee", bg: "#22d3ee1a", title: "Auto Role",      desc: "Automatically assign roles to new members and bots on join." },
  { icon: Moon,      color: "#93c5fd", bg: "#93c5fd1a", title: "Night Mode",     desc: "Schedule automatic channel lockdowns for overnight periods." },
  { icon: Hammer,    color: "#fbbf24", bg: "#fbbf241a", title: "Moderation",     desc: "Comprehensive mod tools: ban, kick, mute, warn, and more." },
  { icon: Repeat2,   color: "#60a5fa", bg: "#60a5fa1a", title: "Reaction Roles", desc: "Let members self-assign roles with emoji reactions." },
  { icon: Layers,    color: "#fb923c", bg: "#fb923c1a", title: "Embeds",         desc: "Build and send rich embeds with a live preview editor." },
];

function FeatureCard({ icon: Icon, color, bg, title, desc, delay }: typeof features[0] & { delay: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setVisible(true); obs.disconnect(); }
    }, { threshold: 0.1 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="card-hover p-5 group"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(20px)",
        transition: `opacity 0.5s ${delay}ms ease, transform 0.5s ${delay}ms ease`,
      }}
    >
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110"
        style={{ background: bg, boxShadow: `0 4px 12px ${color}20` }}
      >
        <Icon size={18} style={{ color }} />
      </div>
      <h3 className="text-sm font-semibold text-white mb-1.5">{title}</h3>
      <p className="text-xs text-gray-500 leading-relaxed">{desc}</p>
    </div>
  );
}

export default function FeaturesPreview() {
  return (
    <section className="py-24 px-4 relative">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#2a2a2a] bg-[#0f0f0f] text-xs text-gray-500 mb-4">
            ✦ Packed with features
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-white mb-3">
            Everything your server needs
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto">
            Powerful, battle-tested features built for modern Discord communities.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {features.map((f, i) => (
            <FeatureCard key={f.title} {...f} delay={i * 40} />
          ))}
        </div>
      </div>
    </section>
  );
}
