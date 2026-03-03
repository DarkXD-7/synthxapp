"use client";

import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export default function CTASection() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setVisible(true); obs.disconnect(); }
    }, { threshold: 0.2 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section className="py-24 px-4 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#2a2a2a] to-transparent" />
      </div>
      
      <div
        ref={ref}
        className="max-w-2xl mx-auto text-center"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(24px)",
          transition: "opacity 0.6s ease, transform 0.6s ease",
        }}
      >
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#2a2a2a] bg-[#0f0f0f] text-xs text-gray-500 mb-6">
          <Sparkles size={11} className="text-yellow-400" />
          Start protecting your server today
        </div>
        
        <h2 className="font-display text-3xl sm:text-4xl font-bold text-white mb-4">
          Ready to get started?
        </h2>
        <p className="text-gray-500 mb-8 max-w-md mx-auto leading-relaxed">
          Add SynthX to your server and take full control from the professional dashboard.
        </p>
        
        {/* Glow card */}
        <div
          className="relative inline-block w-full max-w-sm mx-auto mb-8 rounded-2xl p-6"
          style={{
            background: "linear-gradient(135deg, rgba(239,68,68,0.06), rgba(249,115,22,0.04))",
            border: "1px solid rgba(239,68,68,0.15)",
            boxShadow: "0 0 48px rgba(239,68,68,0.08)",
          }}
        >
          <p className="text-sm text-gray-400 mb-1">Join <span className="text-white font-semibold">1,000+</span> servers</p>
          <p className="text-xs text-gray-600">Trusted by communities worldwide</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <a
            href={`https://discord.com/oauth2/authorize?client_id=${process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID}&permissions=8&scope=bot%20applications.commands`}
            target="_blank" rel="noopener noreferrer"
            className="btn-primary text-base px-7 py-3"
          >
            Invite SynthX <ArrowRight size={16} />
          </a>
          <Link href="/dashboard" className="btn-secondary text-base px-7 py-3">
            Open Dashboard
          </Link>
        </div>
      </div>
    </section>
  );
}
