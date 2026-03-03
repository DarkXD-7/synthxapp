"use client";

import { useEffect, useState, useRef } from "react";

function useCountUp(target: number, duration = 1800) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true;
        const start = Date.now();
        const tick = () => {
          const elapsed = Date.now() - start;
          const progress = Math.min(elapsed / duration, 1);
          const ease = 1 - Math.pow(1 - progress, 3);
          setCount(Math.floor(ease * target));
          if (progress < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      }
    }, { threshold: 0.3 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [target, duration]);

  return { count, ref };
}

function StatItem({ value, label, suffix = "" }: { value: number; label: string; suffix?: string }) {
  const { count, ref } = useCountUp(value);
  return (
    <div ref={ref} className="stat-item text-center group px-6 py-2">
      <p className="text-3xl sm:text-4xl font-bold font-display text-white mb-1 group-hover:gradient-text transition-all">
        {count.toLocaleString()}{suffix}
      </p>
      <p className="text-xs text-gray-600 uppercase tracking-[0.12em] font-semibold">{label}</p>
    </div>
  );
}

export default function StatsSection() {
  const [stats, setStats] = useState<{ servers: number; users: number; ping: number; uptime: string } | null>(null);

  useEffect(() => {
    fetch("/api/stats").then(r => r.json()).then(setStats).catch(() => {});
  }, []);

  return (
    <section className="py-14 px-4 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#2a2a2a] to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#2a2a2a] to-transparent" />
      </div>
      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-0 sm:divide-x sm:divide-[#1e1e1e]">
          <StatItem value={stats?.servers ?? 1000} label="Servers" suffix="+" />
          <StatItem value={stats?.users ?? 50000} label="Users" suffix="+" />
          <StatItem value={999} label="Uptime" suffix="%" />
          <StatItem value={120} label="Commands" suffix="+" />
        </div>
      </div>
    </section>
  );
}
