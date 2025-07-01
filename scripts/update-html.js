const fs = require('fs');
const { fetchKlasemen } = require('./scrape');

(async () => {
  const htmlPath = 'index.html';
  const html = fs.readFileSync(htmlPath, 'utf8');

  const newContent = await fetchKlasemen();
  const updated = html.replace(
    /<div id="klasemen">([\s\S]*?)<\/div>/,
    `<div id="klasemen">\n${newContent}\n</div>`
  );

  fs.writeFileSync(htmlPath, updated);
  console.log('✅ index.html updated successfully!');
})();