import * as functions from 'firebase-functions';
import axios from 'axios';
import * as corsMain from 'cors';

const cors = corsMain({origin: true});

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
type Data = { src: string, type: string, base64Image?: string };

export const favIcon = functions.region('europe-west1').https.onRequest(
  async (request, response) => {
    const data: Data[] = request.body;

    if (!data || data.length == 0) {
      response.status(400).json('No url param(s) specified in req body');
      return;
    }

    functions.logger.info('Downloading image(s)', data);

    cors(request, response, async () => {
      if (request.method !== 'POST') {
        return response.status(401).json({
          message: 'Not allowed',
        });
      }

      const promises = [];
      for (const icon of data) {
        promises.push(axios.get(icon.src, {
          responseType: 'arraybuffer',
        })
          .then((axiosResponse) => {
            functions.logger.info('Response from API for ' + icon.src + ' - ' +
              axiosResponse.status + ' - ' +
              axiosResponse.statusText,
            );

            const buffer = Buffer.from(axiosResponse.data, 'binary');
            icon.base64Image = buffer.toString('base64');
          }));
      }

      try {
        await Promise.all(promises);
        return response.status(200).json(data);
      } catch (err) {
        return response.status(500).json({
          error: err,
        });
      }
    });
  },
);
