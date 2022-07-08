import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {EditLinkComponent} from './edit-link/edit-link.component';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatInputModule} from '@angular/material/input';
import {CreateNewLinkComponent} from './create-new-link/create-new-link.component';
import {MatButtonModule} from '@angular/material/button';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {TagSelectorComponent} from './tag-selector/tag-selector.component';
import {MatChipsModule} from '@angular/material/chips';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatIconModule} from '@angular/material/icon';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {EnvironmentCheckBoxGroupComponent} from './environment-checkbox-group/environment-check-box-group.component';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatTableModule} from '@angular/material/table';
import {MatListModule} from '@angular/material/list';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import {PipeModule} from '../../shared/pipes/pipe.module';
import {CreateButtonComponent} from './link-list/create-button/create-button.component';
import {LinkListComponent} from './link-list/link-list.component';
import {SharedModule} from '../../shared/shared.module';
import {AppRoutingModule} from '../../app-routing.module';
import {MatSortModule} from '@angular/material/sort';


@NgModule({
  declarations: [
    EditLinkComponent,
    CreateNewLinkComponent,
    TagSelectorComponent,
    EnvironmentCheckBoxGroupComponent,
    CreateButtonComponent,
    LinkListComponent,
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
    MatCheckboxModule,
    MatTooltipModule,
    MatTableModule,
    MatListModule,
    MatFormFieldModule,
    MatSelectModule,
    PipeModule,
    SharedModule,
    AppRoutingModule,
    MatSortModule,
  ],
  exports: [
    EditLinkComponent,
    CreateNewLinkComponent,
    LinkListComponent,
  ],
})
export class LinkModule {
}
