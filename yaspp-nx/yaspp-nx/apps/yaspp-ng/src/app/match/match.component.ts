import { Component, Input, OnInit } from '@angular/core';
import { Match, MatchResult } from '@yaspp-nx/open-liga-db';
import moment  from 'moment';

@Component({
  selector: 'yaspp-nx-match',
  templateUrl: './match.component.html',
  styleUrls: ['./match.component.scss'],
})
export class MatchComponent implements OnInit {
  constructor() {}

  @Input()
  public match!: Match;

  @Input()
  public leagueKey! : string|undefined;
  @Input()
  public year! : string|undefined;


  public expanded: boolean = false;

  ngOnInit(): void {}

  toggleExpanded() {
    this.expanded = !this.expanded
  }

  get Team1() {
    return this.match.Team1.Hashtag?.substring(1,4)
  }

  get Team2() {
    return this.match.Team2.Hashtag?.substring(1,4)
  }

  
  get Team1IconUrl() {
    return this.match.Team1.TeamIconUrl
  }

  get Team2IconUrl() {
    return this.match.Team2.TeamIconUrl
  }

  get finalScore() : MatchResult {
    return this.match.MatchResults && this.match.MatchResults[0]
  }

  get PointsTeam1() {
    if (!this.finalScore) return '-'
    return this.finalScore.PointsTeam1
  }

  get PointsTeam2() {
    if (!this.finalScore) return '-'
    return this.finalScore.PointsTeam2
  }

  get goals() {
    return this.match.Goals;
  }

  get matchDate() {
    return moment(this.match.MatchDateTime).format('DD.MM LT')
  }

  get matchLocation() {
    return this.match.Location
  }

  get matchViewers() {
    return this.match.NumberOfViewers ? `(${this.match.NumberOfViewers})` : ''
  }
}
