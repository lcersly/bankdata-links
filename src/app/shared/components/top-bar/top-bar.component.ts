import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {SideBarService} from '../../services/side-bar.service';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';

@Component({
  selector: 'app-top-bar',
  templateUrl: './top-bar.component.html',
  standalone: true,
  styleUrls: ['./top-bar.component.scss'],
  imports: [
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TopBarComponent {
  @Input()
  title: string = '';

  constructor(private sideBar: SideBarService) {
  }

  toggleMenu() {
    this.sideBar.toggle();
  }
}
