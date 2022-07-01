import {Injectable} from '@angular/core';
import {collection, Firestore, onSnapshot, Unsubscribe} from '@angular/fire/firestore';
import {BehaviorSubject, of} from 'rxjs';
import {DocumentData, FirestoreDataConverter} from 'firebase/firestore';
import {TagModel, TagModelDatabase} from '../../models/tag.model';

@Injectable({
  providedIn: 'root',
})
export class TagService {
  private unsub: Unsubscribe | undefined;
  private _data$ = new BehaviorSubject<TagModel[]>([]);
  public tags$ = this._data$.asObservable();
  public tags:TagModel[] = [];

  constructor(private readonly firestore: Firestore) {
    this.subscribeToTags();
    this.tags$.subscribe(t => this.tags = t);
  }

  public getURL(): string {
    return `tags`;
  }

  subscribeToTags() {
    let collectionRef = collection(this.firestore, this.getURL())
      .withConverter(converter);
    this.unsub = onSnapshot(collectionRef,
      (doc) => {
        console.info(doc);
        // this._data$.next(doc.docs);
      },
    );
  }

  disconnect() {
    if (this.unsub) {
      this.unsub();
    }
  }
}

const converter: FirestoreDataConverter<TagModel[]> = {
  toFirestore(modelObject: TagModel[]): DocumentData {
    return modelObject;
  },
  fromFirestore(snapshot): TagModel[] {
    const tags = snapshot.data() as TagModelDatabase[] || [];

    return tags.map(t => ({...t}) as TagModel);
  },
}
