import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
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
  private _data$ = new BehaviorSubject<Link[]>([]);
  public allLinks$ = this._data$.asObservable();

  constructor(private readonly firestore: Firestore) {
    this.subscribeToLinks();
  }

  public getURL(): string {
    return `links`;
  }

  get colRef() {
    return collection(this.firestore, this.getURL()).withConverter(converter);
  }

  subscribeToLinks() {
    this.unsub = onSnapshot(this.colRef,
      (documents) => {
        documents.docChanges().forEach(update => {
          const change = {
            id: update.doc.id,
            participant: update.doc.data(),
            change: update.type,
          };
          console.info('Participant', update, change);
        });
      });
  }


  createLink(link: Link) {
    return addDoc(this.colRef, {...link});
  }

  editLink(link: Link) {
    let data = {...link};
    delete data.id;
    return updateDoc(doc(this.colRef, link.id), data);
  }

  deleteLink(link: Link) {
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
