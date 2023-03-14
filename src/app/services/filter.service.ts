import {Injectable} from '@angular/core';
import {
  BehaviorSubject,
  combineLatestWith,
  distinctUntilChanged,
  map,
  Observable,
  shareReplay,
  startWith,
} from 'rxjs';
import {LinkService} from './link.service';
import {Link, linkMatches} from '../models/link.model';
import {Tag, tagMatches} from '../models/tag.model';
import {FirestoreTagService} from './firestore/firestore-tag.service';

export type LinkFilters = {
  searchString: string,
  searchTags: string,
  selectedTagsUUID: string[],
};

@Injectable({
  providedIn: 'root',
})
export class FilterService {
  public readonly linkFilters$ = new BehaviorSubject<Partial<LinkFilters>>({
    searchString: '',
    searchTags: '',
    selectedTagsUUID: [],
  });

  public readonly filteredTags$ = this.linkFilters$.pipe(
    combineLatestWith(this.tagService.tags$),
    map(([filters, tags]) => {
      let filteredTags:Tag[] = []

      if (filters.searchString || filters.searchTags || (filters.selectedTagsUUID && filters.selectedTagsUUID.length > 0)) {
        filteredTags = tags.filter(tag => tagMatches(tag, filters))
      }
      console.debug("Re-filtered the tags to", filteredTags)

      return filteredTags;
    }),
    distinctUntilChanged(),
    shareReplay(1)
  );

  public readonly searchString$ = this.linkFilters$.pipe(
    map(filters => filters.searchString),
    distinctUntilChanged(),
    shareReplay(1),
  )

  public readonly searchTagUUIDs$:Observable<string[]> = this.linkFilters$.pipe(
    map(filters => filters.selectedTagsUUID || []),
    startWith([]),
    distinctUntilChanged(),
    shareReplay(1),
  )

  public readonly filteredLinks$:Observable<Link[]> = this.filteredTags$.pipe(
    combineLatestWith(this.linkService.links$, this.searchString$),
    map(([matchedTags, links, searchString]) => {
      if(matchedTags.length == 0 && !searchString){
        return links;
      }
      return links.filter(link => linkMatches(link, matchedTags, searchString));
    }),
    distinctUntilChanged(),
    startWith([]),
    shareReplay(1),
  )

  constructor(private linkService: LinkService, private tagService: FirestoreTagService) {
  }

  setLinkFilters(filters: Partial<LinkFilters>) {
    console.info("Filters", filters);
    this.linkFilters$.next(filters);
  }
}
