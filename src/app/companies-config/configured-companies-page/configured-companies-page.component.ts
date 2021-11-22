import {Component, OnInit, ViewChild} from '@angular/core';
import {ApiService} from "../../service/api.service";
import {ActivatedRoute, Router} from "@angular/router";
import {SnackbarService} from "../../service/snackbar.service";
import {MatPaginator} from "@angular/material/paginator";
import {MatTableDataSource} from "@angular/material/table";
import {Company} from "../../interfaces";
import {finalize} from "rxjs/operators";
import {ACTIVE_COMPANIES_ENDPOINT, COMPANIES_ENDPOINT} from "../../url.constants";

@Component({
  selector: 'app-configured-companies-page',
  templateUrl: './configured-companies-page.component.html',
  styleUrls: ['./configured-companies-page.component.css']
})
export class ConfiguredCompaniesPageComponent implements OnInit {
  @ViewChild(MatPaginator, {static: false}) activeCompaniesPaginator!: MatPaginator;

  buttonLoading: boolean = false;
  deleteButtonLoading: boolean = false;

  activeCompaniesDataSource = new MatTableDataSource<Company>([]);
  displayedCompaniesColumns: string[] = ['company', 'remove'];

  constructor(
    private apiService: ApiService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private snackBarService: SnackbarService
  ) { }

  ngOnInit(): void {
    this.getActiveCompanies();
  }

  getActiveCompanies() {
    this.buttonLoading = true;
    this.apiService.get(ACTIVE_COMPANIES_ENDPOINT)
      .pipe(finalize(() => this.buttonLoading = false))
      .subscribe(
        data => {
          this.activeCompaniesDataSource = new MatTableDataSource<Company>(data);
          this.activeCompaniesDataSource.paginator = this.activeCompaniesPaginator;
        }
      )
  }

  applyFilterToActiveCompanies(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.activeCompaniesDataSource.filter = filterValue.trim().toLowerCase();
  }

  deactivateCompany(id: number) {
    this.deleteButtonLoading = true;
    this.apiService.delete(`${COMPANIES_ENDPOINT}/${id}`)
      .pipe(finalize(() => {
        this.deleteButtonLoading = false;
        this.reloadPage();
      }))
      .subscribe(
        () => {
          this.snackBarService.openSnackBar("მონაცემების შენახვა დასრულდა წარმატებით");
        }, () => {
          this.snackBarService.openSnackBar("მონაცემების შენახვა დასრულდა წარმატების უგარეშოდ");
        }
      )
  }

  reloadPage(): void {
    setTimeout(() => { window.location.reload()},1000);
  }

}
