import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import {FirestoreTagService} from '../../../services/firestore/firestore-tag.service';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {SelectionModel} from '@angular/cdk/collections';
import {Router} from '@angular/router';
import {MatSort, MatSortModule} from '@angular/material/sort';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {FULL_PATHS_URLS, PATHS_URLS} from '../../../urls';
import {Tag} from '../../../models/tag.model';
import {CreateButtonComponent} from '../../../shared/components/create-button/create-button.component';
import {Subject, takeUntil} from 'rxjs';
import {FilterService} from '../../../services/filter.service';
import {AsyncPipe, NgIf} from '@angular/common';
import {LinkService} from '../../../services/link.service';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {LocalStorageService} from '../../../services/localstorage.service';

@Component({
  selector: 'app-tag-list',
  templateUrl: './tag-list.component.html',
  styleUrls: ['./tag-list.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatSortModule,
    MatCheckboxModule,
    MatIconModule,
    MatButtonModule,
    CreateButtonComponent,
    NgIf,
    MatPaginatorModule,
    AsyncPipe,
  ],
})
export class TagListComponent implements OnInit, AfterViewInit, OnDestroy {
  displayedColumns: string[] = ['key', 'description', 'usages', 'edit'];
  dataSource = new MatTableDataSource<Tag>([]);
  selection = new SelectionModel<Tag>(true, []);
  private onDestroy = new Subject<void>();

  tagCounts: Map<string, number> = new Map<string, number>();

  public createUrl = FULL_PATHS_URLS.createTag;

  @ViewChild(MatSort) sort: MatSort | undefined;
  @ViewChild(MatPaginator) paginator: MatPaginator | undefined;

  constructor(
    public fireTagService: FirestoreTagService,
    private filterService: FilterService,
    private linkService: LinkService,
    private router: Router,
    private cdRef: ChangeDetectorRef,
    public localStorageService: LocalStorageService
  ) {
  }

  ngOnInit(): void {
    this.fireTagService.tags$
      .pipe(
        takeUntil(this.onDestroy),
      )
      .subscribe(tags => {
        this.dataSource.data = tags;
        this.dataSource._updateChangeSubscription();
      })

    this.linkService.links$
      .pipe(
        takeUntil(this.onDestroy),
      )
      .subscribe(links => {
        const tagCounts = new Map<string, number>();
        for (const link of links) {
          for (const tag of link.tags) {
            let tagCount = tagCounts.get(tag.uuid) || 0;
            tagCounts.set(tag.uuid, tagCount + 1);
          }
        }
        this.tagCounts = tagCounts;
        this.cdRef.markForCheck();
      })
  }

  ngAfterViewInit(): void {
    if (this.sort) {
      this.dataSource.sort = this.sort;
    }
    if(this.paginator){
      this.dataSource.paginator = this.paginator;
      this.paginator.page.subscribe(change =>
        this.localStorageService.setPaginatorSize('tags', change.pageSize)
      )
    }
  }

  ngOnDestroy(): void {
    this.onDestroy.next();
    this.onDestroy.complete();
  }


  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  get isAnySelected() {
    return this.selection.selected.length > 0;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    this.selection.select(...this.dataSource.data);
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: Tag): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'}`;
  }

  async deleteSelected() {
    const promises = [];
    for (const tag of this.selection.selected) {
      promises.push(this.fireTagService.deleteTagFromId(tag.uuid));
    }
    await Promise.all(promises)
  }

  edit($event: MouseEvent, element: Tag) {
    $event.stopPropagation();
    this.router.navigate([PATHS_URLS.tags, element.uuid])
  }

  showLinksUsing(element: Tag) {
    this.filterService.setLinkFilters({selectedTagsUUID: [element.uuid]})
    this.router.navigateByUrl(FULL_PATHS_URLS.links);
  }

  getLinksUsing(tag: Tag): number {
    return this.tagCounts.get(tag.uuid) || 0;
  }
}
