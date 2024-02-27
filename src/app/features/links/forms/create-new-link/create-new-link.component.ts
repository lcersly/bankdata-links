import {ChangeDetectionStrategy, Component, HostListener, inject, OnInit} from '@angular/core';
import {ReactiveFormsModule, UntypedFormControl} from '@angular/forms';
import {environment} from '../../../../../environments/environment';
import {LinkService} from '../../../../services/link.service';
import {Link} from '../../../../models/link.model';
import {NotificationService} from '../../../../services/notification.service';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {MatButtonModule} from '@angular/material/button';
import {BookmarkletComponent} from '../../components/bookmarklet/bookmarklet.component';

import {LinkFieldsFormComponent} from '../link-fields-form/link-fields-form.component';
import {MatIconModule} from '@angular/material/icon';
import {SAVE_SHORTCUT} from '../../../../models/shortcuts';
import {DatePipe} from '@angular/common';

@Component({
  selector: 'app-create-new-link',
  templateUrl: './create-new-link.component.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers:[
    DatePipe
  ],
  styleUrls: ['./create-new-link.component.scss'],
    imports: [
    MatButtonModule,
    BookmarkletComponent,
    LinkFieldsFormComponent,
    ReactiveFormsModule,
    MatIconModule,
    RouterLink
],
})
export class CreateNewLinkComponent implements OnInit {
  #datePipe = inject(DatePipe)

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
        name: 'GoOgLe ' + this.#datePipe.transform(new Date(), "short"),
        description: 'Lorem ipsum...',
        section: 'Test',
        path: 'Test > Test',
        environment: 'T,P,S',
      })
    }
  }

  @HostListener(SAVE_SHORTCUT)
  async create() {
    this.link.markAllAsTouched();
    if (!this.link.valid) {
      return;
    }

    let formValue = {
      ...this.link.value,
      tags: this.link.value.tags || [],
      history: []
    } as Link
    await this.linkService.createLinkAndTags(formValue);

    if (this.params?.useParams) {
      window.close();
    } else {
      this.navigateBack()
    }
  }

  @HostListener('window:keydown.esc')
  public navigateBack() {
    this.router.navigate(['..'], {relativeTo: this.route})
  }

  parseRouteParams() {
    let params = this.route.snapshot.queryParams;
    const url = params['url'] as string;
    const title = params['title'] as string;
    this.params = {url, title, useParams: !!url || !!title}
  }
}
