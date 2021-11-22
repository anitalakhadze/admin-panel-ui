import { Component, OnInit } from '@angular/core';
import {ApiService} from "../service/api.service";
import {FormBuilder, Validators} from "@angular/forms";
import {AuthService} from "../service/auth.service";
import {HttpHeaders} from "@angular/common/http";
import {finalize} from "rxjs/operators";
import {SnackbarService} from "../utils/snackbar.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  Roles: any = ['ADMIN', 'USER'];
  Statuses: any = ['ACTIVE', 'INACTIVE'];

  buttonLoading: boolean = false;

  registerFormGroup = this.formBuilder.group({
    name: [null, [Validators.required]],
    username: [null, [Validators.required]],
    password: [null, [Validators.required]],
    ipAddress: [null, [Validators.required]],
    returnUrl: [null, [Validators.required]],
    role: [null, [Validators.required]],
    status: [null, [Validators.required]],
  });

  constructor(
    private apiService: ApiService,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackBarService: SnackbarService
  ) { }

  ngOnInit(): void {
  }

  register() {
    this.buttonLoading = true;
    let headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.authService.getToken())
      .set('Content-Type', 'application/json');
    this.apiService.post("/user", this.registerFormGroup.value, headers)
      .pipe(finalize(() => {
          this.buttonLoading = false;
        })
      )
      .subscribe(() => {
        this.registerFormGroup.reset();
        this.router.navigate(['/dashboard']).then(() => {
          console.log("User has been successfully registered!");
        })
        this.snackBarService.openSnackBar("მონაცემების შენახვა დასრულდა წარმატებით");
      }, error => {
        this.snackBarService.openSnackBar("მონაცემების შენახვა დასრულდა წარმატების უგარეშოდ");
      })
  }

}
