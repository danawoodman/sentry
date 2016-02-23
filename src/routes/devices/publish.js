import _ from 'lodash'
import spark from 'spark'

const debug = require('debug')('sentry:routes:devices:publish')
const Membership = require('mongoose').model('Membership')

export default async (req, res) => {

  const accessToken = req.currentAccount.particleAccessToken
  spark.login({ accessToken })

  debug('logged into Particle')

  const memberships = await Membership.where({}).sort('name')

  debug('memberships', memberships)

  const csv = memberships.map((m) => {
    const token = m.accessToken
    const status = 1
    const message = 'Hello'
    return `${token}\t${status}\t${message}`
  })

  debug('csv', csv)

  const chunks = _.chunk(csv, 10)

  debug('chunks', chunks)

  // Clear out existing members
  await spark.publishEvent('sentry/wipe-members')

  // Buffer the list of members so the device doesn't
  // crash.
  await Promise.all(chunks.map(async (chunk) => {
    return await spark.publishEvent('sentry/append-members', chunk.join('\n'))
  }))

  req.flash('success', `Updating all devices with ${memberships.length} memberships`)
  res.redirect('/devices')
}
