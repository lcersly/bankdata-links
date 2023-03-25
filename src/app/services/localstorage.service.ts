import {Injectable} from '@angular/core';
import {first, map, Observable, ReplaySubject} from 'rxjs';

export type LocalStorageState = {
  paginatorSizeSettings: Record<PaginatorType, number>
};

export type PaginatorType = 'links' | 'tags';
type LocalStorageKeys = 'linksPageSize' | 'tagsPageSize';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  private paginatorSizes = new ReplaySubject<LocalStorageState>();

  constructor() {
    this.paginatorSizes.subscribe(sizes => {
      this.setKeyInLocalStorage('linksPageSize', sizes.paginatorSizeSettings.links.toString());
      this.setKeyInLocalStorage('tagsPageSize', sizes.paginatorSizeSettings.tags.toString());
    })

    this.paginatorSizes.next({
      paginatorSizeSettings: {
        tags: this.getNumberFromLocalStorage('tagsPageSize', 25),
        links: this.getNumberFromLocalStorage('linksPageSize', 25),
      },
    })
  }

  private getNumberFromLocalStorage(key: LocalStorageKeys, fallback: number): number {
    const item = localStorage.getItem(key);
    if (item) {
      return parseInt(item)
    }
    return fallback;
  }

  private setKeyInLocalStorage(key: LocalStorageKeys, value: string):void{
    localStorage.setItem(key, value);
  }

  setPaginatorSize(key: PaginatorType, size: number): void {
    this.paginatorSizes.pipe(first()).subscribe(sizes => {
      const newSizes: LocalStorageState = {
        ...sizes,
        paginatorSizeSettings: {
          ...sizes.paginatorSizeSettings,
        },
      }
      newSizes.paginatorSizeSettings[key] = size;
      this.paginatorSizes.next(newSizes);
    })
  }

  getPaginatorSize(key: PaginatorType): Observable<number> {
    return this.paginatorSizes.pipe(
      first(),
      map(sizes => sizes.paginatorSizeSettings[key]),
    )
  }
}
