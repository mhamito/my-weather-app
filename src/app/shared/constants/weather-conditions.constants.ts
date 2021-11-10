export class WeatherConditionsConstants {
  public static WEATHER_ICON: {[key: string]: string} = {
    Sunny: 'https://www.angulartraining.com/images/weather/sun.png',
    Clouds: 'https://www.angulartraining.com/images/weather/clouds.png',
    Rain: 'https://www.angulartraining.com/images/weather/rain.png',
    Snow: 'https://www.angulartraining.com/images/weather/snow.png'
  };

  public static RESPONSE_CONDITION_WEATHER = 'Clear';
  public static EXPECTED_CONDITION_WEATHER = 'Sunny';

  public static ZIP_HTTP_PARAM = 'zip';
  public static APP_ID_HTTP_PARAM = 'appid';
  public static UNITS_HTTP_PARAM = 'units';
  public static CNT_HTTP_PARAM = 'cnt';
  public static METRIC = 'metric';
  public static FORECAST_WEATHER_DAYS = '5';

  public static STORAGE_KEY = 'locations';
}
