import {Injectable} from "@angular/core";
import {Subject} from "rxjs";

@Injectable({providedIn: 'root'})
export class SharedService {
  errorDisplaying = new Subject<string>();
  warningDisplaying = new Subject<string>();

  constructor() {}

  sendErrorMessage(missingFields: string[]) {
    let messageError: string = 'the following field <' + missingFields[0] + '> is missing';
    if(missingFields.length > 1) {
      let fieldsString = '';
      for(let fieldIndex in missingFields) {
        fieldsString+= ' <' + missingFields[fieldIndex] + '> ';
      }
      messageError = 'the following fields ' + fieldsString + ' are missing';
    }
    this.errorDisplaying.next(messageError);
  }
}
