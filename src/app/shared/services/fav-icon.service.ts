import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {EMPTY, switchMap, tap} from 'rxjs';
import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class FavIconService {
  constructor(private httpClient: HttpClient) {
  }

  public fetchFavIcon(urlString: string) {
    const url = new URL(urlString);

    return this.httpClient.get<{ domain: string, icons: { src: string, type: string }[] }>(
      this.favIconGrabberAPI(url.host), {
        headers: {'Content-Type': 'application/json'},
      })
      .pipe(
        switchMap(apiResponse => {
          if (!apiResponse.icons.length) {
            console.warn('No icons found', apiResponse);
            return EMPTY;
          }
          return this.httpClient.get<{ rawImage: string, base64Image: string }>(
            environment.functions.favIcon, {
              params: {
                url: apiResponse.icons[0].src,
              },
            })
        })).pipe(
        tap(data => console.info('Data received from backend', data)),
      );

  }

  private favIconGrabberAPI = (domain: string) => `http://favicongrabber.com/api/grab/${domain}`;
}
