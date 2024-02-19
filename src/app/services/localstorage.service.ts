import {Injectable, signal} from '@angular/core';

export type LocalStorageState = Record<PaginatorType, number>

export type PaginatorType = 'links' | 'tags';
type LocalStorageKeys = 'linksPageSize' | 'tagsPageSize';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  private paginatorSizes = signal<LocalStorageState>({
    links: 100,
    tags: 100,
  });

  constructor() {
    this.paginatorSizes.set({
      tags: this.getNumberFromLocalStorage('tagsPageSize', 100),
      links: this.getNumberFromLocalStorage('linksPageSize', 100),
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
    this.paginatorSizes.update(value => ({...value, [key]: size}));
    this.setKeyInLocalStorage(key == 'tags' ? "tagsPageSize" : "linksPageSize", size.toString());
  }

  getPaginatorSize(key: PaginatorType): number {
    return this.paginatorSizes()[key];
  }
}
