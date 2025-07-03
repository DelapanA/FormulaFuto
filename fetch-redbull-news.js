// Simpan sebagai fetch-redbull-news.js
const Parser = require('rss-parser');
const fs = require('fs');

const parser = new Parser();
const sources = [
  {
    name: "GPBlog",
    url: "https://www.gpblog.com/en/news/rss",
    filter: /red bull|verstappen/i
  },
  {
    name: "PlanetF1",
    url: "https://www.planetf1.com/feed",
    filter: /red bull|verstappen/i
  }
];

(async () => {
  let allItems = [];

  for (const source of sources) {
    try {
      const feed = await parser.parseURL(source.url);
      const filtered = feed.items
        .filter(item => source.filter.test(item.title))
        .slice(0, 3)
        .map(item => ({
          title: item.title,
          source: source.name,
          url: item.link,
          date: item.pubDate || new Date().toISOString().split('T')[0]
        }));
      allItems.push(...filtered);
    } catch (err) {
      console.error("Error fetching", source.name, err);
    }
  }

  fs.writeFileSync("redbull-news.json", JSON.stringify(allItems, null, 2));
})();
