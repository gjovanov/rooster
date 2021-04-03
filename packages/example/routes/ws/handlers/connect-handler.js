
module.exports = (route) =>
  async (connectionContext) => {
    const { authToken } = connectionContext
    // TODO: store in the DB, refresh token if needed
    return authToken
  }
