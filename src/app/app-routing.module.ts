import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LinkListComponent} from './components/link/link-list/link-list.component';
import {EditLinkComponent} from './components/link/edit-link/edit-link.component';
import {CreateNewLinkComponent} from './components/link/create-new-link/create-new-link.component';
import {TagListComponent} from './components/tag/tag-list/tag-list.component';
import {CreateTagComponent} from './components/tag/create-tag/create-tag.component';
import {EditTagComponent} from './components/tag/edit-tag/edit-tag.component';
import {TagResolverService} from './components/tag/tag-resolver.service';
import {LinkResolverService} from './components/link/link-resolver.service';
import {LoginComponent} from './components/login/login/login.component';
import {canActivate, redirectLoggedInTo, redirectUnauthorizedTo} from '@angular/fire/auth-guard';

export const PATHS_URLS = {
  createLink: 'link/create',
  createTag: 'tag/create',
};

const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['login']);
const redirectLoggedInToItems = () => redirectLoggedInTo(['link']);

const routes: Routes = [
  {path: '', pathMatch: 'full', redirectTo: 'links'},
  {
    path: 'links', children: [
      {path: '', pathMatch: 'full', component: LinkListComponent},
      {
        path: 'create',
        component: CreateNewLinkComponent,
        ...canActivate(redirectUnauthorizedToLogin),
      },
      {
        path: ':id',
        component: EditLinkComponent,
        resolve: {link: LinkResolverService},
        ...canActivate(redirectUnauthorizedToLogin),
      },
    ],
    ...canActivate(redirectUnauthorizedToLogin),
  },
  {
    path: 'tags', children: [
      {path: '', pathMatch: 'full', component: TagListComponent},
      {
        path: 'create',
        component: CreateTagComponent,
        ...canActivate(redirectUnauthorizedToLogin),
      },
      {
        path: ':id',
        component: EditTagComponent,
        resolve: {tag: TagResolverService}, ...canActivate(redirectUnauthorizedToLogin),
      },
    ],
    ...canActivate(redirectUnauthorizedToLogin),
  },
  {path: 'login', component: LoginComponent, ...canActivate(redirectLoggedInToItems)},
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    // enableTracing: !environment.production
  })],
  exports: [RouterModule],
})
export class AppRoutingModule {
}
