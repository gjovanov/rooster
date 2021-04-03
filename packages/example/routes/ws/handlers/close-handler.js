const disconnectHandler = require('./disconnect-handler')

module.exports = (route) => (ws) => {
  if (!ws.connectionContext) return
  ws.done = true
  try {
    disconnectHandler(route)(ws.connectionContext)
  } catch (e) {
    // TODO: add error logging
  }
}
