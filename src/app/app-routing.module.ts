import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LinkListComponent} from './components/link-list/link-list.component';
import {EditLinkComponent} from './components/link-components/edit-link/edit-link.component';
import {CreateNewLinkComponent} from './components/link-components/create-new-link/create-new-link.component';
import {TagListComponent} from './components/tag/tag-list/tag-list.component';
import {CreateTagComponent} from './components/tag/create-tag/create-tag.component';
import {EditTagComponent} from './components/tag/edit-tag/edit-tag.component';

export const PATHS_URLS = {
  createLink: 'link/create',
  createTag: 'tag/create',
};

const routes: Routes = [
  {path: '', pathMatch: 'full', redirectTo: 'link'},
  {
    path: 'link', children: [
      {path: '', pathMatch: 'full', component: LinkListComponent},
      {path: 'create', component: CreateNewLinkComponent},
      {path: ':id', component: EditLinkComponent},
    ],
  },
  {
    path: 'tag', children: [
      {path: '', pathMatch: 'full', component: TagListComponent},
      {path: 'create', component: CreateTagComponent},
      {path: ':id', component: EditTagComponent},
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {
}
