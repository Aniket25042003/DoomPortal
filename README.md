# DoomPortal

Your 2050 holographic self teleports in to roast your worst social media habit.

## Getting Started

### 1. Clone and install dependencies

```bash
git clone https://github.com/Aniket25042003/DoomPortal.git
cd DoomPortal
npm install
```

### 2. Environment variables

Copy the example environment file and fill in your values:

```bash
cp .env.example .env.local
```

Edit `.env.local` with your actual values. See [.env.example](.env.example) for detailed setup instructions for each variable.

### 3. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser.

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Database:** MongoDB Atlas
- **Auth:** Better Auth (Google OAuth)
- **Storage:** Vercel Blob
- **Video Generation:** Magic Hour API
- **Profile Pictures:** unavatar.io

## Deploy on Vercel

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed steps:

1. Import the repo at [vercel.com/new](https://vercel.com/new)
2. Create a Blob store for video storage
3. Set all environment variables
4. Add your production URL to Google OAuth redirect URIs
5. Redeploy
