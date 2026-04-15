# CompTIA Security+ SY0-701 Exam Prep Platform

A full-featured Security+ exam prep platform with Firebase authentication, progress tracking, topic quizzes, performance-based questions (PBQs), and a final exam.

## Project Structure

```
/
├── secplus_login.html   ← Login / Register page (entry point)
├── index.html           ← Main platform (dashboard, quiz, PBQs, results)
├── secplus_auth.js      ← Firebase auth + progress utilities
└── vercel.json          ← Vercel routing config
```

## Features

- 🔐 **Auth** — Email/password registration & login via Firebase Firestore
- 📊 **Progress tracking** — Saved to Firestore + localStorage (dual sync)
- 🗂 **18 Topic Quizzes** — Objectives 1.1–5.6, each requiring 80% to unlock next
- 🎓 **Final Exam** — 150 questions, 75% pass mark, unlocked after all topics
- 🔬 **25 PBQs** — Drag & drop, match, order, CLI, hotspot across 5 domains
- ⏱ **Timed quizzes** — With live score tracking and review on completion

## Deploy to Vercel

### Option 1 — Vercel CLI (recommended)

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy from this folder
vercel

# Follow the prompts — accept defaults
# Your site will be live at: https://your-project.vercel.app
```

### Option 2 — GitHub + Vercel Dashboard

1. Push these 4 files to a GitHub repo
2. Go to [vercel.com](https://vercel.com) → **Add New Project**
3. Import your GitHub repo
4. Click **Deploy** — no build settings needed (static site)

### Option 3 — Drag & Drop

1. Go to [vercel.com/new](https://vercel.com/new)
2. Drag the entire project folder into the upload area
3. Deploy

## URL Routing

| URL | Page |
|-----|------|
| `/` | Login page (redirects to `/app` if already logged in) |
| `/app` | Main platform (redirects to `/` if not logged in) |
| `/secplus_login.html` | Login page (direct) |
| `/index.html` | Main platform (direct) |

## Firebase

The Firebase config is already embedded in `secplus_auth.js`. It uses Firestore to store:
- `sp_users/{email}` — user accounts (name, email, hashed password)
- `sp_progress/{email}` — quiz progress per topic

No Firebase setup needed — the existing project (`helpdesk-pro-e6c9e`) is ready.

## Local Development

Just open `secplus_login.html` in a browser — no build step required. For full local dev with proper routing, use:

```bash
npx serve .
# then visit http://localhost:3000
```
