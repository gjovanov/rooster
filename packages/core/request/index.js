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
  this._bodyBuffer = null
  this._body = null
  this._headers = null
  this._cookies = null
  this._query = null
  this._params = null
}

require('./base')(Request)
require('./meta')(Request)
require('./query')(Request)
require('./body')(Request)
require('./params')(Request)
require('./headers')(Request)
require('./cookies')(Request)

module.exports = Request
