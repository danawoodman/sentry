export default async (req, res) => {
  await req.currentAccount.update({ particleAccessToken: null })
  req.flash('info', 'You have been logged out of Particle.')
  res.redirect('/devices')
}
