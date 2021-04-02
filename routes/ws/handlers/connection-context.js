const { nanoid } = require('nanoid')

class ConnectionContext {
  constructor (socket, authToken, ip) {
    const prefix = 'ws'
    this.id = `${prefix}_${nanoid()}`
    this.ip = ip
    this.authToken = authToken
    this.socket = socket
    this.isAlive = true
    this.keepAliveInterval = null
    this.done = false
  }
}

module.exports = ConnectionContext
