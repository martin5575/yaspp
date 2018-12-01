var download = require('download-file')

const getUrl = (league, season) => `https://www.openligadb.de/api/getmatchdata/${league}/${season}`

const getOptions = (league, season) => ({
    directory: `./download/${league}/`,
    filename: `${season}.json`
})

const delay = 5000
let i = 0;
const downloadSeasons = (league) => {
    for (let season = 2017; season >= 1963; --season) {
        const url = getUrl(league, season)
        const options = getOptions(league, season)

        const downloadFile = (url, options) => {
            download(url, options, function (err) {
                if (err) throw err
                console.log(`${league}: ${season}`)
            })
        }
        setTimeout(download, ++i * delay, url, options)
    }
}

['bl1', 'bl2'].forEach(league => {
    downloadSeasons(league)
});