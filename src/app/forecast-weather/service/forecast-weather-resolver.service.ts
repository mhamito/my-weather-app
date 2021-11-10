import {ActivatedRouteSnapshot, Resolve} from "@angular/router";
import {HttpErrorResponse} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {Observable, of} from "rxjs";
import {catchError} from "rxjs/operators";

import {ForecastWeatherService} from "./forecast-weather.service";
import {ForecastWeatherModel} from "../model/forecast-weather.model";

@Injectable({providedIn: 'root'})
export class ForecastWeatherResolverService implements Resolve<ForecastWeatherModel | HttpErrorResponse> {

  constructor(private forecastWeatherService: ForecastWeatherService) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ForecastWeatherModel | HttpErrorResponse> {
    const zipCode = <string>(!!route.paramMap.get('zipcode') ? route.paramMap.get('zipcode') : '');
    return this.forecastWeatherService.getForecastWeather(zipCode).pipe(
      catchError ((error: HttpErrorResponse)  => {
        return of(error);
      }));
  }
}
