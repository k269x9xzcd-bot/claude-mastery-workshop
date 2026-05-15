# Claude Mastery Workshop

A progressive web app (PWA) for mastering Claude as a power user and developer. Install it on your iPhone or iPad for a native app experience.

**Live URL:** *(add after Vercel deployment)*  
**GitHub:** https://github.com/k269x9xzcd-bot/claude-mastery-workshop

---

## Deploy to Vercel

The app is already pushed to GitHub. Connect it to Vercel in two clicks:

1. Go to [vercel.com/new](https://vercel.com/new)
2. Click **Import Git Repository**
3. Find and import `k269x9xzcd-bot/claude-mastery-workshop`
4. Leave all build settings at their defaults (no build command, output directory is `/`)
5. Click **Deploy**

Vercel will detect the `vercel.json` in the repo root and configure SPA routing automatically. Your live URL will appear on the deployment page — update the link above once you have it.

**Redeploy after changes:** Push to the `main` branch. Vercel redeploys automatically on every push.

---

## Install on iPhone / iPad

Once the app is deployed, add it to your home screen for a full-screen native experience:

1. Open the live Vercel URL in **Safari** (must be Safari, not Chrome)
2. Tap the **Share** button (box with arrow pointing up) in the toolbar
3. Scroll down and tap **Add to Home Screen**
4. Name it `Claude` and tap **Add**

The app will appear on your home screen with the Claude Workshop icon. It launches full-screen with no browser chrome, supports offline use, and remembers your progress across sessions.

---

## What's Inside

**8 learning modules across 3 tracks:**

| Track | Module | XP |
|---|---|---|
| Foundation | Claude 101: Getting Started | 100 |
| Foundation | Prompt Engineering Mastery | 150 |
| Foundation | AI Fluency & Mental Models | 100 |
| Developer | Claude API & SDK | 200 |
| Developer | MCP Introduction | 200 |
| Developer | MCP Advanced | 250 |
| Developer | Agent Skills & Cowork | 300 |
| Bonus | Cowork + Dispatch | 150 |

**Gamification:** XP system, 5 levels (Apprentice → Master), 10 unlock badges, daily streaks  
**Reference Shelf:** Quick links to all 13 Anthropic documentation resources  
**Offline-first:** Service worker caches all assets for use without internet

---

## Cowork Setup

To use the Cowork features covered in Module 7 and the Bonus module:

1. Download the Claude desktop app from [claude.ai/download](https://claude.ai/download)
2. Open the app and sign in
3. Enable Cowork mode from the sidebar
4. Install the Claude Workshop plugin when prompted

---

## Local Development

No build step required. The app runs directly from static files via Babel standalone.

```bash
# Serve the app/ directory with any static file server
cd app
npx serve .
# or
python3 -m http.server 3000
```

Open `http://localhost:3000` in your browser.

---

## File Structure

```
app/
├── index.html      # App shell, CSS variables, CDN scripts
├── app.js          # Full React 18 app (JSX, transpiled in-browser by Babel)
├── manifest.json   # PWA manifest (icons, shortcuts, display mode)
├── sw.js           # Service worker (cache-first, offline support)
└── vercel.json     # SPA rewrite rules + cache headers
```
