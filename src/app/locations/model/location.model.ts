export interface ConvertToLocationModel{
  locationModel: LocationModel;
  missingFields: string[];
}

export interface LocationModel{
  zipCode: string;
  locationName: string;
  currentCondition: string;
  currentTemperature: number;
  minTemperature: number;
  maxTemperature: number;
  icon: string;
}
