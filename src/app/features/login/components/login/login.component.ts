import {ChangeDetectionStrategy, Component} from '@angular/core';
import {AuthService} from '../../../../services/auth.service';
import {Router} from '@angular/router';
import {MatButtonModule} from '@angular/material/button';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatButtonModule,
  ],
})
export class LoginComponent {

  constructor(public authService: AuthService,
              private router: Router) {
  }

  login(method: 'google' | 'github') {
    let authObservable;

    switch (method) {
      case 'google':
        authObservable = this.authService.loginWithGoogle();
        break;
      case 'github':
        authObservable = this.authService.loginGitHub();
        break;
      default:
        throw new Error('Unhandled login method');
    }

    authObservable.subscribe(() => {
      // this.notificationService.authentication.loggedIn()
      this.router.navigateByUrl('/');
    })
  }
}
