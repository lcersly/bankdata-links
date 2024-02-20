import {
  ChangeDetectionStrategy,
  Component,
  computed, DestroyRef,
  effect,
  EventEmitter,
  inject,
  Input,
  input,
  OnInit,
  Output,
} from '@angular/core';
import {MatFormField, MatHint, MatLabel, MatSuffix} from '@angular/material/form-field';
import {MatIcon} from '@angular/material/icon';
import {MatIconButton} from '@angular/material/button';
import {MatInput} from '@angular/material/input';
import {FormControl, NonNullableFormBuilder, ReactiveFormsModule} from '@angular/forms';
import {LinkFilters} from '../../../../services/filter.service';
import {debounceTime} from 'rxjs';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-search-panel',
  standalone: true,
  imports: [
    MatFormField,
    MatHint,
    MatIcon,
    MatIconButton,
    MatInput,
    MatLabel,
    MatSuffix,
    ReactiveFormsModule,
  ],
  templateUrl: './search-panel.component.html',
  styleUrl: './search-panel.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchPanelComponent implements OnInit{
  #fb = inject(NonNullableFormBuilder)
  #destroyRef = inject(DestroyRef)

  @Input({required: true}) initialSearchParams!: LinkFilters;

  tagCount = input.required<number>();
  tagSelectedCount = input.required<number>();
  linkCount = input.required<number>();
  filteredLinksCount = input.required<number>();

  @Output() filtersChanged = new EventEmitter<LinkFilters>()

  public tagsHint = computed(() => `${this.tagCount() - this.tagSelectedCount()} / ${this.tagCount()}`);
  public linkHint = computed(() => `${this.filteredLinksCount()} / ${this.linkCount()}`);

  public searchForm = this.#fb.group({
    searchString: this.#fb.control(''),
    searchTags: this.#fb.control(''),
    selectedTagsUUID: this.#fb.array([] as FormControl<string>[]),
  });

  ngOnInit(): void {
    //set initial values, but only once
    this.searchForm.setValue(this.initialSearchParams);

    this.searchForm.valueChanges
      .pipe(
        takeUntilDestroyed(this.#destroyRef),
        debounceTime(100)).subscribe(filters => {
      const linkFilters: LinkFilters = {
        // lowercase all search strings
        searchString: filters.searchString?.toLowerCase() ?? '',
        selectedTagsUUID: filters.selectedTagsUUID ?? [],
        searchTags: filters.searchTags?.toLowerCase() ?? '',
      };

      this.filtersChanged.emit(linkFilters)
    })
  }

  get searchControl() {
    return this.searchForm.get('searchString') as FormControl<string>
  }

  get searchTagControl() {
    return this.searchForm.get('searchTags') as FormControl<string>
  }
}
