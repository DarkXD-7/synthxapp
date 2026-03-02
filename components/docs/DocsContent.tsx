"use client";

import { useState } from "react";
import {
  Search, ChevronDown, ChevronUp,
  Shield, Music, Star, Settings, Users, Gamepad2, Zap,
  Gift, Bell, Lock, Hash, MessageSquare, Moon, Image, Bot,
} from "lucide-react";

interface Command {
  name: string;
  aliases?: string[];
  description: string;
  usage: string;
  permissions?: string;
  premium?: boolean;
}

interface Module {
  name: string;
  icon: React.ElementType;
  color: string;
  prefix: string;
  commands: Command[];
}

// ─────────────────────────────────────────────────────────────────────────────
// ALL COMMANDS ARE SOURCED FROM THE ACTUAL BOT COG FILES.
// Verified from: cogs/commands/, cogs/moderation/, cogs/fortify/commands.py
// No fake/placeholder commands included.
// ─────────────────────────────────────────────────────────────────────────────

const modules: Module[] = [
  // ── AntiNuke ─────────────────────────────────────────────────────────
  {
    name: "Anti-Nuke",
    icon: Shield,
    color: "text-red-400",
    prefix: "antinuke",
    commands: [
      {
        name: "antinuke",
        aliases: ["antiwizz", "anti"],
        description: "Enable or disable the Anti-Nuke system for your server.",
        usage: "antinuke [enable/disable]",
        permissions: "Server Owner / Extra Owner",
      },
      {
        name: "whitelist",
        aliases: ["wl"],
        description: "Add a user to the anti-nuke whitelist. Whitelisted users bypass Anti-Nuke protection.",
        usage: "whitelist <user>",
        permissions: "Server Owner / Extra Owner",
      },
      {
        name: "unwhitelist",
        aliases: ["unwl"],
        description: "Remove a user from the anti-nuke whitelist.",
        usage: "unwhitelist <user>",
        permissions: "Server Owner / Extra Owner",
      },
      {
        name: "whitelisted",
        aliases: ["wls"],
        description: "View all users currently on the anti-nuke whitelist.",
        usage: "whitelisted",
        permissions: "Server Owner / Extra Owner",
      },
      {
        name: "whitelistreset",
        description: "Reset and clear the entire anti-nuke whitelist.",
        usage: "whitelistreset",
        permissions: "Server Owner",
      },
      {
        name: "extraowner",
        aliases: ["eowner", "eo"],
        description: "Add or remove an extra owner for SynthX. Extra owners have elevated bot permissions.",
        usage: "extraowner <add/remove> <user>",
        permissions: "Server Owner",
      },
      {
        name: "owners",
        description: "List all extra owners configured for this server.",
        usage: "owners",
        permissions: "Server Owner",
      },
    ],
  },

  // ── Fortify AI (Premium) ─────────────────────────────────────────────────
  {
    name: "Fortify (Premium)",
    icon: Zap,
    color: "text-purple-400",
    prefix: "fortify",
    commands: [
      {
        name: "fortify",
        aliases: ["ft"],
        description: "Manage the Fortify AI security system. Shows all subcommands.",
        usage: "fortify",
        permissions: "Administrator",
        premium: true,
      },
      {
        name: "fortify enable",
        description: "Enable the Fortify AI security module for this server.",
        usage: "fortify enable",
        permissions: "Administrator",
        premium: true,
      },
      {
        name: "fortify disable",
        description: "Disable the Fortify AI security module.",
        usage: "fortify disable",
        permissions: "Administrator",
        premium: true,
      },
      {
        name: "fortify config",
        aliases: ["cfg", "settings"],
        description: "View and configure Fortify AI protection settings and thresholds.",
        usage: "fortify config",
        permissions: "Administrator",
        premium: true,
      },
      {
        name: "fortify whitelist",
        aliases: ["wl"],
        description: "Manage the Fortify whitelist — add or remove trusted users from AI checks.",
        usage: "fortify whitelist <add/remove/list> [user]",
        permissions: "Administrator",
        premium: true,
      },
      {
        name: "fortify audit",
        description: "View recent Fortify AI security audit log for this server.",
        usage: "fortify audit",
        permissions: "Administrator",
        premium: true,
      },
    ],
  },

  // ── Emergency ────────────────────────────────────────────────────────────
  {
    name: "Emergency",
    icon: Shield,
    color: "text-red-500",
    prefix: "emergency",
    commands: [
      {
        name: "emergencysituation",
        aliases: ["emergency-situation", "emgs"],
        description: "Emergency lockdown — disables dangerous permissions from all roles instantly.",
        usage: "emergencysituation",
        permissions: "Administrator",
      },
      {
        name: "emergencyrestore",
        aliases: ["emgrestore", "emgbackup"],
        description: "Restore all permissions backed up during an emergency lockdown.",
        usage: "emergencyrestore",
        permissions: "Administrator",
      },
    ],
  },

  // ── AutoMod ──────────────────────────────────────────────────────────────
  {
    name: "AutoMod",
    icon: Settings,
    color: "text-orange-400",
    prefix: "automod",
    commands: [
      {
        name: "automod",
        description: "Configure the AutoMod system — opens an interactive setup menu with anti-spam, anti-link, anti-caps, anti-invites, anti-mass-mention, anti-emoji-spam, and anti-NSFW link filters.",
        usage: "automod",
        permissions: "Administrator",
      },
    ],
  },

  // ── Moderation ───────────────────────────────────────────────────────────
  {
    name: "Moderation",
    icon: Lock,
    color: "text-rose-400",
    prefix: "mod",
    commands: [
      { name: "ban",          description: "Ban a member from the server.", usage: "ban <user> [reason]", permissions: "Ban Members" },
      { name: "unban",        description: "Unban a previously banned user.", usage: "unban <user_id> [reason]", permissions: "Ban Members" },
      { name: "kick",         description: "Kick a member from the server.", usage: "kick <user> [reason]", permissions: "Kick Members" },
      { name: "warn",         description: "Issue a warning to a member.", usage: "warn <user> [reason]", permissions: "Manage Messages" },
      { name: "clearwarns",   description: "Clear all warnings for a member.", usage: "clearwarns <user>", permissions: "Administrator" },
      { name: "jail",         description: "Restrict a member to the jail channel, removing all other roles.", usage: "jail <user> [reason]", permissions: "Administrator" },
      { name: "unjail",       description: "Release a member from jail and restore their roles.", usage: "unjail <user>", permissions: "Administrator" },
      { name: "jailhistory",  aliases: ["logs", "history"], description: "View a member's jail history.", usage: "jailhistory <user>", permissions: "Manage Members" },
      { name: "lock",         description: "Lock a channel to prevent members from sending messages.", usage: "lock [channel]", permissions: "Manage Channels" },
      { name: "unlock",       description: "Unlock a previously locked channel.", usage: "unlock [channel]", permissions: "Manage Channels" },
      { name: "lockall",      description: "Lock all channels in the server.", usage: "lockall", permissions: "Administrator" },
      { name: "unlockall",    description: "Unlock all channels in the server.", usage: "unlockall", permissions: "Administrator" },
      { name: "hide",         description: "Hide a channel from @everyone.", usage: "hide [channel]", permissions: "Manage Channels" },
      { name: "unhide",       description: "Unhide a hidden channel.", usage: "unhide [channel]", permissions: "Manage Channels" },
      { name: "hideall",      description: "Hide all channels from @everyone.", usage: "hideall", permissions: "Administrator" },
      { name: "unhideall",    description: "Unhide all channels.", usage: "unhideall", permissions: "Administrator" },
      { name: "clearmessage", aliases: ["purge", "clear"], description: "Bulk delete messages in a channel.", usage: "clearmessage <amount> [user]", permissions: "Manage Messages" },
      { name: "snipe",        description: "Retrieve the most recently deleted message in a channel.", usage: "snipe [channel]", permissions: "Manage Messages" },
      { name: "freezenick",   description: "Lock a member's nickname to prevent changes.", usage: "freezenick <user>", permissions: "Manage Nicknames" },
      { name: "unfreezenick", description: "Unlock a member's frozen nickname.", usage: "unfreezenick <user>", permissions: "Manage Nicknames" },
      { name: "nuke",         description: "Clone and delete a channel to clear all messages.", usage: "nuke [channel]", permissions: "Administrator" },
      { name: "slowmode",     description: "Set slowmode for a channel.", usage: "slowmode <seconds> [channel]", permissions: "Manage Channels" },
      { name: "unslowmode",   description: "Remove slowmode from a channel.", usage: "unslowmode [channel]", permissions: "Manage Channels" },
      { name: "nick",         description: "Change a member's nickname.", usage: "nick <user> [nickname]", permissions: "Manage Nicknames" },
      { name: "role",         description: "Add or remove a role from a member.", usage: "role <user> <role>", permissions: "Manage Roles" },
      { name: "removerole",   description: "Remove a role from a member.", usage: "removerole <user> <role>", permissions: "Manage Roles" },
      { name: "unbanall",     description: "Unban all banned users from the server.", usage: "unbanall", permissions: "Administrator" },
      { name: "purgebots",    description: "Purge messages from bots in a channel.", usage: "purgebots <amount>", permissions: "Manage Messages" },
      { name: "purgeuser",    description: "Purge messages from a specific user.", usage: "purgeuser <user> <amount>", permissions: "Manage Messages" },
      { name: "forcepurgebots", description: "Force-purge bot messages (bypasses some limits).", usage: "forcepurgebots <amount>", permissions: "Administrator" },
      { name: "forcepurgeuser", description: "Force-purge a user's messages.", usage: "forcepurgeuser <user> <amount>", permissions: "Administrator" },
      { name: "sanitize",     description: "Strip all roles from a member.", usage: "sanitize <user>", permissions: "Administrator" },
      { name: "ownerban",     description: "Force-ban a user (owner-level command).", usage: "ownerban <user_id>", permissions: "Server Owner" },
      { name: "ownerunban",   description: "Force-unban a user (owner-level command).", usage: "ownerunban <user_id>", permissions: "Server Owner" },
      { name: "globalunban",  description: "Unban a user globally across systems.", usage: "globalunban <user_id>", permissions: "Server Owner" },
      { name: "guildban",     description: "Ban a user from a specific guild context.", usage: "guildban <user>", permissions: "Administrator" },
      { name: "guildunban",   description: "Unban a user from a guild context.", usage: "guildunban <user_id>", permissions: "Administrator" },
      { name: "report",       description: "Report a member to server moderators.", usage: "report <user> <reason>", permissions: "None" },
      { name: "sticky",       description: "Create a sticky message in a channel.", usage: "sticky <message>", permissions: "Manage Messages" },
      { name: "warn",         description: "Warn a member.", usage: "warn <user> [reason]", permissions: "Manage Messages" },
    ],
  },

  // ── Welcome & Leave ──────────────────────────────────────────────────────
  {
    name: "Welcome & Leave",
    icon: Users,
    color: "text-teal-400",
    prefix: "greet",
    commands: [
      {
        name: "greet",
        description: "Main welcome system command group. Shows all greet subcommands.",
        usage: "greet",
        permissions: "None",
      },
      {
        name: "greet setup",
        description: "Interactively configure a welcome message for new members. Choose between simple text or embed.",
        usage: "greet setup",
        permissions: "Administrator",
      },
      {
        name: "greet channel",
        description: "Set or change the channel where welcome messages are sent.",
        usage: "greet channel",
        permissions: "Administrator",
      },
      {
        name: "greet test",
        description: "Send a test welcome message to preview the current configuration.",
        usage: "greet test",
        permissions: "Administrator",
      },
      {
        name: "greet config",
        aliases: ["view", "config"],
        description: "View the current welcome configuration for this server.",
        usage: "greet config",
        permissions: "Administrator",
      },
      {
        name: "greet reset",
        aliases: ["disable"],
        description: "Reset and delete the current welcome configuration.",
        usage: "greet reset",
        permissions: "Administrator",
      },
      {
        name: "fastgreet_add",
        description: "Add a fast greet configuration (instant DM greeting for new members).",
        usage: "fastgreet_add",
        permissions: "Manage Guild",
      },
      {
        name: "fastgreet_remove",
        description: "Remove a fast greet configuration.",
        usage: "fastgreet_remove",
        permissions: "Manage Guild",
      },
      {
        name: "fastgreet_list",
        description: "List all fast greet configurations.",
        usage: "fastgreet_list",
        permissions: "Manage Guild",
      },
    ],
  },

  // ── Auto Role ────────────────────────────────────────────────────────────
  {
    name: "Auto Role",
    icon: Users,
    color: "text-cyan-400",
    prefix: "autorole",
    commands: [
      {
        name: "autorole",
        aliases: ["ar"],
        description: "Configure automatic role assignment. Set roles to be given to humans and bots when they join.",
        usage: "autorole [role]",
        permissions: "Manage Roles",
      },
    ],
  },

  // ── Leveling ─────────────────────────────────────────────────────────────
  {
    name: "Leveling",
    icon: Star,
    color: "text-yellow-400",
    prefix: "level",
    commands: [
      {
        name: "level",
        description: "Leveling system group command. Shows leveling subcommands.",
        usage: "level",
        permissions: "None",
      },
      {
        name: "leaderboard",
        aliases: ["lb", "top"],
        description: "View the server XP / message leaderboard.",
        usage: "leaderboard [page]",
        permissions: "None",
      },
      {
        name: "messages",
        aliases: ["msg"],
        description: "View your message count or another member's.",
        usage: "messages [user]",
        permissions: "None",
      },
      {
        name: "addmessages",
        description: "Add messages/XP to a member (admin only).",
        usage: "addmessages <user> <amount>",
        permissions: "Administrator",
      },
      {
        name: "removemessages",
        description: "Remove messages/XP from a member (admin only).",
        usage: "removemessages <user> <amount>",
        permissions: "Administrator",
      },
      {
        name: "clearmessage",
        description: "Clear a member's message count (admin only).",
        usage: "clearmessage <user>",
        permissions: "Administrator",
      },
      {
        name: "setlevelrole",
        description: "Set a role to be awarded when a member reaches a specific level.",
        usage: "setlevelrole <level> <role>",
        permissions: "Administrator",
      },
      {
        name: "removelevelrole",
        description: "Remove a level role assignment.",
        usage: "removelevelrole <level>",
        permissions: "Administrator",
      },
      {
        name: "listlevelroles",
        description: "List all configured level roles.",
        usage: "listlevelroles",
        permissions: "Administrator",
      },
      {
        name: "resetxp",
        description: "Reset a user's XP to zero (admin only).",
        usage: "resetxp <user>",
        permissions: "Administrator",
      },
      {
        name: "setxp",
        description: "Set a user's XP to a specific value (admin only).",
        usage: "setxp <user> <amount>",
        permissions: "Administrator",
      },
      {
        name: "setlevel",
        description: "Set a user's level directly (admin only).",
        usage: "setlevel <user> <level>",
        permissions: "Administrator",
      },
    ],
  },

  // ── Giveaways ────────────────────────────────────────────────────────────
  {
    name: "Giveaways",
    icon: Gift,
    color: "text-pink-400",
    prefix: "giveaway",
    commands: [
      { name: "gstart",  description: "Start a new giveaway with a prize, duration, and number of winners.", usage: "gstart <duration> <winners> <prize>", permissions: "Manage Guild" },
      { name: "gend",    description: "End a giveaway early and pick winners immediately.", usage: "gend <message_id>", permissions: "Manage Guild" },
      { name: "greroll", description: "Reroll and pick new winners for an ended giveaway.", usage: "greroll <message_id>", permissions: "Manage Guild" },
      { name: "gcancel", description: "Cancel an active giveaway without picking winners.", usage: "gcancel <message_id>", permissions: "Manage Guild" },
      { name: "glist",   description: "List all currently active giveaways in this server.", usage: "glist", permissions: "Manage Guild" },
    ],
  },

  // ── Reaction Roles ───────────────────────────────────────────────────────
  {
    name: "Reaction Roles",
    icon: Hash,
    color: "text-blue-400",
    prefix: "rr",
    commands: [
      {
        name: "reactionroles",
        aliases: ["rradd", "createrr"],
        description: "Set up reaction role menus — creates dropdown or button-based role selection.",
        usage: "reactionroles",
        permissions: "Manage Roles",
      },
      {
        name: "slist",
        description: "View all reaction role setups configured in this server.",
        usage: "slist",
        permissions: "Manage Roles",
      },
    ],
  },

  // ── Logging ──────────────────────────────────────────────────────────────
  {
    name: "Logging",
    icon: Bell,
    color: "text-indigo-400",
    prefix: "logs",
    commands: [
      {
        name: "logs",
        description: "Configure the server logging system. Opens an interactive setup to assign channels for different log types (messages, mod actions, joins/leaves, voice, etc.).",
        usage: "logs",
        permissions: "Manage Guild",
      },
    ],
  },

  // ── Invite Tracker ───────────────────────────────────────────────────────
  {
    name: "Invite Tracker",
    icon: Users,
    color: "text-cyan-400",
    prefix: "invite",
    commands: [
      { name: "invites",       description: "Check how many invites you or another member has.", usage: "invites [user]", permissions: "None" },
      { name: "inviter",       description: "Check who invited a specific member.", usage: "inviter <user>", permissions: "None" },
      { name: "inviteinfo",    description: "View information about a specific invite code.", usage: "inviteinfo <code>", permissions: "None" },
      { name: "invited",       description: "View a list of members invited by a specific user.", usage: "invited [user]", permissions: "None" },
      { name: "addinvites",    description: "Manually add invite count to a member.", usage: "addinvites <user> <amount>", permissions: "Administrator" },
      { name: "removeinvites", description: "Manually remove invite count from a member.", usage: "removeinvites <user> <amount>", permissions: "Administrator" },
      { name: "clearinvites",  description: "Clear all invite data for a member or the whole server.", usage: "clearinvites [user]", permissions: "Administrator" },
      { name: "invites_reset", description: "Reset all invite data for the server.", usage: "invites_reset", permissions: "Administrator" },
    ],
  },

  // ── Ticket ───────────────────────────────────────────────────────────────
  {
    name: "Ticket",
    icon: MessageSquare,
    color: "text-yellow-400",
    prefix: "ticket",
    commands: [
      {
        name: "ticket",
        description: "Configure the ticket system — set up support ticket panels with buttons.",
        usage: "ticket",
        permissions: "Administrator",
      },
    ],
  },

  // ── Vanity Roles ────────────────────────────────────────────────────────
  {
    name: "Vanity",
    icon: Star,
    color: "text-orange-400",
    prefix: "vanity",
    commands: [
      {
        name: "vanityroles",
        description: "Configure vanity role rewards — automatically give roles to members who add the server's vanity URL to their status.",
        usage: "vanityroles",
        permissions: "Manage Guild",
      },
    ],
  },

  // ── Blacklist ────────────────────────────────────────────────────────────
  {
    name: "Blacklist",
    icon: Lock,
    color: "text-red-600",
    prefix: "blacklist",
    commands: [
      {
        name: "blacklist",
        description: "Manage the word blacklist system — ban certain words/phrases from being used.",
        usage: "blacklist <add/remove/list> [word]",
        permissions: "Administrator",
      },
      {
        name: "blacklistword",
        description: "Add a word to the blacklist filter.",
        usage: "blacklistword <word>",
        permissions: "Administrator",
      },
    ],
  },

  // ── Night Mode ───────────────────────────────────────────────────────────
  {
    name: "Night Mode",
    icon: Moon,
    color: "text-blue-300",
    prefix: "nightmode",
    commands: [
      {
        name: "nightmode",
        description: "Night Mode group command — strips dangerous permissions from roles to protect the server.",
        usage: "nightmode",
        permissions: "Administrator",
      },
      {
        name: "nightmode enable",
        description: "Enable Night Mode — strips dangerous permissions from all roles.",
        usage: "nightmode enable",
        permissions: "Administrator",
      },
      {
        name: "nightmode disable",
        description: "Disable Night Mode and restore original role permissions.",
        usage: "nightmode disable",
        permissions: "Administrator",
      },
    ],
  },

  // ── Voice ────────────────────────────────────────────────────────────────
  {
    name: "Voice",
    icon: Music,
    color: "text-green-400",
    prefix: "voice",
    commands: [
      {
        name: "voice",
        description: "Voice channel management group. Configure temporary/private voice channels.",
        usage: "voice",
        permissions: "None",
      },
      {
        name: "vcrole",
        aliases: ["vc"],
        description: "Set a role to be given to users when they join a specific voice channel.",
        usage: "vcrole <channel> <role>",
        permissions: "Manage Roles",
      },
      {
        name: "vcinfo",
        description: "View information about a voice channel.",
        usage: "vcinfo [channel]",
        permissions: "None",
      },
    ],
  },

  // ── Music ────────────────────────────────────────────────────────────────
  {
    name: "Music",
    icon: Music,
    color: "text-green-400",
    prefix: "music",
    commands: [
      { name: "play",       description: "Play a song or playlist by name or URL.", usage: "play <song or URL>", permissions: "None" },
      { name: "pause",      description: "Pause the currently playing track.", usage: "pause", permissions: "None" },
      { name: "resume",     description: "Resume a paused track.", usage: "resume", permissions: "None" },
      { name: "skip",       description: "Skip the current song.", usage: "skip", permissions: "None" },
      { name: "stop",       description: "Stop music and disconnect the bot.", usage: "stop", permissions: "None" },
      { name: "queue",      description: "View the current music queue.", usage: "queue [page]", permissions: "None" },
      { name: "nowplaying", aliases: ["np", "autonp"], description: "Show the currently playing song.", usage: "nowplaying", permissions: "None" },
      { name: "volume",     description: "Set the playback volume (0–100).", usage: "volume <0-100>", permissions: "None" },
      { name: "loop",       description: "Toggle loop mode: off, track, or queue.", usage: "loop [track/queue/off]", permissions: "None" },
      { name: "shuffle",    description: "Shuffle the music queue.", usage: "shuffle", permissions: "None" },
      { name: "seek",       description: "Seek to a position in the current track.", usage: "seek <time>", permissions: "None" },
      { name: "replay",     description: "Replay the current track from the beginning.", usage: "replay", permissions: "None" },
      { name: "clearqueue", aliases: ["cq"], description: "Clear the entire music queue.", usage: "clearqueue", permissions: "Manage Messages" },
      { name: "autoplay",   description: "Toggle autoplay — auto-add similar tracks when queue is empty.", usage: "autoplay", permissions: "None" },
    ],
  },

  // ── General / Utility ───────────────────────────────────────────────────
  {
    name: "Utility",
    icon: Bot,
    color: "text-gray-400",
    prefix: "util",
    commands: [
      { name: "ping",       description: "Check the bot's latency and API response time.", usage: "ping", permissions: "None" },
      { name: "uptime",     description: "Check how long the bot has been online.", usage: "uptime", permissions: "None" },
      { name: "invite",     description: "Get the bot's invite link.", usage: "invite", permissions: "None" },
      { name: "botinvite",  description: "Get an invite link to add SynthX to a server.", usage: "botinvite", permissions: "None" },
      { name: "userinfo",   description: "View information about a user.", usage: "userinfo [user]", permissions: "None" },
      { name: "guildinfo",  aliases: ["serverinfo"], description: "View detailed information about this server.", usage: "guildinfo", permissions: "None" },
      { name: "membercount",description: "Check the current member count of the server.", usage: "membercount", permissions: "None" },
      { name: "permissions",description: "View a member's permissions in a channel.", usage: "permissions [user] [channel]", permissions: "None" },
      { name: "channelinfo",description: "View information about a channel.", usage: "channelinfo [channel]", permissions: "None" },
      { name: "roleinfo",   description: "View information about a role.", usage: "roleinfo <role>", permissions: "None" },
      { name: "banner",     description: "View a user's banner.", usage: "banner [user]", permissions: "None" },
      { name: "joined-at",  description: "Check when a member joined this server.", usage: "joined-at [user]", permissions: "None" },
      { name: "mutuals",    description: "Find mutual servers between you and another user.", usage: "mutuals <user>", permissions: "None" },
      { name: "boostcount", description: "View the server's current boost count and level.", usage: "boostcount", permissions: "None" },
      { name: "translate",  aliases: ["tl"], description: "Translate text to a specified language.", usage: "translate <language> <text>", permissions: "None" },
      { name: "poll",       description: "Create a simple yes/no poll.", usage: "poll <question>", permissions: "None" },
      { name: "timer",      description: "Set a reminder timer.", usage: "timer <duration> <message>", permissions: "None" },
      { name: "afk",        description: "Set an AFK status with an optional message.", usage: "afk [reason]", permissions: "None" },
      { name: "iplookup",   aliases: ["ip"], description: "Look up information about an IP address.", usage: "iplookup <ip>", permissions: "None" },
      { name: "github",     description: "Look up a GitHub user or repository.", usage: "github <user/repo>", permissions: "None" },
      { name: "hash",       description: "Generate a hash of text.", usage: "hash <text>", permissions: "None" },
      { name: "say",        description: "Make the bot say something in a channel.", usage: "say <message>", permissions: "Manage Messages" },
      { name: "embed",      description: "Create and send a custom embed message.", usage: "embed", permissions: "Manage Messages" },
      { name: "webhook",    description: "Create or manage webhooks.", usage: "webhook", permissions: "Manage Webhooks" },
      { name: "ignore",     description: "Ignore a channel or user from bot commands.", usage: "ignore <channel/user>", permissions: "Administrator" },
      { name: "blacklist",  description: "Blacklist a user from using the bot.", usage: "blacklist <user>", permissions: "Administrator" },
      { name: "serverclone",description: "Clone the server structure to another server.", usage: "serverclone", permissions: "Administrator" },
      { name: "premium",    description: "View your premium status.", usage: "premium", permissions: "None" },
    ],
  },

  // ── Fun ──────────────────────────────────────────────────────────────────
  {
    name: "Fun",
    icon: Gamepad2,
    color: "text-yellow-400",
    prefix: "fun",
    commands: [
      { name: "8ball",       aliases: ["8b"], description: "Ask the magic 8-ball a yes/no question.", usage: "8ball <question>", permissions: "None" },
      { name: "dare",        aliases: ["d"],  description: "Get a random dare.", usage: "dare", permissions: "None" },
      { name: "truth",       aliases: ["t"],  description: "Get a random truth question.", usage: "truth", permissions: "None" },
      { name: "hack",        description: "Fake hack a user (for fun).", usage: "hack <user>", permissions: "None" },
      { name: "fakeban",     aliases: ["fban"], description: "Send a fake ban message (for fun).", usage: "fakeban <user>", permissions: "None" },
      { name: "rickroll",    description: "Rickroll someone.", usage: "rickroll [user]", permissions: "None" },
      { name: "wizz",        description: "Send a wizzed invite link.", usage: "wizz", permissions: "None" },
      { name: "nitro",       description: "Send a fake Nitro gift (for fun).", usage: "nitro [user]", permissions: "None" },
      { name: "token",       description: "Generate a fake Discord token (for fun).", usage: "token", permissions: "None" },
      { name: "howgay",      aliases: ["gay"], description: "Find out how gay someone is (fun percentage).", usage: "howgay [user]", permissions: "None" },
      { name: "howcool",     aliases: ["cool", "coolness"], description: "Find out how cool someone is.", usage: "howcool [user]", permissions: "None" },
      { name: "hot",         aliases: ["howhot", "hottness"], description: "Rate how hot someone is.", usage: "hot [user]", permissions: "None" },
      { name: "pp",          aliases: ["penissize"], description: "Check pp size (fun command).", usage: "pp [user]", permissions: "None" },
      { name: "intelligence", aliases: ["iq"], description: "Check someone's IQ (fun command).", usage: "intelligence [user]", permissions: "None" },
      { name: "couple",      aliases: ["frnd"], description: "Ship two users together.", usage: "couple <user1> [user2]", permissions: "None" },
      { name: "poll",        description: "Create a quick poll.", usage: "poll <question>", permissions: "None" },
      { name: "hug",         description: "Hug a user.", usage: "hug <user>", permissions: "None" },
      { name: "kiss",        description: "Kiss a user.", usage: "kiss <user>", permissions: "None" },
      { name: "slap",        description: "Slap a user.", usage: "slap <user>", permissions: "None" },
      { name: "pat",         description: "Pat a user.", usage: "pat <user>", permissions: "None" },
      { name: "bite",        description: "Bite a user.", usage: "bite <user>", permissions: "None" },
      { name: "poke",        description: "Poke a user.", usage: "poke <user>", permissions: "None" },
      { name: "tickle",      description: "Tickle a user.", usage: "tickle <user>", permissions: "None" },
      { name: "cuddle",      description: "Cuddle a user.", usage: "cuddle <user>", permissions: "None" },
      { name: "dance",       description: "Dance!", usage: "dance", permissions: "None" },
      { name: "cry",         description: "Cry.", usage: "cry", permissions: "None" },
      { name: "highfive",    description: "High-five a user.", usage: "highfive <user>", permissions: "None" },
      { name: "kill",        description: "Kill a user (fun).", usage: "kill <user>", permissions: "None" },
      { name: "spank",       description: "Spank a user.", usage: "spank <user>", permissions: "None" },
    ],
  },

  // ── Image / Media ────────────────────────────────────────────────────────
  {
    name: "Minecraft Status",
    icon: Image,
    color: "text-purple-400",
    prefix: "status",
    commands: [
      { name: "status help", description: "Full status help embed guide.", usage: "status help", permissions: "None" },
      { name: "status setip", description: "setup server ip port.", usage: "status setip [ip]", permissions: "Administration" },
      { name: "status channel",     description: "Setup Status Updating Channel.", usage: "status channel [#ch]", permissions: "Administration" },
      { name: "status motd ",   description: "Toggle Image in embed.", usage: "status motd [on/off]", permissions: "Administration" },
      { name: "status refresh",     description: "Setup Status refresh rate", usage: "status refresh [sec]", permissions: "Administration" },
      { name: "status",    description: "Get the server status", usage: "status", permissions: "None" },
    ],
  },

  // ── Games ────────────────────────────────────────────────────────────────
  {
    name: "Games",
    icon: Gamepad2,
    color: "text-green-400",
    prefix: "games",
    commands: [
      { name: "tic-tac-toe",    description: "Play tic-tac-toe with another member.", usage: "tic-tac-toe <user>", permissions: "None" },
      { name: "connectfour",    description: "Play Connect Four with another member.", usage: "connectfour <user>", permissions: "None" },
      { name: "battleship",     description: "Play Battleship.", usage: "battleship <user>", permissions: "None" },
      { name: "chess",          description: "Play chess with another member.", usage: "chess <user>", permissions: "None" },
      { name: "rps",            description: "Play Rock Paper Scissors.", usage: "rps <rock/paper/scissors>", permissions: "None" },
      { name: "wordle",         description: "Play Wordle.", usage: "wordle", permissions: "None" },
      { name: "2048",           description: "Play 2048.", usage: "2048", permissions: "None" },
      { name: "memory-game",    description: "Play a memory matching game.", usage: "memory-game", permissions: "None" },
      { name: "lights-out",     description: "Play Lights Out puzzle.", usage: "lights-out", permissions: "None" },
      { name: "number-slider",  description: "Play the number sliding puzzle.", usage: "number-slider", permissions: "None" },
      { name: "country-guesser",description: "Guess the country from a flag or map.", usage: "country-guesser", permissions: "None" },
      { name: "map",            description: "Country map game.", usage: "map", permissions: "None" },
    ],
  },
];

