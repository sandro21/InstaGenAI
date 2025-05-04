require('dotenv').config();
process.env.PUPPETEER_EXECUTABLE_PATH = require('puppeteer').executablePath();
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const puppeteer = require('puppeteer');
const app = express();
const { OpenAI } = require('openai');
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});



app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Server is running!');
});



const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// ✅ Username availability checker using logged-in Puppeteer session
async function isUsernameAvailable(username) {
  const url = `https://www.instagram.com/${username}`;
  const cookies = JSON.parse(fs.readFileSync('cookies.json', 'utf8'));

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
  

  
  const page = await browser.newPage();

  try {
    await page.setCookie(...cookies);
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 15000 });

    await page.waitForFunction(() => {
      return document.body.innerText.length > 100;
    }, { timeout: 10000 });

    // 🗒️ Optional debug screenshot
    // await page.screenshot({ path: `${username}.png` });

    const isUnavailable = await page.evaluate(() => {
      return document.body.innerText.includes("Sorry, this page isn't available");
    });

    await browser.close();
    return isUnavailable;
  } catch (err) {
    console.error(`❌ Error checking @${username}:`, err.message);
    await browser.close();
    return false;
  }
}


app.post('/generate-ai', async (req, res) => {
    try {
      const { niche } = req.body;
  
      if (!niche || niche.trim() === '') {
        return res.status(400).json({ error: 'Niche is required' });
      }
  
      const prompt = `Generate a list of 15 short, creative, and modern Instagram usernames for a niche about "${niche}". 
      Rules:
      - Do NOT include numbers or underscores unless very minimal and useful
      - Do NOT include explanations or paragraphs
      - Only output raw usernames, one per line
      - Do NOT include the usernames that have most likely been taken already and is very obvious.`;
      
      const chat = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.8
      });
      
      const rawText = chat.choices[0].message.content;
      
      console.log("🧠 AI Raw Output:\n", rawText);
      
      const usernameList = rawText
        .split('\n')
        .map(line => line.replace(/^[\d\.\-\s@]+/, '').trim())
        .filter(Boolean)
        .map(u => u.startsWith('@') ? u : `@${u}`);
      
  
      const availableUsernames = [];
  
      for (let username of usernameList) {
        const clean = username.replace('@', '');
        const isAvailable = await isUsernameAvailable(clean);
  
        console.log(`🤖 ${username} is ${isAvailable ? '✅ available' : '❌ taken'}`);
  
        if (isAvailable) {
          availableUsernames.push(username);
        }
  
        await delay(2000); // Same rate limit delay
      }
  
      res.json({ usernames: availableUsernames });
  
    } catch (err) {
      console.error("❌ AI Generation Error:", err.message);
      res.status(500).json({ error: 'AI generation failed', details: err.message });
    }
  });
  
// ✅ POST route for generating & checking usernames
// app.post('/generate', async (req, res) => {
//   try {
//     const { niche } = req.body;

//     if (!niche || niche.trim() === '') {
//       return res.status(400).json({ error: 'Niche is required' });
//     }

//     const dummyUsernames = [
//       `@${niche}_vibes`,
//       `@daily_${niche}`,
//       `@${niche}gram`,
//       `@the${niche}spot`,
//       `@${niche}hub`,
//       `@${niche}_zone`,
//       `@real${niche}`,
//       `@${niche}_official`,
//       `@allabout${niche}`,
//       `@${niche}_daily`,
//       `@top_${niche}`,
//       `@${niche}central`,
//       `@go${niche}`,
//       `@${niche}_world`,
//       `@${niche}_explore`
//     ];

//     const availableUsernames = [];

//     for (let username of dummyUsernames) {
//       const clean = username.replace('@', '');
//       const isAvailable = await isUsernameAvailable(clean);

//       console.log(`🔍 ${username} is ${isAvailable ? '✅ available' : '❌ taken'}`);

//       if (isAvailable) {
//         availableUsernames.push(username);
//       }

//       await delay(2000); // 💤 Wait to avoid detection
//     }

//     res.json({ usernames: availableUsernames });

//   } catch (err) {
//     console.error("❌ Backend Error:", err.message);
//     res.status(500).json({ error: 'Internal Server Error', details: err.message });
//   }
// });

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
