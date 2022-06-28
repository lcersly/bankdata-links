import {Injectable} from '@angular/core';
import {doc, Firestore, onSnapshot, Unsubscribe} from '@angular/fire/firestore';
import {BehaviorSubject} from 'rxjs';
import {DocumentData, FirestoreDataConverter} from 'firebase/firestore';
import {TagModel, TagModelDatabase} from '../../models/tag.model';

@Injectable({
  providedIn: 'root',
})
export class TagsService {
  private unsub: Unsubscribe | undefined;
  private _data$ = new BehaviorSubject<TagModel | undefined>(undefined);
  public data$ = this._data$.asObservable();

  constructor(private readonly firestore: Firestore) {
  }

  public getURL(): string {
    return `tags`;
  }

  updateTags() {
    let userDocumentRef = doc(this.firestore, this.getURL())
      .withConverter(userConverter);
    this.unsub = onSnapshot(userDocumentRef,
      (doc) => this._data$.next(doc.data()),
    );
  }

  disconnect() {
    if (this.unsub) {
      this.unsub();
    }
  }
}

const userConverter: FirestoreDataConverter<TagModel> = {
  toFirestore(modelObject: TagModel): DocumentData {
    return modelObject;
  },
  fromFirestore(snapshot): TagModel {
    const tag = snapshot.data() as TagModelDatabase;

    return {
      ...tag,
      // id: snapshot.id,
      // expirationAt: room.expirationAt?.toDate(),
      // updatedAt: room.updatedAt?.toDate(),
      // createdAt: room.createdAt?.toDate(),
    } as TagModel;
  },
}
