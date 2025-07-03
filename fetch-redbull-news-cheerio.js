const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

const TARGET_URL = 'https://www.gpfans.com/en/news/';
const KEYWORDS = /red bull|verstappen/i;

async function fetchNews() {
  try {
    const { data } = await axios.get(TARGET_URL, {
      headers: {
        'User-Agent': 'Mozilla/5.0'
      }
    });

    const $ = cheerio.load(data);
    const articles = [];

    $('.ArticleItem').each((i, el) => {
      const title = $(el).find('.ArticleItem__Title').text().trim();
      const url = "https://www.gpfans.com" + $(el).find('a').attr('href');
      const date = $(el).find('.ArticleItem__Date').text().trim();

      if (KEYWORDS.test(title)) {
        articles.push({ title, url, date });
      }
    });

    fs.writeFileSync('redbull-news.json', JSON.stringify(articles.slice(0, 5), null, 2));
    console.log('Red Bull news scraped and saved to redbull-news.json');
  } catch (error) {
    console.error('Error during scraping:', error.message);
  }
}

fetchNews();
