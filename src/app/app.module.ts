import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {AppRoutingModule} from "./app-routing.module";
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";

import { AppComponent } from './app.component';
import {TokenInterceptorService} from "./shared/service/token-interceptor.service";
import {LocationsModule} from "./locations/locations.module";
import {ForecastWeatherModule} from "./forecast-weather/forecast-weather.module";
import {DatePipe} from "@angular/common";
import {SharedModule} from "./shared/shared.module";

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    LocationsModule,
    ForecastWeatherModule,
    SharedModule,
    AppRoutingModule
  ],
  providers: [DatePipe, Location, {provide: HTTP_INTERCEPTORS, useClass: TokenInterceptorService, multi: true}],
  bootstrap: [AppComponent]
})
export class AppModule { }
