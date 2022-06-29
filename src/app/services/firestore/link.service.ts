import {Injectable} from '@angular/core';
import {BehaviorSubject, combineLatest, map} from 'rxjs';
import {collection, Firestore, onSnapshot, Unsubscribe} from '@angular/fire/firestore';
import {DocumentData, FirestoreDataConverter} from 'firebase/firestore';
import {Link, LinkDatabase} from '../../models/link.model';

@Injectable({
  providedIn: 'root',
})
export class LinkService {
  private unsub: Unsubscribe | undefined;
  private _data$ = new BehaviorSubject<Link[] | undefined>(undefined);
  public allLinks$ = this._data$.asObservable();
  private _filterValue$ = new BehaviorSubject<string | undefined>(undefined);
  public filteredLinks$ = combineLatest([this.allLinks$, this._filterValue$])
    .pipe(
      map(([links, filter]) => {
        if(!filter){
          return links;
        }
        links = links || [];
        return links.filter(link => link.name.includes(filter));
      }),
    );

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

  addLink(){

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

  setFilterValue(value: string | undefined) {
    this._filterValue$.next(value);
  }
}

const converter: FirestoreDataConverter<Link> = {
  toFirestore(modelObject: Link): DocumentData {
    return modelObject;
  },
  fromFirestore(snapshot): Link {
    const linkData = snapshot.data() as LinkDatabase;

    return {
      ...linkData,
      // id: snapshot.id,
      // expirationAt: room.expirationAt?.toDate(),
      // updatedAt: room.updatedAt?.toDate(),
      // createdAt: room.createdAt?.toDate(),
    } as Link;
  },
}
