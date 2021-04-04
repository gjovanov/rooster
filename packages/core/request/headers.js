
const define = (Request) => {
  Object.defineProperty(Request.prototype, 'headers', {
    get: function () {
      if (!(this._flags & 4)) {
        // if we have a query schema, map accordingly, otherwise take the whole query string
        if (this._headers) {
          for (const name in this._headers) {
            this._headers[name] = this.req.getHeader(name)
          }
        } else {
          const headers = new Map()
          this.req.forEach((key, value) => {
            headers.set(key, value)
          })
          this._headers = Object.fromEntries(headers.entries())
        }
        this._flags |= 4
      }
      return this._headers
    }
  })

  Request.prototype.get = function (field) {
    return this.headers[field]
  }
  Request.prototype.header = function (field) {
    return this.headers[field]
  }
}


module.exports = define
