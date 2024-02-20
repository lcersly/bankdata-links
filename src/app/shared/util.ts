import {UntypedFormControl} from '@angular/forms';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator, PageEvent} from '@angular/material/paginator';
import {effect, EventEmitter, InputSignal} from '@angular/core';
import {MatSort} from '@angular/material/sort';

export function fieldHasError(urlControl: UntypedFormControl, errorCode: string) {
  return urlControl.hasError(errorCode);
}

export function initSortableFilterTableConstructorEffects<T>(dataSource: MatTableDataSource<T, MatPaginator>,
                                                             items: InputSignal<T[]>) {
  effect(() => {
    dataSource.data = items() ?? [];
    dataSource._updateChangeSubscription();
  }, {allowSignalWrites: true})
}

export function initSortableFilterTableAfterViewInit<T>(dataSource: MatTableDataSource<T, MatPaginator>,
                                                        matSort: MatSort |undefined,
                                                        paginator: MatPaginator | undefined,
                                                        pageSizeChange: EventEmitter<PageEvent>,
                                                        pageSize: number) {
  if (!matSort) {
    console.error('Could not initialize mat sort', matSort);
  } else {
    dataSource.sort = matSort;
  }

  if (!paginator) {
    console.error('Could not initialize paginator', paginator);
  } else {
    dataSource.paginator = paginator;
    dataSource.paginator.pageSize = pageSize;
    dataSource.paginator.page.subscribe(change => pageSizeChange.emit(change))
  }
}
