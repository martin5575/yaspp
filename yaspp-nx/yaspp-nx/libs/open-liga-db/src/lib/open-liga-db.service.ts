import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { empty, Observable, throwError } from 'rxjs';
import { catchError, map, tap, retry } from 'rxjs/operators';
import { Match, Team, Group, GoalGetter, BlTableTeam } from './open-liga-db.module';
import { AdditionalDataUtils } from './additional-data-utils';

@Injectable({
  providedIn: 'root'
})
export class OpenLigaDbService {

  private getCurrentMatchDayUrl(leagueKey:string) {
    return `https://www.openligadb.de/api/getmatchdata/${leagueKey}`
  } 

  private getMatchDaysUrl(leagueKey:string,year:string){

    return `https://www.openligadb.de/api/getavailablegroups/${leagueKey}/${year}`
  } 

  private getGetGoalGettersUrl(leagueKey:string,year:string){
    return `https://www.openligadb.de/api/getgoalgetters/${leagueKey}/${year}`
  } 

  private getGetTableUrl(leagueKey:string,year:string){
    return `https://www.openligadb.de/api/getbltable/${leagueKey}/${year}`
  } 

  constructor(private http: HttpClient) { }

  getCurrentMatchDay(leagueKey: string|undefined): Observable<Match[]> {
    if (!leagueKey) {
      return empty()
    }
    return this.http.get<Match[]>(this.getCurrentMatchDayUrl(leagueKey))
      .pipe(
        tap(x => console.log(x)),
        map(x => this.enrichData(x)),
        catchError(this.handleError('getCurrentMatchDay', []))
      );
  }

  private handleError(functionName:string, data:any) : any {
    console.error(`${functionName} throw an exception.`)
    return data
  }

  private enrichData(matchDay: Match[]) : Match[] {
    for (let match of matchDay) {
      AdditionalDataUtils.enrichAdditionalData(match)
    }
    return matchDay
  }

  getMatchDays(leagueKey: string|undefined, year: string|undefined): Observable<Group[]> {
    if (!leagueKey || !year) {
      return empty()
    }
    return this.http.get<Match[]>(this.getMatchDaysUrl(leagueKey,year))
      .pipe(
        tap(x => console.log(x)),
        map(x => x),
        catchError(this.handleError('getCurrentMatchDay', []))
      );
  }

  getGoalGetters(leagueKey: string|undefined, year: string|undefined): Observable<GoalGetter[]> {
    if (!leagueKey || !year) {
      return empty()
    }
    return this.http.get<Match[]>(this.getGetGoalGettersUrl(leagueKey,year))
      .pipe(
        tap(x => console.log(x)),
        map(x => x),
        catchError(this.handleError('getCurrentMatchDay', []))
      );
  }

  getTable(leagueKey: string|undefined, year: string|undefined): Observable<BlTableTeam[]> {
    if (!leagueKey || !year) {
      return empty()
    }
    return this.http.get<Match[]>(this.getGetTableUrl(leagueKey,year))
      .pipe(
        tap(x => console.log(x)),
        map(x => x),
        catchError(this.handleError('getCurrentMatchDay', []))
      );
  }
}