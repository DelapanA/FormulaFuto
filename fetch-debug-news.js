const fs = require('fs');
const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();

  // ====== GPFans ======
  try {
    await page.goto('https://www.gpfans.com/en/news/', { waitUntil: 'networkidle2' });
    const gpRaw = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('.news-feed-item')).map(article => ({
        text: article.innerText,
        html: article.innerHTML
      }));
    });
    fs.writeFileSync('debug-gpfans.json', JSON.stringify(gpRaw, null, 2));
    console.log("✅ GPFans success. Total items:", gpRaw.length);
  } catch (err) {
    console.error("❌ GPFans error:", err.message);
  }

  // ====== F1Technical ======
  try {
    await page.goto('https://www.f1technical.net/news', { waitUntil: 'networkidle2' });
    const f1techRaw = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('.news-article')).map(article => ({
        text: article.innerText,
        html: article.innerHTML
      }));
    });
    fs.writeFileSync('debug-f1technical.json', JSON.stringify(f1techRaw, null, 2));
    console.log("✅ F1Technical success. Total items:", f1techRaw.length);
  } catch (err) {
    console.error("❌ F1Technical error:", err.message);
  }

  // ====== PlanetF1 ======
  try {
    await page.goto('https://www.planetf1.com/latest-news', { waitUntil: 'networkidle2' });
    const planetRaw = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('article')).map(article => ({
        text: article.innerText,
        html: article.innerHTML
      }));
    });
    fs.writeFileSync('debug-planetf1.json', JSON.stringify(planetRaw, null, 2));
    console.log("✅ PlanetF1 success. Total items:", planetRaw.length);
  } catch (err) {
    console.error("❌ PlanetF1 error:", err.message);
  }

  // ====== Motorsport.com ======
  try {
    await page.goto('https://www.motorsport.com/f1/news/', { waitUntil: 'networkidle2' });
    const motorsportRaw = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('a.mosaic-article-title')).map(article => ({
        text: article.innerText,
        html: article.outerHTML
      }));
    });
    fs.writeFileSync('debug-motorsport.json', JSON.stringify(motorsportRaw, null, 2));
    console.log("✅ Motorsport success. Total items:", motorsportRaw.length);
  } catch (err) {
    console.error("❌ Motorsport error:", err.message);
  }

  // ====== RacingNews365 ======
  try {
    await page.goto('https://racingnews365.com/f1-news', { waitUntil: 'networkidle2' });
    const rnRaw = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('.article-listing__title a')).map(article => ({
        text: article.innerText,
        html: article.outerHTML
      }));
    });
    fs.writeFileSync('debug-racingnews365.json', JSON.stringify(rnRaw, null, 2));
    console.log("✅ RacingNews365 success. Total items:", rnRaw.length);
  } catch (err) {
    console.error("❌ RacingNews365 error:", err.message);
  }

  await browser.close();
})();
