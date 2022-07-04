import {Component} from '@angular/core';
import {Router} from '@angular/router';
import {PATHS_URLS} from '../../../../app-routing.module';

@Component({
  selector: 'app-create-button',
  templateUrl: './create-button.component.html',
  styleUrls: ['./create-button.component.scss']
})
export class CreateButtonComponent {

  constructor(private router: Router) { }

  create() {
    this.router.navigateByUrl(PATHS_URLS.createLink)
  }
}
