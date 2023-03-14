import {Injectable} from '@angular/core';
import {Firestore} from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class LinkValuesService {

  constructor(private readonly firestore: Firestore) {

  }

  public static getResourceURL(): string {
    return 'linkValues';
  }

  public disconnect(): void {

  }

  private connect(): void {

  }
}
