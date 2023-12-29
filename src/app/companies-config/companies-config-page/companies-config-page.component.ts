import {Component, OnInit, ViewChild} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import {ApiService} from "../../service/api.service";
import {ActivatedRoute, Router} from "@angular/router";
import {SnackbarService} from "../../service/snackbar.service";
import {MatTableDataSource} from "@angular/material/table";
import {Company} from "../../interfaces";
import {finalize} from "rxjs/operators";
import {COMPANIES_ENDPOINT, INACTIVE_COMPANIES_ENDPOINT} from "../../url.constants";

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
    private snackBarService: SnackbarService
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
    this.apiService.get(INACTIVE_COMPANIES_ENDPOINT)
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
    this.apiService.post(COMPANIES_ENDPOINT, this.companiesToSaveArray)
      .pipe(finalize(() => {
          this.saveButtonLoading = false;
          this.reloadPage();
        }))
      .subscribe(() => {
        this.snackBarService.openSnackBar("Operation completed successfully!");
      }, () => {
        this.saveButtonLoading = false;
        this.snackBarService.openSnackBar("Operation failed.");
    })
  }

  reloadPage(): void {
    let currentUrl = this.router.url;
    this.router.navigateByUrl('/', {skipLocationChange: true}).then(() => {
      this.router.navigate([currentUrl]);
    });
  }
}
