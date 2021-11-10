import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Data, Router} from "@angular/router";
import {HttpErrorResponse} from "@angular/common/http";

import {SharedService} from "../shared/service/shared.service";
import {ForecastWeatherModel} from "./model/forecast-weather.model";

@Component({
  selector: 'app-forecast-weather',
  templateUrl: './forecast-weather.component.html',
  styleUrls: ['./forecast-weather.component.css']
})
export class ForecastWeatherComponent implements OnInit {
  forecastWeather: ForecastWeatherModel = Object.assign({zipCode: '',locationName: '', conditions: []});

  constructor(private router: Router, private route: ActivatedRoute, private sharedService: SharedService) { }

  ngOnInit(): void {
    this.route.data.subscribe((data: Data) => {
      if(data.forecastWeather instanceof HttpErrorResponse){
        const error = data.forecastWeather;
        this.sharedService.errorDisplaying.next(error.error.cod + " : " + error.error.message);
      }else {
        this.forecastWeather = data.forecastWeather;
      }});
  }

  onBackToMainPage(){
    this.router.navigate([''], {relativeTo: this.route});
  }
}
