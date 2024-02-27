import {TrackByFunction} from '@angular/core';
import {LinkFilters} from '../services/filter.service';

export interface TagBase {
  key: string;
  description: string;
  uuid: string;
}

export interface Tag extends TagBase {
  searchString: string;
}

export function tagEquals(t1: Tag, t2: Tag): boolean {
  return keyMatchesTag(t1.key, t2);
}

export function keyMatchesTag(key: string | undefined, tag: Tag) {
  return !!key && key.toLowerCase() === tag.key.toLowerCase();
}

export function findMatchingTagInList(tags: Tag[], key: string): Tag | undefined {
  return tags.find(tag => keyMatchesTag(key, tag));
}

export const trackByTagFn: TrackByFunction<Tag> = (index, tag) => {
  return tag.key
}

export function tagMatches(tag: Tag, filters: Partial<LinkFilters>): boolean {
  // search for an uuid match
  if (filters.selectedTagsUUID?.length && filters.selectedTagsUUID.includes(tag.uuid)) {
    return true
  }

  if (filters.searchTags && tag.searchString.includes(filters.searchTags)) {
    return true;
  }

  // search the compacted string version of the tag
  // noinspection RedundantIfStatementJS
  if (filters.searchString && tag.searchString.includes(filters.searchString)) {
    return true;
  }

  return false;
}
