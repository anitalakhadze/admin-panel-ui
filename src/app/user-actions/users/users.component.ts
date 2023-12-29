import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator} from "@angular/material/paginator";
import {MatTableDataSource} from "@angular/material/table";
import {User} from "../../interfaces";
import {ApiService} from "../../service/api.service";
import {ActivatedRoute, Router} from "@angular/router";
import {SnackbarService} from "../../service/snackbar.service";
import {USERS_ENDPOINT, USERS_EXCEL_ENDPOINT} from "../../url.constants";
import {MatSort} from "@angular/material/sort";
import {UserDetailsComponent} from "../user-details/user-details.component";
import {MatDialog} from "@angular/material/dialog";
import {finalize} from "rxjs/operators";
import {HttpHeaders} from "@angular/common/http";
import {saveAs} from "file-saver";
import {createSpinner, hideSpinner, showSpinner, SpinnerArgs} from "@syncfusion/ej2-angular-popups";

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator, {static: false}) usersPaginator!: MatPaginator;
  @ViewChild(MatSort, {static: false}) matSort!: MatSort;

  exportButtonLoading: boolean = false;

  usersDataSource = new MatTableDataSource<User>([]);
  displayedColumns: string[] = ['id', 'name', 'ipAddress', 'returnUrl', 'isActive', 'addedAt', 'edit'];

  constructor(
    private apiService: ApiService,
    public dialog: MatDialog,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private snackBarService: SnackbarService
  ) { }

  ngOnInit(): void {
    this.getUsers();
  }

  ngAfterViewInit(): void {
    createSpinner(<SpinnerArgs>{
      target: document.getElementById('export-button')
    })
  }

  getUsers() {
    this.apiService.get(USERS_ENDPOINT)
      .subscribe(
        data => {
          this.usersDataSource = new MatTableDataSource<User>(data);
          this.usersDataSource.paginator = this.usersPaginator;
          this.usersDataSource.sort = this.matSort;
          this.snackBarService.openSnackBar('Data loaded successfully')
        }, () => {
          this.snackBarService.openSnackBar('Error loading data')
        }
      )
  }

  applyFilterToUsers(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.usersDataSource.filter = filterValue.trim().toLowerCase();
  }

  editUser(user: User) {
    return this.dialog.open(UserDetailsComponent, {
      width: '300px',
      data: user,
      disableClose: true,
    })
  }

  public downloadExcel() {
    this.exportButtonLoading = true;
    showSpinner(<HTMLElement>document.getElementById("export-button"))
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set("accept", "application/csv");
    return this.apiService.postWithOptions(USERS_EXCEL_ENDPOINT, "", {headers: headers, responseType: 'blob'})
      .pipe(finalize(() => {
        this.exportButtonLoading = false;
        hideSpinner(<HTMLElement>document.getElementById("export-button"))
      }))
      .subscribe(
        (data) => {
          saveAs(data, 'კომპანიები.csv');
          this.exportButtonLoading = false;
          this.snackBarService.openSnackBar("Data exported successfully!");
        }, () => {
          this.exportButtonLoading = false;
          this.snackBarService.openSnackBar("Data export failed.");
        }
      )
  }
}
