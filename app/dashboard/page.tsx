"use client";

import { useEffect, useState } from "react";
import { useSession, signIn } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/layout/Navbar";
import { Plus, Loader2, Lock, ExternalLink, AlertCircle, Sparkles } from "lucide-react";

interface Guild {
  id: string;
  name: string;
  icon: string | null;
  botPresent: boolean;
  permissions: string;
}

function GuildAvatar({ guild }: { guild: Guild }) {
  if (!guild.icon) {
    return (
      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 via-violet-500 to-purple-700 flex items-center justify-center text-white text-xl font-bold flex-shrink-0 shadow-lg animate-fade-in">
        {guild.name.charAt(0).toUpperCase()}
      </div>
    );
  }
  const ext = guild.icon.startsWith("a_") ? "gif" : "png";
  return (
    <img
      src={`https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.${ext}?size=128`}
      alt={guild.name}
      className="w-14 h-14 rounded-2xl object-cover flex-shrink-0 shadow-lg animate-fade-in"
    />
  );
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const [guilds, setGuilds] = useState<Guild[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (session) {
      fetch("/api/guilds")
        .then((r) => {
          if (!r.ok) throw new Error("Failed to fetch guilds");
          return r.json();
        })
        .then((data) => {
          if (Array.isArray(data)) setGuilds(data);
          else throw new Error("Invalid data format");
        })
        .catch((err) => setError(err.message))
        .finally(() => setLoading(false));
    } else if (status !== "loading") {
      setLoading(false);
    }
  }, [session, status]);

  if (status === "loading" || (loading && session)) {
    return (
      <div className="min-h-screen page-bg flex items-center justify-center">
        <div className="text-center animate-fade-in">
          <div className="w-12 h-12 mx-auto mb-4 relative">
            <Image src="/bot-logo.png" alt="SynthX" fill className="object-contain" />
          </div>
          <Loader2 size={28} className="animate-spin text-purple-500 mx-auto mb-3" />
          <p className="text-gray-300 text-sm">Loading servers…</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen page-bg flex items-center justify-center px-4">
        <div className="text-center max-w-sm animate-scale-in">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500/30 to-violet-500/30 border border-purple-500/50 flex items-center justify-center mx-auto mb-5 backdrop-blur">
            <Lock size={36} className="text-purple-300 animate-glow" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-3 font-display">Sign in required</h1>
          <p className="text-gray-300 text-base mb-8">Sign in with Discord to manage your servers and access the dashboard.</p>
          <button onClick={() => signIn("discord")} className="btn-primary px-8 py-4 text-lg">
            <Sparkles size={20} /> Login with Discord
          </button>
        </div>
      </div>
    );
  }

  const botGuilds   = guilds.filter((g) => g.botPresent);
  const otherGuilds = guilds.filter((g) => !g.botPresent);

  return (
    <main className="page-bg-subtle min-h-screen relative">
      <Navbar />
      <div className="pt-24 pb-20 px-4 relative z-10">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="mb-14 pt-6 animate-fade-in">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-300 via-violet-300 to-purple-300 bg-clip-text text-transparent mb-3 font-display">Your Servers</h1>
            <p className="text-gray-300 text-lg">
              Manage servers where you have <strong className="text-purple-300">Manage Server</strong> permission.
            </p>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="mb-8 info-blue border-purple-500/50 animate-slide-up">
              <div className="flex items-start gap-3">
                <AlertCircle size={20} className="flex-shrink-0 mt-0.5 text-purple-400" />
                <div>
                  <p className="font-semibold text-white">Error loading servers</p>
                  <p className="text-sm opacity-90 text-purple-100">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Bot present */}
          {botGuilds.length > 0 && (
            <div className="mb-14 animate-slide-up" style={{ animationDelay: "0.1s" }}>
              <p className="text-xs font-bold text-purple-300 uppercase tracking-wider mb-5 flex items-center gap-2">
                <Sparkles size={16} /> SynthX Active
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {botGuilds.map((guild, idx) => (
                  <Link
                    key={guild.id}
                    href={`/dashboard/${guild.id}`}
                    className="card-hover p-6 flex items-center gap-4 group"
                    style={{ animation: `fadeIn 0.5s ${0.15 + idx * 0.08}s ease both` }}
                  >
                    <GuildAvatar guild={guild} />
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-white text-base truncate group-hover:text-purple-200 transition-colors">{guild.name}</p>
                      <span className="pill pill-purple mt-2 inline-block">✓ Active</span>
                    </div>
                    <ExternalLink size={18} className="text-gray-500 flex-shrink-0 group-hover:text-purple-400 transition-all group-hover:translate-x-1" />
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* No bot */}
          {otherGuilds.length > 0 && (
            <div className="animate-slide-up" style={{ animationDelay: "0.2s" }}>
              <p className="text-xs font-bold text-violet-300 uppercase tracking-wider mb-5 flex items-center gap-2">
                <Plus size={16} /> Add SynthX
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {otherGuilds.map((guild, idx) => (
                  <a
                    key={guild.id}
                    href={`https://discord.com/oauth2/authorize?client_id=${process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID}&permissions=8&scope=bot%20applications.commands&guild_id=${guild.id}`}
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="card-hover p-6 flex items-center gap-4 opacity-70 hover:opacity-100 group transition-all"
                    style={{ animation: `fadeIn 0.5s ${0.25 + idx * 0.08}s ease both` }}
                  >
                    <GuildAvatar guild={guild} />
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-white text-base truncate group-hover:text-violet-300 transition-colors">{guild.name}</p>
                      <span className="pill pill-gray mt-2 inline-flex items-center gap-1 group-hover:bg-purple-500/20 transition-all">
                        <Plus size={12} /> Add Bot
                      </span>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Empty state */}
          {guilds.length === 0 && !loading && !error && (
            <div className="text-center py-28 animate-fade-in">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-500/20 to-violet-500/20 flex items-center justify-center mx-auto mb-8 animate-float">
                <Lock size={40} className="text-purple-400" />
              </div>
              <p className="text-gray-300 mb-4 text-2xl font-semibold">No servers found</p>
              <p className="text-gray-500 text-base">Make sure you have Manage Server permission in the servers.</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
