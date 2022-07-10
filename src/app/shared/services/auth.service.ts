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
import {from, map, ReplaySubject} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  public status$ = new ReplaySubject<User | null>();
  public isSignedIn$ = this.status$.pipe(map((status => !!status)))
  public isSignedIn: boolean | undefined;
  public user: User | null = null;

  constructor(@Optional() private auth: Auth) {
    // this.status$.subscribe(value => console.info("AUTH", value));
    this.isSignedIn$.subscribe((signedIn) => this.isSignedIn = signedIn);
    this.status$.subscribe((user) => this.user = user);

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
    await signOut(this.auth);
    // this.status$.next(null);
  }
}
