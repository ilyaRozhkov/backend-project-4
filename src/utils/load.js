import { createRequire } from 'node:module'
import debug from 'debug'

const require = createRequire(import.meta.url)
require('axios-debug-log')
const axios = require('axios')

const log = debug('page-loader')

export default (url, responseType = 'json') => {
  log(`Start loading - ${url}`)
    const controller = new AbortController()
    const timerId = setTimeout(()=> controller.abort(), 120000)
  return axios({
    method: 'get',
    url,
    responseType,
    signal: controller.signal
  }).then((response) => {
    clearTimeout(timerId)
    log(`Received response from ${response.config.url} with status ${response.status}`)
    return response.data
  })
    .catch((e) => {
      clearTimeout(timerId)
      if(e.name === 'AbortError'){
        log('Request timed out after 120s')
             throw new Error(e.message)
      }
      log(`Error '${e.message}' when loading ${url}`)
      throw new Error(e.message)
    })

}
