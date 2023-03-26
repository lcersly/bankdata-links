import {APP_INITIALIZER, enableProdMode, importProvidersFrom, LOCALE_ID} from '@angular/core';
import {environment} from './environments/environment';
import {bootstrapApplication} from '@angular/platform-browser';
import {AppComponent} from './app/app.component';
import {routes} from './app/app-routing.module';
import {provideAnimations} from '@angular/platform-browser/animations';
import '@angular/common/locales/global/da';
import {FirebaseModule} from './app/modules/firebase.module';
import {provideRouter} from '@angular/router';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatDialogModule} from '@angular/material/dialog';

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
  providers: [
    provideAnimations(),
    provideRouter(routes),
    importProvidersFrom(
      FirebaseModule,
      MatSnackBarModule,
      MatDialogModule,
    ),
    {
      provide: APP_INITIALIZER,
      useFactory: initializeApp2,
      deps: []
    },
    {provide: LOCALE_ID, useValue: 'da'},
    {provide: Window, useValue: window}
  ]
}).catch(e => console.error("Bootstrap error", e));

function initializeApp2(): Promise<any> {
  return new Promise<void>((resolve) => {
    resolve();
  });
}
