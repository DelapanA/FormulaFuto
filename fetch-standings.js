
const axios = require('axios');
const fs = require('fs');

const url = 'https://ergast.com/api/f1/current/driverStandings.json';

axios.get(url)
  .then(response => {
    const standings = response.data.MRData.StandingsTable.StandingsLists[0].DriverStandings;
    const output = standings.map((driver, index) => ({
      pos: index + 1,
      driver: `${driver.Driver.givenName} ${driver.Driver.familyName}`,
      team: driver.Constructors[0].name,
      points: driver.points
    }));
    fs.writeFileSync('standings.json', JSON.stringify(output, null, 2));
    console.log('Standings updated successfully!');
  })
  .catch(error => {
    console.error('Failed to fetch standings:', error);
  });
