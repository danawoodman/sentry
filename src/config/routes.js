import basicAuth from '../middlewares/basic-auth'
import {
  ADMIN_PASSWORD,
  ADMIN_USERNAME,
  NODE_ENV,
} from './config'

export default (app) => {
  if (NODE_ENV === 'production') {
    app.use('*', basicAuth(ADMIN_USERNAME, ADMIN_PASSWORD))
  }
  app.get('/', require('../routes/home').default)
  app.get('/auth/cobot/login', require('../routes/auth/cobot/login').default)
  app.get('/auth/cobot/callback', require('../routes/auth/cobot/callback').default)
}
