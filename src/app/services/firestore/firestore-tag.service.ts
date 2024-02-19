import {inject, Injectable, signal} from '@angular/core';
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
import {FirestoreDataConverter, QueryDocumentSnapshot} from 'firebase/firestore';
import {keyMatchesTag, Tag} from '../../models/tag.model';
import {reduceTagToSearchableString} from '../../shared/reducer';
import {AuthService} from '../auth.service';
import {toObservable} from '@angular/core/rxjs-interop';
import {map} from 'rxjs';

interface DatabaseTag {
  key: string;
  description: string;
}

@Injectable({
  providedIn: 'root',
})
export class FirestoreTagService {
  private firestore: Firestore = inject(Firestore);
  private unsub: Unsubscribe | undefined;

  public tags = signal<Tag[]>([])

  constructor(private authService: AuthService) {
    this.authService.isSignedIn$.subscribe(signedIn => {
      if (signedIn) {
        this.subscribeToTags();
      } else {
        this.disconnect();
      }
    })
    // this.tags$.subscribe(t => console.debug(`Service - Tags updated (${t.length})`, t));
  }

  public hasMatchingTag(key: string): Tag | undefined {
    return this.tags().find(existingTag => keyMatchesTag(key, existingTag));
  }

  private get collectionRef() {
    return collection(this.firestore, `tags`)
      .withConverter(converter);
  }

  public getTag(uuid: string) {
    return toObservable(this.tags).pipe(map(tags => tags.find(tag => tag.uuid === uuid)));
  }

  public createNew(key: string, description: string) {
    return addDoc(this.collectionRef, {key, description} as any) //todo why is this needed??
  }

  public update(id: string, key: string, description: string) {
    return updateDoc(doc(this.collectionRef, id), {description, key})
  }

  private subscribeToTags() {
    console.debug("Subscribing to tags");
    this.unsub = onSnapshot(this.collectionRef,
      (doc) => {
        if (doc.empty) {
          this.tags.set([])
        } else {
          const tags = doc.docs.map(doc => converter.fromFirestore(doc));
          this.tags.set(tags);
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
  fromFirestore(snapshot: QueryDocumentSnapshot<DatabaseTag>): Tag {
    let documentData = snapshot.data();
    return {
      key: documentData.key,
      description: documentData.description,
      uuid: snapshot.id,
      searchString: reduceTagToSearchableString(documentData.key, documentData.description),
    }
  },
}
