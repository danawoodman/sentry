import request from 'request-promise'

const debug = require('debug')('sentry:routes:auth:cobot:callback')

export default async (req, res) => {
  if (!req.query || !req.query.code) {
    return res.sendStatus(400)
  }

  const code = req.query.code

  debug('received cobot auth code', code)

  // Request an access token.
  let response
  try {
    response = await request({
      qs: {
        client_id: res.locals.config.COBOT_CLIENT_ID,
        client_secret: res.locals.config.COBOT_CLIENT_SECRET,
        code,
        grant_type: 'authorization_code',
      },
      method: 'POST',
      json: true,
      uri: 'https://www.cobot.me/oauth/access_token',
    })
  } catch(err) {
    // TODO: better handling
    console.error(err.stack)
    return res.send(err)
  }

  debug('response from access token request', response)

  const accessToken = response.access_token

  //
  res.send(accessToken)
}
