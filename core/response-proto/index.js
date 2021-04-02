const cookie = require('cookie')
const ResponseBase = require('./response-base')

const Response = function (args) {
  ResponseBase.call(this, args)
}

Response.prototype = Object.create(ResponseBase.prototype)
Response.prototype.constructor = Response

Object.defineProperty(Response.prototype, '_serializers', {
  get: function () {
    return this.route._serializers
  }
})
Response.prototype.set = function (key, value) {
  const type = typeof key
  const isObject = (type === 'function' || (type === 'object' && !!key))
  if (isObject) {
    this.setHeaders(key)
  } else if (!!key && !!value) {
    this.setHeader(key, value)
  } else {
    throw new Error('Invalid parameters')
  }
  return this
}

Response.prototype.append = function (key, value) {
  return this.set(key, value)
}

Response.prototype.header = function (key, value) {
  return this.set(key, value)
}

Response.prototype.getHeader = function (key) {
  return this._headers.get(key)
}

Response.prototype.setHeader = function (key, value) {
  this._headers.set(key, value)
  return this
}

Response.prototype.removeHeader = function (key) {
  this._headers.delete(key)
}

Response.prototype.setHeaders = function (headers) {
  for (const header in headers) {
    const headerValue = this._headers.get(header)
    if (headerValue !== undefined || headerValue !== null) {
      continue
    }
    this.setHeader(header, headers[header])
  }
  return this
}

Response.prototype.hasHeader = function (key) {
  return this._headers.has(key)
}

Response.prototype.setCookie = function (name, value, options) {
  if (options.expires && Number.isInteger(options.expires)) {
    options.expires = new Date(options.expires)
  }
  const serialized = cookie.serialize(name, value, options)

  let setCookie = this.getHeader('Set-Cookie')

  if (!setCookie) {
    this.setHeader('Set-Cookie', serialized)
    return this
  }

  if (typeof setCookie === 'string') {
    setCookie = [setCookie]
  }

  setCookie.push(serialized)

  this.removeHeader('Set-Cookie')
  this.setHeader('Set-Cookie', setCookie)
  return this
}

Response.prototype.cookie = function (name, value, options) {
  return this.setCookie(name, value, options)
}

Response.prototype.removeCookie = function (name, options = {}) {
  const currTime = Date.now()
  if (!options.expires || options.expires >= currTime) {
    options.expires = currTime - 1000
  }
  this.setCookie(name, '', options)
  return this
}

Response.prototype.clearCookie = function (name, options = {}) {
  return this.removeCookie(name, options)
}

Response.prototype.clearCookie = function (name, options = {}) {
  return this.removeCookie(name, options)
}

Response.prototype.hasCookie = function (name) {
  return this._cookies[name] !== null && this._cookies[name] !== undefined
}

Response.prototype.type = function (contentType) {
  this.setHeader('Content-Type', contentType)
  return this
}

Response.prototype.type = function (contentType) {
  this.setHeader('Content-Type', contentType)
  return this
}

Object.defineProperty(Response.prototype, 'serialize', {
  get: function () {
    const status = this._status
    if (typeof this._serializers === 'function') {
      return this._serializers
    }
    if (typeof this._serializers[status] === 'function') {
      return this._serializers[status]
    }
    if (typeof this._serializers[`${status[0]}${status[1]}X`] === 'function') {
      return this._serializers[`${status[0]}${status[1]}X`]
    }
    if (typeof this._serializers[`${status[0]}XX`] === 'function') {
      return this._serializers[`${status[0]}XX`]
    }
    if (typeof this._serializers.XXX === 'function') {
      return this._serializers.XXX
    }
    return JSON.stringify
  }
})

Response.prototype.send = function (body) {
  const self = this
  let result = body
  if (!result) {
    result = ''
  } else if (typeof result === 'object') {
    result = this.serialize(result)
  }

  this.cork(() => {
    self.setHeader('Content-Type', 'application/json; charset=utf-8')
    // TODO: move this out into a plugin
    // self.setHeader('Access-Control-Allow-Origin', '*')
    self.end(result)
  })
}

Response.prototype.pipe = function (stream, size, compressed = false) {
  const self = this
  this.stream = true

  if (compressed) {
    const compressedStream = this.compress(stream, this._headers)

    if (compressedStream) {
      stream = compressedStream
    }
  }

  this.onAborted(() => {
    if (stream) {
      stream.destroy()
    }
    if (stream) {
      stream.destroy()
    }
    self._isDone = true
  })

  if (compressed || !size) {
    stream.on('data', (buffer) => {
      if (self._isDone) {
        stream.destroy()
        return
      }
      this.write(
        buffer.buffer.slice(
          buffer.byteOffset,
          buffer.byteOffset + buffer.byteLength
        )
      )
    })
  } else {
    stream.on('data', (buffer) => {
      if (self._isDone) {
        stream.destroy()
        return
      }
      buffer = buffer.buffer.slice(
        buffer.byteOffset,
        buffer.byteOffset + buffer.byteLength
      )
      const lastOffset = this.getWriteOffset()

      // First try
      const [ok, done] = this.tryEnd(buffer, size)

      if (done) {
        stream.destroy()
      } else if (!ok) {
        // pause because backpressure
        stream.pause()

        // Register async handlers for drainage
        this.onWritable((offset) => {
          const [writeOk, writeDone] = this.tryEnd(
            buffer.slice(offset - lastOffset),
            size
          )
          if (writeDone) {
            stream.end()
          } else if (writeOk) {
            stream.resume()
          }
          return writeOk
        })
      }
    })
  }
  stream
    .on('error', () => {
      this.stream = -1
      if (!self._isDone) {
        this.writeStatus('500 Internal server error')
        this.end()
      }
      stream.destroy()
    })
    .on('end', () => {
      this.stream = 1
      if (!self._isDone) {
        this.end()
      }
    })

  return this
}

module.exports = Response
