import {Injectable, Optional} from '@angular/core';
import {
  Auth,
  authState,
  FacebookAuthProvider,
  GithubAuthProvider,
  GoogleAuthProvider,
  signInAnonymously,
  signInWithPopup,
  signOut,
  User,
} from '@angular/fire/auth';
import {from, Subject} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  public status$ = new Subject<User | null>();

  constructor(@Optional() private auth: Auth) {
    // this.status$.subscribe(value => console.info("AUTH", value));

    if (this.auth) {
      authState(this.auth).subscribe(value => this.status$.next(value));
    } else {
      this.status$.next(null);
    }
  }

  loginWithGoogle() {
    return from(signInWithPopup(this.auth, new GoogleAuthProvider()));
  }

  loginFacebook() {
    return from(signInWithPopup(this.auth, new FacebookAuthProvider()));
  }

  loginGitHub() {
    return from(signInWithPopup(this.auth, new GithubAuthProvider()));
  }

  async loginAnonymously() {
    return await signInAnonymously(this.auth);
  }

  async logout() {
    return await signOut(this.auth);
  }
}
