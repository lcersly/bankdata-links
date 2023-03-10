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
import {DocumentData, FirestoreDataConverter} from 'firebase/firestore';
import {Link} from '../../models/link.model';

@Injectable({
  providedIn: 'root',
})
export class FirestoreLinkService {
  private unsub: Unsubscribe | undefined;
  private _data$ = new ReplaySubject<Link[]>(1);
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
        const docs: Link[] = [];
        documents.docs.forEach(doc => docs.push(doc.data()));
        this._data$.next(docs);
      });
  }


  create(link: Link) {
    return addDoc(this.colRef, {...link});
  }

  edit(link: Link) {
    for (const key of Object.keys(link)) {
      // @ts-ignore
      let value = link[key];
      if (!value) {
        // @ts-ignore
        link[key] = '';
      }
    }

    const tags = [];
    for (const tag of link.tags) {
      if (tag && tag.id) {
        tags.push(tag.id);
      }
    }
    link.tags = tags;

    const id = link.id;
    delete link.id;
    console.debug('Update link', link);
    return updateDoc(doc(this.colRef, id), link);
  }

  delete(link: Link) {
    return deleteDoc(doc(this.colRef, link.id));
  }

  disconnect() {
    if (this.unsub) {
      this.unsub();
    }
  }
}

const converter: FirestoreDataConverter<Link> = {
  toFirestore(modelObject: Link): DocumentData {
    return modelObject;
  },
  fromFirestore(snapshot): Link {
    const linkData = snapshot.data() as Link;

    return {
      ...linkData,
      id: snapshot.id,
      // expirationAt: room.expirationAt?.toDate(),
      // updatedAt: room.updatedAt?.toDate(),
      // createdAt: room.createdAt?.toDate(),
    } as Link;
  },
}
