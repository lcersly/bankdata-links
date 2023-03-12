import {AfterViewInit, ChangeDetectionStrategy, Component, OnInit, ViewChild} from '@angular/core';
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
import {CreateTagButtonComponent} from './create-tag-button/create-tag-button.component';
import {PATHS_URLS} from '../../../urls';
import {Tag} from '../../../models/tag.model';

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
    CreateTagButtonComponent,
  ],
})
export class TagListComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['key', 'description', 'edit'];
  dataSource = new MatTableDataSource<Tag>([]);
  selection = new SelectionModel<Tag>(true, []);

  @ViewChild(MatSort) sort: MatSort | undefined;

  constructor(public fireTagService: FirestoreTagService, private router: Router) {
  }

  ngOnInit(): void {
    this.fireTagService.tags$.subscribe(tags => {
      this.dataSource.data = tags;
      this.dataSource._updateChangeSubscription();
    })
  }

  ngAfterViewInit(): void {
    if (this.sort) {
      this.dataSource.sort = this.sort;
    }
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
}
