import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";

import {ErrorComponent} from "./alert/error/error.component";
import {WaningComponent} from "./alert/waning/waning.component";

@NgModule({
  declarations: [
    ErrorComponent,
    WaningComponent
  ],
  exports: [
    ErrorComponent,
    WaningComponent
  ],
  imports: [
    CommonModule
  ]
})
export class SharedModule {}
