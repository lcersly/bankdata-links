import {ChangeDetectionStrategy, Component, computed, ElementRef, inject, viewChild} from '@angular/core';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {
  AbstractControl,
  ControlValueAccessor,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validator,
} from '@angular/forms';
import {MatChipInputEvent, MatChipsModule} from '@angular/material/chips';
import {MatAutocompleteModule, MatAutocompleteSelectedEvent} from '@angular/material/autocomplete';
import {FirestoreTagService} from '../../../../services/firestore/firestore-tag.service';
import {MatFormFieldModule} from '@angular/material/form-field';
import {AsyncPipe} from '@angular/common';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatIconModule} from '@angular/material/icon';
import {Tag} from '../../../../models/tag.model';
import {toSignal} from '@angular/core/rxjs-interop';

type TagWithExistingStatus = Tag & {
  exists: boolean
}

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
    MatTooltipModule,
    MatIconModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    AsyncPipe
],
})
export class TagSelectorComponent implements ControlValueAccessor, Validator {
  separatorKeysCodes: number[] = [ENTER, COMMA];
  #fb = inject(NonNullableFormBuilder);

  tagCtrl = this.#fb.control('');
  tagCtrlValue = toSignal(this.tagCtrl.valueChanges);

  filteredTags = computed(() => {
    const tags = this.#tagService.tags().map(t => ({...t, exists: true} as TagWithExistingStatus));
    return this._filter(this.tagCtrlValue(), tags);
    }
  )

  selectedTags: Tag[] = [];
  disabled = false;
  tagInput = viewChild<ElementRef>('tagInput');
  protected readonly open = open;

  #tagService = inject(FirestoreTagService);

  onChange: (tags: Tag[]) => void = () => {
  };

  onTouched = () => {
  };

  add(event: MatChipInputEvent): void {
    if (this.disabled) {
      return;
    }
    this.markAsTouched();

    const value = (event.value || '').trim();

    if (this.#tagService.hasMatchingTag(value)) {
      // Clear the input value
      event.chipInput.clear();

      this.tagCtrl.setValue('');
    }
  }

  remove(tag: Tag): void {
    this.markAsTouched();
    const index = this.selectedTags.findIndex(t => t.key === tag.key);

    if (index < 0) {
      throw new Error('Could not find tag: ' + tag);
    }

    this.selectedTags.splice(index, 1);
    this.onChange(this.selectedTags);
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.markAsTouched();
    let key = event.option.value;
    const existingTag = this.#tagService.hasMatchingTag(key);
    if (existingTag) {
        console.debug('Found matching tag for key: ' + key, existingTag);
        this.selectedTags.push(existingTag);
        this.onChange(this.selectedTags);
      } else {
        throw new Error('Could not find matching tag from key: ' + key);
      }
    let tagInput = this.tagInput();
    if (tagInput?.nativeElement) {
        tagInput.nativeElement.value = '';
      }
      this.tagCtrl.setValue('');

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

  writeValue(tagList: Tag[]): void {
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

  private _filter(filter: string | undefined, allTags: Tag[] | null): Tag[] {
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
