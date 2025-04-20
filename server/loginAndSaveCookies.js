const puppeteer = require('puppeteer');
const fs = require('fs');
const readline = require('readline');

(async () => {
  const browser = await puppeteer.launch({ headless: false, defaultViewport: null });
  const page = await browser.newPage();

  await page.goto('https://www.instagram.com/accounts/login/', {
    waitUntil: 'domcontentloaded'
  });

  console.log("👉 Please log into Instagram manually.");
  console.log("✅ After logging in completely, press ENTER here in the terminal to continue...");

  // Wait for user to press ENTER in the terminal
  await new Promise((resolve) => {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    rl.question('', () => {
      rl.close();
      resolve();
    });
  });

  const cookies = await page.cookies();
  fs.writeFileSync('cookies.json', JSON.stringify(cookies, null, 2));

  console.log("✅ Cookies saved to cookies.json");
  await browser.close();
})();
