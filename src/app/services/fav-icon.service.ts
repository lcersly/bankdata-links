import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {EMPTY, switchMap} from 'rxjs';
import {environment} from '../../environments/environment';
import {Icon} from '../models/icon.model';
import {DomSanitizer} from '@angular/platform-browser';

@Injectable({
  providedIn: 'root',
})
export class FavIconService {
  constructor(private httpClient: HttpClient, private sanitize: DomSanitizer) {
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
          console.debug('Received these FavIcon options', apiResponse.icons)
          return this.httpClient.post<{ src: string, type: string, base64Image: string }[]>(
            environment.functions.favIcon,
            apiResponse.icons,
          )
        })).pipe(
        // tap(data => console.info('Data received from backend', data)),
      );

  }

  private favIconGrabberAPI = (domain: string) => `http://favicongrabber.com/api/grab/${domain}`;

  public hasIcon(icon?: Icon[]) {
    return icon && icon.length > 0;
  }

  public hasValidImage(icon?: Icon) {
    return !!icon?.base64Image
  }

  public getSafeIconURL(icon: Icon) {
    return this.sanitize.bypassSecurityTrustUrl('data:image/png;base64, ' +
      icon.base64Image);
  }

  public getBestIcon(icon: Icon[]) {
    if (icon.length > 0) {
      return this.getSafeIconURL(icon[0]);
    } else {
      return undefined;
    }
  }
}
