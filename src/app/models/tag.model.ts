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
    console.debug('tag match found from selectedTagsUUID', tag);
    return true
  }

  if (filters.searchTags && tag.searchString.includes(filters.searchTags)) {
    console.debug('tag match found from searchTag', tag);
    return true;
  }

  // search the compacted string version of the tag
  if (filters.searchString && tag.searchString.includes(filters.searchString)) {
    console.debug('tag match found from searchString', tag);
    return true;
  }

  console.info("Found no tag match", tag, filters);

  return false;
}
