import {Component, OnInit} from '@angular/core';

import {LocationService} from "./service/location.service";
import {LocationModel} from "./model/location.model";

@Component({
  selector: 'app-locations',
  templateUrl: './locations.component.html',
  styleUrls: ['./locations.component.css']
})
export class LocationsComponent implements OnInit {
  readonly trackByFn = (index: number) => index ;
  locations: LocationModel[] = [];

  constructor(private locationService: LocationService) {}

  ngOnInit(): void {
    this.locations = this.locationService.reloadLocations();
  }

  addNewLocation(location: LocationModel) {
    this.locations = this.locationService.addNewLocation(location);
  }

  removeLocation(index: number) {
    this.locations = this.locationService.removeLocation(index);
  }

}
