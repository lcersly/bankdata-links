import {Routes} from '@angular/router';
import {LinkListViewComponent} from './features/links/components/link-list-view.component';
import {EditLinkComponent} from './features/links/forms/edit-link/edit-link.component';
import {CreateNewLinkComponent} from './features/links/forms/create-new-link/create-new-link.component';
import {TagListViewComponent} from './features/tags/components/tag-list-view.component';
import {CreateTagComponent} from './features/tags/components/create-tag/create-tag.component';
import {EditTagComponent} from './features/tags/components/edit-tag/edit-tag.component';
import {TagResolveFn} from './resolvers/tag-resolve-fn';
import {LinkResolveFn} from './resolvers/link-resolve-fn';
import {LoginComponent} from './features/login/components/login/login.component';
import {canActivate, redirectLoggedInTo, redirectUnauthorizedTo} from '@angular/fire/auth-guard';
import {PATHS_URLS} from './urls';
import {HelpComponent} from './features/help/help.component';
import {ExportToFileComponent} from './features/export/components/export-to-file.component';
import {HistoryComponent} from './features/history/history.component';

const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo([PATHS_URLS.login]);
const redirectLoggedInToItems = () => redirectLoggedInTo([PATHS_URLS.links]);

export const routes: Routes = [
  {path: '', pathMatch: 'full', redirectTo: PATHS_URLS.links},
  {
    path: PATHS_URLS.links, children: [
      {path: '', pathMatch: 'full', component: LinkListViewComponent},
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
      {path: '', pathMatch: 'full', component: TagListViewComponent},
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
  {path: PATHS_URLS.export, component: ExportToFileComponent, ...canActivate(redirectUnauthorizedToLogin)},
  {path: PATHS_URLS.history, component: HistoryComponent, ...canActivate(redirectUnauthorizedToLogin)},
  {path: PATHS_URLS.help, component: HelpComponent, ...canActivate(redirectUnauthorizedToLogin)},
  {path: PATHS_URLS.login, component: LoginComponent, ...canActivate(redirectLoggedInToItems)},
];
