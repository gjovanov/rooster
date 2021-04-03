const authService = require('../../../services/auth/auth-service')

const upgradeHandler = async (res, req, context) => {
  const aborted = { done: false }
  const protocol = req.getHeader('sec-websocket-protocol')
  const authToken = authService.getQueryToken(req)
  if (!authService.isAuthenticated(authToken)) {
    res.writeStatus('401').end()
    return
  }
  res.onAborted(() => {
    aborted.done = true
  })

  const key = req.getHeader('sec-websocket-key')
  const extensions = req.getHeader('sec-websocket-extensions')
  const ip = authService.getIp(res, req)
  if (aborted.done) {
    return
  }
  res.upgrade({ ip, authToken }, key, protocol, extensions, context)
}

module.exports = upgradeHandler
