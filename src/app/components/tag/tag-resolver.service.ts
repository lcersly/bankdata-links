import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot} from '@angular/router';
import {EMPTY, first, mergeMap, Observable, of} from 'rxjs';
import {FirestoreTagService} from '../../shared/services/firestore/firestore-tag.service';
import {TagDatabaseAfter} from '../../shared/models/tag.model';

@Injectable({
  providedIn: 'root',
})
export class TagResolverService implements Resolve<TagDatabaseAfter | null> {
  constructor(private tagService: FirestoreTagService, private router: Router) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<TagDatabaseAfter | null> {
    const id = route.paramMap.get('id')!;
    // return of(null);

    return this.tagService.getTag(id).pipe(
      first(),
      mergeMap(tag => {
        if (tag) {
          return of(tag);
        } else { // id not found
          console.warn('Tag not found - redirecting to /tag')
          this.router.navigate(['/tag']);
          return EMPTY;
        }
      }),
    );
  }
}
