import {Component, OnDestroy, OnInit} from '@angular/core';
import {
  AbstractControl,
  ControlValueAccessor,
  FormBuilder,
  FormControl,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ValidationErrors,
  Validator,
  Validators,
} from '@angular/forms';
import {urlPattern} from '../constants';
import {fieldHasError} from '../../../shared/util';
import {FavIconService} from '../../../shared/services/fav-icon.service';
import {Subject, takeUntil} from 'rxjs';
import {DomSanitizer} from '@angular/platform-browser';

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
    section: [''],
    path: [''],
    tags: [[]],
    environment: ['', [Validators.required]],
    icon: [''],
  });
  hasError = fieldHasError;
  private touched = false;
  private onDestroy = new Subject<void>();

  constructor(private fb: FormBuilder,
              private favIconService: FavIconService,
              private sanitize: DomSanitizer,
  ) {
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

  getSafeIcon(icon: string) {
    return this.sanitize.bypassSecurityTrustUrl('data:image/png;base64, ' + icon);
  }

  fetchIcon(event: MouseEvent) {
    event.stopPropagation();
    this.favIconService.fetchFavIcon(this.urlControl.value)
      .subscribe(data => this.iconControl.setValue(data.base64Image));
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
