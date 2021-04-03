module.exports = async (res, req) => {
  const body = await req.body
  res.send(body)
}
