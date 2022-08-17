import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OpenLigaDbService } from '@yaspp-nx/open-liga-db';

@Component({
  selector: 'yaspp-nx-season',
  templateUrl: './season.component.html',
  styleUrls: ['./season.component.scss'],
})
export class SeasonComponent implements OnInit {

  leagueKey:string|undefined
  year:string|undefined
  matchDays:any[] = []


  constructor(private activeRoute: ActivatedRoute, 
    private openLigaDbService: OpenLigaDbService) {}

  ngOnInit(): void {
    this.activeRoute.params.subscribe(routeParams => {
      this.leagueKey = routeParams['leagueKey']
      this.year = routeParams['year']
      this.openLigaDbService.getMatchDays(this.leagueKey, this.year)
        .subscribe(x => this.matchDays = x)
    });
  }

  onMatchDayChanged(matchDay: string){

  }

}
