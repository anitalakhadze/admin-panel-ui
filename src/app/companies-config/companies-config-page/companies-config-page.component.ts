import {Component, OnInit, ViewChild} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import {ApiService} from "../../service/api.service";
import {ActivatedRoute, Router} from "@angular/router";
import {SnackbarService} from "../../service/snackbar.service";
import {MatTableDataSource} from "@angular/material/table";
import {Company} from "../../interfaces";
import {finalize} from "rxjs/operators";
import {HttpHeaders} from "@angular/common/http";
import {AuthService} from "../../service/auth.service";

@Component({
  selector: 'app-companies-config-page',
  templateUrl: './companies-config-page.component.html',
  styleUrls: ['./companies-config-page.component.css']
})
export class CompaniesConfigPageComponent implements OnInit {
  @ViewChild(MatPaginator, {static: false}) inactiveCompaniesPaginator!: MatPaginator;

  buttonLoading: boolean = false;
  saveButtonLoading: boolean = false;

  inactiveCompaniesDataSource = new MatTableDataSource<Company>([]);
  displayedCompaniesColumns: string[] = ['company', 'check'];

  companiesToSaveArray: number[] = [];

  constructor(
    private apiService: ApiService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private snackBarService: SnackbarService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.getInactiveCompanies();
  }

  applyFilterToInactiveCompanies(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.inactiveCompaniesDataSource.filter = filterValue.trim().toLowerCase();
  }

  getInactiveCompanies() {
    this.buttonLoading = true;
    let headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.authService.getToken())
      .set('Content-Type', 'application/json');
    console.log("Headers: " + headers.get("Authorization"));
    this.apiService.get("/companies/inactive")
      .pipe(finalize(() => this.buttonLoading = false))
      .subscribe(
        data => {
          this.inactiveCompaniesDataSource = new MatTableDataSource<Company>(data);
          this.inactiveCompaniesDataSource.paginator = this.inactiveCompaniesPaginator;
        }
      )
  }

  checkCompanyToSave(id: number) {
    if (this.companiesToSaveArray.includes(id)) {
      const index: number = this.companiesToSaveArray.indexOf(id);
      if (index !== -1) {
        this.companiesToSaveArray.splice(index, 1);
      }
    } else {
      this.companiesToSaveArray.push(id);
    }
    console.log(this.companiesToSaveArray);
  }

  isChecked(id: number): boolean {
    return this.companiesToSaveArray.includes(id);
  }

  saveCompanies() {
    this.saveButtonLoading = true;
    this.apiService.post("/companies", this.companiesToSaveArray)
      .pipe(finalize(() => {
          this.saveButtonLoading = false;
          this.reloadPage();
        })
      )
      .subscribe(() => {
        this.snackBarService.openSnackBar("მონაცემების შენახვა დასრულდა წარმატებით");
      }, error => {
        this.saveButtonLoading = false;
        this.snackBarService.openSnackBar("მონაცემების შენახვა დასრულდა წარმატების უგარეშოდ");
    })
  }

  reloadPage(): void {
    setTimeout(() => { window.location.reload()},1000);
  }
}
