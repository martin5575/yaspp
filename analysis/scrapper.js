const axios = require('axios');
const fs = require('fs');

function getUrl(league, season) {
    return `https://api.openligadb.de/getmatchdata/${league}/${season}`;
}

function getFilePath(league, season) {
    return `./data/${league}_${season}.json`;
}

function downloadUrl(url, path) {
    axios.get(url)
    .then(response => {
        fs.writeFileSync(path, JSON.stringify(response.data));
        console.log('Data downloaded successfully to', path);
    })
    .catch(error => {
        console.error('Error downloading data:', error);
    });
}

function download(league, season) {
    const filePath = getFilePath(league, season);
    const url = getUrl(league, season);
    downloadUrl(url, filePath);
}

function downloadAll() {
    const leagues = ['bl1', 'bl2', 'bl3'];
    const seasons = Array.from({ length: 60 }, (v, k) => 1964 + k);
    leagues.forEach((league, i) => {
        seasons.forEach((season, j) => {
            setTimeout(() => {
                download(league, season)
            }, 1000 * ( i * seasons.length + j));
        });
    });
}

downloadAll();