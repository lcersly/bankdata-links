import * as functions from 'firebase-functions';

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
export const helloWorld = functions.https.onRequest((request, response) => {
  functions.logger.info('Hello logs!', {structuredData: true});
  response.send('Hello from Firebase!');
});

export const favIcon = functions.https.onRequest((request, response) => {
  functions.logger.info('Downloading favicon from ', {structuredData: true}, request.query['url']);

  response.send('Hello from Firebase!');
});
