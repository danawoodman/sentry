const Checkin = require('mongoose').model('Checkin')

export default async (req, res) => {
  const checkins = await Checkin.where({}).sort('-createdAt')
  res.render('checkins/list.jade', { checkins })
}
