import {ChangeDetectionStrategy, Component, OnDestroy, OnInit} from '@angular/core';
import {FirestoreTagService} from '../../../services/firestore/firestore-tag.service';
import {Subject, takeUntil} from 'rxjs';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormControl, Validators} from '@angular/forms';
import {fieldHasError} from '../../../shared/util';
import {NotificationService} from '../../../services/notification.service';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {NgIf} from '@angular/common';
import {MatIconModule} from '@angular/material/icon';
import {Tag} from '../../../models/tag.model';

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
              private router: Router,
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

  async save() {
    this.form.markAllAsTouched();
    if (!this.form.valid) {
      return;
    }

    const tag: Tag = this.form.value;
    await this.tagService.update(this.id!, tag.key, tag.description);
    this.notifications.tag.edited();
    this.navigateBack()
  }

  private navigateBack() {
    return this.router.navigate(['..'], {relativeTo: this.route})
  }

  public get keyControl(): UntypedFormControl {
    return this.form.get('key') as UntypedFormControl
  }

  public get descriptionControl(): UntypedFormControl {
    return this.form.get('description') as UntypedFormControl
  }

  public hasError = fieldHasError;
}
