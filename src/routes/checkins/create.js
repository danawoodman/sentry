import leftPad from 'left-pad'
import request from 'request-promise'
import Particle from 'particle-api-js'
import { COBOT_SUBDOMAIN } from '../../config/config'

const particle = new Particle()
const Checkin = require('mongoose').model('Checkin')
const Membership = require('mongoose').model('Membership')

const debug = require('debug')('sentry:routes:checkins:create')

export default async (req, res) => {

  // Immediately return for Particle
  res.sendStatus(200)

  console.log('body', req.body)
  debug('checkin', req.body)

  // Hack because cards start with three 0's but
  // the Arduino app has them stripped off.

  const accessToken = leftPad(req.body.data, 10, '0')

  const member = await Membership.findOne({ accessToken })
  console.log('member', member)

  const auth = req.currentAccount.particleAccessToken

  if (member) {
    // Let them in!
    await particle.publishEvent({
      name: 'sentry/allow',
      data: {},
      auth,
    })

    const checkin = await Checkin.create({
      accessToken,
      cobotId: member.cobotId,
      memberId: member.id,
      memberName: member.name,
      memberPlan: member.plan,
    })
  } else {
    // Lock them out.
    await particle.publishEvent({
      name: 'sentry/deny',
      data: {},
      auth,
    })
  }

  //{
    //"eventName": "Your event name",
    //"data": "Your event contents",
    //"published_at": "When it was published",
    //"coreid": "Your device ID"
  //}
  //const memberId =
  //const accessToken = req.currentAccount.cobotAccessToken
  //const tokens = await request({
    //headers: { 'Authorization': `Bearer ${accessToken}` },
    //method: 'POST',
    //json: true,
    //uri: `https://${COBOT_SUBDOMAIN}.cobot.me/api/memberships/${memberId}/work_sessions`,
  //})

}
