const fs = require('fs');
const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();

  const results = [];

  // GPFans
  try {
    await page.goto('https://www.gpfans.com/en/news/', { waitUntil: 'networkidle2' });
    const gpFansData = await page.evaluate(() => {
      const articles = Array.from(document.querySelectorAll('.news-feed-item'));
      return articles.map(article => {
        const a = article.querySelector('a');
        const title = a?.querySelector('.news-feed-title')?.innerText?.trim();
        const url = a?.href;
        const date = a?.querySelector('.news-feed-date')?.innerText?.trim();
        return { title, url, date, source: 'GPFans' };
      }).filter(item => item.title && /red bull|verstappen/i.test(item.title));
    });
    results.push(...gpFansData);
  } catch (err) {
    console.error('Error fetching GPFans:', err.message);
  }

  // F1Technical
  try {
    await page.goto('https://www.f1technical.net/news', { waitUntil: 'networkidle2' });
    const f1TechData = await page.evaluate(() => {
      const articles = Array.from(document.querySelectorAll('.news-article'));
      return articles.map(article => {
        const a = article.querySelector('a');
        const title = a?.innerText?.trim();
        const url = a?.href;
        const date = new Date().toISOString().split('T')[0];
        return { title, url, date, source: 'F1Technical' };
      }).filter(item => item.title && /red bull|verstappen/i.test(item.title));
    });
    results.push(...f1TechData);
  } catch (err) {
    console.error('Error fetching F1Technical:', err.message);
  }

  await browser.close();
  fs.writeFileSync('redbull-news.json', JSON.stringify(results.slice(0, 10), null, 2));
  console.log('✅ Puppeteer scrape complete. News items:', results.length);
})();