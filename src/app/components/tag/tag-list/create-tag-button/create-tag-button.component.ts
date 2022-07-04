import {Component} from '@angular/core';
import {Router} from '@angular/router';
import {PATHS_URLS} from '../../../../app-routing.module';

@Component({
  selector: 'app-create-tag-button',
  templateUrl: './create-tag-button.component.html',
  styleUrls: ['./create-tag-button.component.scss']
})
export class CreateTagButtonComponent {

  constructor(private router: Router) { }

  create() {
    this.router.navigateByUrl(PATHS_URLS.createTag)
  }
}
