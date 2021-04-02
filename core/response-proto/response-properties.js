const defineProperties = (Response) => {
  Object.defineProperty(Response.prototype, 'logger', {
    get: function () {
      return this.route.logger
    }
  })
  Object.defineProperty(Response.prototype, '_serializers', {
    get: function () {
      return this.route._serializers
    }
  })
  Object.defineProperty(Response.prototype, 'serialize', {
    get: function () {
      const status = this._status
      if (typeof this._serializers === 'function') {
        return this._serializers
      }
      if (typeof this._serializers[status] === 'function') {
        return this._serializers[status]
      }
      if (typeof this._serializers[`${status[0]}${status[1]}X`] === 'function') {
        return this._serializers[`${status[0]}${status[1]}X`]
      }
      if (typeof this._serializers[`${status[0]}XX`] === 'function') {
        return this._serializers[`${status[0]}XX`]
      }
      if (typeof this._serializers.XXX === 'function') {
        return this._serializers.XXX
      }
      return JSON.stringify
    }
  })
}


module.exports = defineProperties
