import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {LinkListComponent} from "./link-list.component";
import {MatTableModule} from "@angular/material/table";
import {MatListModule} from "@angular/material/list";
import {MatIconModule} from "@angular/material/icon";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatButtonModule} from "@angular/material/button";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatInputModule} from "@angular/material/input";
import {MatSelectModule} from "@angular/material/select";
import {PipeModule} from "../../pipes/pipe.module";


@NgModule({
  declarations: [
    LinkListComponent,
  ],
  imports: [
    CommonModule,
    MatTableModule,
    MatListModule,
    MatIconModule,
    MatFormFieldModule,
    MatButtonModule,
    FormsModule,
    MatInputModule,
    MatSelectModule,
    ReactiveFormsModule,
    PipeModule,
  ],
  exports: [LinkListComponent]
})
export class LinkListComponentModule {
}
