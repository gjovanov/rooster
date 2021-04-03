const KeepAliveHandler = require('./keep-alive-handler')
const PONG = 65
const isPong = (message) => message.byteLength === 1 && Buffer.from(message)[0] === PONG

const handleMessage = (websocket, message) => {
  const { connectionContext } = websocket
  if (isPong(message)) {
    KeepAliveHandler(connectionContext)
    return
  }
  let parsedMessage
  try {
    parsedMessage = JSON.parse(Buffer.from(message).toString())
    console.log(parsedMessage)
  } catch (e) {
    // ignore the message
    return
  }

  // TODO: Handler message
  return ''
}

const messageHandler = (websocket, message) => {
  try {
    handleMessage(websocket, message)
  } catch (e) {
    // TODO: Log error
  }
}
module.exports = messageHandler
