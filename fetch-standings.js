const Parser = require('rss-parser');
const fs = require('fs');

const parser = new Parser();
const sources = [
  {
    name: "GPFans",
    url: "https://www.gpfans.com/en/rss/",
    filter: /red bull|verstappen/i
  },
  {
    name: "F1NewsUK",
    url: "https://www.formula1news.co.uk/feed/",
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
      console.error("Error fetching", source.name, err.message);
    }
  }

  fs.writeFileSync("redbull-news.json", JSON.stringify(allItems, null, 2));
})();