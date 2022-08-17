import { MegaMenuItem, MenuItem} from 'primeng/api';
import { Component, OnInit, Output } from '@angular/core';
import { LeagueConfigUtils } from '@yaspp-nx/open-liga-db'

@Component({
  selector: 'yaspp-nx-main-menu',
  templateUrl: './main-menu.component.html',
  styleUrls: ['./main-menu.component.scss'],
})
export class MainMenuComponent implements OnInit {
  
  items: MegaMenuItem[] = []

  constructor() {}

  ngOnInit(): void {
    const leagueConfig = new LeagueConfigUtils()
    const leaguesConfig = leagueConfig.getLeaguesConfig()
    const leaguesMenu = leaguesConfig.leaguesAndSeasons.map(x=>
      [{
        label: x.key, 
        items: x.seasons.map(y=>
          ({
            label: y.toString(),
            routerLink: ['/season', x.key, y.toString()]
          })),
        
      }]
    )

    this.items = [
      {
        label: 'Home', icon: 'pi pi-fw pi-home',
        routerLink: ['/welcome']
      },
      {
          label: 'Saisons', icon: 'pi pi-fw pi-globe',
          items: leaguesMenu
      }
    ]
  }
}

