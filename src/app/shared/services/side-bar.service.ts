import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SideBarService {
  private _toggle = new BehaviorSubject<void>(undefined);
  public toggle$ = this._toggle.asObservable();

  constructor() { }

  public toggle(){
    this._toggle.next();
  }
}
