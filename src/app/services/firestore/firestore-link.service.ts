import {inject, Injectable, signal} from '@angular/core';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  Firestore,
  onSnapshot,
  serverTimestamp,
  Unsubscribe,
  updateDoc,
} from '@angular/fire/firestore';
import {Link, LinkBase} from '../../models/link.model';
import {DocumentData, FirestoreDataConverter, QueryDocumentSnapshot} from 'firebase/firestore';
import {AuthService} from '../auth.service';

export interface LinkDatabase extends LinkBase {
  tags: string[]
}

export type LinkDatabaseAndId = { uuid: string, link: LinkDatabase };

@Injectable({
  providedIn: 'root',
})
export class FirestoreLinkService {
  private firestore: Firestore = inject(Firestore);
  private unsub: Unsubscribe | undefined;
  public links = signal<LinkDatabaseAndId[]>([]);

  constructor(private authService: AuthService) {
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
    this.unsub = onSnapshot(this.colRef,
      (documents) => {
        const convertedDocs = documents.docs.map(doc => {
          const link = doc.data();
          return {
            uuid: doc.id,
            link,
          } as LinkDatabaseAndId;
        });
        console.debug('Received document update', documents);
        this.links.set(convertedDocs);
      });
  }


  create(link: Link) {
    return addDoc(this.colRef, {
      ...convertLinkToDatabase(link),
      updatedAt: serverTimestamp(),
      createdAt: serverTimestamp()
    });
  }

  edit(link: Link) {
    const data = {
      ...convertLinkToDatabase(link),
      updatedAt: serverTimestamp(),
      createdAt: link.createdAt ? link.createdAt : serverTimestamp()
    };

    return updateDoc(this.docReference(link), data);
  }

  delete(link: Link) {
    return deleteDoc(this.docReference(link));
  }

  private docReference(link: Link) {
    return doc(this.colRef, link.uuid);
  }

  disconnect() {
    if (this.unsub) {
      this.unsub();
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
