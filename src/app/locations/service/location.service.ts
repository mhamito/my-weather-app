import {Injectable} from "@angular/core";
import {HttpClient, HttpParams} from "@angular/common/http";
import {Observable} from "rxjs";
import {map} from "rxjs/operators";

import {SharedService} from "../../shared/service/shared.service";
import {ConvertToLocationModel, LocationModel} from "../model/location.model";
import {LocationResponse} from "../model/location.response.model";
import {WeatherConditionsConstants} from "../../shared/constants/weather-conditions.constants";

@Injectable({providedIn: 'root'})
export class LocationService {
  locations: LocationModel[] = [];

  constructor(private http: HttpClient, private sharedService: SharedService){}

  reloadLocations(): LocationModel[] {
    const locationsStorage = localStorage.getItem(WeatherConditionsConstants.STORAGE_KEY);
    if(!!locationsStorage){
      this.locations = JSON.parse(locationsStorage);
    };
    return this.locations.slice();
  }

  addNewLocation(location: LocationModel): LocationModel[] {
    const index = this.locations.findIndex(item => item.zipCode === location.zipCode);
    if(index >= 0){
      this.locations[index] = location;
      this.sharedService.warningDisplaying.next('The location you want to add already exists, the corresponding weather conditions have been updated');
    } else {
      this.locations.push(location);
    };
    localStorage.setItem(WeatherConditionsConstants.STORAGE_KEY, JSON.stringify(this.locations.slice()));
    return this.locations.slice();
  }

  removeLocation(index: number): LocationModel[] {
    this.locations.splice(index, 1);
    localStorage.setItem(WeatherConditionsConstants.STORAGE_KEY, JSON.stringify(this.locations.slice()));
    return this.locations.slice();
  }

  getLocation(zipCode: string): Observable<LocationModel> {
    return this.http.get<LocationResponse>('https://api.openweathermap.org/data/2.5/weather',
      {params: new HttpParams().set(WeatherConditionsConstants.ZIP_HTTP_PARAM, zipCode)}).pipe(
      map((response: LocationResponse) => {
        const result = this.convertResponseToLocationModel(response, zipCode);
        if(result.missingFields.length > 0){
          this.sharedService.sendErrorMessage(result.missingFields);
        }
        return result.locationModel;
      }));
  }

  private convertResponseToLocationModel(locationResponse: LocationResponse, zipCode: string): ConvertToLocationModel {
    let locationModel: LocationModel = Object.assign({zipCode: zipCode, locationName: ''});
    let missingFields: string[] = [];

    if (!locationResponse.name) {
      missingFields.push('location name');
    }else {
      locationModel.locationName = locationResponse.name;
    }

    if(!locationResponse.weather || !locationResponse.weather[0] || !locationResponse.weather[0].main){
      missingFields.push('current weather condition');
    }else {
      const currentCondition = locationResponse.weather[0].main === WeatherConditionsConstants.RESPONSE_CONDITION_WEATHER ?
        WeatherConditionsConstants.EXPECTED_CONDITION_WEATHER : locationResponse.weather[0].main;
      locationModel.currentCondition = currentCondition ;
      locationModel.icon = WeatherConditionsConstants.WEATHER_ICON.hasOwnProperty(currentCondition) ?
        WeatherConditionsConstants.WEATHER_ICON[currentCondition] : WeatherConditionsConstants.WEATHER_ICON.Clouds;
    }

    if(!locationResponse.main || !locationResponse.main.temp){
      missingFields.push('current temperature');
    }else {
      locationModel.currentTemperature = locationResponse.main.temp;
    }

    if(!locationResponse.main || !locationResponse.main.temp_max){
      missingFields.push('temperature max');
    }else {
      locationModel.maxTemperature = locationResponse.main.temp_max;
    }

    if(!locationResponse.main || !locationResponse.main.temp_min){
      missingFields.push('temperature min');
    }else {
      locationModel.minTemperature = locationResponse.main.temp_min;
    }

    return {locationModel: locationModel, missingFields: missingFields};
  }
}


