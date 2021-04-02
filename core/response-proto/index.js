/*
  Wrapper around uWebSockets.js HttpResponse
*/
const Response = function (args) {
  const self = this

  this.route = args.route
  this.req = args.req
  this.res = args.res

  this._headers = new Map()
  this._cookies = new Map()
  this._status = '200'
  this._statusRaw = 200
  this._isDone = false

  if (this.route.isAsync) {
    this.onAborted(() => {
      self._isDone = true
    })
  }
}

require('./response-base')(Response)
require('./response-properties')(Response)
require('./response-methods')(Response)

module.exports = Response
