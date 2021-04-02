
module.exports = (route) => (connectionContext, options = {}) => {
  const { exitCode = 1000, reason } = options
  const { keepAliveInterval, socket } = connectionContext
  clearInterval(keepAliveInterval)
  socket.end(exitCode, reason)
}
