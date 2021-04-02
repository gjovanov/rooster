/*
  Wrapper around uWebSockets.js HttpRequest
*/
const RequestBase = function (args) {
  this.route = args.route
  this.schema = args.schema

  // this._id = null
  this.req = args.req // raw uWebSockets.js HttpRequest (to be initialized later)
  this.res = args.res // raw uWebSockets.js HttpResponse (to be initialized later)

  this._hostname = null
  this._ip = null
  this._ips = null
  this._originalUrl = null
  this._body = null
  this._headers = null
  this._cookies = null
  this._query = null
  this._params = null
}
Object.defineProperty(RequestBase.prototype, 'logger', {
  get: function () {
    return this.route.logger
  }
})
RequestBase.prototype.forEach = function (cb) {
  return this.req.forEach(cb)
}
RequestBase.prototype.getHeader = function (lowerCaseKey) {
  return this.req.getHeader(lowerCaseKey)
}
RequestBase.prototype.getMethod = function () {
  return this.req.getMethod()
}
RequestBase.prototype.getParameter = function (index) {
  return this.req.getParameter(index)
}
RequestBase.prototype.getQuery = function () {
  return this.req.getQuery()
}
RequestBase.prototype.getUrl = function () {
  return this.req.getUrl()
}
RequestBase.prototype.setYield = function (yieldValue) {
  return this.req.setYield(yieldValue)
}

module.exports = RequestBase
