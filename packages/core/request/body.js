
const define = (Request) => {
  Object.defineProperty(Request.prototype, 'body', {
    get: async function () {
      if (!this._body) {
        const body = await (async () => {
          try {
            const result = await this.getBodyJson()
            return result
          } catch (e) {
            return {} // fallback value
          }
        })()
        this._body = body
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

  Request.prototype.getBodyParts = async function () {
    const contentType = this.req.getHeader('content-type')
    const buffer = await this.getBodyBuffer()
    const data = this.route.app.uws.getParts(buffer, contentType)
    return data
  }

  Request.prototype.getBodyJson = async function () {
    const parse = this._parsers.body
    const buffer = await this.getBodyBuffer()
    const data = parse(buffer)
    return data
  }
}


module.exports = define
