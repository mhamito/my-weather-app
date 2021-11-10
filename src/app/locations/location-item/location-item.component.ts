import {Component, Input, OnInit, Output, EventEmitter} from '@angular/core';

import {LocationModel} from "../model/location.model";

@Component({
  selector: 'app-location-item',
  templateUrl: './location-item.component.html',
  styleUrls: ['./location-item.component.css']
})
export class LocationItemComponent implements OnInit {
  @Input() location: LocationModel = Object.assign({});
  @Output() removeLocation = new EventEmitter<LocationModel>();

  constructor() {}

  ngOnInit(): void {}

  onRemoveLocation() {
    this.removeLocation.emit();
  }

}
