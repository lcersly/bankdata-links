import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import {Link} from '../../../models/link.model';
import {
  BehaviorSubject,
  combineLatestWith,
  debounceTime,
  distinctUntilChanged,
  first,
  map,
  Subject,
  takeUntil,
} from 'rxjs';
import {
  FormArray,
  FormControl,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  UntypedFormControl,
} from '@angular/forms';
import {LinkService} from '../../../services/link.service';
import {FilterService, LinkFilters} from '../../../services/filter.service';
import {MatSort, MatSortModule} from '@angular/material/sort';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {Router} from '@angular/router';
import {FavIconService} from '../../../services/fav-icon.service';
import {CreateButtonComponent} from '../../../shared/components/create-button/create-button.component';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {NgForOf, NgIf} from '@angular/common';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatChipSelectionChange, MatChipsModule} from '@angular/material/chips';
import {OpenLinkService} from '../../../services/open-link.service';
import {PATHS_URLS, ROOT_PATHS_URLS} from '../../../urls';
import {Tag, trackByTagFn} from '../../../models/tag.model';
import {FirestoreTagService} from '../../../services/firestore/firestore-tag.service';

type SearchForm = {
  searchString: FormControl<string>,
  searchTags: FormControl<string>,
  selectedTagsUUID: FormArray<FormControl<string>>
};

@Component({
  selector: 'app-link-list',
  templateUrl: './link-list.component.html',
  styleUrls: ['./link-list.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CreateButtonComponent,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatIconModule,
    NgIf,
    MatButtonModule,
    MatInputModule,
    MatTableModule,
    MatSortModule,
    MatTooltipModule,
    MatChipsModule,
    NgForOf,
  ],
})
export class LinkListComponent implements OnInit, OnDestroy, AfterViewInit {
  displayedColumns: string[] = [
    'name',
    'tags',
    'edit',
  ];
  dataSource = new MatTableDataSource<Link>([]);

  @ViewChild(MatSort) matSort: MatSort | undefined
  private onDestroy = new Subject<void>();

  searchForm = this.fb.group<SearchForm>({
    searchString: this.fb.control(''),
    searchTags: this.fb.control(''),
    selectedTagsUUID: this.fb.array([] as FormControl<string>[]),
  });
  public createLink = ROOT_PATHS_URLS.createLink;

  public trackByTagFn = trackByTagFn;

  public filterHint = '';
  public linkHint = '';

  private selectedUUIDs = new BehaviorSubject<string[]>([]);

  constructor(private linkService: LinkService,
              private fb: NonNullableFormBuilder,
              private filterService: FilterService,
              private tagService: FirestoreTagService,
              private router: Router,
              private fav: FavIconService,
              private openLinkService: OpenLinkService,
              private cdRef: ChangeDetectorRef,
  ) {
  }

  get searchControl() {
    return this.searchForm.get('searchString') as UntypedFormControl
  }

  get searchTagControl() {
    return this.searchForm.get('searchTags') as UntypedFormControl
  }

  get tagUUIDControl() {
    return this.searchForm.get('selectedTagsUUID') as FormArray<FormControl<string>>
  }

  ngOnInit(): void {
    // set initial search filters from what is stored in service
    this.filterService.linkFilters$
      .pipe(first())
      .subscribe(linkFilters => this.searchForm.patchValue(linkFilters))

    // store all subsequent search changes in the service
    this.searchForm.valueChanges
      .pipe(
        takeUntil(this.onDestroy),
        debounceTime(100),
        map(filters => ({
          // lowercase all search strings
          searchString: filters.searchString?.toLowerCase(),
          selectedTagsUUID: filters.selectedTagsUUID,
          searchTags: filters.searchTags?.toLowerCase(),
        } as LinkFilters)),
      )
      .subscribe((filters) => {
        this.filterService.setLinkFilters(filters);
      });

    // subscribe to links
    this.filterService.filteredLinks$.pipe(
      takeUntil(this.onDestroy),
    ).subscribe((links) => {
      this.dataSource.data = links;
      this.dataSource._updateChangeSubscription();
    })

    // hint text for tags
    this.tagService.tags$.pipe(
      combineLatestWith(this.filterService.filteredTags$),
      takeUntil(this.onDestroy),
      map(([tags, filteredTags]) => `${tags.length - filteredTags.length} / ${tags.length}`),
      distinctUntilChanged(),
    ).subscribe(filterHint => {
      this.filterHint = filterHint;
      this.cdRef.markForCheck();
    });

    // hint text for links
    this.linkService.links$.pipe(
      combineLatestWith(this.filterService.filteredLinks$),
      takeUntil(this.onDestroy),
      map(([links, filteredLinks]) => `${filteredLinks.length} / ${links.length}`),
      distinctUntilChanged(),
    ).subscribe(linkHint => {
      this.linkHint = linkHint;
      this.cdRef.markForCheck();
    });

    this.filterService.searchTagUUIDs$.pipe(
      takeUntil(this.onDestroy),
    ).subscribe(selectedTagUUIDs => {
      this.selectedUUIDs.next(selectedTagUUIDs);
      this.cdRef.markForCheck();
    })
  }

  edit($event: MouseEvent, element: Link) {
    $event.stopPropagation();
    return this.router.navigate([PATHS_URLS.links, element.uuid])
  }

  delete($event: MouseEvent, element: Link) {
    $event.stopPropagation();
    return this.linkService.delete(element);
  }

  ngAfterViewInit(): void {
    if (this.matSort) {
      this.dataSource.sort = this.matSort;
    }
  }

  ngOnDestroy(): void {
    this.onDestroy.next();
    this.onDestroy.complete();
  }

  rowClicked(row: Link) {
    this.openLinkService.openLink(row);
  }

  tagClicked(tag: Tag, change: MatChipSelectionChange) {
    if(!change.isUserInput){
      return;
    }

    if(change.selected){
      const formControl = this.fb.control(tag.uuid);
      this.tagUUIDControl.push(formControl);
    }else{
      for(let i = 0; i < this.tagUUIDControl.length; i++){
        const control = this.tagUUIDControl.at(i);
        console.info("CONTROL",control.value);
        if(control.value === tag.uuid){
          this.tagUUIDControl.removeAt(i);
          break;
        }
      }
    }
  }

  cancelClick($event: MouseEvent) {
    $event.stopPropagation();
  }

  isTagSelected(tag: Tag):boolean {
    return this.selectedUUIDs.value.includes(tag.uuid);
  }
}
