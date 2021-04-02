/*
  Wrapper around uWebSockets.js HttpResponse
*/
const ResponseBase = function (args) {
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

Object.defineProperty(ResponseBase.prototype, 'logger', {
  get: function () {
    return this.route.logger
  }
})
ResponseBase.prototype.getProxiedRemoteAddress = function () {
  return this.res.getProxiedRemoteAddress()
}
ResponseBase.prototype.getRemoteAddress = function () {
  return this.res.getRemoteAddress()
}
ResponseBase.prototype.getWriteOffset = function () {
  return this.res.getWriteOffset()
}
ResponseBase.prototype.close = function () {
  if (!this._isDone) {
    this._isDone = true
    return this.res.close()
  }
  this.logger.debug('uWs debugging: "close" aborted ')
  return this
}
ResponseBase.prototype.cork = function (cb) {
  if (!this._isDone) {
    return this.res.cork(cb)
  }
  this.logger.debug('uWs debugging: "cork" aborted ')
  return this
}
ResponseBase.prototype.end = function (body) {
  if (!this._isDone) {
    this.writeStatus(this._status)
  }
  if (!this._isDone) {
    this.writeHeaders()
  }
  if (!this._isDone) {
    this._isDone = true
    return this.res.end(body)
  }
  this.logger.debug('uWs debugging: "end" aborted ')
  return this
}
ResponseBase.prototype.onAborted = function (handler) {
  this.res.onAborted(handler)
  return this
}
ResponseBase.prototype.onData = function (handler) {
  if (!this._isDone) {
    return this.onData(handler)
  }
  this.logger.debug('uWs debugging: "onData" aborted ')
  return this
}
ResponseBase.prototype.onWritable = function (handler) {
  if (!this._isDone) {
    return this.res.onWritable(handler)
  }
  this.logger.debug('uWs debugging: "onWritable" aborted ')
  return this
}
ResponseBase.prototype.tryEnd = function (fullBodyOrChunk, totalSize) {
  if (!this._isDone) {
    return this.res.tryEnd(fullBodyOrChunk, totalSize)
  }
  this.logger.debug('uWs debugging: "tryEnd" aborted ')
  return [true, true]
}
ResponseBase.prototype.upgrade = function (userData, secWebSocketKey, secWebSocketProtocol, secWebSocketExtensions, context) {
  if (!this._isDone) {
    return this.res.upgrade(userData, secWebSocketKey, secWebSocketProtocol, secWebSocketExtensions, context)
  }
  this.logger.debug('uWs debugging: "upgrade" aborted ')
  return this
}
ResponseBase.prototype.write = function (chunk) {
  if (!this._isDone) {
    return this.res.write(chunk)
  }
  this.logger.debug('uWs debugging: "write" aborted ')
  return this
}
ResponseBase.prototype.writeHeader = function (key, value) {
  if (!this._isDone) {
    return this.res.writeHeader(key, value)
  }
  this.logger.debug('uWs debugging: "writeHeader" aborted ')
  return this
}
ResponseBase.prototype.writeStatus = function (status) {
  if (!this._isDone) {
    return this.res.writeStatus(status)
  }
  this.logger.debug('uWs debugging: "writeStatus" aborted ')
  return this
}
ResponseBase.prototype.writeHeaderValues = function (header, values) {
  for (let i = 0, len = values.length; i < len; i += 1) {
    if (!this._isDone) {
      this.res.writeHeader(header, `${values[i]}`)
    }
  }
  return this
}
ResponseBase.prototype.writeHeaders = function () {
  for (const [header, value] of this._headers) {
    if (value) {
      if (!this._isDone) {
        if (value.splice) {
          this.writeHeaderValues(header, value)
        } else {
          this.res.writeHeader(header, `${value}`)
        }
      }
    }
  }
  return this
}

module.exports = ResponseBase
