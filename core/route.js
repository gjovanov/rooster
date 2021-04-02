const fastJson = require('fast-json-stringify')
const Request = require('./request-proto')
const Response = require('./response-proto')
const compress = require('./utils/compressor')
const { isHttpCode } = require('./utils/http-utils')

const PARAMS_REGEX = /:([A-Za-z0-9_-]+)/g
const getParamNames = (url) => {
  if (url.indexOf(':') !== -1) {
    const paramsArray = url.match(PARAMS_REGEX)

    if (paramsArray) {
      const params = new Map(paramsArray.map((name) => [name.substr(1), null]))
      const result = Object.fromEntries(params)
      return result
    }
  }

  return null
}

class Route {
  constructor (options, logger) {
    this.compress = compress
    this.fastJson = fastJson
    this.method = options.method
    this.url = options.url
    this.params = getParamNames(this.url)
    this.handler = options.handler
    this.schema = options.schema
    this.isAsync = this.handler.constructor.name === 'AsyncFunction'
    this.logger = logger
    this._serializers = this.initSerializers()
  }

  initSerializers () {
    if (!this.schema || !this.schema.response) {
      return JSON.stringify
    }
    const keys = Object.keys(this.schema.response)
    const httpCodeKeys = Object.keys(this.schema.response).filter(isHttpCode)
    if (!keys.length !== httpCodeKeys.length) {
      return fastJson(this.schema.response.valueOf())
    }
    const result = Object.assign({}, httpCodeKeys)
    httpCodeKeys.forEach(key => {
      result[key] = fastJson(this.schema.response[key].valueOf())
    })
    return result
  }

  getHandler () {
    const handle = this.handler

    if (this.isAsync) {
      return async (res, req) => {
        try {
          const request = new Request({
            route: this,
            req,
            res
          })
          const response = new Response({
            route: this,
            req,
            res
          })
          await handle(response, request)
          // await handle(res, req)
        } catch (e) {
          console.log(e)
          // if (!response._isDone) {
          //   // response.writeStatus('503').end()
          // }
          // TODO: Store error log
        }
      }
    } else {
      return (res, req) => {
        try {
          const request = new Request({
            route: this,
            req,
            res
          })
          const response = new Response({
            route: this,
            req,
            res
          })
          handle(response, request)
          // handle(res, req)
        } catch (e) {
          console.log(e)
          // res.writeStatus('503').end()
          // TODO: Store error log
        }
      }
    }
  }
}

module.exports = Route
