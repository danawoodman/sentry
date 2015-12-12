import request from 'request-promise'

const debug = require('debug')('sentry:routes:memberships:update')
const Membership = require('mongoose').model('Membership')

export default async (req, res) => {

  const config = res.locals.config
  const subdomain = config.COBOT_SUBDOMAIN
  const staffPlans = config.COBOT_STAFF_PLANS
  const unlimitedPlans = config.COBOT_UNLIMITED_PLANS

  // TODO: Move to cobot lib
  const accessToken = req.currentAccount.cobotAccessToken
  const memberships = await request({
    headers: {
      'Authorization': `Bearer ${accessToken}`,
    },
    json: true,
    qs: {
      all: true,
    },
    uri: `https://${subdomain}.cobot.me/api/memberships`,
  })

  debug('list of memberships', memberships)

  // For every member, find or update the member in our local
  // database and figure out their current status.
  // TODO: Move to lib/helper
  const members = await* memberships.map(async (membership) => {

    debug('adding/updating member', membership)

    const cobotId = membership.id
    let active = false
    const name = membership.name
    const staff = staffPlans.includes(membership.plan.name)
    const unlimitedAccess = unlimitedPlans.includes(membership.plan.name)
    let availableCredits = null

    if (membership.time_passes) {
      debug('user has time passes', cobotId)

      const allCredits = await request({
        json: true,
        uri: `https://${subdomain}.cobot.me/api/memberships/${membership.id}/time_passes/unused`,
      })

      availableCredits = allCredits.length

      debug('available credits', availableCredits)
    }

    // Indicate if the person is considered active.
    // TODO: get their membership status somehow
    if (staff || unlimitedAccess || availableCredits > 0) {
      active = true
    }

    return await Membership.update(
      { cobotId },
      {
        active,
        availableCredits,
        name,
        staff,
        unlimitedAccess,
      },
      { upsert: true }
    )
  })

  req.flash('info', `${members.length} memberships updated`)
  res.redirect('/')
}
