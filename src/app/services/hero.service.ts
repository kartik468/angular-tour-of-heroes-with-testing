import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Hero } from '../hero';

import { tap, catchError } from 'rxjs/operators';
import { throwError, of, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HeroService {
  private heroesUrl = 'api/heroes'; // URL to web api

  constructor(private http: HttpClient) {}

  getHeroes(): Observable<Hero[]> {
    return this.http.get<Hero[]>(this.heroesUrl).pipe(
      tap(heroes => {
        console.log('get heroes response', heroes);
      }),
      catchError(this.handleError<Hero[]>('getHeroes', []))
    );
  }

  getHero(id: number): Observable<Hero> {
    return this.http.get<Hero>(this.heroesUrl + `/${id}`).pipe(catchError(this.handleError<any>('getHero')));
  }

  addHero(hero: Hero) {
    return this.http.post(this.heroesUrl, hero).pipe(
      tap(res => {
        console.log('add heroes response', res);
      }),
      catchError(this.handleError('addHeroes', []))
    );
  }

  deleteHero(id: number): Observable<Hero> {
    return this.http.delete<Hero>(this.heroesUrl + `/${id}`).pipe(catchError(this.handleError<any>('getHero')));
  }

  handleError<T>(serviceName: string, fallbackResult?: any) {
    return (err: HttpErrorResponse) => {
      console.error('Error occurred in service: ' + serviceName, err);
      if (fallbackResult) {
        return of(fallbackResult as T);
      }
      return throwError(err);
    };
  }
}
