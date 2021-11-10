import {HttpClientTestingModule, HttpTestingController} from "@angular/common/http/testing";
import {inject, TestBed} from "@angular/core/testing";
import {DatePipe} from "@angular/common";
import {HttpParams} from "@angular/common/http";
import {of, Subject} from "rxjs";

import {LocationService} from "./location.service";
import {SharedService} from "../../shared/service/shared.service";
import {LocationModel} from "../model/location.model";
import {LocationResponse} from "../model/location.response.model";
import {WeatherConditionsConstants} from "../../shared/constants/weather-conditions.constants";

describe('LocationService', () => {
  let locationService: LocationService;
  let sharedServiceSpy: jasmine.SpyObj<SharedService>;
  let httpClientSpy: { get: jasmine.Spy };
  let httpController: HttpTestingController;

  const mockLocationModel: LocationModel = Object.assign({zipCode:'95742', locationName: 'Rancho Cordova', currentCondition: 'Sunny', currentTemperature: 78.28, minTemperature: 75.99, maxTemperature: 80.01, icon: 'https://www.angulartraining.com/images/weather/sun.png'});
  const mockLocationResponse: LocationResponse = Object.assign({name: 'Rancho Cordova', weather: [{main: 'Clear'}], main: {temp: 78.28, temp_min: 75.99, temp_max: 80.01}});

  const mockLocationModelWithMissingFields: LocationModel = Object.assign({zipCode:'95742', locationName: '', currentTemperature: 78.28, maxTemperature: 80.01});
  const mockLocationResponseWithMissingFields: LocationResponse = Object.assign({main: {temp: 78.28, temp_max: 80.01}});

  const mockLocationModelWithoutAnyFields: LocationModel = Object.assign({zipCode:'95742', locationName: ''});
  const mockLocationResponseWithoutAnyFields: LocationResponse = Object.assign({});

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        LocationService,
        {provide: SharedService, useValue: sharedServiceSpy},
        DatePipe
      ],
      imports: [HttpClientTestingModule]
    })
  });

  beforeEach(inject([LocationService, HttpTestingController],
    (_locationService: LocationService, _httpController: HttpTestingController) => {
      locationService = _locationService;
      httpController = _httpController;
  }));

  beforeEach(() => {
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['get']);
    sharedServiceSpy = jasmine.createSpyObj('SharedService', ['sendErrorMessage']);
    sharedServiceSpy.warningDisplaying = new Subject<string>();
  });

  beforeEach(() => {
    let store: any = {};
    spyOn(localStorage, 'getItem').and.callFake(function (key) {
      return store[key];
    });
    spyOn(localStorage, 'setItem').and.callFake(function (key, value) {
      return store[key] = value + '';
    });
  });

  afterEach(inject([HttpTestingController], (httpMock: HttpTestingController) => {
    httpMock.verify();
  }));

  it('should be created', () => {
    expect(locationService).toBeTruthy();
  });

  it('should use GET to retrieve location current weather', () => {
    locationService.getLocation('95742').subscribe();
    const httpRequest = httpController.expectOne('https://api.openweathermap.org/data/2.5/weather?zip=95742');
    expect(httpRequest.request.method).toEqual('GET');
  });

  it('should call the right url', ()=> {
    locationService = new LocationService(<any>httpClientSpy, sharedServiceSpy);
    httpClientSpy.get.and.returnValue(of(jasmine.any));
    locationService.getLocation('95742').subscribe(() => {
      expect(httpClientSpy.get).toHaveBeenCalledWith('https://api.openweathermap.org/data/2.5/weather',
        {params: new HttpParams().set(WeatherConditionsConstants.ZIP_HTTP_PARAM, '95742')});
    })
  });

  it('should get location current weather', () => {
    locationService.getLocation('95742').subscribe(res => {
      expect(res).toEqual(mockLocationModel);
    });
    const httpRequest = httpController.expectOne('https://api.openweathermap.org/data/2.5/weather?zip=95742');
    httpRequest.flush(mockLocationResponse);
  });

  it('should get location current weather with missing fields', () => {
    locationService.getLocation('95742').subscribe(res => {
      expect(res).toEqual(mockLocationModelWithMissingFields);
    });
    const httpRequest = httpController.expectOne('https://api.openweathermap.org/data/2.5/weather?zip=95742');
    httpRequest.flush(mockLocationResponseWithMissingFields);
  });

  it('should get location current weather without any fields', () => {
    locationService.getLocation('95742').subscribe(res => {
      expect(res).toEqual(mockLocationModelWithoutAnyFields);
    });
    const httpRequest = httpController.expectOne('https://api.openweathermap.org/data/2.5/weather?zip=95742');
    httpRequest.flush(mockLocationResponseWithoutAnyFields);
  });

  it('should return no missing fields', () => {
    const noFieldsString: string[] = locationService['convertResponseToLocationModel'](mockLocationResponse, '95742').missingFields;
    expect(noFieldsString).toEqual([]);
  });

  it('should return the right missing fields', () => {
    const missingFields: string[] = ['location name', 'current weather condition', 'temperature min'];
    const noFieldsString: string[] = locationService['convertResponseToLocationModel'](mockLocationResponseWithMissingFields, '95742').missingFields;
    expect(noFieldsString).toEqual(missingFields);
  });

  it('should return all fields as missing fields', () => {
    const missingFields: string[] = ['location name', 'current weather condition', 'current temperature', 'temperature max', 'temperature min'];
    const noFieldsString: string[] = locationService['convertResponseToLocationModel'](mockLocationResponseWithoutAnyFields, '95742').missingFields;
    expect(noFieldsString).toEqual(missingFields);
  });

  it('should reload local storage', () => {
    const location: LocationModel = Object.assign({zipCode:'10001', locationName: 'New York', currentCondition: 'Clouds', currentTemperature: 12.28, minTemperature: 8.13, maxTemperature: 13.98, icon: 'https://www.angulartraining.com/images/weather/clouds.png'});
    const locations: LocationModel[] = [mockLocationModel, location];
    localStorage.setItem('locations', JSON.stringify(locations));
    const expectedLocations: LocationModel[] = locationService['reloadLocations']();
    expect(expectedLocations).toEqual(locations);
  });

  it('should reload empty local storage', () => {
    const location: LocationModel = Object.assign({zipCode:'10001', locationName: 'New York', currentCondition: 'Clouds', currentTemperature: 12.28, minTemperature: 8.13, maxTemperature: 13.98, icon: 'https://www.angulartraining.com/images/weather/clouds.png'});
    const locations: LocationModel[] = [mockLocationModel, location];
    localStorage.setItem('model', JSON.stringify(locations));
    const expectedLocations: LocationModel[] = locationService['reloadLocations']();
    expect(expectedLocations).toEqual([]);
  });

  it('should add new location', () => {
    locationService = new LocationService(<any>httpClientSpy, sharedServiceSpy);
    const location: LocationModel = Object.assign({zipCode:'10001', locationName: 'New York', currentCondition: 'Clouds', currentTemperature: 12.28, minTemperature: 8.13, maxTemperature: 13.98, icon: 'https://www.angulartraining.com/images/weather/clouds.png'});
    const savedLocations: LocationModel[] = [mockLocationModel, location];
    localStorage.setItem('locations', JSON.stringify(savedLocations));
    const addLocation: LocationModel = Object.assign({zipCode:'33101', locationName: 'Miami', currentCondition: 'Sunny', currentTemperature: 24.77, minTemperature: 22.77, maxTemperature: 27.21, icon: 'https://www.angulartraining.com/images/weather/clouds.png'});
    const locations: LocationModel[] = [...savedLocations, addLocation];
    locationService['reloadLocations']();
    const expectedLocations: LocationModel[] = locationService['addNewLocation'](addLocation);
    expect(expectedLocations).toEqual(locations);
  });

  it('should update location', () => {
    locationService = new LocationService(<any>httpClientSpy, sharedServiceSpy);
    const location: LocationModel = Object.assign({zipCode:'10001', locationName: 'New York', currentCondition: 'Clouds', currentTemperature: 12.28, minTemperature: 8.13, maxTemperature: 13.98, icon: 'https://www.angulartraining.com/images/weather/clouds.png'});
    const savedLocations: LocationModel[] = [mockLocationModel, location];
    localStorage.setItem('locations', JSON.stringify(savedLocations));
    const addLocation: LocationModel = Object.assign({zipCode:'10001', locationName: 'New York', currentCondition: 'Sunny', currentTemperature: 13.08, minTemperature: 5.03, maxTemperature: 13.98, icon: 'https://www.angulartraining.com/images/weather/sunny.png'});
    const locations: LocationModel[] = [mockLocationModel, addLocation];
    locationService['reloadLocations']();
    const expectedLocations: LocationModel[] = locationService['addNewLocation'](addLocation);
    expect(expectedLocations).toEqual(locations);
  });

  it('should remove location', () => {
    locationService = new LocationService(<any>httpClientSpy, sharedServiceSpy);
    const toRemoveLocation: LocationModel = Object.assign({zipCode:'10001', locationName: 'New York', currentCondition: 'Clouds', currentTemperature: 12.28, minTemperature: 8.13, maxTemperature: 13.98, icon: 'https://www.angulartraining.com/images/weather/clouds.png'});
    const location: LocationModel = Object.assign({zipCode:'33101', locationName: 'Miami', currentCondition: 'Sunny', currentTemperature: 24.77, minTemperature: 22.77, maxTemperature: 27.21, icon: 'https://www.angulartraining.com/images/weather/clouds.png'});
    const savedLocations: LocationModel[] = [mockLocationModel, toRemoveLocation, location];
    localStorage.setItem('locations', JSON.stringify(savedLocations));
    const locations: LocationModel[] = [mockLocationModel, location];
    locationService['reloadLocations']();
    const expectedLocations: LocationModel[] = locationService['removeLocation'](1);
    expect(expectedLocations).toEqual(locations);
  });

})
