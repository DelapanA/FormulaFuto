const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

const sources = [
  {
    name: 'GPFans',
    url: 'https://www.gpfans.com/en/news/',
    base: 'https://www.gpfans.com',
    selector: '.ArticleItem',
    title: el => el.find('.ArticleItem__Title').text().trim(),
    url: el => el.find('a').attr('href'),
    date: el => el.find('.ArticleItem__Date').text().trim()
  },
  {
    name: 'F1Technical',
    url: 'https://www.f1technical.net/news',
    base: 'https://www.f1technical.net',
    selector: '.news-article',
    title: el => el.find('h3').text().trim(),
    url: el => el.find('a').attr('href'),
    date: () => new Date().toISOString().split('T')[0]
  }
];

(async () => {
  let news = [];

  for (const source of sources) {
    try {
      const res = await axios.get(source.url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
      const $ = cheerio.load(res.data);
      $(source.selector).each((i, el) => {
        const element = $(el);
        const title = source.title(element);
        const partialUrl = source.url(element);
        const date = source.date(element);

        if (!partialUrl || !title) return; // Validasi penting!

        const href = source.base + partialUrl;

        if (/red bull|verstappen/i.test(title)) {
          news.push({ title, url: href, date, source: source.name });
        }
      });
    } catch (e) {
      console.error(`Error fetching ${source.name}:`, e.message);
    }
  }

  fs.writeFileSync('redbull-news.json', JSON.stringify(news.slice(0, 10), null, 2));
  console.log('✅ redbull-news.json updated with', news.length, 'items.');
})();
