import {Component, HostListener} from '@angular/core';
import {AuthService} from "./service/auth.service";
import {SnackbarService} from "./service/snackbar.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'admin-panel-ui';

  constructor(
    public authService: AuthService,
    private snackBarService: SnackbarService
  ) {
  }

  logout() {
    this.authService.logout();
    this.snackBarService.openSnackBar("User logged out successfully");
  }

  // @HostListener("window:beforeunload", ["$event"])
  // clearLocalStorage(event: Event) {
  //   localStorage.clear();
  // }
}
