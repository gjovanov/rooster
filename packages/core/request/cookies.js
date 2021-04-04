const cookie = require('cookie')

const define = (Request) => {
  Object.defineProperty(Request.prototype, 'cookies', {
    get: function () {
      if (!(this._flags & 8)) {
        const cookieHeader = this.req.getHeader('cookie')
        if (cookieHeader) {
          const cookies = cookie.parse(cookieHeader)
          if (this._cookies) {
            for (const name in this._cookies) {
              this._cookies[name] = cookies[name]
            }
          } else {
            this._cookies = cookies
          }
        } else {
          this._cookies = {}
        }
        this._flags |= 8
      }
      return this._cookies
    }
  })
  Request.prototype.hasCookie = function (name) {
    return this.cookies && this.cookies[name] !== undefined && this.cookies[name] !== null
  }
}


module.exports = define
