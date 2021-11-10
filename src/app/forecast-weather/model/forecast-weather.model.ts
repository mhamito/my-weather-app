export interface ConvertToForecastWeatherModel{
  forecastWeatherModel: ForecastWeatherModel;
  missingFields: string[];
}

export interface Conditions {
  weatherDate: string;
  weatherConditions: string;
  minTemperature: number;
  maxTemperature: number;
  icon: string;
}

export interface ForecastWeatherModel {
  zipCode: string;
  locationName: string;
  conditions: Conditions[];
}
