
const define = (Request) => {
  Object.defineProperty(Request.prototype, 'params', {
    get: function () {
      if (!(this._flags & 2)) {
        if (this.route && this.route.params) {
          // read all route param values
          const params = Object.assign(this.route.params)
          let i = 0
          for (const param in this.route.params) {
            params[param] = this.req.getParameter(i++)
          }

          // if we have a params schema, map accordingly, otherwise take the all param values
          if (this._params) {
            for (const param in this._params) {
              this._params[param] = params[param]
            }
          } else {
            this._params = params
          }
        } else {
          this._params = {}
        }
        this._flags |= 2
      }
      return this._params
    }
  })
  Request.prototype.param = function (name, defaultValue) {
    return this._params[name] || defaultValue
  }
}


module.exports = define
