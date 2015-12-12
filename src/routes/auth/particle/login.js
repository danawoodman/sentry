import spark from 'spark'

const debug = require('debug')('sentry:routes:auth:particle:login')

export default async (req, res) => {
  console.log(req.body)
  const username = req.body.username
  const password = req.body.password

  if (!username || !password) {
    req.flash('danger', 'Your Particle username or password are missing.')
    return res.redirect('/devices')
  }

  try {

    const { access_token } = await spark.login({ username, password })

    debug('particle token', access_token)

    await req.currentAccount.update({ particleAccessToken: access_token })

    req.flash('success', 'You are logged into Particle!')
    res.redirect('/devices')

  } catch(e) {
    if (e.message === 'invalid_grant') {
      req.flash('danger', 'Your login information is invalid, please try again.')
      return res.redirect('/devices')
    }

    throw e
  }
}
