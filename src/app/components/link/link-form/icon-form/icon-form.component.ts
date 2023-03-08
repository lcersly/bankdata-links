import {Component, Input} from '@angular/core';
import {
  AbstractControl,
  ControlValueAccessor,
  UntypedFormArray,
  UntypedFormControl,
  UntypedFormGroup,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ValidationErrors,
  Validator,
  Validators,
} from '@angular/forms';
import {TagSelection} from '../../../../shared/models/tag.model';
import {Icon} from '../../../../shared/models/icon.model';
import {FavIconService} from '../../../../shared/services/fav-icon.service';

@Component({
  selector: 'app-icon-selector',
  templateUrl: './icon-form.component.html',
  styleUrls: ['./icon-form.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: IconFormComponent,
    },
    {
      provide: NG_VALIDATORS,
      multi: true,
      useExisting: IconFormComponent,
    },
  ],
})
export class IconFormComponent implements ControlValueAccessor, Validator {
  public form = new UntypedFormGroup({
    icons: new UntypedFormArray([]),
  });
  @Input()
  public url: string | undefined;
  @Input()
  public validURL = false;
  disabled = false;

  constructor(
    public fav: FavIconService) {
  }

  onChange: (tags: TagSelection[]) => void = () => {
  };

  onTouched = () => {
  };

  public get icons() {
    return this.form.get('icons') as UntypedFormArray;
  }

  add(icon?: Icon, emit = true): void {
    if (this.disabled) {
      return;
    }
    this.markAsTouched();

    this.icons.push(new UntypedFormGroup({
      src: new UntypedFormControl(icon?.src || '', [Validators.required]),
      type: new UntypedFormControl(icon?.type || '', [Validators.required]),
      base64Image: new UntypedFormControl(icon?.base64Image || '', [Validators.required]),
    }), {emitEvent: emit});
  }

  remove(index: number): void {
    if (this.disabled) {
      return;
    }
    this.markAsTouched();
    this.icons.removeAt(index);
  }

  getControl(group: AbstractControl, key: string) {
    return group.get(key) as UntypedFormControl;
  }

  registerOnChange(fn: any): void {
    this.icons.valueChanges.subscribe(fn);
    this.icons.valueChanges.subscribe(this.markAsTouched);
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
    if (isDisabled) {
      this.icons.disable();
    } else {
      this.icons.enable();
    }
  }

  writeValue(icons: Icon[]): void {
    // console.info('Write value icon form', icons);
    this.icons.clear();
    if (icons) {
      for (const icon of icons) {
        this.add(icon, false)
      }
    }
  }

  markAsTouched() {
    if (this.onTouched) {
      this.onTouched();
    }
  }

  validate(control: AbstractControl): ValidationErrors | null {
    return this.icons.valid ? null : {iconsNotValid: {valid: false, message: 'Icons not valid'}};
  }

  addFromServer() {
    if (this.url) {
      this.fav.fetchFavIcon(this.url).subscribe(icons => {
        for (const icon of icons) {
          this.add(icon);
        }
      })
    }
  }
}
