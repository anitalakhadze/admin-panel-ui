import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {SearchInfo, Transaction} from "../../interfaces";
import {MatSort} from "@angular/material/sort";
import {MatPaginator} from "@angular/material/paginator";
import {ApiService} from "../../service/api.service";
import {MatDialog} from "@angular/material/dialog";
import {SnackbarService} from "../../service/snackbar.service";
import {TransactionDetailsComponent} from "../transaction-details/transaction-details.component";
import {CancelTransactionComponent} from "../cancel-transaction/cancel-transaction.component";
import {EventEmitService} from "../../service/event-emit.service";
import {
  FILTERED_TRANSACTIONS_ENDPOINT,
  FILTERED_TRANSACTIONS_EXCEL_ENDPOINT,
} from "../../url.constants";
import {FormBuilder, Validators} from "@angular/forms";
import {AuthService} from "../../service/auth.service";
import {createSpinner, hideSpinner, showSpinner, SpinnerArgs} from "@syncfusion/ej2-angular-popups";
import {finalize} from "rxjs/operators";
import {HttpHeaders} from "@angular/common/http";
import {saveAs} from "file-saver";

@Component({
  selector: 'app-transactions-main-page',
  templateUrl: './transactions-main-page.component.html',
  styleUrls: ['./transactions-main-page.component.css']
})
export class TransactionsMainPageComponent implements OnInit, AfterViewInit {
  filteredCompaniesIds: number[] = [];
  dataReceived: boolean = false;

  transactionsDataSource = new MatTableDataSource<Transaction>([]);
  displayedColumns: string[] = ['id', 'amount', 'commission', 'invoiceData', 'dateCreated', 'details', 'cancel'];
  public exportButtonLoading: boolean = false;
  public cancelButtonLoading: boolean = false;

  @ViewChild(MatSort) set matSort(sort: MatSort) {
    this.transactionsDataSource.sort = sort;
  }

  @ViewChild(MatPaginator, {static: false}) paginator!: MatPaginator;

  range = this.formBuilder.group({
    startDate: [null, [Validators.required]],
    endDate: [null, [Validators.required]],
  });

  maxDate = new Date();

  searchButtonLoading: boolean = false;

  searchInfo: SearchInfo = {} as SearchInfo;

  constructor(
    private apiService: ApiService,
    public dialog: MatDialog,
    private formBuilder: FormBuilder,
    private snackbarService: SnackbarService,
    private eventDataService: EventEmitService,
    public authService: AuthService
  ) { }

  ngOnInit(): void {
    this.eventDataService.getCompanyArrayData.subscribe(
      data => {
        this.filteredCompaniesIds = data;
        this.dataReceived = true;
      }
    );
  }

  ngAfterViewInit(): void {
    createSpinner(<SpinnerArgs>{
      target: document.getElementById('search-button')
    })
    createSpinner(<SpinnerArgs>{
      target: document.getElementById('export-button')
    })
  }

  applyFilter(event: Event) {
    this.transactionsDataSource.filter = (event.target as HTMLInputElement).value.trim().toLowerCase();
  }

  showDetails(data: any) {
    return this.dialog.open(TransactionDetailsComponent, {
      width: '350px',
      data: data,
      disableClose: true,
    });
  }

  cancelTransaction(id: string) {
    return this.dialog.open(CancelTransactionComponent, {
      width: '350px',
      data: id,
      disableClose: true,
    });
  }

  searchTransactions() {
    this.searchButtonLoading = true;
    this.searchInfo.username = this.authService.getLoggedInUsername();
    this.searchInfo.companyIds = this.filteredCompaniesIds;
    this.searchInfo.startDate = this.range.value.startDate;
    this.searchInfo.endDate = this.range.value.endDate;
    console.log(this.searchInfo);
    showSpinner(<HTMLElement>document.getElementById("search-button"))
    this.apiService.post(FILTERED_TRANSACTIONS_ENDPOINT, this.searchInfo)
      .pipe(finalize(() => {
        this.searchButtonLoading = false;
        hideSpinner(<HTMLElement>document.getElementById("search-button"))
      }))
      .subscribe(data => {
        this.searchButtonLoading = false;
        this.range.reset();
        this.transactionsDataSource = new MatTableDataSource<Transaction>(data);
        setTimeout(() => this.transactionsDataSource.paginator = this.paginator);
        console.table(data);
        if (this.transactionsDataSource.data.length > 0) {
          this.snackbarService.openSnackBar('Data loaded successfully');
        } else {
          this.snackbarService.openSnackBar('No data found for selected period');
        }
      }, () => {
        this.searchButtonLoading = false;
        hideSpinner(<HTMLElement>document.getElementById("continue-button"))
        this.snackbarService.openSnackBar('Error loading data')
      });
  }

  downloadExcel() {
    this.exportButtonLoading = true;
    showSpinner(<HTMLElement>document.getElementById("export-button"))
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set("accept", "application/csv");
    return this.apiService.postWithOptions(FILTERED_TRANSACTIONS_EXCEL_ENDPOINT, this.searchInfo, {headers: headers, responseType: 'blob'})
      .pipe(finalize(() => {
        this.exportButtonLoading = false;
        hideSpinner(<HTMLElement>document.getElementById("export-button"))
      }))
      .subscribe(
        (data) => {
          const blob = new Blob([data], { type: 'text/plain; charset=UTF-8"'});
          saveAs(blob, 'ტრანზაქციები.csv');
          this.exportButtonLoading = false;
          this.snackbarService.openSnackBar("Data exported successfully!");
        }, () => {
          this.exportButtonLoading = false;
          this.snackbarService.openSnackBar("Data export failed.");
        }
      )
  }
}
