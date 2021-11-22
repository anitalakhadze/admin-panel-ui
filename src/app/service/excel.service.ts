import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';
import {Observable, Observer} from "rxjs";


@Injectable({
  providedIn: 'root'
})
export class ExcelService {

  constructor() { }

  exportToExcel(name: string, json: any) {
    const fileName = name.concat('.xlsx');
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'ტრანზაქციები');
    XLSX.writeFile(wb, fileName);
  }

  excelToJson(event: { target: any; }): Observable<any> {
    let workBook: XLSX.WorkBook;
    let data;
    const fileReader = new FileReader();
    fileReader.readAsBinaryString((event.target as any).files[0]);
    return new Observable((observer: Observer<object>) => {
      fileReader.onloadend = (event: any) => {
        const binaryData = event.target.result;
        workBook = XLSX.read(binaryData, { type: 'binary' });
        data = workBook.SheetNames.reduce((initial, name) => {
          const sheet = workBook.Sheets[name];
          // @ts-ignore
          initial[name] = XLSX.utils.sheet_to_json(sheet);
          return initial;
        }, {});
        observer.next(data);
        observer.complete();
      };
    });
  }
}
