require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const puppeteer = require('puppeteer');
const app = express();
const { OpenAI } = require('openai');
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Debug toggles for Puppeteer headful mode
const PPTR_HEADFUL = String(process.env.PPTR_HEADFUL || '').toLowerCase() === 'true';
const PPTR_SLOMO = Number.isFinite(parseInt(process.env.PPTR_SLOMO, 10)) ? parseInt(process.env.PPTR_SLOMO, 10) : 0;



app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Server is running!');
});



const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// ✅ Username availability checker using logged-in Puppeteer session with retry
async function isUsernameAvailable(username) {
  const url = `https://www.instagram.com/${username}`;
  const cookies = JSON.parse(fs.readFileSync('cookies.json', 'utf8'));

  function isTransientNavError(message) {
    if (!message) return false;
    const m = message.toLowerCase();
    return m.includes('frame was detached') ||
           m.includes('execution context was destroyed') ||
           m.includes('navigation') ||
           m.includes('net::') ||
           m.includes('timeout');
  }

  for (let attempt = 1; attempt <= 2; attempt++) {
    const args = [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-extensions',
      '--no-first-run',
      '--no-default-browser-check'
    ];
    if (!PPTR_HEADFUL) {
      args.push('--single-process');
    } else {
      args.push('--start-maximized');
    }

    const browser = await puppeteer.launch({
      headless: PPTR_HEADFUL ? false : true,
      slowMo: PPTR_SLOMO || undefined,
      args,
      devtools: PPTR_HEADFUL || false,
    });
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
    await page.setViewport({ width: 1366, height: 768 });

    try {
      await page.setCookie(...cookies);

      // Helpful request/response logging in debug mode
      if (PPTR_HEADFUL) {
        page.on('requestfailed', req => {
          console.warn('request failed:', req.url(), req.failure() && req.failure().errorText);
        });
        page.on('response', res => {
          if (res.status() >= 400) {
            console.warn('response >=400:', res.status(), res.url());
          }
        });
      }
      const response = await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
      await page.waitForSelector('body', { timeout: 10000 });

      const status = response ? response.status() : 0;
      if (status === 404) {
        await browser.close();
        return true; // 404 -> available
      }

      const hasProfileSignals = await page.evaluate((expectedUsername) => {
        const ogType = document.querySelector('meta[property="og:type"]')?.getAttribute('content') || '';
        const ogUrl = document.querySelector('meta[property="og:url"]')?.getAttribute('content') || '';
        const ogTitle = document.querySelector('meta[property="og:title"]')?.getAttribute('content') || '';

        const u = expectedUsername.toLowerCase();
        const matchesUrl = ogUrl.toLowerCase().endsWith('/' + u + '/') || ogUrl.toLowerCase().endsWith('/' + u);
        const matchesTitle = ogTitle.toLowerCase().includes('@' + u) || ogTitle.toLowerCase().includes(u);
        const isProfileType = ogType.toLowerCase().includes('profile');

        return Boolean(matchesUrl || matchesTitle || isProfileType);
      }, username);

      await browser.close();
      // Simple rule per request: profile signals => taken, otherwise available
      return hasProfileSignals ? false : true;
    } catch (err) {
      const msg = (err && err.message) ? err.message : String(err);
      console.error(`❌ Error checking @${username} (attempt ${attempt}):`, msg);
      await browser.close();
      if (attempt < 2 && isTransientNavError(msg)) {
        await delay(1500 + Math.floor(Math.random() * 700));
        continue; // retry once
      }
      // Unknown or persistent error → return null so caller can skip classification
      return null;
    }
  }
}


