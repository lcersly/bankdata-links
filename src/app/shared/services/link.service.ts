import {Injectable} from '@angular/core';
import {combineLatest, map, shareReplay} from 'rxjs';
import {FirestoreLinkService} from './firestore/firestore-link.service';
import {FirestoreTagService} from './firestore/firestore-tag.service';
import {Link} from '../models/link.model';
import {TagDatabaseAfter} from '../models/tag.model';

@Injectable({
  providedIn: 'root',
})
export class LinkService {
  public links$ = combineLatest([this.fireLinkService.allLinks$, this.firestoreTagService.tags$])
    .pipe(
      map(([links, tags]) => {
        return links.map(link => this.replaceTagIdsWithFullTag(link, tags))
      }),
      shareReplay(1),
    )

  constructor(private fireLinkService: FirestoreLinkService,
              private firestoreTagService: FirestoreTagService,
  ) {
  }

  public getLink(id: string) {
    return this.links$.pipe(map(links => links.find(link => link.id === id)));
  }

  public async createLinkAndTags(link: Link) {
    let created = await this.createMissingTags(link);

    await this.fireLinkService.create(link);

    return created;
  }

  async edit(link: Link) {
    if (!link.id) {
      throw new Error('Link has no id');
    }
    let created = await this.createMissingTags(link);

    await this.fireLinkService.edit(link);

    return created;
  }

  async delete(link: Link) {
    if (!link.id) {
      throw new Error('No id on link');
    }

    await this.fireLinkService.delete(link);
  }

  private async createMissingTags(link: Link) {
    const created = {
      tags: 0,
    };
    for (const tag of link.tags) {
      if (tag && !tag.exists) {
        console.debug('Creating new tag', tag);
        let documentReference = await this.firestoreTagService.createNew(tag);
        tag.id = documentReference.id;
        created.tags++;
      }
    }
    return created;
  }

  /**
   * Replace all tag id's with the full version
   * @param link the link to replace tags in
   * @param tags the list of tags available
   */
  private replaceTagIdsWithFullTag(link: Link, tags: TagDatabaseAfter[]): Link {
    return {
      ...link,
      tags: link.tags.map(id => tags.find(tag => tag.id === id)),
    }
  }
}
