
const define = (Request) => {
  Object.defineProperty(Request.prototype, 'headers', {
    get: function () {
      if (!this._headers) {
        this._headers = this.getHeaders()
      }
      return this._headers
    }
  })
  Request.prototype.getHeaders = function (field) {
    if (!this._headers) {
      this._headers = {}
      if (this.route && this.route.schema && this.route.schema.headers) {
        const { properties } = this.route.schema.headers.valueOf()
        for (const property in properties) {
          this._headers[property] = this.req.getHeader(property)
        }
      } else {
        this.req.forEach((key, value) => {
          this._headers[key] = value
        })
      }
    }

    return this._headers
  }
  Request.prototype.get = function (field) {
    return this.headers[field]
  }
  Request.prototype.header = function (field) {
    return this.headers[field]
  }
}


module.exports = define
