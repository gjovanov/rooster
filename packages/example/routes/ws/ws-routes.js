
module.exports = [
  {
    method: 'ws',
    url: '/*',
    handler: require('./ws-handler')
  }
]
