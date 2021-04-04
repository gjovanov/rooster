module.exports = (res, req) => {
  const { params } = req
  res.send(params)
}
