import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TagListComponent} from './tag-list/tag-list.component';
import {MatLegacyButtonModule as MatButtonModule} from '@angular/material/legacy-button';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatLegacyTableModule as MatTableModule} from '@angular/material/legacy-table';
import {MatLegacyCheckboxModule as MatCheckboxModule} from '@angular/material/legacy-checkbox';
import {MatLegacyInputModule as MatInputModule} from '@angular/material/legacy-input';
import {CreateTagComponent} from './create-tag/create-tag.component';
import {CreateTagButtonComponent} from './tag-list/create-tag-button/create-tag-button.component';
import {MatIconModule} from '@angular/material/icon';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {EditTagComponent} from './edit-tag/edit-tag.component';
import {SharedModule} from '../../shared/shared.module';
import {AppRoutingModule} from '../../app-routing.module';
import {MatSortModule} from '@angular/material/sort';


@NgModule({
  declarations: [
    TagListComponent,
    CreateTagComponent,
    CreateTagButtonComponent,
    EditTagComponent,
  ],
    imports: [
      CommonModule,
      MatButtonModule,
      MatToolbarModule,
      MatTableModule,
      MatCheckboxModule,
      MatInputModule,
      MatIconModule,
      FormsModule,
      ReactiveFormsModule,
      SharedModule,
      AppRoutingModule,
      MatSortModule,
    ],
  exports:[
    TagListComponent,
    EditTagComponent,
  ]
})
export class TagModule { }
