import {Component, ElementRef, ViewChild} from '@angular/core';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {
  AbstractControl,
  ControlValueAccessor,
  FormControl,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ValidationErrors,
  Validator,
} from '@angular/forms';
import {map, Observable, startWith} from 'rxjs';
import {MatChipInputEvent} from '@angular/material/chips';
import {MatAutocompleteSelectedEvent} from '@angular/material/autocomplete';

@Component({
  selector: 'app-chips-with-autocomplete',
  templateUrl: './chips-with-autocomplete.component.html',
  styleUrls: ['./chips-with-autocomplete.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi:true,
      useExisting: ChipsWithAutocompleteComponent
    },
    {
      provide: NG_VALIDATORS,
      multi: true,
      useExisting: ChipsWithAutocompleteComponent
    }
  ]
})
export class ChipsWithAutocompleteComponent implements ControlValueAccessor, Validator {

  separatorKeysCodes: number[] = [ENTER, COMMA];
  tagCtrl = new FormControl('');
  filteredTags: Observable<string[]>;
  selectedTags: string[] = ['Lemon'];
  allTags: string[] = ['Apple', 'Lemon', 'Lime', 'Orange', 'Strawberry'];

  onChange: (tags:string[]) => void = ()=> {};
  onTouched = () => {};
  touched = false;
  disabled = false;

  @ViewChild('tagInput') tagInput: ElementRef<HTMLInputElement> | undefined;

  constructor() {
    this.filteredTags = this.tagCtrl.valueChanges.pipe(
      startWith(null),
      map((tag: string | null) => (tag ? this._filter(tag) : this.allTags.slice())),
    );
  }

  add(event: MatChipInputEvent): void {
    this.markAsTouched();
    if(this.disabled){
      return;
    }

    const value = (event.value || '').trim();

    // Add our tag
    if (value && !this.disabled) {
      this.selectedTags.push(value);
      this.onChange(this.selectedTags);
    }

    // Clear the input value
    event.chipInput!.clear();

    this.tagCtrl.setValue(null);
  }

  remove(tag: string): void {
    this.markAsTouched();
    const index = this.selectedTags.indexOf(tag);

    if (index >= 0) {
      this.selectedTags.splice(index, 1);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.selectedTags.push(event.option.viewValue);
    if(this.tagInput?.nativeElement){
      this.tagInput.nativeElement.value = '';
    }
    this.tagCtrl.setValue(null);
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.allTags.filter(tag => tag.toLowerCase().includes(filterValue));
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
    if(isDisabled){
      this.tagCtrl.disable();
    }else{
      this.tagCtrl.enable();
    }
  }

  writeValue(tagList: string[]): void {
    this.selectedTags = tagList;
  }

  markAsTouched() {
    if (!this.touched) {
      this.onTouched();
      this.touched = true;
    }
  }

  validate(control: AbstractControl): ValidationErrors | null {
    return null;
  }
}
