import {AfterViewInit, Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {TransactionDetails} from "../../interfaces";
import {ApiService} from "../../service/api.service";
import {AuthService} from "../../service/auth.service";
import {HttpHeaders} from "@angular/common/http";
import {finalize} from "rxjs/operators";
import {createSpinner, hideSpinner, showSpinner, SpinnerArgs} from "@syncfusion/ej2-angular-popups";
import {Router} from "@angular/router";
import {SnackbarService} from "../../utils/snackbar.service";

@Component({
  selector: 'app-cancel-transaction',
  templateUrl: './cancel-transaction.component.html',
  styleUrls: ['./cancel-transaction.component.css']
})
export class CancelTransactionComponent implements OnInit, AfterViewInit
{

  id: string;

  public continueButtonLoading: boolean = false;
  public successfullySent: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<CancelTransactionComponent>,
    private apiService: ApiService,
    private authService: AuthService,
    private router: Router,
    private snackbarService: SnackbarService,
    @Inject(MAT_DIALOG_DATA) public data: string
  ) {
    this.id = data;
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    createSpinner(<SpinnerArgs>{
      target: document.getElementById('continue-button')
    })
  }

  closeDialog() {
    this.dialogRef.close();
  }

  submit() {
    this.continueButtonLoading = true;
    showSpinner(<HTMLElement>document.getElementById("continue-button"))
    let username = this.authService.getLoggedInUsername();
    let headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.authService.getToken())
      .set('Content-Type', 'application/json');
    console.log("Headers: " + headers.get("Authorization"));
    this.apiService.post("/transactions/" + this.id, username, headers)
      .pipe(finalize(() => {
        this.continueButtonLoading = false;
        hideSpinner(<HTMLElement>document.getElementById("login-button"))
      }))
      .subscribe(() => {
        this.successfullySent = true;
        hideSpinner(<HTMLElement>document.getElementById("continue-button"))
        console.log("Here success")
        this.continueButtonLoading = false;
        this.snackbarService.openSnackBar('ტრანზაქციის გაუქმების შეტყობინება გაიგზავნა წარმატებით');
      }, error => {
        console.log(error);
        this.successfullySent = false;
        this.continueButtonLoading = false;
        hideSpinner(<HTMLElement>document.getElementById("continue-button"))
        this.snackbarService.openSnackBar('ტრანზაქციის გაუქმების შეტყობინება გაიგზავნა წარმატების უგარეშოდ')
      })
  }

}