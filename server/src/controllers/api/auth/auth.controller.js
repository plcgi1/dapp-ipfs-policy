const UserProvider = require('../../../providers/user.provider')
const AuthProvider = require('../../../providers/auth.provider')
const config = require('../../../../config/environment')
const { handleError } = require('../../../helpers/errors')
const logger = require('../../../helpers/logger')
const label = 'auth.controller'

exports.challenge = async (req, res) => {
  return res.send(req.metaAuth.challenge)
}

exports.challengeLogin = async (req, res) => {
  // TODO address in query required
  if (req.metaAuth.recovered) {
    const userProvider = new UserProvider()
    const user = await userProvider.getByAddress(req, { scope: 'jwt' })

    // Signature matches the cache address/challenge
    // Authentication is valid, assign JWT, etc.
    return res.send(req.metaAuth.recovered);
  } else {
    // Sig did not match, invalid authentication
    return res.status(400).send();
  }
}

exports.login = async (req, res) => {
  const userProvider = new UserProvider()
  const authProvider = new AuthProvider()

  const { body } = req
  const { email, password } = body

  try {
    const user = await userProvider.getByEmail(email, { scope: 'jwt' })
    if (!user) {
      return handleError(res, { message: 'No such user.' }, 404)
    }

    const passwordIsOk = await authProvider.comparePassword(password, user.encrypted_password)

    if (!passwordIsOk) {
      return handleError(res, { message: 'Password is not correct.' }, 401)
    }
    user.lastJwtString = authProvider.generateRandomString()

    await user.save()

    const result = user.toJSON()

    result.token = authProvider.createToken(user)

    delete result.encrypted_password

    return res.json(result)
  } catch (error) {
    return handleError(res, error, 500)
  }
}

exports.logout = async (req, res, next) => {
  const { user } = req

  const authProvider = new AuthProvider()
  try {
    user.lastJwtString = authProvider.generateRandomString()

    await user.save()

    req.user = user

    return res.json({})
  } catch (error) {
    return handleError(res, error, 500)
  }
}
