import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {SideBarService} from '../../services/side-bar.service';

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

  constructor(public sideBar: SideBarService) {
  }

  ngOnInit(): void {
  }

}

interface Link {
  title: string;
  link: string;
  icon?: string;
}
