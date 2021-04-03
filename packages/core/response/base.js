const defineMethods = (Response) => {
  Response.prototype.getProxiedRemoteAddress = function () {
    return this.res.getProxiedRemoteAddress()
  }
  Response.prototype.getRemoteAddress = function () {
    return this.res.getRemoteAddress()
  }
  Response.prototype.getWriteOffset = function () {
    return this.res.getWriteOffset()
  }
  Response.prototype.close = function () {
    if (!this._isDone) {
      this._isDone = true
      return this.res.close()
    }
    this.logger.debug('uWs debugging: "close" aborted ')
    return this
  }
  Response.prototype.cork = function (cb) {
    if (!this._isDone) {
      return this.res.cork(cb)
    }
    this.logger.debug('uWs debugging: "cork" aborted ')
    return this
  }
  Response.prototype.end = function (body) {
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
  Response.prototype.onAborted = function (handler) {
    this.res.onAborted(handler)
    return this
  }
  Response.prototype.onData = function (handler) {
    if (!this._isDone) {
      return this.onData(handler)
    }
    this.logger.debug('uWs debugging: "onData" aborted ')
    return this
  }
  Response.prototype.onWritable = function (handler) {
    if (!this._isDone) {
      return this.res.onWritable(handler)
    }
    this.logger.debug('uWs debugging: "onWritable" aborted ')
    return this
  }
  Response.prototype.tryEnd = function (fullBodyOrChunk, totalSize) {
    if (!this._isDone) {
      return this.res.tryEnd(fullBodyOrChunk, totalSize)
    }
    this.logger.debug('uWs debugging: "tryEnd" aborted ')
    return [true, true]
  }
  Response.prototype.upgrade = function (userData, secWebSocketKey, secWebSocketProtocol, secWebSocketExtensions, context) {
    if (!this._isDone) {
      return this.res.upgrade(userData, secWebSocketKey, secWebSocketProtocol, secWebSocketExtensions, context)
    }
    this.logger.debug('uWs debugging: "upgrade" aborted ')
    return this
  }
  Response.prototype.write = function (chunk) {
    if (!this._isDone) {
      return this.res.write(chunk)
    }
    this.logger.debug('uWs debugging: "write" aborted ')
    return this
  }
  Response.prototype.writeHeader = function (key, value) {
    if (!this._isDone) {
      return this.res.writeHeader(key, value)
    }
    this.logger.debug('uWs debugging: "writeHeader" aborted ')
    return this
  }
  Response.prototype.writeStatus = function (status) {
    if (!this._isDone) {
      return this.res.writeStatus(status)
    }
    this.logger.debug('uWs debugging: "writeStatus" aborted ')
    return this
  }
  Response.prototype.writeHeaderValues = function (header, values) {
    for (let i = 0, len = values.length; i < len; i += 1) {
      if (!this._isDone) {
        this.res.writeHeader(header, `${values[i]}`)
      }
    }
    return this
  }
  Response.prototype.writeHeaders = function () {
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
}

module.exports = defineMethods
