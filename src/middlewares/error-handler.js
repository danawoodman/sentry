import chalk from 'chalk'
import logger from 'lib/logger'

export default (err, req, res, next) => {

  // Set 500 error as default status code
  if (!res.statusCode || res.statusCode === 200) {
    res.status(500)
  }

  const code = res.statusCode
  const message = err.message || 'Unknown error'

  logger.error(
    '[middleware/error-handler] Error',
    `[${res.statusCode}]`,
    err.message,
    chalk.reset('\n', err.stack)
  )

  // TODO: Should not log stack traces in production!
  res.format({

    json() {
      res.json({
        code,
        error: message,
      })
    },

    //html() {
      ////res.send('<h1>Error ' + code + ': ' + err.message + '</h1>')

      //// Not found
      //if (code === 404) {
        //return res.render('404.hbs', { message })
      //}

      //// Not authorized
      //if (code === 401) {
        //// TODO: Should send to login page with prompt/flash
        //return res.redirect('/')
      //}

      //// Everything else...
      //res.render('500.hbs', { message })
    //},

    default() {
      res.send('Error ' + code + ': ' + message)
    },
  })
}
