import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {LinkListComponentModule} from './components/link-list/link-list-component.module';
import {PipeModule} from './pipes/pipe.module';
import {LinkModificationModule} from './components/link-components/link-modification.module';
import {initializeApp, provideFirebaseApp} from '@angular/fire/app';
import {environment} from '../environments/environment';
import {getAuth, provideAuth} from '@angular/fire/auth';
import {getFirestore, provideFirestore} from '@angular/fire/firestore';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    // firebase init
    provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),

    // standard modules
    BrowserModule,
    BrowserAnimationsModule,

    // component modules
    LinkModificationModule,
    LinkListComponentModule,

    // routing
    AppRoutingModule,

    // helpers
    PipeModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {
}
