import { Injectable } from '@angular/core';
import {MatDialog, MatDialogRef} from "@angular/material/dialog";
import {ErrorDialogComponent} from "../utils/error-dialog/error-dialog.component";

@Injectable({
  providedIn: 'root'
})
export class ErrorDialogService {

  constructor(
    private dialog: MatDialog
  ) { }

  openDialog(message: string, status?: number): MatDialogRef<ErrorDialogComponent> {
    return this.dialog.open(ErrorDialogComponent, {
      data: {message, status},
      maxHeight: "100%",
      width: "350px",
      maxWidth: "100%",
      disableClose: false,
      hasBackdrop: true
    });

  }
}
