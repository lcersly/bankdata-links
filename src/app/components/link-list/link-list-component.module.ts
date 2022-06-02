import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {LinkListComponent} from "./link-list.component";
import {MatTableModule} from "@angular/material/table";


@NgModule({
  declarations: [
    LinkListComponent
  ],
  imports: [
    CommonModule,
    MatTableModule,
  ],
  exports: [LinkListComponent]
})
export class LinkListComponentModule {
}
