import { Component, OnInit } from '@angular/core';
import {FormBuilder, Validators} from "@angular/forms";
import {ApiService} from "../../service/api.service";
import {Router} from "@angular/router";
import {hideSpinner, showSpinner} from "@syncfusion/ej2-angular-popups";
import {AuthService} from "../../service/auth.service";
import {HttpHeaders} from "@angular/common/http";
import {finalize} from "rxjs/operators";
import {NotificationService} from "../../service/notification.service";
import {SnackbarService} from "../../service/snackbar.service";

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

  hideOld: boolean = true;
  hideNew: boolean = true;

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
      let username = this.authService.getLoggedInUsername();
      console.log("Before changing the token is " + this.authService.getToken());
      let headers = new HttpHeaders().set('Content-Type', 'application/json');
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
