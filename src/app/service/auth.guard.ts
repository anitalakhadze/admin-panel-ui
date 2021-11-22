import {Injectable} from '@angular/core';
import {Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';
import {AuthService} from "./auth.service";

@Injectable({providedIn: 'root'})
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private authService: AuthService
  ) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): any {
    const restrictForLoggedInUser = route.data.restrictForLoggedInUser
    if (!this.authService.isUserLoggedIn()) {
      if(restrictForLoggedInUser){
        return true;
      }
      this.router.navigate(['login']);
      return false;
    }
    if ((route.data.role && !this.authService.hasRole(route.data.role)) || restrictForLoggedInUser) {
      this.router.navigate(['/']);
      return false;
    }
    return true;
  }
}
