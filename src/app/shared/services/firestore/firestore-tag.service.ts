import {Injectable} from '@angular/core';
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
import {BehaviorSubject, map} from 'rxjs';
import {DocumentData, FirestoreDataConverter} from 'firebase/firestore';
import {TagBasic, TagDatabase, TagDatabaseAfter, TagWithID} from '../../models/tag.model';

@Injectable({
  providedIn: 'root',
})
export class FirestoreTagService {
  private unsub: Unsubscribe | undefined;
  private _data$ = new BehaviorSubject<TagDatabaseAfter[]>([]);
  public tags$ = this._data$.asObservable();
  public tags: TagDatabaseAfter[] = [];

  constructor(private readonly firestore: Firestore) {
    this.subscribeToTags();
    this.tags$.subscribe(t => this.tags = t);
    this.tags$.subscribe(t => console.debug(`Service - Tags updated (${t.length})`, t));
  }

  public getURL(): string {
    return `tags`;
  }

  public getTag(id: string) {
    return this.tags$.pipe(map(tags => tags.find(tag => tag.id === id)));
  }

  private get collectionRef() {
    return collection(this.firestore, this.getURL())
      .withConverter(converter);
  }

  public createNew(tag: TagBasic) {
    return addDoc(this.collectionRef, {key: tag.key, description: tag.description})
  }

  public update(tag: TagWithID & TagBasic) {
    return updateDoc(doc(this.collectionRef, tag.id), {description: tag.description, key: tag.key})
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
          this._data$.next(doc.docs.map(d => d.data() as TagDatabaseAfter));
        }
      },
    );
  }

  disconnect() {
    if (this.unsub) {
      this.unsub();
    }
  }

  deleteTag(tag: TagWithID) {
    console.debug('Deleting tag', tag);
    return deleteDoc(doc(this.collectionRef, tag.id))
  }
}

const converter: FirestoreDataConverter<TagBasic> = {
  toFirestore(modelObject: TagBasic): DocumentData {
    return {
      key: modelObject.key,
      description: modelObject.description,
    } as TagBasic;
  },
  fromFirestore(snapshot): TagDatabaseAfter {
    let documentData = snapshot.data() as TagDatabase;
    return {
      key: documentData.key,
      description: documentData.description,
      id: snapshot.id,
      exists: true,
    }
  },
}