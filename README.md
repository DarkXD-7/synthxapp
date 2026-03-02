# SynthX Dashboard

> Production-ready Next.js dashboard and website for the SynthX Discord bot.

Dark-themed, red/orange gradient dashboard with full bot configuration panels built from the actual SynthX codebase.

---

## 🚀 Quick Start

### 1. Install Dependencies

```bash
cd synthx-dashboard
npm install
```

### 2. Configure Environment Variables

Copy the example file and fill in your values:

```bash
cp .env.example .env.local
```

Then edit `.env.local`:

```env
# Discord OAuth2 (from https://discord.com/developers/applications)
DISCORD_CLIENT_ID=1234567890123456789
DISCORD_CLIENT_SECRET=your_secret_here

# NextAuth — generate a strong secret
NEXTAUTH_SECRET=supersecretkey123abc
NEXTAUTH_URL=http://localhost:3000   # Change to your domain in production

# Your Discord Bot Token
DISCORD_BOT_TOKEN=Bot.YourTokenHere

# Your SynthX bot's HTTP API URL
BOT_API_URL=http://localhost:8000
BOT_API_KEY=your_api_key_here

# Public (must match DISCORD_CLIENT_ID)
NEXT_PUBLIC_DISCORD_CLIENT_ID=1234567890123456789
```

### 3. Set Up Discord OAuth2

1. Go to https://discord.com/developers/applications
2. Select your SynthX application
3. Go to **OAuth2 → General**
4. Add redirect URIs:
   - `http://localhost:3000/api/auth/callback/discord` (development)
   - `https://yourdomain.vercel.app/api/auth/callback/discord` (production)
5. Copy Client ID and Client Secret into your `.env.local`

### 4. Run Locally

```bash
npm run dev
```

Open http://localhost:3000

---

## 🤖 Connecting to Your Bot API

The dashboard communicates with your SynthX bot through a REST API. You need to add a simple HTTP server to your Python bot.

### Add FastAPI to your bot

Install FastAPI:
```bash
pip install fastapi uvicorn aiosqlite
```

Create `api_server.py` in your bot root:

```python
from fastapi import FastAPI, Header, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import aiosqlite
import asyncio
import time
import os

app = FastAPI()
API_KEY = os.getenv("BOT_API_KEY", "your_api_key_here")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://yourdomain.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

BOT_START_TIME = time.time()

def verify_key(x_api_key: str = Header(...)):
    if x_api_key != API_KEY:
        raise HTTPException(status_code=401, detail="Invalid API key")

@app.get("/api/stats")
async def get_stats(x_api_key: str = Header(...)):
    verify_key(x_api_key)
    # Replace with real bot stats
    return {
        "servers": 850,
        "users": 125000,
        "ping": 42,
        "uptime": "99.9%",
        "commands": 120
    }

@app.get("/api/settings/{guild_id}")
async def get_settings(guild_id: int, x_api_key: str = Header(...)):
    verify_key(x_api_key)
    # Fetch from your bot's databases
    async with aiosqlite.connect("db/anti.db") as db:
        cursor = await db.execute("SELECT status FROM antinuke WHERE guild_id=?", (guild_id,))
        row = await cursor.fetchone()
    
    return {
        "antinuke": {"enabled": bool(row[0]) if row else False},
        # Add more modules...
    }

@app.post("/api/settings/{guild_id}/{module}")
async def update_settings(guild_id: int, module: str, body: dict, x_api_key: str = Header(...)):
    verify_key(x_api_key)
    # Update your bot's database
    # e.g. for antinuke: 
    # async with aiosqlite.connect("db/anti.db") as db:
    #     await db.execute("INSERT OR REPLACE INTO antinuke ...")
    return {"success": True}

@app.get("/api/premium/{guild_id}")
async def check_premium(guild_id: int, x_api_key: str = Header(...)):
    verify_key(x_api_key)
    # Check your premium database
    return {"premium": False}

# Run with: uvicorn api_server:app --host 0.0.0.0 --port 8000
```

Start the API server:
```bash
uvicorn api_server:app --host 0.0.0.0 --port 8000
```

### Set environment variable in bot

