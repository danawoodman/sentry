//import bodyParser from 'body-parser'
import cookieSession from 'cookie-session'
import currentAccount from '../middlewares/current-account'
import express from 'express'
import flash from 'express-flash'
import sassMiddleware from 'node-sass-middleware'
import templateLocals from '../middlewares/template-locals'
import * as config from './config'

export default (app) => {

  const notProduction = config.NODE_ENV !== 'production'

  // Make configuration available in routes.
  app.use((req, res, next) => {
    res.locals.config = config
    next()
  })

  // View configuration.
  app.set('views', config.VIEWS_PATH)
  app.set('view engine', 'jade')

  // Handle static files and assets.
  app.use(sassMiddleware({
    debug: notProduction,
    dest: config.PUBLIC_PATH,
    force: notProduction,
    outputStyle: notProduction ?  'nested' : 'compressed',
    src: config.ASSETS_PATH,
  }))
  app.use(express.static(config.PUBLIC_PATH, {}))

  app.use(cookieSession({
    name: 'sentry:session',
    secret: config.COOKIE_SECRET,
  }))
  app.use(flash())

  app.use(currentAccount())
  app.use(templateLocals())
  //const account = await Account.findOne({})

  //app.use(bodyParser.urlencoded({ extended: true }))
}
