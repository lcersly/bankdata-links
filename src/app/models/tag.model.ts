export interface Tag {
  key: string;
  description: string;
  uuid: string;
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
