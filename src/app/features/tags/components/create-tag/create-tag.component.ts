import {ChangeDetectionStrategy, Component, HostListener} from '@angular/core';
import {FormBuilder, FormControl, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {FirestoreTagService} from '../../../../services/firestore/firestore-tag.service';
import {fieldHasError} from '../../../../shared/util';
import {NotificationService} from '../../../../services/notification.service';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';

import {MatButtonModule} from '@angular/material/button';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {MatIconModule} from '@angular/material/icon';
import {PATHS_URLS} from '../../../../urls';
import {SAVE_SHORTCUT} from '../../../../models/shortcuts';

@Component({
  selector: 'app-create-tag',
  templateUrl: './create-tag.component.html',
  styleUrls: ['./create-tag.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatButtonModule,
    RouterLink,
    FormsModule,
    MatIconModule
],
})
export class CreateTagComponent {

  public form = this.fb.nonNullable.group({
    description: this.fb.nonNullable.control(''),
    key: this.fb.nonNullable.control('', Validators.required),
  });

  constructor(private fb: FormBuilder,
              private fireTagService: FirestoreTagService,
              private notification: NotificationService,
              private router: Router,
              private route: ActivatedRoute,
  ) {
  }

  public get keyControl(): FormControl {
    return this.form.get('key') as FormControl
  }

  public get descriptionControl(): FormControl {
    return this.form.get('description') as FormControl
  }

  @HostListener(SAVE_SHORTCUT)
  async create() {
    this.form.markAllAsTouched();
    if (!this.form.valid) {
      return;
    }

    let formValue = this.form.value;
    await this.fireTagService.createNew(formValue.key!, formValue.description!)

    this.notification.tag.created(this.keyControl.value);

    await this.router.navigateByUrl(PATHS_URLS.tags);
  }

  public hasError = fieldHasError;

  @HostListener('window:keydown.esc')
  public cancel() {
    return this.router.navigate(['..'], {relativeTo: this.route})
  }
}
