import {Injectable} from '@angular/core';
import {doc, Firestore, onSnapshot, Unsubscribe} from '@angular/fire/firestore';
import {BehaviorSubject, first, map} from 'rxjs';
import {DocumentData, FirestoreDataConverter} from 'firebase/firestore';
import {ListModel, ListModelDatabase} from '../../models/list.model';
import {Link} from '../../models/link.model';

@Injectable({
  providedIn: 'root',
})
export class ListService {
  public links$ = this.lists$.pipe(
    map(lists => lists.reduce(
      (prev, cur) => prev.concat(...cur.links),
      [] as Link[]),
    ),
  );
  private map$ = new BehaviorSubject<Map<string, { list: ListModel, unsub: Unsubscribe | null }>>(
    new Map<string, { list: ListModel, unsub: Unsubscribe }>(),
  );
  public listNames$ = this.map$.pipe(
    map(map => Array.from(map.keys())),
  );
  public lists$ = this.map$.pipe(
    map(map => Array.from(map.values())),
    map(listAndUnsubs => listAndUnsubs.map(listAndUnsub => listAndUnsub.list)),
  );

  constructor(private readonly firestore: Firestore) {
  }

  public getURL(listName: string): string {
    return `list/${listName}`;
  }

  subscribeToList(listName: string) {
    let docRef = doc(this.firestore, this.getURL(listName))
      .withConverter(converter);
    const unsub = onSnapshot(docRef,
      (doc) => {
        const listMap = this.map$.getValue();
        const data = doc.data();
        if (data) {
          listMap.set(listName, {list: data, unsub: null});
        } else {
          listMap.delete(listName);
        }
        this.map$.next(listMap);
      },
    );
    const list = this.map$.getValue().get(listName);
    if (list) {
      list.unsub = unsub;
    }
  }

  unsubscribeFromList(listName: string, update = true) {
    let map = this.map$.getValue();
    const list = map.get(listName);
    if (list) {
      if (list.unsub) {
        list.unsub();
      }
      map.delete(listName);

      if (update) {
        this.map$.next(map);
      }
    }
  }

  disconnect() {
    this.listNames$.pipe(
      first(),
    ).subscribe(listNames => {
      listNames.forEach(list => this.unsubscribeFromList(list, false));
      this.map$.next(this.map$.getValue());
    });
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
  },
}
