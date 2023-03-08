import {ChangeDetectionStrategy, Component, ViewEncapsulation} from '@angular/core';
import {SideBarService} from '../../services/side-bar.service';
import {AuthService} from '../../services/auth.service';
import {Router, RouterLink} from '@angular/router';
import {NgForOf, NgIf} from '@angular/common';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';

@Component({
  selector: 'app-side-bar',
  standalone: true,
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NgIf,
    NgForOf,
    RouterLink,
    MatIconModule,
    MatButtonModule,
  ],
})
export class SideBarComponent {
  public links: Link[] = [
    {title: 'Links', link: '/link', icon: 'list'},
    {title: 'Tags', link: '/tag', icon: 'bookmarks'},
  ];

  constructor(public sideBar: SideBarService, public authService: AuthService, private router: Router) {
  }

  loginLogoff() {
    if (this.authService.isSignedIn) {
      this.authService.logout();
    } else {
      this.router.navigateByUrl('/login');
    }
    this.sideBar.toggle();
  }
}

interface Link {
  title: string;
  link: string;
  icon?: string;
}
