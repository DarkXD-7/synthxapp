"use client";

import { useEffect, useState } from "react";
import { useSession, signIn } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/layout/Navbar";
import { Plus, Loader2, Lock, ExternalLink } from "lucide-react";

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
      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center text-white text-xl font-bold flex-shrink-0">
        {guild.name.charAt(0).toUpperCase()}
      </div>
    );
  }
  const ext = guild.icon.startsWith("a_") ? "gif" : "png";
  return (
    <img
      src={`https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.${ext}?size=128`}
      alt={guild.name}
      className="w-14 h-14 rounded-2xl object-cover flex-shrink-0"
    />
  );
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const [guilds, setGuilds] = useState<Guild[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session) {
      fetch("/api/guilds")
        .then((r) => r.json())
        .then((data) => { if (Array.isArray(data)) setGuilds(data); })
        .finally(() => setLoading(false));
    } else if (status !== "loading") {
      setLoading(false);
    }
  }, [session, status]);

  if (status === "loading" || (loading && session)) {
    return (
      <div className="min-h-screen page-bg flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 mx-auto mb-4 relative">
            <Image src="/bot-logo.png" alt="SynthX" fill className="object-contain" />
          </div>
          <Loader2 size={18} className="animate-spin text-red-500 mx-auto mb-3" />
          <p className="text-gray-500 text-sm">Loading servers…</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen page-bg flex items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <div className="w-16 h-16 rounded-2xl bg-[#0f0f0f] border border-[#1e1e1e] flex items-center justify-center mx-auto mb-5">
            <Lock size={28} className="text-gray-500" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Sign in required</h1>
          <p className="text-gray-500 text-sm mb-8">Sign in with Discord to manage your servers.</p>
          <button onClick={() => signIn("discord")} className="btn-primary px-8 py-3">
            Login with Discord
          </button>
        </div>
      </div>
    );
  }

  const botGuilds   = guilds.filter((g) => g.botPresent);
  const otherGuilds = guilds.filter((g) => !g.botPresent);

  return (
    <main className="page-bg-subtle">
      <Navbar />
      <div className="pt-20 pb-16 px-4">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="mb-10 pt-6">
            <h1 className="text-3xl font-bold text-white mb-1">Your Servers</h1>
            <p className="text-gray-500 text-sm">
              Servers where you have <strong className="text-gray-300">Manage Server</strong> permission.
            </p>
          </div>

          {/* Bot present */}
          {botGuilds.length > 0 && (
            <div className="mb-10">
              <p className="text-xs font-semibold text-gray-600 uppercase tracking-widest mb-3">SynthX active</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {botGuilds.map((guild) => (
                  <Link
                    key={guild.id}
                    href={`/dashboard/${guild.id}`}
                    className="card-hover p-4 flex items-center gap-4"
                  >
                    <GuildAvatar guild={guild} />
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-white text-sm truncate">{guild.name}</p>
                      <span className="pill pill-green mt-1">Active</span>
                    </div>
                    <ExternalLink size={14} className="text-gray-600 flex-shrink-0" />
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* No bot */}
          {otherGuilds.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-gray-600 uppercase tracking-widest mb-3">Add SynthX</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {otherGuilds.map((guild) => (
                  <a
                    key={guild.id}
                    href={`https://discord.com/oauth2/authorize?client_id=${process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID}&permissions=8&scope=bot%20applications.commands&guild_id=${guild.id}`}
                    target="_blank" rel="noopener noreferrer"
                    className="card-hover p-4 flex items-center gap-4 opacity-60 hover:opacity-100"
                  >
                    <GuildAvatar guild={guild} />
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-white text-sm truncate">{guild.name}</p>
                      <span className="pill pill-gray mt-1 flex items-center gap-1" style={{width:"fit-content"}}>
                        <Plus size={9} /> Add Bot
                      </span>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}

          {guilds.length === 0 && !loading && (
            <div className="text-center py-20">
              <p className="text-gray-600 mb-2">No servers found.</p>
              <p className="text-gray-700 text-sm">Make sure you have Manage Server permission.</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
