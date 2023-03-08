import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Link} from '../../../shared/models/link.model';
import {debounceTime, first, Subject, takeUntil} from 'rxjs';
import {UntypedFormBuilder, UntypedFormControl} from '@angular/forms';
import {LinkService} from '../../../shared/services/link.service';
import {FilterService, LinkFilters} from '../../../shared/services/filter.service';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {Router} from '@angular/router';
import {FavIconService} from '../../../shared/services/fav-icon.service';
import {AuthService} from '../../../shared/services/auth.service';

@Component({
  selector: 'app-link-list',
  templateUrl: './link-list.component.html',
  styleUrls: ['./link-list.component.scss'],
  // changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LinkListComponent implements OnInit, OnDestroy, AfterViewInit {
  displayedColumns: string[] = [
    'icons',
    'link',
    'tags',
  ];
  dataSource = new MatTableDataSource<Link>([]);

  @ViewChild(MatSort) matSort: MatSort | undefined
  private onDestroy = new Subject<void>();

  searchForm = this.fb.group({
    searchString: this.fb.control(''),
    searchTags: this.fb.control(''),
  });

  constructor(private linkService: LinkService,
              private fb: UntypedFormBuilder,
              private filterService: FilterService,
              private router: Router,
              private fav: FavIconService,
              public authService: AuthService,
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

    this.authService.isSignedIn$.subscribe(signedIn => {
      const columns = [
        'icons',
        'link',
        'tags',
      ];

      if (signedIn) {
        columns.push('edit');
      }

      this.displayedColumns = columns;
    })
  }

  edit($event: MouseEvent, element: Link) {
    $event.stopPropagation();
    this.router.navigate(['link', element.id])
  }

  delete($event: MouseEvent, element: Link) {
    $event.stopPropagation();
    return this.linkService.delete(element);
  }

  getBestIcon(element: Link) {
    if (!element.icons) return undefined;
    return this.fav.getBestIcon(element.icons);
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
}
