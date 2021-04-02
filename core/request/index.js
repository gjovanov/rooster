const parse = require('querystring').parse
const cookie = require('cookie')
const RequestBase = require('./request-base')


class Request extends RequestBase {
  get hostname () {
    if (!this._hostname) {
      const host = this.getHeader('Host')
      this._hostname = this.ips.length ? this.ips[0] : host
    }
    return this._hostname
  }

  get baseUrl () {
    return this.route.url // TODO: consider middleware baseUrl
  }

  get path () {
    return this.route.url // TODO: consider middleware path
  }

  get originalUrl () {
    if (!this._originalUrl) {
      this._originalUrl = this.getUrl()
    }
    return this._originalUrl
  }

  get protocol () {
    return this.route.protocol
  }

  get secure () {
    return this.protocol === 'https'
  }

  get ip () {
    if (!this._ip) {
      this._ip = Buffer.from(this.res.getRemoteAddressAsText()).toString()
    }
    return this._ip
  }

  get ips () {
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

  get method () {
    return this.route.method
  }

  get body () {
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

  async getBody () {
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

  get headers () {
    if (!this._headers) {
      this._headers = this.getHeaders()
    }
    return this._headers
  }

  get (field) {
    return this.headers[field]
  }

  header (field) {
    return this.headers(field)
  }

  getHeaders () {
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

  get query () {
    if (!this._query) {
      this._query = this.getQuery()
    }
    return this._query
  }

  getQuery () {
    let queries = this.query
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
      this.query = queries
    }

    return queries
  }

  get params () {
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

  param (name, defaultValue) {
    return this.params[name] || defaultValue
  }

  getCookies () {
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

  hasCookie (name) {
    return this._cookies && this._cookies[name] !== undefined
  }
}

module.exports = Request
