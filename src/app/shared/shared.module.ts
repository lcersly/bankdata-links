import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TopBarComponent} from './components/top-bar/top-bar.component';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import {MatLegacyButtonModule as MatButtonModule} from '@angular/material/legacy-button';
import {MatLegacySnackBarModule as MatSnackBarModule} from '@angular/material/legacy-snack-bar';
import {SideBarComponent} from './components/side-bar/side-bar.component';
import {MatSidenavModule} from '@angular/material/sidenav';
import {AppRoutingModule} from '../app-routing.module';


@NgModule({
  declarations: [
    TopBarComponent,
    SideBarComponent,
  ],
  imports: [
    CommonModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatSnackBarModule,
    MatSidenavModule,
    AppRoutingModule,
  ],
  exports: [
    TopBarComponent,
    SideBarComponent,
  ],
})
export class SharedModule {
}
