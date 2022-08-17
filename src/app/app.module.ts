import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {PipeModule} from './shared/pipes/pipe.module';
import {LinkModule} from './components/link/link.module';
import {getApp, initializeApp, provideFirebaseApp} from '@angular/fire/app';
import {environment} from '../environments/environment';
import {getAuth, provideAuth} from '@angular/fire/auth';
import {initializeFirestore, provideFirestore} from '@angular/fire/firestore';
import {TagModule} from './components/tag/tag.module';
import {HttpClientModule} from '@angular/common/http';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatButtonModule} from '@angular/material/button';
import {SharedModule} from './shared/shared.module';
import {LoginModule} from './components/login/login.module';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    // firebase init
    provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
    provideAuth(() => getAuth()),
    provideFirestore(() => initializeFirestore(getApp(), {experimentalForceLongPolling: true})),

    // standard modules
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,

    // component modules
    LinkModule,
    TagModule,
    LoginModule,

    // routing
    AppRoutingModule,

    // helpers
    PipeModule,

    //Material
    MatSidenavModule,
    MatButtonModule,
    SharedModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {
}
