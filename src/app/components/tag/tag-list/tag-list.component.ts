import {Component, OnInit} from '@angular/core';
import {FirestoreTagService} from '../../../shared/services/firestore/firestore-tag.service';
import {MatTableDataSource} from '@angular/material/table';
import {TagDatabaseAfter} from '../../../shared/models/tag.model';
import {SelectionModel} from '@angular/cdk/collections';
import {Router} from '@angular/router';

@Component({
  selector: 'app-tag-list',
  templateUrl: './tag-list.component.html',
  styleUrls: ['./tag-list.component.scss'],
})
export class TagListComponent implements OnInit {
  displayedColumns: string[] = ['select', 'key', 'description', 'edit'];
  dataSource = new MatTableDataSource<TagDatabaseAfter>([]);
  selection = new SelectionModel<TagDatabaseAfter>(true, []);

  constructor(public fireTagService: FirestoreTagService, private router: Router) {
  }

  ngOnInit(): void {
    this.fireTagService.tags$.subscribe(tags => {
      this.dataSource.data = tags;
      this.dataSource._updateChangeSubscription();
    })
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
  checkboxLabel(row?: TagDatabaseAfter): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'}`;
  }

  async deleteSelected() {
    const promises = [];
    for (const tag of this.selection.selected) {
      promises.push(this.fireTagService.deleteTag(tag));
    }
    await Promise.all(promises)
  }

  edit($event: MouseEvent, element: TagDatabaseAfter) {
    $event.stopPropagation();
    this.router.navigate(['tag', element.id])
  }
}