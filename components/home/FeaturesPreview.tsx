import { Shield, Settings2, Star, Gift, Ticket, Server, Bell, Users2 } from "lucide-react";

const features = [
  { icon: Shield,    color: "#f87171", title: "Anti-Nuke",     desc: "Protect your server from raids with real-time detection and instant response." },
  { icon: Settings2, color: "#fb923c", title: "AutoMod",       desc: "7 intelligent filters to keep your server clean automatically." },
  { icon: Star,      color: "#facc15", title: "Leveling",      desc: "XP-based leveling system with role rewards and custom messages." },
  { icon: Gift,      color: "#f472b6", title: "Giveaways",     desc: "Run professional giveaways with requirements and multiple winners." },
  { icon: Ticket,    color: "#4ade80", title: "Tickets",       desc: "Full ticket system with transcripts, categories, and support roles." },
  { icon: Server,    color: "#86efac", title: "Minecraft",     desc: "Display live Minecraft server status and player counts." },
  { icon: Bell,      color: "#818cf8", title: "Logging",       desc: "Comprehensive logging across 11 event types with per-channel config." },
  { icon: Users2,    color: "#22d3ee", title: "Auto Role",     desc: "Automatically assign roles to new members and bots on join." },
];

export default function FeaturesPreview() {
  return (
    <section className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-white mb-3">Everything you need</h2>
          <p className="text-gray-500 max-w-xl mx-auto">Powerful features built for modern Discord communities.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {features.map(({ icon: Icon, color, title, desc }) => (
            <div key={title} className="card-hover p-5">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-4" style={{ background: `${color}12` }}>
                <Icon size={18} style={{ color }} />
              </div>
              <h3 className="text-sm font-semibold text-white mb-1.5">{title}</h3>
              <p className="text-xs text-gray-500 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
