import { NgModule } from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import { LoginComponent } from './user-actions/login/login.component'
import { RegisterComponent } from './user-actions/register/register.component';
import {DashboardComponent} from "./dashboard/dashboard.component";
import {ChangePasswordComponent} from "./user-actions/change-password/change-password.component";
import {CompaniesConfigMainPageComponent} from "./companies-config/companies-config-main-page/companies-config-main-page.component";
import {UsersComponent} from "./user-actions/users/users.component";
import {TransactionsMainPageComponent} from "./transaction-actions/transactions-main-page/transactions-main-page.component";
import {AuthGuard} from "./service/auth.guard";

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'login'},
  { path: 'login', component: LoginComponent },
  { path: 'password', component: ChangePasswordComponent, canActivate: [AuthGuard] },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'dashboard/users', component: UsersComponent, canActivate: [AuthGuard] },
  { path: 'dashboard/register', component: RegisterComponent, canActivate: [AuthGuard] },
  { path: 'dashboard/transactions', component: TransactionsMainPageComponent, canActivate: [AuthGuard] },
  { path: 'dashboard/companies', component: CompaniesConfigMainPageComponent, canActivate: [AuthGuard] },
  { path: '**', redirectTo: 'login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
