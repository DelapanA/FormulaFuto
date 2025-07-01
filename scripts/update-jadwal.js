const fs = require('fs');
const dayjs = require('dayjs');
const races = require('./jadwal');

const now = dayjs();
let html = '<table class="w-full table-auto border-collapse border border-white text-sm">';
html += '<thead class="bg-gray-800"><tr><th class="border px-2 py-1">#</th><th class="border px-2 py-1">Grand Prix</th><th class="border px-2 py-1">Negara</th><th class="border px-2 py-1">Tanggal</th><th class="border px-2 py-1">Status</th></tr></thead><tbody>';

let nextFound = false;
races.forEach((race, i) => {
  const raceDate = dayjs(race.date);
  let status = 'Selesai';
  let rowClass = 'bg-green-700';

  if (now.isBefore(raceDate) && !nextFound) {
    status = 'Berikutnya';
    rowClass = 'bg-yellow-600 font-bold';
    nextFound = true;
  } else if (now.isSame(raceDate, 'day')) {
    status = 'Live';
    rowClass = 'bg-red-600 font-bold';
  }

  html += `<tr class="${rowClass}"><td class="border px-2 py-1">${i + 1}</td><td class="border px-2 py-1">${race.gp}</td><td class="border px-2 py-1">${race.country}</td><td class="border px-2 py-1">${raceDate.format('D MMMM')}</td><td class="border px-2 py-1">${status}</td></tr>`;
});
html += '</tbody></table>';

const indexPath = 'index.html';
let indexHtml = fs.readFileSync(indexPath, 'utf8');
indexHtml = indexHtml.replace(/<div id="jadwal">([\s\S]*?)<\/div>/, `<div id="jadwal">\n${html}\n</div>`);
fs.writeFileSync(indexPath, indexHtml);
console.log('✅ Jadwal balapan berhasil diperbarui');