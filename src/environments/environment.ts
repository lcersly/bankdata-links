// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

import {EnvironmentModel} from './environment.model';

export const environment:EnvironmentModel = {
  production: false,
  firebase:{
    apiKey: 'AIzaSyChKnrY_7KIJl7liK9VbVjhajmZ5aqjl94',
    authDomain: 'links-test-df846.firebaseapp.com',
    projectId: 'links-test-df846',
    locationId: 'europe-west',
    storageBucket: 'links-test-df846.appspot.com',
    messagingSenderId: '82420744310',
    appId: '1:82420744310:web:e5ce505338fc14ace49f57',
  },
  useEmulators: true,
  functions: {
    favIcon: 'https://europe-west1-links-test-df846.cloudfunctions.net/favIcon',
  },
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
