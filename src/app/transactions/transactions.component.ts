import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {Transaction} from "../interfaces";
import {ApiService} from "../service/api.service";
import {NotificationService} from "../utils/notification.service";
import {ExcelService} from "../utils/excel.service";
import {MatDialog} from "@angular/material/dialog";
import {TransactionDetailsComponent} from "../transaction-details/transaction-details.component";
import {MatSort} from "@angular/material/sort";
import {filter} from "rxjs/operators";
import {SnackbarService} from "../utils/snackbar.service";

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.css']
})
export class TransactionsComponent implements OnInit {

  transactionsDataSource = new MatTableDataSource<Transaction>([]);
  displayedColumns: string[] = ['id', 'amount', 'commission', 'invoiceData', 'dateCreated', 'details'];
  fileName = 'ტრანზაქციები';
  transactionsList?: Transaction[];
  public exportButtonLoading: boolean = false;

  @ViewChild(MatSort) set matSort(sort: MatSort) {
    this.transactionsDataSource.sort = sort;
  }

  constructor(
    private apiService: ApiService,
    private notificationService: NotificationService,
    private excelService: ExcelService,
    public dialog: MatDialog,
    private snackbarService: SnackbarService,
  ) { }

  ngOnInit(): void {
    this.getTransactions();
  }

  applyFilter(filterValue: KeyboardEvent) {
    this.transactionsDataSource.filter = (filterValue.target as HTMLInputElement).value.trim().toLocaleLowerCase();
  }

  getTransactions(): void {
    this.apiService.get("/transactions")
      .subscribe(
        data => {
          this.transactionsDataSource = new MatTableDataSource<Transaction>(data);
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
      width: '300px',
      data: data,
      disableClose: true,
    });
  }

}
