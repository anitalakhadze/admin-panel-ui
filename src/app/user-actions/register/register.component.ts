import { Component, OnInit } from '@angular/core';
import {ApiService} from "../../service/api.service";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
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
  Roles: any = ['ROLE_ADMIN', 'ROLE_USER'];
  Statuses: any = ['ACTIVE', 'INACTIVE'];

  buttonLoading: boolean = false;
  hide: boolean = true;

  registerFormGroup!: FormGroup;

  constructor(
    private apiService: ApiService,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackBarService: SnackbarService
  ) { }

  ngOnInit(): void {
    this.registerFormGroup = this.formBuilder.group({
      name: new FormControl(null,
        [Validators.required, Validators.maxLength(25)]),
      username: new FormControl(null,
        [Validators.required, Validators.maxLength(20)]),
      password: new FormControl(null,
        [Validators.required, Validators.maxLength(15)]),
      ipAddress: new FormControl(null,
        [Validators.required, Validators.maxLength(25),
        Validators.pattern('(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)')]),
      returnUrl: new FormControl(null,
        [Validators.required, Validators.maxLength(100),
          Validators.pattern('(https?:\\/\\/)?([\\\\da-z.-]+)\\.([a-z.]{2,6})[\\/\\\\w .-]*\\/?')]),
      role: new FormControl(null,
        [Validators.required]),
      status: new FormControl(null,
        [Validators.required]),
    });
  }

  register() {
    if (this.registerFormGroup.valid) {
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
}
