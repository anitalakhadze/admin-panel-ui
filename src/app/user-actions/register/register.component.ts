import { Component, OnInit } from '@angular/core';
import {ApiService} from "../../service/api.service";
import {FormBuilder, Validators} from "@angular/forms";
import {AuthService} from "../../service/auth.service";
import {finalize} from "rxjs/operators";
import {SnackbarService} from "../../service/snackbar.service";
import {Router} from "@angular/router";
import {DASHBOARD_ENDPOINT, USERS_ENDPOINT} from "../../url.constants";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  Roles: any = ['ADMIN', 'USER'];
  Statuses: any = ['ACTIVE', 'INACTIVE'];

  buttonLoading: boolean = false;
  hide: boolean = true;

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
    this.apiService.post(USERS_ENDPOINT, this.registerFormGroup.value)
      .pipe(finalize(() => {
          this.buttonLoading = false;
        })
      )
      .subscribe(() => {
        this.registerFormGroup.reset();
        this.router.navigate([DASHBOARD_ENDPOINT]).then(() => {
          console.log("User has been successfully registered!");
        })
        this.snackBarService.openSnackBar("მონაცემების შენახვა დასრულდა წარმატებით");
      }, () => {
        this.snackBarService.openSnackBar("მონაცემების შენახვა დასრულდა წარმატების უგარეშოდ");
      })
  }

}
