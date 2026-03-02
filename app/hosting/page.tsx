import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Server, CreditCard, Activity, MessageSquare, Zap, Shield, Clock, Star } from "lucide-react";

export default function HostingPage() {
  const links = [
    {
      icon: Server,
      title: "Main Website",
      desc: "Explore hosting plans, features, and pricing.",
      href: "https://hostzy.in",
      label: "Visit Hostzy",
      color: "from-red-500 to-orange-500",
    },
    {
      icon: CreditCard,
      title: "Billing Portal",
      desc: "Manage your subscriptions, invoices, and payments.",
      href: "https://billing.hostzy.in",
      label: "Go to Billing",
      color: "from-orange-500 to-yellow-500",
    },
    {
      icon: Activity,
      title: "Status Page",
      desc: "Real-time uptime monitoring and incident reports.",
      href: "https://status.hostzy.in",
      label: "Check Status",
      color: "from-green-500 to-emerald-500",
    },
    {
      icon: MessageSquare,
      title: "Support Server",
      desc: "Get help from the Hostzy team and community.",
      href: "https://discord.gg/yQ4wyBDqYQ",
      label: "Join Discord",
      color: "from-blue-500 to-indigo-500",
    },
  ];

  const features = [
    { icon: Zap, title: "High Performance", desc: "NVMe SSD storage and powerful CPUs for lightning-fast bot performance." },
    { icon: Shield, title: "DDoS Protection", desc: "Enterprise-grade DDoS mitigation to keep your bot online 24/7." },
    { icon: Clock, title: "99.9% Uptime", desc: "Guaranteed uptime SLA with instant failover and redundancy." },
    { icon: Star, title: "Budget Friendly", desc: "Affordable plans with no hidden fees." },
    { icon: MessageSquare, title: "24/7 Support", desc: "Round-the-clock technical support from knowledgeable staff." },
    { icon: Server, title: "Easy Deploy", desc: "One-click bot deployment with simple file management panel." },
  ];

  return (
    <main className="min-h-screen animated-bg">
      <Navbar />

      <div className="pt-24 pb-20 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Hero */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-sm font-medium mb-4">
              <Star size={14} />
              Official Hosting Partner
            </div>
            <h1 className="text-5xl md:text-6xl font-black mb-4">
              Host Your Bot with{" "}
              <span className="gradient-text">Hostzy</span>
            </h1>
            <p className="text-gray-400 text-xl max-w-2xl mx-auto mb-8">
              SynthX recommends Hostzy for reliable, affordable, and high-performance Discord bot hosting. Built for bots, trusted by communities.
            </p>
            <a
              href="https://hostzy.in"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-10 py-4 rounded-xl font-bold text-white text-lg transition-all duration-300 hover:scale-105"
              style={{
                background: "linear-gradient(135deg, #ef1515, #f97316)",
                boxShadow: "0 0 30px rgba(239,21,21,0.4)",
              }}
            >
              <Server size={20} />
              Get Started with Hostzy
            </a>
          </div>

          {/* Banner card */}
          <div
            className="rounded-2xl p-10 mb-14 relative overflow-hidden"
            style={{
              background: "linear-gradient(135deg, rgba(239,21,21,0.1), rgba(249,115,22,0.1))",
              border: "1px solid rgba(239,21,21,0.2)",
            }}
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-red-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="relative z-10 grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-3xl font-black text-white mb-3">Why Hostzy?</h2>
                <p className="text-gray-400 leading-relaxed">
                  Hostzy is a specialized Discord bot hosting provider trusted by thousands of server owners. With enterprise hardware, instant setup, and an Indian support team available around the clock, your bot stays online and blazing fast.
                </p>
                <p className="text-gray-400 leading-relaxed mt-3">
                  As SynthX&apos;s official hosting partner, Hostzy offers exclusive discounts for SynthX users.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[["99.9%", "Uptime SLA"], ["24/7", "Support"], ["NVMe", "SSD Storage"], ["₹99", "Starting Price"]].map(([val, label]) => (
                  <div key={label} className="bg-white/5 rounded-xl p-4 text-center border border-white/10">
                    <div className="text-2xl font-black gradient-text">{val}</div>
                    <div className="text-sm text-gray-400 mt-1">{label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Links */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-14">
            {links.map(({ icon: Icon, title, desc, href, label, color }) => (
              <a
                key={title}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="gradient-border p-6 group hover:scale-[1.03] transition-all duration-300 block"
                style={{ background: "rgba(20,20,20,0.9)" }}
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <Icon size={22} className="text-white" />
                </div>
                <h3 className="font-bold text-white mb-2">{title}</h3>
                <p className="text-gray-400 text-sm mb-4">{desc}</p>
                <span className="text-sm font-semibold gradient-text">{label} →</span>
              </a>
            ))}
          </div>

          {/* Features */}
          <div className="text-center mb-10">
            <h2 className="text-3xl font-black mb-2">
              What You <span className="gradient-text">Get</span>
            </h2>
            <p className="text-gray-400">Everything you need to keep your bot online and performing at its best.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="gradient-border p-5" style={{ background: "rgba(20,20,20,0.9)" }}>
                <Icon size={24} className="text-orange-400 mb-3" />
                <h3 className="font-semibold text-white mb-2">{title}</h3>
                <p className="text-gray-400 text-sm">{desc}</p>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="text-center mt-16">
            <p className="text-gray-400 mb-4">Ready to get started? Choose a plan that suits your needs.</p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <a href="https://hostzy.in" target="_blank" rel="noopener noreferrer"
                className="btn-primary">
                View Plans
              </a>
              <a href="https://discord.gg/yQ4wyBDqYQ" target="_blank" rel="noopener noreferrer"
                className="btn-secondary">
                Contact Support
              </a>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
