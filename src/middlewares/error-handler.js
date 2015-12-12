export default () => {
  return (error, req, res, next) => {

    // Set 500 error as default status code
    if (!res.statusCode || res.statusCode === 200) {
      res.status(500)
    }

    const code = res.statusCode
    const message = error.message || 'Unknown error'

    console.error(
      '[middleware/error-handler] Error',
      `[${res.statusCode}]`,
      error.message,
      '\n',
      error.stack
    )

    // TODO: Should not log stack traces in production!
    res.format({

      json() {
        res.json({
          code,
          error: message,
        })
      },

      html() {
        //res.send('<h1>Error ' + code + ': ' + error.message + '</h1>')

        // Not found
        if (code === 404) {
          return res.render('404.jade', { message, error })
        }

        // Not authorized
        if (code === 401) {
          // TODO: Should send to login page with prompt/flash
          req.flash('danger', 'You aren\'t authorized there buddy, try again...')
          return res.redirect('/')
        }

        // Everything else...
        res.render('500.jade', { message, error })
      },

      default() {
        res.send('Error ' + code + ': ' + message)
      },
    })
  }
}
