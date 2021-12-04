import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {ApiService} from "../../service/api.service";
import {Router} from "@angular/router";
import {createSpinner, hideSpinner, showSpinner, SpinnerArgs} from "@syncfusion/ej2-angular-popups";
import {AuthService} from "../../service/auth.service";
import {HttpHeaders} from "@angular/common/http";
import {finalize} from "rxjs/operators";
import {SnackbarService} from "../../service/snackbar.service";
import {CHANGE_PASSWORD_ENDPOINT, DASHBOARD_ENDPOINT} from "../../url.constants";

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {

  passwordFormGroup!: FormGroup;

  buttonLoading: boolean = false;

  hideOld: boolean = true;
  hideNew: boolean = true;
  hideNewDub: boolean = true;

  constructor(
    private formBuilder: FormBuilder,
    private apiService: ApiService,
    private router: Router,
    private authService: AuthService,
    private snackbarService: SnackbarService,
  ) { }

  ngOnInit(): void {
    this.passwordFormGroup = this.formBuilder.group({
      oldPassword: new FormControl(null,
        [Validators.required,
          Validators.minLength(8),
          Validators.maxLength(20),
          Validators.pattern('^[A-Za-z0-9\\s!@#$%^&*()_+=-`~\\\\\\]\\[{}|\';:/.,?><]*$')]),
      newPassword: new FormControl(null,
        [Validators.required,
          Validators.minLength(8),
          Validators.maxLength(20),
          Validators.pattern('^[A-Za-z0-9\\s!@#$%^&*()_+=-`~\\\\\\]\\[{}|\';:/.,?><]*$')]),
      newPasswordDub: new FormControl(null,
        [Validators.required,
          Validators.minLength(8),
          Validators.maxLength(20),
          Validators.pattern('^[A-Za-z0-9\\s!@#$%^&*()_+=-`~\\\\\\]\\[{}|\';:/.,?><]*$')])
    });
    createSpinner(<SpinnerArgs>{
      target: document.getElementById('password-change-button')
    });
  }

  changePassword() {
    if (this.passwordFormGroup.valid) {
      if (this.passwordFormGroup.value.oldPassword == this.passwordFormGroup.value.newPassword) {
        this.snackbarService.openSnackBar("ძველი და ახალი პაროლები ემთხვევა ერთმანეთს");
      } else if (this.passwordFormGroup.value.newPassword != this.passwordFormGroup.value.newPasswordDub) {
        this.snackbarService.openSnackBar("ახალი და განმეორებით შეყვანილი პაროლები არ ემთხვევა ერთმანეთს");
      } else {
        if (this.passwordFormGroup.valid) {
          this.buttonLoading = true;
          showSpinner(<HTMLElement>document.getElementById("password-change-button"))
          let username = this.authService.getLoggedInUsername();
          let headers = new HttpHeaders().set('Content-Type', 'application/json');
          this.apiService.put(`${CHANGE_PASSWORD_ENDPOINT}/${username}`, this.passwordFormGroup.value, headers)
            .pipe(finalize(() => {
              this.buttonLoading = false;
              hideSpinner(<HTMLElement>document.getElementById("password-change-button"))
            }))
            .subscribe(() => {
                this.passwordFormGroup.reset();
                this.router.navigate([DASHBOARD_ENDPOINT]).then(() => {
                  console.log("Password has been successfully changed!");
                })
                this.snackbarService.openSnackBar('პაროლის ცვლილება დასრულდა წარმატებით');
              }, () => {
                this.passwordFormGroup.reset();
                this.snackbarService.openSnackBar('პაროლის ცვლილება დასრულდა წარმატების უგარეშოდ')
              }
            )
        }
      }
    }
  }

}