// ─────────────────────────────────────────────────────────────────────────────

interface AccordionProps {
  module: Module;
  searchQuery: string;
}

function ModuleAccordion({ module, searchQuery }: AccordionProps) {
  const [open, setOpen] = useState(false);

  const filteredCommands = module.commands.filter(
    (cmd) =>
      cmd.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cmd.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (cmd.aliases || []).some((a) => a.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  if (searchQuery && filteredCommands.length === 0) return null;

  const displayCommands = searchQuery ? filteredCommands : module.commands;

  return (
    <div className="gradient-border rounded-2xl overflow-hidden" style={{ background: "rgba(15,15,15,0.95)" }}>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-5 hover:bg-white/2 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
            <module.icon size={20} className={module.color} />
          </div>
          <div className="text-left">
            <h3 className="font-bold text-white">{module.name}</h3>
            <p className="text-xs text-gray-500">
              {displayCommands.length} command{displayCommands.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>
        {open ? <ChevronUp size={18} className="text-gray-400" /> : <ChevronDown size={18} className="text-gray-400" />}
      </button>

      {(open || searchQuery) && (
        <div className="border-t border-white/5 divide-y divide-white/5">
          {displayCommands.map((cmd) => (
            <div key={cmd.name} className="p-4 hover:bg-white/2 transition-colors">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <code className="text-red-400 font-bold text-sm bg-red-500/10 px-2 py-0.5 rounded">
                      {cmd.name}
                    </code>
                    {cmd.aliases?.map((alias) => (
                      <code key={alias} className="text-gray-500 text-xs bg-white/5 px-2 py-0.5 rounded">
                        {alias}
                      </code>
                    ))}
                    {cmd.premium && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-400 border border-purple-500/20">
                        ✦ Premium
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-400 leading-relaxed">{cmd.description}</p>
                </div>
                <div className="flex flex-col items-end gap-1 min-w-fit">
                  <code className="text-xs text-gray-500 bg-black/40 px-2 py-1 rounded whitespace-nowrap">
                    {module.prefix === "fun" || module.prefix === "util" || module.prefix === "games" || module.prefix === "image"
                      ? cmd.usage
                      : cmd.usage}
                  </code>
                  {cmd.permissions && (
                    <span className="text-xs text-gray-600 whitespace-nowrap">{cmd.permissions}</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function DocsContent() {
  const [searchQuery, setSearchQuery] = useState("");

  const totalCommands = modules.reduce((acc, m) => acc + m.commands.length, 0);

  return (
    <div>
      {/* Search */}
      <div className="relative max-w-lg mx-auto mb-10">
        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search commands…"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-[#141414] border border-white/10 rounded-xl pl-11 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-red-500/50 transition-colors"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
          >
            ✕
          </button>
        )}
      </div>

      {/* Stats */}
      <div className="text-center text-sm text-gray-500 mb-8">
        <span className="text-white font-bold">{totalCommands}</span> verified commands across{" "}
        <span className="text-white font-bold">{modules.length}</span> modules
      </div>

      {/* Modules */}
      <div className="space-y-4">
        {modules.map((module) => (
          <ModuleAccordion key={module.name} module={module} searchQuery={searchQuery} />
        ))}
      </div>
    </div>
  );
}
