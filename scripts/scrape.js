const axios = require('axios');
const cheerio = require('cheerio');

async function fetchKlasemen() {
  const url = 'https://www.formula1.com/en/results.html/2025/drivers.html';
  const { data } = await axios.get(url);
  const $ = cheerio.load(data);

  const rows = $('table.resultsarchive-table tbody tr');
  let output = '<table class="w-full text-sm border border-white table-auto"><thead class="bg-gray-800 text-white"><tr><th>#</th><th>Nama</th><th>Tim</th><th>Poin</th></tr></thead><tbody>';

  rows.each((i, el) => {
    const columns = $(el).find('td');
    const pos = $(columns[1]).text().trim();
    const name = $(columns[2]).text().trim();
    const team = $(columns[3]).text().trim();
    const points = $(columns[5]).text().trim();
    output += `<tr><td>${pos}</td><td>${name}</td><td>${team}</td><td>${points}</td></tr>`;
  });

  output += '</tbody></table>';
  return output;
}

module.exports = { fetchKlasemen };