/**
 * Express configuration
 */

const log4js = require('log4js')

const path = require('path')

const compression = require('compression')

const bodyParser = require('body-parser')

const methodOverride = require('method-override')

const cookieParser = require('cookie-parser')

const cors = require('cors')

const errorHandler = require('errorhandler')

const limit = require('express-better-ratelimit')

const config = require(path.resolve('./config/environment'))

const passport = require(path.resolve('./config/passport'))

module.exports = (app) => {
  const env = app.get('env')

  app.use(cors({ exposedHeaders: 'X-Total-Count' }))

  // rate limit
  app.use(limit({
    // 30 seconds
    duration: 30000,
    // requests to server
    max: 300
    // blackList: ['192.168.1.1']
  }))

  app.use(compression())

  // content negotiation
  app.use(bodyParser.urlencoded({ extended: false }))

  app.use(bodyParser.json())

  app.use(methodOverride())

  app.use(cookieParser())

  app.use(passport.initialize())
  app.use(passport.session())

  log4js.configure(config.log4js)

  let logger

  if (env === 'production') {
    logger = log4js.getLogger('file')

    app.use(log4js.connectLogger(logger, { level: log4js.levels.INFO }))
  }

  if (env === 'development' || env === 'test') {
    log4js.configure(config.log4js)

    logger = log4js.getLogger('console')

    app.use(log4js.connectLogger(logger, { level: log4js.levels.INFO }))
  }
  app.use(errorHandler())
}
