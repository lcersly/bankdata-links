import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  effect,
  EventEmitter,
  inject,
  Input,
  input,
  Output,
  viewChild,
} from '@angular/core';
import {MatButton, MatIconButton} from '@angular/material/button';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatCheckbox} from '@angular/material/checkbox';
import {MatIcon} from '@angular/material/icon';
import {MatPaginator, PageEvent} from '@angular/material/paginator';
import {MatSort, MatSortModule} from '@angular/material/sort';
import {Tag} from '../../../../../models/tag.model';
import {SelectionModel} from '@angular/cdk/collections';
import {
  initSortableFilterTableAfterViewInit,
  initSortableFilterTableConstructorEffects,
} from '../../../../../shared/util';
import {Router} from '@angular/router';
import {TagUsageButtonComponent} from '../../../../../shared/components/tag-usage-button/tag-usage-button.component';

@Component({
  selector: 'app-tag-list',
  standalone: true,
  imports: [
    MatTableModule,
    MatSortModule,
    MatButton,
    MatCheckbox,
    MatIcon,
    MatIconButton,
    MatPaginator,
    TagUsageButtonComponent,
  ],
  templateUrl: './tag-list.component.html',
  styleUrl: './tag-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TagListComponent implements AfterViewInit {
  router = inject(Router);

  @Input() pageSize = 0;
  tags = input.required<Tag[]>();
  filters = input.required<string>();

  @Output() pageSizeChange = new EventEmitter<PageEvent>();
  @Output() showLinksUsing = new EventEmitter<Tag>();
  @Output() editLink = new EventEmitter<Tag>();

  displayedColumns = ['key', 'description', 'usages', 'edit'];
  dataSource = new MatTableDataSource<Tag>([]);
  selection = new SelectionModel<Tag>(true, []);

  matSort = viewChild(MatSort);
  paginator = viewChild(MatPaginator);

  constructor() {
    initSortableFilterTableConstructorEffects(this.dataSource, this.tags);
    effect(() => {
      this.dataSource.filter = this.filters().trim().toLowerCase();

      if (this.dataSource.paginator) {
        this.dataSource.paginator.firstPage();
      }
    })
  }

  ngAfterViewInit(): void {
    initSortableFilterTableAfterViewInit(this.dataSource, this.matSort(), this.paginator(), this.pageSizeChange, this.pageSize);
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

  edit(event: MouseEvent, tag: Tag) {
    event.stopPropagation();
    this.editLink.emit(tag);
  }
}
