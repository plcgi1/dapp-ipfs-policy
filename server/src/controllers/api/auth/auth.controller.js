const ethUtil = require('ethereumjs-util')
const sigUtil = require('eth-sig-util')
const { genNonce } = require('../../../helpers/nonce')
const UserProvider = require('../../../providers/user.provider')
const AuthProvider = require('../../../providers/auth.provider')
const { handleError } = require('../../../helpers/errors')
const { USER_STATUSES } = require('../../../helpers/enums')
const logger = require('../../../helpers/logger')
const label = 'auth.controller'

exports.create = async (req, res) => {
  const { signature, publicAddress } = req.body

  // TODO move to joi
  if (!publicAddress) {
    return handleError(res, { message: 'Request should have publicAddress.' }, 400)
  }

  const userProvider = new UserProvider()
  const authProvider = new AuthProvider()

  let user = await userProvider.getByAddress(publicAddress)

  if (!user) {
    user = await userProvider.create({ publicAddress, status: USER_STATUSES.waiting, nonce: genNonce() })
    return res.json(user)
  }
  if (!signature) {
    return handleError(res, { message: 'Request should have signature.' }, 400)
  }
  const msg = `I am signing my one-time nonce: ${user.nonce}`

  // We now are in possession of msg, publicAddress and signature. We
  // will use a helper from eth-sig-util to extract the address from the signature
  const msgBufferHex = ethUtil.bufferToHex(Buffer.from(msg, 'utf8'));
  const address = sigUtil.recoverPersonalSignature({
    data: msgBufferHex,
    sig: signature
  })

  // The signature verification is successful if the address found with
  // sigUtil.recoverPersonalSignature matches the initial publicAddress
  if (address.toLowerCase() !== publicAddress.toLowerCase()) {
    return handleError(res, { message: `Signature verification failed` }, 401)
  }

  user.nonce = genNonce()
  user.status = USER_STATUSES.ready

  await user.save()

  const accessToken = authProvider.createToken(user)

  return res.json({ accessToken, nonce: user.nonce, publicAddress: user.publicAddress })
}

exports.logout = async (req, res, next) => {
  const { user } = req

  try {
    user.nonce = genNonce()

    await user.save()

    req.user = user

    return res.json({})
  } catch (error) {
    return handleError(res, error, 500)
  }
}
