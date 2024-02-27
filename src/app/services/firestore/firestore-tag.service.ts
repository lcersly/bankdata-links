import {computed, inject, Injectable, signal} from '@angular/core';
import {addDoc, collection, doc, Firestore, onSnapshot, Unsubscribe, updateDoc} from '@angular/fire/firestore';
import {FirestoreDataConverter, QueryDocumentSnapshot} from 'firebase/firestore';
import {keyMatchesTag, Tag} from '../../models/tag.model';
import {reduceTagToSearchableString} from '../../shared/reducer';
import {AuthService} from '../auth.service';
import {toObservable} from '@angular/core/rxjs-interop';
import {from, map, skipWhile} from 'rxjs';

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

  #state = signal<{ tags: Tag[], status: 'init' | 'loading' | 'loaded' }>({
    tags: [],
    status: 'init',
  })

  public tags = computed(() => this.#state().tags);
  public status = computed(() => this.#state().status);

  constructor(private authService: AuthService) {
    this.authService.isSignedIn$.subscribe(signedIn => {
      if (signedIn) {
        this.subscribeToTags();
      } else {
        this.disconnect();
      }
    })
  }

  public hasMatchingTag(key: string): Tag | undefined {
    return this.tags().find(existingTag => keyMatchesTag(key, existingTag));
  }

  private get collectionRef() {
    return collection(this.firestore, `tags`)
      .withConverter(converter);
  }

  public getTag(uuid: string) {
    return toObservable(this.#state).pipe(
      skipWhile(state => state.status !== 'loaded'),
      map(state => state.tags.find(tag => tag.uuid === uuid)),
    );
  }

  public createNew(key: string, description: string) {
    const tag: Tag = {
      key,
      description,
      searchString: '',
      uuid: '',
    };

    return from(addDoc(this.collectionRef, tag))
  }

  public update(tag: Tag) {
    return from(updateDoc(doc(this.collectionRef, tag.uuid), {...tag}))
  }

  private subscribeToTags() {
    console.debug('Subscribing to tags');

    if (this.unsub) {
      throw new Error('Already subscribed to tags');
    }

    this.#state.update(state => ({...state, status: 'loading'}))

    this.unsub = onSnapshot(this.collectionRef,
      (doc) => {
        console.debug(`Received update for ${doc.size} tag(s)`);
        const tags = doc.docs.map(doc => converter.fromFirestore(doc));
        this.#state.update(state => ({...state, status: 'loaded', tags: tags}))
      },
    );
  }

  disconnect() {
    if (this.unsub) {
      this.unsub();
      this.unsub = undefined;
    }
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
