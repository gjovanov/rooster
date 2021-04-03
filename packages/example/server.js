
const port = 2999
const host = '0.0.0.0'
const App = require('@roostr/core').App
const routes = require('./routes')

const run = async () => {
  const config = {
    host,
    port,
    routes
  }
  const app = new App(config)
  try {
    await app.listen()
    console.log(`Server is listening on: ${app.host}:${app.port}`)
  } catch (e) {
    console.error(e)
  }
}
run()


