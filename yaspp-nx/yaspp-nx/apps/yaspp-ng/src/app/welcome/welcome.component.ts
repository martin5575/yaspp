import { SimpleChanges } from '@angular/core';
import { Component, Input, OnInit } from '@angular/core';
import { OpenLigaDbService, Match, LeagueConfigUtils, GoalGetter, BlTableTeam } from '@yaspp-nx/open-liga-db'

@Component({
  selector: 'yaspp-nx-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss'],
})
export class WelcomeComponent implements OnInit {
  constructor(private openLigaDbService: OpenLigaDbService) {}

  public matchDay : Match[] = []
  public leagues : any[] = []
  public goalGetters : GoalGetter[] = []
  public table : BlTableTeam[] = []
  public leagueKey : string|undefined 
  public year : string|undefined = '2022'

  ngOnInit(): void {
    const leagueConfig = new LeagueConfigUtils()
    const leaguesConfig = leagueConfig.getLeaguesConfig()
    this.leagues = leaguesConfig.leaguesAndSeasons.map(x=> 
      ({key: x.key, value: x.key}))
  }

  onLeagueKeyChanges(leagueKey: string) {
    this.leagueKey = leagueKey
    this.openLigaDbService.getCurrentMatchDay(leagueKey)
    .subscribe(x=> this.matchDay = x)
    this.openLigaDbService.getGoalGetters(leagueKey, this.year)
    .subscribe(x=>this.goalGetters = x)
    this.openLigaDbService.getTable(leagueKey, this.year)
    .subscribe(x=>this.table = x)
  }

}
