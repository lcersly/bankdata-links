import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, Validators} from '@angular/forms';
import {FirestoreTagService} from '../../../shared/services/firestore/firestore-tag.service';
import {TagBasic} from '../../../shared/models/tag.model';
import {fieldHasError} from '../../../shared/util';
import {NotificationService} from '../../../shared/services/notification.service';

@Component({
  selector: 'app-create-tag',
  templateUrl: './create-tag.component.html',
  styleUrls: ['./create-tag.component.scss'],
})
export class CreateTagComponent implements OnInit {

  public form = this.fb.group({
    description: '',
    key: ['', Validators.required]
  });

  constructor(private fb: FormBuilder,
              private fireTagService: FirestoreTagService,
              private notification: NotificationService,
  ) {
  }

  ngOnInit(): void {
  }

  public get keyControl(): FormControl {
    return this.form.get('key') as FormControl
  }

  public get descriptionControl(): FormControl {
    return this.form.get('description') as FormControl
  }

  async create() {
    this.form.markAllAsTouched();
    if (!this.form.valid) {
      return;
    }

    await this.fireTagService.createNew(this.form.value as TagBasic)

    this.notification.tag.created(this.keyControl.value);
  }

  public hasError = fieldHasError;
}
