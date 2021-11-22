import { NgModule } from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import { LoginComponent } from './user-actions/login/login.component'
import { RegisterComponent } from './user-actions/register/register.component';
import {DashboardComponent} from "./dashboard/dashboard.component";
import {TransactionsComponent} from "./transaction-actions/transactions/transactions.component";
import {ChangePasswordComponent} from "./user-actions/change-password/change-password.component";
import {CompaniesConfigMainPageComponent} from "./companies-config/companies-config-main-page/companies-config-main-page.component";

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'login' },
  { path: 'login', component: LoginComponent },
  { path: 'password', component: ChangePasswordComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'dashboard/register', component: RegisterComponent },
  { path: 'dashboard/transactions', component: TransactionsComponent },
  { path: 'dashboard/companies', component: CompaniesConfigMainPageComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
