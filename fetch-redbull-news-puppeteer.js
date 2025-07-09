const puppeteer = require('puppeteer');
const fs = require('fs');

async function scrapeNews(site) {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  let news = [];

  try {
    await page.goto(site.url, { waitUntil: 'domcontentloaded', timeout: 60000 });

    news = await page.evaluate((site) => {
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
      articleSelector: '.article-list .article',
      titleSelector: 'h2',
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
      name: 'PlanetF1',
      url: 'https://www.planetf1.com/tag/red-bull',
      articleSelector: '.td_module_10',
      titleSelector: '.entry-title',
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
      name: 'RacingNews365',
      url: 'https://racingnews365.com/f1/teams/red-bull-racing',
      articleSelector: '.news-list-item',
      titleSelector: 'h3',
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
