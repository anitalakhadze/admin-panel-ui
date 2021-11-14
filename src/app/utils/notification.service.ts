import { Injectable } from '@angular/core';
import {MatSnackBar} from "@angular/material/snack-bar";

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(private _snackBar: MatSnackBar) { }

  displayMessage(message: string, action = 'OK', duration = 2000, panelClass: string[]) {
    // @ts-ignore
    this._snackBar.open(message, action, {
      duration, panelClass
    });
  }

  displaySuccessMessage() {
    const panelClass = ['success-snackbar'];
    const defaultSuccessMessage = 'მონაცემები წარმატებით ჩაიტვირთა';
    this.displayMessage(defaultSuccessMessage, 'OK', 5000, panelClass);
  }

  displayErrorMessage(error: any) {
    console.log(error);
    const panelClass = ['error-snackbar'];
    var defaultErrorMessage = 'დაფიქსირდა შეცდომა გთხოვთ სცადოთ თავიდან';
    if(error !== null && error.error.show){
      defaultErrorMessage = error.error.errorDescription;
    }
    this.displayMessage(defaultErrorMessage, 'OK', 5000, panelClass);
  }

  displayErrorByCode(error: any) {
    console.error(error);
    const panelClass = ['error-snackbar'];
    let code = error.error.errorCode;
    let errorMessage = '';
    console.error("CODE IS ::: " + code);
    switch (code) {
      case 1:
        break;
      case 2:
        errorMessage = 'ჩანაწერი არ მოიძებნა';
        break;
      default:
        errorMessage = 'დაფიქსირდა შეცდომა გთხოვთ სცადოთ თავიდან';
        break;
    }
    // @ts-ignore
    this.displayMessage(errorMessage, 'OK', 5000, panelClass);
  }
}
