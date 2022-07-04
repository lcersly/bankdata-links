import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {collection, Firestore, onSnapshot, Unsubscribe} from '@angular/fire/firestore';
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

  subscribeToLinks() {
    let collectionReference = collection(this.firestore, this.getURL()).withConverter(converter);
    this.unsub = onSnapshot(collectionReference,
      (documents) => {
        documents.docChanges().forEach(update => {
          const change = {
            id: update.doc.id,
            participant: update.doc.data(),
            change: update.type,
          };
          console.info("Participant", update, change);
        });
      });
  }


  createLink(link: Link) {

  }

  editLink(){

  }

  deleteLink(){

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
      // id: snapshot.id,
      // expirationAt: room.expirationAt?.toDate(),
      // updatedAt: room.updatedAt?.toDate(),
      // createdAt: room.createdAt?.toDate(),
    } as Link;
  },
}
