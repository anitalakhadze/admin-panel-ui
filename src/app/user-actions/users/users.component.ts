import {Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator} from "@angular/material/paginator";
import {MatTableDataSource} from "@angular/material/table";
import {User} from "../../interfaces";
import {ApiService} from "../../service/api.service";
import {ActivatedRoute, Router} from "@angular/router";
import {SnackbarService} from "../../service/snackbar.service";
import {USERS_ENDPOINT} from "../../url.constants";
import {MatSort} from "@angular/material/sort";
import {UserDetailsComponent} from "../user-details/user-details.component";
import {MatDialog} from "@angular/material/dialog";

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  @ViewChild(MatPaginator, {static: false}) usersPaginator!: MatPaginator;
  @ViewChild(MatSort, {static: false}) matSort!: MatSort;

  editButtonLoading:boolean = false;
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

  getUsers() {
    this.apiService.get(USERS_ENDPOINT)
      .subscribe(
        data => {
          this.usersDataSource = new MatTableDataSource<User>(data);
          this.usersDataSource.paginator = this.usersPaginator;
          this.usersDataSource.sort = this.matSort;
          this.snackBarService.openSnackBar('მონაცემების ჩატვირთვა დასრულდა წარმატებით')
        }, () => {
          this.snackBarService.openSnackBar('მონაცემების ჩატვირთვა დასრულდა წარმატების უგარეშოდ')
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
}
