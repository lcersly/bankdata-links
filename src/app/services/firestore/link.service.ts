import {Injectable} from '@angular/core';
import {Firestore} from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class LinkService {

  public static getResourceURL(): string {
    return 'link'
  }

  constructor(private readonly firestore: Firestore) {

  }

  private connect(): void {

  }

  public disconnect():void{

  }
}
