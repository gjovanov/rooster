const S = require('fluent-json-schema')

const pingResponse = S.object()
  .prop('result', S.string())

module.exports = {
  ping: {
    response: pingResponse
  }
}
