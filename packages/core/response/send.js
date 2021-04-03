
const define = (Response) => {
  Response.prototype.send = function (body) {
    const self = this
    let result = body
    if (!result) {
      result = ''
    } else if (typeof result === 'object') {
      result = this.serialize(result)
    }

    this.cork(() => {
      self.setHeader('Content-Type', 'application/json; charset=utf-8')
      // TODO: move this out into a plugin
      // self.setHeader('Access-Control-Allow-Origin', '*')
      self.end(result)
    })
  }
}

module.exports = define
