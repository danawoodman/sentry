import spark from 'spark'

const debug = require('debug')('sentry:routes:devices:flash')

export default async (req, res) => {

  const deviceId = req.params.deviceId
  const FIRMWARE_FILE_PATHS = res.locals.config.FIRMWARE_FILE_PATHS
  if (!deviceId ||
      !FIRMWARE_FILE_PATHS ||
      !req.currentAccount ||
      !req.currentAccount.particleAccessToken) {
    req.flash('danger', `Could not flash device ${deviceId}`)
    return res.redirect('/devices')
  }

  debug('beginning flash of device', deviceId)
  debug('path to particle installer file', FIRMWARE_FILE_PATHS)

  const accessToken = req.currentAccount.particleAccessToken
  spark.login({ accessToken })

  debug('logged into Particle')

  const device = await spark.getDevice(deviceId)
  device.flash(FIRMWARE_FILE_PATHS)

  req.flash('success', `Flashing of device ${deviceId} started`)
  res.redirect('/devices')
}
