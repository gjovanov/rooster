module.exports = (res, req) => {
  const { headers } = req
  res.send(headers)
}
