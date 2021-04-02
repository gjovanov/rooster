const parse = require('querystring').parse
const cookie = require('cookie')

const defineMethods = (Request) => {
  Request.prototype.getBody = async function (key, value) {
    const self = this
    let body = this.body
    if (!body) {
      return new Promise((resolve) => {
        let buffer
        if (self.res.onData) {
          self.res.onData((ab, isLast) => {
            const curBuf = Buffer.from(ab)
            buffer = buffer ? Buffer.concat([buffer, curBuf]) : isLast ? curBuf : Buffer.concat([curBuf])
            if (isLast) {
              try {
                body = self.route.parse(buffer)
                resolve(body)
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
    return body
  }
  Object.defineProperty(Request.prototype, 'headers', {
    get: function () {
      if (!this._headers) {
        this._headers = this.getHeaders()
      }
      return this._headers
    }
  })
  Request.prototype.get = function (field) {
    return this._headers[field]
  }
  Request.prototype.header = function (field) {
    return this._headers[field]
  }
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
  Object.defineProperty(Request.prototype, 'query', {
    get: function () {
      if (!this._query) {
        this._query = this.getQuery()
      }
      return this._query
    }
  })
  Request.prototype.getQuery = function () {
    let queries = this._query
    if (!queries) {
      const query = this.req.getQuery()
      if (!query) {
        return queries
      }
      const parsed = parse(query)
      for (const item in parsed) {
        if (!queries) {
          queries = {}
        }
        queries[item] = parsed[item]
      }
      this._query = queries
    }
    return queries
  }
  Object.defineProperty(Request.prototype, 'params', {
    get: function () {
      if (!this._params) {
        if (this.route && this.route.params) {
          this._params = Object.assign(this.route.params)

          let i = 0
          for (const param in this.route.params) {
            this._params[param] = this.req.getParameter(i++)
          }
        }
      }
      return this._params
    }
  })
  Request.prototype.param = function (name, defaultValue) {
    return this._params[name] || defaultValue
  }
  Request.prototype.getCookies = function () {
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
          for (const cookie in parsedCookie) {
            this._cookies[cookie] = parsedCookie[cookie]
          }
        }
      }
    }
    return this._cookies
  }
  Request.prototype.hasCookie = function (name) {
    return this._cookies && this._cookies[name] !== undefined
  }
}

module.exports = defineMethods
