import {NgModule} from '@angular/core';
import {FirebaseAppModule, getApp, initializeApp, provideFirebaseApp} from '@angular/fire/app';
import {environment} from '../../environments/environment';
import {AuthModule, connectAuthEmulator, getAuth, provideAuth} from '@angular/fire/auth';
import {
  connectFirestoreEmulator,
  FirestoreModule,
  initializeFirestore,
  provideFirestore,
} from '@angular/fire/firestore';
import {connectFunctionsEmulator, getFunctions, provideFunctions} from '@angular/fire/functions';

@NgModule({
  declarations: [],
  providers: [
    // firebase init
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => {
      const auth = getAuth();
      if (environment.useEmulators) {
        console.info('Using emulator for authentication')
        connectAuthEmulator(auth, 'http://localhost:9099', {disableWarnings: false});
      }
      return auth;
    }),
    provideFirestore(() => {
      const firestore = initializeFirestore(getApp(), {experimentalForceLongPolling: true});
      if (environment.useEmulators) {
        console.info('Using emulator for user firestore')
        connectFirestoreEmulator(firestore, 'localhost', 8080);
      }
      return firestore;
    }),
    provideFunctions(() => {
      const functions = getFunctions();
      if (environment.useEmulators) {
        connectFunctionsEmulator(functions, 'localhost', 5001)
      }
      return functions
    }),
  ],
  exports: [
    FirebaseAppModule,
    AuthModule,
    FirestoreModule,
  ],
})
export class FirebaseModule {
}
