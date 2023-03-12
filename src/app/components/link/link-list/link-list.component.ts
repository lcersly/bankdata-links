import {AfterViewInit, ChangeDetectionStrategy, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Link} from '../../../models/link.model';
import {debounceTime, first, Subject, takeUntil} from 'rxjs';
import {ReactiveFormsModule, UntypedFormBuilder, UntypedFormControl} from '@angular/forms';
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
import {MatChipsModule} from '@angular/material/chips';
import {OpenLinkService} from '../../../services/open-link.service';
import {PATHS_URLS, ROOT_PATHS_URLS} from '../../../urls';

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

  searchForm = this.fb.group({
    searchString: this.fb.control(''),
    searchTags: this.fb.control(''),
  });
  createLink = ROOT_PATHS_URLS.createLink;

  constructor(private linkService: LinkService,
              private fb: UntypedFormBuilder,
              private filterService: FilterService,
              private router: Router,
              private fav: FavIconService,
              private openLinkService: OpenLinkService,
  ) {
  }

  get searchControl() {
    return this.searchForm.get('searchString') as UntypedFormControl
  }

  get searchTagControl() {
    return this.searchForm.get('searchTags') as UntypedFormControl
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
        debounceTime(200),
      )
      .subscribe((filters: LinkFilters) => {
        this.filterService.setLinkFilters(filters);
      });

    // subscribe to links
    this.filterService.filteredLinks$.pipe(
      takeUntil(this.onDestroy),
    ).subscribe((links) => {
      this.dataSource.data = links;
      this.dataSource._updateChangeSubscription();
    })
  }

  edit($event: MouseEvent, element: Link) {
    $event.stopPropagation();
    this.router.navigate([PATHS_URLS.links, element.uuid])
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

  cancelClick($event: MouseEvent) {
    $event.stopPropagation();
  }

  rowClicked(row: Link) {
    this.openLinkService.openLink(row);
  }
}
