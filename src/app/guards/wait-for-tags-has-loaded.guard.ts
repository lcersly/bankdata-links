import {CanActivateChildFn} from '@angular/router';
import {inject} from '@angular/core';
import {FirestoreTagService} from '../services/firestore/firestore-tag.service';
import {first, map, skipWhile} from 'rxjs';

export const waitForTagsHasLoadedGuard: CanActivateChildFn = (route, state) => {
  const tagService = inject(FirestoreTagService);

  return tagService.state$.pipe(
    skipWhile((tagState) =>
      tagState.status !== 'loaded',
    ),
    first(),
    map(() => true),
  )
};
