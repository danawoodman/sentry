export default async (req, res) => {
  await req.currentAccount.update({ cobotAccessToken: null })
  req.flash('info', 'You have been logged out of Cobot.')
  res.redirect('/')
}
