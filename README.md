# InstaGen AI

Generate creative Instagram usernames for any niche and automatically check if they're available on Instagram.

**Features:**
- AI-generated username suggestions (10-15 per request)
- Real-time availability checking via Instagram
- Customizable by account purpose (Personal, Influencer, Business, Creative, Community, Educational)
- Banned words filtering

**Tech Stack:** Next.js (frontend) + Express (backend) + Puppeteer + OpenAI

---

## Quick Start (Local Development)

### Prerequisites
- Node.js LTS installed
- npm installed
- OpenAI API key ([get one here](https://platform.openai.com/api-keys))
- Instagram account (for username availability checks)

---

### Step 1: Backend Setup

1. **Navigate to server directory:**
   ```bash
   cd server
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```
   *(Chrome browser installs automatically via postinstall script)*

3. **Create environment file:**
   ```bash
   echo OPENAI_API_KEY=your_openai_key_here > .env
   ```
   Replace `your_openai_key_here` with your actual OpenAI API key.

4. **Log in to Instagram:**
   ```bash
   node loginAndSaveCookies.js
   ```
   - A browser window will open
   - Log in to your Instagram account
   - Wait until you're fully logged in (feed loads)
   - Press **ENTER** in the terminal to save cookies

5. **Start the server:**
   ```bash
   npm run start
   ```
   Server runs on `http://localhost:5000`

---

### Step 2: Frontend Setup

1. **Navigate to project root** (if you're still in `server/`):
   ```bash
   cd ..
   ```

2. **Create environment file:**
   Create a file named `.env.local` in the project root with:
   ```bash
   NEXT_PUBLIC_API_BASE_URL=http://localhost:5000
   ```

3. **Install dependencies:**
   ```bash
   npm install
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```

5. **Open your browser:**
   Go to `http://localhost:3000`

---

## How to Use

1. Enter your niche (e.g., "branded cooking page where I post videos")
2. (Optional) Select an account purpose from the dropdown
3. (Optional) Add banned words separated by commas (e.g., "official, real, daily")
4. Click **Generate**
5. Wait for results — available usernames will appear in the right panel
6. Click the 📋 icon to copy any username

---

## Troubleshooting

**"Could not find Chrome" error:**
- Manually run: `cd server && npx puppeteer browsers install chrome`

**Puppeteer environment variable conflicts:**
- Windows PowerShell: `Remove-Item Env:PUPPETEER_CACHE_DIR -ErrorAction SilentlyContinue`
- Then restart your server

**Instagram login issues:**
- Re-run `node server/loginAndSaveCookies.js` to refresh cookies
- Make sure you're fully logged in before pressing ENTER

**Server not connecting:**
- Verify backend is running on `http://localhost:5000`
- Check that `.env.local` has the correct `NEXT_PUBLIC_API_BASE_URL`

---

## Project Structure

- **Frontend:** `app/page.js` (main UI)
- **Backend:** `server/index.js` (API routes)
- **Cookies:** `server/cookies.json` (⚠️ never commit this file)

---

## Security Note

Each user must log in with their own Instagram account. Cookies are stored locally and never shared. The `cookies.json` file is already in `.gitignore` to prevent accidental commits.
