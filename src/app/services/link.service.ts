import {computed, inject, Injectable} from '@angular/core';
import {FirestoreLinkService, LinkDatabaseAndId} from './firestore/firestore-link.service';
import {FirestoreTagService} from './firestore/firestore-tag.service';
import {Link} from '../models/link.model';
import {NotificationService} from './notification.service';
import {Tag} from '../models/tag.model';
import {reduceLinkToSearchableString} from '../shared/reducer';
import {map} from 'rxjs';
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

  public getLink(uuid: string) {
    return toObservable(this.links).pipe(map(links => links.find(link => link.uuid === uuid)));
  }

  public async createLinkAndTags(link: Link): Promise<void> {
    await this.#fireLinkService.create(link);
    this.#notificationService.link.created();
  }

  async edit(link: Link) {
    console.info('link service edit', link);
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

  const {url, description, name, createdAt, updatedAt} = link;

  return {
    url,
    description,
    name,
    createdAt,
    updatedAt,
    uuid: object.uuid,
    tags: mappedTags,
    searchString: reduceLinkToSearchableString(link.name, link.url, link.description)
  }
}
