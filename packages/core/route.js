const fastJson = require('fast-json-stringify')
const compile = require('turbo-json-parse')

const Request = require('./request')
const Response = require('./response')
const compress = require('./utils/compressor')
const { isHttpCode, getParamNames } = require('./utils/http-utils')


class Route {
  constructor (options) {
    this.compress = compress
    this.fastJson = fastJson
    this.compile = compile

    this.app = options.app
    this.method = options.route.method
    this.url = options.route.url
    this.params = getParamNames(this.url)
    this.handler = options.route.handler
    this.schema = options.route.schema
    this.isAsync = this.handler.constructor.name === 'AsyncFunction'
    this.logger = options.logger


    this._query = this.schema && this.schema.query && this.schema.query.valueOf() && this.schema.query.valueOf().properties
      ? Object.fromEntries(Object.keys(this.schema.query.valueOf().properties).map(p => [p, null])) : null

    const schemaParams = this.schema && this.schema.params && this.schema.params.valueOf() && this.schema.params.valueOf().properties
      ? Object.keys(this.schema.params.valueOf().properties) : []
    this._params = Object.fromEntries(schemaParams.length ? new Map([...this.params].filter(p => schemaParams.includes(p[0]))) : this.params)

    this._headers = this.schema && this.schema.headers && this.schema.headers.valueOf() && this.schema.headers.valueOf().properties
      ? Object.fromEntries(Object.keys(this.schema.headers.valueOf().properties).map(p => [p, null])) : null

    this._cookies = this.schema && this.schema.cookies && this.schema.cookies.valueOf() && this.schema.cookies.valueOf().properties
      ? Object.fromEntries(Object.keys(this.schema.cookies.valueOf().properties).map(p => [p, null])) : null

    this._body = this.schema && this.schema.body && this.schema.body.valueOf() && this.schema.body.valueOf().properties
      ? Object.fromEntries(Object.keys(this.schema.body.valueOf().properties).map(p => [p, null])) : null

    this._serializers = this.initSerializers()
    this._parsers = this.initParsers()
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
      result[key] = fastJson(this.schema.response[key])
    })
    return result
  }

  initParsers () {
    const result = {
      query: null,
      params: null,
      headers: null,
      cookies: null,
      body: null
    }
    for (const parser in result) {
      result[parser] = !this.schema || !this.schema[parser] ? JSON.parse : compile(this.schema[parser].valueOf())
    }
    return result
  }

  getHandlerSync () {
    let response
    let request
    const route = this
    const handle = this.handler

    return (res, req) => {
      try {
        response = new Response({ route, req, res })
        request = new Request({ route, req, res })
        handle(response, request)
      } catch (e) {
        route.logger.error(e)
        if (response && !response._isDone) {
          response.logger.error(e)
          response.writeStatus('503').end()
        }
      }
    }
  }

  getHandlerAsync () {
    let response
    let request
    const route = this
    const handle = this.handler

    return async (res, req) => {
      try {
        response = new Response({ route, req, res })
        request = new Request({ route, req, res })
        await handle(response, request)
      } catch (e) {
        route.logger.error(e)
        if (response && !response._isDone) {
          response.logger.error(e)
          response.writeStatus('503').end()
        }
      }
    }
  }
}

module.exports = Route
