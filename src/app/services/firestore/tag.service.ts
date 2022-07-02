import {Injectable} from '@angular/core';
import {addDoc, collection, doc, Firestore, onSnapshot, Unsubscribe, updateDoc} from '@angular/fire/firestore';
import {BehaviorSubject} from 'rxjs';
import {DocumentData, FirestoreDataConverter} from 'firebase/firestore';
import {TagModel, TagModelDatabase} from '../../models/tag.model';

@Injectable({
  providedIn: 'root',
})
export class TagService {
  private unsub: Unsubscribe | undefined;
  private _data$ = new BehaviorSubject<TagModel[]>([]);
  public tags$ = this._data$.asObservable();
  public tags: TagModel[] = [];

  constructor(private readonly firestore: Firestore) {
    this.subscribeToTags();
    this.tags$.subscribe(t => this.tags = t);
    this.tags$.subscribe(t => console.debug(`Service - Tags updated (${t.length})`, t));
  }

  public getURL(): string {
    return `tags`;
  }

  private get collectionRef() {
    return collection(this.firestore, this.getURL())
      .withConverter(converter);
  }

  public createNew(tag: TagModel) {
    return addDoc(this.collectionRef, tag)
  }

  public updateDescription(tag: TagModel) {
    return updateDoc(doc(this.collectionRef, tag.key), {description: tag.description})
  }

  // public rename(oldString: string, newString: string) {
  //   //todo find all links with old string and rename them
  //
  // }

  private subscribeToTags() {
    this.unsub = onSnapshot(this.collectionRef,
      (doc) => {
        if (doc.empty) {
          this._data$.next([]);
        } else {
          this._data$.next(doc.docs.map(d => ({...d.data(), key: d.id})));
        }
      },
    );
  }

  disconnect() {
    if (this.unsub) {
      this.unsub();
    }
  }
}

const converter: FirestoreDataConverter<TagModel> = {
  toFirestore(modelObject: TagModel): DocumentData {
    return modelObject;
  },
  fromFirestore(snapshot): TagModel {
    let documentData = snapshot.data() as TagModelDatabase;
    return {...documentData, exists: true} as TagModel
  },
}
