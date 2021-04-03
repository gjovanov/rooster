const PARAMS_REGEX = /:([A-Za-z0-9_-]+)/g

module.exports = {
  methods: [
    'get',
    'post',
    'put',
    'patch',
    'del',
    'any',
    'head',
    'options',
    'trace'
  ],
  getParamNames: (url) => {
    if (url.indexOf(':') !== -1) {
      const paramsArray = url.match(PARAMS_REGEX)
      if (paramsArray) {
        const params = new Map(paramsArray.map((name) => [name.substr(1), null]))
        const result = Object.fromEntries(params)
        return result
      }
    }
    return null
  },
  isHttpCode: (code) => {
    const codeInteger = +code
    if (
      typeof codeInteger === 'number' &&
      codeInteger > 100 &&
      codeInteger < 600
    ) {
      return 1
    }
    if (
      typeof code === 'string' &&
      code.length === 3 &&
      code.indexOf('X') !== -1
    ) {
      return 2
    }
    return 0
  }
}
