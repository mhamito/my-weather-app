import {HttpEvent, HttpHandler, HttpInterceptor, HttpParams, HttpRequest} from "@angular/common/http";
import {Observable} from "rxjs";

import {WeatherConditionsConstants} from "../constants/weather-conditions.constants";
import {environment} from "../../../environments/environment";

export class TokenInterceptorService implements HttpInterceptor{

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const appId = environment.appId;
    let httpParams: HttpParams = req.params;
    httpParams = httpParams.append(WeatherConditionsConstants.UNITS_HTTP_PARAM, WeatherConditionsConstants.METRIC);
    httpParams = httpParams.append(WeatherConditionsConstants.APP_ID_HTTP_PARAM, appId);
    const modifiedReq = req.clone({params: httpParams});
    return next.handle(modifiedReq);
  }
}
