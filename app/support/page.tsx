import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Image from "next/image";
import { Book, Users } from "lucide-react";

export default function SupportPage() {
  const options = [
    {
      // Custom icon — put your image at public/icons/discord.png
      iconImg: "/discord.png",
      title: "SynthX Development",
      desc: "Join our community server for real-time support from staff and the community.",
      href: "https://discord.gg/WKX5HHPmWz",
      label: "Join Server",
      color: "from-[#5865F2] to-[#4752C4]",
    },
    {
      iconImg: null, // uses lucide icon fallback below
      title: "Documentation",
      desc: "Browse the full command documentation and feature guides.",
      href: "/docs",
      label: "Read Docs",
      color: "from-red-500 to-orange-500",
    },
    {
      // Custom icon — put your image at public/icons/hostzy.png
      iconImg: "/hostzy.png",
      title: "Hostzy Support",
      desc: "Need help with hosting? Contact our hosting partner Hostzy.",
      href: "https://discord.gg/yQ4wyBDqYQ",
      label: "Hostzy Discord",
      color: "from-orange-500 to-yellow-500",
    },
  ];

  const faqs = [
    { q: "How do I invite SynthX to my server?", a: "Click the 'Invite Bot' button in the navbar or hero section. You'll need Manage Server permissions in the server you want to add it to." },
    { q: "What prefix does SynthX use?", a: "SynthX uses / (slash commands) and supports a configurable text prefix. The default prefix is configurable through the dashboard or bot settings." },
    { q: "How do I access premium features?", a: "Premium features require a premium subscription. Join our support server and check the #premium channel for pricing and details." },
    { q: "How do I set up Anti-Nuke?", a: "Use the command 'antinuke enable' (server owner only). Then whitelist trusted admins using 'whitelist @user'. You can also configure it from the dashboard." },
    { q: "Why isn't my music working?", a: "Music requires the bot to be in a voice channel. Make sure the bot has the Connect and Speak permissions. If issues persist, join our support server." },
    { q: "Can I configure everything through the dashboard?", a: "Yes! The web dashboard lets you configure Anti-Nuke, AutoMod, Welcome, Logging, Giveaways, Reaction Roles, and more without using any commands." },
    { q: "How do I report a bug?", a: "Use the 'report' command in Discord, or open a ticket in our support server. Please include steps to reproduce the issue." },
    { q: "Is there a free tier?", a: "Yes, SynthX is free to use with all core features. Premium unlocks advanced features like Leveling, custom bot appearance, and more." },
  ];

  return (
    <main className="min-h-screen animated-bg">
      <Navbar />

      <div className="pt-24 pb-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium mb-4">
              <Users size={14} />
              We&apos;re Here to Help
            </div>
            <h1 className="text-5xl font-black mb-4">
              Get <span className="gradient-text">Support</span>
            </h1>
            <p className="text-gray-400 text-lg max-w-xl mx-auto">
              Choose the best way to get help with SynthX.
            </p>
          </div>

          {/* Options */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-16">
            {options.map(({ iconImg, title, desc, href, label, color }) => (
              <a
                key={title}
                href={href}
                target={href.startsWith("http") ? "_blank" : undefined}
                rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                className="gradient-border p-6 group hover:scale-[1.03] transition-all duration-300 block text-center"
                style={{ background: "rgba(20,20,20,0.9)" }}
              >
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform overflow-hidden`}>
                  {iconImg ? (
                    <Image
                      src={iconImg}
                      alt={title}
                      width={32}
                      height={32}
                      className="object-contain"
                    />
                  ) : (
                    <Book size={26} className="text-white" />
                  )}
                </div>
                <h3 className="font-bold text-white mb-2">{title}</h3>
                <p className="text-gray-400 text-sm mb-4">{desc}</p>
                <span className="text-sm font-semibold gradient-text">{label} →</span>
              </a>
            ))}
          </div>

          {/* FAQ */}
          <div>
            <h2 className="text-3xl font-black text-center mb-8">
              Frequently Asked <span className="gradient-text">Questions</span>
            </h2>
            <div className="space-y-3">
              {faqs.map(({ q, a }) => (
                <div key={q} className="gradient-border p-5" style={{ background: "rgba(20,20,20,0.9)" }}>
                  <h3 className="font-semibold text-white mb-2">{q}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{a}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom CTA */}
          <div className="text-center mt-12">
            <p className="text-gray-400 mb-4">Still need help? Join our community!</p>
            <a
              href="https://discord.gg/WKX5HHPmWz"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-white transition-all duration-300 hover:scale-105"
              style={{ background: "linear-gradient(135deg, #ef1515, #f97316)" }}
            >
              <Image src="/icons/discord.png" alt="Discord" width={20} height={20} className="object-contain" />
              Join Support Server
            </a>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
