import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";

import {ForecastWeatherComponent} from "./forecast-weather.component";

@NgModule({
  declarations: [
    ForecastWeatherComponent
  ],
  exports: [
    ForecastWeatherComponent
  ],
  imports: [
    CommonModule
  ]
})
export class ForecastWeatherModule {}
