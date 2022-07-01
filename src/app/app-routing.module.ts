import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LinkListComponent} from './components/link-list/link-list.component';
import {EditLinkComponent} from './components/link-components/edit-link/edit-link.component';
import {CreateNewLinkComponent} from './components/link-components/create-new-link/create-new-link.component';

export const PATHS_URLS = {
  createLink: 'link/create'
};

const routes: Routes = [
  {path: '', pathMatch: 'full', redirectTo: 'links'},
  {path: 'links', component: LinkListComponent},
  {
    path: 'link', children: [
      {path: '', pathMatch: 'full', redirectTo: 'create'},
      {path: 'create', component: CreateNewLinkComponent},
      {path: 'edit/:id', component: EditLinkComponent},
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {
}
