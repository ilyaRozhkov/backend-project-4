import { test, expect } from '@jest/globals';
import nock from 'nock';
import load from '../src/utils/load.js';

nock.disableNetConnect();

test('load - basic case', async () => {
  const url = new URL('https://ru.hexlet.io/courses');
  nock(url.origin)
    .get(url.pathname)
    .reply(200, 'test data');

  const data = await load(url);
  expect(data).toBe('test data');
});
