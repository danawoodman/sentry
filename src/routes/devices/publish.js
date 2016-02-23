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
    const status = 1 // TODO: expired members should be 0!
    const line1 = '   Welcome in   '

    // Get a centered first name. Hacky but works
    const lineLength = 16
    const first = m.name.split(' ')[0]
    const leftover = lineLength - first.length
    const left = Math.floor(leftover / 2)
    const leftSpaces = Array(left).join(' ')
    const right = leftover - left
    const rightSpaces = Array(right).join(' ')
    const line2 = leftSpaces + first + rightSpaces

    return `${token}\t${status}\t${line1}\t${line2}`
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
