import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {EditLinkComponent} from './edit-link/edit-link.component';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatInputModule} from '@angular/material/input';
import {ReactiveFormsModule} from '@angular/forms';
import {CreateNewLinkComponent} from './create-new-link/create-new-link.component';


@NgModule({
  declarations: [
    EditLinkComponent,
    CreateNewLinkComponent,
  ],
  imports: [
    CommonModule,
    MatToolbarModule,
    MatInputModule,
    ReactiveFormsModule,
  ],
  exports: [
    EditLinkComponent,
    CreateNewLinkComponent,
  ],
})
export class LinkModificationModule {
}
