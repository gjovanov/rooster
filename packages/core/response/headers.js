
const define = (Response) => {
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

  Response.prototype.type = function (contentType) {
    this.setHeader('Content-Type', contentType)
    return this
  }
}


module.exports = define
