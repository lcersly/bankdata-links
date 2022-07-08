import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot} from '@angular/router';
import {EMPTY, first, mergeMap, Observable, of} from 'rxjs';
import {Link} from '../../shared/models/link.model';
import {LinkService} from '../../shared/services/link.service';

@Injectable({
  providedIn: 'root',
})
export class LinkResolverService implements Resolve<Link | null> {
  constructor(private linkService: LinkService, private router: Router) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Link | null> {
    const id = route.paramMap.get('id')!;
    // return of(null);

    return this.linkService.getLink(id).pipe(
      first(),
      mergeMap(link => {
        if (link) {
          return of(link);
        } else { // id not found
          console.warn('Link not found - redirecting to /link')
          this.router.navigate(['/link']);
          return EMPTY;
        }
      }),
    );
  }
}
