const schema = require('./ping-schema')

module.exports = [
  {
    method: 'GET',
    url: '/api/ping',
    schema: schema.ping,
    handler: require('./handlers/ping-handler')
  }
]
