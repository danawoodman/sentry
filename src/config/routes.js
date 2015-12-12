import basicAuth from '../middlewares/basic-auth'
import wrap from '../lib/express-async-wrapper'
import {
  ADMIN_PASSWORD,
  ADMIN_USERNAME,
  NODE_ENV,
} from './config'

export default (app) => {

  // In production, secure application behind
  // HTTP basic auth.
  if (NODE_ENV === 'production') {
    app.use('*', basicAuth(ADMIN_USERNAME, ADMIN_PASSWORD))
  }

  // Cobot authentication
  app.get('/auth/cobot/login', wrap(require('../routes/auth/cobot/login').default))
  app.get('/auth/cobot/callback', wrap(require('../routes/auth/cobot/callback').default))

  // Memberships
  app.get('/memberships/update', wrap(require('../routes/memberships/update').default))

  // Default route.
  app.get('/', wrap(require('../routes/home').default))
}
