const puppeteer = require('puppeteer');
const fs = require('fs');

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

(async () => {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();

  try {
    await page.goto('https://www.formula1.com/en/results.html/2025/drivers.html', {
      waitUntil: 'networkidle0',
      timeout: 60000
    });

    await delay(3000); // Ganti waitForTimeout manual
    await page.waitForSelector('.resultsarchive-table tbody tr', { timeout: 15000 });

    const data = await page.evaluate(() => {
      const rows = document.querySelectorAll('.resultsarchive-table tbody tr');
      return Array.from(rows).map(row => {
        const cells = row.querySelectorAll('td');
        if (cells.length < 5) return null;

        const name = cells[2].innerText.replace(/\n/g, ' ').trim();

        return {
          position: cells[1]?.innerText.trim(),
          driver: name,
          constructor: cells[3]?.innerText.trim(),
          points: cells[4]?.innerText.trim()
        };
      }).filter(Boolean);
    });

    fs.writeFileSync('standings.json', JSON.stringify(data, null, 2));
    console.log(`✅ standings.json berhasil dibuat. Jumlah pembalap: ${data.length}`);
  } catch (err) {
    console.error('❌ Gagal mengambil klasemen:', err.message);
    fs.writeFileSync('standings.json', '[]');
  } finally {
    await browser.close();
  }
})();
