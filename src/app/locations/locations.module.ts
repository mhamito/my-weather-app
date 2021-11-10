import {NgModule} from "@angular/core";
import {AddLocationComponent} from "./add-location/add-location.component";
import {LocationsComponent} from "./locations.component";
import {LocationItemComponent} from "./location-item/location-item.component";
import {CommonModule} from "@angular/common";
import {ReactiveFormsModule} from "@angular/forms";
import {AppRoutingModule} from "../app-routing.module";

@NgModule({
  declarations: [
    LocationsComponent,
    AddLocationComponent,
    LocationItemComponent
  ],
  exports: [
    LocationsComponent,
    AddLocationComponent,
    LocationItemComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AppRoutingModule
  ]
})
export class LocationsModule {}
