import {Component, OnDestroy, OnInit} from '@angular/core';
import {
  AbstractControl,
  ControlValueAccessor,
  UntypedFormBuilder,
  UntypedFormControl,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ValidationErrors,
  Validator,
  Validators,
} from '@angular/forms';
import {urlPattern} from '../constants';
import {fieldHasError} from '../../../shared/util';
import {Subject, takeUntil} from 'rxjs';

@Component({
  selector: 'app-link-form',
  templateUrl: './link-form.component.html',
  styleUrls: ['./link-form.component.scss'],
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
})
export class LinkFormComponent implements ControlValueAccessor, Validator, OnDestroy, OnInit {
  public form = this.fb.group({
    url: ['', [Validators.required, Validators.pattern(urlPattern)]],
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

  public get sectionControl(): UntypedFormControl {
    return this.form.get('section') as UntypedFormControl
  }

  public get pathControl(): UntypedFormControl {
    return this.form.get('path') as UntypedFormControl
  }

  public get tagsControl(): UntypedFormControl {
    return this.form.get('tags') as UntypedFormControl
  }

  public get iconControl(): UntypedFormControl {
    return this.form.get('icons') as UntypedFormControl
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
    console.info('Write value link-form', value);
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
