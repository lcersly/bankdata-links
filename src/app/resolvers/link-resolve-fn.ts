import {inject} from '@angular/core';
import {ActivatedRouteSnapshot, ResolveFn, Router} from '@angular/router';
import {EMPTY, first, mergeMap, Observable, of} from 'rxjs';
import {Link} from '../models/link.model';
import {LinkService} from '../services/link.service';
import {PATHS_URLS} from '../urls';

export const LinkResolveFn: ResolveFn<Link> = (route: ActivatedRouteSnapshot): Observable<Link> => {
  const id = route.paramMap.get('id')!;

  return inject(LinkService).getLink(id).pipe(
    first(),
    mergeMap(link => {
      if (link) {
        return of(link);
      } else { // id not found
        console.warn('Tag not found - redirecting to /tag')
        inject(Router).navigateByUrl('/' + PATHS_URLS.links);
        return EMPTY;
      }
    }),
  );
}
