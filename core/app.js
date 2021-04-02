const uws = require('uWebSockets.js')
const Route = require('./route')

const defaultConfig = {
  logger: {
    trace () {},
    debug () {},
    info () {},
    warn () {},
    error () {},
    fatal () {}
  }
}

class App {
  constructor (config = defaultConfig, routes = []) {
    const self = this

    this.uws = uws
    this.config = config
    this.protocol = config && config.key_file_name && config.cert_file_name ? 'https' : 'http'
    this.server = this.protocol === 'https' ? uws.SSLApp(config) : uws.App()
    this.routes = []
    this.logger = config.logger

    if (routes && routes.length) {
      routes.forEach(route => {
        self.use(new Route(route, config.logger))
      })
    }
  }

  use (route) {
    if (!route.method || !route.url || !route.handler) {
      throw new Error('Route must have method, url and handler defined!')
    }
    this.routes.push(route)
    this.server[route.method.toLowerCase()](route.url, route.getHandler())
  }
}

module.exports = App
