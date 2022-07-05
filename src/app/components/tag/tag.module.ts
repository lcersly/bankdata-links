import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TagListComponent} from './tag-list/tag-list.component';
import {MatButtonModule} from '@angular/material/button';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatTableModule} from '@angular/material/table';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatInputModule} from '@angular/material/input';
import {CreateTagComponent} from './create-tag/create-tag.component';
import {CreateTagButtonComponent} from './tag-list/create-tag-button/create-tag-button.component';
import {MatIconModule} from '@angular/material/icon';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {EditTagComponent} from './edit-tag/edit-tag.component';
import {SharedModule} from '../../shared/shared.module';
import {AppRoutingModule} from '../../app-routing.module';


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
    ],
  exports:[
    TagListComponent,
    EditTagComponent,
  ]
})
export class TagModule { }
