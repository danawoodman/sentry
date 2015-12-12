/**
 * Load up all models in the model directory
 * and require them.
 */

import fs from 'fs'
import path from 'path'
import { MODELS_PATH } from '../config/config'

export default () => {
  fs.readdirSync(MODELS_PATH)
    .filter(file => file.includes('.js'))
    .forEach(file => require(path.join(MODELS_PATH, file)))
}
