import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AngularMaterialModule } from './angular-material.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';

import { AppComponent } from './app.component';
import { LoginComponent } from './user-actions/login/login.component';
import { RegisterComponent } from './user-actions/register/register.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {AppRoutingModule} from "./app-routing.module";
import { DashboardComponent } from './dashboard/dashboard.component';
import { TransactionDetailsComponent } from './transaction-actions/transaction-details/transaction-details.component';
import {MatDialogModule} from "@angular/material/dialog";
import { MatButtonLoadingDirective } from './utils/mat-button-loading.directive';
import {MatTableFilterModule} from "mat-table-filter";
import { ChangePasswordComponent } from './user-actions/change-password/change-password.component';
import { CancelTransactionComponent } from './transaction-actions/cancel-transaction/cancel-transaction.component';
import { CompaniesConfigMainPageComponent } from './companies-config/companies-config-main-page/companies-config-main-page.component';
import { CompaniesConfigPageComponent } from './companies-config/companies-config-page/companies-config-page.component';
import { ConfiguredCompaniesPageComponent } from './companies-config/configured-companies-page/configured-companies-page.component';
import { ErrorDialogComponent } from './utils/error-dialog/error-dialog.component';
import {AuthInterceptor} from "./utils/auth.interceptor";
import { UsersComponent } from './user-actions/users/users.component';
import { UserDetailsComponent } from './user-actions/user-details/user-details.component';
import { TransactionsMainPageComponent } from './transaction-actions/transactions-main-page/transactions-main-page.component';
import { TransactionsFilterComponent } from './transaction-actions/companies-filter/transactions-filter.component';
import {NgxMatSelectSearchModule} from "ngx-mat-select-search";
import {MAT_DATE_LOCALE} from "@angular/material/core";

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    DashboardComponent,
    TransactionDetailsComponent,
    MatButtonLoadingDirective,
    ChangePasswordComponent,
    CancelTransactionComponent,
    CompaniesConfigMainPageComponent,
    CompaniesConfigPageComponent,
    ConfiguredCompaniesPageComponent,
    ErrorDialogComponent,
    UsersComponent,
    UserDetailsComponent,
    TransactionsMainPageComponent,
    TransactionsFilterComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AngularMaterialModule,
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    HttpClientModule,
    MatDialogModule,
    MatTableFilterModule,
    NgxMatSelectSearchModule,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    {provide: MAT_DATE_LOCALE, useValue: 'en-GB'},
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
