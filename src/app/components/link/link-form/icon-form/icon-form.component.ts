import {Component, Input} from '@angular/core';
import {
  AbstractControl,
  ControlValueAccessor,
  FormArray,
  FormControl,
  FormGroup,
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
  public icons = new FormArray([]);
  @Input()
  public url: string | undefined;
  disabled = false;

  constructor(
    public fav: FavIconService) {
  }

  onChange: (tags: TagSelection[]) => void = () => {
  };

  onTouched = () => {
  };

  add(icon?: Icon): void {
    if (this.disabled) {
      return;
    }
    this.markAsTouched();

    this.icons.push(new FormGroup({
      src: new FormControl(icon?.src || '', [Validators.required]),
      type: new FormControl(icon?.type || '', [Validators.required]),
      base64Image: new FormControl(icon?.base64Image || '', [Validators.required]),
    }), {emitEvent: !icon});
  }

  remove(index: number): void {
    if (this.disabled) {
      return;
    }
    this.markAsTouched();
    this.icons.removeAt(index);
  }

  getControl(group: AbstractControl, key: string) {
    return group.get(key) as FormControl;
  }

  registerOnChange(fn: any): void {
    this.icons.valueChanges.subscribe(fn);
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
    console.info('Write value icon form', icons);
    this.icons.clear();
    if (icons) {
      for (const icon of icons) {
        this.add(icon)
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
      this.fav.fetchFavIcon(this.url).subscribe(data => {
        for (const datum of data) {
          this.add(datum);
        }
      })
    }
  }
}
