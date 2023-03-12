import {ChangeDetectionStrategy, Component, ElementRef, OnDestroy, ViewChild} from '@angular/core';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {
  AbstractControl,
  ControlValueAccessor,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
  UntypedFormControl,
  ValidationErrors,
  Validator,
} from '@angular/forms';
import {combineLatest, map, startWith, Subject} from 'rxjs';
import {MatChipInputEvent, MatChipsModule} from '@angular/material/chips';
import {MatAutocompleteModule, MatAutocompleteSelectedEvent} from '@angular/material/autocomplete';
import {FirestoreTagService} from '../../../../services/firestore/firestore-tag.service';
import {TagBasic, TagDatabaseAfter, TagSelection} from '../../../../models/tag.model';
import {MatFormFieldModule} from '@angular/material/form-field';
import {AsyncPipe, NgForOf, NgIf} from '@angular/common';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatIconModule} from '@angular/material/icon';

@Component({
  selector: 'app-tag-selector',
  templateUrl: './tag-selector.component.html',
  styleUrls: ['./tag-selector.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
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
  imports: [
    MatFormFieldModule,
    MatChipsModule,
    NgForOf,
    MatTooltipModule,
    MatIconModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    AsyncPipe,
    NgIf,
  ],
})
export class TagSelectorComponent implements ControlValueAccessor, Validator, OnDestroy {
  separatorKeysCodes: number[] = [ENTER, COMMA];
  tagCtrl = new UntypedFormControl('');
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

  constructor(private tagService: FirestoreTagService,
  ) {
  }

  add(event: MatChipInputEvent): void {
    if (this.disabled) {
      return;
    }
    this.markAsTouched();

    const value = (event.value || '').trim();

    if(this.tagService.hasMatchingTag(value)){
      // Clear the input value
      event.chipInput!.clear();

      this.tagCtrl.setValue(null);
    }
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
    let existingTag = this.tagService.hasMatchingTag(key);
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

  writeValue(tagList: TagDatabaseAfter[]): void {
    if (!tagList) {
      this.selectedTags = [];
    } else {
      this.selectedTags.push(...tagList);
    }
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

  private _filter<T extends TagBasic>(filter: string | undefined, allTags: T[] | null): T[] {
    const filterValue = filter?.toLowerCase() || '';
    allTags = allTags || [];

    if (!filterValue && this.selectedTags.length === 0) {
      return allTags.slice();
    }

    return allTags.filter(tag => {
      const searchFilterMatches = tag.key?.toLowerCase().includes(filterValue);
      const alreadySelected = !!this.selectedTags.find(t => t.key === tag.key);
      return searchFilterMatches && !alreadySelected;
    });
  }
}
