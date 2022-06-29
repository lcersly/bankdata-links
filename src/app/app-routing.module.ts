import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LinkListComponent} from './components/link-list/link-list.component';
import {CreateLinkComponent} from './components/link-components/create-link/create-link.component';
import {EditLinkComponent} from './components/link-components/edit-link/edit-link.component';

export const PATHS_URLS = {
  createLink: 'link/create'
};

const routes: Routes = [
  {path: '', pathMatch: 'full', redirectTo: 'link'},
  {
    path: 'link', children: [
      {path: '', component: LinkListComponent},
      {path: 'create', component: CreateLinkComponent},
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
