import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {PipeModule} from './pipes/pipe.module';
import {LinkModule} from './components/link/link.module';
import {initializeApp, provideFirebaseApp} from '@angular/fire/app';
import {environment} from '../environments/environment';
import {getAuth, provideAuth} from '@angular/fire/auth';
import {getFirestore, provideFirestore} from '@angular/fire/firestore';
import {TagModule} from './components/tag/tag.module';

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
    LinkModule,
    TagModule,

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
