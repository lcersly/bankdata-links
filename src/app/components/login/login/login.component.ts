import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../../shared/services/auth.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {

  constructor(public authService: AuthService, private router: Router) {
  }

  ngOnInit(): void {
  }

  login(method: 'google'|'github') {
    let authObservable;

    switch (method){
      case 'google':
        authObservable =this.authService.loginWithGoogle();
        break;
      case 'github':
        authObservable =this.authService.loginGitHub();
        break;
      default:
        throw new Error("Unhandled login method");
    }

    authObservable.subscribe(() => {
      this.router.navigateByUrl('/');
    })
  }
}
