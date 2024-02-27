import {Tag} from './tag.model';
import {Change} from './history.model';

export interface LinkBase {
  url: string;
  name: string;
  deleted?: boolean;
  description?: string;
}

export type LinkHistoryType = Change<LinkBase>;

export interface Link extends LinkBase {
  tags: Tag[];
  uuid: string;
  searchString: string;
  history: LinkHistoryType[];
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
