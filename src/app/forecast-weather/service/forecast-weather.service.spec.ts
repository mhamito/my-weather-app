import {inject, TestBed} from "@angular/core/testing";
import {HttpClientTestingModule, HttpTestingController} from "@angular/common/http/testing";
import {HttpParams} from "@angular/common/http";
import {DatePipe} from "@angular/common";
import {of} from "rxjs";

import {ForecastWeatherService} from "./forecast-weather.service";
import {SharedService} from "../../shared/service/shared.service";
import {ForecastWeatherModel} from "../model/forecast-weather.model";
import {ForecastWeatherResponse} from "../model/forecast-weather-response.model";
import {WeatherConditionsConstants} from "../../shared/constants/weather-conditions.constants";

describe('ForecastWeatherService', () => {
  let forecastWeatherService: ForecastWeatherService;
  let sharedServiceSpy: jasmine.SpyObj<SharedService>;
  let datePipeSpy: jasmine.SpyObj<DatePipe>;
  let httpClientSpy: { get: jasmine.Spy };
  let httpController: HttpTestingController;

  const mockForecastWeather: ForecastWeatherModel = Object.assign({zipCode: '95742', locationName: 'Rancho Cordova', conditions: []});
  mockForecastWeather.conditions.push({weatherDate: 'Monday, Nov 08', weatherConditions: 'Rain', minTemperature: 6.72, maxTemperature: 15.44, icon: 'https://www.angulartraining.com/images/weather/rain.png'});
  mockForecastWeather.conditions.push({weatherDate: 'Tuesday, Nov 09', weatherConditions: 'Rain', minTemperature: 11.03, maxTemperature: 14.75, icon: 'https://www.angulartraining.com/images/weather/rain.png'});
  mockForecastWeather.conditions.push({weatherDate: 'Wednesday, Nov 10', weatherConditions: 'Clouds', minTemperature: 10.7, maxTemperature: 18.11, icon: 'https://www.angulartraining.com/images/weather/clouds.png'});
  mockForecastWeather.conditions.push({weatherDate: 'Thursday, Nov 11', weatherConditions: 'Snow', minTemperature: 10.55, maxTemperature: 19.69, icon: 'https://www.angulartraining.com/images/weather/snow.png'});
  mockForecastWeather.conditions.push({weatherDate: 'Friday, Nov 12', weatherConditions: 'Sunny', minTemperature: 12.17, maxTemperature: 21.07, icon: 'https://www.angulartraining.com/images/weather/sun.png'});

  const mockForecastResponse: ForecastWeatherResponse = Object.assign({city: {name: 'Rancho Cordova'},
    list: [{dt: 1636398000, weather: [{main: 'Rain'}], temp: {min: 6.72, max: 15.44}},
      {dt: 1636484400, weather: [{main: 'Rain'}], temp: {min: 11.03, max: 14.75}},
      {dt: 1636570800, weather: [{main: 'Clouds'}], temp: {min: 10.7, max: 18.11}},
      {dt: 1636657200, weather: [{main: 'Snow'}], temp: {min: 10.55, max: 19.69}},
      {dt: 1636743600, weather: [{main: 'Clear'}], temp: {min: 12.17, max: 21.07}}]});

  const mockForecastWeatherWithMissingFields: ForecastWeatherModel = Object.assign({zipCode: '95742', locationName: '', conditions: []});
  mockForecastWeatherWithMissingFields.conditions.push(Object.assign({weatherDate: 'Monday, Nov 08', minTemperature: 6.72, maxTemperature: 15.44}));
  mockForecastWeatherWithMissingFields.conditions.push(Object.assign({weatherDate: 'Tuesday, Nov 09', weatherConditions: 'Rain', minTemperature: 11.03, maxTemperature: 15.75, icon: 'https://www.angulartraining.com/images/weather/rain.png'}));
  mockForecastWeatherWithMissingFields.conditions.push(Object.assign({weatherDate: 'Wednesday, Nov 10', weatherConditions: 'Clouds', minTemperature: 10.7, maxTemperature: 18.11, icon: 'https://www.angulartraining.com/images/weather/clouds.png'}));
  mockForecastWeatherWithMissingFields.conditions.push(Object.assign({weatherConditions: 'Snow', maxTemperature: 19.69, icon: 'https://www.angulartraining.com/images/weather/snow.png'}));
  mockForecastWeatherWithMissingFields.conditions.push(Object.assign({weatherDate: 'Friday, Nov 12', minTemperature: 12.17}));

  const mockForecastResponseWithMissingFields: ForecastWeatherResponse = Object.assign({city: {},
    list: [{dt: 1636398000, temp: {min: 6.72, max: 15.44}},
      {dt: 1636484400, weather: [{main: 'Rain'}], temp: {min: 11.03, max: 15.75}},
      {dt: 1636570800, weather: [{main: 'Clouds'}], temp: {min: 10.7, max: 18.11}},
      {weather: [{main: 'Snow'}], temp: {max: 19.69}},
      {dt: 1636743600, weather: [], temp: {min: 12.17}}]});

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ForecastWeatherService,
        {provide: SharedService, useValue: sharedServiceSpy},
        DatePipe
      ],
      imports: [HttpClientTestingModule]
    });
  });

  beforeEach(inject([ForecastWeatherService, HttpTestingController],
    (_forecastWeatherService: ForecastWeatherService, _httpController: HttpTestingController) => {
    forecastWeatherService = _forecastWeatherService;
    httpController = _httpController;
  }));

  beforeEach(() => {
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['get']);
    sharedServiceSpy = jasmine.createSpyObj('SharedService', ['sendErrorMessage']);
  });

  afterEach(inject([HttpTestingController], (httpMock: HttpTestingController) => {
    httpMock.verify();
  }));

  it('should be created', () => {
    expect(forecastWeatherService).toBeTruthy();
  });

  it('should use GET to retrieve forecast weather for 5 day', () => {
    forecastWeatherService.getForecastWeather('95742').subscribe();
    const httpRequest = httpController.expectOne('http://api.openweathermap.org/data/2.5/forecast/daily?zip=95742&cnt=5');
    expect(httpRequest.request.method).toEqual('GET');
  });

  it('should call the right url', ()=> {
    let httpParams: HttpParams = new HttpParams();
    httpParams = httpParams.append(WeatherConditionsConstants.ZIP_HTTP_PARAM, '95742');
    httpParams = httpParams.append(WeatherConditionsConstants.CNT_HTTP_PARAM, '5');

    forecastWeatherService = new ForecastWeatherService(<any>httpClientSpy, datePipeSpy, sharedServiceSpy);
    httpClientSpy.get.and.returnValue(of(jasmine.any));
    forecastWeatherService.getForecastWeather('95742').subscribe(() => {
      expect(httpClientSpy.get).toHaveBeenCalledWith('http://api.openweathermap.org/data/2.5/forecast/daily', {params: httpParams});
    })
  });

  it('should get forecast weather for 5 day', () => {
    forecastWeatherService.getForecastWeather('95742').subscribe(res => {
      expect(res).toEqual(mockForecastWeather);
    });
    const httpRequest = httpController.expectOne('http://api.openweathermap.org/data/2.5/forecast/daily?zip=95742&cnt=5');
    httpRequest.flush(mockForecastResponse);
  });

  it('should get forecast weather for 5 day without missing fields', () => {
    forecastWeatherService.getForecastWeather('95742').subscribe(res => {
      expect(res).toEqual(mockForecastWeatherWithMissingFields);
    });
    const httpRequest = httpController.expectOne('http://api.openweathermap.org/data/2.5/forecast/daily?zip=95742&cnt=5');
    httpRequest.flush(mockForecastResponseWithMissingFields);
  });

  it('should return no missing fields', () => {
     const noFieldsString = forecastWeatherService['convertResponseToForecastWeatherModel'](mockForecastResponse, '95742');
     expect(noFieldsString.missingFields).toEqual([]);
  });

  it('should return the right missing fields', () => {
    const expectedMissingFields: string[] = ['location name', 'weather condition of index 0', 'weather date of index 3', 'min temperature of index 3', 'weather condition of index 4', 'max temperature of index 4'];
    const noFieldsString: string[] = forecastWeatherService['convertResponseToForecastWeatherModel'](mockForecastResponseWithMissingFields, '95742').missingFields;
    expect(noFieldsString).toEqual(expectedMissingFields);
  });

})
