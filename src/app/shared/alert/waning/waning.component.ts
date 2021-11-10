import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from "rxjs";

import {SharedService} from "../../service/shared.service";

@Component({
  selector: 'app-waning',
  templateUrl: './waning.component.html',
  styleUrls: ['./waning.component.css']
})
export class WaningComponent implements OnInit, OnDestroy {
  message!: string;
  warningDisplaySubscription!: Subscription;

  constructor(private sharedService: SharedService) { }

  ngOnInit(): void {
    this.warningDisplaySubscription = this.sharedService.warningDisplaying
      .subscribe((message: string) => {
        this.message = message;
      })
  }

  onCloseWarning(){
    this.message = "";
  }

  ngOnDestroy() {
    this.warningDisplaySubscription.unsubscribe();
  }

}
