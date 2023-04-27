import {Injectable} from '@angular/core';
import {combineLatestWith, map, Observable, shareReplay} from 'rxjs';
import {FirestoreLinkService, LinkDatabaseAndId} from './firestore/firestore-link.service';
import {FirestoreTagService} from './firestore/firestore-tag.service';
import {Link} from '../models/link.model';
import {NotificationService} from './notification.service';
import {Tag} from '../models/tag.model';
import {reduceLinkToSearchableString} from '../shared/reducer';

@Injectable({
  providedIn: 'root',
})
export class LinkService {
  public links$: Observable<Link[]> = this.fireLinkService.allLinks$
    .pipe(
      combineLatestWith(this.firestoreTagService.tags$),
      map(([links, tags]) => links.map(link => convertDatabaseObjectToLink(link, tags))),
      shareReplay(1),
    )

  constructor(private fireLinkService: FirestoreLinkService,
              private firestoreTagService: FirestoreTagService,
              private notificationService: NotificationService,
  ) {
  }

  public getLink(uuid: string): Observable<Link | undefined> {
    return this.links$.pipe(map(links => links.find(link => link.uuid === uuid)));
  }

  public async createLinkAndTags(link: Link): Promise<void> {
    await this.fireLinkService.create(link);
    this.notificationService.link.created();
  }

  async edit(link: Link) {
    console.info('link service edit', link);
    await this.fireLinkService.edit(link);
    this.notificationService.link.edited(link.name);
  }

  async delete(link: Link) {
    await this.fireLinkService.delete(link);
    this.notificationService.link.deleted(link.name);
  }
}

function convertDatabaseObjectToLink(object: LinkDatabaseAndId, tags: Tag[]): Link {
  const link = object.link;
  let mappedTags = link.tags
    .map(uuid => tags.find(tag => tag.uuid === uuid))
    .filter(tag => !!tag) as Tag[];
  return {
    url: link.url,
    description: link.description,
    name: link.name,
    uuid: object.uuid,
    tags: mappedTags,
    searchString: reduceLinkToSearchableString(link.name, link.url, link.description)
  }
}
