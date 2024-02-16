import {ChangeDetectionStrategy, Component, HostBinding} from '@angular/core';
import {MatSidenavModule} from '@angular/material/sidenav';
import {RouterLink, RouterLinkActive, RouterOutlet} from '@angular/router';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatTabsModule} from '@angular/material/tabs';
import {FormControl, ReactiveFormsModule} from '@angular/forms';
import {AuthService} from './services/auth.service';

import {FULL_PATHS_URLS} from './urls';
import {IfLoggedInDirective} from './directives/if-logged-in.directive';
import {UserPhotoUrlPipe} from './pipes/user-photo-url.pipe';
import {MatButtonModule} from '@angular/material/button';
import {DisplayNameInitialsPipe} from './pipes/display-name-initials-pipe.pipe';
import {UserAvatarComponent} from './shared/components/avatar/user-avatar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatSidenavModule,
    RouterOutlet,
    MatToolbarModule,
    MatIconModule,
    MatTooltipModule,
    MatTabsModule,
    ReactiveFormsModule,
    RouterLink,
    RouterLinkActive,
    IfLoggedInDirective,
    UserPhotoUrlPipe,
    MatButtonModule,
    DisplayNameInitialsPipe,
    UserAvatarComponent
],
})
export class AppComponent {
  @HostBinding('class') className = '';

  toggleControl = new FormControl(false);
  links = [
    {route: FULL_PATHS_URLS.links, display: 'Links'},
    {route: FULL_PATHS_URLS.tags, display: 'Tags'},
    {route: FULL_PATHS_URLS.help, display: 'Help'},
  ];
  title = 'BD Links';

  constructor(public authService: AuthService) {
  }

}
