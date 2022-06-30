import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {EditLinkComponent} from './edit-link/edit-link.component';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatInputModule} from '@angular/material/input';
import {CreateNewLinkComponent} from './create-new-link/create-new-link.component';
import {MatButtonModule} from '@angular/material/button';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ChipsWithAutocompleteComponent} from './chips-with-autocomplete/chips-with-autocomplete.component';
import {MatChipsModule} from '@angular/material/chips';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonToggleModule} from '@angular/material/button-toggle';


@NgModule({
  declarations: [
    EditLinkComponent,
    CreateNewLinkComponent,
    ChipsWithAutocompleteComponent,
  ],
  imports: [
    CommonModule,
    MatToolbarModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatChipsModule,
    MatAutocompleteModule,
    MatIconModule,
    MatButtonToggleModule,
  ],
  exports: [
    EditLinkComponent,
    CreateNewLinkComponent,
  ],
})
export class LinkModificationModule {
}
