import {ChangeDetectionStrategy, Component, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';
import {
  AbstractControl,
  ControlValueAccessor,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
  UntypedFormBuilder,
  UntypedFormControl,
  ValidationErrors,
  Validator,
  Validators,
} from '@angular/forms';
import {fieldHasError} from '../../../shared/util';
import {Subject, takeUntil} from 'rxjs';
import {MatFormFieldModule} from '@angular/material/form-field';
import {TextFieldModule} from '@angular/cdk/text-field';
import {MatInputModule} from '@angular/material/input';
import {NgIf} from '@angular/common';
import {TagSelectorComponent} from './tag-selector/tag-selector.component';

@Component({
  selector: 'app-link-form',
  templateUrl: './link-form.component.html',
  styleUrls: ['./link-form.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: LinkFormComponent,
    },
    {
      provide: NG_VALIDATORS,
      multi: true,
      useExisting: LinkFormComponent,
    },
  ],
  imports: [
    MatFormFieldModule,
    TextFieldModule,
    MatInputModule,
    NgIf,
    ReactiveFormsModule,
    TagSelectorComponent,
  ],
})
export class LinkFormComponent implements ControlValueAccessor, Validator, OnDestroy, OnInit {
  public form = this.fb.group({
    url: ['', [Validators.required, Validators.minLength(3)]],
    name: ['', [Validators.required, Validators.minLength(3)]],
    description: '',
    // section: [''],
    // path: [''],
    tags: [[]],
    icons: [[]],
  });
  hasError = fieldHasError;
  private touched = false;
  private onDestroy = new Subject<void>();

  @Output()
  dropdownOpen = new EventEmitter<boolean>()

  constructor(private fb: UntypedFormBuilder,
  ) {
  }

  public get urlControl(): UntypedFormControl {
    return this.form.get('url') as UntypedFormControl
  }

  public get nameControl(): UntypedFormControl {
    return this.form.get('name') as UntypedFormControl
  }

  public get descriptionControl(): UntypedFormControl {
    return this.form.get('description') as UntypedFormControl
  }

  public get tagsControl(): UntypedFormControl {
    return this.form.get('tags') as UntypedFormControl
  }

  onChange: ((data: any) => void) = () => {
  };

  onTouched = () => {
  };

  ngOnInit(): void {
    this.form.valueChanges.pipe(takeUntil(this.onDestroy)).subscribe((value) => {
      this.markAsTouched();
      if (this.onChange) {
        this.onChange(value);
      } else {
        console.warn('No OnChange function registered');
      }
    });
  }

  ngOnDestroy(): void {
    this.onDestroy.next();
    this.onDestroy.complete();
  }

  registerOnChange(fn: any): void {
    this.form.valueChanges.subscribe(fn);
    this.form.valueChanges.subscribe(() => this.markAsTouched());
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    isDisabled ? this.form.disable() : this.form.enable();
  }

  writeValue(value: any): void {
    value && this.form.patchValue(value, {emitEvent: false})
  }

  markAsTouched() {
    if (!this.touched) {
      this.onTouched();
      this.touched = true;
    }
  }

  validate(control: AbstractControl): ValidationErrors | null {
    return this.form.valid ? null : {invalidLinkForm: {valid: false, message: 'link fields are invalid'}};
  }
}
