/*
  Wrapper around uWebSockets.js HttpRequest
*/
class RequestBase {
  constructor (args) {
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

  get logger () {
    return this.route.logger
  }

  init (res, req) {
    this.res = res
    this.req = req
  }

  forEach (cb) {
    return this.req.forEach(cb)
  }

  getHeader (lowerCaseKey) {
    return this.req.getHeader(lowerCaseKey)
  }

  getMethod () {
    return this.req.getMethod()
  }

  getParameter (index) {
    this.req.getParameter(index)
  }

  getQuery () {
    return this.req.getQuery()
  }

  getUrl () {
    return this.req.getUrl()
  }

  setYield (yieldValue) {
    return this.req.setYield(yieldValue)
  }
}

module.exports = RequestBase
