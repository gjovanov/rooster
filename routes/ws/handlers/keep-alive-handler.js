const disconnectHandler = require('./disconnect-handler')
const PING = new Uint8Array([57])

module.exports = (route) => (connectionContext) => {
  console.log(`SERVER: KEEP ALIVE - ${new Date()}`)
  connectionContext.isAlive = true
  clearInterval(connectionContext.keepAliveInterval)

  connectionContext.keepAliveInterval = setInterval(() => {
    if (connectionContext.isAlive === false) {
      disconnectHandler(route)(connectionContext)
    } else {
      connectionContext.isAlive = false
    }
    const { socket } = connectionContext
    if (!socket.done) {
      socket.send(PING, true)
    }
  }, route.config.ws.keepAlive)
}
