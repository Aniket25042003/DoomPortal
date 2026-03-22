# DoomPortal 🕳️

> Your future self from 2050 travels back in time to roast you for your worst social media habit. There is no escape.

[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![Magic Hour](https://img.shields.io/badge/Magic%20Hour-AI%20Video-00f0ff?style=flat-square)](https://magichour.ai/)
[![Vercel](https://img.shields.io/badge/Vercel-Deployed-black?style=flat-square&logo=vercel)](https://vercel.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=flat-square&logo=mongodb)](https://mongodb.com/atlas)
[![Better Auth](https://img.shields.io/badge/Better%20Auth-Google%20OAuth-000?style=flat-square)](https://better-auth.com/)
[![Google Cloud](https://img.shields.io/badge/Google-Developer%20Console-4285F4?style=flat-square&logo=google)](https://console.cloud.google.com/)

---

## ✨ Overview

DoomPortal is a fun, AI-powered web app that generates personalized roast videos. Enter your X or Instagram handle, pick one of 12 "social sins," and watch as your future self from 2050 steps through a neon time portal to roast you for that habit. It's a roast that might actually make you touch grass.

**Live Demo:** [doomportal.vercel.app](https://doomportal.vercel.app)

---

## 🎯 Features

- **Profile-based roasts** — Fetches your profile picture from X or Instagram via [unavatar.io](https://unavatar.io)
- **12 social sins** — Doom Scroller, Crypto Degenerate, Meme Lord, Ratio Chaser, 3AM Poster, Selfie Addict, Reply Guy, Story Hoarder, Flex Lord, Algorithm Slave, Professional Ghoster, Poll Abuser
- **AI video generation** — Magic Hour's image-to-video API creates short, personalized roast videos with audio
- **Loading experience** — Rotating AI-generated preview images while you wait (video takes ~2–4 minutes)
- **Google OAuth** — Sign in to save roasts to your library and control gallery visibility
- **Shareable links** — Each roast gets a short URL; view counts are tracked
- **Wall of Shame** — Public gallery of trending roasts; opt-in for authenticated users
- **Rate limiting** — Prevents abuse with per-IP request throttling

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|------------|
| **Framework** | Next.js 16 (App Router), React 19 |
| **Styling** | Tailwind CSS 4, shadcn/ui |
| **Database** | MongoDB Atlas |
| **Auth** | Better Auth (Google OAuth) |
| **Storage** | Vercel Blob |
| **Video & Images** | Magic Hour API (Kling image-to-video, AI image gen) |
| **Profile Pics** | unavatar.io |
| **Deployment** | Vercel |

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or pnpm

### Installation

```bash
git clone https://github.com/Aniket25042003/DoomPortal.git
cd DoomPortal
npm install
```

### Environment Variables

Copy the example file and fill in your values:

```bash
cp .env.example .env.local
```

| Variable | Description |
|----------|-------------|
| `MONGODB_URI` | MongoDB Atlas connection string |
| `MAGIC_HOUR_API_KEY` | From [Magic Hour Developer Hub](https://magichour.ai/developer) |
| `BETTER_AUTH_SECRET` | 32+ char secret (`openssl rand -base64 32`) |
| `BETTER_AUTH_URL` | `http://localhost:3000` (dev) or your production URL |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret |
| `BLOB_READ_WRITE_TOKEN` | Vercel Blob token (from Vercel dashboard) |

See [.env.example](.env.example) for detailed setup instructions.

### Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## 📦 Deployment

Deploy to Vercel in minutes:

1. Import the repo at [vercel.com/new](https://vercel.com/new)
2. Create a Vercel Blob store (Storage tab)
3. Set all environment variables
4. Add `https://your-app.vercel.app/api/auth/callback/google` to Google OAuth redirect URIs
5. Deploy

See [DEPLOYMENT.md](DEPLOYMENT.md) for the full step-by-step guide.

---

## 📁 Project Structure

```
DoomPortal/
├── src/
│   ├── app/                    # Next.js App Router pages & API routes
│   │   ├── api/remix/          # Kickoff, status, complete, save, view, delete
│   │   ├── auth/               # Sign-in page
│   │   ├── dashboard/          # User's saved roasts
│   │   ├── gallery/            # Public Wall of Shame
│   │   ├── remix/[shortId]/    # Share page for each roast
│   │   └── settings/           # Gallery visibility toggle
│   ├── components/             # React components
│   ├── data/sins.ts            # 12 social sins + prompt builders
│   ├── lib/                    # Magic Hour, unavatar, auth, db, blob, etc.
│   └── validations/            # Zod schemas
├── public/
│   └── app-icon.png            # App icon
├── scripts/
│   └── theme-icon.mjs          # Re-theme icon for dark mode
└── ...
```

---

## 🎬 How It Works

1. **Kickoff** — User enters handle, picks sin. Server fetches profile pic, uploads to Blob, kicks off Magic Hour video + preview image jobs.
2. **Polling** — Client polls `/api/remix/status` and `/api/remix/preview` while displaying rotating AI previews.
3. **Complete** — When video is ready, client calls `/api/remix/complete` to download, upload to Blob, and save metadata to MongoDB.
4. **Share** — Short ID (`/remix/abc123`) links to the roast; view count increments on load.

---

## 🧩 Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `node scripts/theme-icon.mjs` | Re-apply theme background to `public/app-icon.png` |

---

## 📄 License

MIT

---

## 🙏 Acknowledgments

- [Magic Hour](https://magichour.ai/) — AI video & image generation
- [unavatar.io](https://unavatar.io) — Profile pictures from X/Instagram
- [Better Auth](https://better-auth.com/) — Authentication
- [Vercel](https://vercel.com) — Hosting & Blob storage
- [shadcn/ui](https://ui.shadcn.com/) — UI components

---

**Built with 💀 for FalconHacks 2.**
