## InstaGen AI — What this app does

Generate creative Instagram usernames for a niche and automatically check whether they are available on Instagram. The app:
- creates 10–15 niche‑specific username ideas using the OpenAI API
- checks availability with a logged‑in Puppeteer session ✅

Stack: Next.js (frontend) + Express (backend) + Puppeteer + OpenAI.

---

## Local development

Prerequisites: Node.js LTS, npm.

1) Backend (Express)

```bash
cd server
npm install
# install a local browser for Puppeteer
npx puppeteer browsers install chrome

# env for backend
echo OPENAI_API_KEY=YOUR_KEY > .env

npm run start
# Server listens on http://localhost:5000
```

2) Frontend (Next.js)

Create `./.env.local` at the project root:

```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000
```

Run the app:

```bash
npm install
npm run dev
# Open http://localhost:3000
```

Troubleshooting
- “Could not find Chrome …”: run `npx puppeteer browsers install chrome` inside `server/`.
- If you previously set `PUPPETEER_*` env vars locally, unset them before running:
  - Windows PowerShell: `Remove-Item Env:PUPPETEER_CACHE_DIR -ErrorAction SilentlyContinue`

---

## Deployment (recommended: Vercel + Render)

Frontend (Vercel)
- Env var: `NEXT_PUBLIC_API_BASE_URL=https://<your-render-service>.onrender.com`
- Default Vercel build settings are fine.

Backend (Render — Web Service, root = `server/`)
- Build Command:
```bash
npm install && npx puppeteer browsers install chrome
```
- Start Command:
```bash
npm run start
```
- Env vars:
  - `OPENAI_API_KEY=...`
  - `PUPPETEER_CACHE_DIR=/opt/render/.cache/puppeteer`
  - Do NOT set `PORT`, `PUPPETEER_EXECUTABLE_PATH`, or `PUPPETEER_SKIP_CHROMIUM_DOWNLOAD`.

After deploy, your frontend calls the backend via `NEXT_PUBLIC_API_BASE_URL`. 🚀

---

## Editing

- Frontend entry: `app/page.js`
- Backend entry: `server/index.js`
