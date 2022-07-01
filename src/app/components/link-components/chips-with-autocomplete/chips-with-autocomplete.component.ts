import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
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
import {combineLatest, map, startWith, Subject} from 'rxjs';
import {MatChipInputEvent} from '@angular/material/chips';
import {MatAutocompleteSelectedEvent} from '@angular/material/autocomplete';
import {TagModel} from '../../../models/tag.model';
import {TagService} from '../../../services/firestore/tag.service';

@Component({
  selector: 'app-chips-with-autocomplete',
  templateUrl: './chips-with-autocomplete.component.html',
  styleUrls: ['./chips-with-autocomplete.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: ChipsWithAutocompleteComponent,
    },
    {
      provide: NG_VALIDATORS,
      multi: true,
      useExisting: ChipsWithAutocompleteComponent,
    },
  ],
})
export class ChipsWithAutocompleteComponent implements ControlValueAccessor, Validator, OnInit, OnDestroy {

  separatorKeysCodes: number[] = [ENTER, COMMA];
  tagCtrl = new FormControl('');
  filteredTags = combineLatest([
    this.tagCtrl.valueChanges,
    this.tagService.tags$.pipe(
      map(tags => tags?.map(t => ({...t, exists: true}) as Tag)),
    ),
  ]).pipe(
    startWith([null, [] as Tag[]]),
    map(([filter, tags]) => this._filter(filter, tags)),
  );
  selectedTags: Tag[] = [];
  private onDestroy = new Subject<void>();

  onChange: (tags: TagModel[]) => void = () => {
  };
  onTouched = () => {
  };
  touched = false;
  disabled = false;

  @ViewChild('tagInput') tagInput: ElementRef<HTMLInputElement> | undefined;

  constructor(private tagService: TagService) {
  }

  add(event: MatChipInputEvent): void {
    if (this.disabled) {
      return;
    }
    this.markAsTouched();

    const value = (event.value || '').trim();

    // Add our tag
    if (value) {
      let existingTag = this.tagService.tags.find(existingTag => existingTag.key.toLowerCase() === value.toLowerCase());
      if (existingTag) {
        this.selectedTags.push({...existingTag, exists: true});
      } else {
        this.selectedTags.push({key: value, description: '', exists: false});
      }

      this.onChange(this.selectedTags.map(t => ({key: t.key, description: t.description})));
    }

    // Clear the input value
    event.chipInput!.clear();

    this.tagCtrl.setValue(null);
  }

  remove(tag: Tag): void {
    this.markAsTouched();
    const index = this.selectedTags.findIndex(t => t.key === tag.key);

    if (index >= 0) {
      this.selectedTags.splice(index, 1);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.markAsTouched();
    let key = event.option.viewValue;
    let existingTag = this.tagService.tags.find(existingTag => existingTag.key.toLowerCase() === key.toLowerCase());
    if(existingTag){
      this.selectedTags.push({...existingTag, exists: true});
    }
    if (this.tagInput?.nativeElement) {
      this.tagInput.nativeElement.value = '';
    }
    this.tagCtrl.setValue(null);
  }

  private _filter(filter: string | undefined, allTags: Tag[] | null): Tag[] {
    const filterValue = filter?.toLowerCase() || '';
    allTags = allTags || [];

    if (!filterValue) {
      return allTags.slice();
    }

    return allTags.filter(tag => tag.key?.toLowerCase().includes(filterValue));
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
    if (isDisabled) {
      this.tagCtrl.disable();
    } else {
      this.tagCtrl.enable();
    }
  }

  writeValue(tagList: string[]): void {
    if (!tagList) {
      this.selectedTags = [];
    } else {
      //todo add each tag to the list
    }

    // this.selectedTags = tagList;
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

  ngOnDestroy(): void {
    this.onDestroy.next();
    this.onDestroy.complete();
  }

  ngOnInit(): void {
  }


}

interface Tag extends TagModel {
  exists: boolean;
}
