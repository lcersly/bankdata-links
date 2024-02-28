import {UntypedFormControl} from '@angular/forms';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator, PageEvent} from '@angular/material/paginator';
import {effect, EventEmitter, InputSignal} from '@angular/core';
import {MatSort} from '@angular/material/sort';
import {LinkHistoryType} from '../models/link.model';
import {Tag} from '../models/tag.model';

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


export function convertHistoryTagUuids(history: LinkHistoryType[] | undefined, tags: Tag[]):LinkHistoryType[] {
  history = history ?? [];

  return history.map(history => {
    const tagChange = history.changeDetails['tags'];
    if (tagChange) {
      return {
        ...history,
        changeDetails:{
          ...history.changeDetails,
          tags: [convertUuidToKey(tags, tagChange[0]), convertUuidToKey(tags, tagChange[1])]
        }
      }
    }
    return history;
  });
}

function convertUuidToKey(tags: Tag[], searchString: string) {
  return searchString.split(',')
    .filter(value => !!value)
    .map(uuid => tags.find(tag => tag.uuid === uuid)?.key)
    .map(tagKey => tagKey ?? '[UNKNOWN TAG]')
    .join(',');
}
