import spark from 'spark'

const debug = require('debug')('sentry:routes:devices:flash')

export default async (req, res) => {

  const deviceId = req.params.deviceId
  const INSTALLER_PATH = res.locals.config.INSTALLER_PATH
  if (!deviceId ||
      !INSTALLER_PATH ||
      !req.currentAccount ||
      !req.currentAccount.particleAccessToken) {
    req.flash('danger', `Could not flash device ${deviceId}`)
    return res.redirect('/devices')
  }

  debug('beginning flash of device', deviceId)
  debug('path to particle installer file', INSTALLER_PATH)

  const accessToken = req.currentAccount.particleAccessToken
  spark.login({ accessToken })

  debug('logged into Particle')

  await spark.flashCore(deviceId, [ INSTALLER_PATH ])

  req.flash('success', `Flashing of device ${deviceId}`)
  res.redirect('/devices')
}
