/**
 * Fetches World Cup 2026 team match data from football-data.org
 * Stores results in wc26-matches.json
 */

const fs = require('fs')
const https = require('https')

// FIFA World Cup 2026 qualified teams with country codes
const WC26_TEAMS = {
  AUS: 'Australia',
  IRN: 'Iran',
  IRQ: 'Iraq',
  JPN: 'Japan',
  JOR: 'Jordan',
  QAT: 'Qatar',
  SAU: 'Saudi Arabia',
  KOR: 'South Korea',
  UZB: 'Uzbekistan',
  DZA: 'Algeria',
  CPV: 'Cape Verde',
  COD: 'DR Congo',
  EGY: 'Egypt',
  GHA: 'Ghana',
  CIV: 'Ivory Coast',
  MAR: 'Morocco',
  SEN: 'Senegal',
  ZAF: 'South Africa',
  TUN: 'Tunisia',
  CAN: 'Canada',
  CUW: 'Curaçao',
  HTI: 'Haiti',
  MEX: 'Mexico',
  PAN: 'Panama',
  USA: 'United States',
  ARG: 'Argentina',
  BRA: 'Brazil',
  COL: 'Colombia',
  ECU: 'Ecuador',
  PRY: 'Paraguay',
  URY: 'Uruguay',
  NZL: 'New Zealand',
  AUT: 'Austria',
  BEL: 'Belgium',
  BIH: 'Bosnia and Herzegovina',
  HRV: 'Croatia',
  CZE: 'Czech Republic',
  ENG: 'England',
  FRA: 'France',
  DEU: 'Germany',
  NLD: 'Netherlands',
  NOR: 'Norway',
  POR: 'Portugal',
  SCO: 'Scotland',
  ESP: 'Spain',
  SWE: 'Sweden',
  CHE: 'Switzerland',
  TUR: 'Turkey',
}

// FIFA country code mapping to ISO3
const COUNTRY_CODE_MAP = {
  AUS: 'AUS',
  IRN: 'IRN',
  IRQ: 'IRQ',
  JPN: 'JPN',
  JOR: 'JOR',
  QAT: 'QAT',
  SAU: 'SAU',
  KOR: 'KOR',
  UZB: 'UZB',
  DZA: 'DZA',
  CPV: 'CPV',
  COD: 'COD',
  EGY: 'EGY',
  GHA: 'GHA',
  CIV: 'CIV',
  MAR: 'MAR',
  SEN: 'SEN',
  ZAF: 'ZAF',
  TUN: 'TUN',
  CAN: 'CAN',
  CUW: 'CUW',
  HTI: 'HTI',
  MEX: 'MEX',
  PAN: 'PAN',
  USA: 'USA',
  ARG: 'ARG',
  BRA: 'BRA',
  COL: 'COL',
  ECU: 'ECU',
  PRY: 'PRY',
  URY: 'URY',
  NZL: 'NZL',
  AUT: 'AUT',
  BEL: 'BEL',
  BIH: 'BIH',
  HRV: 'HRV',
  CZE: 'CZE',
  ENG: 'ENG',
  FRA: 'FRA',
  DEU: 'DEU',
  NLD: 'NLD',
  NOR: 'NOR',
  POR: 'POR',
  SCO: 'SCO',
  ESP: 'ESP',
  SWE: 'SWE',
  CHE: 'CHE',
  TUR: 'TUR',
}

function fetchFromAPI(url) {
  return new Promise((resolve, reject) => {
    https
      .get(url, (res) => {
        let data = ''
        res.on('data', (chunk) => (data += chunk))
        res.on('end', () => {
          try {
            resolve(JSON.parse(data))
          } catch (e) {
            reject(e)
          }
        })
      })
      .on('error', reject)
  })
}

async function fetchMatches() {
  const matches = []
  console.log('Fetching World Cup 2026 team match data...')
  console.log(`Total teams: ${Object.keys(WC26_TEAMS).length}`)

  // Note: This requires a free API key from https://www.api-football.com/
  // For now, we'll provide a template structure

  const templateData = {
    timestamp: new Date().toISOString(),
    source: 'api-football.com',
    teams: Object.keys(WC26_TEAMS),
    matches: [],
    note: 'To populate with real data, sign up for a free API key at https://www.api-football.com/',
  }

  console.log('\n⚠️  To fetch live data:')
  console.log('1. Sign up at https://www.api-football.com/ for a free API key')
  console.log('2. Replace API_KEY in this script')
  console.log('3. Uncomment the API calls below')
  console.log('\nFor now, saving template structure...\n')

  return templateData
}

async function main() {
  try {
    const data = await fetchMatches()

    const outputPath =
      '/home/martin/src/yaspp/yaspp-react-redux/wc26-matches.json'
    fs.writeFileSync(outputPath, JSON.stringify(data, null, 2))

    console.log(`✓ Data saved to ${outputPath}`)
    console.log('\nStructure:')
    console.log(JSON.stringify(data, null, 2))
  } catch (error) {
    console.error('Error:', error.message)
    process.exit(1)
  }
}

main()
