const uws = require('uWebSockets.js')
const Route = require('./route')
const pino = require('pino')

class App {
  constructor (config = {}) {
    const self = this

    this.uws = uws
    this.getParts = uws.getParts
    this.config = config
    this.protocol = config && config.key_file_name && config.cert_file_name ? 'https' : 'http'
    this.host = config.host || '0.0.0.0'
    this.port = config.port || 2999
    this.server = this.protocol === 'https' ? uws.SSLApp(config) : uws.App()
    this.logger = config.logger || pino(config.loggerOptions || { level: 'info' }, config.loggerTransport)
    this.token = null // us_listen_socket
    this.routes = new Set()
    this.plugins = new Map() // TODO: implement plugins
    const routes = config.routes || []


    if (routes && routes.length) {
      routes.forEach(route => {
        self.route(new Route({
          app: self,
          route,
          logger: self.logger
        }))
      })
    }
  }

  route (route) {
    if (!route.method || !route.url || !route.handler) {
      throw new Error('Route must have method, url and handler defined!')
    }
    this.routes.add(route)
    const handler = route.isAsync ? route.getHandlerAsync() : route.getHandlerSync()
    this.server[route.method.toLowerCase()](route.url, handler)
  }

  listen (cb) {
    if (!cb) {
      return this.listenAsync()
    }
    this.server.listen(this.host, this.port, cb)
  }

  listenAsync () {
    const self = this
    return new Promise((resolve, reject) => {
      this.server.listen(self.host, self.port, (token) => {
        if (!token) {
          reject(new Error(`Server faild to start listening on: ${self.host}:${self.port}`))
        }
        self.token = token
        resolve(token)
      })
    })
  }
}

module.exports = App
