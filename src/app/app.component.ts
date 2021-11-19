import { Component } from '@angular/core';
import {AuthService} from "./service/auth.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'admin-panel-ui';

  constructor(
    public authService: AuthService
  ) {
  }

  logout() {
    this.authService.logout();
  }

  hasAdminRights(): boolean {
    if (this.authService.isUserLoggedIn()) {
      if (this.authService.hasRole('ADMIN')) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
    // return this.authService.isUserLoggedIn() && this.authService.hasRole('ADMIN');
  }
}
