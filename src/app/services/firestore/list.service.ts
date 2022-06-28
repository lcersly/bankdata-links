import {Injectable} from '@angular/core';
import {doc, Firestore, onSnapshot, Unsubscribe} from '@angular/fire/firestore';
import {BehaviorSubject, map} from 'rxjs';
import {DocumentData, FirestoreDataConverter} from 'firebase/firestore';
import {ListModel, ListModelDatabase} from '../../models/list.model';
import {Link} from '../../models/link.model';

@Injectable({
  providedIn: 'root'
})
export class ListService {
  private unsub: Unsubscribe | undefined;
  private _data$ = new BehaviorSubject<Map<string,Link[]>>(new Map<string, Link[]>());
  public data$ = this._data$.pipe(
    map(links=>Array.from(links.values())),
    map(links=>links.reduce((prev, cur)=>prev.concat(...cur), [])),
  )

  constructor(private readonly firestore: Firestore) {
  }

  public getURL(listName: string):string{
    return `list/${listName}`;
  }

  subscribeToList(listName: string) {
    let docRef = doc(this.firestore, this.getURL(listName))
      .withConverter(converter);
    this.unsub = onSnapshot(docRef,
      (doc) => {
        const listMap = this._data$.getValue();
        listMap.set(listName, doc.data())
        this._data$.next(doc.data());
      }
    );
  }

  disconnect(){
    if(this.unsub){
      this.unsub();
    }
  }
}

const converter: FirestoreDataConverter<ListModel> = {
  toFirestore(modelObject: ListModel): DocumentData {
    return modelObject;
  },
  fromFirestore(snapshot): ListModel {
    const tag = snapshot.data() as ListModelDatabase;

    return {
      ...tag,
      // id: snapshot.id,
      // expirationAt: room.expirationAt?.toDate(),
      // updatedAt: room.updatedAt?.toDate(),
      // createdAt: room.createdAt?.toDate(),
    } as ListModel;
  }
}
