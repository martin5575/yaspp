import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { BlTableTeam, OpenLigaDbService } from '@yaspp-nx/open-liga-db';
import { mean, sum } from 'lodash';
import { map } from 'rxjs';

@Component({
  selector: 'yaspp-nx-match-bets',
  templateUrl: './match-bets.component.html',
  styleUrls: ['./match-bets.component.scss'],
})
export class MatchBetsComponent implements OnChanges, OnInit {
  @Input() leagueKey!: string | undefined;
  @Input() year!: string | undefined;
  @Input() team1Id!: number;
  @Input() team2Id!: number;


  teamStats: {goals: number, goalsAgainst: number, teamId: number, teamName: string}[] | undefined;

  win: number | undefined;
  draw: number | undefined;
  loss: number | undefined;

  winOdd: number | undefined;

  constructor(private openLigaDbService: OpenLigaDbService) {}

  ngOnInit(): void {
    this.openLigaDbService
      .getTable(this.leagueKey, this.year)
      .pipe(map(x=> this.calculateStats(x)))
      .subscribe(() => this.calculateBets());
  }

  ngOnChanges(): void {
    this.calculateBets();
  }

  calculateStats(table: BlTableTeam[]): void {
    const avgStats = table.map((x) => ({
      goals: x.Goals / x.Matches,
      goalsAgainst: x.OpponentGoals / x.Matches,
      teamId: x.TeamInfoId,
      teamName: x.ShortName,
    }));

    // const avgGoals = mean(avgStats.map((x) => x.goals));
    // const avgGoalsAgainst = mean(avgStats.map((x) => x.goalsAgainst));
    this.teamStats = avgStats;
  }

    calculateBets(): void{
    const team1Stats = this.teamStats?.find((x) => x.teamId === this.team1Id);
    const team2Stats = this.teamStats?.find((x) => x.teamId === this.team2Id);

    const quotes = this.calcQuotes(team1Stats?.goals, team2Stats?.goals);
    this.win = quotes.win;
    this.draw = quotes.draw;
    this.loss = quotes.loss;

    if (quotes.win !==undefined) {
      this.winOdd = 1.0/quotes.win;
    }


  }
  calcQuotes(
    lambdaHome: number | undefined,
    lambdaAway: number | undefined
  ): {
    win: number | undefined;
    draw: number | undefined;
    loss: number | undefined;
  } {
    if (lambdaHome === undefined || lambdaAway === undefined)
      return { win: undefined, draw: undefined, loss: undefined };
    const max = 20;
    const goalsHome = [];
    for (let i = 0; i < max; i++)
      goalsHome.push(this.poissonDistribution(i, lambdaHome));
    const goalsAway = [];
    for (let i = 0; i < max; i++)
      goalsAway.push(this.poissonDistribution(i, lambdaAway));

    let win = 0.0;
    for (let i = 1; i < max; ++i) {
      for (let j = 0; j < i; ++j) {
        win += goalsHome[i] * goalsAway[j];
      }
    }

    let draw = 0.0;
    for (let i = 0; i < max; ++i) {
      draw += goalsHome[i] * goalsAway[i];
    }

    let loss = 0.0;
    for (let i = 1; i < max; ++i) {
      for (let j = 0; j < i; ++j) {
        loss += goalsHome[j] * goalsAway[i];
      }
    }

    return { win, draw, loss };
  }

  poissonDistribution(k: number, lambda: number): number {
    return Math.pow(lambda, k) * Math.exp(-lambda) / this.faculty(k);
  }

  faculty(k:number): number {
    let result = 1;
    for (let i=1;i<=k;++i) {
      result *= i;
    }
    return result;
  }
}
