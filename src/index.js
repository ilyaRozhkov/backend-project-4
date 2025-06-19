import debug from 'debug';
import loadMainHtmlFile from './utils/load.js';
import loadAssetsAndPrepareHTML from './utils/html-handler.js';
import wtiteMainHtmlFile from './utils/writer.js';

const log = debug('page-loader');

export default (url, outputPath = process.cwd()) => {
  log('Start loading main html file');
  return loadMainHtmlFile(url)
    .then((rawHTML) => {
      log('Start preparing the file');
      return loadAssetsAndPrepareHTML(url, outputPath, rawHTML)
        .then((preparedHTML) => {
          log('Start writing prepared data to the main html file');
          return wtiteMainHtmlFile(url, outputPath, preparedHTML)
            .then((filePath) => {
              console.log(`Page was successfully downloaded into '${filePath}'`);
            });
        });
    })
    .catch((e) => {
      log(`Further work of the application is impossible due to an error '${e.message}'`);
      log('Application is shutting down');
      throw new Error(e.message);
    });
};
