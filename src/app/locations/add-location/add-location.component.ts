import {Component, OnInit, Output, EventEmitter} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {HttpErrorResponse} from "@angular/common/http";

import {LocationService} from "../service/location.service";
import {SharedService} from "../../shared/service/shared.service";
import {LocationModel} from "../model/location.model";

@Component({
  selector: 'app-add-location',
  templateUrl: './add-location.component.html',
  styleUrls: ['./add-location.component.css']
})
export class AddLocationComponent implements OnInit {
  addLocationForm!: FormGroup;
  @Output() addLocation = new EventEmitter<LocationModel>();
  loading: boolean = false;

  constructor(private locationService: LocationService, private sharedService: SharedService, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.addLocationForm =  this.fb.group({
      'zipCode': this.fb.control('',
        [Validators.required, Validators.pattern(/^[0-9]+[0-9]*$/)])
    });
  }

  onAddLocation() {
    this.loading = true;
    this.locationService.getLocation((<FormControl>this.addLocationForm.get('zipCode')).value)
      .subscribe((location: LocationModel) => {
        this.addLocation.emit(location);
        this.loading = false;
        }, (error: HttpErrorResponse) => {
        this.sharedService.errorDisplaying.next(error.error.cod + " : " + error.error.message);
        this.loading = false;
      });
    this.addLocationForm.reset();

  }

  isZipCodeInvalid(){
    return (<FormControl>this.addLocationForm.get('zipCode')).invalid && (<FormControl>this.addLocationForm.get('zipCode')).touched;
  }
}
