const passport = require('passport')
const passportJWT = require('passport-jwt')
const JWTStrategy = passportJWT.Strategy
const ExtractJWT = passportJWT.ExtractJwt
const config = require('./environment')
const { User } = require('../src/models')
const logger = require('../src/helpers/logger')
const { JWT_USER_ATTRIBUTES } = ['id', 'publicAddress', 'nonce']
const label = 'middlewares.passport'

passport.serializeUser((user, done) => {
  return done(null, user.id)
})

passport.deserializeUser((id, done) => {
  return User.findByPk(id, {attributes: JWT_USER_ATTRIBUTES})
    .then(user => {
      return done(null, user)
    })
    .catch(err => {
      logger.error(`${label}.deserializeUser err: %o`, err)
      return done(err, null)
    })
})

passport.use(
  'jwt',
  new JWTStrategy(
    {
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.secrets.jwt
    },
    (jwtPayload, done) => {
      return User.findOne({
        where: { id: jwtPayload.id, nonce: jwtPayload.nonce },
        attributes: JWT_USER_ATTRIBUTES
      })
        .then(user => {
          return done(null, user)
        })
        .catch(error => {
          logger.error(`${label}.passport.use(jwt) err: %o`, error)
          return done(error, null)
        })
    }
  )
)

module.exports = passport
