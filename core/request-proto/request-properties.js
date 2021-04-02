const defineProperties = (Request) => {
  Object.defineProperty(Request.prototype, 'logger', {
    get: function () {
      return this.route.logger
    }
  })
  Object.defineProperty(Request.prototype, 'hostname', {
    get: function () {
      if (!this._hostname) {
        const host = this.getHeader('Host')
        this._hostname = this.ips.length ? this.ips[0] : host
      }
      return this._hostname
    }
  })
  Object.defineProperty(Request.prototype, 'baseUrl', {
    get: function () {
      return this.route.url // TODO: consider middleware baseUrl
    }
  })
  Object.defineProperty(Request.prototype, 'path', {
    get: function () {
      return this.route.url // TODO: consider middleware path
    }
  })
  Object.defineProperty(Request.prototype, 'originalUrl', {
    get: function () {
      if (!this._originalUrl) {
        this._originalUrl = this.getUrl()
      }
      return this._originalUrl
    }
  })
  Object.defineProperty(Request.prototype, 'protocol', {
    get: function () {
      return this.route.protocol
    }
  })
  Object.defineProperty(Request.prototype, 'secure', {
    get: function () {
      return this.protocol === 'https'
    }
  })
  Object.defineProperty(Request.prototype, 'ip', {
    get: function () {
      if (!this._ip) {
        this._ip = Buffer.from(this.res.getRemoteAddressAsText()).toString()
      }
      return this._ip
    }
  })
  Object.defineProperty(Request.prototype, 'ips', {
    get: function () {
      if (!this._ips) {
        const forwaredFor = this.getHeader('X-Forwarded-For')
        let ips = []
        if (forwaredFor) {
          ips = forwaredFor.split(',').map(i => i.trim())
        }
        this._ips = ips
      }
      return this._ips
    }
  })
  Object.defineProperty(Request.prototype, 'method', {
    get: function () {
      return this.route.method
    }
  })
  Object.defineProperty(Request.prototype, 'body', {
    get: function () {
      const self = this
      if (!this._body) {
        this._body = (async () => {
          try {
            return await self.getBody()
          } catch (e) {
            return {} // fallback value
          }
        })()
      }
      return this._body
    }
  })
}

module.exports = defineProperties


