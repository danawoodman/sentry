import updateMemberships from '../../lib/update-memberships'

const debug = require('debug')('sentry:routes:memberships:update')

export default async (req, res) => {
  const memberships = await updateMemberships(req.currentAccount)
  req.flash('success', `${memberships.length} memberships updated`)
  res.redirect('/')
}
