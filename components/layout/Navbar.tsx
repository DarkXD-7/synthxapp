"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSession, signIn, signOut } from "next-auth/react";
import { Menu, X, ChevronDown } from "lucide-react";

export default function Navbar() {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const links = [
    { href: "/", label: "Home" },
    { href: "/features", label: "Features" },
    { href: "/docs", label: "Docs" },
    { href: "/hosting", label: "Hosting" },
    { href: "/support", label: "Support" },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-[#080808]/95 backdrop-blur-md border-b border-[#1e1e1e]" : "bg-transparent"}`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="relative w-8 h-8 group-hover:scale-105 transition-transform duration-200">
              <Image src="/bot-logo.png" alt="SynthX" fill className="object-contain rounded-lg" priority />
            </div>
            <span className="font-display font-bold text-base gradient-text tracking-wide">SynthX</span>
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-0.5">
            {links.map((l) => (
              <Link key={l.href} href={l.href} className="px-3.5 py-2 text-sm text-gray-400 hover:text-white rounded-lg hover:bg-white/4 transition-colors">
                {l.label}
              </Link>
            ))}
          </div>

          {/* Auth */}
          <div className="hidden md:flex items-center gap-2">
            {session ? (
              <div className="flex items-center gap-2">
                <Link href="/dashboard" className="btn-primary text-sm">Dashboard</Link>
                <div className="relative group">
                  <button className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-white/5 transition-colors">
                    {session.user?.image && (
                      <img src={session.user.image} alt="avatar" className="w-6 h-6 rounded-full" />
                    )}
                    <span className="text-sm text-gray-300 max-w-[100px] truncate">{session.user?.name}</span>
                    <ChevronDown size={12} className="text-gray-600" />
                  </button>
                  <div className="absolute right-0 top-full mt-1 w-36 bg-[#0f0f0f] border border-[#1e1e1e] rounded-xl shadow-2xl opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-opacity overflow-hidden">
                    <Link href="/dashboard" className="block px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-white/4 transition-colors">Dashboard</Link>
                    <button onClick={() => signOut()} className="block w-full text-left px-4 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-white/4 transition-colors">Sign Out</button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button onClick={() => signIn("discord")} className="btn-secondary text-sm">Login</button>
                <a
                  href={`https://discord.com/oauth2/authorize?client_id=${process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID}&permissions=8&scope=bot%20applications.commands`}
                  target="_blank" rel="noopener noreferrer"
                  className="btn-primary text-sm"
                >
                  Invite Bot
                </a>
              </div>
            )}
          </div>

          {/* Mobile toggle */}
          <button className="md:hidden p-2 rounded-lg hover:bg-white/5 text-gray-400" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <div className="md:hidden bg-[#0f0f0f] border border-[#1e1e1e] rounded-xl mt-2 p-3 mb-3">
            {links.map((l) => (
              <Link key={l.href} href={l.href} onClick={() => setIsOpen(false)}
                className="block px-4 py-3 text-sm text-gray-400 hover:text-white hover:bg-white/4 rounded-lg transition-colors">
                {l.label}
              </Link>
            ))}
            <div className="mt-2 pt-2 border-t border-[#1e1e1e] flex flex-col gap-2">
              {session ? (
                <>
                  <Link href="/dashboard" onClick={() => setIsOpen(false)} className="btn-primary text-sm text-center">Dashboard</Link>
                  <button onClick={() => signOut()} className="text-sm text-red-400 text-center py-2">Sign Out</button>
                </>
              ) : (
                <>
                  <button onClick={() => signIn("discord")} className="btn-secondary text-sm text-center">Login with Discord</button>
                  <a
                    href={`https://discord.com/oauth2/authorize?client_id=${process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID}&permissions=8&scope=bot%20applications.commands`}
                    target="_blank" rel="noopener noreferrer"
                    className="btn-primary text-sm text-center"
                  >
                    Invite Bot
                  </a>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
