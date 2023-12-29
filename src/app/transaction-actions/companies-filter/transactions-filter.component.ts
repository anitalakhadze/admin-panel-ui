import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {User} from "../../interfaces";
import {FormBuilder, FormControl, Validators} from "@angular/forms";
import {ReplaySubject, Subject} from "rxjs";
import {SnackbarService} from "../../service/snackbar.service";
import {USERS_ENDPOINT} from "../../url.constants";
import {ApiService} from "../../service/api.service";
import {take, takeUntil} from "rxjs/operators";
import {MatSelect} from "@angular/material/select";
import {EventEmitService} from "../../service/event-emit.service";

@Component({
  selector: 'app-transactions-filter',
  templateUrl: './transactions-filter.component.html',
  styleUrls: ['./transactions-filter.component.css']
})
export class TransactionsFilterComponent implements OnInit, OnDestroy {
  companiesArray: User[] = [];

  searchButtonLoading: boolean = false;

  // control for the selected company for multi-selection
  public companiesMultiCtrl: FormControl = new FormControl('', Validators.required);

  // control for the MatSelect filter keyword multi-selection
  public companiesFilterController: FormControl = new FormControl();

  // list of companies filtered by search keyword
  public filteredCompanies: ReplaySubject<User[]> = new ReplaySubject<User[]>(1);

  @ViewChild('multiSelect', {static: true}) multiSelect!: MatSelect;

  // subject that emits when the component has been destroyed
  protected _onDestroy = new Subject<void>();

  companiesFilterFormGroup = this.formBuilder.group({
    filteredCompaniesControl: [null, [Validators.required]],
  });

  constructor(
    private snackBarService: SnackbarService,
    private formBuilder: FormBuilder,
    private apiService: ApiService,
    private eventEmitService: EventEmitService,
  ) { }

  ngOnInit(): void {
    this.getUsers();
    this.companiesFilterController.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterCompaniesMulti();
      });
  }

  ngOnDestroy(): void {
    this._onDestroy.next();
    this._onDestroy.complete();
  }

  getUsers() {
    this.apiService.get(USERS_ENDPOINT)
      .subscribe(
        data => {
          this.companiesArray = data;
          this.filteredCompanies.next(data);
          this.snackBarService.openSnackBar('Data loaded successfully')
        }, () => {
          this.snackBarService.openSnackBar('Error loading data')
        }
      )
  }

  filterCompaniesMulti() {
    if (!this.companiesArray) return;
    let searchKeyword = this.companiesFilterController.value;
    if (!searchKeyword) {
      this.filteredCompanies.next(this.companiesArray.slice());
      return;
    } else {
      searchKeyword = searchKeyword.toLowerCase();
    }
    this.filteredCompanies.next(
      this.companiesArray.filter(company => company.name.toLowerCase().indexOf(searchKeyword) > -1)
    );
  }

  toggleSelectAll(allValuesSelected: boolean) {
    this.filteredCompanies.pipe(take(1), takeUntil(this._onDestroy))
      .subscribe(value => {
        if (allValuesSelected) {
          const companiesArray: number[] = [];
          value.forEach(company => companiesArray.push(company.id));
          this.companiesMultiCtrl.patchValue(companiesArray);
        } else {
          this.companiesMultiCtrl.patchValue([]);
        }
      })
  }

  emitFilteredCompanies() {
    this.eventEmitService.emitCompanyArrayData(this.companiesMultiCtrl.value);
  }
}
