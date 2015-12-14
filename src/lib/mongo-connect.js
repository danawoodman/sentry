/**
 * Connect to mongo and return the connection.
 */

import bootstrapModels from './bootstrap-models'
import chalk from 'chalk'
import mongoose from 'mongoose'
import { MONGO_URI } from '../config/config'

export default (options = {}) => {

  // Load up all the models.
  bootstrapModels()

  console.log(chalk.green('Connecting to MongoDB at URI:'),
              chalk.blue.underline(MONGO_URI))

  return mongoose.connect(MONGO_URI, options).connection
}
