const schema = require('./test-schema')

module.exports = [
  {
    method: 'GET',
    url: '/api/test/query',
    schema: schema.query,
    handler: require('./handlers/query-handler')
  },
  {
    method: 'GET',
    url: '/api/test/params/:first/:second',
    schema: schema.params,
    handler: require('./handlers/params-handler')
  },
  {
    method: 'GET',
    url: '/api/test/headers',
    schema: schema.headers,
    handler: require('./handlers/headers-handler')
  },
  {
    method: 'GET',
    url: '/api/test/cookies',
    schema: schema.cookies,
    handler: require('./handlers/cookies-handler')
  },
  {
    method: 'POST',
    url: '/api/test/body',
    schema: schema.body,
    handler: require('./handlers/body-handler')
  }
]
