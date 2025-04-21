🔧 Technologies Used
Layer	Stack
Frontend	React (Vite), Tailwind/Custom CSS
Backend	Node.js, Express
AI	OpenAI (GPT-3.5 via openai SDK)
Scraping	Puppeteer
Auth	Instagram login via saved cookies
Deployment	(Pending)
🛠️ Features
1. AI Username Generation
Uses OpenAI to generate 15 creative, brandable, or trendy usernames based on a niche

Prompting handled carefully for clean, line-by-line output

Integrated through a /generate-ai backend route

2. Username Availability Checker
Headless browser (Puppeteer) opens each Instagram profile page

Uses saved login session (cookies.json) to bypass Instagram’s login wall

Detects availability by scanning for:

"Sorry, this page isn't available"

Rate-limited with 2-second delay per check to avoid flagging

3. Frontend UI
One-page layout

Single input: “What is your account about?”

“Generate AI Usernames” button triggers backend

Shows available usernames

“Copy” button next to each name (copies lowercase, no @)

4. Styling Enhancements
Instagram-themed gradient borders and shadows

Responsive layout

Minimal text and user feedback during loading/no results