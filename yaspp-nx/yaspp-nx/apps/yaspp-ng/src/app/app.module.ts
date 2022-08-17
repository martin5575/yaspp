import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { MatchComponent } from './match/match.component';
import { MatchDayComponent } from './match-day/match-day.component';

import { PrimeNGModule } from './primeng.module'
import { MainMenuComponent } from './main-menu/main-menu.component';
import { RouterModule } from '@angular/router';
import { Routes } from '@angular/router';
import { SeasonComponent } from './season/season.component';
import { DropDownSelectorComponent } from './drop-down-selector/drop-down-selector.component';
import { TableComponent } from './table/table.component';
import { TeamStatsComponent } from './team-stats/team-stats.component';


const appRoutes: Routes = [
  { path: 'welcome', component: WelcomeComponent },
  { path: 'season/:leagueKey/:year', component: SeasonComponent },
  { path: '',
    redirectTo: '/welcome',
    pathMatch: 'full'
  },
//  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    WelcomeComponent,
    MatchComponent,
    MatchDayComponent,
    MainMenuComponent,
    DropDownSelectorComponent,
    SeasonComponent,
    TableComponent,
    TeamStatsComponent
  ],
  imports: [
    RouterModule.forRoot(
      appRoutes
    ),
    BrowserAnimationsModule,
    BrowserModule, 
    HttpClientModule, 
    PrimeNGModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
