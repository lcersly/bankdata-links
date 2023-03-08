import {ChangeDetectionStrategy, Component, OnDestroy, OnInit} from '@angular/core';
import {FirestoreTagService} from '../../../shared/services/firestore/firestore-tag.service';
import {Subject, takeUntil} from 'rxjs';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormControl, Validators} from '@angular/forms';
import {fieldHasError} from '../../../shared/util';
import {NotificationService} from '../../../shared/services/notification.service';
import {TagBasic} from '../../../shared/models/tag.model';
import {TopBarComponent} from '../../../shared/components/top-bar/top-bar.component';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {NgIf} from '@angular/common';
import {MatIconModule} from '@angular/material/icon';

@Component({
  selector: 'app-edit-tag',
  templateUrl: './edit-tag.component.html',
  styleUrls: ['./edit-tag.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    TopBarComponent,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    RouterLink,
    MatButtonModule,
    NgIf,
    FormsModule,
    MatIconModule,
  ],
})
export class EditTagComponent implements OnInit, OnDestroy {
  private onDestroy = new Subject<void>();
  public form = this.fb.group({
    description: '',
    key: ['', Validators.required],
  });
  private id: string | undefined;

  constructor(private tagService: FirestoreTagService,
              private route: ActivatedRoute,
              private fb: UntypedFormBuilder,
              private notifications: NotificationService,
  ) {
  }

  ngOnInit(): void {
    this.route.data
      .pipe(takeUntil(this.onDestroy))
      .subscribe(({tag}) => {
        this.form.patchValue(tag);
        this.id = tag.id;
      })
  }

  ngOnDestroy(): void {
    this.onDestroy.next();
    this.onDestroy.complete();
  }

  async edit() {
    this.form.markAllAsTouched();
    if (!this.form.valid) {
      return;
    }

    await this.tagService.update(this.form.value as TagBasic, this.id!);
    this.notifications.tag.edited();
  }

  public get keyControl(): UntypedFormControl {
    return this.form.get('key') as UntypedFormControl
  }

  public get descriptionControl(): UntypedFormControl {
    return this.form.get('description') as UntypedFormControl
  }

  public hasError = fieldHasError;
}
