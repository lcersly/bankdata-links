import {Injectable} from '@angular/core';
import {BehaviorSubject, map, tap} from "rxjs";
import {Link} from "../models/link.model";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class LinkService {
  private linkMatcher = /<A HREF="([a-zA-Z:\/0-9.#?=]*).*ICON="(.*)">(.*)<\/A>/g

  public links$ = new BehaviorSubject<Link[]>([])

  constructor(private httpClient: HttpClient) {
    httpClient.get("/assets/bookmarks_02_06_2022.html", {responseType: "text"})
      .pipe(
        map(htmlString => htmlString.matchAll(this.linkMatcher)),
        map(rawMatches => [...rawMatches]),
        map(matches => matches.map(match =>
          ({
            url: match[1],
            icon: match[2],
            name: match[3],
          } as Link)))
      )
      .subscribe(data => this.links$.next(data));
  }
}
