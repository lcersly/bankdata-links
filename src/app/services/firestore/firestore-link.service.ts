import {Injectable} from '@angular/core';
import {ReplaySubject} from 'rxjs';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  Firestore,
  onSnapshot,
  Unsubscribe,
  updateDoc,
} from '@angular/fire/firestore';
import {Link, LinkBase} from '../../models/link.model';
import {DocumentData, FirestoreDataConverter, QueryDocumentSnapshot} from 'firebase/firestore';

export interface LinkDatabase extends LinkBase {
  tags: string[]
}

export type LinkDatabaseAndId = { uuid: string, link: LinkDatabase };

@Injectable({
  providedIn: 'root',
})
export class FirestoreLinkService {
  private unsub: Unsubscribe | undefined;
  private _data$ = new ReplaySubject<LinkDatabaseAndId[]>(1);
  public allLinks$ = this._data$.asObservable();

  constructor(private readonly firestore: Firestore) {
    this.subscribeToLinks();
  }

  get colRef() {
    return collection(this.firestore, `links`).withConverter(converter);
  }

  subscribeToLinks() {
    this.unsub = onSnapshot(this.colRef,
      (documents) => {
        const docs: LinkDatabaseAndId[] = [];
        documents.docs.forEach(doc => docs.push(({
          uuid: doc.id,
          link: doc.data()
        })));
        this._data$.next(docs);
      });
  }


  create(link: Link) {
    return addDoc(this.colRef, convertLinkToDatabase(link));
  }

  edit(link: Link) {
    return updateDoc(doc(this.colRef, link.uuid), convertLinkToDatabase(link));
  }

  delete(link: Link) {
    return deleteDoc(doc(this.colRef, link.uuid));
  }

  disconnect() {
    if (this.unsub) {
      this.unsub();
    }
  }
}

function convertLinkToDatabase(link: Link): LinkDatabase {
  const stringTags = link.tags.map(tag => tag.key);
  const {uuid, ...everythingElse} = link;
  return {...everythingElse, tags: stringTags};
}

const converter: FirestoreDataConverter<LinkDatabase> = {
  toFirestore(modelObject: LinkDatabase): DocumentData {
    return modelObject
  },
  fromFirestore(snapshot:QueryDocumentSnapshot<LinkDatabase>): LinkDatabase {
    return snapshot.data();
  },
};

