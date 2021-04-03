const define = (Request) => {
  Request.prototype.forEach = function (cb) {
    return this.req.forEach(cb)
  }
  Request.prototype.getHeader = function (lowerCaseKey) {
    return this.req.getHeader(lowerCaseKey)
  }
  Request.prototype.getMethod = function () {
    return this.req.getMethod()
  }
  Request.prototype.getParameter = function (index) {
    return this.req.getParameter(index)
  }
  Request.prototype.getQuery = function () {
    return this.req.getQuery()
  }
  Request.prototype.getUrl = function () {
    return this.req.getUrl()
  }
  Request.prototype.setYield = function (yieldValue) {
    return this.req.setYield(yieldValue)
  }
}

module.exports = define


