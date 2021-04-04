module.exports = (res, req) => {
  const { query } = req
  res.send(query)
}
