import {computed, inject, Injectable, signal} from '@angular/core';
import {addDoc, collection, doc, Firestore, onSnapshot, Unsubscribe, updateDoc} from '@angular/fire/firestore';
import {Link, LinkBase, LinkHistoryType} from '../../models/link.model';
import {DocumentData, FirestoreDataConverter, QueryDocumentSnapshot} from 'firebase/firestore';
import {AuthService} from '../auth.service';
import {Change, ChangeDetails} from '../../models/history.model';

export interface LinkDatabase extends LinkBase {
  tags: string[];
  history?: Change<LinkBase>[];
}

export type LinkDatabaseAndId = { uuid: string, link: LinkDatabase };

@Injectable({
  providedIn: 'root',
})
export class FirestoreLinkService {
  private firestore = inject(Firestore);
  private authService = inject(AuthService);

  private unsub: Unsubscribe | undefined;

  #state = signal<{ links: LinkDatabaseAndId[], status: 'init' | 'loading' | 'loaded' }>({
    links: [],
    status: 'init',
  })
  public links = computed(() => this.#state().links);
  public state = this.#state.asReadonly();

  constructor() {
    this.authService.isSignedIn$.subscribe(signedIn => {
      if (signedIn) {
        this.subscribeToLinks();
      } else {
        this.disconnect();
      }
    })
  }

  get colRef() {
    return collection(this.firestore, `links`).withConverter(converter);
  }

  subscribeToLinks() {
    console.debug('Subscribing to links');

    if (this.unsub) {
      throw new Error('Already subscribed to links');
    }

    this.#state.update(state => ({...state, status: 'loading'}));

    this.unsub = onSnapshot(this.colRef,
      (documents) => {
        const convertedDocs = documents.docs.map(doc => ({
          uuid: doc.id,
          link: doc.data(),
        } as LinkDatabaseAndId));
        console.debug(`Received update for ${documents.size} link(s)`, convertedDocs);
        this.#state.update(state => ({...state, status: 'loaded', links: convertedDocs}));
      });
  }


  create(link: Link) {
    return addDoc(this.colRef, convertLinkToDatabase(this.addChange('Created', link)));
  }

  edit(link: Link) {
    const data = {
      ...convertLinkToDatabase(this.addChange('Updated', link)),
    };
    return updateDoc(this.docReference(link), data);
  }

  delete(link: Link) {
    const deletedLink = {...link, deleted: true};

    const data = {
      ...convertLinkToDatabase(this.addChange('Deleted', deletedLink)),
    };
    return updateDoc(this.docReference(link), data);
  }

  private docReference(link: Link) {
    return doc(this.colRef, link.uuid);
  }

  private addChange(details: ChangeDetails, link: Link): Link {
    let diff = {};
    const orgLink = this.state().links.find(l => l.uuid === link.uuid)?.link;
    if (orgLink) {
      const orgSimpleLink: LinkBase = {
        url: orgLink.url,
        name: orgLink.name,
        deleted: orgLink.deleted,
        description: orgLink.description,
      }

      const updatedDbLink: LinkBase = {
        url: link.url,
        name: link.name,
        deleted: link.deleted,
        description: link.description,
      };

      diff = diffBetweenLinkBases(orgSimpleLink, updatedDbLink)
    }

    const user = this.authService.user();

    const change: LinkHistoryType = {
      changeDetails: diff,
      date: new Date(),
      details: details,
      name: user?.displayName ?? '',
      email: user?.email ?? '',
    };
    return {
      ...link,
      history: [change, ...link.history].slice(0, 10),
    }
  }

  disconnect() {
    if (this.unsub) {
      this.unsub();
      this.unsub = undefined;
    }
  }
}

function convertLinkToDatabase(link: Link): LinkDatabase {
  const {uuid, searchString, tags, ...everythingElse} = link;
  const tagUuids = tags.map(tag => tag.uuid);
  return {...everythingElse, tags: tagUuids};
}

const converter: FirestoreDataConverter<LinkDatabase> = {
  toFirestore(modelObject: LinkDatabase): DocumentData {
    return {
      ...modelObject,
      deleted: modelObject.deleted ?? false
    }
  },
  fromFirestore(snapshot: QueryDocumentSnapshot<LinkDatabase>): LinkDatabase {
    let history = [];

    const snapshotHistory = snapshot.get('history');
    if (snapshotHistory) {
      history = snapshotHistory.map((data: Change<LinkDatabase, { seconds: number, nanoseconds: number }>) => {
          return {
            ...data,
            date: new Date(data.date.seconds * 1000),
          }
        });
    }

    return {
      ...snapshot.data(),
      history: history,
      deleted: snapshot.get('deleted') ?? false
    };
  },
};

function diffBetweenLinkBases(from: LinkBase, to: LinkBase)  {
  let difference: { [key: string]: [unknown, unknown] } = {};

  const allKeys = new Set([...Object.keys(from), ...Object.keys(to)]);
  const sortedKeys = [...allKeys.keys()].sort()

  for (const key of sortedKeys) {
    let orgValue = from[key as keyof LinkBase];
    let newValue = to[key as keyof LinkBase];

    if(orgValue === undefined){
      orgValue = "";
    }
    if(newValue === undefined){
      newValue = "";
    }

    // mark as difference if either values are not the same or
    // key is not present in either objects
    if (JSON.stringify(orgValue) !== JSON.stringify(newValue)) {
      difference[key] = [orgValue, newValue];
    }
  }

  return difference;
}
