/*
  Wrapper around uWebSockets.js HttpRequest
*/
const Request = function (args) {
  this.route = args.route
  this.schema = args.schema

  this.req = args.req // raw uWebSockets.js HttpRequest (to be initialized later)
  this.res = args.res // raw uWebSockets.js HttpResponse (to be initialized later)

  this._hostname = null
  this._ip = null
  this._ips = null
  this._originalUrl = null


  // query   = 00001 = 1
  // params  = 00010 = 2
  // headers = 00100 = 4
  // cookies = 01000 = 8
  // body    = 10000 = 16
  this._flags = 0 // boolean flags whether query|params|headers|cookies are initialized


  this._query = this.route.schema && this.route.schema.query && this.route.schema.query.valueOf() && this.route.schema.query.valueOf().properties
    ? Object.fromEntries(Object.keys(this.route.schema.query.valueOf().properties).map(p => [p, null])) : null

  this._params = this.route.schema && this.route.schema.params && this.route.schema.params.valueOf() && this.route.schema.params.valueOf().properties
    ? Object.fromEntries(Object.keys(this.route.schema.params.valueOf().properties).map(p => [p, null])) : null

  this._headers = this.route.schema && this.route.schema.headers && this.route.schema.headers.valueOf() && this.route.schema.headers.valueOf().properties
    ? Object.fromEntries(Object.keys(this.route.schema.headers.valueOf().properties).map(p => [p, null])) : null

  this._cookies = this.route.schema && this.route.schema.cookies && this.route.schema.cookies.valueOf() && this.route.schema.cookies.valueOf().properties
    ? Object.fromEntries(Object.keys(this.route.schema.cookies.valueOf().properties).map(p => [p, null])) : null

  this._body = this.route.schema && this.route.schema.body && this.route.schema.body.valueOf() && this.route.schema.body.valueOf().properties
    ? Object.fromEntries(Object.keys(this.route.schema.body.valueOf().properties).map(p => [p, null])) : null
  this._bodyBuffer = null
}

require('./base')(Request)
require('./meta')(Request)
require('./query')(Request)
require('./body')(Request)
require('./params')(Request)
require('./headers')(Request)
require('./cookies')(Request)

module.exports = Request
