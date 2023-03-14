import {Tag} from './tag.model';

export interface LinkBase {
  url: string;
  name: string;
  description?: string;
  tags: Tag[] | string[];
}

export interface Link extends LinkBase {
  tags: Tag[];
  uuid: string;
  searchString: string;
}

export function linkMatches(link: Link, matchedTags: Tag[], searchString?: string): boolean {
  if (searchString && link.searchString.includes(searchString)) {
    return true;
  }

  for (const tag of link.tags) {
    if (matchedTags.includes(tag)) {
      return true;
    }
  }

  return false;
}
