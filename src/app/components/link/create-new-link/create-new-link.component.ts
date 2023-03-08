import {Component, OnInit} from '@angular/core';
import {UntypedFormControl} from '@angular/forms';
import {environment} from '../../../../environments/environment';
import {LinkService} from '../../../shared/services/link.service';
import {Link} from '../../../shared/models/link.model';
import {NotificationService} from '../../../shared/services/notification.service';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-create-new-link',
  templateUrl: './create-new-link.component.html',
  styleUrls: ['./create-new-link.component.scss'],
})
export class CreateNewLinkComponent implements OnInit {

  public link = new UntypedFormControl();
  public params: { url: string, title: string, useParams: boolean } | undefined;

  constructor(private linkService: LinkService,
              private notifications: NotificationService,
              private router: Router,
              private route: ActivatedRoute,
  ) {
  }

  ngOnInit(): void {
    this.parseRouteParams();

    if (this.params?.useParams) {
      this.link.patchValue({
        url: this.params.url,
        name: this.params.title,
      })
    } else if (!environment.production) {
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
      console.info(this.link.errors)
      return;
    }

    let formValue = {
      ...this.link.value,
      tags: this.link.value.tags || [],
    } as Link
    await this.linkService.createLinkAndTags(formValue);

    if (this.params?.useParams) {
      window.close();
    } else {
      this.router.navigateByUrl('/link');
    }
  }

  parseRouteParams() {
    let params = this.route.snapshot.queryParams;
    const url = params['url'] as string;
    const title = params['title'] as string;
    this.params = {url, title, useParams: !!url || !!title}
  }
}
