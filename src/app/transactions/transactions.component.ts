import {Component, OnInit} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {Transaction} from "../interfaces";
import {ApiService} from "../service/api.service";
import {NotificationService} from "../utils/notification.service";
import {ExcelService} from "../utils/excel.service";
import {MatDialog} from "@angular/material/dialog";
import {TransactionDetailsComponent} from "../transaction-details/transaction-details.component";

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.css']
})
export class TransactionsComponent implements OnInit {

  transactionsDataSource = new MatTableDataSource<Transaction>([]);
  displayedColumns: string[] = ['transactionId', 'amount', 'commission', 'invoiceData', 'dateCreated', 'details'];
  fileName = 'ტრანზაქციები';
  transactionsList?: Transaction[];

  constructor(
    private apiService: ApiService,
    private notificationService: NotificationService,
    private excelService: ExcelService,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.getTransactions();
  }

  getTransactions(): void {
    this.apiService.get("/transactions")
      .subscribe(
        data => {
          this.transactionsDataSource = new MatTableDataSource<Transaction>(data);
          this.transactionsList = data;
          console.table(data);
          this.notificationService.displaySuccessMessage();
        }
      )
  }

  downloadExcel() {
    this.excelService.exportToExcel(this.fileName, this.transactionsList);
  }

  showDetails(data: any) {
    return this.dialog.open(TransactionDetailsComponent, {
      width: '300px',
      data: data,
      disableClose: true,
    });
  }

}
