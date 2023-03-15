import {ChangeDetectionStrategy, Component, HostBinding, OnInit} from '@angular/core';
import {MatSidenavModule} from '@angular/material/sidenav';
import {RouterLink, RouterLinkActive, RouterOutlet} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {OverlayContainer} from '@angular/cdk/overlay';
import {ThemeService} from './services/theme.service';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatTabsModule} from '@angular/material/tabs';
import {FormControl, ReactiveFormsModule} from '@angular/forms';
import {AuthService} from './services/auth.service';
import {first} from 'rxjs';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {NgForOf} from '@angular/common';
import {FULL_PATHS_URLS} from './urls';
import {IfLoggedInDirective} from './directives/if-logged-in.directive';

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
    MatSlideToggleModule,
    ReactiveFormsModule,
    RouterLink,
    NgForOf,
    RouterLinkActive,
    IfLoggedInDirective,
  ],
})
export class AppComponent implements OnInit {
  @HostBinding('class') className = '';

  toggleControl = new FormControl(false);
  links = [
    {route: FULL_PATHS_URLS.links, display: 'Links'},
    {route: FULL_PATHS_URLS.tags, display: 'Tags'},
    {route: FULL_PATHS_URLS.help, display: 'Help'},
  ];
  // activeLink = this.links[0];
  title = 'BD Links';

  constructor(private dialog: MatDialog, private overlay: OverlayContainer, private themeService: ThemeService, public authService: AuthService) {
  }

  ngOnInit(): void {
    this.themeService.darkMode$.pipe(
      first(),
    ).subscribe(isEnabled => this.toggleControl.setValue(isEnabled));

    this.toggleControl.valueChanges.subscribe(enabled => this.themeService.setDarkMode(enabled))

    this.themeService.darkMode$.subscribe((darkMode) => {
      const darkClassName = 'darkMode';
      this.className = darkMode ? darkClassName : '';
      if (darkMode) {
        this.overlay.getContainerElement().classList.add(darkClassName);
      } else {
        this.overlay.getContainerElement().classList.remove(darkClassName);
      }
    });
  }
}
