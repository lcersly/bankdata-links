const delimit = '◬';

export function reduceTagToSearchableString(key: string, description: string): string {
  return key.toLowerCase() + delimit + description.toLowerCase();
}

export function reduceLinkToSearchableString(name: string, url: string, description?: string): string {
  return name.toLowerCase() + delimit + description?.toLowerCase() + delimit + url.toLowerCase();
}
