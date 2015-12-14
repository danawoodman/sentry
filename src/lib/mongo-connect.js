/**
 * Connect to mongo and return the connection.
 */

import chalk from 'chalk'
import fs from 'fs'
import mongoose from 'mongoose'
import path from 'path'
import { MODELS_PATH, MONGO_URI } from '../config/config'

export default (options = {}) => {

  // Load up all the models.
  fs.readdirSync(MODELS_PATH)
    .filter(file => file.includes('.js'))
    .forEach(file => require(path.join(MODELS_PATH, file)))

  console.log(chalk.gray('Connecting to MongoDB at URI:'),
              chalk.underline(MONGO_URI))

  return mongoose.connect(MONGO_URI, options).connection
}
