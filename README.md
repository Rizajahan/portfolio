# Riza Portfolio v2 — Setup Guide (100% free)

**Stack:** your HTML/CSS/JS + **Vercel** (free hosting + serverless API) + **Supabase** (free Postgres database) + **ntfy.sh** (free push notifications to phone and laptop).
No credit card needed for any of them.

## What's in the folder
| File | Purpose |
|---|---|
| `Index.html` | Your page, patched: loads `theme.css` + `app.js`, new contact form, menu fix |
| `theme.css` | Wine/maroon/black/nude theme, gradient reflection, all animations, robot styles |
| `app.js` | Robot (eyes follow cursor, blinks, thinks, talks, waves), chat, contact flow, scroll animations, visit logging |
| `api/chat.js` | Bot brain + saves every question/answer + visits |
| `api/contact.js` | Validates, rate-limits, saves the message, sends you a notification |
| `api/kb.js` | **Edit this** to change what the bot knows |
| `supabase.sql` | Creates the database tables (with security on) |
| `vercel.json` | Security headers |
Copy your images and PDFs (riza1 profile.jpg, about1.jpg, etc.) into this same folder, as before.

## Step 1 — Tools (once)
1. Install **VS Code**: code.visualstudio.com
2. Install **Node.js LTS**: nodejs.org
3. Install **Git**: git-scm.com
4. Open the folder: VS Code → File → Open Folder → `riza-portfolio`. Open a terminal with Ctrl+`.

## Step 2 — Database (Supabase)
1. Sign up at supabase.com (use GitHub login) → **New project**. Name: `portfolio`, set a DB password, pick the closest region (Mumbai), plan **Free**.
2. Wait about 2 minutes. Go to **SQL Editor → New query**, paste all of `supabase.sql`, click **Run**.
3. Go to **Project Settings → API**. Copy the **Project URL** and the **service_role** key. The service_role key is your secret: it goes only in Vercel/.env, never in HTML or JS.
4. See your data anytime in **Table Editor**: `contacts`, `chat_messages`, `visits`. It updates live.

## Step 3 — Notifications (ntfy, no account)
1. Pick a long random topic, e.g. `riza-portfolio-7f3k9x2q` (anyone who knows it can read it, so keep it secret).
2. Phone: install the **ntfy** app (Android/iOS) → **+** → subscribe to your topic.
3. Laptop: open `https://ntfy.sh/your-topic` in Chrome → click **Subscribe** → allow browser notifications.

## Step 4 — Environment variables
Copy `.env.example` to `.env` and fill it in: `SUPABASE_URL`, `SUPABASE_SERVICE_KEY`, `NTFY_TOPIC`, `IP_SALT` (any random text), `SITE_ORIGIN` (fill after Step 6; leave empty for local testing).

## Step 5 — Test locally
```bash
npm install
npx vercel dev      # first run: log in, accept defaults; it opens http://localhost:3000
```
Test: open the robot, ask "skills", say "contact" and follow the questions, submit the form. Check Supabase tables and your phone.

## Step 6 — Deploy free
1. Create a GitHub repo, then in the terminal:
   ```bash
   git init && git add . && git commit -m "portfolio v2"
   git branch -M main && git remote add origin https://github.com/Rizajahan/portfolio.git && git push -u origin main
   ```
   (`.env` is git-ignored, so your secrets are not uploaded.)
2. vercel.com → sign up with GitHub → **Add New → Project** → import the repo → open **Environment Variables**, add all 5 from `.env` → **Deploy**.
3. Copy your live URL (e.g. `https://riza.vercel.app`), set `SITE_ORIGIN` to it in Vercel → Settings → Environment Variables → **Redeploy**.
4. Optional: replace your Google Sheet script; it's no longer used. Firebase for JanLink is untouched.

## Security, what's covered
- **Database locked:** Row Level Security is on with no public policies, so the browser can never read or write tables directly.
- **Secret keys** live only on the server (Vercel env vars).
- **Validation and sanitising** of every input, size limits, `<` `>` stripped, and the bot renders text with `textContent` (no XSS).
- **Rate limiting** per hashed IP (3 contacts / 10 min, 20 chat messages / min). IPs are stored only as salted hashes.
- **Honeypot** hidden field traps spam bots; **origin check** blocks other sites from using your API.
- **Security headers** (HTTPS-only HSTS, CSP, no framing, no sniffing) in `vercel.json`. Vercel gives free HTTPS.
- Tip: enable 2-step login on GitHub, Vercel and Supabase.

## Customising
- Bot answers: edit `api/kb.js` (each line is a pattern → answer). Push to GitHub and Vercel redeploys.
- Colors: change the variables at the top of `theme.css`.
- Free-tier limits are generous for a portfolio. Note Supabase pauses projects after a week of no activity; open the dashboard to wake it.

## Troubleshooting
- Bot says "can't reach my brain": open DevTools → Network → `/api/chat`. 500 usually means wrong env vars; 403 means `SITE_ORIGIN` doesn't match your URL exactly (no trailing slash).
- No notification: check that the topic name is identical in the app and in `NTFY_TOPIC`.
- Opening `Index.html` by double-click won't run the API; use `npx vercel dev`.
