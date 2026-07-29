const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

(async () => {
  const out = path.resolve(__dirname, '..', 'gifs');
  fs.mkdirSync(out, { recursive: true });

  const browser = await chromium.launch({
    executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    headless: true,
  });
  const page = await browser.newPage({ viewport: { width: 1200, height: 800 } });

  // open app, add first product, open cart
  await page.goto('http://localhost:5175/');
  await page.click('.product-card button'); // click Add to Cart
  await page.waitForTimeout(180);
  await page.goto('http://localhost:5175/cart');
  await page.waitForTimeout(180);

  // capture N frames (adjust count and delay as desired)
  const FRAME_COUNT = 30;
  const FRAME_DELAY_MS = 50;

  for (let i = 0; i < FRAME_COUNT; i++) {
    await page.screenshot({ path: path.join(out, `frame${String(i).padStart(3,'0')}.png`) });
    await page.waitForTimeout(FRAME_DELAY_MS);
  }

  await browser.close();
  console.log('Saved frames to', out);
})();
