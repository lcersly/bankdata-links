import {Component, OnInit, ViewChild} from '@angular/core';
import {SideBarService} from './shared/services/side-bar.service';
import {MatDrawer, MatSidenavModule} from '@angular/material/sidenav';
import {RouterOutlet} from '@angular/router';
import {SideBarComponent} from './shared/components/side-bar/side-bar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  imports: [
    MatSidenavModule,
    RouterOutlet,
    SideBarComponent,
  ],
})
export class AppComponent implements OnInit {
  title = 'Bankdata Links';

  @ViewChild(MatDrawer) drawer: MatDrawer | undefined;

  constructor(public sideBar: SideBarService) {
  }

  ngOnInit(): void {
    this.sideBar.toggle$.subscribe(() => this.drawer?.toggle())
  }
}
