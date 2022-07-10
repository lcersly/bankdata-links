import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {first, Observable, skipWhile} from 'rxjs';
import {map} from 'rxjs/operators';
import {AuthService} from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class LoggedInGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.authService.isSignedIn$
      .pipe(
        skipWhile((isLoggedIn) => isLoggedIn === undefined),
        first(),
        map((isLoggedIn) => {
          if (isLoggedIn) {
            return true
          } else {
            return this.router.createUrlTree(['login'], {
              queryParams: {returnTo: route.url},
            });
          }
        }),
      );
  }

}
