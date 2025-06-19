import fs from 'fs/promises'
import os from 'os'
import path from 'path'
import {
  beforeEach, test, expect, afterAll,
} from '@jest/globals'
import wf from '../src/utils/writer.js'

const noop = () => {}
const expectedData = 'test data'
let currentDir

beforeEach(async () => {
  await fs.rm(currentDir, { recursive: true }).catch(noop)
  currentDir = await fs.mkdtemp(path.join(os.tmpdir(), 'page-loader-'))
})

const dataTable = [
  { url: 'https://ru.hexlet.io/courses', expectedFileName: 'ru-hexlet-io-courses.html' },
  { url: 'https://ru.hexlet.io/123456', expectedFileName: 'ru-hexlet-io-123456.html' },
]

test.each(dataTable)('writeFile - basic case for $url', async ({ url, expectedFileName }) => {
  const actualPath = await wf(url, currentDir, expectedData)
  const expectedPath = `${currentDir}/${expectedFileName}`
  expect(actualPath).toEqual(expectedPath)

  const actualData = await fs.readFile(expectedPath, 'utf-8')
  expect(actualData).toEqual(expectedData)
})

afterAll(() => {
  fs.rm(currentDir, { recursive: true }).catch(noop)
})
