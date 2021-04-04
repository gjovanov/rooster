const parse = require('querystring').parse

const define = (Request) => {
  Object.defineProperty(Request.prototype, 'query', {
    get: function () {
      if (!(this._flags & 1)) {
        const qs = this.req.getQuery()
        if (qs) {
          const query = parse(qs)

          // if we have a query schema, map accordingly, otherwise take the whole query string
          if (this._query) {
            for (const name in this._query) {
              this._query[name] = query[name]
            }
          } else {
            this._query = query
          }
        } else {
          this._query = {}
        }
        this._flags |= 1
      }
      return this._query
    }
  })
}


module.exports = define
