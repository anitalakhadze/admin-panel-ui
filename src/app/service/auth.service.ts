import {Injectable, OnInit} from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient, HttpErrorResponse, HttpHeaders, HttpParams} from "@angular/common/http";
import {JwtHelperService} from "@auth0/angular-jwt";
import { Router } from '@angular/router';
import {Observable, throwError} from "rxjs";
import {catchError} from "rxjs/operators";

const BASE_PATH = environment.api_url;
const CLIENT = 'rms'
const SECRET = 'test-secret'
// const GRANT_TYPE = 'password'

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

const jwtHelper = new JwtHelperService();

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  parsedToken: any;

  constructor(
    private http: HttpClient,
    public router: Router
  ) {
    const token = this.getToken();
    if (token !== null && this.parsedToken === null) {
      this.parsedToken = jwtHelper.decodeToken(token);
    }
  }

  login(username: string, password: string){
    const body = new HttpParams()
      .set('username', username)
      .set('password', password);
      // .set('grant_type', GRANT_TYPE);
    return this.http.post(BASE_PATH + '/oauth/token', body, {
      headers: new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: 'Basic ' + btoa(CLIENT + ':' + SECRET)
      })
    }).subscribe((res: any) => {
      localStorage.setItem('access_token', res.access_token)
      this.parsedToken = jwtHelper.decodeToken(res.access_token);
      this.router.navigate(['restaurants']);
    });
  }

  registerLoggedInUserToken(access_token: string): void {
    localStorage.setItem('access_token', access_token);
    console.log("These are the roles " + this.getRoles());
  }

  register(username: string, password: string): Observable<any> {
    return this.http.post(BASE_PATH + '/users', {
      username,
      password
    }, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    }).pipe(
      catchError(this.handleError)
    );
  }

  getToken() {
    return localStorage.getItem('access_token');
  }

  getRoles() {
    return this.parsedToken?.roles;
  }

  hasRole(role: String) {
    // @ts-ignore
    const roles = jwtHelper.decodeToken(this.getToken()).roles[0];
    return roles !== undefined && roles[0] === role;
    // if (this.parsedToken !== undefined) {
    //   console.log("This is the local token " + this.parsedToken);
    //   const roles = this.parsedToken.roles[0];
    //   console.log("These is local roles " + roles);
    //   console.log("This is to be checked " + role)
    //   return roles === role;
    // } else {
    //   return false;
    // }
  }

  isUserLoggedIn(): boolean {
    return this.getToken() !== null;
  }

  logout() {
    localStorage.removeItem('access_token');
    this.parsedToken = null;
    this.router.navigate(['login']);
  }

  handleError(error: HttpErrorResponse) {
    let msg = '';
    if (error.error instanceof ErrorEvent) {
      // client-side error
      msg = error.error.message;
    } else {
      // server-side error
      msg = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError(msg);
  }

  getLoggedInUsername(): string {
    if (this.isUserLoggedIn()) {
      // @ts-ignore
      return jwtHelper.decodeToken(this.getToken()).sub;
    }
    return '';
  }
}