Add to your bot's `.env`:
```
BOT_API_KEY=your_api_key_here
```

---

## ☁️ Deploy to Vercel

### Method 1: Vercel CLI

```bash
npm install -g vercel
vercel login
vercel
```

### Method 2: GitHub Integration

1. Push your project to GitHub
2. Go to https://vercel.com and import the repository
3. Set the **Framework Preset** to `Next.js`
4. Set the **Root Directory** to `synthx-dashboard`

### Environment Variables on Vercel

In your Vercel project → **Settings → Environment Variables**, add:

| Variable | Value |
|---|---|
| `DISCORD_CLIENT_ID` | Your client ID |
| `DISCORD_CLIENT_SECRET` | Your client secret |
| `NEXTAUTH_SECRET` | Generate with `openssl rand -base64 32` |
| `NEXTAUTH_URL` | `https://your-project.vercel.app` |
| `DISCORD_BOT_TOKEN` | Your bot token |
| `BOT_API_URL` | Your API URL (e.g. hosted on Hostzy) |
| `BOT_API_KEY` | Your API key |
| `NEXT_PUBLIC_DISCORD_CLIENT_ID` | Same as DISCORD_CLIENT_ID |

> **Important**: After setting `NEXTAUTH_URL` to your Vercel domain, add that domain as a callback URL in your Discord application OAuth2 settings.

---

## 📋 Project Structure

```
synthx-dashboard/
├── app/
│   ├── page.tsx              # Home page
│   ├── features/page.tsx     # Features page
│   ├── docs/page.tsx         # Documentation
│   ├── hosting/page.tsx      # Hostzy partner page
│   ├── support/page.tsx      # Support page
│   ├── dashboard/
│   │   ├── page.tsx          # Guild selector
│   │   └── [guildId]/page.tsx # Server dashboard
│   └── api/
│       ├── auth/[...nextauth]/route.ts
│       ├── stats/route.ts
│       ├── guilds/route.ts
│       └── settings/[guildId]/route.ts
├── components/
│   ├── layout/               # Navbar, Footer
│   ├── home/                 # Hero, Stats, Features, CTA
│   ├── docs/                 # DocsContent with all commands
│   └── dashboard/            # DashboardSidebar, ModulePanel, etc.
├── lib/
│   ├── auth.ts               # NextAuth config
│   ├── bot-api.ts            # Bot API client
│   └── discord.ts            # Discord API utilities
└── types/
    └── next-auth.d.ts        # Type extensions
```

---

## 🎨 Configurable Modules in Dashboard

| Module | Panel |
|---|---|
| Anti-Nuke | Toggle protections, set punishment |
| Fortify AI ⭐ | AI detection, sensitivity (Premium) |
| AutoMod | Spam, links, caps, emoji, NSFW filters |
| Logging | Choose log types and channels |
| Welcome | Message, embed, DM greeting |
| Leveling | XP rate, level-up messages, role rewards |
| Giveaways | Default channel, manager role |
| Reaction Roles | Style (emoji/button/dropdown) |
| Music | Platform, DJ role, autoplay |
| Auto Role | Member & bot role assignment |
| Night Mode | Lock/unlock schedule |
| Emergency | One-click lockdown + restore |
| Log Viewer | Real-time event feed |

---

## 🛠 Tech Stack

- **Next.js 14** (App Router)
- **TypeScript**
- **TailwindCSS**
- **NextAuth.js** (Discord OAuth2)
- **Framer Motion** (animations)
- **Lucide React** (icons)

---

## ❓ Troubleshooting

**Build errors on Vercel?**
- Make sure all environment variables are set
- Check that `NEXTAUTH_URL` matches your actual domain

**Dashboard shows no servers?**
- You must have Manage Server permission in the target server
- Your bot must be in the server for the "Bot Active" badge to show

**Settings not saving?**
- The bot API must be running and reachable from the dashboard
- Check `BOT_API_URL` and `BOT_API_KEY` match on both sides

**Auth redirect error?**
- Add your Vercel callback URL to Discord OAuth2 redirect URIs
- Format: `https://yourdomain.vercel.app/api/auth/callback/discord`
