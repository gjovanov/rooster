const S = require('fluent-json-schema')

const query = S.object()
  .prop('first', S.string())

const queryResponse = S.object()
  .prop('first', S.string())
  .prop('second', S.string())

const paramsResponse = S.object()
  .prop('first', S.string())
  .prop('second', S.string())

const headers = S.object()
  .prop('content-type', S.string())

const headersResponse = S.object()
  .prop('content-type', S.string())
  .prop('authorization', S.string())

const cookiesResponse = S.object()
  .prop('first', S.string())
  .prop('second', S.string())

const bodyResponse = S.object()
  .prop('first', S.string())
  .prop('second', S.string())

module.exports = {
  query: {
    query,
    response: queryResponse
  },
  params: {
    response: paramsResponse
  },
  headers: {
    headers,
    response: headersResponse
  },
  cookies: {
    response: cookiesResponse
  },
  body: {
    response: bodyResponse
  }
}
