module.exports = (res, req) => {
  const { cookies } = req
  res.send(cookies)
}
