import {computed, effect, inject, Injectable, signal} from '@angular/core';
import {LinkService} from './link.service';
import {linkMatches} from '../models/link.model';
import {tagMatches} from '../models/tag.model';
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
  #linkService = inject(LinkService);
  #tagService = inject(FirestoreTagService);

  linkFilters = signal<LinkFilters>({
    searchString: '',
    searchTags: '',
    selectedTagsUUID: [],
  });

  #searchString = computed(() => this.linkFilters().searchString ?? '');

  filteredTags = computed(() => {
    const filters = this.linkFilters();
    const tags = this.#tagService.tags();

    if (filters.searchString|| filters.searchTags || (filters.selectedTagsUUID && filters.selectedTagsUUID.length > 0)) {
      return tags.filter(tag => tagMatches(tag, filters))
    }

    return [];
  })

  filteredLinks = computed(() => {
    const links = this.#linkService.links();
    const searchString = this.#searchString();
    const filteredTags = this.filteredTags();

    if (filteredTags.length > 0 || searchString) {
      return links.filter(link => linkMatches(link, filteredTags, searchString));
    }
    return links;
  })

  setLinkFilters(filters: LinkFilters) {
    this.linkFilters.set(filters);
  }


  constructor() {
    effect(() => {
      console.info("FilteredTags", this.filteredTags());
    });
    effect(() => {
      console.info("FilteredLinks", this.filteredLinks());
    });
  }
}
