const qs = require('qs')

const define = (Request) => {
  Object.defineProperty(Request.prototype, 'body', {
    get: async function () {
      if (!(this._flags & 16)) {
        const body = await (async () => {
          try {
            const contentType = this.req.getHeader('content-type')
            const buffer = await this.getBodyBuffer()
            const result = this.parse(contentType, buffer)
            return result
          } catch (e) {
            return {} // fallback value
          }
        })()
        if (this._body) {
          // TODO: cover nested
          for (const prop in this._body) {
            this._body[prop] = body[prop]
          }
        } else {
          this._body = body
        }
        this._flags |= 16
      }
      return this._body
    }
  })

  Request.prototype.getBodyBuffer = async function () {
    const self = this
    if (!this._bodyBuffer) {
      return new Promise((resolve) => {
        let buffer
        if (self.res.onData) {
          self.res.onData((ab, isLast) => {
            const curBuf = Buffer.from(ab)
            buffer = buffer ? Buffer.concat([buffer, curBuf]) : isLast ? curBuf : Buffer.concat([curBuf])
            if (isLast) {
              try {
                self._bodyBuffer = buffer
                resolve(self._bodyBuffer)
              } catch (e) {
                resolve(null)
              }
            }
          })
        } else {
          resolve(null)
        }
      })
    }
    return this._bodyBuffer
  }


  Request.prototype.parse = async function (contentType, buffer) {
    if (contentType.startsWith('application/json') || contentType === 'text/json') {
      return this.getBodyJson(buffer)
    }
    if (contentType.startsWith('multipart/')) {
      return this.getBodyParts(buffer, contentType)
    }
    if (contentType === 'application/x-www-form-urlencoded') {
      return this.getBodyUrlEncoded(buffer)
    }
    if (contentType.startsWith('text/')) {
      return this.getBodyText(buffer)
    }
  }

  Request.prototype.getBodyJson = function (buffer) {
    const parse = this._parsers.body
    const data = parse(buffer)
    return data
  }

  Request.prototype.getBodyParts = function (buffer, contentType) {
    const self = this
    const data =
    Object.fromEntries(this.route.app.uws
      .getParts(buffer, contentType)
      .map(part => {
        if (part.filename) {
          return [part.name, part]
        } else if (part.type) {
          return [part.name, self.parse(part.type, Buffer.from(part.data))]
        }
        return [part.name, Buffer.from(part.data).toString()]
      }))

    return data
  }

  Request.prototype.getBodyUrlEncoded = function (buffer) {
    return qs.parse(buffer.toString())
  }
  Request.prototype.getBodyText = function (buffer) {
    return buffer.toString()
  }
}


module.exports = define
