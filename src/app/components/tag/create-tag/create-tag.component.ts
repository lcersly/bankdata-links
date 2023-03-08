import {ChangeDetectionStrategy, Component} from '@angular/core';
import {FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormControl, Validators} from '@angular/forms';
import {FirestoreTagService} from '../../../shared/services/firestore/firestore-tag.service';
import {TagBasic} from '../../../shared/models/tag.model';
import {fieldHasError} from '../../../shared/util';
import {NotificationService} from '../../../shared/services/notification.service';
import {TopBarComponent} from '../../../shared/components/top-bar/top-bar.component';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {NgIf} from '@angular/common';
import {MatButtonModule} from '@angular/material/button';
import {RouterLink} from '@angular/router';
import {MatIconModule} from '@angular/material/icon';

@Component({
  selector: 'app-create-tag',
  templateUrl: './create-tag.component.html',
  styleUrls: ['./create-tag.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    TopBarComponent,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    NgIf,
    MatButtonModule,
    RouterLink,
    FormsModule,
    MatIconModule,
  ],
})
export class CreateTagComponent {

  public form = this.fb.group({
    description: '',
    key: ['', Validators.required]
  });

  constructor(private fb: UntypedFormBuilder,
              private fireTagService: FirestoreTagService,
              private notification: NotificationService,
  ) {
  }

  public get keyControl(): UntypedFormControl {
    return this.form.get('key') as UntypedFormControl
  }

  public get descriptionControl(): UntypedFormControl {
    return this.form.get('description') as UntypedFormControl
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
