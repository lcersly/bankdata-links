import {inject} from '@angular/core';
import {ActivatedRouteSnapshot, ResolveFn, Router} from '@angular/router';
import {EMPTY, first, mergeMap, Observable, of} from 'rxjs';
import {FirestoreTagService} from '../services/firestore/firestore-tag.service';
import {Tag} from '../models/tag.model';

export const TagResolveFn: ResolveFn<Tag> = (route: ActivatedRouteSnapshot): Observable<Tag> => {
  const id = route.paramMap.get('id')!;
  const firestoreTagService = inject(FirestoreTagService);
  const router = inject(Router);

  return firestoreTagService.getTag(id).pipe(
    first(),
    mergeMap(tag => {
      if (tag) {
        return of(tag);
      } else { // id not found
        console.warn('Tag not found - redirecting')
        router.navigate(['/tag']);
        return EMPTY;
      }
    }),
  );
}
