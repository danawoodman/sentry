export default (req, res) => {
  const clientId = res.locals.config.COBOT_CLIENT_ID
  const appUrl = res.locals.config.APP_URL
  const redirectUrl = `https://www.cobot.me/oauth/authorize?response_type=code&client_id=${COBOT_CLIENT_ID}&redirect_uri=${APP_URL}/auth/cobot/callback&state=foobar&scope=read_memberships`

  res.redirect(redirectUrl)
}
