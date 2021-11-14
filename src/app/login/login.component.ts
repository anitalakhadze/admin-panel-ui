import {AfterViewInit, Component, OnInit} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {HttpHeaders} from "@angular/common/http";
import {ApiService} from "../service/api.service";
import {Tokens} from "../interfaces";
import {finalize} from "rxjs/operators";
import {createSpinner, showSpinner, hideSpinner, SpinnerArgs} from '@syncfusion/ej2-angular-popups';
import {Router} from "@angular/router";

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

  tokens: Tokens = {
    access_token: "",
    refresh_token: ""
  }

  buttonLoading: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private apiService: ApiService,
    private router: Router
) { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    createSpinner(<SpinnerArgs>{
      target: document.getElementById('login-button')
    })
  }

  submitCredentials() {
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
        console.log(this.tokens);
        this.router.navigate(['/dashboard']).then(r => {
          console.log("User has successfully logged in!")
        })
      }
    );
  }
}

