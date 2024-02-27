import {computed, inject, Injectable} from '@angular/core';
import {FirestoreLinkService, LinkDatabaseAndId} from './firestore/firestore-link.service';
import {FirestoreTagService} from './firestore/firestore-tag.service';
import {Link} from '../models/link.model';
import {NotificationService} from './notification.service';
import {Tag} from '../models/tag.model';
import {reduceLinkToSearchableString} from '../shared/reducer';
import {map, skipWhile, switchMap} from 'rxjs';
import {toObservable} from '@angular/core/rxjs-interop';

@Injectable({
  providedIn: 'root',
})
export class LinkService {
  #fireLinkService= inject(FirestoreLinkService);
  #firestoreTagService= inject(FirestoreTagService);
  #notificationService= inject(NotificationService);

  links = computed(()=>{
    return this.#fireLinkService.links().map(link => convertDatabaseObjectToLink(link, this.#firestoreTagService.tags()))
  })

  links$ = toObservable(this.links);

  tagUsageCounts = computed(() => {
    const links = this.links();
    const tagCounts = new Map<string, number>();
    for (const link of links) {
      for (const tag of link.tags) {
        let tagCount = tagCounts.get(tag.uuid) || 0;
        tagCounts.set(tag.uuid, tagCount + 1);
      }
    }
    return tagCounts;
  })

  public getLink(uuid: string) {
    return toObservable(this.#fireLinkService.state).pipe(
      skipWhile(state => state.status !== 'loaded'),
      switchMap(() => this.links$),
      map(state => state.find(link => link.uuid === uuid)),
    );
  }

  public async createLinkAndTags(link: Link): Promise<void> {
    await this.#fireLinkService.create(link);
    this.#notificationService.link.created();
  }

  async edit(link: Link) {
    await this.#fireLinkService.edit(link);
    this.#notificationService.link.edited(link.name);
  }

  async delete(link: Link) {
    await this.#fireLinkService.delete(link);
    this.#notificationService.link.deleted(link.name);
  }
}

function convertDatabaseObjectToLink(object: LinkDatabaseAndId, tags: Tag[]): Link {
  const link = object.link;
  let mappedTags = link.tags
    .map(uuid => tags.find(tag => tag.uuid === uuid)!)
    .filter(tag => !!tag)
    .sort((a, b) => a.key.localeCompare(b.key));

  const {url, description, name, history} = link;

  return {
    url,
    description,
    name,
    history: history ?? [],
    uuid: object.uuid,
    tags: mappedTags,
    searchString: reduceLinkToSearchableString(link.name, link.url, link.description)
  }
}
