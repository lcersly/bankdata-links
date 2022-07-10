import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {SideBarService} from '../../services/side-bar.service';
import {AuthService} from '../../services/auth.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class SideBarComponent implements OnInit {
  public links: Link[] = [
    {title: 'Links', link: '/link', icon: 'list'},
    {title: 'Tags', link: '/tag', icon: 'bookmarks'},
  ];

  constructor(public sideBar: SideBarService, public authService: AuthService, private router: Router) {
  }

  ngOnInit(): void {
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
