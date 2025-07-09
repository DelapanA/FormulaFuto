const puppeteer = require('puppeteer');
const fs = require('fs');

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function scrapeNews(site) {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  let news = [];

  try {
    await page.goto(site.url, { waitUntil: 'networkidle0', timeout: 60000 });
    await delay(4000); // Beri waktu render JavaScript

    const count = await page.$$eval(site.articleSelector, els => els.length);
    console.log(`📌 ${site.name}: ditemukan ${count} elemen '${site.articleSelector}'`);

    news = await page.evaluate(site => {
      const items = [];
      document.querySelectorAll(site.articleSelector).forEach(el => {
        const title = el.querySelector(site.titleSelector)?.innerText?.trim();
        const link = el.querySelector(site.linkSelector)?.href;

        if (title && link) {
          items.push({
            source: site.name,
            title,
            url: link,
            date: new Date().toISOString().slice(0, 10)
          });
        }
      });
      return items;
    }, site);

  } catch (err) {
    console.error(`❌ Error fetching ${site.name}:`, err.message);
  }

  await browser.close();
  return news;
}

(async () => {
  const sources = [
    {
      name: 'GPFans',
      url: 'https://www.gpfans.com/en/f1-news/red-bull/',
      articleSelector: 'article.card',
      titleSelector: 'h3.card-title',
      linkSelector: 'a.card-link'
    },
    {
      name: 'PlanetF1',
      url: 'https://www.planetf1.com/tag/red-bull',
      articleSelector: '.td_module_10',
      titleSelector: 'h3.entry-title',
      linkSelector: 'a'
    },
    {
      name: 'Motorsport',
      url: 'https://www.motorsport.com/f1/news/red-bull/',
      articleSelector: '.ms-item',
      titleSelector: '.ms-item__title',
      linkSelector: 'a'
    },
    {
      name: 'F1Technical',
      url: 'https://www.f1technical.net/news/by/team/Red%20Bull',
      articleSelector: '.newsitem',
      titleSelector: '.title',
      linkSelector: 'a'
    },
    {
      name: 'RacingNews365',
      url: 'https://racingnews365.com/f1/teams/red-bull-racing',
      articleSelector: '.news-listing__item',
      titleSelector: '.news-listing__title',
      linkSelector: 'a'
    }
  ];

  let allNews = [];
  for (const site of sources) {
    const news = await scrapeNews(site);
    allNews = allNews.concat(news);
  }

  fs.writeFileSync('redbull-news.json', JSON.stringify(allNews, null, 2));
  console.log(`✅ Scrape selesai. Total berita: ${allNews.length}`);
})();
