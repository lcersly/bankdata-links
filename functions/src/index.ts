import * as functions from 'firebase-functions';
import axios from 'axios';
import * as corsMain from 'cors';

const cors = corsMain({origin: true});

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
export const favIcon = functions.https.onRequest((request, response) => {
  const url = request.query['url'] as string;

  if (!url) {
    response.status(400).json('No url param specified');
    return;
  }

  functions.logger.info('Downloading image from: ' + url);

  cors(request, response, () => {
    if (request.method !== 'GET') {
      return response.status(401).json({
        message: 'Not allowed',
      });
    }

    return axios.get(url, {
      responseType: 'arraybuffer',
    }).then((res) => {
      functions.logger.info('Response from API - ' +
        res.status + ' - ' +
        res.statusText,
      );

      const buffer = Buffer.from(res.data, 'binary');
      const base64Image = buffer.toString('base64');
      const rawImage = buffer.toString('utf8');

      return response.status(200).json({
        base64Image: base64Image,
        rawImage: rawImage,
      });
    }).catch((err) =>
      response.status(500).json({
        error: err,
      }));
  });
});
