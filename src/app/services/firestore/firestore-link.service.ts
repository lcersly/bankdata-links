import {computed, inject, Injectable, signal} from '@angular/core';
import {addDoc, collection, doc, Firestore, onSnapshot, Unsubscribe, updateDoc} from '@angular/fire/firestore';
import {Link, LinkBase} from '../../models/link.model';
import {DocumentData, FirestoreDataConverter, QueryDocumentSnapshot} from 'firebase/firestore';
import {AuthService} from '../auth.service';
import {Change} from '../../models/history.model';
import {Auth} from '@angular/fire/auth';

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
  private auth = inject(Auth);

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
        if (documents.metadata.hasPendingWrites) {
          return;
        }

        const convertedDocs = documents.docs.map(doc => ({
          uuid: doc.id,
          link: doc.data(),
        } as LinkDatabaseAndId));
        console.debug(`Received update for ${documents.size} link(s)`, documents.docChanges());
        this.#state.update(state => ({...state, status: 'loaded', links: convertedDocs}));
      });
  }


  create(link: Link) {
    return addDoc(this.colRef, convertLinkToDatabase(this.addChange(link, 'Created')));
  }

  edit(link: Link) {
    const data = {
      ...convertLinkToDatabase(this.addChange(link, 'Updated')),
    };
    return updateDoc(this.docReference(link), data);
  }

  delete(link: Link) {
    const data = {
      ...convertLinkToDatabase(this.addChange(link, 'Deleted')),
      deleted: true,
    };
    return updateDoc(this.docReference(link), data);
  }

  private docReference(link: Link) {
    return doc(this.colRef, link.uuid);
  }

  private addChange(link: Link, details = ''): Link {
    return {
      ...link,
      history: [...link.history, {
        value: link,
        date: new Date(),
        details: details,
        name: this.auth.currentUser?.displayName ?? '',
        email: this.auth.currentUser?.email ?? '',
      }],
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
  const stringTags = link.tags.map(tag => tag.uuid);
  const {uuid, ...everythingElse} = link;
  return {...everythingElse, tags: stringTags};
}

const converter: FirestoreDataConverter<LinkDatabase> = {
  toFirestore(modelObject: LinkDatabase): DocumentData {
    return modelObject
  },
  fromFirestore(snapshot: QueryDocumentSnapshot<LinkDatabase>): LinkDatabase {
    return snapshot.data();
  },
};
