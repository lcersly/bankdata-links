import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
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
import {LinkFilters} from '../../../../../services/filter.service';
import {debounceTime} from 'rxjs';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {MatTooltip} from '@angular/material/tooltip';

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
    MatTooltip,
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

  @Output() searchChanged = new EventEmitter<string>()
  @Output() tagSearchChanged = new EventEmitter<string>()

  public filteredTags = computed(() => this.tagCount() - this.tagSelectedCount());

  public searchForm = this.#fb.group({
    searchString: this.#fb.control(''),
    searchTags: this.#fb.control(''),
  });

  ngOnInit(): void {
    //set initial values, but only once
    this.searchForm.patchValue(this.initialSearchParams);

    this.searchControl.valueChanges.pipe(
      takeUntilDestroyed(this.#destroyRef),
      debounceTime(100)
    ).subscribe(search => this.searchChanged.emit(search));

    this.searchTagControl.valueChanges.pipe(
      takeUntilDestroyed(this.#destroyRef),
      debounceTime(100)
    ).subscribe(search => this.tagSearchChanged.emit(search));

  }

  get searchControl() {
    return this.searchForm.get('searchString') as FormControl<string>
  }

  get searchTagControl() {
    return this.searchForm.get('searchTags') as FormControl<string>
  }
}
