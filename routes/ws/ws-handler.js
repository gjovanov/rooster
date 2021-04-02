const uws = require('uWebSockets.js')
const SHARED_COMPRESSOR = uws.SHARED_COMPRESSOR

class WsHandler {
  constructor () {
    this.compression = SHARED_COMPRESSOR
    this.idleTimeout = 0
    this.maxPayloadLength = 5 * 2 ** 20
    this.upgrade = require('./handlers/upgrade-handler')
    this.open = require('./handlers/open-handler')
    this.message = require('./handlers/message-handler')
    this.close = require('./handlers/close-handler')
  }

  init (route) {

  }
}

module.exports = new WsHandler()
