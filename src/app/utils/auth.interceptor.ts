import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from "@angular/common/http";
import {Observable, throwError} from "rxjs";
import {Injectable} from "@angular/core";
import {AuthService} from "../service/auth.service";
import {ErrorDialogService} from "../service/error-dialog.service";
import {catchError} from "rxjs/operators";

const TOKEN_HEADER_KEY = 'Authorization';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(
    private authService: AuthService,
    private errorDialogService: ErrorDialogService
  ) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const authToken = this.authService.getToken();
    if (authToken !== null) {
      req = req.clone({ headers: req.headers.set(TOKEN_HEADER_KEY, 'Bearer ' + authToken) });
    }
    return next
      .handle(req)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          if(error.status == 403) {
            this.authService.logout();
          }
          const dialogRef = this.errorDialogService.openDialog(JSON.stringify(error.error, null, '\t'), error.status);
          dialogRef.afterClosed().subscribe(() => {
            if(error.status == 401){
              this.authService.logout();
            }
          })
          return throwError(error);
        }),
      ) as Observable<HttpEvent<any>>;
  }

}
