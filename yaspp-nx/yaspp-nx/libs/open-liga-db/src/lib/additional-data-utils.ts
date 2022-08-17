import { Match, Team } from '@yaspp-nx/open-liga-db'
import { AdditionalData } from '@yaspp-nx/open-liga-db'
import rawAdditionalData from './additionaldata.json'

const additionalData : AdditionalData = <AdditionalData>rawAdditionalData;
const defaultColor1 = "blue"
const defaultColor2 = "light-blue"

export class AdditionalDataUtils {
    static enrichTeamData(team: Team) {
        let additionalTeamData = additionalData.teams.find(x => x.teamId===team.TeamId)
        team.Hashtag = additionalTeamData && additionalTeamData.hashtag || `~${team.ShortName.substring(0,3).toUpperCase()}`
        team.Color1 = additionalTeamData && additionalTeamData.color1 || defaultColor1
        team.Color2 = additionalTeamData && additionalTeamData.color2 || defaultColor2
      }
    
      static enrichAdditionalData(match: Match) {
          this.enrichTeamData(match.Team1)
          this.enrichTeamData(match.Team2)
      }

      static getColor1(teamId:number) {
        let data = additionalData.teams.find(x=>x.teamId===teamId)
        return data && data.color1 || defaultColor1
      }

      static getColor2(teamId:number) {
        let data = additionalData.teams.find(x=>x.teamId===teamId)
        return data && data.color2 || defaultColor2
      }
}

