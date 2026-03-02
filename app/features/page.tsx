import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import {
  Shield, Music, Star, Gift, Hash, Zap, Settings, Users,
  MessageSquare, Bell, Lock, Sparkles, Volume2, UserCheck,
  AlertTriangle, Eye, Bot, Gamepad2
} from "lucide-react";

const featureSections = [
  {
    category: "🛡️ Security & Anti-Nuke",
    color: "from-red-500 to-red-700",
    features: [
      { title: "Anti-Nuke", desc: "Detects and reverses mass ban, kick, channel deletion, role deletion, webhook creation and more. Bans malicious admins instantly." },
      { title: "Anti-Bot Add", desc: "Prevents unauthorized bot additions to your server." },
      { title: "Anti-Webhook", desc: "Blocks unauthorized webhook creation and deletes malicious webhooks automatically." },
      { title: "Anti-Member Update", desc: "Monitors and reverts unauthorized mass role changes." },
      { title: "Anti-Everyone Ping", desc: "Prevents abuse of @everyone and @here pings." },
      { title: "Whitelist System", desc: "Whitelist trusted users and bots to bypass anti-nuke protections." },
      { title: "Extra Owners", desc: "Add trusted users as extra owners with elevated SynthX permissions." },
      { title: "Anti-Blacklist", desc: "Automatically removes users on the blacklist from your server." },
    ],
  },
  {
    category: "⚡ Fortify (AI Security — Premium)",
    color: "from-purple-500 to-purple-700",
    features: [
      { title: "AI Threat Detection", desc: "Machine learning-powered behavioral analysis to detect raid and nuke attempts before they happen." },
      { title: "Security Cards", desc: "Visual security reports showing threat scores, incident timelines, and protection status." },
      { title: "Emergency Defense Mode", desc: "One-click emergency lockdown: locks all channels, revokes dangerous permissions, and stops raids." },
      { title: "Behavioral Analysis", desc: "Tracks patterns of suspicious behavior across all server actions in real-time." },
      { title: "Fortify Whitelist", desc: "Fine-grained whitelist system specifically for Fortify's AI detection layer." },
      { title: "Incident History", desc: "Full log of all detected threats, blocked actions, and security incidents." },
    ],
  },
  {
    category: "🤖 AutoMod",
    color: "from-orange-500 to-red-500",
    features: [
      { title: "Anti-Spam", desc: "Detects rapid message spam and automatically mutes or warns offenders." },
      { title: "Anti-Links", desc: "Blocks unauthorized links. Whitelists Spotify and GIF links automatically." },
      { title: "Anti-Invites", desc: "Prevents advertising of other Discord servers. Current server invites are bypassed." },
      { title: "Anti-Caps", desc: "Reduces messages with excessive capitalization (>70% caps, 45+ chars)." },
      { title: "Anti-Emoji Spam", desc: "Blocks messages with more than 5 emojis to prevent spam." },
      { title: "Anti-Mass Mention", desc: "Prevents mass @mentions (more than 4 in one message)." },
      { title: "Anti-NSFW Links", desc: "Automatically removes NSFW links from all channels." },
      { title: "Automod Logging", desc: "Logs all automod actions to a dedicated channel." },
    ],
  },
  {
    category: "🎵 Music",
    color: "from-green-500 to-emerald-600",
    features: [
      { title: "Play (Spotify & YouTube)", desc: "Play songs, playlists, and albums from Spotify, YouTube, and more with simple commands." },
      { title: "Queue Management", desc: "View, manage, and reorder the music queue. Skip, shuffle, and clear." },
      { title: "Loop Modes", desc: "Loop a single track, the entire queue, or disable looping." },
      { title: "Autoplay", desc: "Automatic recommendations keep the music going when the queue ends." },
      { title: "Volume & Seek", desc: "Precise volume control and track seeking to any position." },
      { title: "Interactive Controls", desc: "Beautiful music player with button controls directly in Discord." },
      { title: "Now Playing Card", desc: "Custom now playing card with progress bar and track info." },
      { title: "Persistent Voice", desc: "Bot stays in your voice channel and resumes playback seamlessly." },
    ],
  },
  {
    category: "📈 Leveling",
    color: "from-yellow-500 to-orange-500",
    features: [
      { title: "XP System", desc: "Members earn XP for chatting. Configurable XP rates and cooldowns." },
      { title: "Level Leaderboard", desc: "Server-wide leaderboard showing top members by XP and level." },
      { title: "Level-Up Messages", desc: "Custom congratulatory messages when members reach new levels." },
      { title: "Role Rewards", desc: "Automatically grant roles when members hit specific level milestones." },
      { title: "Custom Rank Cards", desc: "Beautiful visual rank cards showing progress and stats." },
      { title: "XP Management", desc: "Add, remove, or reset XP for individual members." },
    ],
  },
  {
    category: "🎁 Giveaways",
    color: "from-pink-500 to-red-500",
    features: [
      { title: "Start Giveaways", desc: "Launch giveaways with custom duration, winner count, and prize description." },
      { title: "Early End", desc: "End a giveaway early and pick winners immediately." },
      { title: "Reroll Winners", desc: "Re-pick winners if the original winner can't claim the prize." },
      { title: "Cancel Giveaways", desc: "Cancel an ongoing giveaway without picking winners." },
      { title: "Giveaway List", desc: "View all currently active giveaways in the server." },
    ],
  },
  {
    category: "👋 Welcome & Leave",
    color: "from-teal-500 to-cyan-600",
    features: [
      { title: "Welcome Messages", desc: "Custom welcome messages with rich embeds and variable support ({user}, {server_name}, etc)." },
      { title: "Leave Messages", desc: "Configurable farewell messages when members leave." },
      { title: "DM Greetings", desc: "Send a private welcome DM to new members." },
      { title: "Auto Role", desc: "Automatically assign roles when members join the server." },
      { title: "Fast Greet", desc: "Instant greeting with optional channel configuration." },
    ],
  },
  {
    category: "🔧 Moderation",
    color: "from-red-600 to-rose-700",
    features: [
      { title: "Ban / Unban", desc: "Ban and unban members with optional reason logging." },
      { title: "Kick", desc: "Remove members from the server." },
      { title: "Timeout / Unmute", desc: "Temporarily restrict members from interacting." },
      { title: "Warn System", desc: "Issue warnings to members and track their history." },
      { title: "Jail System", desc: "Restrict members to a jail channel with full history." },
      { title: "Lock / Unlock", desc: "Lock and unlock channels to stop messaging." },
      { title: "Hide / Unhide", desc: "Hide channels from @everyone visibility." },
      { title: "Purge / Snipe", desc: "Bulk delete messages and retrieve recently deleted messages." },
      { title: "Freeze Nick", desc: "Lock a member's nickname to prevent changes." },
      { title: "Role Management", desc: "Full role assignment and removal commands." },
    ],
  },
  {
    category: "📋 Logging",
    color: "from-indigo-500 to-purple-600",
    features: [
      { title: "Message Logs", desc: "Track message edits and deletions across all channels." },
      { title: "Member Logs", desc: "Log joins, leaves, bans, kicks, and role changes." },
      { title: "Channel Logs", desc: "Track channel creation, deletion, and modification." },
      { title: "Role Logs", desc: "Log role creation, deletion, and permission changes." },
      { title: "Voice Logs", desc: "Track voice channel joins, leaves, and moves." },
      { title: "Moderation Logs", desc: "Dedicated log for all moderation actions taken." },
    ],
  },
  {
    category: "🎮 Fun & Games",
    color: "from-violet-500 to-purple-600",
    features: [
      { title: "Chess", desc: "Play interactive Chess in Discord with full game logic." },
      { title: "Wordle", desc: "The classic word-guessing game, now in your server." },
      { title: "2048", desc: "The addictive 2048 tile puzzle game." },
      { title: "Battleship", desc: "Classic naval battle game." },
      { title: "Connect Four", desc: "Strategic 4-in-a-row game." },
      { title: "Tic Tac Toe / RPS", desc: "Quick classic games for members." },
      { title: "Truth or Dare", desc: "Fun party game commands." },
      { title: "Hug, Kiss, Slap", desc: "Anime-style interaction commands." },
    ],
  },
];

export default function FeaturesPage() {
  return (
    <main className="min-h-screen animated-bg">
      <Navbar />

      <div className="pt-24 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium mb-4">
              <Sparkles size={14} />
              Full Feature List
            </div>
            <h1 className="text-5xl font-black mb-4">
              SynthX <span className="gradient-text">Features</span>
            </h1>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Everything you need to run a professional Discord server — all in one bot.
            </p>
          </div>

          {/* Feature sections */}
          <div className="space-y-14">
            {featureSections.map((section) => (
              <div key={section.category}>
                <div className="flex items-center gap-3 mb-6">
                  <div className={`w-1 h-8 rounded-full bg-gradient-to-b ${section.color}`} />
                  <h2 className="text-2xl font-bold text-white">{section.category}</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {section.features.map((f) => (
                    <div
                      key={f.title}
                      className="gradient-border p-5 hover:scale-[1.02] transition-all duration-200"
                      style={{ background: "rgba(20,20,20,0.8)" }}
                    >
                      <h3 className="font-semibold text-white mb-2">{f.title}</h3>
                      <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
