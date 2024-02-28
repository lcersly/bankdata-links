import {CanActivateChildFn} from '@angular/router';
import {inject} from '@angular/core';
import {FirestoreLinkService} from '../services/firestore/firestore-link.service';
import {FirestoreTagService} from '../services/firestore/firestore-tag.service';
import {combineLatestWith, first, map, skipWhile} from 'rxjs';

export const waitForDataHasLoadedGuard: CanActivateChildFn = (route, state) => {
  const linkService = inject(FirestoreLinkService);
  const tagService = inject(FirestoreTagService);

  return linkService.state$.pipe(
    combineLatestWith(tagService.state$),
    skipWhile(([linkState, tagState]) =>
      linkState.status !== 'loaded' || tagState.status !== 'loaded',
    ),
    first(),
    map(() => true),
  )
};
