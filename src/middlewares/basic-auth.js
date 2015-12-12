import basicAuth from 'basic-auth'

function unauthorized(res) {
  res.set('WWW-Authenticate', 'Basic realm=Authorization Required')
  return res.sendStatus(401)
}

export default (username, password) => {
  return (req, res, next) => {
    const user = basicAuth(req)

    if (!user || !user.name || !user.pass) {
      return unauthorized(res)
    }

    if (user.name === username && user.pass === password) {
      return next()
    } else {
      return unauthorized(res)
    }
  }
}
