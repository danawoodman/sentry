import spark from 'spark'

const debug = require('debug')('sentry:routes:devices:list')

export default async (req, res) => {

  let devices = []
  if (req.currentAccount && req.currentAccount.particleAccessToken) {
    spark.login({ accessToken: req.currentAccount.particleAccessToken })
    devices = await spark.listDevices()
  }

  debug('devices in particle', devices)

  res.render('devices/list', { devices })
}
