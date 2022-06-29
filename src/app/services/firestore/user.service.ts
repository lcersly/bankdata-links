import {Injectable} from '@angular/core';
import {doc, Firestore, onSnapshot, Unsubscribe} from '@angular/fire/firestore';
import {DocumentData, FirestoreDataConverter} from 'firebase/firestore';
import {UserModel, UserModelDatabase} from '../../models/user.model';
import {BehaviorSubject} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private unsub: Unsubscribe | undefined;
  private _data$ = new BehaviorSubject<UserModel | undefined>(undefined);
  public data$ = this._data$.asObservable();

  constructor(private readonly firestore: Firestore) {
  }

  public getURL(userId: string): string {
    return `users/${userId}`;
  }

  updateUserDetails(userId: string) {
    if (!userId) {
      throw new Error('No User ID');
    }

    let userDocumentRef = doc(this.firestore, this.getURL(userId))
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


const userConverter: FirestoreDataConverter<UserModel> = {
  toFirestore(modelObject: UserModel): DocumentData {
    return modelObject;
  },
  fromFirestore(snapshot): UserModel {
    const user = snapshot.data() as UserModelDatabase;

    return {
      ...user,
      // id: snapshot.id,
      // expirationAt: room.expirationAt?.toDate(),
      // updatedAt: room.updatedAt?.toDate(),
      // createdAt: room.createdAt?.toDate(),
    } as UserModel;
  },
}
