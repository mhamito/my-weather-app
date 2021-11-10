import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";

import {LocationsComponent} from "./locations/locations.component";
import {ForecastWeatherComponent} from "./forecast-weather/forecast-weather.component";
import {ForecastWeatherResolverService} from "./forecast-weather/service/forecast-weather-resolver.service";

const AppRoutes: Routes = [
  {path: '', component: LocationsComponent},
  {path:'forecast/:zipcode', component: ForecastWeatherComponent, resolve:{forecastWeather: ForecastWeatherResolverService}},
  {path:'**', redirectTo: ''}
]

@NgModule({
  imports: [RouterModule.forRoot(AppRoutes)],
  exports: [RouterModule]
  })
export class AppRoutingModule {}
