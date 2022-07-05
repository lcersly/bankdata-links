import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {EMPTY, map, switchMap, take} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FavIconService {
  constructor(private httpClient: HttpClient) {
  }

  public async fetchFavIcon(urlString: string) {
    const url = new URL(urlString);

    this.httpClient.get<{ domain: string, icons: { src: string, type: string }[] }>(
      this.url(url.host), {
        headers: {'Content-Type': 'application/json'},
      })
      .pipe(switchMap(apiResponse => {
        if (!apiResponse.icons.length) {
          return EMPTY;
        }
        let favIconURL = this.favIcon(apiResponse.icons[0].src);
        return this.httpClient.get(favIconURL, {
          observe: 'body',
          responseType: 'arraybuffer',
        })
          .pipe(
            take(1),
            map((arrayBuffer) =>
              btoa(
                Array.from(new Uint8Array(arrayBuffer))
                  .map((b) => String.fromCharCode(b))
                  .join(''),
              ),
            ),
          )
      })).subscribe(data => console.info(data));

  }

  private url = (domain: string) => `http://favicongrabber.com/api/grab/${domain}`;

  private favIcon = (favIcon: string) => `https://favicongrabber.com/download/${favIcon}`;
}
