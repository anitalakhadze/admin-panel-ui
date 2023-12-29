import {AfterViewInit, Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {User} from "../../interfaces";
import {createSpinner, hideSpinner, showSpinner, SpinnerArgs} from "@syncfusion/ej2-angular-popups";
import {ApiService} from "../../service/api.service";
import {SnackbarService} from "../../service/snackbar.service";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {USERS_ENDPOINT} from "../../url.constants";
import {HttpHeaders} from "@angular/common/http";
import {finalize} from "rxjs/operators";
import {Router} from "@angular/router";

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.css']
})
export class UserDetailsComponent implements OnInit, AfterViewInit {
  saveRequestSubmitted: boolean = false;
  Roles: any = ['ROLE_ADMIN', 'ROLE_USER'];

  userData: User;
  updateUserFormGroup: FormGroup;

  public submitButtonLoading: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<UserDetailsComponent>,
    private formBuilder: FormBuilder,
    private apiService: ApiService,
    private snackbarService: SnackbarService,
    @Inject(MAT_DIALOG_DATA) public data: User,
    private router: Router
  ) {
    this.userData = data;
    console.table(data);
    this.updateUserFormGroup = this.formBuilder.group({
      name: new FormControl(this.userData.name,
        [Validators.required,
          Validators.minLength(2),
          Validators.maxLength(25)]),
      ipAddress: new FormControl(this.userData.ipAddress,
        [Validators.required, Validators.maxLength(25),
          Validators.pattern('(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)')]),
      returnUrl: new FormControl(this.userData.returnUrl,
        [Validators.required, Validators.maxLength(100),
          Validators.pattern('(https?:\\/\\/)?([\\\\da-z.-]+)\\.([a-z.]{2,6})[\\/\\\\w .-]*\\/?')]),
      role: new FormControl(this.userData.userRole,
        [Validators.required]),
    });
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    createSpinner(<SpinnerArgs>{
      target: document.getElementById('submit-button')
    })
  }

  submit() {
    if (this.updateUserFormGroup.valid){
      this.submitButtonLoading = true;
      showSpinner(<HTMLElement>document.getElementById("continue-button"))
      let headers = new HttpHeaders().set('Content-Type', 'application/json');
      this.apiService.put(`${USERS_ENDPOINT}/${this.userData.id}`, this.updateUserFormGroup.value, headers)
        .pipe(finalize(() => {
          this.submitButtonLoading = false;
          hideSpinner(<HTMLElement>document.getElementById("submit-button"))
        }))
        .subscribe(() => {
          hideSpinner(<HTMLElement>document.getElementById("submit-button"))
          this.submitButtonLoading = false;
          this.saveRequestSubmitted = true;
          this.updateUserFormGroup.disable();
          this.snackbarService.openSnackBar('Data has been successfully updated!');
        }, error => {
          console.log(error);
          this.saveRequestSubmitted = false;
          this.submitButtonLoading = false;
          hideSpinner(<HTMLElement>document.getElementById("submit-button"))
          this.snackbarService.openSnackBar('Data update failed.')
        })
    }
  }

  closeDialog() {
    this.dialogRef.close();
    this.reloadPage();
  }

  reloadPage(): void {
    let currentUrl = this.router.url;
    this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
      this.router.navigate([currentUrl]);
    });
  }
}
