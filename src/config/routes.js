import basicAuth from '../middlewares/basic-auth'
import wrap from '../lib/express-async-wrapper'
import {
  ADMIN_PASSWORD,
  ADMIN_USERNAME,
  NODE_ENV,
} from './config'

export default (app) => {

  // Hooks
  // TODO: need to authenticate this route
  app.post('/hooks/checkin', wrap(require('../routes/checkins/create').default))

  // In production, secure application behind
  // HTTP basic auth.
  if (NODE_ENV === 'production') {
    app.use('*', basicAuth(ADMIN_USERNAME, ADMIN_PASSWORD))
  }

  // Cobot authentication
  app.get('/auth/cobot/login', require('../routes/auth/cobot/login').default)
  app.get('/auth/cobot/logout', wrap(require('../routes/auth/cobot/logout').default))
  app.get('/auth/cobot/callback', wrap(require('../routes/auth/cobot/callback').default))

  // Particle login
  app.post('/auth/particle/login', wrap(require('../routes/auth/particle/login').default))
  app.get('/auth/particle/logout', wrap(require('../routes/auth/particle/logout').default))

  // Memberships
  app.get('/memberships/update', wrap(require('../routes/memberships/update').default))

  // Devices
  app.get('/devices', wrap(require('../routes/devices/list').default))
  app.post('/devices/:deviceId/flash', wrap(require('../routes/devices/flash').default))
  app.get('/devices/publish', wrap(require('../routes/devices/publish').default))

  // Checkins
  app.get('/checkins', wrap(require('../routes/checkins/list').default))

  // Default route.
  app.get('/', wrap(require('../routes/memberships/list').default))
}
