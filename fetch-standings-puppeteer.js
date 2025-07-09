const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.goto('https://www.formula1.com/en/results.html/2025/drivers.html', {
    waitUntil: 'networkidle2'
  });

  const data = await page.evaluate(() => {
    const rows = document.querySelectorAll('.resultsarchive-table tbody tr');
    return Array.from(rows).map(row => {
      const cells = row.querySelectorAll('td');
      return {
        position: cells[1]?.innerText.trim(),
        driver: cells[2]?.innerText.trim(),
        constructor: cells[3]?.innerText.trim(),
        points: cells[4]?.innerText.trim()
      };
    });
  });

  await browser.close();

  fs.writeFileSync('standings.json', JSON.stringify(data, null, 2));
  console.log(`✅ F1 standings berhasil disimpan. Jumlah pembalap: ${data.length}`);
})();
