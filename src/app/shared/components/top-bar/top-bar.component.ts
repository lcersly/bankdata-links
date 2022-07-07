import {Component, Input, OnInit} from '@angular/core';
import {SideBarService} from '../../services/side-bar.service';

@Component({
  selector: 'app-top-bar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.scss'],
})
export class TopBarComponent implements OnInit {
  @Input()
  title: string = '';

  constructor(private sideBar: SideBarService) {
  }

  ngOnInit(): void {
  }

  toggleMenu() {
    this.sideBar.toggle();
  }
}
