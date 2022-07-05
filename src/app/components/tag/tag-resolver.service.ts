import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot} from '@angular/router';
import {EMPTY, mergeMap, Observable, of} from 'rxjs';
import {FirestoreTagService} from '../../shared/services/firestore/firestore-tag.service';
import {TagDatabaseAfter} from '../../shared/models/tag.model';

@Injectable({
  providedIn: 'root'
})
export class TagResolverService implements Resolve<TagDatabaseAfter> {
  constructor(private tagService: FirestoreTagService, private router: Router) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<TagDatabaseAfter> {
    const id = route.paramMap.get('id')!;

    return this.tagService.getTag(id).pipe(
      mergeMap(tag => {
        if (tag) {
          return of(tag);
        } else { // id not found
          console.info("Tag not found")
          this.router.navigate(['/tag']);
          return EMPTY;
        }
      })
    );
  }
}
