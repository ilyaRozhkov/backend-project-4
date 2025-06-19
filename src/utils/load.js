import { createRequire } from 'node:module';
import debug from 'debug';

const require = createRequire(import.meta.url);
require('axios-debug-log');
const axios = require('axios');

const log = debug('page-loader');

export default (url, responseType = 'json') => {
  log(`Start loading - ${url}`);
  return axios({
    method: 'get',
    url,
    responseType,
  }).then((response) => {
    log(`Received response from ${response.config.url} with status ${response.status}`);
    return response.data;
  })
    .catch((e) => {
      log(`Error '${e.message}' when loading ${url}`);
      throw new Error(e.message);
    });
};
