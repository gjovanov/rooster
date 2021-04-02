const ConnectionContext = require('./connection-context')
const ConnectHandler = require('./connect-handler')
const KeepAliveHandler = require('./keep-alive-handler')

const openHandler = async (socket) => {
  const { authToken, ip } = socket
  const connectionContext = socket.connectionContext = new ConnectionContext(
    socket,
    authToken,
    ip
  )
  await ConnectHandler(connectionContext)
  KeepAliveHandler(connectionContext)
}

module.exports = openHandler
