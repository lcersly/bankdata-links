import {inject, Injectable} from '@angular/core';
import {Auth, GithubAuthProvider, GoogleAuthProvider, signInWithPopup, signOut, user} from '@angular/fire/auth';
import {from, map, shareReplay} from 'rxjs';
import {NotificationService} from './notification.service';
import {Router} from '@angular/router';
import {PATHS_URLS} from '../urls';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private auth: Auth = inject(Auth);
  user$ = user(this.auth);
  public isSignedIn$ = this.user$.pipe(map((status => !!status)), shareReplay(1))
  public isSignedIn: boolean | undefined;

  constructor(private notificationService: NotificationService, private router: Router) {
    // this.status$.subscribe(value => console.info("AUTH", value));
    this.isSignedIn$.subscribe((signedIn) => this.isSignedIn = signedIn);
    this.user$.subscribe(user => {
      if(user){
        this.notificationService.authentication.loggedIn(user);
      }else{
        this.notificationService.authentication.loggedOut();
      }
    })
  }

  loginWithGoogle() {
    return from(signInWithPopup(this.auth, new GoogleAuthProvider()));
  }

  loginGitHub() {
    return from(signInWithPopup(this.auth, new GithubAuthProvider()));
  }

  async logout() {
    await signOut(this.auth);
    await this.router.navigateByUrl(PATHS_URLS.login);
    this.notificationService.authentication.loggedOut();
    // this.status$.next(null);
  }
}
