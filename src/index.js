import chalk from 'chalk'
import express from 'express'
import fs from 'fs'
import mongoose from 'mongoose'
import path from 'path'
import {
  MODELS_PATH,
  MONGO_URI,
  PORT,
} from './config/config'

const app = express()
const debug = require('debug')('sentry:index')

// Handle process exceptions.
process.on('unhandledRejection', (reason, p) => {
  console.error(reason.stack)
})

// Bootstrap models
fs.readdirSync(MODELS_PATH)
  .filter(file => file.includes('.js'))
  .forEach(file => require(path.join(MODELS_PATH, file)))

// Configure express.
require('./config/express').default(app)

// Bootstrap routes.
require('./config/routes').default(app)

// Run the app server.
const listen = () => {
  const server = app.listen(PORT, () => {
    const host = server.address().address
    const port = server.address().port
    console.log(chalk.green('Sentry app listening at'),
                chalk.blue.underline(`http://${host}:${port}`))
  })
}

// Connect to mongo.
const connect = () => {
  const options = {}
  console.log(chalk.green('Connecting to MongoDB at URI:'),
              chalk.blue.underline(MONGO_URI))
  return mongoose.connect(MONGO_URI, options).connection
}

// Connect to mongo, then fire up the server.
connect()
  .on('error', console.error)
  .on('disconnected', connect)
  .once('open', listen)
