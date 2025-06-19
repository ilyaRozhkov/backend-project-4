import fs from 'fs/promises';
import path from 'path';
import debug from 'debug';
import changeName from './replace.js';

const log = debug('page-loader');

export default (url, dir, data) => {
  const { hostname, pathname } = new URL(url);
  const fileName = changeName(`${hostname}${pathname}`, '.html');
  const filePath = path.resolve(dir, fileName);
  return fs.writeFile(filePath, data)
    .then(() => {
      log('Finish writing to main html file');
      return filePath;
    })
    .catch((e) => {
      log(`Error '${e.message}' when writing main html file`);
      throw new Error(e.message);
    });
};