app.post('/generate-ai', async (req, res) => {
    try {
      const { niche, purpose, tone, bannedWords } = req.body;
  
      if (!niche || niche.trim() === '') {
        return res.status(400).json({ error: 'Niche is required' });
      }
  
      const purposeLine = purpose ? `Account purpose: ${purpose}` : '';
      const toneLine = tone ? `Tone: ${tone}` : '';
      const bannedLine = bannedWords ? `Avoid these tokens: ${bannedWords}` : '';

      // Detailed guidance per account purpose
      const purposeGuidanceMap = {
        Personal: `
Description: A private or semi-private account for connecting with friends and family.
Username pattern:
- Real names (first.last, firstname_lastname, initials)
- Personal identifiers (nicknames, birth years, middle initials)
- Simple and straightforward; minimal descriptors
Tone: Authentic, simple, relatable
Examples (do not reuse literally): emily.johnson, mike_r, sarah.k.92, alexmartinez, j.davis.23
        `,
        Influencer: `
Description: Building a personal brand to grow followers and monetize.
Username pattern:
- Name + niche variations (some explicit, some subtle)
- Branded personal names; lifestyle/action descriptors
- Creative modifications; memorable
Tone: Professional yet approachable, aspirational
Examples (do not reuse literally): alex.fitness, sarahstravels, jennifits, thestyleguru, marketswithjess
        `,
        Business: `
Description: Company or brand account focused on products/services and sales.
Username pattern:
- Brand names (invented or compound words)
- Product/service descriptors; industry suffixes (co, shop, studio, supply)
- Geographic elements when relevant
Tone: Professional, trustworthy, clear, market-focused
Examples (do not reuse literally): urbanleaf, coastalcoffee.co, fitgearshop, bellasalon, threadandco
        `,
        Creative: `
Description: Portfolio for artists/designers/photographers showcasing work.
Username pattern:
- Name + medium/craft; studio/creative names
- Artistic wordplay; abstract or evocative terms
Tone: Artistic, sophisticated, expressive, unique
Examples (do not reuse literally): wildframes, lunadesigns, pixelsbyalex, inkandthread, studioblue
        `,
        Community: `
Description: Community around a niche/fandom; hubs, clubs, or local groups.
Username pattern:
- Topic/niche focus with varied structures
- Community words (hub, club, squad, nation, collective) used sparingly
- Plurals and group language; geographic variants
Tone: Inclusive, engaging, community-driven
Examples (do not reuse literally): sneakerheads, techgeeks.hub, catsofinstagram, 90svibes, brooklyndogs
        `,
        Educational: `
Description: Teaching skills/tips/knowledge; tutorials and how-tos.
Username pattern:
- Subject + educational indicators (tips, academy, coach, guide, learn, with)
- Expertise-focused, authority-building; numbered formats occasionally
Tone: Authoritative, helpful, trustworthy
Examples (do not reuse literally): marketingtips, codewithemma, financeguide, yogawithjess, techexplained
        `,
      };

      const purposeGuidance = purpose && purposeGuidanceMap[purpose] ? purposeGuidanceMap[purpose] : '';

      const prompt = `Generate 15 Instagram usernames for a page about "${niche}". Make them short, memorable, and available-sounding. Vary the styles—mix keyword-based, abstract brandable names, wordplay, and straightforward options. Avoid repetitive patterns."
      ${purposeLine}
      ${toneLine}
      ${bannedLine}
      ${purposeGuidance}
Rules:
- Only output raw usernames, one per line, each starting with @
- Prefer ≤12 characters (hard cap 14)
- Avoid numbers and underscores and dots unless truly additive
- Avoid trademarks and offensive terms
- Aim for pronounceable and visually clear (avoid l/1 and O/0 lookalikes)
      `;
      
      const chat = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.65,
        top_p: 1,
        presence_penalty: 0.3,
        frequency_penalty: 0.4,
        max_tokens: 220
      });
      
      const rawText = chat.choices[0].message.content;
      
      console.log("🧠 AI Raw Output:\n", rawText);
      
      let usernameList = rawText
        .split('\n')
        .map(line => line.replace(/^[\d\.\-\s@]+/, '').trim())
        .filter(Boolean)
        .map(u => u.startsWith('@') ? u : `@${u}`);

      // Optional post-filter to remove banned tokens
      if (bannedWords && typeof bannedWords === 'string') {
        const banned = bannedWords.toLowerCase().split(',').map(s => s.trim()).filter(Boolean);
        if (banned.length > 0) {
          usernameList = usernameList.filter(handle => {
            const h = handle.toLowerCase();
            return !banned.some(token => token && h.includes(token));
          });
        }
      }
      
  
      const availableUsernames = [];
  
      for (let username of usernameList) {
        const clean = username.replace('@', '');
        const isAvailable = await isUsernameAvailable(clean);
  
        if (isAvailable === null) {
          console.warn(`⚠️  ${username} check inconclusive; skipping classification`);
          await delay(2000 + Math.floor(Math.random() * 600));
          continue;
        }

        console.log(`🤖 ${username} is ${isAvailable ? '✅ available' : '❌ taken'}`);
  
        if (isAvailable) {
          availableUsernames.push(username);
        }
  
        await delay(2000 + Math.floor(Math.random() * 600)); // polite delay with jitter
      }
  
      res.json({ usernames: availableUsernames });
  
    } catch (err) {
      console.error("❌ AI Generation Error:", err.message);
      res.status(500).json({ error: 'AI generation failed', details: err.message });
    }
  });

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
