const cookie = require('cookie')

const define = (Request) => {
  Object.defineProperty(Request.prototype, 'cookies', {
    get: function () {
      if (!this._cookies) {
        const headerCookie = this.req.getHeader('cookie')
        if (headerCookie) {
          const parsedCookie = cookie.parse(headerCookie)
          if (this.route.schema && this.route.schema.cookies) {
            const { properties } = this.route.schema.cookies
            for (const cookie in properties) {
              this._cookies[cookie] = parsedCookie[cookie]
            }
          } else {
            this._cookies = {}
            for (const cookie in parsedCookie) {
              this._cookies[cookie] = parsedCookie[cookie]
            }
          }
        }
      }
      return this._cookies
    }
  })
  Request.prototype.hasCookie = function (name) {
    return this._cookies && this._cookies[name] !== undefined
  }
}


module.exports = define
