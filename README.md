# InstaGen AI 🎯  
**AI-powered Instagram username generator and availability checker**

InstaGen AI generates short, creative, and modern Instagram usernames using AI, and checks in real-time if they’re available — all in one clean interface.

---

## ✨ Features

- 🔮 **AI-Powered Name Generation**  
  Generates 15 smart and catchy usernames based on a topic (like fashion, travel, etc.) using OpenAI's GPT-3.5.

- ✅ **Real-Time Instagram Availability Check**  
  Uses Puppeteer and a logged-in Instagram session to visually scan each profile page and verify if the username is actually available.

- 📋 **Copy to Clipboard**  
  Copy any available name (cleaned and lowercase) with one click.

- 🎨 **Instagram-Inspired Design**  
  Styled with IG gradients, soft shadows, and simple UI for fast decision-making.

---

## 🧠 How It Works

1. User types a topic like `fitness`
2. Frontend sends it to backend (`/generate-ai`)
3. OpenAI responds with 15 usernames
4. Each is checked via Puppeteer using saved Instagram login cookies
5. Only available names are sent back and displayed

---

## 🚀 Demo Preview

> Coming soon...

---

## ⚙️ Tech Stack

| Layer       | Tech                                  |
|-------------|----------------------------------------|
| Frontend    | React (Vite), Tailwind CSS / custom CSS |
| Backend     | Node.js, Express                       |
| AI          | OpenAI GPT-3.5                         |
| Scraping    | Puppeteer (headless browser)           |
| Auth        | Instagram login via saved cookies      |

---

## 📦 Setup Instructions

### 1. Clone the Repo

```bash
git clone https://github.com/yourusername/instagen-ai.git
cd instagen-ai

