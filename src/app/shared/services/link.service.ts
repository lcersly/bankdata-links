import {Injectable} from '@angular/core';
import {combineLatest, map, startWith} from 'rxjs';
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
      startWith([[], []]),
      map(([links, tags])=>{
        return links.map(link => LinkService.replaceTagIdsWithFullTag(link, tags))
      })
    )

  constructor(private fireLinkService: FirestoreLinkService, private firestoreTagService: FirestoreTagService) {
  }

  public async createLinkAndTags(link: Link){
    const created = {
      tags: 0,
    };
    for (const tag of link.tags) {
      if (!tag.exists) {
        console.info('Creating new tag', tag);
        let documentReference = await this.firestoreTagService.createNew(tag);
        tag.id = documentReference.id;
        created.tags++;
      }
    }

    await this.fireLinkService.create(link);

    return created;
  }

  /**
   * Replace all tag id's with the full version
   * @param link the link to replace tags in
   * @param tags the list of tags available
   */
  private static replaceTagIdsWithFullTag(link: Link, tags: TagDatabaseAfter[]):Link{
    return {
      ...link,
      tags: link.tags.map(id => tags.find(tag => tag.id === id))
    }
  }
}
