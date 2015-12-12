const Account = require('mongoose').model('Account')

export default () => {
  return async (req, res, next) => {
    req.currentAccount = await Account.findOne({})

    if (!req.currentAccount) {
      req.currentAccount = null
    }

    next()
  }
}
