import {ChangeDetectionStrategy, Component, HostListener, OnDestroy, OnInit} from '@angular/core';
import {FirestoreTagService} from '../../../services/firestore/firestore-tag.service';
import {Subject, takeUntil} from 'rxjs';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormControl, Validators} from '@angular/forms';
import {fieldHasError} from '../../../shared/util';
import {NotificationService} from '../../../services/notification.service';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';

import {MatIconModule} from '@angular/material/icon';
import {Tag} from '../../../models/tag.model';
import {SAVE_SHORTCUT} from '../../../models/shortcuts';

@Component({
  selector: 'app-edit-tag',
  templateUrl: './edit-tag.component.html',
  styleUrls: ['./edit-tag.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    RouterLink,
    MatButtonModule,
    FormsModule,
    MatIconModule
],
})
export class EditTagComponent implements OnInit, OnDestroy {
  public form = this.fb.group({
    description: '',
    key: ['', Validators.required],
  });
  public hasError = fieldHasError;
  private onDestroy = new Subject<void>();
  private tagUuid: string | undefined;

  constructor(private tagService: FirestoreTagService,
              private route: ActivatedRoute,
              private router: Router,
              private fb: UntypedFormBuilder,
              private notifications: NotificationService,
  ) {
  }

  public get keyControl(): UntypedFormControl {
    return this.form.get('key') as UntypedFormControl
  }

  public get descriptionControl(): UntypedFormControl {
    return this.form.get('description') as UntypedFormControl
  }

  ngOnInit(): void {
    this.route.data
      .pipe(takeUntil(this.onDestroy))
      .subscribe((data) => {
        const tag = data['tag'] as Tag;
        this.tagUuid = tag.uuid;
        this.form.patchValue(tag);
      })
  }

  ngOnDestroy(): void {
    this.onDestroy.next();
    this.onDestroy.complete();
  }

  @HostListener(SAVE_SHORTCUT)
  async save() {
    this.form.markAllAsTouched();
    if (!this.form.valid) {
      return;
    }

    const tag: Tag = this.form.value;
    await this.tagService.update(this.tagUuid!, tag.key, tag.description);
    this.notifications.tag.edited();
    await this.navigateBack()
  }

  @HostListener('window:keydown.esc')
  public navigateBack() {
    return this.router.navigate(['..'], {relativeTo: this.route})
  }
}
