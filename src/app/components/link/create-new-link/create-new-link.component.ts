import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {ReactiveFormsModule, UntypedFormControl} from '@angular/forms';
import {environment} from '../../../../environments/environment';
import {LinkService} from '../../../services/link.service';
import {Link} from '../../../models/link.model';
import {NotificationService} from '../../../services/notification.service';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {MatButtonModule} from '@angular/material/button';
import {BookmarkletComponent} from './bookmarklet/bookmarklet.component';
import {NgIf} from '@angular/common';
import {LinkFormComponent} from '../link-form/link-form.component';
import {MatIconModule} from '@angular/material/icon';
import {PATHS_URLS} from '../../../urls';

@Component({
  selector: 'app-create-new-link',
  templateUrl: './create-new-link.component.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./create-new-link.component.scss'],
    imports: [
        MatButtonModule,
        BookmarkletComponent,
        NgIf,
        LinkFormComponent,
        ReactiveFormsModule,
        MatIconModule,
        RouterLink
    ],
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
      this.router.navigateByUrl(PATHS_URLS.links);
    }
  }

  parseRouteParams() {
    let params = this.route.snapshot.queryParams;
    const url = params['url'] as string;
    const title = params['title'] as string;
    this.params = {url, title, useParams: !!url || !!title}
  }
}
