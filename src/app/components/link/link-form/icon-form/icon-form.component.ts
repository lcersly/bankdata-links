import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {
  AbstractControl,
  ControlValueAccessor,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
  UntypedFormArray,
  UntypedFormControl,
  UntypedFormGroup,
  ValidationErrors,
  Validator,
  Validators,
} from '@angular/forms';
import {TagSelection} from '../../../../models/tag.model';
import {Icon} from '../../../../models/icon.model';
import {FavIconService} from '../../../../services/fav-icon.service';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatTooltipModule} from '@angular/material/tooltip';
import {NgForOf, NgIf} from '@angular/common';
import {MatDividerModule} from '@angular/material/divider';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';

@Component({
  selector: 'app-icon-selector',
  templateUrl: './icon-form.component.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
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
  imports: [
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    NgForOf,
    MatDividerModule,
    NgIf,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule,
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
