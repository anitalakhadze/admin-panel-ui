import {EventEmitter, Injectable} from "@angular/core";

@Injectable({
  providedIn: 'root'
})

export class EventEmitService {
  sendCompanyArrayData: EventEmitter<any[]> = new EventEmitter();

  constructor() {
  }

  get getCompanyArrayData() {
    return this.sendCompanyArrayData;
  }

  emitCompanyArrayData(eventData: any[]) {
    this.sendCompanyArrayData.emit(eventData);
  }
}
