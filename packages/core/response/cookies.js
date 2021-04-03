const cookie = require('cookie')

const define = (Response) => {
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
    return this._cookies && this._cookies[name] !== undefined
  }
}


module.exports = define
