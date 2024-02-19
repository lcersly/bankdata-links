import {
  ChangeDetectionStrategy,
  Component,
  effect,
  EventEmitter,
  Input,
  input,
  Output,
  viewChild,
} from '@angular/core';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {Link} from '../../../../models/link.model';
import {MatSort, MatSortModule} from '@angular/material/sort';
import {MatPaginator, PageEvent} from '@angular/material/paginator';
import {MatTooltip} from '@angular/material/tooltip';
import {MatChipListbox, MatChipOption, MatChipSelectionChange} from '@angular/material/chips';
import {MatIcon} from '@angular/material/icon';
import {Tag} from 'src/app/models/tag.model';
import {MatIconButton} from '@angular/material/button';

@Component({
  selector: 'app-link-list',
  standalone: true,
  imports: [
    MatTableModule,
    MatSortModule,
    MatTooltip,
    MatChipListbox,
    MatChipOption,
    MatIcon,
    MatPaginator,
    MatIconButton,
  ],
  templateUrl: './link-list.component.html',
  styleUrl: './link-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LinkListComponent {
  links = input.required<Link[]>();
  selectedTags = input.required<Tag[]>();
  @Input({required: true}) pageSize!: number;

  @Output() pageSizeChange = new EventEmitter<PageEvent>();

  @Output() editLink = new EventEmitter<Link>();
  @Output() deleteLink = new EventEmitter<Link>();
  @Output() openLink = new EventEmitter<Link>();
  @Output() copyLink = new EventEmitter<Link>();

  @Output() tagSelected = new EventEmitter<Tag>();
  @Output() tagDeSelected = new EventEmitter<Tag>();

  displayedColumns: string[] = [
    'name',
    'tags',
    'copy',
    'edit',
  ];
  dataSource = new MatTableDataSource<Link>([]);

  #matSort = viewChild(MatSort);
  #paginator = viewChild(MatPaginator);


  constructor() {
    effect(() => this.dataSource.sort = this.#matSort() ?? null)

    effect(() => {
      const paginator = this.#paginator();
      if (paginator) {
        this.dataSource.paginator = paginator;
        paginator.pageSize = this.pageSize;
        paginator.page.subscribe(change => this.pageSizeChange.emit(change))
      }
    })

    effect(() => {
      this.dataSource.data = this.links();
      this.dataSource._updateChangeSubscription();
    })
  }

  edit($event: MouseEvent, element: Link) {
    $event.stopPropagation();
    this.editLink.emit(element);
  }

  delete(event: MouseEvent, element: Link) {
    event.stopPropagation();
    this.deleteLink.emit(element);
  }

  rowClicked(event: Event, link: Link) {
    event.preventDefault();
    this.openLink.emit(link);
  }

  cancelClick($event: MouseEvent) {
    $event.stopPropagation();
  }

  copy(event: MouseEvent, element: Link) {
    event.stopPropagation();
    this.copyLink.next(element)
  }

  tagClicked(tag: Tag, change: MatChipSelectionChange) {
    if (!change.isUserInput) {
      return;
    }

    if (change.selected) {
      this.tagSelected.emit(tag);
    } else {
      this.tagDeSelected.emit(tag);
    }
  }
}
