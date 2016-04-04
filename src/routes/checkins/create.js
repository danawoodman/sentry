import request from 'request-promise'
import { COBOT_SUBDOMAIN } from '../../config/config'

const debug = require('debug')('sentry:routes:checkins:create')

export default async (req, res) => {

  debug('checkin', req.body)
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

  res.status(200)
}
