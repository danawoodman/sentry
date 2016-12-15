import pad from 'multipad'
import Particle from 'particle-api-js'
import pickRandom from 'pick-random'
import request from 'request-promise'
import { COBOT_SUBDOMAIN } from '../../config/config'

const particle = new Particle()
const Checkin = require('mongoose').model('Checkin')
const Membership = require('mongoose').model('Membership')

function welcomeMessage(member) {
  const { name } = member
  const greetings = [
    [ 'Howdy', name ],
    [ 'Why hello', name ],
    [ 'Ciao', name ],
    [ 'Come on in', name ],
    [ 'I love you', name ],
    [ name, 'looking hot!' ],
    [ 'You rock', name ],
    [ 'Hola', name ],
  ]
  // Pick message and center text.
  let message = pickRandom(greetings)[0]
  message = message.map((msg) => pad.center(msg, 16, ' ')).join('\n')

  console.log('[checkin] Welcome message:', message)

  return message
}

export default async (req, res) => {

  // Immediately return for Particle
  res.sendStatus(200)

  console.log('[checkin] Request body:', req.body)

  // Hack because cards start with 0's but
  // the Arduino app has them stripped off.
  // RFID card numbers are 10 characters long
  const accessToken = pad.left(req.body.data, 10, '0')

  console.log('[checkin] Access token:', accessToken)

  const member = await Membership.findOne({ accessToken })

  console.log('[checkin] Found member:', member)

  const auth = req.currentAccount.particleAccessToken

  if (member) {

    console.log('[checkin] Card accepted:', accessToken)

    await particle.publishEvent({
      name: 'sentry/allow',
      data: welcomeMessage(member),
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

    console.error('[checkin] Card denied:', accessToken)

    await particle.publishEvent({
      name: 'sentry/deny',
      data: {},
      auth,
    })
  }

  // TODO: log checkin in cobot
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
