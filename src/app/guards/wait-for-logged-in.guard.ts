import {CanActivateChildFn} from '@angular/router';
import {inject} from '@angular/core';
import {AuthService} from '../services/auth.service';
import {first, skipWhile} from 'rxjs';

export const waitForLoggedInGuard: CanActivateChildFn = (route, state) => {
  const authService = inject(AuthService);

  return authService.isSignedIn$.pipe(skipWhile(signedIn => !signedIn), first());
};
