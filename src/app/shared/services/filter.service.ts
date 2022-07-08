import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';

export type LinkFilters = {
  searchString: string,
};

@Injectable({
  providedIn: 'root',
})
export class FilterService {
  private linkFilters = new BehaviorSubject<LinkFilters>({searchString: ''});
  public linkFilters$ = this.linkFilters.asObservable();

  constructor() {
  }

  setLinkFilters(filters: LinkFilters) {
    this.linkFilters.next(filters);
  }
}
