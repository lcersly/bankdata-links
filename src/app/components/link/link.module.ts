import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {EditLinkComponent} from './edit-link/edit-link.component';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatLegacyInputModule as MatInputModule} from '@angular/material/legacy-input';
import {CreateNewLinkComponent} from './create-new-link/create-new-link.component';
import {MatLegacyButtonModule as MatButtonModule} from '@angular/material/legacy-button';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {TagSelectorComponent} from './link-form/tag-selector/tag-selector.component';
import {MatLegacyChipsModule as MatChipsModule} from '@angular/material/legacy-chips';
import {MatLegacyAutocompleteModule as MatAutocompleteModule} from '@angular/material/legacy-autocomplete';
import {MatIconModule} from '@angular/material/icon';
import {MatLegacyCheckboxModule as MatCheckboxModule} from '@angular/material/legacy-checkbox';
import {
  EnvironmentCheckBoxGroupComponent,
} from './link-form/environment-checkbox-group/environment-check-box-group.component';
import {MatLegacyTooltipModule as MatTooltipModule} from '@angular/material/legacy-tooltip';
import {MatLegacyTableModule as MatTableModule} from '@angular/material/legacy-table';
import {MatLegacyListModule as MatListModule} from '@angular/material/legacy-list';
import {MatLegacyFormFieldModule as MatFormFieldModule} from '@angular/material/legacy-form-field';
import {MatLegacySelectModule as MatSelectModule} from '@angular/material/legacy-select';
import {PipeModule} from '../../shared/pipes/pipe.module';
import {CreateButtonComponent} from './link-list/create-button/create-button.component';
import {LinkListComponent} from './link-list/link-list.component';
import {SharedModule} from '../../shared/shared.module';
import {AppRoutingModule} from '../../app-routing.module';
import {MatSortModule} from '@angular/material/sort';
import {LinkFormComponent} from './link-form/link-form.component';
import {IconFormComponent} from './link-form/icon-form/icon-form.component';
import {BookmarkletComponent} from './create-new-link/bookmarklet/bookmarklet.component';
import {DialogDeleteLinkComponent} from './edit-link/dialog-delete-link/dialog-delete-link.component';
import {MatLegacyDialogModule as MatDialogModule} from '@angular/material/legacy-dialog';


@NgModule({
  declarations: [
    EditLinkComponent,
    CreateNewLinkComponent,
    TagSelectorComponent,
    EnvironmentCheckBoxGroupComponent,
    CreateButtonComponent,
    LinkListComponent,
    LinkFormComponent,
    IconFormComponent,
    BookmarkletComponent,
    DialogDeleteLinkComponent,
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
    MatDialogModule,
  ],
  exports: [
    EditLinkComponent,
    CreateNewLinkComponent,
    LinkListComponent,
  ],
})
export class LinkModule {
}
