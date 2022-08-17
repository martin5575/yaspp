import { Component, Input, OnInit } from '@angular/core';
import { Match } from '@yaspp-nx/open-liga-db';

@Component({
  selector: 'yaspp-nx-match-day',
  templateUrl: './match-day.component.html',
  styleUrls: ['./match-day.component.scss'],
})
export class MatchDayComponent implements OnInit {
  constructor() {}

  @Input()
  public matchDay! : Match[]

  @Input() leagueKey! : string|undefined
  @Input() year! : string|undefined

  ngOnInit(): void {}

  get league() {
    if (!this.matchDay || this.matchDay.length===0)
      return "Please select a league"

    const match = this.matchDay[0]
    return match.LeagueName
  }

  get round() {
    if (!this.matchDay || this.matchDay.length===0)
      return "Please select a league"

    const match = this.matchDay[0]
    return match.Group.GroupName
  }

}
