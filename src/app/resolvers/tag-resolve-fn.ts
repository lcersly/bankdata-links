import {inject} from '@angular/core';
import {ActivatedRouteSnapshot, ResolveFn, Router} from '@angular/router';
import {EMPTY, first, mergeMap, Observable, of} from 'rxjs';
import {FirestoreTagService} from '../services/firestore/firestore-tag.service';
import {Tag} from '../models/tag.model';

export const TagResolveFn: ResolveFn<Tag> = (route: ActivatedRouteSnapshot): Observable<Tag> => {
  const id = route.paramMap.get('id')!;

  return inject(FirestoreTagService).getTag(id).pipe(
    first(),
    mergeMap(tag => {
      if (tag) {
        return of(tag);
      } else { // id not found
        console.warn('Tag not found - redirecting')
        inject(Router).navigate(['/tag']);
        return EMPTY;
      }
    }),
  );
}
