import {Injectable} from '@angular/core';
import {BehaviorSubject, combineLatest, map, shareReplay, startWith} from 'rxjs';
import {LinkService} from './link.service';
import {Link} from '../models/link.model';
import {TagDatabaseAfter} from '../models/tag.model';

export type LinkFilters = {
  searchString: string,
  searchTags: string
};

@Injectable({
  providedIn: 'root',
})
export class FilterService {
  public readonly linkFilters$ = new BehaviorSubject<LinkFilters>({searchString: '', searchTags: ''});

  public readonly filteredLinks$ = combineLatest([this.linkFilters$, this.linkService.links$]).pipe(
    map(([filter, links]) => links.filter(link => this.matches(link, filter))),
    shareReplay(1),
    startWith([]),
  )

  private matches(link: Link<TagDatabaseAfter>, filters: LinkFilters) {
    // search through tags
    const delimit = '◬';
    if (filters.searchTags) {
      const found = link.tags
        .reduce((prevValue: string, t: TagDatabaseAfter) => prevValue + delimit + t.key + delimit + t.description + delimit + t.id, '')
        .indexOf(filters.searchTags) != -1;
      if (!found) {
        return false;
      }
    }

    if (!filters.searchString) {
      return true; // match all if there is no search string
    }

    // ** Copied from MatTableDataSource **
    // Transform the data into a lowercase string of all property values.
    const dataStr = Object.keys(link as unknown as Record<string, any>)
      .reduce((currentTerm: string, key: string) => {
        // Use an obscure Unicode character to delimit the words in the concatenated string.
        // This avoids matches where the values of two columns combined will match the user's query
        // (e.g. `Flute` and `Stop` will match `Test`). The character is intended to be something
        // that has a very low chance of being typed in by somebody in a text field. This one in
        // particular is "White up-pointing triangle with dot" from
        // https://en.wikipedia.org/wiki/List_of_Unicode_characters
        return currentTerm + (link as unknown as Record<string, any>)[key] + delimit;
      }, '')
      .toLowerCase();

    // Transform the filter by converting it to lowercase and removing whitespace.
    const transformedFilter = filters.searchString.trim().toLowerCase();

    return dataStr.indexOf(transformedFilter) != -1;
  }

  constructor(private linkService: LinkService) {
  }

  setLinkFilters(filters: LinkFilters) {
    this.linkFilters$.next(filters);
  }
}
