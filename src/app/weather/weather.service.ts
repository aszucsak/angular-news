import { Injectable } from '@angular/core';
import { HttpParams, HttpClient } from '@angular/common/http';
import { of, Observable, throwError } from 'rxjs';
import { map, switchMap, pluck, mergeMap, filter, toArray, share, tap, catchError } from 'rxjs/operators';
import { NotificationsService } from '../notifications/notifications.service';

interface OpenWeatherResponse {
  list: {
    dt_txt: string;
    main: {
      temp: number;
    }
  }[];
}

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  private url = 'https://api.openweathermap.org/data/2.5/forecast'

  constructor(
    private http: HttpClient,
    private notificationsService: NotificationsService,
  ) { }

  // // ! fixed coordinates just for testing purposes
  // getForecast() {
  //   return of({ latitude: 47.5008829, longitude: 19.065887 })
  //     .pipe(
  //       map(coords => {
  //         return new HttpParams()
  //           .set('lat', String(coords.latitude))
  //           .set('lon', String(coords.longitude))
  //           .set('units', 'metric')
  //           .set('appid', '7e6d097ee75a54566565482c4434ced7');
  //       }),
  //       switchMap(params => (
  //         this.http.get<OpenWeatherResponse>(this.url, { params })
  //       )),
  //       pluck('list'),
  //       mergeMap(value => of(...value)),
  //       filter((value, index) => index % 8 === 0),
  //       map(value => {
  //         return {
  //           dateString: value.dt_txt,
  //           temp: value.main.temp
  //         };
  //       }),
  //       toArray(),
  //       share()
  //     );
  // }

  getForecast() {
    return this.getCurrentLocation()
      .pipe(
        map(coords => {
          return new HttpParams()
            .set('lat', String(coords.latitude))
            .set('lon', String(coords.longitude))
            .set('units', 'metric')
            .set('appid', '7e6d097ee75a54566565482c4434ced7');
        }),
        switchMap(params => (
          this.http.get<OpenWeatherResponse>(this.url, { params })
        )),
        pluck('list'),
        mergeMap(value => of(...value)),
        filter((value, index) => index % 8 === 0),
        map(value => {
          return {
            dateString: value.dt_txt,
            temp: value.main.temp
          };
        }),
        toArray()
      );
  }

  getCurrentLocation() {
    return new Observable<Coordinates>((observer) => {
      window.navigator.geolocation.getCurrentPosition(
        (position) => {
          if (position.coords) {
            observer.next(position.coords);
          }
          observer.complete();
        },
        (err) => {
          observer.error(err)
        }
      );
    }).pipe(
      tap(() => {
        this.notificationsService.addSuccess('Got your location');
      }),
      catchError(() => {
        this.notificationsService.addError('Failed to get your location');
        return of({ latitude: 47.5008829, longitude: 19.065887 });
      })
    );
  }
}
