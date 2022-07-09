import {Component, OnInit, ViewChild} from '@angular/core';
import {SideBarService} from './shared/services/side-bar.service';
import {MatDrawer} from '@angular/material/sidenav';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
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
