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
import {first, map, Observable, ReplaySubject} from 'rxjs';
import {FirestoreDataConverter, QueryDocumentSnapshot} from 'firebase/firestore';
import {keyMatchesTag, Tag} from '../../models/tag.model';

interface DatabaseTag {
  key: string;
  description: string;
}

@Injectable({
  providedIn: 'root',
})
export class FirestoreTagService {
  private unsub: Unsubscribe | undefined;
  private _data$ = new ReplaySubject<Tag[]>(1);
  public tags$ = this._data$.asObservable();

  constructor(private readonly firestore: Firestore) {
    this.subscribeToTags();
    this.tags$.subscribe(t => console.debug(`Service - Tags updated (${t.length})`, t));
  }

  public hasMatchingTag(key: string): Observable<Tag | undefined> {
    return this.tags$.pipe(
      first(),
      map(tags => tags.find(existingTag => keyMatchesTag(key, existingTag))),
    );
  }

  private get collectionRef() {
    return collection(this.firestore, `tags`)
      .withConverter(converter);
  }

  public getTag(uuid: string) {
    return this.tags$.pipe(map(tags => tags.find(tag => tag.uuid === uuid)));
  }

  public createNew(key: string, description: string) {
    return addDoc(this.collectionRef, {key, description} as any) //todo why is this needed??
  }

  public update(id: string, key: string, description: string) {
    return updateDoc(doc(this.collectionRef, id), {description, key})
  }

  private subscribeToTags() {
    this.unsub = onSnapshot(this.collectionRef,
      (doc) => {
        if (doc.empty) {
          this._data$.next([]);
        } else {
          const tags = doc.docs.map(doc => converter.fromFirestore(doc));
          this._data$.next(tags);
        }
      },
    );
  }

  disconnect() {
    if (this.unsub) {
      this.unsub();
    }
  }

  deleteTagFromId(tagId: string) {
    //todo check if any links still use it before delete
    return deleteDoc(doc(this.collectionRef, tagId))
  }
}

const converter: FirestoreDataConverter<Tag> = {
  toFirestore(tag: Tag): DatabaseTag {
    return {
      key: tag.key,
      description: tag.description,
    };
  },
  fromFirestore(snapshot:QueryDocumentSnapshot<DatabaseTag>): Tag {
    let documentData = snapshot.data();
    return {
      key: documentData.key,
      description: documentData.description,
      uuid: snapshot.id,
    }
  },
}
