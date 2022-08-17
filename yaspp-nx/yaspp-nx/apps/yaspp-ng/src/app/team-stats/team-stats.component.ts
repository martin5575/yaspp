import { Component, Input, OnInit } from '@angular/core';
import { BlTableTeam, LeagueConfigUtils, OpenLigaDbService } from '@yaspp-nx/open-liga-db';
import { AdditionalDataUtils } from 'libs/open-liga-db/src/lib/additional-data-utils';

@Component({
  selector: 'yaspp-nx-team-stats',
  templateUrl: './team-stats.component.html',
  styleUrls: ['./team-stats.component.scss'],
})
export class TeamStatsComponent implements OnInit {

  @Input() leagueKey! : string|undefined
  @Input() year! : string|undefined
  @Input() team1Id! : number;
  @Input() team2Id! : number;

  minGoals : number = 0
  maxGoals : number = 3
  goalsTeam1 : number | undefined
  goalsTeam2 : number | undefined

  minGoalsAgainst : number = 0
  maxGoalsAgainst : number = 3
  goalsAgainstTeam1 : number | undefined
  goalsAgainstTeam2 : number | undefined

  minPoints : number = 0
  maxPoints : number = 3
  pointsTeam1 : number | undefined
  pointsTeam2 : number | undefined

  team1Name : string | undefined
  team2Name : string | undefined
  team1Color1 : string = "blue"
  team1Color2 : string = "light-blue"
  team2Color1 : string = "green"
  team2Color2 : string = "light-green"


  constructor(private openLigaDbService : OpenLigaDbService) {}

  ngOnChanges(): void {
    this.openLigaDbService.getTable(this.leagueKey, this.year)
    .subscribe(x => this.calculateStats(x))
    this.team1Color1 = AdditionalDataUtils.getColor1(this.team1Id)
    this.team1Color2 = AdditionalDataUtils.getColor2(this.team1Id)
    this.team2Color1 = AdditionalDataUtils.getColor1(this.team2Id)
    this.team2Color2 = AdditionalDataUtils.getColor2(this.team2Id)
  }

  ngOnInit(): void {
  }

  calculateStats(table: BlTableTeam[]): void {
    const avgStats = table.map(x=> ({
      points: x.Points/x.Matches,
      goals: x.Goals/x.Matches,
      goalsAgainst: x.OpponentGoals/x.Matches,
      teamId: x.TeamInfoId,
      teamName: x.ShortName
    }))
    const goals = avgStats.map(x=>x.goals)
    const goalsAgainst = avgStats.map(x=>x.goalsAgainst)
    const points = avgStats.map(x=>x.points)

    goals.sort((a,b)=>a-b)
    goalsAgainst.sort((a,b)=>a-b)
    points.sort((a,b)=>a-b)

    this.minGoals = goals[0]
    this.maxGoals = goals[goals.length-1]

    this.minGoalsAgainst = goalsAgainst[0]
    this.maxGoalsAgainst = goalsAgainst[goalsAgainst.length-1]

    this.minPoints = points[0]
    this.maxPoints = points[points.length-1]

    const team1Stats = avgStats.find(x=>x.teamId===this.team1Id)
    this.team1Name = team1Stats?.teamName
    this.goalsTeam1 = team1Stats?.goals
    this.goalsAgainstTeam1 = team1Stats?.goalsAgainst
    this.pointsTeam1 = team1Stats?.points


    const team2Stats = avgStats.find(x=>x.teamId===this.team2Id)
    this.team2Name = team2Stats?.teamName
    this.goalsTeam2 = team2Stats?.goals
    this.goalsAgainstTeam2 = team2Stats?.goalsAgainst
    this.pointsTeam2 = team2Stats?.points
    
  }
}
