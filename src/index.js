import chalk from 'chalk'
import connect from './lib/mongo-connect'
import errorHandler from './middlewares/error-handler'
import express from 'express'
import { PORT } from './config/config'

const app = express()
const debug = require('debug')('sentry:index')

// Handle process exceptions.
process.on('unhandledRejection', (reason, p) => {
  console.error(reason.stack)
})

// Bootstrap models
require('./lib/bootstrap-models').default()

// Configure express.
require('./config/express').default(app)

// Bootstrap routes.
require('./config/routes').default(app)

// Error handling. This has to be at the
// end to catch errors.
app.use(errorHandler())

// Run the app server.
const listen = () => {
  const server = app.listen(PORT, () => {
    const host = server.address().address
    const port = server.address().port
    console.log(chalk.green('Sentry app listening at'),
                chalk.blue.underline(`http://${host}:${port}`))
  })
}

// Connect to mongo, then fire up the server.
connect()
  .on('error', console.error)
  .on('disconnected', connect)
  .once('open', listen)
