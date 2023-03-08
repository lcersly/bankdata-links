import {EnvironmentModel} from './environment.model';

export const environment:EnvironmentModel = {
  production: true,
  firebase: {
    apiKey: 'AIzaSyChKnrY_7KIJl7liK9VbVjhajmZ5aqjl94',
    authDomain: 'links-test-df846.firebaseapp.com',
    projectId: 'links-test-df846',
    locationId: 'europe-west',
    storageBucket: 'links-test-df846.appspot.com',
    messagingSenderId: '82420744310',
    appId: '1:82420744310:web:e5ce505338fc14ace49f57',
  },
  useEmulators: false,
  functions: {
    favIcon: 'https://europe-west1-links-test-df846.cloudfunctions.net/favIcon',
  },
};
