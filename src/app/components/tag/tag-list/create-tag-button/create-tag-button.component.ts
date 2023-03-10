import {ChangeDetectionStrategy, Component} from '@angular/core';
import {Router} from '@angular/router';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {PATHS_URLS} from '../../../../urls';

@Component({
  selector: 'app-create-tag-button',
  templateUrl: './create-tag-button.component.html',
  styleUrls: ['./create-tag-button.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatButtonModule,
    MatIconModule
  ],
})
export class CreateTagButtonComponent {

  constructor(private router: Router) { }

  create() {
    this.router.navigateByUrl(PATHS_URLS.createTag)
  }
}
