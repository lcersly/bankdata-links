import { Injectable } from '@angular/core';
import {Link} from '../models/link.model';

@Injectable({
  providedIn: 'root'
})
export class OpenLinkService {

  constructor() { }

  public openLink(link: Link):void{
    window.open(link.url, "_blank")
  }
}
