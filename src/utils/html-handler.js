import fs from 'fs/promises'
import path from 'path'
import * as cheerio from 'cheerio'
import debug from 'debug'
import Listr from 'listr'
import load from './load.js'
import changeName from './replace.js'

const log = debug('page-loader')

const createTask = (elURL, ext, elPath) => {
  const responseType = ext === '' ? 'json' : 'stream'
  const task = {
    title: elURL.href,
    task: () => load(elURL, responseType)
      .then((data) => {
        log('Start writing data to a file')
        fs.writeFile(elPath, data)
      }),
  }
  return task
}

const createTasksToLoadAssets = (elements, outputDir, url, $, attrName) => {
  const tasks = []
  for (const element of elements) {
    const { hostname } = new URL(url)
    const el = $(element)
    const attr = el.attr(attrName)
    log(`Link handling - ${attr}`)
    const elURL = new URL(attr, url)
    const { hostname: elHostname, pathname: elPathname } = elURL
    if (hostname === elHostname && attr !== undefined) {
      log('Data can be loaded')
      const { dir, ext, name } = path.parse(`${elHostname}${elPathname}`)
      const elName = changeName(`${dir}/${name}`, ext || '.html')
      const elPath = path.resolve(outputDir.dirFilesPath, elName)
      el.attr(attrName, path.join(outputDir.dirFilesName, elName))
      tasks.push(createTask(elURL, ext, elPath))
    }
    else log('Data cant\'t be loaded')
  }
  return tasks
}

export default (url, outputDirPath, rawHTML) => {
  const { hostname, pathname } = new URL(url)
  const dirFilesName = changeName(`${hostname}${pathname}`, '_files')
  const dirFilesPath = path.resolve(outputDirPath, dirFilesName)
  const $ = cheerio.load(rawHTML)

  log(`Creating a directory for assets (path: ${dirFilesPath})`)
  return fs.mkdir(dirFilesPath, { recursive: true })
  .then(() => {
    log('Preparing tasks for images')
    const images = $('img')
    const imgTasks = createTasksToLoadAssets(images, { dirFilesPath, dirFilesName }, url, $, 'src')

    log('Preparing tasks for links')
    const links = $('link')
    const linksTasks = createTasksToLoadAssets(links, { dirFilesPath, dirFilesName }, url, $, 'href')

    log('Preparing tasks for scripts')
    const scripts = $('script')
    const scriptsTasks = createTasksToLoadAssets(scripts, { dirFilesPath, dirFilesName }, url, $, 'src')

    log('Start loading assets')
    return new Listr(
      [...imgTasks, ...linksTasks, ...scriptsTasks],
      { concurrent: true, exitOnError: false }
    )
      .run()
      .then(() => $.html())
  })
  .catch(err => {
    console.error('Critical error:', err)
    throw err
  })
}
