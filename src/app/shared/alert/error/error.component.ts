import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from "rxjs";

import {SharedService} from "../../service/shared.service";

@Component({
  selector: 'app-alert',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.css']
})
export class ErrorComponent implements OnInit, OnDestroy {
  message!: string;
  errorDisplaySubscription!: Subscription;

  constructor(private sharedService: SharedService) { }

  ngOnInit(): void {
    this.errorDisplaySubscription = this.sharedService.errorDisplaying
      .subscribe((message: string) => {
        this.message = message;
      })
  }

  onCloseAlert(){
    this.message = "";
  }

  ngOnDestroy() {
    this.errorDisplaySubscription.unsubscribe();
  }

}
