import _ from 'lodash'

const Checkin = require('mongoose').model('Checkin')

function checkinsByMember(checkins) {
  let byMember = _.groupBy(checkins, 'memberName')

  byMember = _.map(byMember, (checkins, name) => {
    return {
      name,
      checkins,
    }
  })

  byMember = _.sortBy(byMember, (member) => {
    return -member.checkins.length
  })

  return byMember
}

export default async (req, res) => {
  const checkins = await Checkin.where({}).sort('-createdAt')
  const memberCheckins = checkinsByMember(checkins)
  res.render('checkins/list.jade', { checkins, memberCheckins })
}
