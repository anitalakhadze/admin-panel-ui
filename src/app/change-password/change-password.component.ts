import { Component, OnInit } from '@angular/core';
import {FormBuilder, Validators} from "@angular/forms";
import {ApiService} from "../service/api.service";
import {Router} from "@angular/router";
import {hideSpinner, showSpinner} from "@syncfusion/ej2-angular-popups";
import {AuthService} from "../service/auth.service";
import {HttpHeaders} from "@angular/common/http";
import {finalize} from "rxjs/operators";
import {NotificationService} from "../utils/notification.service";
import {SnackbarService} from "../utils/snackbar.service";

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {

  passwordFormGroup = this.formBuilder.group({
    oldPassword: [null, [Validators.required]],
    newPassword: [null, [Validators.required]]
  });

  buttonLoading: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private apiService: ApiService,
    private router: Router,
    private authService: AuthService,
    private snackbarService: SnackbarService,
  ) { }

  ngOnInit(): void {
  }

  changePassword() {
    if (this.passwordFormGroup.valid) {
      this.buttonLoading = true;
      showSpinner(<HTMLElement>document.getElementById("password-change-button"))
      let oldPassword = this.passwordFormGroup.value.oldPassword;
      let newPassword = this.passwordFormGroup.value.newPassword;
      console.log("Old password is " + oldPassword, " and new password is " + newPassword);
      let username = this.authService.getLoggedInUsername();
      console.log("Before changing the token is " + this.authService.getToken());
      let headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.authService.getToken())
        .set('Content-Type', 'application/json');
      console.log("Headers: " + headers.get("Authorization"));
      this.apiService.put("/user/password/" + username, this.passwordFormGroup.value, headers)
        .pipe(finalize(() => {
          this.buttonLoading = false;
          hideSpinner(<HTMLElement>document.getElementById("login-button"))
        }))
        .subscribe(() => {
          this.passwordFormGroup.reset();
          this.router.navigate(['/dashboard']).then(() => {
            console.log("Password has been successfully changed!");
          })
          this.snackbarService.openSnackBar('პაროლის ცვლილება დასრულდა წარმატებით');
        }, error => {
          this.passwordFormGroup.reset();
          this.snackbarService.openSnackBar('პაროლის ცვლილება დასრულდა წარმატების უგარეშოდ')
        })
    }
  }

}
