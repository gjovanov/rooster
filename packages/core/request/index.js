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


  this._query = Object.assign({}, this.route._query)
  this._params = Object.assign({}, this.route._params)
  this._headers = Object.assign({}, this.route._headers)
  this._cookies = Object.assign({}, this.route._cookies)
  this._body = Object.assign({}, this.route._body)
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
