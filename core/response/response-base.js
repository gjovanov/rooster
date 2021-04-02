/*
  Wrapper around uWebSockets.js HttpResponse
*/
class ResponseBase {
  constructor (args) {
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

  get logger () {
    return this.route.logger
  }

  getProxiedRemoteAddress () {
    return this.res.getProxiedRemoteAddress()
  }

  getRemoteAddress () {
    return this.res.getRemoteAddress()
  }

  getWriteOffset () {
    return this.res.getWriteOffset()
  }

  close () {
    if (!this._isDone) {
      this._isDone = true
      return this.res.close()
    }
    this.logger.debug('uWs debugging: "close" aborted ')
    return this
  }

  cork (cb) {
    if (!this._isDone) {
      return this.res.cork(cb)
    }
    this.logger.debug('uWs debugging: "cork" aborted ')
    return this
  }

  end (body) {
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

  onAborted (handler) {
    this.res.onAborted(handler)
    return this
  }

  onData (handler) {
    if (!this._isDone) {
      return this.onData(handler)
    }
    this.logger.debug('uWs debugging: "onData" aborted ')
    return this
  }

  onWritable (handler) {
    if (!this._isDone) {
      return this.res.onWritable(handler)
    }
    this.logger.debug('uWs debugging: "onWritable" aborted ')
    return this
  }

  tryEnd (fullBodyOrChunk, totalSize) {
    if (!this._isDone) {
      return this.res.tryEnd(fullBodyOrChunk, totalSize)
    }
    this.logger.debug('uWs debugging: "tryEnd" aborted ')
    return [true, true]
  }

  upgrade (userData, secWebSocketKey, secWebSocketProtocol, secWebSocketExtensions, context) {
    if (!this._isDone) {
      return this.res.upgrade(userData, secWebSocketKey, secWebSocketProtocol, secWebSocketExtensions, context)
    }
    this.logger.debug('uWs debugging: "upgrade" aborted ')
    return this
  }

  write (chunk) {
    if (!this._isDone) {
      return this.res.write(chunk)
    }
    this.logger.debug('uWs debugging: "write" aborted ')
    return this
  }

  writeHeader (key, value) {
    if (!this._isDone) {
      return this.res.writeHeader(key, value)
    }
    this.logger.debug('uWs debugging: "writeHeader" aborted ')
    return this
  }

  writeStatus (status) {
    if (!this._isDone) {
      return this.res.writeStatus(status)
    }
    this.logger.debug('uWs debugging: "writeStatus" aborted ')
    return this
  }

  writeHeaderValues (header, values) {
    for (let i = 0, len = values.length; i < len; i += 1) {
      if (!this._isDone) {
        this.res.writeHeader(header, `${values[i]}`)
      }
    }
    return this
  }

  writeHeaders () {
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

module.exports = ResponseBase
