import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CreateLinkComponent} from './create-link/create-link.component';
import {EditLinkComponent} from './edit-link/edit-link.component';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatInputModule} from '@angular/material/input';
import {ReactiveFormsModule} from '@angular/forms';

export const urlPattern = /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)$/

@NgModule({
  declarations: [
    CreateLinkComponent,
    EditLinkComponent,
  ],
  imports: [
    CommonModule,
    MatToolbarModule,
    MatInputModule,
    ReactiveFormsModule,
  ],
  exports: [
    CreateLinkComponent,
    EditLinkComponent,
  ],
})
export class LinkModificationModule {
}
