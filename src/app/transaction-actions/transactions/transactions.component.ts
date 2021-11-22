import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {Transaction} from "../../interfaces";
import {ApiService} from "../../service/api.service";
import {NotificationService} from "../../service/notification.service";
import {ExcelService} from "../../service/excel.service";
import {MatDialog} from "@angular/material/dialog";
import {TransactionDetailsComponent} from "../transaction-details/transaction-details.component";
import {MatSort} from "@angular/material/sort";
import {SnackbarService} from "../../service/snackbar.service";
import {CancelTransactionComponent} from "../cancel-transaction/cancel-transaction.component";
import {MatPaginator} from "@angular/material/paginator";
import {HttpHeaders} from "@angular/common/http";
import {AuthService} from "../../service/auth.service";

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.css']
})
export class TransactionsComponent implements OnInit {

  transactionsDataSource = new MatTableDataSource<Transaction>([]);
  displayedColumns: string[] = ['id', 'amount', 'commission', 'invoiceData', 'dateCreated', 'details', 'cancel'];
  fileName = 'ტრანზაქციები';
  transactionsList?: Transaction[];
  public exportButtonLoading: boolean = false;
  public cancelButtonLoading: boolean = false;

  @ViewChild(MatSort) set matSort(sort: MatSort) {
    this.transactionsDataSource.sort = sort;
  }

  @ViewChild(MatPaginator, {static: false}) paginator!: MatPaginator;

  constructor(
    private apiService: ApiService,
    private notificationService: NotificationService,
    private excelService: ExcelService,
    public dialog: MatDialog,
    private snackbarService: SnackbarService,
    private authService: AuthService
  ) {
  }

  ngOnInit(): void {
    this.getTransactions();
  }

  applyFilter(filterValue: KeyboardEvent) {
    this.transactionsDataSource.filter = (filterValue.target as HTMLInputElement).value.trim().toLocaleLowerCase();
  }

  getTransactions(): void {
    let headers = new HttpHeaders().set('Authorization', 'Bearer ' + this.authService.getToken())
      .set('Content-Type', 'application/json');
    this.apiService.get("/transactions")
      .subscribe(
        data => {
          this.transactionsDataSource = new MatTableDataSource<Transaction>(data);
          setTimeout(() => this.transactionsDataSource.paginator = this.paginator);
          this.transactionsList = data;
          console.table(data);
          this.snackbarService.openSnackBar('მონაცემების ჩატვირთვა დასრულდა წარმატებით')
        }, error => {
          this.snackbarService.openSnackBar('მონაცემების ჩატვირთვა დასრულდა წარმატების უგარეშოდ')
        }
      )
  }

  downloadExcel() {
    this.exportButtonLoading = true;
    this.excelService.exportToExcel(this.fileName, this.transactionsList);
    this.exportButtonLoading = false;
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
}
