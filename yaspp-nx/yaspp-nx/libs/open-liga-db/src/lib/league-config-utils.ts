import { LeagueConfig } from '@yaspp-nx/open-liga-db'
import rawLeagues from './leagues.json'

const leagueConfig : LeagueConfig = <LeagueConfig>rawLeagues;

export class LeagueConfigUtils {
    getLeaguesConfig() : LeagueConfig {
        return leagueConfig
    }
}