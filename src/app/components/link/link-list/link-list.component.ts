import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Link} from '../../../shared/models/link.model';
import {first, Subject, takeUntil} from 'rxjs';
import {FormBuilder, FormControl} from '@angular/forms';
import {LinkService} from '../../../shared/services/link.service';
import {FilterService} from '../../../shared/services/filter.service';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {Router} from '@angular/router';

@Component({
  selector: 'app-link-list',
  templateUrl: './link-list.component.html',
  styleUrls: ['./link-list.component.scss'],
  // changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LinkListComponent implements OnInit, OnDestroy, AfterViewInit {
  displayedColumns: string[] = ['icon', 'url', 'environment', 'tags', 'edit'];
  dataSource = new MatTableDataSource<Link>([]);
  @ViewChild(MatSort) matSort: MatSort | undefined
  private onDestroy = new Subject<void>();

  searchForm = this.fb.group({
    searchString: this.fb.control(''),
  });

  constructor(private linkService: LinkService,
              private fb: FormBuilder,
              private filterService: FilterService,
              private router: Router,
  ) {
  }

  get searchControl() {
    return this.searchForm.get('searchString') as FormControl
  }

  ngOnInit(): void {
    // initial search filters
    this.filterService.linkFilters$
      .pipe(first())
      .subscribe(linkFilters => this.searchForm.patchValue(linkFilters))

    // store all subsequent changes in the service
    this.searchForm.valueChanges
      .pipe(takeUntil(this.onDestroy))
      .subscribe(filters => this.filterService.setLinkFilters(filters));

    // subscribe to links
    this.linkService.links$
      .pipe(takeUntil(this.onDestroy))
      .subscribe(links => {
        this.dataSource.data = links;
        this.dataSource._updateChangeSubscription();
      });
  }

  edit($event: MouseEvent, element: Link) {
    $event.stopPropagation();
    this.router.navigate(['link', element.id])
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


  // searchChange() {
  //   let searchValue = this.searchControl.value?.trim();
  //   if (!searchValue && this.envControl.value?.length === this.environments.size) {
  //     this.filteredList = this.groupedList;
  //   } else {
  //     const list = new Map<string, Link[]>();
  //     for (const section of this.groupedList) {
  //       let links = section[1].filter(link => this.linkMatch(link, searchValue, this.envControl.value));
  //       if (links.length) {
  //         list.set(section[0], links);
  //       }
  //     }
  //     this.filteredList = list;
  //   }
  // }

  // linkMatch(link: Link, searchString: string | undefined, environments: string[]) {
  //   if (!environments.find(env => link.environment === env)) {
  //     return false;
  //   }
  //
  //   if (!searchString) return true;
  //   const concat = (link.section + link.url + link.name + link.description + link.tags?.join()).toLowerCase();
  //   return concat.includes(searchString.toLowerCase());
  // }
}
