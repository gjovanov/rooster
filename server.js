
const port = 2999
const App = require('./core/app')
const routes = require('./routes')

const appConfig = {
  // TODO: add config like host, certs etc
}
const app = new App(appConfig, routes)
app.server.listen(port, (token) => {
  if (token) {
    console.log('Listening to port ' + port)
  } else {
    console.log('Failed to listen to port ' + port)
  }
})
