import {Component, OnInit} from '@angular/core';
import {FormControl} from '@angular/forms';
import {environment} from '../../../../environments/environment';
import {LinkService} from '../../../shared/services/link.service';
import {Link} from '../../../shared/models/link.model';
import {fieldHasError} from '../../../shared/util';
import {NotificationService} from '../../../shared/services/notification.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-create-new-link',
  templateUrl: './create-new-link.component.html',
  styleUrls: ['./create-new-link.component.scss'],
})
export class CreateNewLinkComponent implements OnInit {

  public link = new FormControl();

  hasError = fieldHasError;

  constructor(private linkService: LinkService,
              private notifications: NotificationService,
              private router: Router,
  ) {
  }

  ngOnInit(): void {
    if (!environment.production) {
      this.link.patchValue({
        url: 'https://google.com',
        name: 'GoOgLe',
        description: 'Lorem ipsum...',
        section: 'Test',
        path: 'Test > Test',
        environment: 'T,P,S',
      })
    }
  }

  async create() {
    this.link.markAllAsTouched();
    if (!this.link.valid) {
      return;
    }

    const {tags} = await this.linkService.createLinkAndTags(this.link.value as Link);

    this.notifications.link.created(tags);
    this.router.navigateByUrl('/link');
  }
}
