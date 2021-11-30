import {AfterViewInit, Component, OnInit} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {HttpHeaders} from "@angular/common/http";
import {ApiService} from "../../service/api.service";
import {Tokens} from "../../interfaces";
import {finalize} from "rxjs/operators";
import {createSpinner, showSpinner, hideSpinner, SpinnerArgs} from '@syncfusion/ej2-angular-popups';
import {Router} from "@angular/router";
import {AuthService} from "../../service/auth.service";
import {SnackbarService} from "../../service/snackbar.service";
import {DASHBOARD_ENDPOINT} from "../../url.constants";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit, AfterViewInit {
  loginFormGroup = this.formBuilder.group({
    username: [null, [Validators.required]],
    password: [null, [Validators.required]]
  });

  hide: boolean = true;

  tokens: Tokens = {
    access_token: "",
    refresh_token: ""
  }

  buttonLoading: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private apiService: ApiService,
    private router: Router,
    private authService: AuthService,
    private snackbarService: SnackbarService,
) { }

  ngOnInit(): void {
    if (this.authService.isUserLoggedIn()) {
      this.router.navigate(['dashboard']);
    }
  }

  ngAfterViewInit(): void {
    createSpinner(<SpinnerArgs>{
      target: document.getElementById('login-button')
    })
  }

  submitCredentials() {
    if (this.loginFormGroup.valid) {
      this.buttonLoading = true;
      showSpinner(<HTMLElement>document.getElementById("login-button"))
      let body = new URLSearchParams();
      body.set('username', this.loginFormGroup.value.username);
      body.set('password', this.loginFormGroup.value.password);
      let options = {
        headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
      };
      this.apiService.postWithOptions("/login", body, options)
        .pipe(finalize(() => {
          this.buttonLoading = false;
          hideSpinner(<HTMLElement>document.getElementById("login-button"))
        }))
        .subscribe(
          data => {
            this.loginFormGroup.reset();
            this.tokens = JSON.parse(JSON.stringify(data));
            let access_token = this.tokens.access_token;
            this.authService.registerLoggedInUserToken(access_token);
            console.log(access_token);
            this.router.navigate([DASHBOARD_ENDPOINT]).then(() => {
              console.log("User has successfully logged in!")
            })
            this.snackbarService.openSnackBar('აპლიკაციაში შესვლა განხორციელდა წარმატებით')
          }, () => {
            this.loginFormGroup.reset();
            this.snackbarService.openSnackBar('აპლიკაციაში შესვლა განხორციელდა წარმატების უგარეშოდ')
          }
        );
    }
  }
}

