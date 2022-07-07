import {Component, OnDestroy, OnInit} from '@angular/core';
import {FirestoreTagService} from '../../../shared/services/firestore/firestore-tag.service';
import {Subject, takeUntil} from 'rxjs';
import {ActivatedRoute} from '@angular/router';
import {FormBuilder, FormControl, Validators} from '@angular/forms';
import {fieldHasError} from '../../../shared/util';
import {NotificationService} from '../../../shared/services/notification.service';
import {TagBasic, TagWithID} from '../../../shared/models/tag.model';

@Component({
  selector: 'app-edit-tag',
  templateUrl: './edit-tag.component.html',
  styleUrls: ['./edit-tag.component.scss'],
})
export class EditTagComponent implements OnInit, OnDestroy {
  private onDestroy = new Subject<void>();
  public form = this.fb.group({
    description: '',
    key: ['', Validators.required],
  });

  constructor(private tagService: FirestoreTagService,
              private route: ActivatedRoute,
              private fb: FormBuilder,
              private notifications: NotificationService,
  ) {
  }

  ngOnInit(): void {
    this.route.data
      .pipe(takeUntil(this.onDestroy))
      .subscribe(({tag}) => this.form.patchValue(tag))
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

    await this.tagService.update(this.form.value as TagBasic & TagWithID)
    this.notifications.tag.edited();
  }

  public get keyControl(): FormControl {
    return this.form.get('key') as FormControl
  }

  public get descriptionControl(): FormControl {
    return this.form.get('description') as FormControl
  }

  public hasError = fieldHasError;
}
