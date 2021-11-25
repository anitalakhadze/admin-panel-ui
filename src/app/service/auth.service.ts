import {Injectable} from '@angular/core';
import {JwtHelperService} from "@auth0/angular-jwt";
import { Router } from '@angular/router';
import {LOGIN_ENDPOINT} from "../url.constants";

const jwtHelper = new JwtHelperService();
const ACCESS_TOKEN_KEY = "AccessToken";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  parsedToken: any;

  constructor(
    public router: Router
  ) {
    const token = this.getToken();
    if (token !== null && (this.parsedToken === null || this.parsedToken === undefined)) {
      this.parsedToken = jwtHelper.decodeToken(token);
    }
  }

  registerLoggedInUserToken(access_token: string): void {
    this.parsedToken = jwtHelper.decodeToken(access_token);
    localStorage.setItem(ACCESS_TOKEN_KEY, access_token);
  }

  getToken() {
    return localStorage.getItem(ACCESS_TOKEN_KEY);
  }

  getRoles() {
    return this.parsedToken?.roles;
  }

  hasRole(role: String) {
    // return this.roles.includes(role);
    const roles = this.getRoles();
    return roles !== undefined && roles.indexOf(role) !== -1;
  }

  isUserLoggedIn(): boolean {
    return this.getToken() !== null && this.parsedToken !== undefined;
  }

  logout() {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    this.parsedToken = null;
    this.router.navigate([LOGIN_ENDPOINT]);
  }

  getLoggedInUsername(): string {
    if (this.isUserLoggedIn()) {
      // @ts-ignore
      return jwtHelper.decodeToken(this.getToken()).sub;
    }
    return '';
  }
}
