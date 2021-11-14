import {Component, Inject, OnInit} from '@angular/core';
import {TransactionDetails} from "../interfaces";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-transaction-details',
  templateUrl: './transaction-details.component.html',
  styleUrls: ['./transaction-details.component.css']
})
export class TransactionDetailsComponent implements OnInit {

  transactionData: TransactionDetails;

  constructor(
    public dialogRef: MatDialogRef<TransactionDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: TransactionDetails
  ) {
    this.transactionData = data;
  }

  ngOnInit(): void {
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
