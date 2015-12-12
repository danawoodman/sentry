export default (req, res) => {
  const clientId = res.locals.config.COBOT_CLIENT_ID
  const appUrl = res.locals.config.APP_URL
  const redirectUrl = `https://www.cobot.me/oauth/authorize?response_type=code&client_id=${clientId}&redirect_uri=${appUrl}/auth/cobot/callback&state=foobar&scope=read_memberships`

  res.redirect(redirectUrl)
}
