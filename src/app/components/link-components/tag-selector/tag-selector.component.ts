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
import {FirestoreTagService} from '../../../services/firestore/firestore-tag.service';
import {ThemePalette} from '@angular/material/core';
import {TagBasic, TagDatabaseAfter, TagExists, TagSelection} from '../../../models/tag.model';

@Component({
  selector: 'app-tag-selector',
  templateUrl: './tag-selector.component.html',
  styleUrls: ['./tag-selector.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: TagSelectorComponent,
    },
    {
      provide: NG_VALIDATORS,
      multi: true,
      useExisting: TagSelectorComponent,
    },
  ],
})
export class TagSelectorComponent implements ControlValueAccessor, Validator, OnInit, OnDestroy {
  separatorKeysCodes: number[] = [ENTER, COMMA];
  tagCtrl = new FormControl('');
  filteredTags = combineLatest([
    this.tagCtrl.valueChanges,
    this.tagService.tags$.pipe(
      map(tags => tags?.map(t => ({...t, exists: true}))),
    ),
  ]).pipe(
    startWith([null, [] as TagDatabaseAfter[]]),
    map(([filter, tags]) => this._filter(filter, tags)),
  );
  selectedTags: TagSelection[] = [];
  private onDestroy = new Subject<void>();

  onChange: (tags: TagSelection[]) => void = () => {
  };
  onTouched = () => {
  };
  disabled = false;

  @ViewChild('tagInput') tagInput: ElementRef<HTMLInputElement> | undefined;

  constructor(private tagService: FirestoreTagService) {
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
        this.selectedTags.push(existingTag);
      } else {
        this.selectedTags.push({key: value, description: '', exists: false});
      }

      this.onChange(this.selectedTags);
    }

    // Clear the input value
    event.chipInput!.clear();

    this.tagCtrl.setValue(null);
  }

  remove(tag: TagBasic): void {
    this.markAsTouched();
    const index = this.selectedTags.findIndex(t => t.key === tag.key);

    if (index >= 0) {
      this.selectedTags.splice(index, 1);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.markAsTouched();
    let key = event.option.value;
    let existingTag = this.tagService.tags.find(existingTag => existingTag.key.toLowerCase() === key.toLowerCase());
    if (existingTag) {
      console.debug('Found matching tag for key: ' + key, existingTag);
      this.selectedTags.push(existingTag);
      this.onChange(this.selectedTags);
    } else {
      console.error('Could not find matching tag from key: ' + key);
    }
    if (this.tagInput?.nativeElement) {
      this.tagInput.nativeElement.value = '';
    }
    this.tagCtrl.setValue(null);
  }

  getTagColor(tag: TagExists): ThemePalette {
    return tag.exists ? 'primary' : 'accent';
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
    if (this.onTouched) {
      this.onTouched();
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

  private _filter<T extends TagBasic>(filter: string | undefined, allTags: T[] | null): T[] {
    const filterValue = filter?.toLowerCase() || '';
    allTags = allTags || [];

    if (!filterValue) {
      return allTags.slice();
    }

    return allTags.filter(tag => tag.key?.toLowerCase().includes(filterValue));
  }
}
