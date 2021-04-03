const parse = require('querystring').parse

const define = (Request) => {
  Object.defineProperty(Request.prototype, 'query', {
    get: function () {
      if (!this._query) {
        const qs = this.req.getQuery()
        if (qs) {
          const query = parse(qs)
          if (this.route && this.route.schema && this.route.schema.query) {
            this._query = {}
            const { properties } = this.route.schema.query.valueOf()
            for (const property in properties) {
              this._query[property] = query[property]
            }
          } else {
            this._query = query
          }
        }
      }
      return this._query
    }
  })
}


module.exports = define
