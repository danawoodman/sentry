/**
 * Connect to mongo and return the connection.
 */

import chalk from 'chalk'
import mongoose from 'mongoose'
import { MONGO_URI } from '../config/config'

export default (options = {}) => {
  console.log(chalk.green('Connecting to MongoDB at URI:'),
              chalk.blue.underline(MONGO_URI))
  return mongoose.connect(MONGO_URI, options).connection
}
