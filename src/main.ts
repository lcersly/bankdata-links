import {APP_INITIALIZER, enableProdMode, importProvidersFrom, LOCALE_ID} from '@angular/core';
import {environment} from './environments/environment';
import {bootstrapApplication} from '@angular/platform-browser';
import {AppComponent} from './app/app.component';
import {AppRoutingModule} from './app/app-routing.module';
import {provideAnimations} from '@angular/platform-browser/animations';
import {provideHttpClient} from '@angular/common/http';
import {MatDialogModule} from '@angular/material/dialog';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import '@angular/common/locales/global/da';

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(),
    provideAnimations(),
    importProvidersFrom(
      AppRoutingModule,
      MatDialogModule,
      MatSnackBarModule,
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
