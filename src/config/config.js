import path from 'path'

require('dotenv').load()

const env = process.env

export const NODE_ENV = env.NODE_ENV || 'development'
export const PORT = env.PORT || 5555
export const APP_URL = env.APP_URL || `http://localhost:${PORT}`
export const COOKIE_SECRET = env.COOKIE_SECRET || 'super duper sekret!'

// Authentication
export const ADMIN_USERNAME = env.ADMIN_USERNAME || 'admin'
export const ADMIN_PASSWORD = env.ADMIN_PASSWORD || 'password'

// Paths
export const VIEWS_PATH = path.join(__dirname, '..', 'views')
export const MODELS_PATH = path.join(__dirname, '..', 'models')
export const PUBLIC_PATH = path.join(__dirname, '..', '..', 'public')
export const ASSETS_PATH = path.join(__dirname, '..', 'assets')

// Cobot
export const COBOT_SUBDOMAIN = env.COBOT_SUBDOMAIN
export const COBOT_CLIENT_ID = env.COBOT_CLIENT_ID
export const COBOT_CLIENT_SECRET = env.COBOT_CLIENT_SECRET
export const COBOT_STAFF_PLANS = ['Staff Member']
export const COBOT_UNLIMITED_PLANS = ['Basic Member']

// Mongo
export const MONGO_URI = env.MONGO_URI || env.MONGOLAB_URI || 'mongodb://localhost/sentry'
