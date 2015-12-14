import _ from 'lodash'
import request from 'request-promise'
import mongoose from 'mongoose'
import * as config from '../config/config'

const debug = require('debug')('sentry:lib:update-memberships')

export default async (account) => {

  debug('updating memberships for account', account)

  const Membership = mongoose.model('Membership')
  const accountId = account.id
  const subdomain = config.COBOT_SUBDOMAIN
  const staffPlans = config.COBOT_STAFF_PLANS
  const unlimitedPlans = config.COBOT_UNLIMITED_PLANS
  const accessToken = account.cobotAccessToken

  debug('cobot subdomain', subdomain)

  // TODO: Move to cobot lib
  const tokens = await request({
    headers: { 'Authorization': `Bearer ${accessToken}` },
    json: true,
    uri: `https://${subdomain}.cobot.me/api/check_in_tokens`,
  })

  debug('list of checkin tokens', tokens)

  // TODO: Move to cobot lib
  const memberships = await request({
    headers: { 'Authorization': `Bearer ${accessToken}` },
    json: true,
    qs: { all: true },
    uri: `https://${subdomain}.cobot.me/api/memberships`,
  })

  debug('list of memberships', memberships)

  // If we've gotten this far, wipe the existing list of memberships
  // so we have a fresh list. If we don't do this, then there could
  // be orphan memberships that were removed from Cobot but are
  // still in our system.
  await Membership.remove({ accountId })

  // For every member, find or update the member in our local
  // database and figure out their current status.
  // TODO: Move to lib/helper
  const membersWithTokens = await* tokens.map(async (token) => {

    const membership = _.findWhere(memberships, {
      id: token.membership.id,
    })

    if (!membership) {
      return null
    }

    debug('creating membership', membership)

    const cobotId = membership.id
    let active = false
    const name = membership.name
    const plan = membership.plan.name
    const staff = staffPlans.includes(plan)
    const unlimitedAccess = unlimitedPlans.includes(plan)
    let availableCredits = null

    if (membership.time_passes) {

      debug('user has time passes', cobotId)

      // Fetch all the membership's unused time passes.
      const allCredits = await request({
        json: true,
        uri: `https://${subdomain}.cobot.me/api/memberships/${cobotId}/time_passes/unused`,
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
        accessToken: token.token,
        accountId,
        active,
        availableCredits,
        name,
        plan,
        staff,
        unlimitedAccess,
      },
      { upsert: true }
    )
  })

  // Clean out any blank records.
  return _.pull(membersWithTokens, null)
}
