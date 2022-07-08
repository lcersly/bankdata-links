import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormControl, Validators} from '@angular/forms';
import {urlPattern} from '../constants';
import {fieldHasError} from '../../../shared/util';
import {LinkService} from '../../../shared/services/link.service';
import {NotificationService} from '../../../shared/services/notification.service';
import {FavIconService} from '../../../shared/services/fav-icon.service';
import {environment} from '../../../../environments/environment';
import {Link} from '../../../shared/models/link.model';
import {Subject, takeUntil} from 'rxjs';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-create-link',
  templateUrl: './edit-link.component.html',
  styleUrls: ['./edit-link.component.scss']
})
export class EditLinkComponent implements OnInit, OnDestroy {

  public environments = ['T', 'S', 'P'];

  private onDestroy = new Subject<void>();

  public form = this.fb.group({
    url: ['', [Validators.required, Validators.pattern(urlPattern)]],
    name: ['', [Validators.required, Validators.minLength(3)]],
    description: '',
    section: ['', [Validators.required]],
    path: ['', [Validators.required]],
    tags: [[]],
    environment: ['', [Validators.required]],
    icon: [''],
  });

  hasError = fieldHasError;

  constructor(private fb: FormBuilder,
              private linkService: LinkService,
              private notifications: NotificationService,
              private favIconService: FavIconService,
              private route: ActivatedRoute,
  ) {
  }

  ngOnInit(): void {
    this.route.data
      .pipe(takeUntil(this.onDestroy))
      .subscribe(({link}) => this.form.patchValue(link))
  }

  ngOnDestroy(): void {
    this.onDestroy.next();
    this.onDestroy.complete();
  }

  public get urlControl(): FormControl {
    return this.form.get('url') as FormControl
  }

  public get nameControl(): FormControl {
    return this.form.get('name') as FormControl
  }

  public get descriptionControl(): FormControl {
    return this.form.get('description') as FormControl
  }

  public get sectionControl(): FormControl {
    return this.form.get('section') as FormControl
  }

  public get pathControl(): FormControl {
    return this.form.get('path') as FormControl
  }

  public get tagsControl(): FormControl {
    return this.form.get('tags') as FormControl
  }

  public get environmentControl(): FormControl {
    return this.form.get('environment') as FormControl
  }

  public get iconControl(): FormControl {
    return this.form.get('icon') as FormControl
  }

  fetchIcon(event: MouseEvent) {
    event.stopPropagation();
    this.favIconService.fetchFavIcon(this.urlControl.value)
  }

  async edit() {
    this.form.markAllAsTouched();
    if (!this.form.valid) {
      return;
    }

    await this.linkService.edit(this.form.value as Link);

    this.notifications.link.edited();
  }
}
