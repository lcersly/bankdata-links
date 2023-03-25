import {Routes} from '@angular/router';
import {LinkListComponent} from './components/link/link-list/link-list.component';
import {EditLinkComponent} from './components/link/edit-link/edit-link.component';
import {CreateNewLinkComponent} from './components/link/create-new-link/create-new-link.component';
import {TagListComponent} from './components/tag/tag-list/tag-list.component';
import {CreateTagComponent} from './components/tag/create-tag/create-tag.component';
import {EditTagComponent} from './components/tag/edit-tag/edit-tag.component';
import {TagResolveFn} from './resolvers/tag-resolve-fn';
import {LinkResolveFn} from './resolvers/link-resolve-fn';
import {LoginComponent} from './components/login/login/login.component';
import {canActivate, redirectLoggedInTo, redirectUnauthorizedTo} from '@angular/fire/auth-guard';
import {PATHS_URLS} from './urls';
import {HelpComponent} from './components/help/help.component';

const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo([PATHS_URLS.login]);
const redirectLoggedInToItems = () => redirectLoggedInTo([PATHS_URLS.links]);

export const routes: Routes = [
  {path: '', pathMatch: 'full', redirectTo: PATHS_URLS.links},
  {
    path: PATHS_URLS.links, children: [
      {path: '', pathMatch: 'full', component: LinkListComponent},
      {
        path: 'create',
        component: CreateNewLinkComponent,
        ...canActivate(redirectUnauthorizedToLogin),
      },
      {
        path: ':id',
        component: EditLinkComponent,
        resolve: {link: LinkResolveFn},
        ...canActivate(redirectUnauthorizedToLogin),
      },
    ],
    ...canActivate(redirectUnauthorizedToLogin),
  },
  {
    path: PATHS_URLS.tags, children: [
      {path: '', pathMatch: 'full', component: TagListComponent},
      {
        path: 'create',
        component: CreateTagComponent,
        ...canActivate(redirectUnauthorizedToLogin),
      },
      {
        path: ':id',
        component: EditTagComponent,
        resolve: {tag: TagResolveFn}, ...canActivate(redirectUnauthorizedToLogin),
      },
    ],
    ...canActivate(redirectUnauthorizedToLogin),
  },
  {path: PATHS_URLS.help, component: HelpComponent, ...canActivate(redirectUnauthorizedToLogin)},
  {path: PATHS_URLS.login, component: LoginComponent, ...canActivate(redirectLoggedInToItems)},
];
