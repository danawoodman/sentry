const Membership = require('mongoose').model('Membership')

export default async (req, res) => {
  const memberships = await Membership.where({})
  res.render('memberships/list', { memberships })
}
