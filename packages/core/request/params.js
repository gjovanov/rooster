
const define = (Request) => {
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
}


module.exports = define
