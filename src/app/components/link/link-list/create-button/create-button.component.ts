import {ChangeDetectionStrategy, Component} from '@angular/core';
import {Router} from '@angular/router';
import {PATHS_URLS} from '../../../../app-routing.module';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';

@Component({
  selector: 'app-create-button',
  templateUrl: './create-button.component.html',
  styleUrls: ['./create-button.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatIconModule,
    MatButtonModule,
  ],
})
export class CreateButtonComponent {

  constructor(private router: Router) { }

  create() {
    this.router.navigateByUrl(PATHS_URLS.createLink)
  }
}
