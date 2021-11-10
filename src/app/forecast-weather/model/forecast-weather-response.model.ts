export interface ForecastWeatherResponse {
  city: {
    name: string;
  };
  list: [
    {
      dt: number;
      weather: [
        {
          main: string;
        }
      ];

      temp:
        {
          min: number;
          max: number;
        };
    }
  ];
}
