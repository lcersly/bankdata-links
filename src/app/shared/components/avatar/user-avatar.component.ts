import {Component, OnDestroy} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatMenuModule} from '@angular/material/menu';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatIconModule} from '@angular/material/icon';
import {User} from '@angular/fire/auth';
import {Observable, Subject} from 'rxjs';
import {AsyncPipe, NgForOf, NgIf} from '@angular/common';
import {DisplayNameInitialsPipe} from '../../../pipes/display-name-initials-pipe.pipe';
import {UserPhotoUrlPipe} from '../../../pipes/user-photo-url.pipe';
import {AuthService} from '../../../services/auth.service';

@Component({
  selector: 'app-user-avatar',
  templateUrl: './user-avatar.component.html',
  styleUrls: ['./user-avatar.component.scss'],
  standalone: true,
  imports: [
    MatButtonModule,
    MatMenuModule,
    MatIconModule,
    MatTooltipModule,
    MatMenuModule,
    AsyncPipe,
    NgIf,
    NgForOf,
    DisplayNameInitialsPipe,
    UserPhotoUrlPipe,
  ],
})
export class UserAvatarComponent implements OnDestroy {
  user$: Observable<User | null> = this.authService.status$

  private onDestroy = new Subject<void>();

  constructor(private authService: AuthService) {
  }

  ngOnDestroy(): void {
    this.onDestroy.next();
    this.onDestroy.complete();
  }

  signOut() {
    return this.authService.logout();
  }
}
