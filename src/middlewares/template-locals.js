import * as config from '../config/config'

export default () => {
  return (req, res, next) => {
    if (!res.locals) { res.locals = {} }
    res.locals.currentAccount = req.currentAccount
    res.locals.moment = require('moment')
    res.locals.config = config
    next()
  }
}
