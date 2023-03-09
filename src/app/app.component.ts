import {Component, HostBinding, OnInit} from '@angular/core';
import {MatSidenavModule} from '@angular/material/sidenav';
import {RouterOutlet} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {OverlayContainer} from '@angular/cdk/overlay';
import {ThemeService} from './shared/services/theme.service';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  imports: [
    MatSidenavModule,
    RouterOutlet,
  ],
})
export class AppComponent implements OnInit {
  title = 'BD Links';

  @HostBinding('class') className = '';

  constructor(private dialog: MatDialog, private overlay: OverlayContainer, private themeService: ThemeService) { }

  ngOnInit(): void {
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
