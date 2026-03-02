"use client";

import { useEffect, useState } from "react";

export default function StatsSection() {
  const [stats, setStats] = useState<{ servers: number; users: number; ping: number; uptime: string } | null>(null);

  useEffect(() => {
    fetch("/api/stats").then(r => r.json()).then(setStats).catch(() => {});
  }, []);

  const items = [
    { label: "Servers",   value: stats?.servers?.toLocaleString() ?? "1,000+" },
    { label: "Users",     value: stats?.users?.toLocaleString()   ?? "50,000+" },
    { label: "Uptime",    value: stats?.uptime ?? "99.9%" },
    { label: "Commands",  value: "120+" },
  ];

  return (
    <section className="py-12 px-4 border-y border-[#1e1e1e]">
      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 text-center">
          {items.map(({ label, value }) => (
            <div key={label}>
              <p className="text-2xl sm:text-3xl font-bold text-white">{value}</p>
              <p className="text-xs text-gray-600 mt-1 uppercase tracking-widest">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
