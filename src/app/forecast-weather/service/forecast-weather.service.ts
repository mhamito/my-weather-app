import {DatePipe} from "@angular/common";
import {HttpClient, HttpParams} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {map} from "rxjs/operators";
import {Observable} from "rxjs";

import {SharedService} from "../../shared/service/shared.service";
import {ConvertToForecastWeatherModel, ForecastWeatherModel, Conditions} from "../model/forecast-weather.model";
import {ForecastWeatherResponse} from "../model/forecast-weather-response.model";
import {WeatherConditionsConstants} from "../../shared/constants/weather-conditions.constants";

@Injectable({providedIn: 'root'})
export class ForecastWeatherService {

  constructor(private http: HttpClient, private datePipe: DatePipe, private sharedService: SharedService) {}

  getForecastWeather(zipCode: string): Observable<ForecastWeatherModel>{
    let httpParams: HttpParams = new HttpParams();
    httpParams = httpParams.append(WeatherConditionsConstants.ZIP_HTTP_PARAM,zipCode);
    httpParams = httpParams.append(WeatherConditionsConstants.CNT_HTTP_PARAM, WeatherConditionsConstants.FORECAST_WEATHER_DAYS);

    return this.http.get<ForecastWeatherResponse>('http://api.openweathermap.org/data/2.5/forecast/daily',
      {params: httpParams})
      .pipe(
        map((response: ForecastWeatherResponse) => {
          const result = this.convertResponseToForecastWeatherModel(response, zipCode);
          if(result.missingFields.length > 0){
            this.sharedService.sendErrorMessage(result.missingFields);
          }
          return result.forecastWeatherModel;
        }));
  }

  private convertResponseToForecastWeatherModel(forecastWeatherResponse: ForecastWeatherResponse, zipCode: string): ConvertToForecastWeatherModel {
    let forecastWeather = Object.assign({zipCode: zipCode, locationName: '', conditions: []});
    let missingFields: string[] = [];

    if(!forecastWeatherResponse.city || !forecastWeatherResponse.city.name){
      missingFields.push('location name');
    } else {
      forecastWeather.locationName = forecastWeatherResponse.city.name;
    }

    if (!forecastWeatherResponse.list) {
      missingFields.push('list of conditions');
    } else {
      const temperatures = forecastWeatherResponse.list;
      let index = 0;
      for (let temperature of temperatures) {
        let condition: Conditions = Object.assign({});
        if(!temperature.weather || !temperature.weather[0] || !temperature.weather[0].main){
          missingFields.push('weather condition of index ' + index);
        }else {
          const weatherConditions = temperature.weather[0].main === WeatherConditionsConstants.RESPONSE_CONDITION_WEATHER ?
            WeatherConditionsConstants.EXPECTED_CONDITION_WEATHER : temperature.weather[0].main;
          condition.weatherConditions = weatherConditions;
          condition.icon = WeatherConditionsConstants.WEATHER_ICON.hasOwnProperty(weatherConditions) ?
            WeatherConditionsConstants.WEATHER_ICON[weatherConditions] : WeatherConditionsConstants.WEATHER_ICON.Clouds;
        }

        if(!temperature.dt) {
          missingFields.push('weather date of index ' + index);
        } else {
          condition.weatherDate = this.datePipe.transform(temperature.dt * 1000, 'EEEE, LLL dd') as string;
        }

        if(!temperature.temp || !temperature.temp.min){
          missingFields.push('min temperature of index ' + index);
        } else {
          condition.minTemperature = temperature.temp.min;
        }

        if(!temperature.temp || !temperature.temp.max){
          missingFields.push('max temperature of index ' + index);
        } else {
          condition.maxTemperature = temperature.temp.max;
        }
        forecastWeather.conditions.push(condition);
        index++
      }
    }

    return Object.assign({forecastWeatherModel: forecastWeather, missingFields: missingFields});
  }
}
